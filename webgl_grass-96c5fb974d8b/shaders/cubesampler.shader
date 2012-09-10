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
    uniform vec2 viewport;
    uniform mat4 inv_proj;
    uniform mat3 inv_view_rot;
    uniform samplerCube source;
    
    vec3 get_world_normal(){
        vec2 frag_coord = gl_FragCoord.xy/viewport;
        frag_coord = (frag_coord-0.5)*2.0;
        vec4 device_normal = vec4(frag_coord, 0.0, 1.0);
        vec3 eye_normal = normalize((inv_proj * device_normal).xyz);
        vec3 world_normal = normalize(inv_view_rot*eye_normal);
        return world_normal;
    }

    void main(void){
        vec3 normal = get_world_normal();
        gl_FragColor = textureCube(source, normal, 8.0*8.0);
    }
