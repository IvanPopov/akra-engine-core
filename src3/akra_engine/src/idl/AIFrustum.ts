// AIFrustum interface
// [write description here...]

/// <reference path="AIMat4.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AISphere.ts" />
/// <reference path="AIRect3d.ts" />
/// <reference path="AIPlane3d.ts" />

interface AIFrustum {
	leftPlane: AIPlane3d;
	rightPlane: AIPlane3d;
	topPlane: AIPlane3d;
	bottomPlane: AIPlane3d;
	nearPlane: AIPlane3d;
	farPlane: AIPlane3d;

	/** readonly */ frustumVertices: AIVec3[];

	set(): AIFrustum;
	set(pFrustum: AIFrustum): AIFrustum;
	set(pLeftPlane: AIPlane3d, pRightPlane: AIPlane3d,
		pTopPlane: AIPlane3d, pBottomPlane: AIPlane3d,
		pNearPlane: AIPlane3d, pFarPlane: AIPlane3d): AIFrustum;

	calculateFrustumVertices(): AIVec3[];
	extractFromMatrix(m4fProjection: AIMat4, m4fWorld?: AIMat4, pSearchRect?: AIRect3d): AIFrustum;

	isEqual(pFrustum: AIFrustum): boolean;

	getPlanePoints(sPlaneKey: string, pDestination?: AIVec3[]): AIVec3[];

	testPoint(v3fPoint: AIVec3): boolean;
	testRect(pRect: AIRect3d): boolean;
	testSphere(pSphere: AISphere): boolean;
	testFrustum(pFrustum: AIFrustum): boolean;

	getViewDirection(v3fDirection?: AIVec3): AIVec3;

	toString(): string;
}

