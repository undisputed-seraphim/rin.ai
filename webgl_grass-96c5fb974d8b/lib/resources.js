/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
var resources = {
    // scene shaders
    sky         : 'shaders/sky.shader',

    // cubemaps
    scattering          : 'shaders/scattering.shader',
    diffuse_blur        : 'shaders/diffuse_blur.shader',
    diffuse_scale       : 'shaders/diffuse_scale.shader',
    albedo_cube         : 'shaders/albedo_cube.shader',

    // compute shaders
    normalheight_terrain : 'shaders/normalheight_terrain.shader',
    blur                 : 'shaders/blur.shader',
    feature_blur         : 'shaders/feature_blur.shader',
    cubemap_convolve     : 'shaders/cubemap_convolve.shader',

    // postprocessing shaders
    pass        : 'shaders/pass.shader',
    cubesampler : 'shaders/cubesampler.shader',
    ambient     : 'shaders/ambient.shader',
    unidir      : 'shaders/unidir.shader',
    cubelight   : 'shaders/cubelight.shader',
    edge        : 'shaders/edge.shader',
    antialias   : 'shaders/antialias.shader',
    eyepos      : 'shaders/eyepos.shader',
    worldpos    : 'shaders/worldpos.shader',
    ssao        : 'shaders/ssao.shader',
    gamma       : 'shaders/gamma.shader',
    
    // operators
    multiply    : 'shaders/multiply.shader',

    terrain      : {
        root            : 'data/terrain',
        mesh            : 'mesh.vbo',
        //texture         : 'texture.png',
        texture         : 'texture2.png',
        normals         : 'normals.png',
        mix             : 'mix.png',
        detail1         : {
            texture         : 'rock_texture.png',
            normals         : 'rock_normals.png',
        },
        detail2         : {
            texture         : 'grass_texture.png',
            normals         : 'grass_normals.png',
        },
        shaders         : {
            albedo      : 'albedo.shader',
            normdepth   : 'normdepth.shader',
            heightmap   : 'heightmap.shader',
        }
    },

};
