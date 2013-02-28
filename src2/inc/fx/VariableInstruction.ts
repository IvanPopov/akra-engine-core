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

		inline hasInitializer(): bool {
			return this._nInstructions === 3 && !isNull(this.getInitializeExpr());
		}

		inline getInitializeExpr(): IAFXInitExprInstruction {
			return <IAFXInitExprInstruction>this.getInstructions()[2];
		}

		inline getType(): IAFXVariableTypeInstruction {
			return <IAFXVariableTypeInstruction>this._pInstructionList[0];
		}

        inline setType(pType: IAFXVariableTypeInstruction): void{
        	this._pInstructionList[0] = <IAFXVariableTypeInstruction>pType;
        	pType.setParent(this);

        	if(this._nInstructions === 0){
        		this._nInstructions = 1;
        	}
        }

        setName(sName: string):void {
        	var pName: IAFXIdInstruction = new IdInstruction();
        	pName.setName(sName);
        	pName.setParent(this);

        	this._pInstructionList[1] = <IAFXIdInstruction>pName;

        	if(this._nInstructions < 2) {
        		this._nInstructions = 2;
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

        _getFullName(): string {
            if(!this.isField()){
                return this.getName();
            }
            else {
                var sName: string = "";
                var eParentType: EAFXInstructionTypes = this.getParent()._getInstructionType();

                if(eParentType === EAFXInstructionTypes.k_VariableTypeInstruction){
                    sName = (<IAFXVariableTypeInstruction>this.getParent())._getFullName();    
                }

                sName += "." + this.getName();

                return sName;
            }
        }

        clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction {
        	return <IAFXVariableDeclInstruction>super.clone(pRelationMap);
        }
	}
}

#endif