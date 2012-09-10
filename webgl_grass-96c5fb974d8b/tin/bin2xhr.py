'''
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
'''

import sys, struct
from ctypes import c_float, c_ushort, memmove, string_at, sizeof
from cjson import encode

filename = sys.argv[1]

data = open(filename, 'rb').read()
isize = struct.unpack('I', data[:4])[0]
data = data[4:]
indices = data[:isize*2]
ibuffer = (c_ushort*isize)()
memmove(ibuffer, indices, len(indices))

data = data[isize*2:]
vsize = struct.unpack('I', data[:4])[0]
vertices = data[4:]
vbuffer = (c_float*vsize)()
memmove(vbuffer, vertices, len(vertices))
vresult = (c_float*((vsize*3)/4))()
for i in xrange(vsize/4):
    vresult[i*3:i*3+3] = vbuffer[i*4:i*4+3]
data = {
    'indices': list(ibuffer),
    'position_3f': list(vresult),
}
open('terrain.mesh', 'w').write(encode(data))
