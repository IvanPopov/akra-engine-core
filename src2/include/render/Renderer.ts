
module  akra.render {
	export enum ShaderPrefixes {
		k_Sampler    = "A_s_";
	    k_Header     = "A_h_";
	    k_Attribute  = "A_a_";
	    k_Offset     = "A_o_";
	    k_Texture    = "TEXTURE";
	    k_Texcoord   = "TEXCOORD";
	    k_Texmatrix  = "TEXMATRIX";
	    k_Temp       = "TEMP_";
	    k_BlendType  = "AUTO_BLEND_TYPE_";
	}

	export var ZEROSAMPLER: int = 19;

	export var SystemSemantics: StringMap = {
		MODEL_MATRIX: 		"MODEL_MATRIX";
		VIEW_MATRIX: 		"VIEW_MATRIX",
		PROJ_MATRIX: 		"PROJ_MATRIX",
		NORMAL_MATRIX: 		"NORMAL_MATRIX",
		BIND_MATRIX: 		"BIND_SHAPE_MATRIX",
		RENDER_OBJECT_ID: 	"RENDER_OBJECT_ID"
	}

	interface IComponentBlendMap {
		[string]: IComponentBlend;
	};


	interface IPassBlendMap {
		[string]: IPassBlend;
	};

	interface IEffectMap {
		[string]: IAFXEffect;
	};

	interface IRenderResourceMap {
		[int]: IRenderResource;
	}

	export class Renderer {
		private pEngine: IEngine;
		private pDevice: WebGLRenderingContext;

		private nEffectFile: uint = 1;
		private pEffectFileStack: IAFXEffect[] = [];

		private pComponentBlendMap: IComponentBlendMap = {};
		private pPassBlendMap: IPassBlendMap = {};
		private pEffectMap: IEffectMap = {};

		private pActiveSceneObject: ISceneObject = null;
		private pActiveRenderObject: IRenderableObject = null;

		// WHAT IS THIS???, WHY THIS NEED???
		private pSceneObjectStack: ISceneObject[] = [];
		private pPreRenderStateStack: IPreRenderState[] = [];
		private pPreRenderStateActive: IPreRenderState = null;
		private pPreRenderStatePool: IPreRenderState[] = new Array(20);

		private pCurrentViewport: IViewport;
		//private pProgramsMap; //--> TO FAT SEARCH TREE
		private pRenderResourceMap: IRenderResourceMap;
		private pRenderResourceCounter: IntMap;

		private pScreen: IMesh;

		constructor (pEngine: IEngine);

	}
};