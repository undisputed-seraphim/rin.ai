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
    uniform sampler2D normaldepthmap, albedo;
    uniform samplerCube diffuse;

    void main(void){
        vec3 normal = texture2D(normaldepthmap, v_texcoord).rgb;
        vec4 front_result = textureCube(diffuse, normal);
        vec4 back_result = textureCube(diffuse, normal*-1.0);
        float factor = texture2D(albedo, v_texcoord).a;
        vec4 result = mix(front_result, back_result, factor);
        gl_FragColor = vec4(result.rgb*0.50, 1.0);
    }
