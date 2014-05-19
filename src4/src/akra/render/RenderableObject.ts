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

		shadowed: ISignal<{ (pRenderable: IRenderableObject, bValue: boolean): void; }>;

		beforeRender: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pMethod: IRenderMethod): void; }>;

		click: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mousemove: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mousedown: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mouseup: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mouseover: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mouseout: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		mousewheel: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y, fDelta): void; }>;

		dragstart: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		dragstop: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;
		dragging: ISignal<{ (pRenderable: IRenderableObject, pViewport: IViewport, pObject: ISceneObject, x, y): void; }>;

		protected _pRenderData: IRenderData = null;
		protected _pRenderer: IRenderer;
		protected _pTechnique: IRenderTechnique = null;
		protected _pTechniqueMap: IMap<IRenderTechnique> = {};
		protected _eRenderableType: ERenderableTypes;
		protected _bShadow: boolean = true;
		protected _bVisible: boolean = true;
		protected _bFrozen: boolean = false;
		protected _bWireframeOverlay: boolean = false;

		constructor(eType: ERenderableTypes = ERenderableTypes.UNKNOWN) {
			this.setupSignals();

			this._eRenderableType = eType;
		}

		protected setupSignals(): void {
			this.shadowed = this.shadowed || new Signal(this);
			this.beforeRender = this.beforeRender || new Signal(this);

			this.click = this.click || new Signal(this);

			this.mousemove = this.mousemove || new Signal(this);
			this.mousedown = this.mousedown || new Signal(this);
			this.mouseup = this.mouseup || new Signal(this);
			this.mouseover = this.mouseover || new Signal(this);
			this.mouseout = this.mouseout || new Signal(this);
			this.mousewheel = this.mousewheel || new Signal(this);

			this.dragstart = this.dragstart || new Signal(this);
			this.dragstop = this.dragstop || new Signal(this);
			this.dragging = this.dragging || new Signal(this);
		}

		getType(): ERenderableTypes {
			return this._eRenderableType;
		}

		getEffect(): IEffect {
			return this._pTechnique.getMethod().getEffect();
		}

		getSurfaceMaterial(): ISurfaceMaterial {
			return this._pTechnique.getMethod().getSurfaceMaterial();
		}

		getMaterial(): IMaterial {
			return this.getSurfaceMaterial().getMaterial();
		}

		getData(): IRenderData {
			return this._pRenderData;
		}

		getRenderMethod(): IRenderMethod {
			return this._pTechnique.getMethod();
		}

		getRenderID(pObject: ISceneObject = null): int {
			var pComposer: IAFXComposer = this._pRenderData._getComposer();
			return pComposer._calcRenderID(pObject, this);
		}

		setRenderMethod(pMethod: IRenderMethod): void {
			this.switchRenderMethod(pMethod);
		}

		getShadow(): boolean {
			return this._bShadow;
		}

		setShadow(bShadow: boolean): void {
			if (this._bShadow !== bShadow) {
				this._bShadow = bShadow;
				//debug.log("MeshSubset(" + this.guid + ")::setShadow(" + bShadow + ")");
				//console.trace();
				this.shadowed.emit(bShadow);
			}
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

			if (!isDefAndNotNull(csMethod)) {
				csMethod = DEFAULT_RM;
			}

			if (isString(csMethod) || arguments.length === 0) {
				pMethod = pRmgr.createRenderMethod((csMethod) + this.guid);

				if (!isDefAndNotNull(pMethod)) {
					logger.critical("resource manager failed to create method...");
					return false;
				}

				//adding empty, but NOT NULL effect & material
				pMethod.setSurfaceMaterial(pRmgr.createSurfaceMaterial(csMethod + ".material." + this.guid));
				pMethod.setEffect(pRmgr.createEffect(csMethod + ".effect." + this.guid));
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
		switchRenderMethod(pNameOrMethod: any): boolean {
			var pTechnique: IRenderTechnique;
			var sName: string = null;

			if (isNull(pNameOrMethod)) {
				sName = DEFAULT_RT;
			}
			else if (isString(pNameOrMethod)) {
				sName = <string>pNameOrMethod;
			}
			else if (isDefAndNotNull(pNameOrMethod)) {
				sName = (<IRenderMethod>pNameOrMethod).findResourceName();

				if (!isDefAndNotNull(this._pTechniqueMap[sName])) {
					if (!this.addRenderMethod(<IRenderMethod>pNameOrMethod, sName)) {
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



		getRenderMethodByName(csName: string = null): IRenderMethod {
			var pTechnique: IRenderTechnique = this._pTechniqueMap[csName || DEFAULT_RT];
			return pTechnique ? pTechnique.getMethod() : null;
		}

		getRenderMethodDefault(): IRenderMethod {
			return this.getRenderMethodByName(DEFAULT_RM);
		}

		isReadyForRender(): boolean {
			return this._bVisible && this._pTechnique.isReady();
		}

		isAllMethodsLoaded(): boolean {
			for (var i in this._pTechniqueMap) {
				var pMethod: IRenderMethod = this._pTechniqueMap[i].getMethod();

				if (!isDefAndNotNull(pMethod) || pMethod.isReady()) {
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
				if (pDefaultRm.getEffect().hasComponent("akra.system.wireframe")) {
					pDefaultRm.getEffect().delComponent("akra.system.wireframe", 0, 0);
				}
				return;
			}

			if (this.getData().getDataLocation("BARYCENTRIC") == -1) {
				var ePrimType: EPrimitiveTypes = this.getData().getPrimitiveType();

				if (ePrimType !== EPrimitiveTypes.TRIANGLELIST/* && ePrimType !== EPrimitiveTypes.TRIANGLESTRIP*/) {
					logger.warn("wireframe supported only for TRIANGLELIST");
					return false;
				}

				var iPosition: int = this.getData().getDataLocation('POSITION');
				var pIndices: Float32Array = <Float32Array>this.getData().getIndexFor("POSITION");

				// var pIndices: Float32Array = <any>this.data._getFlow("POSITION").mapper.data.getTypedData(this.data._getFlow("POSITION").mapper.semantics);
				var pBarycentric: Float32Array = new Float32Array(pIndices.length);

				if (ePrimType == EPrimitiveTypes.TRIANGLELIST) {
					for (var n = 0; n < pIndices.length; ++n) {
						pIndices[n] = n;
						pBarycentric[n] = n % 3;
					}
				}


				this.getData().allocateData([VE.float('BARYCENTRIC')], pBarycentric);
				this.getData().allocateIndex([VE.float('BARYCENTRIC_INDEX')], pIndices);

				this.getData().index('BARYCENTRIC', 'BARYCENTRIC_INDEX');
			}
			
			this._bWireframeOverlay = bOverlay;

			pDefaultRm.getEffect().addComponent("akra.system.wireframe", 0, 0);
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

			this.getData()._draw(this._pTechnique, pViewport, this, pSceneObject);
		}

		getTechnique(sName: string = DEFAULT_RT): IRenderTechnique {
			return this._pTechniqueMap[sName || DEFAULT_RT] || null;
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
		return pObject.getType() === ERenderableTypes.SCREEN;
	}

	export function isSprite(pObject: IRenderableObject): boolean {
		return pObject.getType() === ERenderableTypes.SPRITE;
	}
}
