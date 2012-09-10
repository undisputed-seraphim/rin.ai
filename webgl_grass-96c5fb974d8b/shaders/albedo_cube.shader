/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
vertex:
    uniform mat4 model, view, proj;
    uniform mat3 view_rot;

    attribute vec3 position;
    varying vec2 uv;

    void main(void) {
        gl_Position = proj * view * model * vec4(position, 1.0);
        uv = vec2(position.x, position.z);
    }

fragment:
    uniform sampler2D material, normals;
    uniform samplerCube diffuse;
    varying vec2 uv;

    void main(void){
        vec3 color = texture2D(material, uv).rgb;
        vec3 normal = normalize((texture2D(normals, uv).rgb-0.5)*2.0);
        vec3 result = textureCube(diffuse, normal).rgb*color;
        gl_FragColor = vec4(result, 1.0);
    }
