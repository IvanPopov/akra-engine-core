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

/* Files */
Include('files/');

/* Utils */
Include('utils/');

/* Resource Pool */
Include('resources/pool/');

Include('Scene.js');
Include('objects/Camera.js');
Include('Tree.js');

/* Shaders */
Include('shaders/');

//Include('effects/');
Ifdef(DEV_BUILD)
Include('model/Material.js');
Endif();

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

Ifdef(DEV_BUILD)
Include('model/RenderData.js');
Include('model/RenderDataFactory.js');
Include('model/RenderSnapshot.js');
Include('model/RenderableObjects.js');
Include('model/MeshSubset.js');
Include('model/Mesh2.0.js');
Elseif();
Include('model/');
Endif();

Include('resources/ModelResource.js');

Include('objects/');
Include('Engine.js');

window['a'] = window['akra'] = a;

//Include('../../akra-engine-general/analyzer/A_Analyzer.js');