/// <reference path="IViewport.ts" />
module akra {
	export interface ILPPViewport extends IViewport {
		getDepthTexture(): ITexture;
		getView(): IRenderableObject;

		setFXAA(bValue?: boolean): void;
		isFXAA(): boolean;

		highlight(iRid: int): void;
		highlight(pObject: ISceneObject, pRenderable?: IRenderableObject): void;
		highlight(pPair: IRIDPair): void;
	}
}