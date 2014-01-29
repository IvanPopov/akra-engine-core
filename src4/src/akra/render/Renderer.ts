/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../idl/IAFXComponent.ts" />
/// <reference path="../idl/IAFXEffect.ts" />
/// <reference path="../idl/IAFXPreRenderState.ts" />
/// <reference path="../idl/IAFXComponentBlend.ts" />
/// <reference path="../idl/IAFXPassBlend.ts" />
/// <reference path="../idl/IMesh.ts" />
/// <reference path="../idl/IRenderableObject.ts" />
/// <reference path="../idl/ISceneObject.ts" />
/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IShaderProgram.ts" />
/// <reference path="../idl/ISurfaceMaterial.ts" />
/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../idl/ITexture.ts" />
/// <reference path="../idl/IIndexBuffer.ts" />
/// <reference path="../idl/IRenderResource.ts" />
/// <reference path="../idl/IRenderEntry.ts" />
/// <reference path="../idl/IViewport.ts" />
/// <reference path="../idl/ICanvas3d.ts" />

/// <reference path="Viewport.ts" />
/// <reference path="../events.ts" />

/// <reference path="../render/RenderTarget.ts" />
/// <reference path="../render/RenderQueue.ts" />
/// <reference path="../sort/sort.ts" />

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
		guid: uint = guid();

		active: ISignal<{ (pRender: IRenderer, pEngine: IEngine): void; }>;
		inactive: ISignal<{ (pRender: IRenderer, pEngine: IEngine): void; }>;

		protected _isActive: boolean = false;
		protected _pEngine: IEngine;
		protected _pRenderTargets: IRenderTarget[] = [];
		protected _pPrioritisedRenderTargets: IMap<IRenderTarget[]> = {};
		protected _pPriorityList: int[] = [];
		protected _pRenderQueue: RenderQueue = null;
		protected _pActiveViewport: IViewport = null;
		protected _pActiveRenderTarget: IRenderTarget = null;
		/** TODO: FIX RENDER TARGET LOCK*/
		protected _bLockRenderTarget: boolean = false;

		constructor(pEngine: IEngine) {
			this.setupSignals();

			this._pEngine = pEngine;

			pEngine.active.connect(this.active);
			pEngine.inactive.connect(this.inactive);

			this._pRenderQueue = new RenderQueue(this);
		}

		protected setupSignals(): void {
			this.active = this.active || new Signal(<any>this);
			this.inactive = this.inactive || new Signal(<any>this);

			this.active.setForerunner(this._activated);
			this.inactive.setForerunner(this._inactivated);
		}

		getType(): ERenderers {
			return ERenderers.UNKNOWN;
		}

		getEngine(): IEngine {
			return this._pEngine;
		}


		hasCapability(eCapability: ERenderCapabilities): boolean {
			return false;
		}


		debug(bValue?: boolean, useApiTrace?: boolean): boolean {
			return false;
		}

		isDebug(): boolean {
			return false;
		}

		isValid(): boolean {
			return true;
		}

		getError(): string {
			return null;
		}

		_beginRender(): void { }

		_renderEntry(pEntry: IRenderEntry): void { }

		_endRender(): void { }

		clearFrameBuffer(iBuffer: int, cColor: IColor, fDepth: float, iStencil: uint): void { }

		attachRenderTarget(pTarget: IRenderTarget): boolean {
			if (this._pRenderTargets.indexOf(pTarget) != -1) {
				return false;
			}

			var pList: IRenderTarget[] = this._pPrioritisedRenderTargets[pTarget.getPriority()];

			if (!isDef(pList)) {
				pList = this._pPrioritisedRenderTargets[pTarget.getPriority()] = [];
				this._pPriorityList.push(pTarget.getPriority());
				this._pPriorityList.sort(sort.minMax);
			}

			pList.push(pTarget);

			this._pRenderTargets.push(pTarget);

			return true;
		}

		detachRenderTarget(pTarget: IRenderTarget): boolean {
			var i = this._pRenderTargets.indexOf(pTarget);

			if (i == -1) {
				return false;
			}

			this._pRenderTargets.splice(i, 1);

			i = this._pPrioritisedRenderTargets[pTarget.getPriority()].indexOf(pTarget);
			this._pPrioritisedRenderTargets[pTarget.getPriority()].splice(i, 1);

			return true;
		}

		destroyRenderTarget(pTarget: IRenderTarget): void {
			var hasTarget: boolean = this.detachRenderTarget(pTarget);
			if (hasTarget) {
				pTarget.destroy();
				pTarget = null;
			}
		}

		getActiveProgram(): IShaderProgram {
			logger.critical("Renderer::getActiveProgram() is uncompleted method!");
			return null;
		}

		_disableAllTextureUnits(): void {
			this._disableTextureUnitsFrom(0);
		}

		_disableTextureUnitsFrom(iUnit: uint): void {

		}

		_initRenderTargets(): void {
			// Init stats
			for (var i: int = 0; i < this._pRenderTargets.length; ++i) {
				this._pRenderTargets[i].resetStatistics();
			}
		}

		_updateAllRenderTargets(): void {
			var pTarget: IRenderTarget;
			for (var i: int = 0; i < this._pPriorityList.length; i++) {
				var iPriority: int = this._pPriorityList[i];
				var pTargetList: IRenderTarget[] = this._pPrioritisedRenderTargets[iPriority];

				for (var j = 0; j < pTargetList.length; ++j) {
					pTarget = pTargetList[j];

					if (pTarget.isActive() && pTarget.isAutoUpdated()) {
						pTarget.update();
					}
				}
			}

		}

		_setViewport(pViewport: IViewport): void { }

		_setViewportForRender(pViewport: IViewport): void {
			var isViewportUpdate: boolean = pViewport !== this._pActiveViewport || pViewport.isUpdated();
			var isRenderTargetUpdate: boolean = pViewport.getTarget() !== this._pActiveRenderTarget;

			if (isViewportUpdate || isRenderTargetUpdate) {
				this._setViewport(pViewport);

				if (isViewportUpdate) {
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

		_setRenderTarget(pTarget: IRenderTarget): void { }

		_setCullingMode(eMode: ECullingMode): void { }

		_setDepthBufferParams(bDepthTest: boolean, bDepthWrite: boolean,
			eDepthFunction: ECompareFunction, fClearDepth?: float): void { }

		getDefaultCanvas(): ICanvas3d {
			return null;
		}

		createEntry(): IRenderEntry {
			return this._pRenderQueue.createEntry();
		}

		releaseEntry(pEntry: IRenderEntry): void {
			this._pRenderQueue.releaseEntry(pEntry);
		}

		pushEntry(pEntry: IRenderEntry): void {
			this._pRenderQueue.push(pEntry);
		}

		executeQueue(bSort: boolean = false): void {
			this._pRenderQueue.execute(bSort);
		}

		_lockRenderTarget(): void {
			this._bLockRenderTarget = true;
		}

		_unlockRenderTarget(): void {
			this._bLockRenderTarget = false;
		}

		_isLockRenderTarget(): boolean {
			return this._bLockRenderTarget;
		}

		protected _activated(): void {
			this._isActive = true;
		}

		protected _inactivated(): void {
			this._isActive = false;
		}
		
	}
}