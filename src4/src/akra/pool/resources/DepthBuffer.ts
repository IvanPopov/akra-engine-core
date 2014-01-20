/// <reference path="../../idl/IDepthBuffer.ts" />
/// <reference path="../../idl/IRenderTarget.ts" />

/// <reference path="../ResourcePoolItem.ts" />

module akra.pool.resources {
	export class DepthBuffer extends ResourcePoolItem implements IDepthBuffer {
		protected _iBitDepth: uint = 0;
		protected _iWidth: uint = 0;
		protected _iHeight: uint = 0;
		protected _isManual: boolean = false;
		protected _pAttachedRenderTargetsList: IRenderTarget[] = null;

		constructor() {
			super();
		}

		 get bitDepth(): uint {
			return this._iBitDepth;
		}

		 get width(): uint {
			return this._iWidth;
		}

		 get height(): uint {
			return this._iHeight;
		}

		create(iBitDepth: uint, iWidth: uint, iHeight: uint, isManual: boolean): boolean {
			this._iBitDepth = iBitDepth;
			this._iWidth = iWidth;
			this._iHeight = iHeight;
			this._isManual = isManual;
			this._pAttachedRenderTargetsList = [];

			this.notifyCreated();

			return true;
		}

		destroy(): void {
			this.detachFromAllRenderTargets();
			this._pAttachedRenderTargetsList = null;
		}

		destroyResource(): boolean {
			this.destroy();
			this.notifyDestroyed();
			return true;
		}

		isManual(): boolean{
			return this._isManual;
		}

		isCompatible(pTarget: IRenderTarget): boolean {
			if( this._iWidth >= pTarget.width &&
				this._iHeight >= pTarget.height ){
				return true;
			}

			return false;
		}

		_notifyRenderTargetAttached(pTarget: IRenderTarget): void {
			logger.assert(this._pAttachedRenderTargetsList.indexOf(pTarget) === -1, 
				   "RenderTarget alrady has been attached to this DepthBuffer");

			this._pAttachedRenderTargetsList.push(pTarget);
		}

		_notifyRenderTargetDetached(pTarget: IRenderTarget): void {
			var index: int = this._pAttachedRenderTargetsList.indexOf(pTarget);
			logger.assert(index !== -1, 
				   "Can not detach RenderTarget from DepthBuffer beacuse it hasn`t been attached to it");

			this._pAttachedRenderTargetsList.splice(index, 1);	
		}

		protected detachFromAllRenderTargets(): void {
			var i: uint = 0;
			for(i = 0; i < this._pAttachedRenderTargetsList.length; i++) {
				//If we call, detachDepthBuffer, we'll invalidate the iterators
				this._pAttachedRenderTargetsList[i].detachDepthBuffer();
			}

			this._pAttachedRenderTargetsList.clear();
		}
	}
}
