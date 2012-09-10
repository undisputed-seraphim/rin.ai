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
    uniform sampler2D position, accel, velocity;
    uniform float delta;

    void main(void){
        vec2 p = texture2D(position, pos).xy;
        vec2 v = texture2D(velocity, pos).xy*0.91;
        vec2 a = texture2D(accel, pos).xy*0.005;
        vec2 spring = p*-0.0004;
        vec2 force = a+spring;
        vec2 result = v+force;
        gl_FragColor = vec4(result, 0.0, 1.0);
    }
