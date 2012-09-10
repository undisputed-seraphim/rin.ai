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
    const int size = 256;
    uniform vec3 rays[size];
    
    vec3 get_eye_normal(){
        vec2 frag_coord = gl_FragCoord.xy/viewport;
        frag_coord = (frag_coord-0.5)*2.0;
        vec4 device_normal = vec4(frag_coord, 0.0, 1.0);
        vec3 eye_normal = normalize((inv_proj * device_normal).xyz);
        vec3 world_normal = normalize(inv_view_rot*eye_normal);
        return world_normal;
    }

    void main(){
        vec3 eyedir = get_eye_normal();
        vec3 left = normalize(cross(eyedir, vec3(0.0, 1.0, 0.0)));
        vec3 front = normalize(cross(eyedir, left));
        mat3 localmat = mat3(left, eyedir, front);
        vec4 result = vec4(0.0);
        for(int i=0; i<size; i++){
            vec3 ray = normalize(rays[i]);
            vec3 proj_ray = normalize(localmat * ray);
            result += textureCube(source, proj_ray)*ray.y;
        }
        result /= result.w;
        gl_FragColor = vec4(result.rgb, 1.0);
        //gl_FragColor = vec4((localmat*vec3(0.0, 1.0, 0.0)+1.0)*0.5, 1.0);
    }
