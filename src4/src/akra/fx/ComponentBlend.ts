/// <reference path="../idl/IAFXComponentBlend.ts" />
/// <reference path="../idl/IAFXComposer.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />

/// <reference path="../guid.ts" />
/// <reference path="../debug.ts" />

/// <reference path="fx.ts" />
/// <reference path="ComponentPassInputBlend.ts" />


module akra.fx {


	export class ComponentBlend implements IAFXComponentBlend {
		guid: uint = guid();

		private _pComposer: IAFXComposer = null;

		private _isReady: boolean = false;
		private _sHash: string = "";
		private _bNeedToUpdateHash: boolean = false;

		private _pComponentHashMap: IMap<boolean> = null;

		private _pAddedComponentInfoList: IAFXComponentInfo[] = null;

		private _iShiftMin: int = 0;
		private _iShiftMax: int = 0;
		private _nTotalPasses: uint = 0;
		private _iPostEffectsStart: uint = 0;

		private _pPassesDList: IAFXPassInstruction[][] = null;
		private _pComponentInputVarBlend: ComponentPassInputBlend[] = null;

		constructor(pComposer: IAFXComposer) {
			this._pComposer = pComposer;

			this._pComponentHashMap = <IMap<boolean>>{};

			this._pAddedComponentInfoList = [];
		}

		_getMinShift(): int {
			return this._iShiftMin;
		}

		_getMaxShift(): int {
			return this._iShiftMax;
		}

		isReadyToUse(): boolean {
			return this._isReady;
		}

		isEmpty(): boolean {
			return this._pAddedComponentInfoList.length === 0;
		}

		getComponentCount(): uint {
			return this._pAddedComponentInfoList.length;
		}

		getTotalPasses(): uint {
			return !isNull(this._pPassesDList) ? this._pPassesDList.length : (this._iShiftMax - this._iShiftMin + 1);
		}

		hasPostEffect(): boolean {
			return this._iPostEffectsStart > 0;
		}

		getPostEffectStartPass(): uint {
			return this._iPostEffectsStart;
		}

		getHash(): string {
			if (this._bNeedToUpdateHash) {
				this._sHash = this.calcHash();
				this._bNeedToUpdateHash = false;
			}

			return this._sHash;
		}

		containComponent(pComponent: IAFXComponent, iShift: int, iPass: uint): boolean {
			var iCorrectShift: uint = iShift;
			var iCorrectPass: uint = iPass;

			if (iShift === DEFAULT_SHIFT) {
				if (pComponent.isPostEffect()) {
					iCorrectShift = ANY_SHIFT;
				}
				else {
					iCorrectShift = 0;
				}
			}

			if (iPass === fx.ALL_PASSES) {
				var iPassCount: uint = pComponent.getTotalPasses();
				for (var i: uint = 0; i < iPassCount; i++) {
					if (!this.containComponent(pComponent, iCorrectShift === ANY_SHIFT ? ANY_SHIFT : (iCorrectShift + i), i)) {
						return false;
					}
				}

				return true;
			}

			if (iCorrectShift !== ANY_SHIFT && iCorrectPass !== ANY_PASS) {
				return this.containComponentHash(pComponent.getHash(iCorrectShift, iCorrectPass));
			}
			else {
				for (var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
					var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

					if (pInfo.component === pComponent) {
						if (iCorrectShift === ANY_SHIFT && iCorrectPass === ANY_PASS) {
							return true;
						}
						else if (iCorrectShift === ANY_SHIFT && pInfo.pass === iCorrectPass) {
							return true;
						}
						else if (iCorrectPass === ANY_PASS && pInfo.shift === iCorrectShift) {
							return true;
						}
					}
				}

				return false;
			}
		}

		containComponentHash(sComponentHash: string): boolean {
			return (this._pComponentHashMap[sComponentHash]);
		}

		findAnyAddedComponentInfo(pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentInfo {
			var iCorrectShift: uint = iShift;
			var iCorrectPass: uint = iPass;

			if (iPass === ALL_PASSES) {
				iCorrectPass = ANY_PASS;
			}

			if (iShift === DEFAULT_SHIFT) {
				if (pComponent.isPostEffect()) {
					iCorrectShift = ANY_SHIFT;
				}
				else {
					iCorrectShift = 0;
				}
			}

			if (iCorrectShift !== ANY_SHIFT && iCorrectPass !== ANY_PASS &&
				!this.containComponentHash(pComponent.getHash(iCorrectShift, iCorrectPass))) {

				return null;
			}
			else {
				for (var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
					var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

					if (pInfo.component === pComponent) {
						if (iCorrectShift === ANY_SHIFT && iCorrectPass === ANY_PASS) {
							return pInfo;
						}
						else if (iCorrectShift === ANY_SHIFT && pInfo.pass === iCorrectPass) {
							return pInfo;
						}
						else if (iCorrectPass === ANY_PASS && pInfo.shift === iCorrectShift) {
							return pInfo;
						}
						else if (pInfo.pass === iCorrectPass && pInfo.shift === iCorrectShift) {
							return pInfo;
						}
					}
				}

				return null;
			}
		}

		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void {
			var iPassCount: uint = pComponent.getTotalPasses();

			if (iPass === ALL_PASSES) {

				for (var i: uint = 0; i < iPassCount; i++) {
					this.addComponent(pComponent, iShift + i, i);
				}

				return;
			}
			else if (iPass < 0 || iPass >= iPassCount) {
				return;
			}

			var sComponentHash: string = pComponent.getHash(iShift, iPass);
			if (this.containComponentHash(sComponentHash)) {
				debug.warn("You try to add already used component '" + pComponent.findResourceName() + "' in blend.");
				return;
			}

			if (iShift < this._iShiftMin) {
				this._iShiftMin = iShift;
			}

			if (iShift > this._iShiftMax) {
				this._iShiftMax = iShift;
			}

			var pInfo: IAFXComponentInfo = <IAFXComponentInfo>{
				component: pComponent,
				shift: iShift,
				pass: iPass,
				hash: sComponentHash
			};

			this._pComponentHashMap[sComponentHash] = true;
			this._pAddedComponentInfoList.push(pInfo);

			this._isReady = false;
			this._iPostEffectsStart = 0;
			this._bNeedToUpdateHash = true;
		}

		removeComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void {
			var sComponentHash: string = pComponent.getHash(iShift, iPass);
			var iPassCount: uint = pComponent.getTotalPasses();

			if (iPass === ALL_PASSES) {
				for (var i: uint = 0; i < iPassCount; i++) {
					this.removeComponent(pComponent, iShift + i, i);
				}

				return;
			}
			else if (iPass < 0 || iPass >= iPassCount) {
				return;
			}

			if (!this.containComponentHash(sComponentHash)) {
				debug.warn("You try to remove not used component '" + sComponentHash + "' from blend.");
				return;
			}

			this._pComponentHashMap[sComponentHash] = false;

			for (var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
				var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

				if (pInfo.component === pComponent &&
					pInfo.shift === iShift &&
					pInfo.pass === iPass) {

					this._pAddedComponentInfoList.splice(i, 1);
					break;
				}
			}

			if (this._iShiftMin === iShift || this._iShiftMax === iShift) {
				this._iShiftMax = 0;
				this._iShiftMin = 0;

				for (var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
					var iTestShift: uint = this._pAddedComponentInfoList[i].shift;

					if (iTestShift < this._iShiftMin) {
						this._iShiftMin = iTestShift;
					}

					if (iTestShift > this._iShiftMax) {
						this._iShiftMax = iTestShift;
					}
				}
			}

			this._isReady = false;
			this._iPostEffectsStart = 0;
			this._bNeedToUpdateHash = true;
		}

		finalizeBlend(): boolean {
			if (this._isReady) {
				return true;
			}

			this._pPassesDList = [];
			this._pComponentInputVarBlend = [];

			for (var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
				var pInfo: IAFXComponentInfo = this._pAddedComponentInfoList[i];

				var pComponentTechnique: IAFXTechniqueInstruction = pInfo.component.getTechnique();
				var iShift: int = pInfo.shift - this._iShiftMin;
				var iPass: int = pInfo.pass;

				var pPass: IAFXPassInstruction = pComponentTechnique._getPass(iPass);

				if (!isDef(this._pPassesDList[iShift])) {
					this._pPassesDList[iShift] = [];
					this._pComponentInputVarBlend[iShift] = new ComponentPassInputBlend();
				}

				this._pPassesDList[iShift].push(pPass);
				this._pComponentInputVarBlend[iShift].addDataFromPass(pPass);

				if (pInfo.component.isPostEffect()) {
					if (this._iPostEffectsStart === 0 || iShift < this._iPostEffectsStart) {
						this._iPostEffectsStart = iShift;
					}
				}
			}

			for (var i: uint = 0; i < this._pComponentInputVarBlend.length; i++) {
				if (isDef(this._pComponentInputVarBlend[i])) {
					this._pComponentInputVarBlend[i].finalizeInput();
				}
				else {
					this._pComponentInputVarBlend[i] = null;
					this._pPassesDList[i] = null;
				}
			}

			this._isReady = true;

			return true;
		}

		getPassInputForPass(iPass: uint): IAFXPassInputBlend {
			if (!this._isReady) {
				return null;
			}

			if (iPass < 0 || iPass > this.getTotalPasses() ||
				isNull(this._pComponentInputVarBlend[iPass])) {
				return null;
			}

			return this._pComponentInputVarBlend[iPass].getPassInput();
		}

		getPassListAtPass(iPass: uint): IAFXPassInstruction[] {
			if (!this._isReady) {
				return null;
			}

			if (iPass < 0 || iPass > this.getTotalPasses()) {
				return null;
			}

			return this._pPassesDList[iPass];
		}

		clone(): IAFXComponentBlend {
			var pClone: IAFXComponentBlend = new ComponentBlend(this._pComposer);

			pClone._setDataForClone(this._pAddedComponentInfoList,
				this._pComponentHashMap,
				this._iShiftMin, this._iShiftMax);
			return pClone;
		}

		_getComponentInfoList(): IAFXComponentInfo[] {
			return this._pAddedComponentInfoList;
		}

		_setDataForClone(pComponentInfoList: IAFXComponentInfo[],
			pComponentHashMap: IMap<boolean>,
			iShiftMin: int, iShiftMax: int): void {

			for (var i: uint = 0; i < pComponentInfoList.length; i++) {
				this._pAddedComponentInfoList.push({
					component: pComponentInfoList[i].component,
					shift: pComponentInfoList[i].shift,
					pass: pComponentInfoList[i].pass,
					hash: pComponentInfoList[i].hash
				});

				this._pComponentHashMap[pComponentInfoList[i].hash] = pComponentHashMap[pComponentInfoList[i].hash];
			}

			this._iShiftMin = iShiftMin;
			this._iShiftMax = iShiftMax;
			this._bNeedToUpdateHash = true;
		}

		private calcHash(): string {
			var sHash: string = "";

			if (this.isEmpty()) {
				return ComponentBlend.EMPTY_BLEND;
			}

			for (var i: uint = 0; i < this._pAddedComponentInfoList.length; i++) {
				sHash += this._pAddedComponentInfoList[i].hash + ":";
			}

			return sHash;
		}

		static EMPTY_BLEND: string = "EMPTY_BLEND";
	}
}
