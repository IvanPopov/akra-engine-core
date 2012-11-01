#ifndef RENDERER_TS
#define RENDERER_TS

#include "IRenderer.ts"

#include "IAFXComponent.ts"
#include "IAFXEffect.ts"
#include "IRenderableObject.ts"
#include "IRenderSnapshot.ts"
#include "ISceneObject.ts"
#include "IBufferMap.ts"
#include "IShaderProgram.ts"
#include "ISurfaceMaterial.ts"
#include "IVertexData.ts"
#include "IVertexBuffer.ts"
#include "ITexture.ts"
#include "IIndexBuffer.ts"
#include "IRenderResource.ts"
#include "IRenderEntry.ts"
#include "IFrameBuffer.ts"
#include "IViewport.ts"

module  akra.render {
	export var ShaderPrefixes: StringMap = {
		k_Sampler    : "A_s_",
	    k_Header     : "A_h_",
	    k_Attribute  : "A_a_",
	    k_Offset     : "A_o_",
	    k_Texture    : "TEXTURE",
	    k_Texcoord   : "TEXCOORD",
	    k_Texmatrix  : "TEXMATRIX",
	    k_Temp       : "TEMP_",
	    k_BlendType  : "AUTO_BLEND_TYPE_"
	};

	export var ZEROSAMPLER: int = 19;

	export var SystemSemantics: StringMap = {
		MODEL_MATRIX: 		"MODEL_MATRIX",
		VIEW_MATRIX: 		"VIEW_MATRIX",
		PROJ_MATRIX: 		"PROJ_MATRIX",
		NORMAL_MATRIX: 		"NORMAL_MATRIX",
		BIND_MATRIX: 		"BIND_SHAPE_MATRIX",
		RENDER_OBJECT_ID: 	"RENDER_OBJECT_ID"
	}

	interface IAFXComponentBlendMap {
		[index: string]: IAFXComponentBlend;
	};


	interface IAFXPassBlendMap {
		[index: string]: IAFXPassBlend;
	};

	interface IAFXEffectMap {
		[index: string]: IAFXEffect;
	};

	interface IRenderResourceMap {
		[index: number]: IRenderResource;
	}

	export class Renderer implements IRenderer {
		private pEngine: IEngine;
		private pDevice: WebGLRenderingContext;

		private nEffectFile: uint = 1;
		private pEffectFileStack: IAFXEffect[] = [];

		private pComponentBlendMap: IAFXComponentBlendMap = {};
		private pPassBlendMap: IAFXPassBlendMap = {};
		private pEffectMap: IAFXEffectMap = {};

		private pActiveSceneObject: ISceneObject = null;
		private pActiveRenderObject: IRenderableObject = null;

		// WHAT IS THIS???, WHY THIS NEED???
		private pSceneObjectStack: ISceneObject[] = [];
		private pPreRenderStateStack: IAFXPreRenderState[] = [];
		private pPreRenderStateActive: IAFXPreRenderState = null;
		private pPreRenderStatePool: IAFXPreRenderState[] = new Array(20);

		private pCurrentViewport: IViewport;
		//private pProgramsMap; //--> TO FAT SEARCH TREE
		private pRenderResourceMap: IRenderResourceMap;
		private pRenderResourceCounter: IntMap;

		private pScreen: IMesh;

		constructor (pDisplay: IDisplay3d) {

		}

		//// frendly for EffectResource

    	/** * Регистрация компонента эффекта. **/
    	registerComponent(pComponent: IAFXComponent): bool {
    		return false;
    	}

    	/** Активация компонента для эффект ресурса. */
    	activateComponent(pEffectResource: IAFXEffect, iComponentHandle: int, nShift?: uint): bool {
    		return false;
    	}

    	/** Деактивация компонента для эффект ресурса. */
    	deactivateComponent(pEffectResource: IAFXEffect, iComponentHandle: int, nShift?: uint): bool {
    		return false;
    	}

    	/** Get effect components number */
    	getComponentCount(pEffectResource: IAFXEffect): uint {
    		return 0;
    	}

    	//// frendly for Snapshot
    	push(pRenderObject: IRenderableObject, pSnapshot: IRenderSnapshot): bool {
    		return false;
    	}

    	pop(): bool {
    		return false;
    	}

    	activatePass(pSnapshot: IRenderSnapshot, iPass: int): bool {
    		return false;
    	}

    	deactivatePass(pSnapshot: IRenderSnapshot): bool {
    		return false;
    	}

    	activateSceneObject(pSceneObject: ISceneObject): void {}
    	deactivateSceneObject(): void{}

    	finishPass(iPass: int): bool{
    		return false;
    	}

    	applyBufferMap(pMap: IBufferMap): bool {
    		return false;
    	}
    	applyVertexData(pData: IVertexData, ePrimType: EPrimitiveTypes): bool {
    		return false;
    	}

    	applyFrameBufferTexture(pTexture: ITexture, eAttachment: EAttachmentTypes, eTexTarget: ETextureTypes, iLevel?: uint): bool {
    		return false;
    	}

    	applySurfaceMaterial(pMaterial: ISurfaceMaterial): bool {
    		return false;
    	}

    	getUniformRealName(sName: string): string {
    		return null;
    	}

    	getTextureRealName(sName: string): string {
    		return null;
    	}
    	getActiveProgram(): IShaderProgram {
    		return null;
    	}
    	getActiveTexture(iSlot: uint): ITexture {
    		return null;
    	}
    	getTextureSlot(pTexture: ITexture): uint {
    		return 0;
    	}
    	getFrameBuffer(iFrameBuffer?: int): IFrameBuffer {
    		return null;
    	}

    	isUniformTypeBase(sRealName: string): bool {
    		return false;
    	}

		totalPasses(pEffect: IAFXEffect): uint {
			return 0;
		}
    	
    	//frendly for ShaderProgram

    	activateTexture(pTexture: ITexture): bool {
    		return false;
    	}

    	activateVertexBuffer(pBuffer: IVertexBuffer): bool {
    		return false;
    	}
    	
    	activateIndexBuffer(pBuffer: IIndexBuffer): bool {
    		return false;
    	}
    	
    	activateProgram(pProgram: IShaderProgram): bool {
    		return false;
    	}
    	
    	activateFrameBuffer(pFrameBuffer: IFrameBuffer): bool {
    		return false;
    	}
    	
    	deactivateFrameBuffer(pFrameBuffer: IFrameBuffer): bool {
    		return false;
    	}
    	

    	getRenderResourceState(pResource: IRenderResource): int {
    		return 0;
    	}
    	


    	//// frendly for resources

    	registerRenderResource(pResource: IRenderResource): void {
    		return;
    	}
    	
    	releaseRenderResource(pResource: IRenderResource): void {
    		return;
    	}
    	
        /** Регистрация нового эффект ресурса. */
        registerEffect(pEffectResource: IAFXEffect): bool {
    		return false;
    	}
    	

    	//// frendly for Texture

    	bindTexture(pTexture: ITexture): bool {
    		return false;
    	}
    	
    	unbindTexture(): bool {
    		return false;
    	}
    	


    	//// frendly for render queue
    	render(pEntry: IRenderEntry): void {
    		return;
    	}
    	


    	///public API
    	findEffect(sName?: string): IAFXEffect {
    		return null;
    	}
    	

    	
    	clearScreen(eValue: EBufferMasks, c4Color: IColor): void {
    		return;
    	}
    	
    	switchRenderStage(eType: ERenderStages): void {
    		return;
    	}
    	
    	processRenderStage(): bool {
    		return false;
    	}
    	
    	updateScreen(): bool {
    		return false;
    	}
    	
        /** Load *.fx file or *.abf */
        loadEffectFile(sFilename: string, isSync?: bool): bool {
    		return false;
    	}
    	

        debug(bValue?: bool, bTrace?: bool): bool {
    		return false;
    	}
    	
        isDeviceLost(): bool {
    		return false;
    	}
    	


	}
};

#endif