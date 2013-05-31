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

	export interface IUniformStructFieldInfo {
		name: string;
		shaderName: string;
		type: EAFXShaderVariableType;
		length: uint;
	}

	export interface IShaderUniformInfo {
		name: string;
		location: uint;
		type: EAFXShaderVariableType;
		length: uint;
		applyFunction: Function;
		defaultValue: any;
	}

	export interface IShaderAttrInfo {
		name: string;
		location: uint;
		semantic: string;
		isMappable: bool;
		vertexTextureInfo: IShaderUniformInfo;

		//some info about offsets
	}


	export interface IShaderUniformInfoMap {
		[name: string]: IShaderUniformInfo;
	}

	export interface IShaderAttrInfoMap {
		[name: string]: IShaderAttrInfo;
	}

	export interface IUniformStructFieldInfoMap {
		[name: string]: IUniformStructFieldInfo;
	}


	export interface IInputUniformInfo {
		name: string;
		isComplex: bool;
		shaderVarInfo: IShaderUniformInfo;
	}

	// export class UniformVarInfo implements IUniformVarInfo {
	// 	location: uint;
	// 	name: string;
	// 	shaderName: string;
	// 	type: EAFXShaderVariableType;
	// 	length: uint;

	// 	constructor(sName: string, sShaderName: string, eType: EAFXShaderVariableType, iLength: uint, iLocation: uint){
	// 		this.location = iLocation;
	// 		this.name = sName;
	// 		this.shaderName = sShaderName;
	// 		this.type = eType;
	// 		this.length = iLength;
	// 	}
	// }

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
		private _pInputSamplerArrayInfoList: string[] = null; /* only sampler arrays */
		private _pInputSamplerInfoList: string[] = null;
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


		private _pShaderUniformInfoMap: IShaderUniformInfoMap = null;
		private _pShaderAttrInfoMap: IShaderAttrInfoMap = null;

		private _pShaderUniformInfoList: IShaderUniformInfo[] = null;
		private _pShaderAttrInfoList: IShaderAttrInfo[] = null;

		private _pInputUniformInfoList: IInputUniformInfo[] = null;
		private _pInputSamplerInfoList: IInputUniformInfo[] = null;
		private _pInputSamplerArrayInfoList: IInputUniformInfo[] = null;

		private _pUnifromInfoForStructFieldMap: IUniformStructFieldInfoMap = null;

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
			
			this._pShaderUniformInfoList = new Array(this._pRealUniformNameList.length);
			this._pShaderAttrInfoList = new Array(this._pRealAttrNameList.length);

			this._pShaderUniformInfoMap = <IShaderUniformInfoMap>{};
			this._pShaderAttrInfoMap = <IShaderAttrInfoMap>{};
			
			this._pShaderProgram = pProgram;

			for (var i: int = 0; i < this._pRealUniformNameList.length; i++) {
				var sUniformName: string = this._pRealUniformNameList[i];
				var pUniformInfo: IShaderUniformInfo = this.createShaderUniformInfo(sUniformName, i);
				
				this._pUniformExistMap[sUniformName] = true;
				this._pShaderUniformInfoList[i] = pUniformInfo;
				this._pShaderUniformInfoMap[sUniformName] = pUniformInfo;
			}



			for (var i: int = 0; i < this._pRealAttrNameList.length; i++) {
				var sAttrName: string = this._pRealAttrNameList[i];
				var pAttrInfo: IShaderAttrInfo = this.createShaderAttrInfo(sAttrName, i);

				this._pAttrExistMap[sAttrName] = true;
				this._pShaderAttrInfoList[i] = pAttrInfo;
				this._pShaderAttrInfoMap[sAttrName] = pAttrInfo;
			}

			this._pUnifromInfoForStructFieldMap = <IUniformStructFieldInfoMap>{};

			return true;
		}

		inline _getShaderInput(): IShaderInput {
			return this._pDataPoolArray.length > 0? this._pDataPoolArray.pop(): this._createDataPool();
		}

		inline _releaseShaderInput(pPool: IShaderInput): void {
			this._pDataPoolArray.push(pPool);
		}

		inline isUniformExists(sName: string): bool {
			return this._pUniformExistMap[sName] ? true : this._pUniformExistMap[sName] = false;
		}

		inline isAttrExists(sName: string): bool {
			return this._pAttrExistMap[sName] ? true : this._pAttrExistMap[sName]  = false;
		}


		_createDataPool(): IShaderInput {
			var pInput: IShaderInput = {
				uniforms: <{[index: uint]: any;}>{},
				attrs: <{[index: uint]: any;}>{}
			};

			//assume, that attr & uniform never have same names!!!

			for (var i: int = 0; i < this._pShaderUniformInfoList.length; i++) {
				var pUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoList[i];

				pInput.uniforms[i] = null;

				if ((pUniformInfo.type === EAFXShaderVariableType.k_Sampler2D ||
					 pUniformInfo.type === EAFXShaderVariableType.k_SamplerCUBE)){

					if(pUniformInfo.length > 0){
						pInput.uniforms[i] = new Array(pUniformInfo.length);

						for(var j: uint = 0; j < pUniformInfo.length; j++){
							pInput.uniforms[i][j] = createSamplerState();
						}
					}
					else {
						pInput.uniforms[i] = createSamplerState();
					}
					
				}
			}

			for (var i: int = 0; i < this._pShaderAttrInfoList.length; i++) {
				pInput.attrs[i] = null;
			}

			return pInput;
		}

		setUniform(iLocation: uint, pValue: any): void {
			this._pUniformApplyFunctionMap[iLocation].call(this._pShaderProgram, this._pRealUniformNameList[iLocation], pValue || this._pUniformUndefValues[iLocation]);
			// var eType: EAFXShaderVariableType = this.getType(sName);
			// var iLength: int = this.getLength(sName);

			// if(eType === EAFXShaderVariableType.k_NotVar) {
			// 	return;
			// }
			// else {
			// 	this._pUniformApplyFunctionMap[sName].call(this._pShaderProgram, sName, pValue || this._pUniformUndefValues[sName]);
			// }
			// this._pUniformApplyFunctionMap[sName].call(this._pShaderProgram, sName, pValue || this._pUniformUndefValues[sName]);

			// if (iLength > 0) {
			// 	this.applyUnifromArray(sName, eType, pValue);
			// }
			// else {
			// 	this.applyUniform(sName, eType, pValue);
			// }
		}

		_initInput(pPassInput: IAFXPassInputBlend, pBlend: SamplerBlender, pAttrs: AttributeBlendContainer): bool {
			/* Initialize info about uniform variables(not samplers and video buffers) */			
			var pUniformKeys: string[] = pPassInput.uniformKeys;
			this._pInputUniformInfoList = [];

			for(var i: uint = 0; i < pUniformKeys.length; i++) {
				var sName: string = pUniformKeys[i];
				var eType: EAFXShaderVariableType =  pPassInput._getUniformType(sName);
				var iLength: uint = pPassInput._getUnifromLength(sName);
				var isArray: bool = (iLength > 0);

				var pInputUniformInfo: IInputUniformInfo = null;

				if(eType === EAFXShaderVariableType.k_Complex){
					if(this.expandStructUniforms(pPassInput._getAFXUniformVar(sName))) {
						pInputUniformInfo = this.createInputUniformInfo(sName, null, true);
					}
				}
				else {
					var sShaderName: string = isArray ? (sName + "[0]") : sName;

					if(!this.isUniformExists(sShaderName)){
						continue;
					}

					var pShaderUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoMap[sShaderName];

					pShaderUniformInfo.type = eType;
					pShaderUniformInfo.length = iLength;

					pInputUniformInfo = this.createInputUniformInfo(sName, pShaderUniformInfo, false);
				}

				this._pInputUniformInfoList.push(pInputUniformInfo);
			}

			/* Initialize info about samplers*/
			var iTotalSamplerSlots: uint = pBlend.totalActiveSlots;
			this._pInputSamplerInfoList = [];

			for(var i: uint = 0; i < iTotalSamplerSlots; i++){
				var pShaderUniformInfo: IShaderUniformInfo = null;
				var pInputUniformInfo: IInputUniformInfo = null;

				if(i === ZERO_SLOT) {
					this._isUsedZero2D = this.isUniformExists("as0");
					this._isUsedZeroCube = this.isUniformExists("asc0");

					if(this._isUsedZero2D){
						pShaderUniformInfo = this._pShaderUniformInfoMap["as0"];

						pShaderUniformInfo.type = EAFXShaderVariableType.k_Int;
						pShaderUniformInfo.length = 0;
					}

					if(this._isUsedZeroCube){
						pShaderUniformInfo = this._pShaderUniformInfoMap["asc0"];

						pShaderUniformInfo.type = EAFXShaderVariableType.k_Int;
						pShaderUniformInfo.length = 0;
					}

					continue;
				}
				
				var sRealSamplerName: string = "as" + i.toString();

				if(!this.isUniformExists(sRealSamplerName)){
					continue;
				}

				var pSampler: IAFXVariableDeclInstruction = pBlend.getSamplersBySlot(i).value(0);
				var sSampler: string = pSampler.getSemantic() || pSampler.getName();
				var eType: EAFXShaderVariableType = pSampler.getType().isSampler2D() ?
									 					EAFXShaderVariableType.k_Sampler2D :
									 					EAFXShaderVariableType.k_SamplerCUBE;

				pShaderUniformInfo = this._pShaderUniformInfoMap[sRealSamplerName];

				pShaderUniformInfo.type = eType;
				pShaderUniformInfo.length = 0;
				
				pInputUniformInfo = this.createInputUniformInfo(sSampler, pShaderUniformInfo, false);

				this._pInputSamplerInfoList.push(pInputUniformInfo);
			}


			/* Initialize info about array of samplers */
			var pSamplerArrayKeys: string[] = pPassInput.samplerArrayKeys;
			this._pInputSamplerArrayInfoList = [];

			for(var i: uint = 0; i < pSamplerArrayKeys.length; i++) {
				var sName: string = pSamplerArrayKeys[i];
				var eType: EAFXShaderVariableType =  pPassInput._getUniformType(sName);
				var iLength: uint = pPassInput._getUnifromLength(sName);
				var sShaderName: string = sName + "[0]";
				var pInputUniformInfo: IInputUniformInfo = null;

				if(!this.isUniformExists(sShaderName)){
					continue;
				}

				var pShaderUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoMap[sShaderName];

				pShaderUniformInfo.type = eType;
				pShaderUniformInfo.length = iLength;

				pInputUniformInfo = this.createInputUniformInfo(sName, pShaderUniformInfo, false);

				this._pInputSamplerArrayInfoList.push(pInputUniformInfo);
			}


			this._pRealAttrSlotFromFlows = [];
			this._pRealAttrIsIndexData = [];
			this._pBufferSamplersFromFlows = [];

			var iTotalAttrSlots: uint = pAttrs.totalSlots;
			var pSemantics: string[] = pAttrs.semantics;
			
			var nPreparedAttrs: int = -1;
			var nPreparedBuffers: int = -1;

			for(var i: uint = 0; i < pSemantics.length; i++){
				var sSemantic: string = pSemantics[i];
				var iSlot: uint = pAttrs.getSlotBySemantic(sSemantic);

				if(iSlot === -1) {
					continue;
				}

				var iBufferSlot: uint = pAttrs.getBufferSlotBySemantic(sSemantic);			

				// is it not initied attr?
				if(iSlot > nPreparedAttrs) {
					var sAttrName: string = "aa" + iSlot.toString();
					var sBufferName: string = "abs" + iBufferSlot.toString();

					if(!this.isAttrExists(sAttrName)){
						continue;
					}

					var pShaderAttrInfo: IShaderAttrInfo = this._pShaderAttrInfoMap[sAttrName];
					var isMappable: bool = iBufferSlot >= 0;
					var pVertexTextureInfo: IShaderUniformInfo = isMappable ? this._pShaderUniformInfoMap[sBufferName] : null;

					// need to init buffer
					if(iBufferSlot > nPreparedBuffers){
						if(!this.isUniformExists(sBufferName)){
							debug_error("This erroer must not be happen");
							continue;
						}

						pVertexTextureInfo.type = EAFXShaderVariableType.k_SamplerVertexTexture;
						pVertexTextureInfo.length = 0;
					}

					pShaderAttrInfo.semantic = sSemantic;
					pShaderAttrInfo.isMappable = isMappable;
					pShaderAttrInfo.vertexTextureInfo = pVertexTextureInfo;

						this._pRealAttrSlotFromFlows.push(sSemantic);
						
						if(pAttrs.getType(sSemantic).isComplex()){
							this._pRealAttrIsIndexData.push(true);
						}
						else {
							this._pRealAttrIsIndexData.push(false);
						}

					// }
					// else {
					// 	this._pRealAttrSlotFromFlows.push(null);
					// 	this._pAttrExistMap[sAttrName] = false;
					// }

					nPreparedAttrs++;

					if(iBufferSlot > nPreparedBuffers){
						var sBufferName: string = "abs" + iBufferSlot.toString();
						
						if(this.isUniformExists(sBufferName)){
							this._pBufferSamplersFromFlows.push(sSemantic);
							this._pRealUniformTypeMap[sBufferName] = EAFXShaderVariableType.k_SamplerVertexTexture;

							//this.setUniformApplyFunction(sBufferName, EAFXShaderVariableType.k_SamplerVertexTexture, false);
						}
						else {
							this._pUniformExistMap[sBufferName] = false;
						}
						
						nPreparedBuffers++;
					}
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

							//this.setUniformApplyFunction(sOffsetName, EAFXShaderVariableType.k_Float, false);
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

			/* Prepare funtions to set uniform value in real shader progrham */
			for(var i: uint = 0; i < this._pShaderUniformInfoList.length; i++){
				this.prepareApplyFunctionForUniform(this._pShaderUniformInfoList[i]);
			}

			return true;
		}

		private createShaderUniformInfo(sName: string, iLocation: uint): IShaderUniformInfo {
			return <IShaderUniformInfo>{
				name: sName,
				location: iLocation,
				type: EAFXShaderVariableType.k_NotVar,
				length: 0,

				applyFunction: null,
				defaultValue: null
			};
		}

		private createShaderAttrInfo(sName: string, iLocation: uint): IShaderUniformInfo {
			return <IShaderAttrInfo>{
				name: sName,
				location: iLocation,
				semantic: "",
				isMappable: false,
				vertexTextureInfo: null
			};
		}

		private createInputUniformInfo(sName: string, pShaderUniformInfo: IShaderUniformInfo, isComplex: bool): IInputUniformInfo {
			return <IShaderUniformInfo>{
				name: sName,
				isComplex: isComplex,
				shaderVarInfo: pShaderUniformInfo
			};
		}

		private prepareApplyFunctionForUniform(pUniform: IShaderUniformInfo): void {
			if(pUniform.type !== EAFXShaderVariableType.k_NotVar) {
				pUniform.applyFunction = this.getUniformApplyFunction(pUniform.type, (pUniform.length > 0));
				pUniform.applyFunction = this.getUnifromDefaultValue(pUniform.type, (pUniform.length > 0));
			}
		}

		private getUniformApplyFunction(eType: EAFXShaderVariableType, isArray: bool): Function {
			if(isArray){
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	return this._pShaderProgram.setFloat32Array;
			        case EAFXShaderVariableType.k_Int:
			        	return this._pShaderProgram.setInt32Array;
			        // case EAFXShaderVariableType.k_Bool:
			        // 	return this._pShaderProgram.setBoolArray;

			        case EAFXShaderVariableType.k_Float2:
			        	return this._pShaderProgram.setVec2Array;
			        case EAFXShaderVariableType.k_Int2:
			        	return this._pShaderProgram.setVec2iArray;
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	return this._pShaderProgram.setBool2Array;

			        case EAFXShaderVariableType.k_Float3:
			        	return this._pShaderProgram.setVec3Array;
			        case EAFXShaderVariableType.k_Int3:
			        	return this._pShaderProgram.setVec3iArray;
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	return this._pShaderProgram.setBool3Array;

			        case EAFXShaderVariableType.k_Float4:
			        	return this._pShaderProgram.setVec4Array;
			        case EAFXShaderVariableType.k_Int4:
			        	return this._pShaderProgram.setVec4iArray;
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	return this._pShaderProgram.setBool4Array;

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	return this._pShaderProgram.setMat2Array;
			        case EAFXShaderVariableType.k_Float3x3:
			        	return this._pShaderProgram.setMat3Array;
			        case EAFXShaderVariableType.k_Float4x4:
			        	return this._pShaderProgram.setMat4Array;

			        case EAFXShaderVariableType.k_Sampler2D:
			        	return this._pShaderProgram.setSamplerArray;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	return this._pShaderProgram.setSamplerArray;
			        default:
			        	CRITICAL("Wrong uniform array type (" + eType + ") with name " + iLocation);
		        }
			}
			else {
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	return this._pShaderProgram.setFloat;
			        	this._pUniformUndefValues[iLocation] = 0.;
			        case EAFXShaderVariableType.k_Int:
			        	return this._pShaderProgram.setInt;
			        	this._pUniformUndefValues[iLocation] = 0;
			        case EAFXShaderVariableType.k_Bool:
			        	return this._pShaderProgram.setInt;
			        	this._pUniformUndefValues[iLocation] = 0;

			        case EAFXShaderVariableType.k_Float2:
			        	return this._pShaderProgram.setVec2;
			        	this._pUniformUndefValues[iLocation] = new Vec2(0);
			        case EAFXShaderVariableType.k_Int2:
			        	return this._pShaderProgram.setVec2i;
			        	this._pUniformUndefValues[iLocation] = new Vec2(0);
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	return this._pShaderProgram.setBool2

			        case EAFXShaderVariableType.k_Float3:
			        	return this._pShaderProgram.setVec3;
			        	this._pUniformUndefValues[iLocation] = new Vec3(0);
			        case EAFXShaderVariableType.k_Int3:
			        	return this._pShaderProgram.setVec3i;
			        	this._pUniformUndefValues[iLocation] = new Vec3(0);
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	return this._pShaderProgram.setBool3

			        case EAFXShaderVariableType.k_Float4:
			        	return this._pShaderProgram.setVec4;
			        	this._pUniformUndefValues[iLocation] = new Vec4(0);
			        case EAFXShaderVariableType.k_Int4:
			        	return this._pShaderProgram.setVec4i;
			        	this._pUniformUndefValues[iLocation] = new Vec4(0);
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	return this._pShaderProgram.setBool4

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	return this._pShaderProgram.setMat2
			        case EAFXShaderVariableType.k_Float3x3:
			        	return this._pShaderProgram.setMat3;
			        	this._pUniformUndefValues[iLocation] = new Mat3(0);
			        case EAFXShaderVariableType.k_Float4x4:
			        	return this._pShaderProgram.setMat4;
			        	this._pUniformUndefValues[iLocation] = new Mat4(0);

			        case EAFXShaderVariableType.k_Sampler2D:
			        	return this._pShaderProgram.setSampler;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	return this._pShaderProgram.setSampler;
			        case EAFXShaderVariableType.k_SamplerVertexTexture:
			        	return this._pShaderProgram.setVertexBuffer;
			        default:
			        	CRITICAL("Wrong uniform type (" + eType + ") with name " + iLocation);
		        }
			}
		}

		private getUnifromDefaultValue(eType: EAFXShaderVariableType, isArray: bool): any {
			if(isArray){
				return null;
			}
			else {
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	return 0.;
			        case EAFXShaderVariableType.k_Int:
			        	return 0;
			        case EAFXShaderVariableType.k_Bool:
			        	return 0;

			        case EAFXShaderVariableType.k_Float2:
			        	return new Vec2(0);
			        case EAFXShaderVariableType.k_Int2:
			        	return new Vec2(0);
			        case EAFXShaderVariableType.k_Bool2:
			        	return new Vec2(0);

			        case EAFXShaderVariableType.k_Float3:
			        	return new Vec3(0);
			        case EAFXShaderVariableType.k_Int3:
			        	return new Vec3(0);
			        case EAFXShaderVariableType.k_Bool3:
			        	return new Vec3(0);

			        case EAFXShaderVariableType.k_Float4:
			        	return new Vec4(0);
			        case EAFXShaderVariableType.k_Int4:
			        	return new Vec4(0);
			        case EAFXShaderVariableType.k_Bool4:
			        	return new Vec4(0);

			        case EAFXShaderVariableType.k_Float2x2:
			        	return new Mat2(0);
			        case EAFXShaderVariableType.k_Float3x3:
			        	return new Mat3(0);
			        case EAFXShaderVariableType.k_Float4x4:
			        	return new Mat4(0);

			        case EAFXShaderVariableType.k_Sampler2D:
			        	return null;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	return null;
			        case EAFXShaderVariableType.k_SamplerVertexTexture:
			        	return null;
			        default:
			        	CRITICAL("Wrong uniform type (" + eType + ") with name " + iLocation);
		        }
			}
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

			// for(var i: uint = 0; i < this._pInputSamplerInfoList.length; i++){
			// 	var sRealName: string = this._pRealSamplersNames[i];
			// 	var sName: string = this._pInputSamplerInfoList[i];
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
			
			// for(var i: uint = 0; i < this._pInputSamplerArrayInfoList.length; i++){
			// 	var sName: string = this._pInputSamplerArrayInfoList[i];
			// 	var iLength: uint = this._pRealUniformLengthMap[sName];
			// 	var pSamplerStates: IAFXSamplerState[] = pSamplerArrays[sName];
			// 	var pInputStates: IAFXSamplerState[] = pInput[sName + "[0]"];

			// 	for(var j: uint = 0; j < iLength; j++) {
			// 		var pTexture: ITexture = pPassInput._getTextureForSamplerState(pSamplerStates[j]);
			// 		this.setSamplerState(pInputStates[j], pTexture, pSamplerStates[j]);
			// 	}
			// } 
			
			
			for(var i: uint = 0; i < this._pInputUniformInfoList.length; i++){
				var pInfo: IUniformVarInfo = this._pInputUniformInfoList[i];
				
				if(pInfo.type !== EAFXShaderVariableType.k_Complex) {
					pInput.uniforms[pInfo.location] = pUniforms[pInfo.name];
				}
				else {
					// this.applyStructUniform(pInfo.name, pUniforms[pInfo.name], pInput);
				}				
			}
			
			// for(var i: uint = 0; i < this._pInputUniformInfoList.length; i++){
			// 	var pInfo: IUniformVarInfo = this._pInputUniformInfoList[i];
				
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
					pInput.uniforms[this._pShaderUniformInfoMap[sBufferName]] = pFlow.data.buffer;
					iBufferSlot++;
				}

				var sAttrName: string = "aa" + i.toString();
				pInput.attrs[this._pShaderAttrInfoMap[sAttrName]] = pFlow;


				var pOffsetVars: IAFXVariableDeclInstruction[] = this._pAttrContainer.getOffsetVarsBySemantic(sSemantic);
				if(!isNull(pOffsetVars)){
					var pVertexDecl: IVertexDeclaration = pFlow.data.getVertexDeclaration();

					for(var j: uint = 0; j < pOffsetVars.length; j++){
						var sOffsetSemantic: string = pOffsetVars[j].getSemantic();
						var sOffsetName: string = pOffsetVars[j].getRealName();

						if(this.isUniformExists(sOffsetName)){
							var pElement: IVertexElement = pVertexDecl.findElement(sOffsetSemantic);
						
							if(isNull(pElement)){
								pInput.uniforms[this._pShaderUniformInfoMap[sOffsetName]] = this._pAttrContainer.getOffsetDefault(sOffsetName);
							}
							else {
								pInput.uniforms[this._pShaderUniformInfoMap[sOffsetName]] = pElement.offset / 4;
							}

						}
					}
				}
			}

			if(this._isUsedZero2D){
				pInput.uniforms[this._pShaderUniformInfoMap["as0"]] = 19;
			}

			if(this._isUsedZeroCube){
				pInput.uniforms[this._pShaderUniformInfoMap["asc0"]] = 19;
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

		private createBaseUniformInfo(sName: string, sShaderName: string, 
									  eType: EAFXShaderVariableType, iLength: uint): IUniformStructFieldInfo {
			return <IUniformStructFieldInfo>{
				name: sName,
				shaderName: sShaderName,
				type: eType,
				length: iLength
			};
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
						var iFieldLength: uint = 0;

#ifdef WEBGL
						var eFieldType: EAFXShaderVariableType = 0;

						if(isFakeLength && i === 1) {
							eFieldType = EAFXShaderVariableType.k_NotVar;
						}
						else {
							eFieldType = PassInputBlend.getVariableType(pField);
						}
#else
						var eFieldType: EAFXShaderVariableType = PassInputBlend.getVariableType(pField);
#endif

						var iFieldLength: uint = pField.getType().getLength();

						var sFieldShaderName: string = sFieldRealName;

						if(pField.getType().isNotBaseArray()){
							sFieldShaderName += "[0]";
						}

						if(!this.isUniformExists(sFieldShaderName)){
							continue;
						}

						var pShaderUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoMap[sFieldShaderName];
						pShaderUniformInfo.type = eFieldType;
						pShaderUniformInfo.length = iFieldLength;

						this._pUnifromInfoForStructFieldMap[sFieldRealName]	= this.createBaseUniformInfo(sFieldRealName, sFieldShaderName, 
																										 eType, iFieldLength);

						isAnyFieldExist = true;
					}

				}
			}

#ifdef WEBGL
			if(isFakeLength){
				iLength = 1;
			}
#endif
			if(isAnyFieldExist){
				this._pUnifromInfoForStructFieldMap[sPrevName] = this.createBaseUniformInfo(sPrevName, sPrevName,
																							 EAFXShaderVariableType.k_Complex, 
																							 isArray ? iLength : 0);				
			}
			else {
				this._pUnifromInfoForStructFieldMap[sPrevName] = null;
			}

			return isAnyFieldExist;
		}

		private applyStructUniform(sName: string, pValue: any, pInput: IShaderInput): void {
			if(!isDefAndNotNull(pValue)){
				return;
			}

			var pVarInfo: IUniformStructFieldInfo = this._pUnifromInfoForStructFieldMap[sName];

			if(pVarInfo.length > 0){
				if(!isDef(pValue.length)){
					return;
				}

				var iLength: uint = math.min(pVarInfo.length, pValue.length);

				for(var i: uint = 0; i < iLength; i++){
					var sFieldPrevName: string = sName + "[" + i + "]";

					for(var j in pValue[i]) {
						if(!pValue[i].hasOwnProperty(j)){
							continue;
						}
						var sFieldName: string = sFieldPrevName + "." + j;
						var pFieldInfo: IUniformStructFieldInfo = this._pUnifromInfoForStructFieldMap[sFieldName];

						if(isDefAndNotNull(pFieldInfo)){
							if(pFieldInfo.type === EAFXShaderVariableType.k_Complex){
								this.applyStructUniform(sFieldName, pValue[i][j], pInput);		
							}
							else {
								pInput.uniforms[this._pShaderUniformInfoMap[pFieldInfo.shaderName].location] = pValue[i][j];
							}
						}
						else {
							this._pUnifromInfoForStructFieldMap[sFieldName] = null;
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
					var pFieldInfo: IUniformStructFieldInfo = this._pUnifromInfoForStructFieldMap[sFieldName];

					if(isDefAndNotNull(pFieldInfo)){
						if(pFieldInfo.type === EAFXShaderVariableType.k_Complex){
							this.applyStructUniform(sFieldName, pValue[j], pInput);		
						}
						else {
							pInput.uniforms[this._pShaderUniformInfoMap[pFieldInfo.shaderName].location] = pValue[j];					
						}
					}
					else {
						this._pUnifromInfoForStructFieldMap[sFieldName] = null;
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