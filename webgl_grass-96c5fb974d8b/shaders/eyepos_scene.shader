/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position, normal;
    attribute vec2 texcoord;

    uniform mat4 model, view, projection, normal_matrix;
    varying vec4 v_position;

    void main(void) {
        gl_Position = projection * view * model * vec4(position, 1.0);
        v_position = view * model * vec4(position, 1.0);
    }

fragment:
    varying vec4 v_position;

    void main(void){
        gl_FragColor = v_position;
    }
