/// <reference path="I3DViewport.ts" />

module akra {
	export interface IForwardViewport extends I3DViewport {
		_renderOnlyTransparentObjects(bValue: boolean): void;
	}
} 