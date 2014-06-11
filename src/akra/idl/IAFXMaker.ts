
/// <reference path="IShaderProgram.ts" />
/// <reference path="IUnique.ts" />
/// <reference path="IAFXSamplerBlender.ts" />
/// <reference path="IAFXAttributeBlendContainer.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="IShaderInput.ts" />
/// <reference path="IAFXInstruction.ts" />

module akra {
	export interface IAFXBaseAttrInfo {
		name: string;
		semantic: string;
	}
	
	export interface IAFXMaker extends IUnique {
		getShaderProgram(): IShaderProgram;
		getUniformNames(): string[];
		getAttributeInfo(): IAFXBaseAttrInfo[];
	
		_create(sVertex: string, sPixel: string): boolean;
		
		isUniformExists(sName: string): boolean;
		isAttrExists(sName: string): boolean;
	
		isArray(sName: string): boolean;
		getType(sName: string): EAFXShaderVariableType;
		getLength(sName: string): uint;
		setUniform(iLocation: uint, pValue: any): void;

		_freeUniformCache(): void;
	
		_make(pPassInput: IAFXPassInputBlend, pBufferMap: IBufferMap): IShaderInput;
	    _initInput(pPassInput: IAFXPassInputBlend, pBlend: IAFXSamplerBlender, 
	        pAttrs: IAFXAttributeBlendContainer): boolean;
		_createDataPool(): IShaderInput;
		_getShaderInput(): IShaderInput;
		_releaseShaderInput(pPool: IShaderInput): void;
	}

	export interface IAFXMakerMap {
		[index: string]: IAFXMaker;
		[index: uint]: IAFXMaker;
	}
}
