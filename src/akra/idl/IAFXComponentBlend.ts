
/// <reference path="IAFXComponent.ts" />
/// <reference path="IAFXInstruction.ts" />
/// <reference path="IUnique.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="IAFXVariableContainer.ts" />
/// <reference path="IMap.ts" />
/// <reference path="IAFXInstruction.ts" />

//#define EMPTY_BLEND "EMPTY_BLEND"



module akra {
	
	export interface IAFXComponentInfo {
		component: IAFXComponent;
		shift: int;
		pass: uint;
		hash: string;
	}
	
	
	export interface IAFXComponentPassInputBlend {
		getUniforms(): IAFXVariableContainer;
		getTextures(): IAFXVariableContainer;
		getForeigns(): IAFXVariableContainer;
	
		addDataFromPass(pPass: IAFXPassInstruction): void;
		finalizeInput(): void;
	
		getPassInput(): IAFXPassInputBlend;
		releasePassInput(pPassInput: IAFXPassInputBlend): void;
	}
	
	export interface IAFXComponentBlend extends IUnique {
		isReadyToUse(): boolean;
		isEmpty(): boolean;
	
		getComponentCount(): uint;
		getTotalPasses(): uint;
		getHash(): string;
	
		_getMinShift(): int;
		_getMaxShift(): int;
	
		hasPostEffect(): boolean;
		getPassTypes(): EPassTypes[];
		//getPostEffectStartPass(): uint;
	
		containComponent(pComponent: IAFXComponent, iShift: int, iPass: uint);
		containComponentHash(sComponentHash: string): boolean;
	
		findAnyAddedComponentInfo(pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentInfo;
	
		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;
		removeComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;
	
		finalizeBlend(): boolean;
	
		getPassInputForPass(iPass: uint): IAFXPassInputBlend;
		getPassListAtPass(iPass: uint): IAFXPassInstruction[];
	
		clone(): IAFXComponentBlend;
	
		_getComponentInfoList(): IAFXComponentInfo[];
	
		_setDataForClone(pAddedComponentInfoList: IAFXComponentInfo[],
						 pComponentHashMap: IBoolMap,
						 nShiftMin: int, nShiftMax: int): void;
	}

	export interface IAFXComponentBlendMap {
		[index: uint]: IAFXComponentBlend;
		[index: string]: IAFXComponentBlend;
	}
	
}
