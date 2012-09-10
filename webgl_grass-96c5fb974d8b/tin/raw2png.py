'''
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
'''

import Image, sys
from ctypes import string_at, sizeof, byref, c_char_p, cast, c_void_p, POINTER, memmove, c_ubyte, string_at, c_float

if __name__ == '__main__':
    infile = sys.argv[1]
    outfile = sys.argv[2]
    width = 512
    height = 512
    data = open(infile).read()
    src_ptr = cast(c_char_p(data), c_void_p)
    src = (c_float*(4*width*height)).from_address(src_ptr.value)
    image = Image.new('RGBA', (width, height))
    channels = range(3)
    for x in xrange(width):
        for y in xrange(height):
            value = tuple(
                #int(src[(x + y*width) * 4 + c]*128+128)
                int(pow(max(0.0, src[(x + y*width) * 4 + c]), 1.0/2.2)*255.0)
                for c in channels
            )
            value = value+(255,)
            image.putpixel((x,y), value)
    image.save(outfile)
