var a = {
    fx: {},
    util: {}
};

Define(DEV_BUILD, 1);

Include('Common.js');
Include('3DImplement.js');
Include('PreLoad.js');
Include('Util.js');
Include('Keymap.js');

/* Timer */
Include('timer/');


/* Math */
Include('math/');

/*Network*/
Include('network/');

/* Files */
Include('files/');

/* Utils */
Include('utils/');

/* Resource Pool */
Include('resources/pool/');

Include('scene/');
Include('objects/Camera.js');
Include('Tree.js');

Include('shaders/');
Include('materials/');

Include('resources/SurfaceMaterial.js');
Include('resources/EffectResource.js');

Include('RenderQueue.js');
Include('DisplayManager.js');
Include('ShaderManager.js');

/* Buffers */
Include('resources/buffers/');

Include('resources/Img.js');
Include('resources/Texture.js');
Include('resources/RenderMethod.js');


Include('render/');
Include('model/');
Include('resources/ModelResource.js');

/*particle system*/
Include('particles/');

/*sprites*/
Include('sprites/');

Include('objects/');
Include('Engine.js');

window['a'] = window['akra'] = window['AKRA'] = a;

//Include('../../akra-engine-general/analyzer/A_Analyzer.js');
