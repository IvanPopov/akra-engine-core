#ifndef ICAMERA_TS
#define ICAMERA_TS

#include "ISceneObject.ts"

module akra {
	IFACE(IViewport);
	IFACE(IVec3);
	IFACE(IMat4);
	IFACE(IRect3d);
	IFACE(IFrustum);

	export enum ECameraParameters {

	}

    export interface ICamera extends ISceneObject {
    	viewMatrix: IMat4;
    	projectionMatrix: IMat4;
    	projViewMatrix: IMat4;
    	internalProjectionMatrix: IMat4;
    	internalViewProjMatrix: IMat4;
    	targetPos: IVec3;
    	fov: float;
    	aspect: float;
    	nearPlane: float;
    	farPlane: float;
    	
    	readonly viewDistance: float;
    	readonly searchRect: IRect3d;
    	readonly frustum: IFrustum;



    	setParameter(eParam: ECameraParameters, bValue: bool): void;
    	isConstantAspect(): bool;
    	
    	setProjParams(fFOV: float, fAspect: float, fNearPlane: float, fFarPlane: float): void;
    	setOrthoParams(fWidth: float, fHeight: float, fNearPlane: float, fFarPlane: float): void;
    	setOffsetOrthoParams(fMinX: float, fMaxX: float, fMinY: float, fMaxY: float, fNearPlane: float, fFarPlane: float): void;

    	recalcMatrices(): void;

    	update(): void;

    	applyRenderStageBias(iStage: int): void;

    	lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3);
    	lookAt(v3fCenter: IVec3, v3fUp?: IVec3);

    	_renderScene(pViewport: IViewport): void;
    	_keepLastViewport(pViewport: IViewport): void;
    	_getLastViewport(): IViewport;
    	_getNumRenderedFaces(): int;
    }
}

#endif