/// <reference path="I3DViewport.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IColor.ts" />

module akra {
	export interface IDSViewport extends I3DViewport {
		getColorTextures() : ITexture[];
		_getDeferredTexValue(iTex: int, x: uint, y: uint): IColor;
	}
}
