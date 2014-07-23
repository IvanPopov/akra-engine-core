
/// <reference path="IAFXComponent.ts" />
/// <reference path="IAFXComponentBlend.ts" />
/// <reference path="IAFXPassBlend.ts" />
/// <reference path="IAFXInstruction.ts" />


module akra {
	export interface IAFXBlender {
	
		//Component and component blend
		addComponentToBlend(pComponentBlend: IAFXComponentBlend, 
							pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend;
	
		removeComponentFromBlend(pComponentBlend: IAFXComponentBlend, 
								 pComponent: IAFXComponent, iShift: int, iPass: uint): IAFXComponentBlend;
	
		addBlendToBlend(pComponentBlend: IAFXComponentBlend, 
						pAddBlend: IAFXComponentBlend, iShift: int): IAFXComponentBlend;
	
		//Pass blend
		
		generatePassBlend(pPassList: IAFXPassInstruction[],
						  pStates: any, pForeigns: any, pUniforms: any): IAFXPassBlend;
	
		getPassBlendById(id: uint): IAFXPassBlend;
	}
	
	
}
