/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position;

    void main(void) {
        gl_Position = vec4(position, 1.0);
    }

fragment:
    uniform samplerCube source;
    uniform vec2 viewport;
    uniform mat4 inv_proj;
    uniform mat3 inv_view_rot;
    uniform float scale;
    
    vec3 get_normal(float x, float y){
        vec2 frag_coord = (gl_FragCoord.xy+vec2(x, y))/viewport;
        frag_coord = (frag_coord-0.5)*2.0;
        vec4 device_normal = vec4(frag_coord, 0.0, 1.0);
        vec3 eye_normal = normalize((inv_proj * device_normal).xyz);
        vec3 world_normal = normalize(inv_view_rot*eye_normal);
        return world_normal;
    }

    vec4 get(vec3 eyedir, float x, float y){
        vec3 dir = get_normal(x, y);
        vec3 color = textureCube(source, dir).xyz;
        float lambert = dot(dir, eyedir);
        return vec4(color * lambert, lambert);
    }

    void main(){
        vec3 center = get_normal(0.0, 0.0);
        vec4 color = (
            get(center, -scale, -scale)*9.0 + get(center, +0.0, -scale)*12.0 + get(center, +scale, -scale)*9.0 +
            get(center, -scale, +0.0)*12.0   + get(center, +0.0, +0.0)*15.0   + get(center, +scale, +0.0)*12.0 +
            get(center, -scale, +scale)*9.0 + get(center, +0.0, +scale)*12.0 + get(center, +scale, +scale)*9.0
        );
        color /= color.a;

        gl_FragColor = vec4(color.rgb, 1.0);
    }
