/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position;
    attribute vec2 texcoord;
    varying vec2 v_texcoord;

    void main(void) {
        gl_Position = vec4(position, 1.0);
        v_texcoord = texcoord;
    }

fragment:
    varying vec2 v_texcoord;
    uniform sampler2D normaldepthmap;
    uniform vec2 viewport;
    uniform mat4 inv_proj;

    void main(void){
        float depth = texture2D(normaldepthmap, v_texcoord).w;
        vec2 frag_coord = gl_FragCoord.xy/viewport;
        frag_coord = (vec2(frag_coord.x, frag_coord.y)-0.5)*2.0;
        vec4 device_normal = vec4(frag_coord, 0.0, 1.0);
        vec3 eye_normal = normalize((inv_proj * device_normal).xyz);
        vec3 eye_pos = eye_normal * depth;

        gl_FragColor = vec4(eye_pos, 1.0);
    }
