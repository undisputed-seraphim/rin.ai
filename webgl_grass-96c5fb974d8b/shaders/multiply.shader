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
    uniform sampler2D op1;
    uniform sampler2D op2;

    void main(void){
        gl_FragColor = vec4(texture2D(op1, uv).rgb * texture2D(op2, uv).rgb, 1.0);
    }
