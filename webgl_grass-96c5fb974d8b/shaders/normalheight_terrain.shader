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
    uniform sampler2D terrain;
    uniform float scale, offset;
    uniform vec2 viewport;
    varying vec2 uv;

    float get(vec2 off){
        return texture2D(terrain, uv+off/viewport).r*scale*0.5; // fixme is dependent on the terrain size
    }
   
    /*
    vec3 get(float height1, float xoff, float zoff){
        vec2 off = vec2(xoff, zoff)/viewport;
        float height2 = texture2D(terrain, uv+off).r*scale+offset;
        //float height2 = texture2D(terrain, uv+off).r;
        vec3 dir = vec3(off.x, height2-height1, off.y);
        vec3 perp = cross(dir, vec3(0.0, 1.0, 0.0));
        return normalize(cross(perp, dir));
    }
    */

    void main(void){
        float height = texture2D(terrain, uv).r*scale+offset;
       
        vec3 normal = normalize(vec3(
            get(vec2(-1.0, 0.0)) - get(vec2(1.0, 0.0)),
            uv.s+uv.t,
            get(vec2(0.0, -1.0)) - get(vec2(0.0, 1.0))
        ));
    
        /*
        vec3 normal = normalize(vec3(
            get(height,-1.0,-1.0) + get(height,+0.0,-1.0) + get(height,+1.0,-1.0) + 
            get(height,-1.0,+0.0)                         + get(height,+1.0,+0.0) + 
            get(height,-1.0,+1.0) + get(height,+0.0,+1.0) + get(height,+1.0,+1.0)
        )/8.0);
        */
     
        gl_FragColor = vec4(normal, height);
    }
