'''
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
'''

from mesh import Mesh
from pyglet.gl import GL_TRIANGLES
import random

def key(v1, v2):
    return tuple(sorted((v1, v2)))

def get_edges(faces):
    result = set()
    for face in faces:
        result.add(key(face.v1, face.v2))
        result.add(key(face.v2, face.v3))
        result.add(key(face.v3, face.v1))
    return result
    
def face_area(v1, v2, v3):
    vec1 = v2-v1
    vec2 = v3-v1
    #vec1.y = 0.0
    #vec2.y = 0.0
    return min(0.01, vec1.cross(vec2).length)

class Split(object):
    def __init__(self, mesh, heightfield, v1, v2):
        self.heightfield = heightfield
        self.mesh = mesh
        self.v1 = v1
        self.v2 = v2
        self.faces = v1.faces & v2.faces

        length = (v1-v2).length
      
        center_vec = v2-v1
        centers = []
        for i in xrange(5, 15):
            center = v1 + center_vec * (i/20.0)
            center.y = heightfield[center.x, center.z]
            error = self.get_error(center)
            centers.append((error, center))
        centers.sort()
        error2, self.center = centers[0]
        '''
        self.center = (v1+v2)/2.0
        self.center.y = heightfield[self.center.x, self.center.z]
        '''

        area = 0.0
        divlength = 0.0
        for face in self.faces:
            area += face_area(face.v1, face.v2, face.v3)
            divlength += (face.other(self.v1, self.v2)-self.center).length
        divlength /= len(self.faces)

        center = (v1+v2)/2.0
        error1 = self.get_error(center)
        self.performance = (error1**1.6)*area**0.7*(length**2.0/divlength**0.75)
    
    def get_error(self, center):
        height = self.heightfield[center.x, center.z]
        center_error = abs(center.y - height)*3.0
        error = self.edge_error(self.v1, center) + self.edge_error(self.v2, center) + center_error

        perface = 0.0
        for face in self.faces:
            n1, n2 = face.opposite(self.v1)
            perface += self.face_error(n1, n2, center)
            n1, n2 = face.opposite(self.v2)
            perface += self.face_error(n1, n2, center)

            other = face.other(self.v1, self.v2)
            perface += self.edge_error(center, other)

        return (error + perface/(len(self.faces)*5))/15.0

    def edge_error(self, v1, v2):
        #center = (v1+v2)/2.0
        #return abs(self.heightfield[center.x, center.z] - center.y)
        vec = v2-v1
        p = v1+vec*0.25
        error = abs(self.heightfield[p.x, p.z] - p.y)
        p = v1+vec*0.5
        error += abs(self.heightfield[p.x, p.z] - p.y)
        p = v1+vec*0.75
        error += abs(self.heightfield[p.x, p.z] - p.y)
        return error
        
    def face_error(self, v1, v2, v3):
        center = (v1+v2+v3)/3.0
        return abs(self.heightfield[center.x, center.z] - center.y)

class Splits(object):
    def __init__(self, mesh, heightfield):
        self.mesh = mesh
        self.heightfield = heightfield

        self.splits = {}
        for v1, v2 in get_edges(mesh.faces):
            self.splits[(v1, v2)] = Split(mesh, heightfield, v1, v2)

    def perform(self):
        split = sorted(self.splits.values(), key=lambda split: split.performance)[-1]
        edges = get_edges(split.v1.faces & split.v2.faces)
        center = split.center
        new = self.mesh.vertex(center.x, center.y, center.z)

        for key in edges:
            del self.splits[key]

        for v1, v2 in get_edges(self.mesh.split(split.v1, split.v2, new)):
            split = Split(self.mesh, self.heightfield, v1, v2)
            self.splits[(v1, v2)] = split

class Terrain(object):
    def __init__(self, heightfield):
        mesh = Mesh()
       
        size = 32
        factor = 1.0
        vertices = []

        for z in xrange(size):
            z = float(z)/float(size-1)
            for x in xrange(size):
                x = float(x)/float(size-1)
                y = heightfield[x,z]
                vertices.append(mesh.vertex(x, y, z))

        for y in xrange(size-1):
            for x in xrange(size-1):
                v0 = vertices[(x+1) + (y+1)*size]
                v1 = vertices[(x+1) + (y+0)*size]
                v2 = vertices[(x+0) + (y+0)*size]
                v3 = vertices[(x+0) + (y+1)*size]

                mesh.face(v0, v1, v2)
                mesh.face(v3, v0, v2)

        splits = Splits(mesh, heightfield)
        while len(mesh.verts) < 21840:
        #while len(mesh.verts) < 3000:
            print len(mesh.faces), len(mesh.verts)
            splits.perform()

        mesh.save('mesh.bin')
        self.vbo = mesh.serialize()

    def draw(self):
        self.vbo.draw(GL_TRIANGLES)
