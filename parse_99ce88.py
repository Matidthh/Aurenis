with open('/app/control-plane-api/control-plane-api', 'rb') as f:
    data = f.read()

import struct

# Look at 0x99ce30 to 0x99ce88:
# 0x99ce30: length 10 (0x0a)
# 0x99ce37: LEA RDX, [RIP + 0x1f1e79] -> 0xb8ecb7 ("server.cjs")
# 0x99ce56: CALL filepath.Join
# 0x99ce88: CALL 0x99dd20
# If 0x99ce88 returns non-zero (error) -> 0x99ce90: 74 5c (je +0x5c, skip error if nil!)
# But if error:
# "failed to add %s to archive: %w"
#
# What function is at 0x99dd20?
# Let us inspect 0x99dd20!
print("Disassembling 0x99dd20...")
