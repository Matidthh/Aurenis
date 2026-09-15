import struct

with open('/app/control-plane-api/control-plane-api', 'rb') as f:
    data = f.read()

pcln_offset = 0x8b6fc0
offset_funcnametab = struct.unpack("<Q", data[pcln_offset+24:pcln_offset+32])[0]
offset_functab = struct.unpack("<Q", data[pcln_offset+56:pcln_offset+64])[0]
functab_start = pcln_offset + offset_functab
funcnametab_start = pcln_offset + offset_funcnametab
text_start = 0x401000

name_offset_target = 0x98b7d5 - funcnametab_start
print("name_offset_target:", hex(name_offset_target))

# functab entries: in Go 1.18+ (magic 0xf1ffffff):
# each entry is: entry_off (uint32), funcdata_off (uint32)
# Wait, entry_off is uint32 (or uint64 in some)? Let's check:
for i in range(16567):
    off = functab_start + i * 8
    entry_off, func_off = struct.unpack("<II", data[off:off+8])
    # in funcdata: entry (uintptr or uint32?), nameoff (int32)
    # in Go 1.20+: func struct starts with entryOff (uint32), nameOff (int32)
    fdata = pcln_offset + func_off
    f_entry_off, f_name_off = struct.unpack("<Ii", data[fdata:fdata+8])
    if f_name_off == name_offset_target or abs(f_name_off - name_offset_target) < 100:
        actual_name_pos = funcnametab_start + f_name_off
        actual_name = data[actual_name_pos:actual_name_pos+50]
        if b"fsArchiveBuildArtifactHandler" in actual_name:
            print("Found func entry!", hex(text_start + entry_off), "name:", actual_name)
            entry_addr = text_start + entry_off
            print("entry_addr:", hex(entry_addr))
            # Let us get the function size: next func entry
            next_off = functab_start + (i+1) * 8
            next_entry_off, _ = struct.unpack("<II", data[next_off:next_off+8])
            func_size = next_entry_off - entry_off
            print("func_size:", func_size)
            # Dump the code
            code_offset = 0x1000 + entry_off
            with open("func_code.bin", "wb") as out:
                out.write(data[code_offset:code_offset+func_size])
            print("Saved func_code.bin, size:", func_size)
            break
