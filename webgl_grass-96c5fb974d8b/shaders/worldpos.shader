/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position;
    attribute vec2 texcoord;
    varying vec2 uv;

    void main(void) {
        gl_Position = vec4(position, 1.0);
        uv = texcoord;
    }

fragment:
    varying vec2 uv;
    uniform sampler2D eyeposmap;
    uniform vec2 viewport;
    uniform mat4 inv_view;

    void main(void){
        vec3 eye_pos = texture2D(eyeposmap, uv).xyz;
        vec4 world_pos = inv_view * vec4(eye_pos, 1.0);
        gl_FragColor = vec4(world_pos.xyz, 1.0);
    }
