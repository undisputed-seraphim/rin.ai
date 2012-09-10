'''
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
'''

from ctypes import c_float, c_char_p, cast, memmove, c_void_p, sizeof
from math import floor, ceil, modf

from os.path import abspath, dirname, join
from ctypes import c_float, c_int, cdll, c_void_p

here = dirname(abspath(__file__))
path = join(here, 'interpolate.so')
lib = cdll.LoadLibrary(path)

get_height = lib.get_height
get_height.argtypes = c_void_p, c_int, c_float, c_float 
get_height.restype = c_float

def clamp(value, low, high):
    return min(max(low, value), high)

class Heightfield(object):
    def __init__(self): 
        buffer_type = (c_float*(4*512*512))
        data = open('data.terrain').read()
        pointer = cast(c_char_p(data), c_void_p)
        source = buffer_type.from_address(pointer.value)
        target = buffer_type()
        memmove(target, source, sizeof(source))
        
        self.heightfield = heightfield = (c_float*(512*512))()

        for i in range(512*512):
            heightfield[i] = target[i*4+3]

    def get(self, x, y):
        return self.heightfield[
            clamp(x, 0, 511) +
            clamp(y, 0, 511) * 512
        ]

    def linear_interpolate(self, v0, v1, v2, v3, x):
        return v1+(v2-v1)*x
   
    def bicubic_interpolate(self, v0, v1, v2, v3, x):
        return (
            pow(x, 0) * v1 +
            pow(x, 1) * (-0.5*v0 + 0.5*v2) +
            pow(x, 2) * (v0 - 2.5*v1 + 2.0*v2 - 0.5*v3) +
            pow(x, 3) * (-0.5*v0 + 1.5*v1 - 1.5*v2 + 0.5*v3)
        )

    def __getitem__(self, (x, y)):
        return get_height(self.heightfield, 512, x, y)

    '''
    def __getitem__(self, (x, y)):
        x = x*511.0
        y = y*511.0

        get = self.get
        interpolate = self.bicubic_interpolate

        x1 = int(x)
        y1 = int(y)

        xf = x-x1
        yf = y-y1

        x = x1
        y = y1
       
        h0 = get(x-1, y-1)
        h1 = get(x+0, y-1)
        h2 = get(x+1, y-1)
        h3 = get(x+2, y-1)
        v0 = interpolate(h0, h1, h2, h3, xf)
        
        h0 = get(x-1, y+0)
        h1 = get(x+0, y+0)
        h2 = get(x+1, y+0)
        h3 = get(x+2, y+0)
        v1 = interpolate(h0, h1, h2, h3, xf)
        
        h0 = get(x-1, y+1)
        h1 = get(x+0, y+1)
        h2 = get(x+1, y+1)
        h3 = get(x+2, y+1)
        v2 = interpolate(h0, h1, h2, h3, xf)
        
        h0 = get(x-1, y+2)
        h1 = get(x+0, y+2)
        h2 = get(x+1, y+2)
        h3 = get(x+2, y+2)
        v3 = interpolate(h0, h1, h2, h3, xf)
        
        return interpolate(v0, v1, v2, v3, yf)
    '''
