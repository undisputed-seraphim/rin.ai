/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position;
    varying float height;

    void main(void) {
        gl_Position = vec4((position.x-0.5)*2.0, (position.z-0.5)*2.0, 0.0, 1.0);
        height = position.y;
    }

fragment:
    varying float height;

    void main(void){
        gl_FragColor = vec4(height, height, height, 1.0);
    }
