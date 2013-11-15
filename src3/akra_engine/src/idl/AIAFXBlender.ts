// AIAFXBlender interface
// [write description here...]

/// <reference path="AIAFXComponent.ts" />
/// <reference path="AIAFXComponentBlend.ts" />
/// <reference path="AIAFXPassBlend.ts" />
/// <reference path="AIAFXInstruction.ts" />


interface AIAFXBlender {

	//Component and component blend
	addComponentToBlend(pComponentBlend: AIAFXComponentBlend, 
						pComponent: AIAFXComponent, iShift: int, iPass: uint): AIAFXComponentBlend;

	removeComponentFromBlend(pComponentBlend: AIAFXComponentBlend, 
							 pComponent: AIAFXComponent, iShift: int, iPass: uint): AIAFXComponentBlend;

	addBlendToBlend(pComponentBlend: AIAFXComponentBlend, 
					pAddBlend: AIAFXComponentBlend, iShift: int): AIAFXComponentBlend;

	//Pass blend
	
	generatePassBlend(pPassList: IAFXPassInstruction[],
					  pStates: any, pForeigns: any, pUniforms: any): AIAFXPassBlend;

	getPassBlendById(id: uint): AIAFXPassBlend;
}

