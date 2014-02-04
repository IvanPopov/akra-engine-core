/// <reference path="../idl/IAFXInstruction.ts" />
/// <reference path="../logger.ts" />

/// <reference path="VariableBlendContainer.ts" />
/// <reference path="instructions/ComplexTypeInstruction.ts" />

module akra.fx {
	
	export class ComplexTypeBlendContainer {
		private _pTypeListMap: IAFXTypeMap = null;
		private _pTypeKeys: string[] = null;

		getKeys(): string[] {
			return this._pTypeKeys;
		}

		getTypes(): IAFXTypeMap {
			return this._pTypeListMap;
		}

		constructor() {
			this._pTypeListMap = <IAFXTypeMap>{};
			this._pTypeKeys = [];
		}

		addComplexType(pComplexType: IAFXTypeInstruction): boolean {
			var pFieldList: IAFXVariableDeclInstruction[] = (<instructions.ComplexTypeInstruction>pComplexType)._getFieldDeclList();
			for (var i: uint = 0; i < pFieldList.length; i++) {
				if (pFieldList[i].getType().isComplex()) {
					if (!this.addComplexType(pFieldList[i].getType().getBaseType())) {
						return false;
					}
				}
			}

			var sName: string = pComplexType.getRealName();

			if (!isDef(this._pTypeListMap[sName])) {
				this._pTypeListMap[sName] = pComplexType;
				this._pTypeKeys.push(sName);

				return true;
			}

			var pBlendType: IAFXTypeInstruction = this._pTypeListMap[sName].blend(pComplexType, EAFXBlendMode.k_TypeDecl);
			if (isNull(pBlendType)) {
				logger.error("Could not blend type declaration '" + sName + "'");
				return false;
			}

			this._pTypeListMap[sName] = pBlendType;

			return true;
		}

		addFromVarConatiner(pContainer: VariableBlendContainer): boolean {
			if (isNull(pContainer)) {
				return true;
			}

			var pVarInfoList: IAFXVariableBlendInfo[] = pContainer.getVarsInfo();

			for (var i: uint = 0; i < pVarInfoList.length; i++) {
				var pType: IAFXTypeInstruction = pContainer.getBlendType(i).getBaseType();

				if (pType.isComplex()) {
					if (!this.addComplexType(pType)) {
						return false;
					}
				}
			}

			return true;
		}
	}
}

