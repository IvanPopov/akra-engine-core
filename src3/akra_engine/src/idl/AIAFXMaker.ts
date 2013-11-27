// AIAFXMaker interface
// [write description here...]

/// <reference path="AIShaderProgram.ts" />
/// <reference path="AIUnique.ts" />
/// <reference path="AIAFXSamplerBlender.ts" />
/// <reference path="AIAFXAttributeBlendContainer.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />
/// <reference path="AIShaderInput.ts" />
/// <reference path="AIAFXInstruction.ts" />

interface AIAFXMakerMap {
	[index: string]: AIAFXMaker;
	[index: uint]: AIAFXMaker;
}

interface AIAFXBaseAttrInfo {
	name: string;
	semantic: string;
}

interface AIAFXMaker extends AIUnique {
	/** readonly */ shaderProgram: AIShaderProgram;
	/** readonly */ uniformNames: string[];
	/** readonly */ attributeInfo: AIAFXBaseAttrInfo[];

	_create(sVertex: string, sPixel: string): boolean;
	
	isUniformExists(sName: string): boolean;
	isAttrExists(sName: string): boolean;

	isArray(sName: string): boolean;
	getType(sName: string): AEAFXShaderVariableType;
	getLength(sName: string): uint;
	setUniform(iLocation: uint, pValue: any): void;

	_make(pPassInput: AIAFXPassInputBlend, pBufferMap: AIBufferMap): AIShaderInput;
    _initInput(pPassInput: AIAFXPassInputBlend, pBlend: AIAFXSamplerBlender, 
        pAttrs: AIAFXAttributeBlendContainer): boolean;
	_createDataPool(): AIShaderInput;
	_getShaderInput(): AIShaderInput;
	_releaseShaderInput(pPool: AIShaderInput): void;

}
