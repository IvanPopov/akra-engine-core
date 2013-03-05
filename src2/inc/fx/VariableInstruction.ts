#ifndef AFXVARIABLEINSTRUCTION
#define AFXVARIABLEINSTRUCTION

#include "IAFXInstruction.ts"
#include "fx/Instruction.ts"
#include "fx/TypeInstruction.ts"
#include "fx/ExprInstruction.ts"

module akra.fx {
	export class VariableDeclInstruction extends DeclInstruction implements IAFXVariableDeclInstruction {
		private _isVideoBuffer: bool = null;
        private _pVideoBufferSampler: IAFXVariableDeclInstruction = null;
        private _pVideoBufferHeader: IAFXVariableDeclInstruction = null;
        private _pFullNameExpr: IAFXExprInstruction = null;

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

        inline getName(): string {
        	return (<IAFXIdInstruction>this._pInstructionList[1]).getName();
        }

        inline getNameId(): IAFXIdInstruction {
                return <IAFXIdInstruction>this._pInstructionList[1];
        }

        inline isUniform(): bool {
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

        isVideoBuffer(): bool{
            if(isNull(this._isVideoBuffer)){
                this._isVideoBuffer = this.getType().isEqual(getEffectBaseType("video_buffer"));
            }

            return this._isVideoBuffer;
        }

        toFinalCode(): string {
            var sCode: string = this.getType().toFinalCode();
            sCode += " " + this.getNameId().toFinalCode();
            
            if(this.getType().isNotBaseArray()){
                sCode += "[" + this.getType().getLength() + "]";
            }

            if(this.hasInitializer() && !this.isUniform()){
                sCode += "=" + this.getInitializeExpr().toFinalCode();
            }

            return sCode;
        }

        _getFullNameExpr(): IAFXExprInstruction {
            if(!isNull(this._pFullNameExpr)){
                return this._pFullNameExpr;
            }

            if(!this.isField()){
                this._pFullNameExpr = new IdExprInstruction();
                this._pFullNameExpr.push(this.getNameId(), false);
            }
            else {
                var pMainVar: IAFXVariableDeclInstruction = <IAFXVariableDeclInstruction>this.getType()._getParentContainer();
                
                if(isNull(pMainVar)){
                    return null;
                } 

                var pMainExpr: IAFXExprInstruction = pMainVar._getFullNameExpr();
                if(isNull(pMainExpr)){
                    return null;
                }

                this._pFullNameExpr = new PostfixPointInstruction();
                this._pFullNameExpr.push(pMainExpr, false);
                this._pFullNameExpr.push(this.getNameId(), false);
                this._pFullNameExpr.setType(this.getType());
            }

            return this._pFullNameExpr;
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

        _getVideoBufferSampler(): IAFXVariableDeclInstruction {
            if(!this.isVideoBuffer()){
                return null;
            }

            if(isNull(this._pVideoBufferSampler)){
                this._pVideoBufferSampler = new VariableDeclInstruction();
                var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
                var pId: IAFXIdInstruction = new IdInstruction();

                pType.pushType(getEffectBaseType("sampler2D"));

                this._pVideoBufferSampler.push(pType, true);
                this._pVideoBufferSampler.push(pId, true);
            }

            return this._pVideoBufferSampler;
        }

        _getVideoBufferHeader(): IAFXVariableDeclInstruction {
            if(!this.isVideoBuffer()){
                return null;
            }

            if(isNull(this._pVideoBufferHeader)){
                this._pVideoBufferHeader = new VariableDeclInstruction();
                var pType: IAFXVariableTypeInstruction = new VariableTypeInstruction();
                var pId: IAFXIdInstruction = new IdInstruction();

                pType.pushType(getEffectBaseType("video_buffer_header"));

                this._pVideoBufferHeader.push(pType, true);
                this._pVideoBufferHeader.push(pId, true);
            }

            return this._pVideoBufferHeader;
        }

        clone(pRelationMap?: IAFXInstructionMap): IAFXVariableDeclInstruction {
        	return <IAFXVariableDeclInstruction>super.clone(pRelationMap);
        }
	}
}

#endif