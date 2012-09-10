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
    uniform vec3 axis;
    
    vec3 get_world_normal(){
        vec2 frag_coord = gl_FragCoord.xy/viewport;
        frag_coord = (frag_coord-0.5)*2.0;
        vec4 device_normal = vec4(frag_coord, 0.0, 1.0);
        vec3 eye_normal = normalize((inv_proj * device_normal).xyz);
        vec3 world_normal = normalize(inv_view_rot*eye_normal);
        return world_normal;
    }

    const float pi = 3.14159265358979323846264338327950288419716939937510;
    const float start = -pi/2.0;
    const float end = pi/2.0;
    const float size = pi/128.0;

    mat3 rotate(vec3 a, float angle){
        float c = cos(angle);
        float t = 1.0-c;
        float txy = t*a.x*a.y;
        float txz = t*a.x*a.z;
        float tyz = t*a.y*a.z;

        vec3 s = sin(angle)*a;
        vec3 tp = t*pow(a, vec3(2.0));

        return mat3(
            tp.x + c,    txy  - s.z,  txz  + s.y,
            txy  + s.z,  tp.y + c,    tyz  - s.x,
            txz  - s.y,  tyz  + s.x,  tp.z + c
        );
    }

    void main(){
        vec3 eyedir = get_world_normal();
        float x = eyedir.x;
        float y = eyedir.y;
        float z = eyedir.z;
        vec3 result = vec3(0.0);
        float divider = 0.0;

        for(float angle=start; angle<=end; angle+=size){
            vec3 rotated = normalize(rotate(axis, angle) * eyedir);
            float lambert = dot(eyedir, rotated);
            result += textureCube(source, rotated).xyz*lambert;
            divider += lambert;
        }
        result /= divider;
        gl_FragColor = vec4(result, 1.0);
    }
