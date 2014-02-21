/// <reference path="../idl/IAFXVariableContainer.ts" />
/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../idl/IMap.ts" />

/// <reference path="../sort/sort.ts" />

/// <reference path="instructions/VariableInstruction.ts" />

module akra.fx {

	export class VariableContainer implements IAFXVariableContainer {
		private _pNameToIndexMap: IMap<int> = null;
		private _pRealNameToIndexMap: IMap<int> = null;
		private _pIndexList: uint[] = null;
		private _pVariableInfoMap: IMap<IAFXVariableInfo> = null;

		private _bLock: boolean = false;

		constructor() {
			this._pNameToIndexMap = <IMap<int>>{};
			this._pRealNameToIndexMap = <IMap<int>>{};
			this._pVariableInfoMap = <IMap<IAFXVariableInfo>>{};
		}

		getIndices(): uint[] {
			return this._pIndexList;
		}

		add(pVar: IAFXVariableDeclInstruction): void {
			if (this._bLock) {
				return;
			}

			var iIndex: uint = pVar._getNameIndex();
			var sName: string = pVar.getName();
			var sRealName: string = pVar.getRealName();

			this._pNameToIndexMap[sName] = iIndex;
			this._pRealNameToIndexMap[sRealName] = iIndex;
			this._pVariableInfoMap[iIndex] = <IAFXVariableInfo>{
				variable: pVar,
				type: VariableContainer.getVariableType(pVar),
				name: sName,
				realName: sRealName,
				isArray: pVar.getType().isNotBaseArray(),
			};
		}

		addSystemEntry(sName: string, eType: EAFXShaderVariableType): void {
			var iIndex: uint = instructions.VariableDeclInstruction.pShaderVarNamesGlobalDictionary.add(sName);

			this._pNameToIndexMap[sName] = iIndex;
			this._pRealNameToIndexMap[sName] = iIndex;
			this._pVariableInfoMap[iIndex] = <IAFXVariableInfo>{
				variable: null,
				type: eType,
				name: sName,
				realName: sName,
				isArray: false
			};
		}

		finalize(): void {
			var pTmpKeys: string[] = Object.keys(this._pVariableInfoMap);
			this._pIndexList = new Array(pTmpKeys.length);

			for (var i: uint = 0; i < pTmpKeys.length; i++) {
				this._pIndexList[i] = +pTmpKeys[i];
			}
			this._pIndexList.sort(sort.minMax);
			this._bLock = true;
		}

		getVarInfoByIndex(iIndex: uint): IAFXVariableInfo {
			return this._pVariableInfoMap[iIndex];
		}

		getVarByIndex(iIndex: uint): IAFXVariableDeclInstruction {
			return this.getVarInfoByIndex(iIndex).variable;
		}

		getTypeByIndex(iIndex: uint): EAFXShaderVariableType {
			return this.getVarInfoByIndex(iIndex).type;
		}

		isArrayVariable(iIndex: uint): boolean {
			return this.getVarInfoByIndex(iIndex).isArray;
		}

		getIndexByName(sName: string): uint {
			return this._pNameToIndexMap[sName] || (this._pNameToIndexMap[sName] = 0);
		}

		getIndexByRealName(sName: string): uint {
			return this._pRealNameToIndexMap[sName] || (this._pRealNameToIndexMap[sName] = 0);
		}

		hasVariableWithName(sName: string): boolean {
			return !!(this.getIndexByName(sName));
		}

		hasVariableWithRealName(sName: string): boolean {
			return !!(this.getIndexByRealName(sName));
		}

		getVarByName(sName: string): IAFXVariableDeclInstruction {
			var iIndex: uint = this.getIndexByName(sName);

			if (iIndex === 0) {
				return null;
			}
			else {
				return this.getVarByIndex(iIndex);
			}
		}

		getVarByRealName(sName: string): IAFXVariableDeclInstruction {
			var iIndex: uint = this.getIndexByRealName(sName);

			if (iIndex === 0) {
				return null;
			}
			else {
				return this.getVarByIndex(iIndex);
			}
		}

		static getVariableType(pVar: IAFXVariableDeclInstruction): EAFXShaderVariableType {
			var sBaseType: string = pVar.getType().getBaseType().getName();

			switch (sBaseType) {
				case "texture":
					return EAFXShaderVariableType.k_Texture;

				case "float":
					return EAFXShaderVariableType.k_Float;
				case "int":
					return EAFXShaderVariableType.k_Int;
				case "bool":
					return EAFXShaderVariableType.k_Bool;

				case "float2":
					return EAFXShaderVariableType.k_Float2;
				case "int2":
					return EAFXShaderVariableType.k_Int2;
				case "bool2":
					return EAFXShaderVariableType.k_Bool2;

				case "float3":
					return EAFXShaderVariableType.k_Float3;
				case "int3":
					return EAFXShaderVariableType.k_Int3;
				case "bool3":
					return EAFXShaderVariableType.k_Bool3;

				case "float4":
					return EAFXShaderVariableType.k_Float4;
				case "int4":
					return EAFXShaderVariableType.k_Int4;
				case "bool4":
					return EAFXShaderVariableType.k_Bool4;

				case "float2x2":
					return EAFXShaderVariableType.k_Float2x2;
				case "float3x3":
					return EAFXShaderVariableType.k_Float3x3;
				case "float4x4":
					return EAFXShaderVariableType.k_Float4x4;

				case "sampler":
				case "sampler2D":
					return EAFXShaderVariableType.k_Sampler2D;
				case "samplerCUBE":
					return EAFXShaderVariableType.k_SamplerCUBE;

				default:
					if (pVar.getType().isComplex()) {
						return EAFXShaderVariableType.k_Complex;
					}
					else {
						return EAFXShaderVariableType.k_NotVar;
					}
			}
		}

	}
}
