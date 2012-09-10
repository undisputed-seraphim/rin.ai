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
    uniform sampler2D source;
    uniform vec2 viewport;
    varying vec2 uv;

    vec4 get(float x, float y){
        return texture2D(source, uv+vec2(x, y)/viewport);
    }
    
    void main(void){
        gl_FragColor = (
            get(-1.0, -1.0) + get(+0.0, -1.0) + get(+1.0, -1.0) + 
            get(-1.0, +0.0) + get(+0.0, +0.0) + get(+1.0, +0.0) + 
            get(-1.0, +1.0) + get(+0.0, +1.0) + get(+1.0, +1.0)
        )/9.0;
    }

