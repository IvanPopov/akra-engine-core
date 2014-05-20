/// <reference path="IViewport.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IColor.ts" />

module akra {

	/** Viewport that can supports 3D events, depth range, object picking. */
	export interface IViewport3D extends IViewport {
		/** Get global post effects. */
		getEffect(): IEffect;
		
		/** 
		 * Propagate or not propagate viewport events to 3D objects.
		 * @param bEnable Enable or Disable 3D events propagation.
		 */
		enable3DEvents(bEnable?: boolean): void;
		/** @return TRUE - if events apply to objects in this viewport. */
		is3DEventsSupported(): boolean;

		/**
		 * Manual call mouseout event for last focused object/renderable.
		 */
		touch(): void;

		/**
		 * Pick 3D object by screen position.
		 *
		 * @param pDept Pick results.
		 * @return Picked object.
		 */
		pick(x: uint, y: uint, pDest?: IPickedObject): IPickedObject;

		/** @return Scene object with screen postion (x, y); */
		getObject(x: uint, y: uint): ISceneObject;
		/** @return Renderable with screen postion (x, y); */
		getRenderable(x: uint, y: uint): IRenderableObject;

		/** Get screen depth for (x, y) postion. */
		getDepth(x: uint, y: uint): float;

		/** Get depth range for viewport. */
		getDepthRange(): IDepthRange;

		/**
		 * Indicates whether the mouse is over the viewport.
		 */
		isMouseCaptured(): boolean;

		/** Project point from world space to screen. */
		projectPoint(v3fPoint: IVec3, v3fDestination?: IVec3): IVec3;

		/** Unproject point fron screen to world space. */
		unprojectPoint(x: uint, y: uint, v3fDestination?: IVec3): IVec3;
		unprojectPoint(pPos: IPoint, v3fDestination?: IVec3): IVec3;

		/** Get render ID for (@x, @y) position. */
		_getRenderId(x: uint, y: uint): int;
	}

	/**  Viewport that can display skyboxes. */
	export interface IViewportSkybox extends IViewport3D {
		/** Events occurring after the viewport changed skybox. */
		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;

		/** Get current skybox texture. */
		getSkybox(): ITexture;

		/** Set new skybox. */
		setSkybox(pSkyTexture: ITexture): void;
	}

	/** Viewport that can support antialiasing. */
	export interface IViewportAntialising extends IViewport3D {
		/** Enable antialiasing. */
		setAntialiasing(bEnabled?: boolean): void;

		/** Is antaliasing enabled? 
		 * @return TRUE if anttialiasing enabled.
		 */
		isAntialiased(): boolean;
	}

	/** Viewport that can highligh objects. */
	export interface IViewportHighlighting extends IViewport3D {
		/** Highlight object by render id. */
		highlight(iRid: int): void;
		/** Hightlight ISceneObject or/and IRenderableObject. */
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		/** Hightlight render pair. */
		highlight(pPair: IRIDPair): void;
	}

	export enum EShadingModel {
		BLINNPHONG,
		PHONG,
		PBS_SIMPLE
	};

	export interface IShadedViewport extends IViewport3D {
		setShadingModel(eModel: EShadingModel);
		getShadingModel(): EShadingModel;

		getLightSources(): IObjectArray<ILightPoint>;
		setDefaultEnvironmentMap(pTexture: ITexture): void;
		getDefaultEnvironmentMap(): ITexture;
	}
}