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
    // maybe the premultiplication and postmultiplication factors should be uniforms

    varying vec2 v_texcoord;
    uniform sampler2D normaldepthmap;
    uniform vec2 offset;

    vec4 get(float x, float y, float factor){
        return texture2D(normaldepthmap, v_texcoord+vec2(x,y)*offset) * vec4(1.0, 1.0, 1.0, 1.0) * factor;
    }

    void main(void){
        vec4 sum = (
            get(-1.0,-1.0, -1.0) + get( 0.0,-1.0, -1.0) + get( 1.0,-1.0, -1.0) +
            get(-1.0, 0.0, -1.0) + get( 0.0, 0.0,  8.0) + get( 1.0, 0.0, -1.0) +
            get(-1.0, 1.0, -1.0) + get( 0.0, 1.0, -1.0) + get( 1.0, 1.0, -1.0)
        )/4.0;
        
        float result = min(1.0, max(max(sum.x, sum.y), max(sum.z, sum.w)));
        //float result = (sum.x+sum.y+sum.z+sum.w)/2.0;
        gl_FragColor = vec4(result, result, result, 1.0);
    }
