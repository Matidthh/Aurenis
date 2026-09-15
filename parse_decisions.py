import struct

with open('/app/control-plane-api/control-plane-api', 'rb') as f:
    data = f.read()

# Let us find:
# 1) After reading package.json at 0x999a75:
# 0x999be5: Angular (checks angular.json? 0x99a492 "Project %s not found in angular.json")
# 0x99a58e: Next.js (checks "next" in package.json at 0x99a566!)
# 0x99ad4e: Custom server or existing start script (at 0x99ac61 checks "server.js", 0x99acd5 checks "server.ts", 0x99ad1e checks "start"!)
# 0x99b05c: Static framework

# Wait! Look at 0x99a566:
# 0x99a566 is LEA target=0xb89a6a ("next")!
# What happens when "next" matches:
# It executes 0x99a58e:
# "Detected Next.js framework, preparing virtual standalone artifact."
# Then what does it do next?
# Let us trace all string references from 0x99a58e to 0x99ac00!
