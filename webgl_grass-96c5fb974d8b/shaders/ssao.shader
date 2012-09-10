/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position;
    attribute vec2 texcoord;
    varying vec2 v_texcoord;

    void main(void) {
        gl_Position = vec4(position, 1.0);
        v_texcoord = texcoord;
    }

fragment:
    varying vec2 v_texcoord;
    uniform sampler2D normaldepthmap, worldposmap, random;
    uniform vec3 rays[8];
    uniform mat4 proj, view;
    uniform float ray_scale, accentuation, falloff, falloff_accentuation;
    
    void main(void){
        vec3 worldpos = texture2D(worldposmap, v_texcoord).xyz;
        vec4 normaldepth = texture2D(normaldepthmap, v_texcoord);
        vec3 random_normal = normalize(texture2D(random, v_texcoord).xyz);
        vec3 worldnormal = normaldepth.xyz;
        float eyedepth = normaldepth.w;
        
        float occlusion = 0.0;
        float divider = 0.0;

        if(eyedepth >= 2.0){ //FIXME maybe make this configurable
            discard; 
        }
        for(int i=0; i<8; i++){
            vec3 ray = reflect(rays[i] * ray_scale, random_normal);
            float ray_length = length(ray);
            ray *= sign(dot(ray, worldnormal));
            float lambert = dot(normalize(ray), worldnormal);

            vec3 sample_world_coord = worldpos+ray;
            vec3 sample_eye_coord = (view * vec4(sample_world_coord, 1.0)).xyz;
            float sample_eye_depth = length(sample_eye_coord);

            vec4 device = proj * vec4(sample_eye_coord, 1.0);
            vec4 device_norm = device/device.w;
            vec2 screen_coord = (device_norm.xy+1.0)*0.5;
            float occluder_depth = texture2D(normaldepthmap, screen_coord).w;
    
            float occluded = lambert/pow(ray_length*falloff, falloff_accentuation);
            divider += occluded;
            if(occluder_depth > sample_eye_depth){
                continue;
            }
            if(sample_eye_coord.z > 0.0){
                continue;
            }
            if(any(greaterThan(abs(device_norm.xy), vec2(1.1)))){
                continue;
            }
            occlusion += occluded;
        }

        float light = pow(1.0-occlusion/divider, accentuation);
        gl_FragColor = vec4(vec3(clamp(light, 0.00001, 1.0)), 1.0);
        //gl_FragColor = vec4((random_normal+1.0)/2.0, 1.0);
    }
