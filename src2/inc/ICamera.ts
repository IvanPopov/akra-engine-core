#ifndef ICAMERA_TS
#define ICAMERA_TS

#include "ISceneObject.ts"

module akra {
	IFACE(IViewport);
	IFACE(IVec3);
	IFACE(IMat4);
	IFACE(IRect3d);
	IFACE(IFrustum);
    IFACE(ISceneBuilder);
    IFACE(IObjectArray);
    IFACE(IDepthRange);

	export enum ECameraParameters {
        CONST_ASPECT = 1
	}

    export enum ECameraTypes {
        PERSPECTIVE,
        ORTHO,
        OFFSET_ORTHO
    }



    export interface ICamera extends ISceneNode {
    	readonly viewMatrix: IMat4;
    	readonly projectionMatrix: IMat4;
    	readonly projViewMatrix: IMat4;
    	// readonly internalProjectionMatrix: IMat4;
    	// readonly internalViewProjMatrix: IMat4;
    	readonly targetPos: IVec3;
    	
        fov: float;
    	aspect: float;
    	nearPlane: float;
    	farPlane: float;
    	
    	readonly viewDistance: float;
    	readonly searchRect: IRect3d;
    	readonly frustum: IFrustum;

    	setParameter(eParam: ECameraParameters, pValue: any): void;
    	isConstantAspect(): bool;
    	
    	setProjParams(fFOV: float, fAspect: float, fNearPlane: float, fFarPlane: float): void;
    	setOrthoParams(fWidth: float, fHeight: float, fNearPlane: float, fFarPlane: float): void;
    	setOffsetOrthoParams(fMinX: float, fMaxX: float, fMinY: float, fMaxY: float, fNearPlane: float, fFarPlane: float): void;

        projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;

        //moved to private.
    	// recalcMatrices(): void;

    	// applyRenderStageBias(iStage: int): void;
        
        //изменились ли параметры процекции
        isProjParamsNew(): bool; 
        recalcProjMatrix(): void;

    	lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3);
    	lookAt(v3fCenter: IVec3, v3fUp?: IVec3);

        isActive(): bool;

        //display via display list with name <csList>
        display(iList?: int): IObjectArray;

    	_renderScene(pViewport: IViewport): void;
    	_keepLastViewport(pViewport: IViewport): void;
    	_getLastViewport(): IViewport;
    	_getNumRenderedFaces(): uint;
        _notifyRenderedFaces(nFaces: uint): void;
        _getLastResults(iList?: int): IObjectArray;

        getDepthRange(): IDepthRange;
    }
}

#endif