
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
		/** readonly */ viewMatrix: IMat4;
		/** readonly */ projectionMatrix: IMat4;
		/** readonly */ projViewMatrix: IMat4;
		// /** readonly */ internalProjectionMatrix: IMat4;
		// /** readonly */ internalViewProjMatrix: IMat4;
		/** readonly */ targetPos: IVec3;
		
		fov: float;
		aspect: float;
		nearPlane: float;
		farPlane: float;
		
		/** readonly */ viewDistance: float;
		/** readonly */ searchRect: IRect3d;
		/** readonly */ frustum: IFrustum;
	
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
