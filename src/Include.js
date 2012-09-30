
function defineNotWritableProperty(pObject, pPropList, pValue) {
	for (var i = 0; i < pPropList.length; ++ i) {
		Object.defineProperty(pObject, pPropList[i], {
			value: pValue,
			writable: false,
			configurable: false
		});
	}
}

defineNotWritableProperty(window, ['a', 'akra', 'AKRA'], {});
var a = window.a;
// var a = window.akra = window.AKRA = {};

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
Include('Renderer.js');

/* Buffers */
Include('resources/buffers/');
Include('resources/Texture.js');
Include('resources/Img.js');
Include('resources/RenderMethod.js');


Include('render/');

Include('model/');
Include('resources/ModelResource.js');

/*particle system*/
Include('particles/');

/*sprites*/
Include('sprites/');

/*lighting*/
Include('lighting/');

Include('objects/');
Include('Engine.js');

//Include('../../akra-engine-general/analyzer/A_Analyzer.js');

