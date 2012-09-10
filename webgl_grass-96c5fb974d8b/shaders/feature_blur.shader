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
    uniform sampler2D source, normaldepthmap;
    uniform vec2 viewport, axis;
    varying vec2 uv;

    void main(void){
        vec2 off = (axis*1.5)/viewport;
        float ad = texture2D(normaldepthmap, uv).a;
        float bd = smoothstep(0.0, 1.0, 0.0001/abs(texture2D(normaldepthmap, uv+off).a-ad));
        float cd = smoothstep(0.0, 1.0, 0.0001/abs(texture2D(normaldepthmap, uv-off).a-ad));
        vec4 a = texture2D(source, uv)*1.0;
        vec4 b = texture2D(source, uv+off)*2.0*bd;
        vec4 c = texture2D(source, uv-off)*2.0*cd;
        vec4 result = a+b+c;
        result /= result.w;
        gl_FragColor = result;
    }
