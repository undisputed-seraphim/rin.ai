/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    uniform mat4 view, proj;
    uniform mat3 view_rot;

    attribute vec3 position, normal;
    attribute vec2 texcoord;

    varying vec2 uv;
    varying float depth;

    void main(void) {
        gl_Position = proj * view * vec4(position, 1.0);
        depth = length((view * vec4(position, 1.0)).xyz);
        uv = vec2(position.x, position.z);
    }

fragment:
    uniform sampler2D normals, detail1, detail2, mixmap;
    varying vec2 uv;
    varying float depth;

    void main(void){
        vec3 base_normal = normalize((texture2D(normals, uv).rgb-0.5)*2.0);
        vec3 left = normalize(cross(base_normal, vec3(0.0, 0.0, 1.0)));
        vec3 front = normalize(cross(left, base_normal));
        mat3 localmat = mat3(left, base_normal, front);

        vec3 detail1_normal = normalize((texture2D(detail1, uv*30.0).rgb-0.5)*2.0);
        vec3 detail2_normal = normalize((texture2D(detail2, uv*30.0).rgb-0.5)*2.0);
        float mix_factor = texture2D(mixmap, uv).r;
        vec3 detail_normal = localmat * normalize(mix(detail1_normal, detail2_normal, mix_factor));

        vec3 result = normalize(mix(detail_normal, base_normal, clamp(depth*2.0, 0.0, 1.0)));
        gl_FragColor = vec4(result, depth);
    }
        
