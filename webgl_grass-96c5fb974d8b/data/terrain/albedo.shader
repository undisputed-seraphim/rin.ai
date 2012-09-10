/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    uniform mat4 view, proj;
    uniform mat3 view_rot;

    attribute vec3 position;
    varying vec2 uv;
    varying float depth;

    void main(void) {
        gl_Position = proj * view * vec4(position, 1.0);
        depth = length((view * vec4(position, 1.0)).xyz);
        uv = vec2(position.x, position.z);
    }

fragment:
    uniform sampler2D material, detail1, detail2, mixmap;
    varying vec2 uv;
    varying float depth;

    void main(void){
        vec3 base_color = texture2D(material, uv).rgb;
        vec3 detail1_color = texture2D(detail1, uv*30.0).rgb*base_color*2.0;
        vec3 detail2_color = texture2D(detail2, uv*30.0).rgb*base_color*2.0;
        float mix_factor = texture2D(mixmap, uv).r;
        vec3 detail_color = mix(detail1_color, detail2_color, mix_factor);
        vec3 result = mix(detail_color, base_color, clamp(depth*2.0, 0.0, 1.0));
        gl_FragColor = vec4(result, 0.0);
    }
