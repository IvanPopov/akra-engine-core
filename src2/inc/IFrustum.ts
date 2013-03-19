#ifndef IFRUSTUM_TS
#define IFRUSTUM_TS

module akra{

	IFACE(IMat4);
	IFACE(IVec3);
	IFACE(IRect3);
	IFACE(ISphere);
	IFACE(IRect3d);

	export interface IFrustum{
		leftPlane: IPlane3d;
		rightPlane: IPlane3d;
		topPlane: IPlane3d;
		bottomPlane: IPlane3d;
		nearPlane: IPlane3d;
		farPlane: IPlane3d;

		readonly frustumVertices: IVec3[];

		set(): IFrustum;
		set(pFrustum: IFrustum): IFrustum;
		set(pLeftPlane: IPlane3d, pRightPlane: IPlane3d,
			pTopPlane: IPlane3d, pBottomPlane: IPlane3d,
			pNearPlane: IPlane3d, pFarPlane: IPlane3d): IFrustum;

		calculateFrustumVertices(): IVec3[];
		extractFromMatrix(m4fProjection: IMat4, m4fWorld?: IMat4, pSearchRect?: IRect3d): IFrustum;

		isEqual(pFrustum: IFrustum): bool;

		getPlanePoints(sPlaneKey: string, pDestination?: IVec3[]): IVec3[];

		testPoint(v3fPoint: IVec3): bool;
		testRect(pRect: IRect3): bool;
		testSphere(pSphere: ISphere): bool;
		testFrustum(pFrustum: IFrustum): bool;
	};
};

#endif