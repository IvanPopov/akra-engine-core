
/// <reference path="ISceneObject.ts" />


/// <reference path="IViewport.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="IFrustum.ts" />
/// <reference path="IObjectArray.ts" />

module akra {
	export enum ECameraParameters {
		CONST_ASPECT = 1
	}
	
	export enum ECameraTypes {
		PERSPECTIVE,
		ORTHO,
		OFFSET_ORTHO
	}
	
	
	
	export interface ICamera extends ISceneNode {
		getViewMatrix(): IMat4;
		getProjectionMatrix(): IMat4;
		getProjViewMatrix(): IMat4;
		getTargetPos(): IVec3;

		getViewDistance(): float;
		getSearchRect(): IRect3d;
		getFrustum(): IFrustum;
		
		getFOV(): float;
		setFOV(fValue: float): void;

		getAspect(): float;
		setAspect(fValue: float): void;

		getNearPlane(): float;
		setNearPlane(fValue: float): void;

		getFarPlane(): float;
		setFarPlane(fValue: float): void;		
	
		// /** readonly */ internalProjectionMatrix: IMat4;
		// /** readonly */ internalViewProjMatrix: IMat4;

		setParameter(eParam: ECameraParameters, pValue: any): void;
		isConstantAspect(): boolean;
		
		setProjParams(fFOV: float, fAspect: float, fNearPlane: float, fFarPlane: float): void;
		setOrthoParams(fWidth: float, fHeight: float, fNearPlane: float, fFarPlane: float): void;
		setOffsetOrthoParams(fMinX: float, fMaxX: float, fMinY: float, fMaxY: float, fNearPlane: float, fFarPlane: float): void;
	
		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
	
		//moved to private.
		// recalcMatrices(): void;
	
		// applyRenderStageBias(iStage: int): void;
		
		//изменились ли параметры процекции
		isProjParamsNew(): boolean; 
		recalcProjMatrix(): void;
	
		isActive(): boolean;
	
		//display via display list with name <csList>
		display(iList?: int): IObjectArray<ISceneObject>;
	
		_renderScene(pViewport: IViewport): void;
		_keepLastViewport(pViewport: IViewport): void;
		_getLastViewport(): IViewport;
		_getNumRenderedFaces(): uint;
		_notifyRenderedFaces(nFaces: uint): void;
		_getLastResults(iList?: int): IObjectArray<ISceneObject>;
	
		getDepthRange(): IDepthRange;
	}
	
}
