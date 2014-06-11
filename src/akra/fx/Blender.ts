/// <reference path="../idl/IAFXBlender.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />

/// <reference path="../logger.ts" />
/// <reference path="../debug.ts" />

/// <reference path="ComponentBlend.ts" />
/// <reference path="PassBlend.ts" />
/// <reference path="HashTree.ts" />
/// <reference path="fx.ts" />

module akra.fx {
	export class Blender implements IAFXBlender {
		private _pComposer: IAFXComposer = null;


		private _pComponentBlendByHashMap: IAFXComponentBlendMap = null;

		private _pBlendWithComponentMap: IAFXComponentBlendMap = null;
		private _pBlendWithBlendMap: IAFXComponentBlendMap = null;

		private _pPassBlendByHashMap: IAFXPassBlendMap = null;
		private _pPassBlendByIdMap: IAFXPassBlendMap = null;

		private _pPassBlendHashTree: HashTree<IAFXPassBlend> = null;

		private _pTmpRenderStateMap: IMap<ERenderStateValues> = render.createRenderStateMap();

		constructor(pComposer: IAFXComposer) {
			this._pComposer = pComposer;

			this._pComponentBlendByHashMap = <IAFXComponentBlendMap>{};

			this._pBlendWithComponentMap = <IAFXComponentBlendMap>{};
			this._pBlendWithBlendMap = <IAFXComponentBlendMap>{};

			this._pPassBlendByHashMap = <IAFXPassBlendMap>{};
			this._pPassBlendByIdMap = <IAFXPassBlendMap>{};

			this._pPassBlendHashTree = new HashTree<IAFXPassBlend>();
		}

		addComponentToBlend(pComponentBlend: IAFXComponentBlend,
			pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend {

			if (!isNull(pComponentBlend) && pComponentBlend.containComponent(pComponent, iShift, iPass)) {
				debug.warn("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
				return pComponentBlend;
			}

			if (iShift === DEFAULT_SHIFT) {
				if (pComponent.isPostEffect()) {
					iShift = pComponentBlend.getTotalPasses();
				}
				else {
					iShift = 0;
				}
			}

			var sBlendPartHash: string = isDefAndNotNull(pComponentBlend) ? pComponentBlend.guid.toString() : "";
			var sComponentPartHash: string = pComponent.getHash(iShift, iPass);
			var sShortHash: string = sBlendPartHash + "+" + sComponentPartHash;

			if (isDef(this._pBlendWithComponentMap[sShortHash])) {
				return this._pBlendWithComponentMap[sShortHash];
			}

			var pNewBlend: IAFXComponentBlend = null;

			if (isNull(pComponentBlend)) {
				pNewBlend = new ComponentBlend(this._pComposer);
			}
			else {
				pNewBlend = pComponentBlend.clone();
			}

			var pTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			var pTechComponentList: IAFXComponent[] = pTechnique._getFullComponentList();
			var pTechComponentShiftList: int[] = pTechnique._getFullComponentShiftList();

			if (iPass === ALL_PASSES) {
				if (!isNull(pTechComponentList)) {
					for (var i: uint = 0; i < pTechComponentList.length; i++) {
						pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);
					}
				}

				pNewBlend.addComponent(pComponent, iShift, ALL_PASSES);
			}
			else {
				if (!isNull(pTechComponentList)) {
					for (var i: uint = 0; i < pTechComponentList.length; i++) {
						pNewBlend.addComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
					}
				}

				pNewBlend.addComponent(pComponent, iShift, iPass);
			}

			this._pBlendWithComponentMap[sShortHash] = pNewBlend;

			var sNewBlendHash: string = pNewBlend.getHash();

			if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
			}

			return pNewBlend;
		}

		removeComponentFromBlend(pComponentBlend: IAFXComponentBlend,
			pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend {
			if (isNull(pComponentBlend)) {
				logger.warn("You try to remove component '" + pComponent.getName() +
					"' with shift " + iShift.toString() + " from empty blend.");
				return null;
			}

			var pComponentInfo: IAFXComponentInfo = pComponentBlend.findAnyAddedComponentInfo(pComponent, iShift, iPass);
			if (isNull(pComponentInfo)) {
				logger.warn("You try to remove component '" + pComponent.getName() +
					"' with shift " + iShift.toString() + " from blend that not contain it.");
				return null;
			}

			if (iShift === DEFAULT_SHIFT) {
				if (pComponent.isPostEffect()) {
					iShift = pComponentInfo.shift;
				}
				else {
					iShift = 0;
				}
			}

			var sBlendPartHash: string = isDefAndNotNull(pComponentBlend) ? pComponentBlend.guid.toString() : "";
			var sComponentPartHash: string = pComponent.getHash(iShift, iPass);
			var sShortHash: string = sBlendPartHash + "-" + sComponentPartHash;

			if (isDef(this._pBlendWithComponentMap[sShortHash])) {
				return this._pBlendWithComponentMap[sShortHash];
			}

			var pNewBlend: IAFXComponentBlend = pComponentBlend.clone();

			var pTechnique: IAFXTechniqueInstruction = pComponent.getTechnique();
			var pTechComponentList: IAFXComponent[] = pTechnique._getFullComponentList();
			var pTechComponentShiftList: int[] = pTechnique._getFullComponentShiftList();

			if (iPass === ALL_PASSES) {
				if (!isNull(pTechComponentList)) {
					for (var i: uint = 0; i < pTechComponentList.length; i++) {
						pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, ALL_PASSES);
					}
				}

				pNewBlend.removeComponent(pComponent, iShift, ALL_PASSES);
			}
			else {
				if (!isNull(pTechComponentList)) {
					for (var i: uint = 0; i < pTechComponentList.length; i++) {
						pNewBlend.removeComponent(pTechComponentList[i], pTechComponentShiftList[i] + iShift, iPass - pTechComponentShiftList[i]);
					}
				}

				pNewBlend.removeComponent(pComponent, iShift, iPass);
			}

			this._pBlendWithComponentMap[sShortHash] = pNewBlend;

			var sNewBlendHash: string = pNewBlend.getHash();

			if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
			}

			return pNewBlend;
		}

		addBlendToBlend(pComponentBlend: IAFXComponentBlend,
			pAddBlend: IAFXComponentBlend, iShift: int): IAFXComponentBlend {

			//TODO: ADD CORRECT BLENDING FOR POSTEFFECTS
			if (isNull(pComponentBlend)) {
				return pAddBlend;
			}

			if (isNull(pAddBlend)) {
				return pComponentBlend;
			}

			var sShortHash: string = pComponentBlend.guid.toString() + "+" + pAddBlend.guid.toString();
			if (isDef(this._pBlendWithBlendMap[sShortHash])) {
				return this._pBlendWithBlendMap[sShortHash];
			}

			var pNewBlend: IAFXComponentBlend = pComponentBlend.clone();

			var pAddComponentInfoList: IAFXComponentInfo[] = pAddBlend._getComponentInfoList();

			for (var i: uint = 0; i < pAddComponentInfoList.length; i++) {
				pNewBlend.addComponent(pAddComponentInfoList[i].component,
					pAddComponentInfoList[i].shift + iShift,
					pAddComponentInfoList[i].pass);
			}

			this._pBlendWithBlendMap[sShortHash] = pNewBlend;

			var sNewBlendHash: string = pNewBlend.getHash();

			if (isDef(this._pComponentBlendByHashMap[sNewBlendHash])) {
				return this._pComponentBlendByHashMap[sNewBlendHash];
			}
			else {
				this._pComponentBlendByHashMap[sNewBlendHash] = pNewBlend;
			}

			return pNewBlend;
		}

		generatePassBlend(pPassList: IAFXPassInstruction[],
			pComposerStates: any, pForeigns: any, pUniforms: any): IAFXPassBlend {

			this._pPassBlendHashTree.release();

			render.clearRenderStateMap(this._pTmpRenderStateMap);

			for (var i: uint = 0; i < pPassList.length; i++) {
				var pPass: IAFXPassInstruction = pPassList[i];

				pPass._evaluate(pComposerStates, pForeigns, pUniforms);

				render.copyRenderStateMap(pPass._getRenderStates(), this._pTmpRenderStateMap);

				var pVertexShader: IAFXFunctionDeclInstruction = pPass._getVertexShader();
				var pPixelShader: IAFXFunctionDeclInstruction = pPass._getPixelShader();

				this._pPassBlendHashTree.has(isNull(pVertexShader) ? 0 : pVertexShader._getInstructionID());
				this._pPassBlendHashTree.has(isNull(pPixelShader) ? 0 : pPixelShader._getInstructionID());
			}

			var pBlend: IAFXPassBlend = this._pPassBlendHashTree.getContent();

			if (!pBlend) {
				var pNewPassBlend: IAFXPassBlend = new PassBlend(this._pComposer);
				var isOk: boolean = pNewPassBlend.initFromPassList(pPassList);

				if (!isOk) {
					return null;
				}

				this._pPassBlendHashTree.addContent(pNewPassBlend);
				this._pPassBlendByIdMap[pNewPassBlend.guid] = pNewPassBlend;

				return pNewPassBlend;
			}
			else {
				render.clearRenderStateMap(pBlend._getRenderStates());
				render.copyRenderStateMap(this._pTmpRenderStateMap, pBlend._getRenderStates());
				return pBlend;
			}
		}

		getPassBlendById(id: uint): IAFXPassBlend {
			return this._pPassBlendByIdMap[id] || null;
		}
	}
}
