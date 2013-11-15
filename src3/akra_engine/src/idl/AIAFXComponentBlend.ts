// AIAFXComponentBlend interface
// [write description here...]

/// <reference path="AIAFXComponent.ts" />
/// <reference path="AIAFXInstruction.ts" />
/// <reference path="AIUnique.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />
/// <reference path="AIAFXVariableContainer.ts" />
/// <reference path="AIMap.ts" />
/// <reference path="AIAFXInstruction.ts" />

//#define EMPTY_BLEND "EMPTY_BLEND"



interface AIAFXComponentBlendMap {
	[index: uint]: AIAFXComponentBlend;
	[index: string]: AIAFXComponentBlend; 
}

interface AIAFXComponentInfo {
	component: AIAFXComponent;
	shift: int;
	pass: uint;
	hash: string;
}


interface AIAFXComponentPassInputBlend {
	uniforms: AIAFXVariableContainer;
	textures: AIAFXVariableContainer;
	foreigns: AIAFXVariableContainer;

	addDataFromPass(pPass: AIAFXPassInstruction): void;
	finalizeInput(): void;

	getPassInput(): AIAFXPassInputBlend;
	releasePassInput(pPassInput: AIAFXPassInputBlend): void;
}

interface AIAFXComponentBlend extends AIUnique {
	isReadyToUse(): boolean;
	isEmpty(): boolean;

	getComponentCount(): uint;
	getTotalPasses(): uint;
	getHash(): string;

	_getMinShift(): int;
	_getMaxShift(): int;

	hasPostEffect(): boolean;
	getPostEffectStartPass(): uint;

	containComponent(pComponent: AIAFXComponent, iShift: int, iPass: uint);
	containComponentHash(sComponentHash: string): boolean;

	findAddedComponentInfo(pComponent: AIAFXComponent, iShift: int, iPass: uint): AIAFXComponentInfo;

	addComponent(pComponent: AIAFXComponent, iShift: int, iPass: int): void;
	removeComponent(pComponent: AIAFXComponent, iShift: int, iPass: int): void;

	finalizeBlend(): boolean;

	getPassInputForPass(iPass: uint): AIAFXPassInputBlend;
	getPassListAtPass(iPass: uint): AIAFXPassInstruction[];

	clone(): AIAFXComponentBlend;

	_getComponentInfoList(): AIAFXComponentInfo[];

	_setDataForClone(pAddedComponentInfoList: AIAFXComponentInfo[],
					 pComponentHashMap: AIBoolMap,
					 nShiftMin: int, nShiftMax: int): void;
}
