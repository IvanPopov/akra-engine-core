/// <reference path="../idl/IRenderTechnique.ts" />

/// <reference path="../guid.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../events.ts" />
/// <reference path="../util/ObjectArray.ts" />

/// <reference path="RenderPass.ts" />
/// <reference path="../fx/fx.ts" />

module akra.render {
	final export class RenderTechnique implements IRenderTechnique {
		guid: uint = guid();

		render: ISignal<{ (pTech: IRenderTechnique, iPass, pRenderable, pSceneObject, pViewport): void; }>;

		private _pMethod: IRenderMethod = null;

		private _isFreeze: boolean = false;
		private _pComposer: IAFXComposer = null;

		private _pPassList: IRenderPass[] = null;
		private _pPassBlackList: boolean[] = null;

		private _iCurrentPass: uint = 0;
		private _pCurrentPass: IRenderPass = null;

		private _iGlobalPostEffectsStart: uint = 0;
		private _iMinShiftOfOwnBlend: int = 0;

		private _pRenderMethodPassStateList: IObjectArray<IAFXPassInputStateInfo> = null;

		protected static pRenderMethodPassStatesPool: IObjectArray<IAFXPassInputStateInfo> = new util.ObjectArray<IAFXPassInputStateInfo>();

		constructor(pMethod: IRenderMethod = null) {
			this.setupSignals();

			this._pPassList = [];
			this._pPassBlackList = [];

			if (!isNull(pMethod)) {
				this.setMethod(pMethod);
			}

			this._pRenderMethodPassStateList = new util.ObjectArray<IAFXPassInputStateInfo>();
		}

		protected setupSignals(): void {
			this.render = this.render || new Signal(this);
		}

		getModified(): uint {
			return this.guid;
		}

		getTotalPasses(): uint {
			return this._pComposer.getTotalPassesForTechnique(this);
		}

		destroy(): void {

		}

		getPass(iPass: uint): IRenderPass {
			this._pComposer.prepareTechniqueBlend(this);
			return this._pPassList[iPass];
		}

		getMethod(): IRenderMethod {
			return this._pMethod;
		}

		setMethod(pMethod: IRenderMethod): void {
			if (!isNull(this._pMethod)) {
				this._pMethod.altered.disconnect(this, this._updateMethod);
				//this.disconnect(this._pMethod, SIGNAL(altered), SLOT(_updateMethod), EEventTypes.BROADCAST);
			}

			this._pMethod = pMethod;

			if (!isNull(pMethod)) {
				var pComposer: IAFXComposer = pMethod.getManager().getEngine().getComposer();
				this._setComposer(pComposer);
				pMethod.altered.connect(this, this._updateMethod);
				//this.connect(pMethod, SIGNAL(altered), SLOT(_updateMethod), EEventTypes.BROADCAST);
			}

			this._updateMethod(pMethod);
		}

		setState(sName: string, pValue: any): void {

		}

		setForeign(sName: string, pValue: any): void {

		}

		setStruct(sName: string, pValue: any): void {
			//skip
		}

		setTextureBySemantics(sName: string, pValue: any): void {

		}

		setShadowSamplerArray(sName: string, pValue: any): void {

		}

		setVec2BySemantic(sName: string, pValue: any): void {

		}

		isReady(): boolean {
			return this._pMethod.isReady();
		}

		addComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		addComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
		addComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
		addComponent(pComponent: any, iShift: int = 0, iPass: uint = fx.ALL_PASSES): boolean {
			if (isNull(this._pComposer)) {
				return false;
			}

			var pComponentPool: IResourcePool<IAFXComponent> = this._pComposer.getEngine().getResourceManager().getComponentPool();

			if (isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if (isString(pComponent)) {
				pComponent = pComponentPool.findResource(<string>pComponent);
			}

			if (!isDef(pComponent) || isNull(pComponent)) {
				debug.error("Bad component for add.");
				return false;
			}

			if (!this._pComposer.addOwnComponentToTechnique(this, <IAFXComponent>pComponent, iShift, iPass)) {
				debug.error("Can not add component '" + <IAFXComponent>pComponent.findResourceName() + "'");
				return false;
			}

			this._iMinShiftOfOwnBlend = this._pComposer.getMinShiftForOwnTechniqueBlend(this);

			return true;
		}

		delComponent(iComponentHandle: int, iShift?: int, iPass?: uint): boolean;
		delComponent(sComponent: string, iShift?: int, iPass?: uint): boolean;
		delComponent(pComponent: IAFXComponent, iShift?: int, iPass?: uint): boolean;
		delComponent(pComponent: any, iShift: int = 0, iPass: uint = fx.ALL_PASSES): boolean {
			if (isNull(this._pComposer)) {
				return false;
			}

			var pComponentPool: IResourcePool<IAFXComponent> = this._pComposer.getEngine().getResourceManager().getComponentPool();

			if (isInt(pComponent)) {
				pComponent = pComponentPool.getResource(<int>pComponent);
			}
			else if (isString(pComponent)) {
				pComponent = pComponentPool.findResource(<string>pComponent);
			}

			if (!isDef(pComponent) || isNull(pComponent)) {
				debug.error("Bad component for delete.");
				return false;
			}

			if (!this._pComposer.removeOwnComponentToTechnique(this, <IAFXComponent>pComponent, iShift, iPass)) {
				debug.error("Can not delete component '" + <IAFXComponent>pComponent.findResourceName() + "'");
				return false;
			}

			this._iMinShiftOfOwnBlend = this._pComposer.getMinShiftForOwnTechniqueBlend(this);

			return true;
		}

		hasComponent(sComponent: string, iShift: int = fx.ANY_SHIFT, iPass: uint = fx.ANY_PASS): boolean {
			return this._pMethod.getEffect().hasComponent(sComponent, iShift, iPass) || this.hasOwnComponent(sComponent, iShift, iPass);
		}

		hasOwnComponent(sComponent: string, iShift: int = fx.ANY_SHIFT, iPass: uint = fx.ANY_PASS): boolean {
			if (isNull(this._pComposer)) {
				return false;
			}

			var pComponentPool: IResourcePool<IAFXComponent> = this._pComposer.getEngine().getResourceManager().getComponentPool();
			var pComponent: IAFXComponent = null;

			pComponent = <IAFXComponent>pComponentPool.findResource(sComponent);

			if (isNull(pComponent)) {
				return false;
			}

			return this._pComposer.hasOwnComponentInTechnique(this, pComponent, iShift, iPass);
		}

		hasPostEffect(): boolean {
			return this._iGlobalPostEffectsStart > 0;
		}

		isPostEffectPass(iPass: uint): boolean {
			return this._iGlobalPostEffectsStart <= iPass;
		}

		isLastPass(iPass: uint): boolean {
			var iMaxPass: uint = this.getTotalPasses() - 1;

			if (iMaxPass === iPass) {
				return true;
			}

			if (!this._pPassBlackList[iMaxPass]) {
				return false;
			}

			for (var i: uint = this._pPassBlackList.length - 2; i >= 0; i--) {
				if (!this._pPassBlackList[i]) {
					if (i !== iPass) {
						return false;
					}
					else {
						return true;
					}
				}
			}

			return false;
		}

		isFirstPass(iPass: uint): boolean {
			if (iPass === 0) {
				return true;
			}

			if (!this._pPassBlackList[0]) {
				return false;
			}

			for (var i: uint = 1; i < this._pPassBlackList.length; i++) {
				if (!this._pPassBlackList[i]) {
					if (i !== iPass) {
						return false;
					}
					else {
						return true;
					}
				}
			}

			return false;
		}

		isFreeze(): boolean {
			return this._isFreeze;
		}

		updatePasses(bSaveOldUniformValue: boolean): void {
			this._isFreeze = true;

			var iTotalPasses: uint = this.getTotalPasses();

			for (var i: uint = this._pPassList.length; i < iTotalPasses; i++) {
				if (!isDef(this._pPassBlackList[i]) || this._pPassBlackList[i] === false) {
					this._pPassList[i] = new RenderPass(this, i);
					this._pPassBlackList[i] = false;
				}
			}

			for (var i: uint = 0; i < iTotalPasses; i++) {
				if (!this._pPassBlackList[i]) {
					var pInput: IAFXPassInputBlend = this._pComposer.getPassInputBlendForTechnique(this, i);
					if (!isNull(pInput)) {
						this._pPassList[i].setPassInput(pInput, bSaveOldUniformValue);
						this._pPassList[i].activate();
					}
					else {
						this._pPassList[i].deactivate();
					}

				}
			}

			this._isFreeze = false;
		}

		_setComposer(pComposer: IAFXComposer): void {
			this._pComposer = pComposer;
		}

		_getComposer(): IAFXComposer {
			return this._pComposer;
		}

		_renderTechnique(pViewport: IViewport, pRenderable: IRenderableObject, pSceneObject: ISceneObject): void {
			if (isNull(this._pComposer)) {
				return;
			}

			var pComposer: IAFXComposer = this._pComposer;

			pComposer.prepareTechniqueBlend(this);
			pComposer._setCurrentViewport(pViewport);
			pComposer._setCurrentSceneObject(pSceneObject);
			pComposer._setCurrentRenderableObject(pRenderable);
			pComposer.applySurfaceMaterial(this._pMethod.getSurfaceMaterial());

			this._isFreeze = true;

			this.takePassInputsFromRenderMethod();

			var iTotalPasses: uint = this.getTotalPasses();
			for (var i: uint = 0; i < iTotalPasses; i++) {
				if (this._pPassBlackList[i] === false && this._pPassList[i].isActive()) {
					this.activatePass(i);
					this.render.emit(i, pRenderable, pSceneObject, pViewport);
					pViewport.render.emit(this, i, pRenderable, pSceneObject);
					pComposer.renderTechniquePass(this, i);
				}
			}

			this._isFreeze = false;
			pComposer._setDefaultCurrentState();
		}

		_updateMethod(pMethod: IRenderMethod): void {
			this.informComposer();
			this.prepareRenderMethodPassStateInfo(pMethod);
		}

		_blockPass(iPass: uint): void {
			this._pPassBlackList[iPass] = true;
			this._pComposer.prepareTechniqueBlend(this);
			// this._pPassList[iPass] = null; 

		}


		_setPostEffectsFrom(iPass: uint): void {
			this._iGlobalPostEffectsStart = iPass;
		}

		private informComposer(): void {
			if (!isNull(this._pComposer)) {
				this._pComposer.markTechniqueAsNeedUpdate(this);
			}
		}

		private prepareRenderMethodPassStateInfo(pMethod: IRenderMethod): void {
			var iLength: uint = this._pRenderMethodPassStateList.getLength();

			for (var i: uint = 0; i < iLength; i++) {
				this.freePassState(this._pRenderMethodPassStateList.value(i));
			}

			this._pRenderMethodPassStateList.clear();

			if (isNull(pMethod)) {
				return;
			}

			var iMethodTotalPasses: uint = pMethod.getEffect().getTotalPasses();

			for (var i: uint = 0; i < iMethodTotalPasses; i++) {
				var pState: IAFXPassInputStateInfo = this.getFreePassState();
				pState.uniformKey = 0;
				pState.foreignKey = 0;
				pState.samplerKey = 0;
				pState.renderStatesKey = 0;

				this._pRenderMethodPassStateList.push(pState);
			}
		}

		/** 
		 * Copy input data from render method to render technique. 
		 * It's nessasery for adding ability.......
		 */
		private takePassInputsFromRenderMethod(): void {
			if (isNull(this._pMethod)) {
				return;
			}

			var iRenderMethodStartPass: uint = (this._iMinShiftOfOwnBlend < 0) ?
				(-this._iMinShiftOfOwnBlend) : 0;
			var iTotalPasses: uint = this._pMethod.getEffect().getTotalPasses();

			for (var i: uint = 0; i < iTotalPasses; i++) {
				if (this._pPassBlackList[i + iRenderMethodStartPass]) {
					continue;
				}

				var pRenderMethodPassInput: IAFXPassInputBlend = this._pMethod._getPassInput(i);
				var pPassInput: IAFXPassInputBlend = this._pPassList[i].getPassInput();

				if (isNull(pRenderMethodPassInput) || isNull(pPassInput)) {
					continue;
				}

				var pOldStates: IAFXPassInputStateInfo = this._pRenderMethodPassStateList.value(i);
				var pCurrentStates: IAFXPassInputStateInfo = pRenderMethodPassInput.getStatesInfo();

				if (pOldStates.uniformKey !== pCurrentStates.uniformKey) {
					pPassInput._copyUniformsFromInput(pRenderMethodPassInput);
					pOldStates.uniformKey = pCurrentStates.uniformKey;
				}

				if (pOldStates.foreignKey !== pCurrentStates.foreignKey) {
					pPassInput._copyForeignsFromInput(pRenderMethodPassInput);
					pOldStates.foreignKey = pCurrentStates.foreignKey;
				}

				if (pOldStates.samplerKey !== pCurrentStates.samplerKey) {
					pPassInput._copySamplersFromInput(pRenderMethodPassInput);
					pOldStates.samplerKey = pCurrentStates.samplerKey;
				}

				if (pOldStates.renderStatesKey !== pCurrentStates.renderStatesKey) {
					pPassInput._copyRenderStatesFromInput(pRenderMethodPassInput);
					pOldStates.renderStatesKey = pCurrentStates.renderStatesKey;
				}
			}
		}

		private activatePass(iPass: uint): void {
			this._iCurrentPass = iPass;
			this._pCurrentPass = this._pPassList[iPass];
		}

		private getFreePassState(): IAFXPassInputStateInfo {
			if (RenderTechnique.pRenderMethodPassStatesPool.getLength() > 0) {
				return RenderTechnique.pRenderMethodPassStatesPool.pop();
			}
			else {
				return <IAFXPassInputStateInfo>{
					uniformKey: 0,
					foreignKey: 0,
					samplerKey: 0,
					renderStatesKey: 0
				};
			}
		}

		private freePassState(pState: IAFXPassInputStateInfo): void {
			RenderTechnique.pRenderMethodPassStatesPool.push(pState);
		}
	}
}

