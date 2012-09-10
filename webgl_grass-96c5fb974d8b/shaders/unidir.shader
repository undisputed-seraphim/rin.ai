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
    uniform sampler2D albedomap, normaldepthmap;
    uniform vec3 lightdir;

    void main(void){
        vec4 color = texture2D(albedomap, v_texcoord);
        vec3 normal = texture2D(normaldepthmap, v_texcoord).rgb;
        float lambert = max(0.0, dot(normal, lightdir));
        gl_FragColor = vec4(color.rgb*lambert, color.a);
    }
