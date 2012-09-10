'''
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
'''

import pyglet
from pyglet.gl import *
from gletools import ShaderProgram, VertexObject, Matrix, VBO

from heightfield import Heightfield
from terrain import Terrain
from util import View

window = pyglet.window.Window(fullscreen=True, vsync=False)
view = View(window)
rotation = 0.0

heightfield = Heightfield()
terrain = Terrain(heightfield)

program = ShaderProgram.open('triangles.shader')

def simulate(delta, _):
    global rotation
    rotation += 0.1 * delta

pyglet.clock.schedule(simulate, 0.03)

@window.event
def on_draw():
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE)
    glEnable(GL_CULL_FACE)
    glCullFace(GL_BACK)
    window.clear()
    
    model = Matrix().translate(-0.5, 0.0, 0.0)
    program.vars.modelview = view.matrix * model 
    program.vars.projection = Matrix.perspective(window.width, window.height, 60, 0.001, 2.0)

    with program:
        terrain.draw()

if __name__ == '__main__':
    pyglet.app.run()
