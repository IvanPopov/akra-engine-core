#ifndef AFXMAKER_TS
#define AFXMAKER_TS

#include "IAFXMaker.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"
#include "IResourcePoolManager.ts"
#include "PassInputBlend.ts"

#include "IShaderInput.ts"

module akra.fx {

	export interface IUniformTypeMap {
		[name: string]: EAFXShaderVariableType;
	}

	export interface IUniformVarInfo {
		location: uint;
		name: string;
		shaderName: string;
		type: EAFXShaderVariableType;
		length: uint;
	}

	export class UniformVarInfo implements IUniformVarInfo {
		location: uint;
		name: string;
		shaderName: string;
		type: EAFXShaderVariableType;
		length: uint;

		constructor(sName: string, sShaderName: string, eType: EAFXShaderVariableType, iLength: uint, iLocation: uint){
			this.location = iLocation;
			this.name = sName;
			this.shaderName = sShaderName;
			this.type = eType;
			this.length = iLength;
		}
	}

	export class Maker implements IAFXMaker {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		private _pShaderProgram: IShaderProgram = null;

		private _pRealUniformNameList: string[] = null;
		private _pRealAttrNameList: string[] = null;

		// is really exists uniform & attr?
		private _pUniformExistMap: BoolMap = <BoolMap>{};
		private _pAttrExistMap: BoolMap = <BoolMap>{};

		private _pRealUniformLengthMap: IntMap = <IntMap>{};
		private _pRealUniformTypeMap: IUniformTypeMap = <IUniformTypeMap>{};

		//For fast set uniforms
		private _pRealUnifromFromInput: string[] = null; /* without sampler array */
		private _pRealSampleArraysFromInput: string[] = null; /* only sampler arrays */
		private _pRealSamplersFromInput: string[] = null;
		private _pRealSamplersNames: string[] = null;
		private _isUsedZero2D: bool = false;
		private _isUsedZeroCube: bool = false;

		//For fast set offsets
		private _pAttrContainer: AttributeBlendContainer = null;
		// private _pRealOffsetsFromFlows: string[] = null;
		// private _pDefaultOffsets: uint[] = null;
		// private _pRealOffsetKeys: string[] = null;

		//for fast set buffers slots
		private _pRealAttrSlotFromFlows: string[] = null;
		private _pRealAttrIsIndexData: bool[] = null; 

		//for fast set buffers vertex textures
		private _pBufferSamplersFromFlows: string[] = null;

		//стек объектов храняих все юниформы и аттрибуты
		private _pDataPoolArray: util.ObjectArray = new util.ObjectArray();

		private _pRealUniformLocationMap: IntMap = <IntMap>{};
		private _pRealAttrLocationMap: IntMap = <IntMap>{};

		inline isArray(sName: string) {
			return this.getLength(sName) > 0;
		}

		inline getType(sName: string): EAFXShaderVariableType {
			return this._pRealUniformTypeMap[sName];
		}

		inline getLength(sName: string): uint {
			return this._pRealUniformLengthMap[sName];
		}

		inline get shaderProgram(): IShaderProgram {
			return this._pShaderProgram;
		}

		inline get attributeSemantics(): string[] {
			return this._pRealAttrSlotFromFlows;
		}

		inline get attributeNames(): string[] {
			return this._pRealAttrNameList;
		}

		inline get uniformNames(): string[] {
			return this._pRealUniformNameList;
		}


		constructor(pComposer: IAFXComposer){
			this._pComposer = pComposer;
		}

		_create(sVertex: string, sPixel: string): bool {
			var pRmgr: IResourcePoolManager = this._pComposer.getEngine().getResourceManager();

			var pProgram: IShaderProgram = pRmgr.createShaderProgram(".shader-prorgam-" + this.getGuid().toString());

			if(!pProgram.create(sVertex, sPixel)){
				return false;
			}

			this._pRealUniformNameList = pProgram._getActiveUniformNames();
        	this._pRealAttrNameList = pProgram._getActiveAttributeNames();
			this._pShaderProgram = pProgram; 

			for (var i: int = 0; i < this._pRealUniformNameList.length; i++) {
				this._pUniformExistMap[this._pRealUniformNameList[i]] = true;
				this._pRealUniformLocationMap[this._pRealUniformNameList[i]] = i;
			}

			for (var i: int = 0; i < this._pRealAttrNameList.length; i++) {
				this._pAttrExistMap[this._pRealAttrNameList[i]] = true;
				this._pRealAttrLocationMap[this._pRealAttrNameList[i]] = i;
			}

			// this["sTmpVertex"] = sVertex;
			// this["sTmpPixel"] = sPixel;  

			return true;
		}

		inline _getShaderInput(): IShaderInput {
			return this._pDataPoolArray.length > 0? this._pDataPoolArray.pop(): this._createDataPool();
		}

		inline _releaseShaderInput(pPool: IShaderInput): void {
			this._pDataPoolArray.push(pPool);
		}

		inline isUniformExists(sName: string): bool {
			return this._pUniformExistMap[sName];
		}

		inline isAttrExists(sName: string): bool {
			return this._pAttrExistMap[sName];
		}


		_createDataPool(): IShaderInput {
			var pInput: IShaderInput = {
				uniforms: <{[index: uint]: any;}>{},
				attrs: <{[index: uint]: any;}>{}
			};

			//assume, that attr & uniform never have same names!!!

			for (var i: int = 0; i < this._pRealUniformNameList.length; i++) {
				var sName: string = this._pRealUniformNameList[i];
				pInput.uniforms[i] = null;

				var eType: EAFXShaderVariableType = this._pRealUniformTypeMap[sName];
				var iLength: uint = this._pRealUniformLengthMap[sName];

				if ((eType === EAFXShaderVariableType.k_Sampler2D ||
					 eType === EAFXShaderVariableType.k_SamplerCUBE)){

					if(iLength > 0){
						pInput.uniforms[i] = new Array(iLength);

						for(var j: uint = 0; j < iLength; j++){
							pInput.uniforms[i][j] = createSamplerState();
						}
					}
					else {
						pInput.uniforms[i] = createSamplerState();
					}
					
				}
			}

			for (var i: int = 0; i < this._pRealAttrNameList.length; i++) {
				var sName: string = this._pRealAttrNameList[i];
				pInput.attrs[i] = null;
			}

			return pInput;
		}

		setUniform(sName: string, pValue: any): void {
			var eType: EAFXShaderVariableType = this.getType(sName);
			var iLength: int = this.getLength(sName);

			if(eType === EAFXShaderVariableType.k_NotVar) {
				return;
			}
			// else {
			// 	this._pUniformApplyFunctionMap[sName].call(this._pShaderProgram, sName, pValue || this._pUniformUndefValues[sName]);
			// }
			// this._pUniformApplyFunctionMap[sName].call(this._pShaderProgram, sName, pValue || this._pUniformUndefValues[sName]);

			if (iLength > 0) {
				this.applyUnifromArray(sName, eType, pValue);
			}
			else {
				this.applyUniform(sName, eType, pValue);
			}
		}

		private _pUniformApplyFunctionMap: any = {};
		private _pUniformUndefValues: any = {};

		private _fnEmpty(): void {
		}
		private setUniformApplyFunction(sName: string, eType: EAFXShaderVariableType, isArray: bool): void {
			if(sName){
				return;
			}
			this._pUniformUndefValues[sName] = null;

			if(isArray){
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setFloat32Array;
			        	break;
			        case EAFXShaderVariableType.k_Int:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setInt32Array;
			        	break;
			        // case EAFXShaderVariableType.k_Bool:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBoolArray;
			        // 	break;

			        case EAFXShaderVariableType.k_Float2:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec2Array;
			        	break;
			        case EAFXShaderVariableType.k_Int2:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec2iArray;
			        	break;
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBool2Array;
			        // 	break;

			        case EAFXShaderVariableType.k_Float3:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec3Array;
			        	break;
			        case EAFXShaderVariableType.k_Int3:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec3iArray;
			        	break;
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBool3Array;
			        // 	break;

			        case EAFXShaderVariableType.k_Float4:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec4Array;
			        	break;
			        case EAFXShaderVariableType.k_Int4:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec4iArray;
			        	break;
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBool4Array;
			        // 	break;

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setMat2Array;
			        // 	break;
			        case EAFXShaderVariableType.k_Float3x3:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setMat3Array;
			        	break;
			        case EAFXShaderVariableType.k_Float4x4:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setMat4Array;
			        	break;

			        case EAFXShaderVariableType.k_Sampler2D:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setSamplerArray;
			        	break;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setSamplerArray;
			        	break;
			        default:
			        	this._pUniformApplyFunctionMap[sName] = this._fnEmpty;
			        	// CRITICAL("Wrong uniform array type (" + eType + ") with name " + sName);
		        }
			}
			else {
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setFloat;
			        	this._pUniformUndefValues[sName] = 0.;
			        	break;
			        case EAFXShaderVariableType.k_Int:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setInt;
			        	this._pUniformUndefValues[sName] = 0;
			        	break;
			        case EAFXShaderVariableType.k_Bool:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setInt;
			        	this._pUniformUndefValues[sName] = 0;
			        	break;

			        case EAFXShaderVariableType.k_Float2:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec2;
			        	this._pUniformUndefValues[sName] = new Vec2(0);
			        	break;
			        case EAFXShaderVariableType.k_Int2:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec2i;
			        	this._pUniformUndefValues[sName] = new Vec2(0);
			        	break;
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBool2
			        // 	break;

			        case EAFXShaderVariableType.k_Float3:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec3;
			        	this._pUniformUndefValues[sName] = new Vec3(0);
			        	break;
			        case EAFXShaderVariableType.k_Int3:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec3i;
			        	this._pUniformUndefValues[sName] = new Vec3(0);
			        	break;
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBool3
			        // 	break;

			        case EAFXShaderVariableType.k_Float4:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec4;
			        	this._pUniformUndefValues[sName] = new Vec4(0);
			        	break;
			        case EAFXShaderVariableType.k_Int4:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVec4i;
			        	this._pUniformUndefValues[sName] = new Vec4(0);
			        	break;
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setBool4
			        // 	break;

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setMat2
			        // 	break;
			        case EAFXShaderVariableType.k_Float3x3:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setMat3;
			        	this._pUniformUndefValues[sName] = new Mat3(0);
			        	break;
			        case EAFXShaderVariableType.k_Float4x4:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setMat4;
			        	this._pUniformUndefValues[sName] = new Mat4(0);
			        	break;

			        case EAFXShaderVariableType.k_Sampler2D:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setSampler;
			        	break;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setSampler;
			        	break;
			        case EAFXShaderVariableType.k_SamplerVertexTexture:
			        	this._pUniformApplyFunctionMap[sName] = this._pShaderProgram.setVertexBuffer;
			        	break;
			        default:
			        	this._pUniformApplyFunctionMap[sName] = this._fnEmpty;
			        	// CRITICAL("Wrong uniform type (" + eType + ") with name " + sName);
		        }
			}
		}

		private _pRealUniformLengthFromInput: uint[] = null;
		private _pRealUniformInfoFromInput: IUniformVarInfo[] = null;
		private _pRealSamplerInfoFromInput: IUniformVarInfo[] = null;
		private _pRealSamplerArrayInfoFromInput: IUniformVarInfo[] = null;

		private inline createUniformInfo(sName: string, sShaderName: string, eType: EAFXShaderVariableType, iLength: uint, iLocation: uint): IUniformVarInfo {
			return {
				location: iLocation,
				name: sName,
				shaderName: sShaderName,
				type: eType,
				length: iLength
			};
			// return new UniformVarInfo(sName, sShaderName, eType, iLength);
		}

		_initInput(pPassInput: IAFXPassInputBlend, pBlend: SamplerBlender, pAttrs: AttributeBlendContainer): bool {
			var pUniformKeys: string[] = pPassInput.uniformKeys;

			this._pRealUnifromFromInput = [];
			var pUniformInfoTmp = [];
			// this._pRealUniformLengthFromInput = [];
			// this._pRealUniformInfoFromInput = [];

			for(var i: uint = 0; i < pUniformKeys.length; i++){
				var sName: string = pUniformKeys[i];
				var eType: EAFXShaderVariableType =  pPassInput._getUniformType(sName);
				var iLength: uint = pPassInput._getUnifromLength(sName);

				if(eType === EAFXShaderVariableType.k_Complex){
					if(this.expandStructUniforms(pPassInput._getAFXUniformVar(sName))) {
						this._pRealUnifromFromInput.push(sName);
						// this._pRealUniformLengthFromInput.push(iLength);
						// this._pRealUniformInfoFromInput.push(this.createUniformInfo(sName, sName, eType, iLength));
						pUniformInfoTmp.push(this.createUniformInfo(sName, sName, eType, iLength, -1));
					}
					continue;
				}

				var sShaderName: string = (iLength > 0) ? (sName + "[0]") : sName;

				if(this.isUniformExists(sShaderName)){				
					
					this._pRealUniformTypeMap[sName] = eType;
					this._pRealUniformLengthMap[sName] = iLength;

					this._pRealUniformTypeMap[sShaderName] = eType;
					this._pRealUniformLengthMap[sShaderName] = iLength;

					this._pRealUnifromFromInput.push(sName);

					this.setUniformApplyFunction(sShaderName, eType, (iLength > 0));
					// this._pRealUniformLengthFromInput.push(iLength);
					// this._pRealUniformInfoFromInput.push(this.createUniformInfo(sName, sShaderName, eType, iLength));
					pUniformInfoTmp.push(this.createUniformInfo(sName, sShaderName, eType, iLength, this._pRealUniformLocationMap[sShaderName]));
				}
				else {
					this._pUniformExistMap[sShaderName] = false;
				}
			}

			var pSamplerArrayKeys: string[] = pPassInput.samplerArrayKeys;
			this._pRealSampleArraysFromInput = [];
			var pSamplerArrayInfoTmp = [];

			for(var i: uint = 0; i < pSamplerArrayKeys.length; i++) {
				var sName: string = pSamplerArrayKeys[i];
				var eType: EAFXShaderVariableType =  pPassInput._getUniformType(sName);
				var iLength: uint = pPassInput._getUnifromLength(sName);
				
				var sShaderName: string = sName + "[0]";

				if(this.isUniformExists(sShaderName)){
					this._pRealUniformTypeMap[sName] = eType;
					this._pRealUniformLengthMap[sName] = iLength;

					this._pRealUniformTypeMap[sShaderName] = eType;
					this._pRealUniformLengthMap[sShaderName] = iLength;

					this._pRealSampleArraysFromInput.push(sName);
					pSamplerArrayInfoTmp.push(this.createUniformInfo(sName, sShaderName, eType, iLength, this._pRealUniformLocationMap[sShaderName]));

					this.setUniformApplyFunction(sShaderName, eType, true);
				}
				else {
					this._pUniformExistMap[sShaderName] = false;
				}

			}

			this._pRealSamplersFromInput = [];
			this._pRealSamplersNames = [];
			var iTotalSamplerSlots: uint = pBlend.totalActiveSlots;
			var pSamplerInfoTmp = [];

			for(var i: uint = 0; i < iTotalSamplerSlots; i++){
				if(i === ZERO_SLOT) {
					this._isUsedZero2D = this.isUniformExists("as0") || false;
					this._isUsedZeroCube = this.isUniformExists("asc0") || false;

					if(this._isUsedZero2D){
						this._pRealUniformTypeMap["as0"] = EAFXShaderVariableType.k_Int;
						this._pRealUniformLengthMap["as0"] = 0;

						this.setUniformApplyFunction("as0",  EAFXShaderVariableType.k_Int, false);
					}

					if(this._isUsedZeroCube){
						this._pRealUniformTypeMap["asc0"] = EAFXShaderVariableType.k_Int;
						this._pRealUniformLengthMap["asc0"] = 0;

						this.setUniformApplyFunction("asc0",  EAFXShaderVariableType.k_Int, false);
					}
					continue;
				}

				var pSamplers: util.ObjectArray = pBlend.getSamplersBySlot(i);
				var sRealSamplerName: string = "as" + i.toString();

				if(this.isUniformExists(sRealSamplerName)){
					var pSampler: IAFXVariableDeclInstruction = pBlend.getSamplersBySlot(i).value(0);
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//TODO: need to reset names of samlers
					var sSampler: string = pSampler.getSemantic() || pSampler.getName();

					this._pRealSamplersFromInput.push(sSampler);
					this._pRealSamplersNames.push(sRealSamplerName);

					

					this._pRealUniformTypeMap[sRealSamplerName] = pSampler.getType().isSampler2D() ?
																 		EAFXShaderVariableType.k_Sampler2D :
																 		EAFXShaderVariableType.k_SamplerCUBE;

					pSamplerInfoTmp.push(this.createUniformInfo(sSampler, sRealSamplerName, this._pRealUniformTypeMap[sRealSamplerName], pSampler.getType().getLength(), this._pRealUniformLocationMap[sRealSamplerName]));

					this._pRealUniformLengthMap[sRealSamplerName] = 0;

					this.setUniformApplyFunction(sRealSamplerName, this._pRealUniformTypeMap[sRealSamplerName], false);
				}
				else {
					this._pUniformExistMap[sRealSamplerName] = false;
				}
			}


			this._pRealAttrSlotFromFlows = [];
			this._pRealAttrIsIndexData = [];
			this._pBufferSamplersFromFlows = [];

			var iTotalAttrSlots: uint = pAttrs.totalSlots;
			var pSemantics: string[] = pAttrs.semantics;
			
			var nPreparedAttrs: int = -1;
			var nPreparedBuffers: int = -1;

			var pSemanticsBySlot: StringMap = <StringMap>{};

			for(var i: uint = 0; i < pSemantics.length; i++){
				var sSemantic: string = pSemantics[i];
				var iSlot: uint = pAttrs.getSlotBySemantic(sSemantic);
				if(iSlot === -1){
					continue;
				}

				var iBufferSlot: uint = pAttrs.getBufferSlotBySemantic(sSemantic);

				if(iSlot > nPreparedAttrs){
					var sAttrName: string = "aa" + iSlot.toString();
					
					if(this.isAttrExists(sAttrName)){
						this._pRealAttrSlotFromFlows.push(sSemantic);
						
						if(pAttrs.getType(sSemantic).isComplex()){
							this._pRealAttrIsIndexData.push(true);
						}
						else {
							this._pRealAttrIsIndexData.push(false);
						}

						pSemanticsBySlot[iSlot] = sSemantic;
					}
					else {
						this._pRealAttrSlotFromFlows.push(null);
						this._pAttrExistMap[sAttrName] = false;
						pSemanticsBySlot[iSlot] = null;
					}

					nPreparedAttrs++;
				}

				if(iBufferSlot > nPreparedBuffers){
					var sBufferName: string = "abs" + iBufferSlot.toString();
					
					if(this.isUniformExists(sBufferName)){
						this._pBufferSamplersFromFlows.push(sSemantic);
						this._pRealUniformTypeMap[sBufferName] = EAFXShaderVariableType.k_SamplerVertexTexture;

						this.setUniformApplyFunction(sBufferName, EAFXShaderVariableType.k_SamplerVertexTexture, false);
					}
					else {
						this._pUniformExistMap[sBufferName] = false;
					}
					
					nPreparedBuffers++;
				}

				//Offsets

			}

			this._pAttrContainer = pAttrs;
			for(var i: uint = 0; i < this._pRealAttrSlotFromFlows.length; i++) {
				var sSemantic: string = this._pRealAttrSlotFromFlows[i];
				var pOffsetVars: IAFXVariableDeclInstruction[] = this._pAttrContainer.getOffsetVarsBySemantic(sSemantic);

				if(!isNull(pOffsetVars)){
					for(var j: uint = 0; j < pOffsetVars.length; j++){
						var sOffsetName: string = pOffsetVars[j].getRealName();

						if(this.isUniformExists(sOffsetName)){
							this._pRealUniformTypeMap[sOffsetName] = EAFXShaderVariableType.k_Float;

							this.setUniformApplyFunction(sOffsetName, EAFXShaderVariableType.k_Float, false);
						}
						else {
							this._pUniformExistMap[sOffsetName] = false;
						}
					}
				}
			}
			// this._pRealOffsetsFromFlows = [];
			// this._pDefaultOffsets = [];
			// this._pRealOffsetKeys = [];

			// var pOffsetKeys: string[] = pAttrs.offsetKeys;

			// for(var i:uint = 0; i < pOffsetKeys.length; i++) {
			// 	var sName: string = pOffsetKeys[i];
			// 	var iOffsetSlot: uint = pAttrs.getSlotByOffset(sName);
			// 	var sFlowSemantic: string = pSemanticsBySlot[iOffsetSlot];

			// 	if(isNull(sFlowSemantic)){
			// 		continue;
			// 	}

			// 	this._pRealOffsetsFromFlows.push(sFlowSemantic);
			// 	this._pRealOffsetKeys.push(sName);
			// 	this._pDefaultOffsets.push(pAttrs.getOffsetDefault(sName));
			// }
			

			// var tmp: string[] = this._pRealUnifromFromInput;
			// this._pRealUnifromFromInput = new Array(tmp.length);

			// for(var i: uint = 0; i < this._pRealUnifromFromInput.length; i++){
			// 	this._pRealUnifromFromInput[i] = tmp[i];
			// }
			this._pRealUniformInfoFromInput = pUniformInfoTmp;
			this._pRealSamplerInfoFromInput = pSamplerInfoTmp;
			this._pRealSamplerArrayInfoFromInput = pSamplerArrayInfoTmp;

			return true;
		}

		_make(pPassInput: IAFXPassInputBlend, pBufferMap: util.BufferMap): IShaderInput {
			var pUniforms: Object = pPassInput.uniforms;
			var pTextures: Object = pPassInput.textures
			var pSamplers: IAFXSamplerStateMap = pPassInput.samplers;
			var pSamplerArrays: IAFXSamplerStateListMap = pPassInput.samplerArrays;

			var pInput: IShaderInput = this._getShaderInput();

			// for(var i: uint = 0; i < this._pRealUnifromFromInput.length; i++){
			// 	var sName: string = this._pRealUnifromFromInput[i];
			// 	var iLength: uint = this._pRealUniformLengthMap[sName];
			// 	var eType: EAFXShaderVariableType = this._pRealUniformTypeMap[sName];
				
			// 	if(eType !== EAFXShaderVariableType.k_Complex){
			// 		if(iLength > 0){
			// 			pInput[sName + "[0]"] = pUniforms[sName];
			// 		}
			// 		else {
			// 			pInput[sName] = pUniforms[sName];
			// 		}
			// 	}
			// 	else {
			// 		this.applyStructUniform(sName, pUniforms[sName], pInput);
			// 	}				
			// }

			// for(var i: uint = 0; i < this._pRealSamplersFromInput.length; i++){
			// 	var sRealName: string = this._pRealSamplersNames[i];
			// 	var sName: string = this._pRealSamplersFromInput[i];
			// 	var pState: IAFXSamplerState = null;
			// 	var pTexture: ITexture = null;

			// 	if(pPassInput._getAFXUniformVar(sName).getType().isArray()){
			// 		pState = pSamplerArrays[sName][0];
			// 	}
			// 	else {
			// 		pState = pPassInput._getSamplerState(sName);					
			// 	}

			// 	pTexture = pPassInput._getTextureForSamplerState(pState);

			// 	this.setSamplerState(pInput[sRealName], pTexture, pState);
			// }
			
			// for(var i: uint = 0; i < this._pRealSampleArraysFromInput.length; i++){
			// 	var sName: string = this._pRealSampleArraysFromInput[i];
			// 	var iLength: uint = this._pRealUniformLengthMap[sName];
			// 	var pSamplerStates: IAFXSamplerState[] = pSamplerArrays[sName];
			// 	var pInputStates: IAFXSamplerState[] = pInput[sName + "[0]"];

			// 	for(var j: uint = 0; j < iLength; j++) {
			// 		var pTexture: ITexture = pPassInput._getTextureForSamplerState(pSamplerStates[j]);
			// 		this.setSamplerState(pInputStates[j], pTexture, pSamplerStates[j]);
			// 	}
			// } 
			
			
			for(var i: uint = 0; i < this._pRealUniformInfoFromInput.length; i++){
				var pInfo: IUniformVarInfo = this._pRealUniformInfoFromInput[i];
				
				if(pInfo.type !== EAFXShaderVariableType.k_Complex) {
					pInput.uniforms[pInfo.location] = pUniforms[pInfo.name];
				}
				else {
					this.applyStructUniform(pInfo.name, pUniforms[pInfo.name], pInput);
				}				
			}
			
			// for(var i: uint = 0; i < this._pRealUniformInfoFromInput.length; i++){
			// 	var pInfo: IUniformVarInfo = this._pRealUniformInfoFromInput[i];
				
			// 	if(pInfo.type !== EAFXShaderVariableType.k_Complex) {
			// 		pInput[pInfo.shaderName] = pUniforms[pInfo.name];
			// 	}
			// 	// else {
			// 	// 	this.applyStructUniform(pInfo.name, pUniforms[pInfo.name], pInput);
			// 	// }				
			// }

			for(var i: uint = 0; i < this._pRealSamplerInfoFromInput.length; i++){
				var pInfo: IUniformVarInfo = this._pRealSamplerInfoFromInput[i];

				var pState: IAFXSamplerState = null;
				var pTexture: ITexture = null;

				if(pInfo.length > 0){
					pState = pSamplerArrays[pInfo.name][0];
				}
				else {
					pState = pPassInput._getSamplerState(pInfo.name);					
				}

				pTexture = pPassInput._getTextureForSamplerState(pState);

				this.setSamplerState(pInput.uniforms[pInfo.location], pTexture, pState);
			}

			for(var i: uint = 0; i < this._pRealSamplerArrayInfoFromInput.length; i++){
				var pInfo: IUniformVarInfo = this._pRealSamplerArrayInfoFromInput[i];

				var pSamplerStates: IAFXSamplerState[] = pSamplerArrays[pInfo.name];
				var pInputStates: IAFXSamplerState[] = pInput.uniforms[pInfo.location];

				for(var j: uint = 0; j < pInfo.length; j++) {
					var pTexture: ITexture = pPassInput._getTextureForSamplerState(pSamplerStates[j]);
					this.setSamplerState(pInputStates[j], pTexture, pSamplerStates[j]);
				}
			} 

			var iBufferSlot: uint = 0;

			for(var i: uint = 0; i < this._pRealAttrSlotFromFlows.length; i++){
				var sSemantic: string = this._pRealAttrSlotFromFlows[i];

				if(isNull(sSemantic)){
					continue;
				}

				var isIndex: bool = this._pRealAttrIsIndexData[i];
				var pFlow: IDataFlow = isIndex ? (pBufferMap.findFlow(sSemantic) || pBufferMap.getFlow(sSemantic, true)) : pBufferMap.getFlow(sSemantic, true);

				var sBufferFlowSemantic: string = this._pBufferSamplersFromFlows[iBufferSlot];

				if(sBufferFlowSemantic === sSemantic){
					var sBufferName: string = "abs" + iBufferSlot.toString();
					pInput.uniforms[this._pRealUniformLocationMap[sBufferName]] = pFlow.data.buffer;
					iBufferSlot++;
				}

				var sAttrName: string = "aa" + i.toString();
				pInput.attrs[this._pRealAttrLocationMap[sAttrName]] = pFlow;


				var pOffsetVars: IAFXVariableDeclInstruction[] = this._pAttrContainer.getOffsetVarsBySemantic(sSemantic);
				if(!isNull(pOffsetVars)){
					var pVertexDecl: IVertexDeclaration = pFlow.data.getVertexDeclaration();

					for(var j: uint = 0; j < pOffsetVars.length; j++){
						var sOffsetSemantic: string = pOffsetVars[j].getSemantic();
						var sOffsetName: string = pOffsetVars[j].getRealName();

						if(this.isUniformExists(sOffsetName)){
							var pElement: IVertexElement = pVertexDecl.findElement(sOffsetSemantic);
						
							if(isNull(pElement)){
								pInput.uniforms[this._pRealUniformLocationMap[sOffsetName]] = this._pAttrContainer.getOffsetDefault(sOffsetName);
							}
							else {
								pInput.uniforms[this._pRealUniformLocationMap[sOffsetName]] = pElement.offset / 4;
							}

						}
					}
				}
			}

			if(this._isUsedZero2D){
				pInput[this._pRealUniformLocationMap["as0"]] = 19;
			}

			if(this._isUsedZeroCube){
				pInput[this._pRealUniformLocationMap["asc0"]] = 19;
			}



			return pInput;
		}

		private setSamplerState(pOut: IAFXSamplerState, pTexture: ITexture, pFrom: IAFXSamplerState): void {
			pOut.texture = pTexture;
			pOut.wrap_s = pFrom.wrap_s;
			pOut.wrap_t = pFrom.wrap_t;
			pOut.mag_filter = pFrom.mag_filter;
			pOut.min_filter = pFrom.min_filter;
		}

		private expandStructUniforms(pVariable: IAFXVariableDeclInstruction, sPrevName?: string = ""): bool {
			var sRealName: string = pVariable.getRealName();

			if(sPrevName !== ""){
				sPrevName += "." + sRealName;
			}
			else {
				sPrevName = sRealName;
			}

			var pVarType: IAFXVariableTypeInstruction = pVariable.getType();
			var pFieldNameList: string[] = pVarType.getFieldNameList();
			var isArray: bool = pVarType.isNotBaseArray();
			var iLength: uint = isArray ? pVarType.getLength() : 1;

			if(isArray && (iLength === UNDEFINE_LENGTH || iLength === 0)){
				this._pUniformExistMap[sPrevName] = false;
				return;
			}

#ifdef WEBGL
			var isFakeLength: bool = false;
			if(webgl.isANGLE && isArray && iLength === 1){
				iLength = 2;
				isFakeLength = true;
			}
#endif
			var isAnyFieldExist: bool = false;
			var sFieldPrevName: string = "";

			for(var i: uint = 0; i < iLength; i++){
				sFieldPrevName = sPrevName;

				if(isArray) {
					sFieldPrevName += "[" + i + "]";
				}

				for(var j: uint = 0; j < pFieldNameList.length; j++){
					var sFieldName: string = pFieldNameList[j];
					var pField: IAFXVariableDeclInstruction = pVarType.getField(sFieldName);

					if(pField.getType().isComplex()){
						isAnyFieldExist = this.expandStructUniforms(pField, sFieldPrevName) || isAnyFieldExist;
					}
					else {
						var sFieldRealName: string = sFieldPrevName + "." + pField.getRealName();

#ifdef WEBGL
						var eFieldType: EAFXShaderVariableType = 0;
						var iFieldLength: uint = 0;

						if(isFakeLength && i === 1) {
							eFieldType = EAFXShaderVariableType.k_NotVar;
							iFieldLength = pField.getType().getLength();
						}
						else {
							eFieldType = PassInputBlend.getVariableType(pField);
							iFieldLength = pField.getType().getLength();
						}
#else
						var eFieldType: EAFXShaderVariableType = PassInputBlend.getVariableType(pField);
						var iFieldLength: uint = pField.getType().getLength();
#endif

						var sFieldShaderName: string = sFieldRealName;

						if(pField.getType().isNotBaseArray()){
							sFieldShaderName += "[0]";
						}

						if(this.isUniformExists(sFieldShaderName)){
							this._pRealUniformTypeMap[sFieldRealName] = eFieldType;
							this._pRealUniformLengthMap[sFieldRealName] = iFieldLength;
							this._pUniformExistMap[sFieldRealName] = true;

							this._pRealUniformTypeMap[sFieldShaderName] = eFieldType;
							this._pRealUniformLengthMap[sFieldShaderName] = iFieldLength;

							// if(eFieldType !== EAFXShaderVariableType.k_NotVar){
								this.setUniformApplyFunction(sFieldShaderName, eFieldType, pField.getType().isNotBaseArray());
							// }

							isAnyFieldExist = true;
						}
						else {
							this._pUniformExistMap[sFieldShaderName] = false;
							this._pUniformExistMap[sFieldRealName] = false;
						}
					}

				}
			}

#ifdef WEBGL
			if(isFakeLength){
				iLength = 1;
			}
#endif
			if(isAnyFieldExist){
				this._pRealUniformTypeMap[sPrevName] = EAFXShaderVariableType.k_Complex;
				this._pRealUniformLengthMap[sPrevName] = isArray ? iLength : 0;
				this._pUniformExistMap[sPrevName] = true;
			}
			else {
				this._pUniformExistMap[sPrevName] = false;
			}

			return isAnyFieldExist;
		}

		private applyStructUniform(sName: string, pValue: any, pInput: IShaderInput): void {
			if(!isDefAndNotNull(pValue)){
				return;
			}

			var iLength: uint = this._pRealUniformLengthMap[sName];

			if(iLength > 0){
				if(!isDef(pValue.length)){
					return;
				}

				iLength = math.min(iLength, pValue.length);

				for(var i: uint = 0; i < iLength; i++){
					var sFieldPrevName: string = sName + "[" + i + "]";

					for(var j in pValue[i]) {
						if(!pValue[i].hasOwnProperty(j)){
							continue;
						}
						var sFieldName: string = sFieldPrevName + "." + j;

						if(this.isUniformExists(sFieldName)){
							var eType: EAFXShaderVariableType = this._pRealUniformTypeMap[sFieldName];

							if(eType === EAFXShaderVariableType.k_Complex){
								this.applyStructUniform(sFieldName, pValue[i][j], pInput);		
							}
							else {
								var iFieldLength: uint = this._pRealUniformLengthMap[sFieldName];

								if(iFieldLength > 0){
									pInput.uniforms[this._pRealUniformLocationMap[sFieldName + "[0]"]] = pValue[i][j];
								}
								else {
									pInput.uniforms[this._pRealUniformLocationMap[sFieldName]] = pValue[i][j];
								}
								
							}
						}
					}
				}
			}
			else {
				for(var j in pValue) {
					if(!pValue.hasOwnProperty(j)){
						continue;
					}
					var sFieldName: string = sName + "." + j;

					if(this.isUniformExists(sFieldName)){
						var eType: EAFXShaderVariableType = this._pRealUniformTypeMap[sFieldName];

						if(eType === EAFXShaderVariableType.k_Complex){
							this.applyStructUniform(sFieldName, pValue[j], pInput);		
						}
						else {
							var iFieldLength: uint = this._pRealUniformLengthMap[sFieldName];
						
							if(iFieldLength > 0){
								pInput[sFieldName + "[0]"] = pValue[j];
							}
							else {
								pInput[sFieldName] = pValue[j];
							}						
						}
					}
				}
			}

		}

		private applyUnifromArray(sName: string, eType: EAFXShaderVariableType, pValue: any): void {
			switch (eType) {
		        case EAFXShaderVariableType.k_Float:
		        	this._pShaderProgram.setFloat32Array(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_Int:
		        	this._pShaderProgram.setInt32Array(sName, pValue);
		        	break;
		        // case EAFXShaderVariableType.k_Bool:
		        // 	this._pShaderProgram.setBoolArray(sName, pValue);
		        // 	break;

		        case EAFXShaderVariableType.k_Float2:
		        	this._pShaderProgram.setVec2Array(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_Int2:
		        	this._pShaderProgram.setVec2iArray(sName, pValue);
		        	break;
		        // case EAFXShaderVariableType.k_Bool2:
		        // 	this._pShaderProgram.setBool2Array(sName, pValue);
		        // 	break;

		        case EAFXShaderVariableType.k_Float3:
		        	this._pShaderProgram.setVec3Array(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_Int3:
		        	this._pShaderProgram.setVec3iArray(sName, pValue);
		        	break;
		        // case EAFXShaderVariableType.k_Bool3:
		        // 	this._pShaderProgram.setBool3Array(sName, pValue);
		        // 	break;

		        case EAFXShaderVariableType.k_Float4:
		        	this._pShaderProgram.setVec4Array(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_Int4:
		        	this._pShaderProgram.setVec4iArray(sName, pValue);
		        	break;
		        // case EAFXShaderVariableType.k_Bool4:
		        // 	this._pShaderProgram.setBool4Array(sName, pValue);
		        // 	break;

		        // case EAFXShaderVariableType.k_Float2x2:
		        // 	this._pShaderProgram.setMat2Array(sName, pValue);
		        // 	break;
		        case EAFXShaderVariableType.k_Float3x3:
		        	this._pShaderProgram.setMat3Array(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_Float4x4:
		        	this._pShaderProgram.setMat4Array(sName, pValue);
		        	break;

		        case EAFXShaderVariableType.k_Sampler2D:
		        	this._pShaderProgram.setSamplerArray(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_SamplerCUBE:
		        	this._pShaderProgram.setSamplerArray(sName, pValue);
		        	break;

		        default:
		        	CRITICAL("Wrong uniform array type (" + eType + ") with name " + sName);
			}
		}

		private applyUniform(sName: string, eType: EAFXShaderVariableType, pValue: any): void {
			switch (eType) {
		        case EAFXShaderVariableType.k_Float:
		        	this._pShaderProgram.setFloat(sName, pValue || 0.);
		        	break;
		        case EAFXShaderVariableType.k_Int:
		        	this._pShaderProgram.setInt(sName, pValue || 0);
		        	break;
		        case EAFXShaderVariableType.k_Bool:
		        	this._pShaderProgram.setInt(sName, pValue ? 1 : 0);
		        	break;

		        case EAFXShaderVariableType.k_Float2:
		        	this._pShaderProgram.setVec2(sName, pValue || vec2(0));
		        	break;
		        case EAFXShaderVariableType.k_Int2:
		        	this._pShaderProgram.setVec2i(sName, pValue || vec2(0));
		        	break;
		        // case EAFXShaderVariableType.k_Bool2:
		        // 	this._pShaderProgram.setBool2(sName, pValue);
		        // 	break;

		        case EAFXShaderVariableType.k_Float3:
		        	this._pShaderProgram.setVec3(sName, pValue || vec3(0));
		        	break;
		        case EAFXShaderVariableType.k_Int3:
		        	this._pShaderProgram.setVec3i(sName, pValue || vec3(0));
		        	break;
		        // case EAFXShaderVariableType.k_Bool3:
		        // 	this._pShaderProgram.setBool3(sName, pValue);
		        // 	break;

		        case EAFXShaderVariableType.k_Float4:
		        	this._pShaderProgram.setVec4(sName, pValue || vec4(0));
		        	break;
		        case EAFXShaderVariableType.k_Int4:
		        	this._pShaderProgram.setVec4i(sName, pValue || vec4(0));
		        	break;
		        // case EAFXShaderVariableType.k_Bool4:
		        // 	this._pShaderProgram.setBool4(sName, pValue);
		        // 	break;

		        // case EAFXShaderVariableType.k_Float2x2:
		        // 	this._pShaderProgram.setMat2(sName, pValue);
		        // 	break;
		        case EAFXShaderVariableType.k_Float3x3:
		        	this._pShaderProgram.setMat3(sName, pValue || mat3(0));
		        	break;
		        case EAFXShaderVariableType.k_Float4x4:
		        	this._pShaderProgram.setMat4(sName, pValue || mat4(0));
		        	break;

		        case EAFXShaderVariableType.k_Sampler2D:
		        	this._pShaderProgram.setSampler(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_SamplerCUBE:
		        	this._pShaderProgram.setSampler(sName, pValue);
		        	break;
		        case EAFXShaderVariableType.k_SamplerVertexTexture:
		        	this._pShaderProgram.setVertexBuffer(sName, pValue);
		        	break;
		        default:
		        	CRITICAL("Wrong uniform type (" + eType + ") with name " + sName);
			}
		}


	} 
}

#endif