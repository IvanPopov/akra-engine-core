#ifndef AFXVARIABLEINSTRUCTION
#define AFXVARIABLEINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"

module akra.fx {
	export class VariableDeclInstruction extends DeclInstruction implements IAFXVariableDeclInstruction {
		/**
		 * Represent type var_name [= init_expr]
		 * EMPTY_OPERATOR VariableTypeInstruction IdInstruction InitExprInstruction
		 */
		constructor(){
			super();
			this._pInstructionList = [null, null, null];
			this._eInstructionType = EAFXInstructionTypes.k_VariableDeclInstruction;
		}

		hasInitializer(): bool {
			return false;
		}

		getInitializeExpr(): IAFXExprInstruction {
			return null;
		}

		inline getType(): IAFXVariableTypeInstruction {
			return <IAFXVariableTypeInstruction>this._pInstructionList[0];
		}

        inline setType(pType: IAFXVariableTypeInstruction): void{
        	this._pInstructionList[0] = <IAFXVariableTypeInstruction>pType;
        	pType.setParent(this);

        	if(this._nInstuctions === 0){
        		this._nInstuctions = 1;
        	}
        }

        setName(sName: string):void {
        	var pName: IAFXIdInstruction = new IdInstruction();
        	pName.setName(sName);
        	pName.setParent(this);

        	this._pInstructionList[1] = <IAFXIdInstruction>pName;

        	if(this._nInstuctions < 2) {
        		this._nInstuctions = 2;
        	}
        }

        getName(): string {
        	return (<IAFXIdInstruction>this._pInstructionList[1]).getName();
        }

        getNameId(): IAFXIdInstruction {
                return <IAFXIdInstruction>this._pInstructionList[1];
        }

        isUniform(): bool {
        	return this.getType().hasUsage("uniform");
        }

        isField(): bool {
            if(isNull(this.getParent())){
                return false;
            }

            var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();
            if (eParentType === EAFXInstructionTypes.k_VariableTypeInstruction ||
                eParentType === EAFXInstructionTypes.k_ComplexTypeInstruction ||
                eParentType === EAFXInstructionTypes.k_SystemTypeInstruction){
                return true;
            }

            return false;
        }

        clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction {
        	return <IAFXVariableDeclInstruction>super.clone(pRelationMap);
        }
	}
}

#endif