/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position;
    attribute vec2 texcoord;
    varying vec2 pos;

    void main(void) {
        gl_Position = vec4(position, 1.0);
        pos = texcoord;
    }

fragment:
    varying vec2 pos;
    uniform sampler2D wind, heightmap, mixmap;

    void main(void){
        gl_FragColor.xy = texture2D(wind, pos).xy;
        gl_FragColor.z = texture2D(heightmap, pos).r;
        gl_FragColor.a = texture2D(mixmap, pos).r;
    }
