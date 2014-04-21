/// <reference path="IViewport.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IColor.ts" />

module akra {
	export enum EShadingModel {
		BLINNPHONG,
		PHONG
	};

	export interface IViewport3D extends IViewport {
		getEffect(): IEffect;

		touch(): void;

		/**
		 * Pick 3D object by screen position.
		 */
		pick(x: uint, y: uint): IRIDPair;
		
		/** 
		 * Propagate or not propagate viewport events to 3D objects.
		 * @param bEnable Enable or Disable 3D events propagation.
		 */
		enable3DEvents(bEnable?: boolean): void;
		/** @return TRUE - if events apply to objects in this vyuporte. */
		is3DEventsSupported(): boolean;

		getObject(x: uint, y: uint): ISceneObject;
		getRenderable(x: uint, y: uint): IRenderableObject;

		getDepth(x: uint, y: uint): float;
		getDepthRange(): IDepthRange;

		/**
		 * Is mouse under the viewport?
		 */
		isMouseCaptured(): boolean;

		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;
		unprojectPoint(x: uint, y: uint, v3fDestination?: IVec3): IVec3;
		unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;

		_getRenderId(x: uint, y: uint): int;
		_getLastMousePosition(): IPoint;
		_keepLastMousePosition(x: uint, y: uint): void;
		_handleMouseInout(pCurr: IRIDPair, x: uint, y: uint): IRIDPair;
		_setUserEventDragTarget(pObject?: ISceneObject, pRenderable?: IRenderableObject): void;
		_getUserEventDragTarget(): IRIDPair;
		_setMouseCaptured(bValue: boolean): void;
	}

	export interface IViewportSkybox extends IViewport3D {
		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;
	}

	export interface IViewportAntialising extends IViewport3D {
		setAntialiasing(bEnabled?: boolean): void;
		isAntialiased(): boolean;
	}

	export interface IViewportHighlighting extends IViewport3D {
		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;
	}

	export interface IShadedViewport extends IViewport3D {
		setShadingModel(eModel: EShadingModel);
		getShadingModel(): EShadingModel;

		getLightSources(): IObjectArray<ILightPoint>;
	}
}