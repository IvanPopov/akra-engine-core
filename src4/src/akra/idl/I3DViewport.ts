/// <reference path="IViewport.ts" />
/// <reference path="IRID.ts" />
/// <reference path="IColor.ts" />

module akra {
	export enum EShadingModel {
		BLINNPHONG,
		PHONG,
		PBS_SIMPLE
	};

	export interface I3DViewport extends IViewport {
		getEffect(): IEffect;
		getDepthTexture(): ITexture;
		getLightSources(): IObjectArray<ILightPoint>;
		getTextureWithObjectID(): ITexture;
		getView(): IRenderableObject;

		getSkybox(): ITexture;
		setSkybox(pSkyTexture: ITexture): void;

		setFXAA(bValue?: boolean): void;
		isFXAA(): boolean;

		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;

		_getRenderId(x: uint, y: uint): int;

		addedSkybox: ISignal<{ (pViewport: IViewport, pSkyTexture: ITexture): void; }>;

		setShadingModel(eModel: EShadingModel): void;
		getShadingModel(): EShadingModel;

		setDefaultEnvironmentMap(pEnvMap: ITexture): void;
		getDefaultEnvironmentMap(): ITexture;
	}
}