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
    uniform sampler2D velocity;
    uniform float delta;

    void main(void){
        vec2 v = texture2D(velocity, pos).xy;
        gl_FragColor = vec4(v*delta, 0.0, 1.0);
    }
