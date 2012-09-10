/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    uniform mat4 view, proj;
    uniform vec3 camera;
    uniform sampler2D datamap;
    uniform float field_size;

    attribute vec3 position, color;
    attribute vec4 centersize;

    varying vec3 v_color;

    void main(void) {
        vec3 center = centersize.xyz;
        float size = centersize.w-0.4;
        vec3 camera_off = vec3(camera.x, 0.0, camera.z);
        vec3 center_off = center+camera_off;
        center_off = floor(center_off/field_size)*field_size - center + field_size*0.5;
        vec4 data = texture2D(datamap, center_off.xz);
        center_off.y = data.z;
        float visibility = data.a;
        vec2 wind_dir = data.xy;
        float scale = position.y*visibility;
        float strength = min(length(wind_dir)*scale*300.0*size, 3.0);
        wind_dir = normalize(wind_dir);
        float s = sin(strength);
        vec3 wind_off = vec3(wind_dir.x*s, cos(strength)-1.0, wind_dir.y*s)*scale;
        vec3 pos = position*visibility+center_off+wind_off;

        gl_Position = proj * view * vec4(pos, 1.0);
        v_color = color;
    }

fragment:
    varying vec3 v_color;

    void main(void){
        //gl_FragColor = vec4(pow(vec3(0.51, 0.59, 0.24), vec3(2.2)), 0.25);
        gl_FragColor = vec4(v_color, 0.25);
    }
