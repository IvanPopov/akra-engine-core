/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />
/// <reference path="../idl/IRenderer.ts" />

/// <reference path="../config/config.ts" />
/// <reference path="../webgl/webgl.ts" />
/// <reference path="../logger.ts" />

/// <reference path="Effect.ts" />
/// <reference path="VariableBlendContainer.ts" />

/// <reference path="../data/Usage.ts" />

module akra.fx {

	import Usage = data.Usages;

	interface AIAFXVaribaleListMap {
		[index: string]: IAFXVariableDeclInstruction[];
	}

	interface AITypeInfo {
		isComplex: boolean;
		isPointer: boolean;
		isStrictPointer: boolean;
	}

	export class AttributeBlendContainer extends VariableBlendContainer implements IAFXAttributeBlendContainer {

		private _pSlotBySemanticIndex: int[] = null;
		private _pTypeInfoBySemanticIndex: AITypeInfo[] = null;

		private _pFlowBySlots: int[] = null;
		private _pSlotByFlows: int[] = null;
		private _pIsPointerBySlot: boolean[] = null;
		private _pVBByBufferSlots: int[] = null;
		private _pBufferSlotBySlots: int[] = null;

		private _pHashPartList: uint[] = null;

		private _pOffsetVarsBySemanticMap: AIAFXVaribaleListMap = null;
		private _pOffsetDefaultMap: IMap<int> = null;

		private _nSemantics: uint = 0;
		private _nSlots: uint = 0;
		private _nBufferSlots: uint = 0;

		protected _sHash: string = "";

		getAttrsInfo(): IAFXVariableBlendInfo[] {
			return this.getVarsInfo();
		}

		getTotalSlots(): uint {
			return this._nSlots;
		}

		getTotalBufferSlots(): uint {
			return this._nBufferSlots;
		}

		constructor() {
			super();

			this._pSlotBySemanticIndex = null;
			//this._pFlowBySemanticIndex = null;

			var iMaxSlots: uint = 16;
			var iMaxVertexSamplers: uint = 4;

			if (config.WEBGL) {
				iMaxSlots = webgl.maxVertexAttributes;
				iMaxVertexSamplers = webgl.maxVertexTextureImageUnits;
			}

			this._pFlowBySlots = new Array(iMaxSlots);
			this._pSlotByFlows = new Array(iMaxSlots);
			this._pIsPointerBySlot = new Array<boolean>(iMaxSlots);
			this._pVBByBufferSlots = new Array(iMaxVertexSamplers);
			this._pBufferSlotBySlots = new Array(iMaxSlots);
			this._pHashPartList = null;
		}

		getOffsetVarsBySemantic(sName: string): IAFXVariableDeclInstruction[] {
			return this._pOffsetVarsBySemanticMap[sName];
		}

		getOffsetDefault(sName: string): uint {
			return this._pOffsetDefaultMap[sName];
		}

		getSlotBySemanticIndex(iIndex: uint): uint {
			return this._pSlotBySemanticIndex[iIndex];
		}

		getBufferSlotBySemanticIndex(iIndex: uint): uint {
			return this._pBufferSlotBySlots[this.getSlotBySemanticIndex(iIndex)];
		}

		getAttributeListBySemanticIndex(iIndex: uint): IAFXVariableDeclInstruction[] {
			return this.getVarList(iIndex);
		}

		getTypeForShaderAttributeBySemanticIndex(iIndex: uint): IAFXTypeInstruction {
			return this._pIsPointerBySlot[this.getSlotBySemanticIndex(iIndex)] ?
				Effect.getSystemType("ptr") :
				this.getTypeBySemanticIndex(iIndex).getBaseType();
		}


		getTypeBySemanticIndex(iIndex: uint): IAFXVariableTypeInstruction {
			return this.getBlendType(iIndex);
		}

		addAttribute(pVariable: IAFXVariableDeclInstruction): boolean {
			return this.addVariable(pVariable, EAFXBlendMode.k_Attribute);
		}

		hasAttrWithSemantic(sSemantic: string): boolean {
			return this.hasVariableWithName(sSemantic);
		}

		getAttributeBySemanticIndex(iIndex: uint): IAFXVariableDeclInstruction {
			return this.getVariable(iIndex);
		}

		getAttributeBySemantic(sSemantic: string): IAFXVariableDeclInstruction {
			return this.getVariableByName(sSemantic);
		}

		hasTexcoord(iSlot: uint): boolean {
			return this.hasAttrWithSemantic(data.Usages.TEXCOORD + iSlot.toString());
		}

		getTexcoordVar(iSlot: uint): IAFXVariableDeclInstruction {
			return this.getVariableByName(data.Usages.TEXCOORD + iSlot.toString());
		}

		finalize(): void {
			this._nSemantics = this.getAttrsInfo().length;

			this._pSlotBySemanticIndex = new Array(this._nSemantics);
			this._pTypeInfoBySemanticIndex = new Array<AITypeInfo>(this._nSemantics);

			for (var i: uint = 0; i < this._nSemantics; i++) {
				this._pSlotBySemanticIndex[i] = -1;
				this._pTypeInfoBySemanticIndex[i] = this.createTypeInfo(i);
			}

			for (var i: uint = 0; i < this._pFlowBySlots.length; i++) {
				this._pFlowBySlots[i] = -1;
				this._pSlotByFlows[i] = -1;
				this._pIsPointerBySlot[i] = false;
				this._pBufferSlotBySlots[i] = -1;
			}

			for (var i: uint = 0; i < this._pVBByBufferSlots.length; i++) {
				this._pVBByBufferSlots[i] = 0;
			}
		}

		clear(): void {
			this._nSlots = 0;
			this._nBufferSlots = 0;

			this._sHash = "";
		}

		generateOffsetMap(): void {
			this._pOffsetVarsBySemanticMap = <AIAFXVaribaleListMap>{};
			this._pOffsetDefaultMap = <IMap<int>>{};

			var pAttrs: IAFXVariableBlendInfo[] = this.getAttrsInfo();

			for (var i: uint = 0; i < pAttrs.length; i++) {
				var pAttrInfo: IAFXVariableBlendInfo = pAttrs[i];
				var sSemantic: string = pAttrInfo.name;
				var pAttr: IAFXVariableDeclInstruction = this.getAttributeBySemanticIndex(i);

				if (pAttr.isPointer()) {
					this._pOffsetVarsBySemanticMap[sSemantic] = [];
					if (pAttr.getType().isComplex()) {
						var pAttrSubDecls: IAFXVariableDeclInstruction[] = pAttr.getSubVarDecls();

						for (var j: uint = 0; j < pAttrSubDecls.length; j++) {
							var pSubDecl: IAFXVariableDeclInstruction = pAttrSubDecls[j];

							if (pSubDecl.getName() === "offset") {
								var sOffsetName: string = pSubDecl.getRealName();

								this._pOffsetVarsBySemanticMap[sSemantic].push(pSubDecl)
								this._pOffsetDefaultMap[sOffsetName] = (<IAFXVariableDeclInstruction>pSubDecl.getParent()).getType().getPadding();
							}
						}
					}
					else {
						var pOffsetVar: IAFXVariableDeclInstruction = pAttr.getType()._getAttrOffset();
						var sOffsetName: string = pOffsetVar.getRealName();

						this._pOffsetVarsBySemanticMap[sSemantic].push(pOffsetVar);
						this._pOffsetDefaultMap[sOffsetName] = 0;
					}
				}
				else {
					this._pOffsetVarsBySemanticMap[sSemantic] = null;
				}

			}
		}

		initFromBufferMap(pMap: IBufferMap): void {
			this.clear();

			if (isNull(pMap)) {
				logger.critical("Yoy don`t set any buffermap for render");
				return;
			}

			var pAttrs: IAFXVariableBlendInfo[] = this.getAttrsInfo();
			var iHash: uint = 0;

			for (var i: uint = 0; i < pAttrs.length; i++) {
				var pAttrInfo: IAFXVariableBlendInfo = pAttrs[i];
				var sSemantic: string = pAttrInfo.name;
				var pTypeInfo: AITypeInfo = this._pTypeInfoBySemanticIndex[i];

				var pFindFlow: IDataFlow = null;

				if (pTypeInfo.isComplex) {
					// pFindFlow = pMap.findFlow(sSemantic) || pMap.getFlow(sSemantic, true);
					pFindFlow = pMap.findFlow(sSemantic) || pMap.getFlowBySemantic(sSemantic);
				}
				else {
					// pFindFlow = pMap.getFlow(sSemantic, true);
					pFindFlow = pMap.getFlowBySemantic(sSemantic);
				}

				if (!isNull(pFindFlow)) {
					var iBufferSlot: int = -1;
					var iFlow: uint = pFindFlow.flow;
					var iSlot: uint = this._pSlotByFlows[iFlow];

					if (iSlot >= 0 && iSlot < this._nSlots && this._pFlowBySlots[iSlot] === iFlow) {
						this._pSlotBySemanticIndex[i] = iSlot;
						iHash += ((iSlot + 1) << 5 + (this._pBufferSlotBySlots[iSlot] + 1)) << iSlot;
						// continue;
					}
					else {
						iSlot = this._nSlots;

						if (pFindFlow.type === EDataFlowTypes.MAPPABLE) {
							if (!pTypeInfo.isPointer) {
								logger.critical("You try to put pointer data into non-pointer attribute with semantic '" + sSemantic + "'");
							}
							// iSlot = this._pSlotByFlows[iFlow];

							// if(iSlot >= 0 && this._pFlowBySlots[iSlot] === iFlow){
							// 	this._pSlotBySemanticIndex[i] = iSlot;
							// 	iHash += ((iSlot + 1) << 5 + (this._pBufferSlotBySlots[iSlot] + 1)) << iSlot;
							// 	continue;
							// }

							// iSlot = this._nSlots;

							var iBuffer: uint = (<any>pFindFlow.data.getBuffer()).guid;

							for (var j: uint = 0; j < this._nBufferSlots; j++) {
								if (this._pVBByBufferSlots[j] === iBuffer) {
									iBufferSlot = j;
									break;
								}
							}

							if (iBufferSlot === -1) {
								iBufferSlot = this._nBufferSlots;
								this._pVBByBufferSlots[iBufferSlot] = iBuffer;
								this._nBufferSlots++;
							}

							this._pIsPointerBySlot[iSlot] = true;
						}
						else {
							if (pTypeInfo.isStrictPointer) {
								logger.critical("You try to put non-pointer data into pointer attribute with semantic '" + sSemantic + "'");
							}

							this._pIsPointerBySlot[iSlot] = false;
						}
						//new slot
						this._pSlotBySemanticIndex[i] = iSlot;
						this._pFlowBySlots[iSlot] = iFlow;
						this._pSlotByFlows[iFlow] = iSlot;
						this._pBufferSlotBySlots[iSlot] = iBufferSlot;

						iHash += ((iSlot + 1) << 5 + (iBufferSlot + 1)) << iSlot;
						this._nSlots++;
					}
				}
				else {
					this._pSlotBySemanticIndex[i] = -1;
				}
			}

			this._sHash = iHash.toString();
		}

		getHash(): string {
			return this._sHash;
		}


		private createTypeInfo(iIndex: uint): AITypeInfo {
			return <AITypeInfo>{
				isComplex: this.getTypeBySemanticIndex(iIndex).isComplex(),
				isPointer: this.getTypeBySemanticIndex(iIndex).isPointer(),
				isStrictPointer: this.getTypeBySemanticIndex(iIndex).isStrictPointer()
			};
		}
	}
}

