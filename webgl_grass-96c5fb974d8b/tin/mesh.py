'''
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
'''

from gletools import VBO
from ctypes import c_float, c_uint, string_at, sizeof, c_ushort
from struct import pack
from math import sqrt

class Vector(object):
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def __repr__(self):
        return 'Vec(%f %f %f)' % (self.x, self.y, self.z)

    def __add__(self, other):
        return Vector(
            self.x + other.x,
            self.y + other.y,
            self.z + other.z,
        )

    def __sub__(self, other):
        return Vector(
            self.x - other.x,
            self.y - other.y,
            self.z - other.z,
        )

    def __mul__(self, scalar):
        return Vector(
            self.x * scalar,
            self.y * scalar,
            self.z * scalar
        )

    def cross(self, other):
        return Vector(
            self.y*other.z - other.y*self.z,
            self.z*other.x - other.z*self.x,
            self.x*other.y - other.x*self.y,
        )
   
    @property
    def length(self):
        return sqrt(self.x*self.x + self.y*self.y + self.z*self.z)

    def __div__(self, scalar):
        return Vector(
            self.x / scalar,
            self.y / scalar,
            self.z / scalar
        )

class Face(object):
    def __init__(self, v1, v2, v3):
        self.v1 = v1
        self.v2 = v2
        self.v3 = v3

    @property
    def center(self):
        return (self.v1 + self.v2 + self.v3)/3.0

    def replace_vertex(self, v1, v2):
        if self.v1 is v1:
            self.v1 = v2
        elif self.v2 is v1:
            self.v2 = v2
        elif self.v3 is v1:
            self.v3 = v2

    def other(self, v1, v2):
        if v1 == self.v1:
            if v2 == self.v2:
                return self.v3
            elif v2 == self.v3:
                return self.v2
        elif v1 == self.v2:
            if v2 == self.v1:
                return self.v3
            elif v2 == self.v3:
                return self.v1
        elif v1 == self.v3:
            if v2 == self.v1:
                return self.v2
            elif v2 == self.v2:
                return self.v1

    def opposite(self, vertex):
        if vertex is self.v1:
            return self.v2, self.v3
        elif vertex is self.v2:
            return self.v3, self.v1
        elif vertex is self.v3:
            return self.v1, self.v2

class Vertex(Vector):
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

        self.faces = set()

class Mesh(object):
    def __init__(self):
        self.faces = []
        self.verts = []

    def vertex(self, x, y, z):
        vertex = Vertex(x, y, z)
        self.verts.append(vertex)
        return vertex

    def face(self, v1, v2, v3):
        face = Face(v1, v2, v3)

        v1.faces.add(face)
        v2.faces.add(face)
        v3.faces.add(face)

        self.faces.append(face)

        return face

    def remove_face(self, face):
        self.faces.remove(face)
        face.v1.faces.remove(face)
        face.v2.faces.remove(face)
        face.v3.faces.remove(face)

    def collapse(self, v1, v2, new):
        self.verts.remove(v1)
        self.verts.remove(v2)
        obsolete = v1.faces & v2.faces
        remaining = (v1.faces | v2.faces) - obsolete

        for face in obsolete:
            self.faces.remove(face)

        for face in remaining:
            face.replace_vertex(v1, new)
            face.replace_vertex(v2, new)
            new.faces.add(face)

    def split(self, v1, v2, new):
        faces = v1.faces & v2.faces
        new_faces = []
        for face in faces:
            self.remove_face(face)
            n1, n2 = face.opposite(v1)
            new_faces.append(self.face(n1, n2, new))
            n1, n2 = face.opposite(v2)
            new_faces.append(self.face(n1, n2, new))
        return new_faces

    def save(self, name):
        outfile = open(name, 'wb')

        vertices = (c_float*(4*len(self.verts)))()
        indices = (c_ushort*(3*len(self.faces)))()

        for i, vertex in enumerate(self.verts):
            vertices[i*4+0:i*4+4] = vertex.x, vertex.y, vertex.z, 1.0
            vertex.index = i

        for i, face in enumerate(self.faces):
            indices[i*3+0:i*3+3] = face.v1.index, face.v2.index, face.v3.index

        outfile.write(pack('I', len(indices)))
        outfile.write(string_at(indices, sizeof(indices)))
        outfile.write(pack('I', len(vertices)))
        outfile.write(string_at(vertices, sizeof(vertices)))
        outfile.close()
    
    def serialize(self):
        vertices = (c_float*(4*len(self.verts)))()
        indices = (c_uint*(3*len(self.faces)))()

        for i, vertex in enumerate(self.verts):
            vertices[i*4+0:i*4+4] = vertex.x, vertex.y, vertex.z, 1.0
            vertex.index = i

        for i, face in enumerate(self.faces):
            indices[i*3+0:i*3+3] = face.v1.index, face.v2.index, face.v3.index

        return VBO(
            indices     = indices,
            count       = len(indices),
            position_4  = vertices,
        )
