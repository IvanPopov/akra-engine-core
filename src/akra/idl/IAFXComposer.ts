
//remove in release version
/// <reference path="parser/IParser.ts" />

// #define ALL_PASSES 0xffffff
// #define ANY_PASS 0xfffffa
// #define ANY_SHIFT 0xfffffb
// #define DEFAULT_SHIFT 0xfffffc

/// <reference path="IEngine.ts" />
/// <reference path="IAFXComponent.ts" />
/// <reference path="IEffect.ts" />
/// <reference path="IAFXComponentBlend.ts" />
/// <reference path="IAFXPassInputBlend.ts" />
/// <reference path="IBufferMap.ts" />
/// <reference path="ISurfaceMaterial.ts" />
/// <reference path="IRID.ts" />

module akra {
	export interface IAFXComposer {
		getComponentByName(sComponentName: string): IAFXComponent;
		getEngine(): IEngine;
	
		//API for Effect-resource
		
		getComponentCountForEffect(pEffectResource: IEffect): uint;
		getTotalPassesForEffect(pEffectResource: IEffect): uint;
		addComponentToEffect(pEffectResource: IEffect, 
							 pComponent: IAFXComponent, iShift: int, iPass: uint): boolean;
		removeComponentFromEffect(pEffectResource: IEffect, 
								  pComponent: IAFXComponent, iShift: int, iPass: uint): boolean;
		hasComponentForEffect(pEffectResource:IEffect, 
							  pComponent: IAFXComponent, iShift: int, iPass: uint): boolean;
	
		activateEffectResource(pEffectResource: IEffect, iShift: int): boolean;
		deactivateEffectResource(pEffectResource: IEffect): boolean; 
	
		getPassInputBlendForEffect(pEffectResource: IEffect, iPass: uint): IAFXPassInputBlend;
		//API for RenderTechnique
		copyTechniqueOwnComponentBlend(pFrom: IRenderTechnique, pTo: IRenderTechnique) : void;

		getMinShiftForOwnTechniqueBlend(pRenderTechnique: IRenderTechnique): int;
	
		getTotalPassesForTechnique(pRenderTechnique: IRenderTechnique): uint;
		
		addOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, 
								   pComponent: IAFXComponent, iShift: int, iPass: uint): boolean;
		removeOwnComponentToTechnique(pRenderTechnique: IRenderTechnique, 
									  pComponent: IAFXComponent, iShift: int, iPass: uint): boolean;
		hasOwnComponentInTechnique(pRenderTechnique: IRenderTechnique, 
								   pComponent: IAFXComponent, iShift: int, iPass: uint): boolean;
	
		prepareTechniqueBlend(pRenderTechnique: IRenderTechnique): boolean;
	
		markTechniqueAsNeedUpdate(pRenderTechnique: IRenderTechnique): void;
	
		getPassInputBlendForTechnique(pRenderTechnique: IRenderTechnique, iPass: uint): IAFXPassInputBlend;
	
		//API for render
		
		applyBufferMap(pBufferMap: IBufferMap): boolean;
		applySurfaceMaterial(pSurfaceMaterial: ISurfaceMaterial): boolean;
	
		_calcRenderID(pSceneObject: ISceneObject, pRenderable: IRenderableObject, bCreateIfNotExists?: boolean): int;
	
		_getRenderableByRid(iRid: int): IRenderableObject;
		_getObjectByRid(iRid: int): ISceneObject;
	
		_setCurrentSceneObject(pSceneObject: ISceneObject): void;
		_setCurrentViewport(pViewport: IViewport): void;
		_setCurrentRenderableObject(pRenderable: IRenderableObject): void;
	
		_getCurrentSceneObject(): ISceneObject;
		_getCurrentViewport(): IViewport;
		_getCurrentRenderableObject(): IRenderableObject;
	
		_setDefaultCurrentState(): void;
	
		renderTechniquePass(pRenderTechnique: IRenderTechnique, iPass: uint): void;
	
		//API for load components/AFXEffects
		
		/** @deprected will be removed from release version, use _loadEffectFromBinary instead.*/
		_loadEffectFromSyntaxTree(pTree: parser.IParseTree, sFileName: string): boolean;
		_loadEffectFromBinary(pData: Uint8Array, sFileName: string): boolean;
	}
	
	
}
