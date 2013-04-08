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
#include "IViewport.ts"
#include "ICanvas3d.ts"
#include "Viewport.ts"

#include "events/events.ts"

#include "render/RenderTarget.ts"
#include "render/RenderQueue.ts"

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
		[priority: int]: IRenderTarget[];
	}

	export class Renderer implements IRenderer {
		protected _isActive: bool = false;
		protected _pEngine: IEngine;
		protected _pRenderTargets: IRenderTarget[] = [];
		protected _pPrioritisedRenderTargets: IRenderTargetPriorityMap = <IRenderTargetPriorityMap>{};
		protected _pRenderQueue: RenderQueue = null;
		protected _pActiveViewport: IViewport = null;
		protected _pActiveRenderTarget: IRenderTarget = null;
		/** TODO: FIX RENDER TARGET LOCK*/
		protected _bLockRenderTarget: bool = false;

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;

			this.connect(pEngine, SIGNAL(active), SLOT(active));
			this.connect(pEngine, SIGNAL(inactive), SLOT(inactive));

			this._pRenderQueue = new RenderQueue(this);
		}


		inline getEngine(): IEngine { return this._pEngine; }
		

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

		_beginRender(): void { }
		
		_renderEntry(pEntry: IRenderEntry): void { }

		_endRender(): void { }

		clearFrameBuffer(iBuffer: int, cColor: IColor, fDepth: float, iStencil: uint): void { }

 		attachRenderTarget(pTarget: IRenderTarget): bool {
 			if (this._pRenderTargets.indexOf(pTarget) != -1) {
 				return false;
 			}

 			var pList: IRenderTarget[] = this._pPrioritisedRenderTargets[pTarget.priority];
 			
 			if (!isDef(pList)) {
 				pList = this._pPrioritisedRenderTargets[pTarget.priority] = [];
 			}
 			
 			pList.push(pTarget);

 			this._pRenderTargets.push(pTarget);

 			return true; 			
 		}

        detachRenderTarget(pTarget: IRenderTarget): bool {
       		var i = this._pRenderTargets.indexOf(pTarget);
       		
       		if (i == -1) {
       			return false;
       		}

       		this._pRenderTargets.splice(i, 1);

       		i = this._pPrioritisedRenderTargets[pTarget.priority].indexOf(pTarget);
       		this._pPrioritisedRenderTargets[pTarget.priority].splice(i, 1);

       		return true;
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
			for (var iPriority in this._pPrioritisedRenderTargets) {
				var pTargetList: IRenderTarget[] = this._pPrioritisedRenderTargets[iPriority];

				for (var j = 0; j < pTargetList.length; ++ j) {
					pTarget = pTargetList[j];
					
					if (pTarget.isActive() && pTarget.isAutoUpdated()) {
						pTarget.update();
					}
				}
			}
			
		}

		_setViewport(pViewport: IViewport): void {}

		_setViewportForRender(pViewport: IViewport): void {
			var isViewportUpdate: bool = pViewport !== this._pActiveViewport || pViewport.isUpdated();
			var isRenderTargetUpdate: bool = pViewport.getTarget() !== this._pActiveRenderTarget;
			
			if(isViewportUpdate || isRenderTargetUpdate){
				this._setViewport(pViewport);

				if(isViewportUpdate){
					// pViewport._clearForFrame();
					var pState: IViewportState = pViewport._getViewportState();

					this._setCullingMode(pState.cullingMode);
		        	this._setDepthBufferParams(pState.depthTest, pState.depthWrite, 
	        							   pState.depthFunction, pState.clearDepth);
	        	}
			}
		}

		_getViewport(): IViewport {
			return this._pActiveViewport;
		}

		_setRenderTarget(pTarget: IRenderTarget): void {}

		_setCullingMode(eMode: ECullingMode): void {}

        _setDepthBufferParams(bDepthTest: bool, bDepthWrite: bool, 
        					  eDepthFunction: ECompareFunction, fClearDepth?: float): void {}

		getDefaultCanvas(): ICanvas3d {
			return null;
		}

		inline createEntry(): IRenderEntry {
			return this._pRenderQueue.createEntry();
		}

        inline releaseEntry(pEntry: IRenderEntry): void {
        	this._pRenderQueue.releaseEntry(pEntry);
        }

        inline pushEntry(pEntry: IRenderEntry): void{
        	this._pRenderQueue.push(pEntry);
        }

        inline executeQueue(): void {
        	this._pRenderQueue.execute();
        }

        protected inline lockRenderTarget(): void {
        	this._bLockRenderTarget = true;
        }

        protected inline unlockRenderTarget(): void {
        	this._bLockRenderTarget = false;
        }

        protected inline isLockRenderTarget(): bool {
        	return this._bLockRenderTarget;
        }

		CREATE_EVENT_TABLE(Renderer);
		signal active(pEngine: IEngine): void {
			this._isActive = true;
			EMIT_BROADCAST(active, _CALL(pEngine));
		}

		signal inactive(pEngine: IEngine): void {
			this._isActive = false;
			EMIT_BROADCAST(inactive, _CALL(pEngine));
		}
		
	}
};

#endif