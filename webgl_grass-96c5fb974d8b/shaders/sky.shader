/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position, normal;
    attribute vec2 texcoord;

    uniform mat4 projection, normal_matrix, view;
    varying vec3 v_normal;
    varying vec2 v_texcoord;

    void main(void) {
        gl_Position = projection * vec4(mat3(normal_matrix) * position, 1.0);
        v_normal = normal;
    }

fragment:
    varying vec3 v_normal;
    uniform samplerCube cubemap;

    void main(){
        gl_FragColor = textureCube(cubemap, normalize(v_normal));
    }
