
/// <reference path="IMat4.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="ISphere.ts" />
/// <reference path="IRect3d.ts" />
/// <reference path="IPlane3d.ts" />

module akra {
	interface IFrustum {
		leftPlane: IPlane3d;
		rightPlane: IPlane3d;
		topPlane: IPlane3d;
		bottomPlane: IPlane3d;
		nearPlane: IPlane3d;
		farPlane: IPlane3d;
	
		/** readonly */ frustumVertices: IVec3[];
	
		set(): IFrustum;
		set(pFrustum: IFrustum): IFrustum;
		set(pLeftPlane: IPlane3d, pRightPlane: IPlane3d,
			pTopPlane: IPlane3d, pBottomPlane: IPlane3d,
			pNearPlane: IPlane3d, pFarPlane: IPlane3d): IFrustum;
	
		calculateFrustumVertices(): IVec3[];
		extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum;
	
		isEqual(pFrustum: IFrustum): boolean;
	
		getPlanePoints(sPlaneKey: string, pDestination?: IVec3[]): IVec3[];
	
		testPoint(v3fPoint: IVec3): boolean;
		testRect(pRect: IRect3d): boolean;
		testSphere(pSphere: ISphere): boolean;
		testFrustum(pFrustum: IFrustum): boolean;
	
		getViewDirection(v3fDirection?: IVec3): IVec3;
	
		toString(): string;
	}
	
	
}
