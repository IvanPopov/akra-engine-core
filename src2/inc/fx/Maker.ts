#ifndef AFXMAKER_TS
#define AFXMAKER_TS

#include "IAFXMaker.ts"
#include "IAFXComposer.ts"
#include "util/unique.ts"
#include "IResourcePoolManager.ts"
#include "PassInputBlend.ts"

#include "IShaderInput.ts"
#include "render/renderUtil.ts"

#ifdef WEBGL

#include "webgl/WebGLShaderProgram.ts"

#endif

// #define PROFILE_MAKE 1

module akra.fx {

	export interface IUniformTypeMap {
		[name: string]: EAFXShaderVariableType;
	}

	// export interface IUniformStructInfo {
	// 	name: string;
	// 	shaderName: string;
	// 	type: EAFXShaderVariableType;
	// 	length: uint;
	// }
	
	export interface IUniformStructInfo {
		name: string;
		isComplex: bool;
		isArray: bool;
		index: int;

		fields: IUniformStructInfo[];
		shaderVarInfo: IShaderUniformInfo;
	}

	export interface IShaderUniformInfo {
		name: string;
		location: uint;
#ifdef WEBGL
		webGLLocation: WebGLUniformLocation;
#endif
		type: EAFXShaderVariableType;
		length: uint;
		applyFunction: Function;
		defaultValue: any;
	}

	export interface IShaderAttrOffsetInfo {
		semantic: string;
		shaderVarInfo: IShaderUniformInfo;
		defaultValue: float;
	}

	export interface IShaderAttrInfo extends IAFXBaseAttrInfo {
		name: string;
		location: uint;
		semantic: string;
		isMappable: bool;
		isComplex: bool;
		vertexTextureInfo: IShaderUniformInfo;
		offsets: IShaderAttrOffsetInfo[];
	}

	export interface IShaderUniformInfoMap {
		[name: string]: IShaderUniformInfo;
	}

	export interface IShaderAttrInfoMap {
		[name: string]: IShaderAttrInfo;
	}

	export interface IUniformStructInfoMap {
		[name: string]: IUniformStructInfo;
	}


	export interface IInputUniformInfo {
		name: string;
		nameIndex: uint;
		isComplex: bool;
		isCollapsedArray: bool;
		shaderVarInfo: IShaderUniformInfo;
		structVarInfo: IUniformStructInfo;
	}

#ifdef WEBGL
	function createShaderUniformInfo(sName: string, iLocation: uint, pWebGLLocation: WebGLUniformLocation): IShaderUniformInfo {
		return <IShaderUniformInfo>{
			name: sName,
			location: iLocation,
			webGLLocation: pWebGLLocation,
			type: EAFXShaderVariableType.k_NotVar,
			length: 0,

			applyFunction: null,
			defaultValue: null
		};
	}
#else
	function createShaderUniformInfo(sName: string, iLocation: uint): IShaderUniformInfo {
		return <IShaderUniformInfo>{
			name: sName,
			location: iLocation,
			type: EAFXShaderVariableType.k_NotVar,
			length: 0,

			applyFunction: null,
			defaultValue: null
		};
	}
#endif

	function createShaderAttrInfo(sName: string, iLocation: uint): IShaderAttrInfo {
		return <IShaderAttrInfo>{
			name: sName,
			location: iLocation,
			semantic: "",
			isMappable: false,
			isComplex: false,
			vertexTextureInfo: null,
			offsets: null
		};
	}

	function createShaderAttrOffsetInfo(sSemantic: string,  pShaderUniformInfo: IShaderUniformInfo, fDefault: float): IShaderAttrOffsetInfo {
		return <IShaderAttrOffsetInfo>{
			semantic: sSemantic,
			shaderVarInfo: pShaderUniformInfo,
			defaultValue: fDefault
		};
	}

	function createInputUniformInfo(sName: string, iNameIndex: uint, pShaderUniformInfo: IShaderUniformInfo, isComplex: bool): IInputUniformInfo {
		return <IInputUniformInfo>{
			name: sName,
			nameIndex: iNameIndex,
			isComplex: isComplex,
			isCollapsedArray: false,
			shaderVarInfo: pShaderUniformInfo,
			structVarInfo: null
		};
	}

	// function createUniformStructFieldInfo(sName: string, sShaderName: string, 
	// 							  eType: EAFXShaderVariableType, iLength: uint): IUniformStructInfo {
	// 	return <IUniformStructInfo>{
	// 		name: sName,
	// 		shaderName: sShaderName,
	// 		type: eType,
	// 		length: iLength
	// 	};
	// }

	function createUniformStructFieldInfo(sName: string, isComplex: bool, isArray: bool): IUniformStructInfo {
		return <IUniformStructInfo>{
			name: sName,
			isComplex: isComplex,
			isArray: isArray,
			index: -1,

			fields: null,
			shaderVarInfo: null
		};
	}


	export class Maker implements IAFXMaker {
		UNIQUE();

		private _pComposer: IAFXComposer = null;
		private _pPassBlend: IAFXPassBlend = null;

#ifdef WEBGL
		private _pShaderProgram: webgl.WebGLShaderProgram = null;
#else
		private _pShaderProgram: IShaderProgram = null;
#endif
		private _pRealUniformNameList: string[] = null;
		private _pRealAttrNameList: string[] = null;

		// is really exists uniform & attr?
		private _pUniformExistMap: BoolMap = <BoolMap>{};
		private _pAttrExistMap: BoolMap = <BoolMap>{};

		private _isUsedZero2D: bool = false;
		private _isUsedZeroCube: bool = false;

		// private _pAttrContainer: AttributeBlendContainer = null;
		//стек объектов храняих все юниформы и аттрибуты
		private _pDataPoolArray: util.ObjectArray = new util.ObjectArray();


		private _pShaderUniformInfoMap: IShaderUniformInfoMap = null;
		private _pShaderAttrInfoMap: IShaderAttrInfoMap = null;

		private _pShaderUniformInfoList: IShaderUniformInfo[] = null;
		private _pShaderAttrInfoList: IShaderAttrInfo[] = null;

		private _pInputUniformInfoList: IInputUniformInfo[] = null;
		private _pInputSamplerInfoList: IInputUniformInfo[] = null;
		private _pInputSamplerArrayInfoList: IInputUniformInfo[] = null;

		private _pUnifromInfoForStructFieldMap: IUniformStructInfoMap = null;

		inline isArray(sName: string) {
			return this.getLength(sName) > 0;
		}

		inline getType(sName: string): EAFXShaderVariableType {
			return this._pShaderUniformInfoMap[sName].type;
		}

		inline getLength(sName: string): uint {
			return this._pShaderUniformInfoMap[sName].length;
		}

		inline get shaderProgram(): IShaderProgram {
			return this._pShaderProgram;
		}

		inline get attributeInfo(): IAFXBaseAttrInfo[] {
			return <IAFXBaseAttrInfo[]>this._pShaderAttrInfoList;
		}

		inline get uniformNames(): string[] {
			return this._pRealUniformNameList;
		}


		constructor(pComposer: IAFXComposer, pPassBlend: IAFXPassBlend){
			this._pComposer = pComposer;
			this._pPassBlend = pPassBlend;
		}

		_create(sVertex: string, sPixel: string): bool {
			var pRmgr: IResourcePoolManager = this._pComposer.getEngine().getResourceManager();
			// LOG(this, sVertex, sPixel);
#ifdef WEBGL
			var pProgram: webgl.WebGLShaderProgram = <webgl.WebGLShaderProgram>pRmgr.createShaderProgram(".shader-prorgam-" + this.getGuid().toString());
#else
			var pProgram: IShaderProgram = pRmgr.createShaderProgram(".shader-prorgam-" + this.getGuid().toString());
#endif
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
#ifdef WEBGL
				var pUniformInfo: IShaderUniformInfo = createShaderUniformInfo(sUniformName, i, pProgram.getWebGLUniformLocation(sUniformName));
#else
				var pUniformInfo: IShaderUniformInfo = createShaderUniformInfo(sUniformName, i);
#endif	
				this._pUniformExistMap[sUniformName] = true;
				this._pShaderUniformInfoList[i] = pUniformInfo;
				this._pShaderUniformInfoMap[sUniformName] = pUniformInfo;
			}



			for (var i: int = 0; i < this._pRealAttrNameList.length; i++) {
				var sAttrName: string = this._pRealAttrNameList[i];
				var pAttrInfo: IShaderAttrInfo = createShaderAttrInfo(sAttrName, i);

				this._pAttrExistMap[sAttrName] = true;
				this._pShaderAttrInfoList[i] = pAttrInfo;
				this._pShaderAttrInfoMap[sAttrName] = pAttrInfo;
			}

			this._pUnifromInfoForStructFieldMap = <IUniformStructInfoMap>{};

			this["sVertex"] = sVertex;
			this["sPixel"] = sPixel;

			// LOG(sVertex, sPixel);

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
				attrs: <{[index: uint]: any;}>{},
				renderStates: render.createRenderStateMap()
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
			if(this._pShaderUniformInfoList[iLocation].type !== EAFXShaderVariableType.k_NotVar){
#ifdef WEBGL
				this._pShaderUniformInfoList[iLocation].applyFunction.call(this._pShaderProgram, 
																   this._pShaderUniformInfoList[iLocation].webGLLocation,
																   pValue || this._pShaderUniformInfoList[iLocation].defaultValue);
#else
				this._pShaderUniformInfoList[iLocation].applyFunction.call(this._pShaderProgram, 
																   this._pShaderUniformInfoList[iLocation].name,
																   pValue || this._pShaderUniformInfoList[iLocation].defaultValue);
#endif
			}
		}

		_initInput(pPassInput: IAFXPassInputBlend, pBlend: SamplerBlender, pAttrs: AttributeBlendContainer): bool {
			/* Initialize info about uniform variables(not samplers and video buffers) */			
			var pUniformKeys: uint[] = pPassInput.uniformKeys;
			this._pInputUniformInfoList = [];

			for(var i: uint = 0; i < pUniformKeys.length; i++) {
				var iNameIndex: uint = pUniformKeys[i];
				var sName: string = pPassInput._getUniformVarNameByIndex(iNameIndex);
				var eType: EAFXShaderVariableType = pPassInput._getUniformType(iNameIndex);
				var iLength: uint = pPassInput._getUniformLength(iNameIndex);
				var isArray: bool = (iLength > 0);

				var pInputUniformInfo: IInputUniformInfo = null;

				if(eType === EAFXShaderVariableType.k_Complex){
					var pStructInfo: IUniformStructInfo = this.expandStructUniforms(pPassInput._getUniformVar(iNameIndex));
					if(!isNull(pStructInfo)){
						pInputUniformInfo = createInputUniformInfo(sName, iNameIndex, null, true);
						pInputUniformInfo.structVarInfo = pStructInfo;
						this._pInputUniformInfoList.push(pInputUniformInfo);
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

					pInputUniformInfo = createInputUniformInfo(sName, iNameIndex, pShaderUniformInfo, false);
					this._pInputUniformInfoList.push(pInputUniformInfo);
				}
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
				var iNameIndex: uint = pPassInput._getUniformVarNameIndex(sSampler);
				var eType: EAFXShaderVariableType = pSampler.getType().isSampler2D() ?
									 					EAFXShaderVariableType.k_Sampler2D :
									 					EAFXShaderVariableType.k_SamplerCUBE;

				pShaderUniformInfo = this._pShaderUniformInfoMap[sRealSamplerName];

				pShaderUniformInfo.type = eType;
				pShaderUniformInfo.length = 0;
				
				pInputUniformInfo = createInputUniformInfo(sSampler, iNameIndex, pShaderUniformInfo, false);
				pInputUniformInfo.isCollapsedArray = (pSampler.getType().getLength() > 0);

				this._pInputSamplerInfoList.push(pInputUniformInfo);
			}


			/* Initialize info about array of samplers */
			var pSamplerArrayKeys: uint[] = pPassInput.samplerArrayKeys;
			this._pInputSamplerArrayInfoList = [];

			for(var i: uint = 0; i < pSamplerArrayKeys.length; i++) {
				var iNameIndex: uint = pSamplerArrayKeys[i];
				var sName: string = pPassInput._getUniformVarNameByIndex(iNameIndex);
				var eType: EAFXShaderVariableType =  pPassInput._getUniformType(iNameIndex);
				var iLength: uint = pPassInput._getUniformLength(iNameIndex);
				var sShaderName: string = sName + "[0]";
				var pInputUniformInfo: IInputUniformInfo = null;

				if(!this.isUniformExists(sShaderName)){
					continue;
				}

				var pShaderUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoMap[sShaderName];

				pShaderUniformInfo.type = eType;
				pShaderUniformInfo.length = iLength;

				pInputUniformInfo = createInputUniformInfo(sName, iNameIndex, pShaderUniformInfo, false);

				this._pInputSamplerArrayInfoList.push(pInputUniformInfo);
			}

			var pAttrInfoList: fx.IVariableBlendInfo[] = pAttrs.attrsInfo;

			var nPreparedAttrs: int = -1;
			var nPreparedBuffers: int = -1;

			for(var i: uint = 0; i < pAttrInfoList.length; i++){
				var iSemanticIndex: uint = i;
				var pAttrInfo: fx.IVariableBlendInfo = pAttrInfoList[iSemanticIndex];
				var sSemantic: string = pAttrInfo.name;
				var iSlot: uint = pAttrs.getSlotBySemanticIndex(iSemanticIndex);

				if(iSlot === -1) {
					continue;
				}

				var iBufferSlot: uint = pAttrs.getBufferSlotBySemanticIndex(iSemanticIndex);			

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
					var isComplex: bool = pAttrs.getTypeBySemanticIndex(iSemanticIndex).isComplex();

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
					pShaderAttrInfo.isComplex = isComplex;
					pShaderAttrInfo.vertexTextureInfo = pVertexTextureInfo;
					
					nPreparedAttrs++;
				}

				//add offset uniforms
				var pOffsetVars: IAFXVariableDeclInstruction[] = pAttrs.getOffsetVarsBySemantic(sSemantic);

				if(!isNull(pOffsetVars)) {
					var pShaderAttrInfo: IShaderAttrInfo = this._pShaderAttrInfoList[iSlot];
					var pOffsetInfoList: IShaderAttrOffsetInfo[] = pShaderAttrInfo.offsets || new Array();

					for(var j: uint = 0; j < pOffsetVars.length; j++){
						var sOffsetSemantic: string = pOffsetVars[j].getSemantic();
						var sOffsetName: string = pOffsetVars[j].getRealName();

						if(this.isUniformExists(sOffsetName)){
							var pOffsetUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoMap[sOffsetName];
							var fDefaultValue: float = pAttrs.getOffsetDefault(sOffsetName);

							pOffsetUniformInfo.type = EAFXShaderVariableType.k_Float;
							pOffsetUniformInfo.length = 0;

							pOffsetInfoList.push(createShaderAttrOffsetInfo(sOffsetSemantic, pOffsetUniformInfo, fDefaultValue));
						}
					}

					pShaderAttrInfo.offsets = pOffsetInfoList;
				}

			}

			/* Prepare funtions to set uniform value in real shader progrham */
			for(var i: uint = 0; i < this._pShaderUniformInfoList.length; i++){
				this.prepareApplyFunctionForUniform(this._pShaderUniformInfoList[i]);
			}

			return true;
		}

#ifdef PROFILE_MAKE
		private _pMakeTime: float[] = [0., 0., 0., 0., 0.];
		private _iCount: uint = 0;
#endif

		_make(pPassInput: IAFXPassInputBlend, pBufferMap: util.BufferMap): IShaderInput {

#ifdef PROFILE_MAKE
			var tStartTime: float = (<any>window).performance.now();
			var tEndTime: float = 0.;
#endif
			var pUniforms: any = pPassInput.uniforms;
			var pTextures: any = pPassInput.textures
			var pSamplers: IAFXSamplerStateMap = pPassInput.samplers;
			var pPassInputRenderStates: IRenderStateMap = pPassInput.renderStates;
			var pSamplerArrays: IAFXSamplerStateListMap = pPassInput.samplerArrays;

			var pInput: IShaderInput = this._getShaderInput();

			for(var i: uint = 0; i < this._pInputUniformInfoList.length; i++){
				var pInfo: IInputUniformInfo = this._pInputUniformInfoList[i];
				
				if(pInfo.isComplex) {
					this.applyStructUniform(pInfo.structVarInfo, pUniforms[pInfo.nameIndex], pInput);
				}
				else {
					pInput.uniforms[pInfo.shaderVarInfo.location] = pUniforms[pInfo.nameIndex];
				}				
			}

#ifdef PROFILE_MAKE
			tEndTime = (<any>window).performance.now();
			this._pMakeTime[0] += tEndTime - tStartTime;
			tStartTime = tEndTime;
#endif

			for(var i: uint = 0; i < this._pInputSamplerInfoList.length; i++){
				var pInfo: IInputUniformInfo = this._pInputSamplerInfoList[i];

				var pState: IAFXSamplerState = null;
				var pTexture: ITexture = null;

				if(pInfo.isCollapsedArray){
					pState = pSamplerArrays[pInfo.nameIndex][0];
				}
				else {
					pState = pPassInput._getSamplerState(pInfo.nameIndex);					
				}

				pTexture = pPassInput._getTextureForSamplerState(pState);

				this.setSamplerState(pInput.uniforms[pInfo.shaderVarInfo.location], pTexture, pState);
			}

#ifdef PROFILE_MAKE
			tEndTime = (<any>window).performance.now();
			this._pMakeTime[1] += tEndTime - tStartTime;
			tStartTime = tEndTime;
#endif

			for(var i: uint = 0; i < this._pInputSamplerArrayInfoList.length; i++){
				var pInfo: IInputUniformInfo = this._pInputSamplerArrayInfoList[i];

				var pSamplerStates: IAFXSamplerState[] = pSamplerArrays[pInfo.nameIndex];
				var pInputStates: IAFXSamplerState[] = pInput.uniforms[pInfo.shaderVarInfo.location];

				for(var j: uint = 0; j < pInfo.shaderVarInfo.length; j++) {
					var pTexture: ITexture = pPassInput._getTextureForSamplerState(pSamplerStates[j]);
					this.setSamplerState(pInputStates[j], pTexture, pSamplerStates[j]);
				}
			} 

#ifdef PROFILE_MAKE
			tEndTime = (<any>window).performance.now();
			this._pMakeTime[2] += tEndTime - tStartTime;
			tStartTime = tEndTime;
#endif

			for(var i: uint = 0; i < this._pShaderAttrInfoList.length; i++) {
				var pAttrInfo: IShaderAttrInfo = this._pShaderAttrInfoList[i];
				var pFlow: IDataFlow = pAttrInfo.isComplex ? 
										pBufferMap.findFlow(pAttrInfo.semantic) || pBufferMap.getFlowBySemantic(pAttrInfo.semantic): 
										pBufferMap.getFlowBySemantic(pAttrInfo.semantic);
										// pBufferMap.findFlow(pAttrInfo.semantic) || pBufferMap.getFlow(pAttrInfo.semantic, true): 
										// pBufferMap.getFlow(pAttrInfo.semantic, true);

				pInput.attrs[pAttrInfo.location] = pFlow;

				if(pAttrInfo.isMappable){
					pInput.uniforms[pAttrInfo.vertexTextureInfo.location] = pFlow.data.buffer;
					
					if(!isNull(pAttrInfo.offsets)){
						var pVertexDecl: IVertexDeclaration = pFlow.data.getVertexDeclaration();

						for(var j: uint = 0; j < pAttrInfo.offsets.length; j++){
							var pOffsetInfo: IShaderAttrOffsetInfo = pAttrInfo.offsets[j];
							var pElement: IVertexElement = pVertexDecl.findElement(pOffsetInfo.semantic);

							if(isNull(pElement)) {
								pInput.uniforms[pOffsetInfo.shaderVarInfo.location] = pOffsetInfo.defaultValue;
							}
							else {
								pInput.uniforms[pOffsetInfo.shaderVarInfo.location] = pElement.offset / 4.; /* offset in float */
							}
						}
					}
				}

			}

#ifdef PROFILE_MAKE
			tEndTime = (<any>window).performance.now();
			this._pMakeTime[3] += tEndTime - tStartTime;
			tStartTime = tEndTime;
#endif

			if(this._isUsedZero2D){
				pInput.uniforms[this._pShaderUniformInfoMap["as0"].location] = 19;
			}

			if(this._isUsedZeroCube){
				pInput.uniforms[this._pShaderUniformInfoMap["asc0"].location] = 19;
			}

			render.mergeRenderStateMap(pPassInputRenderStates, this._pPassBlend._getRenderStates(), pInput.renderStates);

#ifdef PROFILE_MAKE
	    	tEndTime = (<any>window).performance.now();
			this._pMakeTime[4] += tEndTime - tStartTime;
			tStartTime = tEndTime;

	        if(this._iCount %(100 * 300) === 0){
	        	LOG("----------------")
	        	LOG("uniforms: ", this._pMakeTime[0])
	        	LOG("samplers: ", this._pMakeTime[1])
	        	LOG("sampler arrays: ", this._pMakeTime[2])
	        	LOG("attrs: ", this._pMakeTime[3])
	        	LOG("states: ", this._pMakeTime[4])
	        	LOG("----------------")
				this._pMakeTime[0] = 0.;
				this._pMakeTime[1] = 0.;
				this._pMakeTime[2] = 0.;
				this._pMakeTime[3] = 0.;
				this._pMakeTime[4] = 0.;
	        	this._iCount = 0;
	        }

	        this._iCount++;
#endif
			return pInput;
		}

		private prepareApplyFunctionForUniform(pUniform: IShaderUniformInfo): void {
			if(pUniform.type !== EAFXShaderVariableType.k_NotVar) {
				pUniform.applyFunction = this.getUniformApplyFunction(pUniform.type, (pUniform.length > 0));
				pUniform.defaultValue = this.getUnifromDefaultValue(pUniform.type, (pUniform.length > 0));
			}
		}

		private getUniformApplyFunction(eType: EAFXShaderVariableType, isArray: bool): Function {
#ifdef WEBGL
			if(isArray){
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	return this._pShaderProgram._setFloat32Array;
			        case EAFXShaderVariableType.k_Int:
			        	return this._pShaderProgram._setInt32Array;
			        case EAFXShaderVariableType.k_Bool:
			        	return this._pShaderProgram._setInt32Array;

			        case EAFXShaderVariableType.k_Float2:
			        	return this._pShaderProgram._setVec2Array;
			        case EAFXShaderVariableType.k_Int2:
			        	return this._pShaderProgram._setVec2iArray;
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	return this._pShaderProgram._setBool2Array;

			        case EAFXShaderVariableType.k_Float3:
			        	return this._pShaderProgram._setVec3Array;
			        case EAFXShaderVariableType.k_Int3:
			        	return this._pShaderProgram._setVec3iArray;
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	return this._pShaderProgram._setBool3Array;

			        case EAFXShaderVariableType.k_Float4:
			        	return this._pShaderProgram._setVec4Array;
			        case EAFXShaderVariableType.k_Int4:
			        	return this._pShaderProgram._setVec4iArray;
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	return this._pShaderProgram._setBool4Array;

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	return this._pShaderProgram._setMat2Array;
			        case EAFXShaderVariableType.k_Float3x3:
			        	return this._pShaderProgram._setMat3Array;
			        case EAFXShaderVariableType.k_Float4x4:
			        	return this._pShaderProgram._setMat4Array;

			        case EAFXShaderVariableType.k_Sampler2D:
			        	return this._pShaderProgram._setSamplerArray;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	return this._pShaderProgram._setSamplerArray;
			        default:
			        	CRITICAL("Wrong uniform array type (" + eType + ")");
		        }
			}
			else {
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	return this._pShaderProgram._setFloat;
			        case EAFXShaderVariableType.k_Int:
			        	return this._pShaderProgram._setInt;
			        case EAFXShaderVariableType.k_Bool:
			        	return this._pShaderProgram._setInt;

			        case EAFXShaderVariableType.k_Float2:
			        	return this._pShaderProgram._setVec2;
			        case EAFXShaderVariableType.k_Int2:
			        	return this._pShaderProgram._setVec2i;
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	return this._pShaderProgram._setBool2

			        case EAFXShaderVariableType.k_Float3:
			        	return this._pShaderProgram._setVec3;
			        case EAFXShaderVariableType.k_Int3:
			        	return this._pShaderProgram._setVec3i;
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	return this._pShaderProgram._setBool3

			        case EAFXShaderVariableType.k_Float4:
			        	return this._pShaderProgram._setVec4;
			        case EAFXShaderVariableType.k_Int4:
			        	return this._pShaderProgram._setVec4i;
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	return this._pShaderProgram._setBool4

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	return this._pShaderProgram._setMat2
			        case EAFXShaderVariableType.k_Float3x3:
			        	return this._pShaderProgram._setMat3;
			        case EAFXShaderVariableType.k_Float4x4:
			        	return this._pShaderProgram._setMat4;

			        case EAFXShaderVariableType.k_Sampler2D:
			        	return this._pShaderProgram._setSampler;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	return this._pShaderProgram._setSampler;
			        case EAFXShaderVariableType.k_SamplerVertexTexture:
			        	return this._pShaderProgram._setVertexBuffer;
			        default:
			        	CRITICAL("Wrong uniform type (" + eType + ")");
		        }
			}

#else 
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
			        	CRITICAL("Wrong uniform array type (" + eType + ")");
		        }
			}
			else {
				switch (eType) {
			        case EAFXShaderVariableType.k_Float:
			        	return this._pShaderProgram.setFloat;
			        case EAFXShaderVariableType.k_Int:
			        	return this._pShaderProgram.setInt;
			        case EAFXShaderVariableType.k_Bool:
			        	return this._pShaderProgram.setInt;

			        case EAFXShaderVariableType.k_Float2:
			        	return this._pShaderProgram.setVec2;
			        case EAFXShaderVariableType.k_Int2:
			        	return this._pShaderProgram.setVec2i;
			        // case EAFXShaderVariableType.k_Bool2:
			        // 	return this._pShaderProgram.setBool2

			        case EAFXShaderVariableType.k_Float3:
			        	return this._pShaderProgram.setVec3;
			        case EAFXShaderVariableType.k_Int3:
			        	return this._pShaderProgram.setVec3i;
			        // case EAFXShaderVariableType.k_Bool3:
			        // 	return this._pShaderProgram.setBool3

			        case EAFXShaderVariableType.k_Float4:
			        	return this._pShaderProgram.setVec4;
			        case EAFXShaderVariableType.k_Int4:
			        	return this._pShaderProgram.setVec4i;
			        // case EAFXShaderVariableType.k_Bool4:
			        // 	return this._pShaderProgram.setBool4

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	return this._pShaderProgram.setMat2
			        case EAFXShaderVariableType.k_Float3x3:
			        	return this._pShaderProgram.setMat3;
			        case EAFXShaderVariableType.k_Float4x4:
			        	return this._pShaderProgram.setMat4;

			        case EAFXShaderVariableType.k_Sampler2D:
			        	return this._pShaderProgram.setSampler;
			        case EAFXShaderVariableType.k_SamplerCUBE:
			        	return this._pShaderProgram.setSampler;
			        case EAFXShaderVariableType.k_SamplerVertexTexture:
			        	return this._pShaderProgram.setVertexBuffer;
			        default:
			        	CRITICAL("Wrong uniform type (" + eType + ")");
		        }
			}
#endif			
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

			        // case EAFXShaderVariableType.k_Float2x2:
			        // 	return new Mat2(0);
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
			        	CRITICAL("Wrong uniform type (" + eType + ")");
		        }
			}
		}

		private setSamplerState(pOut: IAFXSamplerState, pTexture: ITexture, pFrom: IAFXSamplerState): void {
			pOut.texture = pTexture;
			pOut.wrap_s = pFrom.wrap_s;
			pOut.wrap_t = pFrom.wrap_t;
			pOut.mag_filter = pFrom.mag_filter;
			pOut.min_filter = pFrom.min_filter;
		}

		private expandStructUniforms(pVariable: IAFXVariableDeclInstruction, sPrevName?: string = ""): IUniformStructInfo {
			var sRealName: string = pVariable.getRealName();

			if(sPrevName !== ""){
				sPrevName += "." + sRealName;
			}
			else {
				if(!this._pPassBlend._hasUniformWithName(sRealName)){
					return null;
				}
				
				sPrevName = sRealName;
			}

			var pVarType: IAFXVariableTypeInstruction = pVariable.getType();
			var pFieldNameList: string[] = pVarType.getFieldNameList();
			var isArray: bool = pVarType.isNotBaseArray();
			var iLength: uint = isArray ? pVarType.getLength() : 1;

			if(isArray && (iLength === UNDEFINE_LENGTH || iLength === 0)){
				WARNING("Length of struct '" + sRealName + "' can not be undefined");
				return null;
			}

			var pStructInfo: IUniformStructInfo = createUniformStructFieldInfo(sRealName, true, isArray);
			pStructInfo.fields = new Array();

			var sFieldPrevName: string = "";
			var pFieldInfoList: IUniformStructInfo[] = null;

			for(var i: uint = 0; i < iLength; i++){
				if(isArray){
					pFieldInfoList =  new Array();
					sFieldPrevName = sPrevName + "[" + i + "]";
				}
				else {
					pFieldInfoList = pStructInfo.fields;
					sFieldPrevName = sPrevName;
				}

				for(var j: uint = 0; j < pFieldNameList.length; j++){
					var sFieldName: string = pFieldNameList[j];
					var pField: IAFXVariableDeclInstruction = pVarType.getField(sFieldName);
					var pFieldInfo: IUniformStructInfo = null;

					if(pField.getType().isComplex()){
						pFieldInfo = this.expandStructUniforms(pField, sFieldPrevName);
					}
					else {
						var sFieldRealName: string = sFieldPrevName + "." + pField.getRealName();
						var eFieldType: EAFXShaderVariableType = VariableContainer.getVariableType(pField);
						var iFieldLength: uint = pField.getType().getLength();
						var isFieldArray: bool = pField.getType().isNotBaseArray();
						var sFieldShaderName: string = sFieldRealName;

						if(isFieldArray){
							sFieldShaderName += "[0]";
						}

						if(!this.isUniformExists(sFieldShaderName)){
							continue;
						}

						var pShaderUniformInfo: IShaderUniformInfo = this._pShaderUniformInfoMap[sFieldShaderName];
						pShaderUniformInfo.type = eFieldType;
						pShaderUniformInfo.length = iFieldLength;

						pFieldInfo = createUniformStructFieldInfo(pField.getRealName(), false, isFieldArray);
						pFieldInfo.shaderVarInfo = pShaderUniformInfo;
					}

					if(!isNull(pFieldInfo)){
						pFieldInfoList.push(pFieldInfo);
					}
				}

				if(isArray && pFieldInfoList.length > 0){
					var pArrayElementInfo: IUniformStructInfo = createUniformStructFieldInfo(sRealName, true, false);
					pArrayElementInfo.index = i;
					pArrayElementInfo.fields = pFieldInfoList;

					pStructInfo.fields.push(pArrayElementInfo);
				}
			}

			if(pStructInfo.fields.length > 0){
				return pStructInfo;
			}
			else {
				return null;
			}
		}

		private applyStructUniform(pStructInfo: IUniformStructInfo, pValue: any, pInput: IShaderInput): void {
			if(!isDefAndNotNull(pValue)){
				return;
			}

			if(pStructInfo.isArray){
				for(var i: uint = 0; i < pStructInfo.fields.length; i++){
					var pFieldInfo: IUniformStructInfo = pStructInfo.fields[i];
					if(isDef(pValue[pFieldInfo.index])){
						this.applyStructUniform(pFieldInfo, pValue[pFieldInfo.index], pInput);
					}
				}
			}
			else {
				for(var i: uint = 0; i < pStructInfo.fields.length; i++){
					var pFieldInfo: IUniformStructInfo = pStructInfo.fields[i];
					var pFieldValue: any = pValue[pFieldInfo.name];

					if(isDef(pFieldValue)){
						if(pFieldInfo.isComplex){
							this.applyStructUniform(pFieldInfo, pFieldValue, pInput);
						}
						else {
							pInput.uniforms[pFieldInfo.shaderVarInfo.location] = pFieldValue;
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