module akra {
    export interface IDisplayManager extends IManager {
    	texturePool: IResourcePool;
    	surfaceMaterialPool: IResourcePool;
    	vertexBufferPool: IResourcePool;
    	videoBufferPool: IResourcePool;
    	indexBufferPool: IResourcePool;
    	renderMethodPool: IResourcePool;
    	modelPool: IResourcePool;
    	imagePool: IResourcePool;			
    	shaderProgramPool: IResourcePool;		//ex: private
    	effectPool: IResourcePool;				//ex: private
    	componentPool: IResourcePool;			//ex: private

    	textLayer: HTMLDivElement;


    	draw2DText(iX?: int, iY?: int, sText?: string, pFont?: IFont2d): IString2d;

    	destroy(): void; //TODO: move to IManager ?

    	createDeviceResources(): bool;
    	destroyDeviceResources(): bool;
    	restoreDeviceResources(): bool;
    	disableDeviceResources(): bool;
    }	
}