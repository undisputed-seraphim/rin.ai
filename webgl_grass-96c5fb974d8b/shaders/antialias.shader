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
    uniform sampler2D source, edgemap;
    uniform vec2 offset;

    vec4 get(float x, float y, float factor){
        return texture2D(source, v_texcoord+vec2(x,y)*offset) * factor;
    }

    float a=0.253502019, b=0.124993913, c=0.061630583;

    void main(void){
        vec4 center = get(0.0, 0.0, 1.0);
        vec4 factor = texture2D(edgemap, v_texcoord);

        vec4 blurred = (
            get(-1.0,-1.0, c) + get(0.0,-1.0, b) + get(1.0,-1.0, c) +
            get(-1.0, 0.0, b) + center*a         + get(1.0, 0.0, b) +
            get(-1.0, 1.0, c) + get(0.0, 1.0, b) + get(1.0, 1.0, c)
        );
    
        vec4 color = mix(center, blurred, factor);
        gl_FragColor = color;
    }
