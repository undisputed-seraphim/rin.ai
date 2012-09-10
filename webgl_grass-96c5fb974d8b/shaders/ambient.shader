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
    uniform sampler2D albedomap;
    uniform float ambient;

    void main(void){
        vec4 color = texture2D(albedomap, v_texcoord);
        gl_FragColor = vec4(color.rgb*ambient, color.a);
    }
