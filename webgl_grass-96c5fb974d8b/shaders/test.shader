/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    attribute vec3 position, normal;
    attribute vec2 texcoord;

    uniform mat4 model, view, projection, normal_matrix;
    varying vec3 v_normal;
    varying vec2 v_texcoord;

    void main(void) {
        gl_Position = projection * view * model * vec4(position, 1.0);
        v_normal = mat3(normal_matrix) * normal;
        v_texcoord = texcoord*0.25;
    }

fragment:
    uniform sampler2D material1, material2;

    varying vec3 v_normal;
    varying vec2 v_texcoord;

    vec3 incident = normalize(vec3(0.5, 1.0, 0.0));
    void main(void){
        float dot_surface_incident = max(0.0, dot(v_normal, incident));
        float exident = mix(0.1, 1.0, dot_surface_incident);
        vec3 color = texture2D(material2, v_texcoord).rgb * texture2D(material1, v_texcoord).rgb;
        gl_FragColor = vec4(color*exident, 1.0);
    }
