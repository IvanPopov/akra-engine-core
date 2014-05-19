/// <reference path="IViewport.ts" />
/// <reference path="IPlane3d.ts" />

module akra {
	export interface IMirrorViewport extends IViewport {
		getReflectionPlane(): IPlane3d;
		getInternalViewport(): IViewport;
	}
}