/// <reference path="../idl/IRenderableObject.ts" />
/// <reference path="../idl/IRenderMethod.ts" />
/// <reference path="../idl/IMap.ts" />

/// <reference path="RenderTechnique.ts" />
/// <reference path="../data/VertexElement.ts" />

/// <reference path="../config/config.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../events.ts" />
/// <reference path="../guid.ts" />

module akra.render {
	import VE = data.VertexElement;
	import DEFAULT_RM = config.defaultName;
	import DEFAULT_RT = config.defaultName;

	export class RenderableObject implements IRenderableObject {
		guid: uint = guid();

		shadowed: ISignal<{ (bValue: boolean): void; }> = new Signal(<any>this);
		beforeRender: ISignal<{ (pViewport, pMethod): void; }> = new Signal(<any>this);

		click: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		mousemove: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		mousedown: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		mouseup: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		mouseover: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		mouseout: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		dragstart: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		dragstop: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);
		dragging: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }> = new Signal(<any>this);

		protected _pRenderData: IRenderData = null;
		protected _pRenderer: IRenderer;
		protected _pTechnique: IRenderTechnique = null;
		protected _pTechniqueMap: IMap<IRenderTechnique> = {};
		protected _eRenderableType: ERenderableTypes;
		protected _bShadow: boolean = true;
		protected _bVisible: boolean = true;
		protected _bFrozen: boolean = false;
		protected _bWireframeOverlay: boolean = false;

		get type(): ERenderableTypes { return this._eRenderableType; }
		get renderMethod(): IRenderMethod { return this._pTechnique.getMethod(); }
		set renderMethod(pMethod: IRenderMethod) { this.switchRenderMethod(pMethod); }
		get effect(): IEffect { return this._pTechnique.getMethod().effect; }
		get surfaceMaterial(): ISurfaceMaterial { return this._pTechnique.getMethod().surfaceMaterial; }
		get material(): IMaterial { return this.surfaceMaterial.material; }
		get data(): IRenderData { return this._pRenderData; }
		get shadow(): boolean { return this._bShadow; }

		set shadow(bShadow: boolean) {
			if (this._bShadow !== bShadow) {
				this._bShadow = bShadow;
				this.shadowed.emit(bShadow);
			}
		}

		set onclick(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.click.connect(fn);
		}

		set onmousemove(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.mousemove.connect(fn);
		}

		set onmousedown(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.mousedown.connect(fn);
		}

		set onmouseup(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.mouseup.connect(fn);
		}

		set onmouseover(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.mouseover.connect(fn);
		}

		set onmouseout(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.mouseout.connect(fn);
		}

		set ondragstart(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.dragstart.connect(fn);
		}

		set ondragstop(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.dragstop.connect(fn);
		}

		set ondragging(
			fn: (pRenderable: IRenderableObject, pViewport: IViewport,
			pObject: ISceneObject, x: uint, y: uint) => void) {
			this.dragging.connect(fn);
		}


		constructor(eType: ERenderableTypes = ERenderableTypes.UNKNOWN) {
			this._eRenderableType = eType;
		}

		_setRenderData(pData: IRenderData): void {
			this._pRenderData = pData;
			return;
		}

		_setup(pRenderer: IRenderer, csDefaultMethod: string = null): void {
			this._pRenderer = pRenderer;

			if (!this.addRenderMethod(csDefaultMethod) || this.switchRenderMethod(null) === false) {
				logger.critical("cannot add & switch render method to default");
			}
		}

		getRenderer(): IRenderer {
			return this._pRenderer;
		}

		destroy(): void {
			this._pRenderer = null;
			this._pTechnique = null;

			for (var i in this._pTechniqueMap) {
				this._pTechniqueMap[i].destroy();
			}

			this._pTechniqueMap = null;
		}

		addRenderMethod(pMethod: IRenderMethod, csName?: string): boolean;
		addRenderMethod(csMethod: string, csName?: string): boolean;
		addRenderMethod(csMethod: any, csName?: string): boolean {
			var pTechnique: IRenderTechnique = new RenderTechnique;
			var pRmgr: IResourcePoolManager = this.getRenderer().getEngine().getResourceManager();
			var pMethod: IRenderMethod = null;

			if (isNull(csMethod)) {
				csMethod = DEFAULT_RM;
			}

			if (isString(csMethod) || arguments.length === 0) {
				pMethod = pRmgr.createRenderMethod((csMethod) + this.guid);

				if (!isDefAndNotNull(pMethod)) {
					logger.critical("resource manager failed to create method...");
					return false;
				}

				//adding empty, but NOT NULL effect & material
				pMethod.surfaceMaterial = pRmgr.createSurfaceMaterial(csMethod + ".material." + this.guid);
				pMethod.effect = pRmgr.createEffect(csMethod + ".effect." + this.guid);
			}
			else {
				pMethod = <IRenderMethod>arguments[0];
			}


			debug.assert(pMethod.getManager().getEngine().getRenderer() === this._pRenderer,
				"Render method should belong to the same engine instance that the renderable object.");

			pTechnique.setMethod(pMethod);
			//pTechnique.name = csName || DEFAULT_RT;

			this._pTechniqueMap[csName || DEFAULT_RT] = pTechnique;

			return true;
		}

		switchRenderMethod(pMethod: IRenderMethod): boolean;
		switchRenderMethod(csName: string): boolean;
		switchRenderMethod(csName: any): boolean {
			var pTechnique: IRenderTechnique;
			var sName: string = null;

			if (isNull(arguments[0])) {
				sName = DEFAULT_RT;
			}
			else if (isString(arguments[0])) {
				sName = <string>csName;
			}
			else if (isDefAndNotNull(arguments[0])) {
				sName = (<IRenderMethod>arguments[0]).findResourceName();

				if (!isDefAndNotNull(this._pTechniqueMap[sName])) {
					if (!this.addRenderMethod(<IRenderMethod>arguments[0], sName)) {
						return false;
					}
				}
			}

			pTechnique = this._pTechniqueMap[sName];

			if (isDefAndNotNull(pTechnique)) {
				this._pTechnique = pTechnique;
				return true;
			}

			return false;
		}

		removeRenderMethod(csName: string): boolean {
			var pTechnique: IRenderTechnique = this._pTechniqueMap[csName];

			if (isDefAndNotNull(pTechnique)) {
				delete this._pTechniqueMap[csName || DEFAULT_RT];
				return true
			}

			return false;
		}



		getRenderMethod(csName: string = null): IRenderMethod {
			var pTechnique: IRenderTechnique = this._pTechniqueMap[csName || DEFAULT_RT];
			return pTechnique ? pTechnique.getMethod() : null;
		}

		getRenderMethodDefault(): IRenderMethod {
			return this.getRenderMethod(DEFAULT_RM);
		}

		isReadyForRender(): boolean {
			return this._bVisible && this._pTechnique.isReady();
		}

		isAllMethodsLoaded(): boolean {
			for (var i in this._pTechniqueMap) {
				var pMethod: IRenderMethod = this._pTechniqueMap[i].getMethod();

				if (!isDefAndNotNull(pMethod) || !pMethod.isResourceLoaded()) {
					return false;
				}
			}

			return true;
		}

		isFrozen(): boolean {
			return this._bFrozen;
		}

		wireframe(bEnable: boolean = true, bOverlay: boolean = true): boolean {
			var pDefaultRm: IRenderMethod = this.getRenderMethodDefault();

			if (!bEnable) {
				if (pDefaultRm.effect.hasComponent("akra.system.wireframe")) {
					pDefaultRm.effect.delComponent("akra.system.wireframe", 0, 0);
				}
				return;
			}

			if (this.data.getDataLocation("BARYCENTRIC") == -1) {
				var ePrimType: EPrimitiveTypes = this.data.getPrimitiveType();

				if (ePrimType !== EPrimitiveTypes.TRIANGLELIST/* && ePrimType !== EPrimitiveTypes.TRIANGLESTRIP*/) {
					logger.warn("wireframe supported only for TRIANGLELIST");
					return false;
				}

				var iPosition: int = this.data.getDataLocation('POSITION');
				var pIndices: Float32Array = <Float32Array>this.data.getIndexFor("POSITION");

				// var pIndices: Float32Array = <any>this.data._getFlow("POSITION").mapper.data.getTypedData(this.data._getFlow("POSITION").mapper.semantics);
				var pBarycentric: Float32Array = new Float32Array(pIndices.length);

				if (ePrimType == EPrimitiveTypes.TRIANGLELIST) {
					for (var n = 0; n < pIndices.length; ++n) {
						pIndices[n] = n;
						pBarycentric[n] = n % 3;
					}
				}


				this.data.allocateData([VE.float('BARYCENTRIC')], pBarycentric);
				this.data.allocateIndex([VE.float('BARYCENTRIC_INDEX')], pIndices);

				this.data.index('BARYCENTRIC', 'BARYCENTRIC_INDEX');
			}

			this._bWireframeOverlay = bOverlay;

			pDefaultRm.effect.addComponent("akra.system.wireframe", 0, 0);
		}


		render(pViewport: IViewport, csMethod: string = null, pSceneObject: ISceneObject = null): void {
			if (!this.isReadyForRender() || (!isNull(pSceneObject) && pSceneObject.isHidden())) {
				return;
			}

			if (!this.switchRenderMethod(csMethod)) {
				//debug.error("could not switch render method <" + csMethod + ">");
				return;
			}

			this.beforeRender.emit(pViewport, this._pTechnique.getMethod());

			this.data._draw(this._pTechnique, pViewport, this, pSceneObject);
		}

		getTechnique(sName: string = DEFAULT_RT): IRenderTechnique {
			return this._pTechniqueMap[sName] || null;
		}

		getTechniqueDefault(): IRenderTechnique {
			return this.getTechnique(DEFAULT_RT);
		}

		_draw(): void {
			logger.error("RenderableObject::_draw() pure virtual method() isn't callable!!");
		}

		isVisible(): boolean {
			return this._bVisible;
		}
		setVisible(bVisible: boolean = true): void {
			this._bVisible = bVisible;
		}

		//CREATE_EVENT_TABLE(RenderableObject);
	}

	

	export function isScreen(pObject: IRenderableObject): boolean {
		return pObject.type === ERenderableTypes.SCREEN;
	}

	export function isSprite(pObject: IRenderableObject): boolean {
		return pObject.type === ERenderableTypes.SPRITE;
	}
}
