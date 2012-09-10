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
    uniform sampler2D src1, src2, src3;
    uniform float time;

    void main(void){
        float wobble = sin(time*50.0);
        float dir = (texture2D(src3, pos+vec2(time*11.0, 0.0)).r-0.5)*4.0;
        float val1 = texture2D(src1, pos-vec2(time*5.0, 0.0)).r;
        float val2 = texture2D(src2, pos-vec2(time*10.0, val1*0.2)).r;
        float l = pow(val2*val1, 3.0);
        vec2 v = vec2(cos(dir), sin(dir))*l;
        gl_FragColor = vec4(v, 0.0, 1.0);
    }
