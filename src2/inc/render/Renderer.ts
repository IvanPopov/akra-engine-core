#ifndef RENDERER_TS
#define RENDERER_TS

#include "IRenderer.ts"

#include "IAFXComponent.ts"
#include "IAFXEffect.ts"
#include "IAFXPreRenderState.ts"
#include "IAFXComponentBlend.ts"
#include "IAFXPassBlend.ts"
#include "IMesh.ts"
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

#include "events/events.ts"

#include "render/RenderTarget.ts"

module  akra.render {


	export var SShaderPrefixes = {
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

	export var SSystemSemantics = {
		MODEL_MATRIX: 		"MODEL_MATRIX",
		VIEW_MATRIX: 		"VIEW_MATRIX",
		PROJ_MATRIX: 		"PROJ_MATRIX",
		NORMAL_MATRIX: 		"NORMAL_MATRIX",
		BIND_MATRIX: 		"BIND_SHAPE_MATRIX",
		RENDER_OBJECT_ID: 	"RENDER_OBJECT_ID"
	}

	export interface IRenderTargetPriorityMap {
		[index: int]: IRenderTarget;
	}

	export class Renderer implements IRenderer {
		protected _isActive: bool = false;
		protected _pEngine: IEngine;
		protected _pRenderTargets: IRenderTarget[];
		protected _pPrioritisedRenderTargets: IRenderTargetPriorityMap;

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;

			this.connect(pEngine, SIGNAL(active), SLOT(active));
			this.connect(pEngine, SIGNAL(inactive), SLOT(inactive));
		}


		inline getEngine(): IEngine { return this. _pEngine; }

	    hasCapability(eCapability: ERenderCapabilities): bool {
	      return false;
	    }


		debug(bValue?: bool, useApiTrace?: bool): bool {
			return false;
		}
		
		isDebug(): bool {
			return false;
		}

		isValid(): bool {
			return false;
		}

		inline getError(): string {
			return null;
		}

		clearFrameBuffer(iBuffer: int, cColor: IColor, iDepth: int): void {

		}

 		attachRenderTarget(pTarget: IRenderTarget): bool {
 			for(var i: uint = 0; i < this._pRenderTargets.length; i++){
       			if(this._pRenderTargets[i] === pTarget){
       				return false;
       			}
       		}

 			this._pRenderTargets.push(pTarget);
 			return true; 			
 		}

        detachRenderTarget(pTarget: IRenderTarget): bool {
       		for(var i: uint = 0; i < this._pRenderTargets.length; i++){
       			if(this._pRenderTargets[i] === pTarget){
       				this._pRenderTargets.splice(i, 1);
       				return true;
       			}
       		}

       		return false;
        }

        destroyRenderTarget(pTarget: IRenderTarget): void {
        	var hasTarget: bool = this.detachRenderTarget(pTarget);
        	if(hasTarget){
        		pTarget.destroy();
        		pTarget = null;
        	}
        }

        getActiveProgram(): IShaderProgram {
        	CRITICAL("Renderer::getActiveProgram() is uncompleted method!");
        	return null;
        }

		inline _disableAllTextureUnits(): void {
			this._disableTextureUnitsFrom(0);
		}

		inline _disableTextureUnitsFrom(iUnit: uint): void {

		}

		_initRenderTargets(): void {
			// Init stats
	        for(var i: int = 0; i < this._pRenderTargets.length; ++ i) {
	            this._pRenderTargets[i].resetStatistics();
	        }
		}

		_updateAllRenderTargets(): void {
			var pTarget: IRenderTarget;
			for (var i in this._pPrioritisedRenderTargets) {
				pTarget = this._pPrioritisedRenderTargets[i];

				if (pTarget.isActive() && pTarget.isAutoUpdated()) {
					pTarget.update();
				}
			}
		}

		_setViewport(pViewport: IViewport): void {

		}

		_getViewport(): IViewport {
			return null;
		}

		BEGIN_EVENT_TABLE(Renderer);
			signal active(pEngine: IEngine): void {
				this._isActive = true;
				EMIT_BROADCAST(active, _CALL(pEngine));
			}

			signal inactive(pEngine: IEngine): void {
				this._isActive = false;
				EMIT_BROADCAST(inactive, _CALL(pEngine));
			}
		END_EVENT_TABLE();
	}
};

#endif