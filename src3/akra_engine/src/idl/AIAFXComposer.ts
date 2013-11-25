// AIAFXComposer interface
// [write description here...]

//remove in release version
/// <reference path="AIParser.ts" />

// #define ALL_PASSES 0xffffff
// #define ANY_PASS 0xfffffa
// #define ANY_SHIFT 0xfffffb
// #define DEFAULT_SHIFT 0xfffffc

/// <reference path="AIEngine.ts" />
/// <reference path="AIAFXComponent.ts" />
/// <reference path="AIEffect.ts" />
/// <reference path="AIAFXComponentBlend.ts" />
/// <reference path="AIAFXPassInputBlend.ts" />
/// <reference path="AIBufferMap.ts" />
/// <reference path="AISurfaceMaterial.ts" />
/// <reference path="AIRID.ts" />

interface AIAFXComposer {
	getComponentByName(sComponentName: string): AIAFXComponent;
	getEngine(): AIEngine;

	//API for Effect-resource
	
	getComponentCountForEffect(pEffectResource: AIEffect): uint;
	getTotalPassesForEffect(pEffectResource: AIEffect): uint;
	addComponentToEffect(pEffectResource: AIEffect, 
						 pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean;
	removeComponentFromEffect(pEffectResource: AIEffect, 
							  pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean;
	hasComponentForEffect(pEffectResource:AIEffect, 
						  pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean;

	activateEffectResource(pEffectResource: AIEffect, iShift: int): boolean;
	deactivateEffectResource(pEffectResource: AIEffect): boolean; 

	getPassInputBlendForEffect(pEffectResource: AIEffect, iPass: uint): AIAFXPassInputBlend;
	//API for RenderTechnique
	getMinShiftForOwnTechniqueBlend(pRenderTechnique: AIRenderTechnique): int;

	getTotalPassesForTechnique(pRenderTechnique: AIRenderTechnique): uint;
	
	addOwnComponentToTechnique(pRenderTechnique: AIRenderTechnique, 
							   pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean;
	removeOwnComponentToTechnique(pRenderTechnique: AIRenderTechnique, 
								  pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean;
	hasOwnComponentInTechnique(pRenderTechnique: AIRenderTechnique, 
							   pComponent: AIAFXComponent, iShift: int, iPass: uint): boolean;

	prepareTechniqueBlend(pRenderTechnique: AIRenderTechnique): boolean;

	markTechniqueAsNeedUpdate(pRenderTechnique: AIRenderTechnique): void;

	getPassInputBlendForTechnique(pRenderTechnique: AIRenderTechnique, iPass: uint): AIAFXPassInputBlend;

	//API for render
	
	applyBufferMap(pBufferMap: AIBufferMap): boolean;
	applySurfaceMaterial(pSurfaceMaterial: AISurfaceMaterial): boolean;

	_calcRenderID(pSceneObject: AISceneObject, pRenderable: AIRenderableObject, bCreateIfNotExists?: boolean): int;

	_getRenderableByRid(iRid: int): AIRenderableObject;
	_getObjectByRid(iRid: int): AISceneObject;

	_setCurrentSceneObject(pSceneObject: AISceneObject): void;
	_setCurrentViewport(pViewport: AIViewport): void;
	_setCurrentRenderableObject(pRenderable: AIRenderableObject): void;

	_getCurrentSceneObject(): AISceneObject;
	_getCurrentViewport(): AIViewport;
	_getCurrentRenderableObject(): AIRenderableObject;

	_setDefaultCurrentState(): void;

	renderTechniquePass(pRenderTechnique: AIRenderTechnique, iPass: uint): void;

	//API for load components/AFXEffects
	
	/** @deprected will be removed from release version, use _loadEffectFromBinary instead.*/
	_loadEffectFromSyntaxTree(pTree: AIParseTree, sFileName: string): boolean;
	_loadEffectFromBinary(pData: Uint8Array, sFileName: string): boolean;
}

