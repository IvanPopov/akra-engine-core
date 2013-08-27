#ifndef IAFXCOMPONENTBLEND_TS
#define IAFXCOMPONENTBLEND_TS

#include "IAFXComponent.ts"
#include "IAFXInstruction.ts"
#include "IUnique.ts"
#include "IAFXPassInputBlend.ts"
#include "IAFXVariableContainer.ts"

#define EMPTY_BLEND "EMPTY_BLEND"

module akra {


	export interface IAFXComponentBlendMap {
		[index: uint]: IAFXComponentBlend;
		[index: string]: IAFXComponentBlend; 
	}
	
	export interface IAFXComponentInfo {
		component: IAFXComponent;
		shift: int;
		pass: uint;
		hash: string;
	}


	export interface IAFXComponentPassInputBlend {
		uniforms: IAFXVariableContainer;
		textures: IAFXVariableContainer;
		foreigns: IAFXVariableContainer;

		addDataFromPass(pPass: IAFXPassInstruction): void;
		finalizeInput(): void;

		getPassInput(): IAFXPassInputBlend;
		releasePassInput(pPassInput: IAFXPassInputBlend): void;
	}

	export interface IAFXComponentBlend extends IUnique {
		isReadyToUse(): bool;
		isEmpty(): bool;

		getComponentCount(): uint;
		getTotalPasses(): uint;
		getHash(): string;

		hasPostEffect(): bool;
		getPostEffectStartPass(): uint;

		containComponent(pComponent: IAFXComponent, iShift: int, iPass: uint);
		containComponentHash(sComponentHash: string): bool;

		findAddedComponentInfo(pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentInfo;

		addComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;
		removeComponent(pComponent: IAFXComponent, iShift: int, iPass: int): void;

		finalizeBlend(): bool;

		getPassInputForPass(iPass: uint): IAFXPassInputBlend;
		getPassListAtPass(iPass: uint): IAFXPassInstruction[];

		clone(): IAFXComponentBlend;

		_getComponentInfoList(): IAFXComponentInfo[];

		_setDataForClone(pAddedComponentInfoList: IAFXComponentInfo[],
						 pComponentHashMap: BoolMap,
						 nShiftMin: int, nShiftMax: int): void;
	}
}

#endif