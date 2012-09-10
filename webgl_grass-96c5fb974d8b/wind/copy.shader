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
    uniform sampler2D source;

    void main(void){
        gl_FragColor = vec4(texture2D(source, pos).rgb, 1.0);
    }
