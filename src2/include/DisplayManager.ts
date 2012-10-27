///<reference path="akra.ts" />

module akra {
    export class DisplayManager implements IDisplayManager {
        private pEngine: IEngine = null;
        
        private pSurfaceMaterialPool: IResourcePool;
        private pEffectPool: IResourcePool;
        private pRenderMethodPool: IResourcePool;
        private pVertexBufferPool: IResourcePool;
        private pIndexBufferPool: IResourcePool;
        private pModelPool: IResourcePool;
        private pImagePool: IResourcePool;
        private pTexturePool: IResourcePool;
        private pVideoBufferPool: IResourcePool;
        private pShaderProgramPool: IResourcePool;
        private pComponentPool: IResourcePool;

        private pTextLayer: HTMLDivElement;

        get surfaceMaterialPool(): IResourcePool { return this.pSurfaceMaterialPool; }
        get effectPool(): IResourcePool { return this.pEffectPool; }
        get renderMethodPool(): IResourcePool { return this.pRenderMethodPool; }
        get vertexBufferPool(): IResourcePool { return this.pVertexBufferPool; }
        get indexBufferPool(): IResourcePool { return this.pIndexBufferPool; }
        get modelPool(): IResourcePool { return this.pModelPool; }
        get imagePool(): IResourcePool { return this.pImagePool; }
        get texturePool(): IResourcePool { return this.pTexturePool; }
        get videoBufferPool(): IResourcePool { return this.pVideoBufferPool; }
        get shaderProgramPool(): IResourcePool { return this.pShaderProgramPool; }
        get componentPool(): IResourcePool { return this.pComponentPool; }

        get textLayer(): HTMLDivElement { return this.pTextLayer; }

        get resourceManager(): IResourceManager { return this.pEngine.resourceManager; }

        constructor (pEngine: IEngine) {
            this.pEngine = pEngine;
            
            this.pSurfaceMaterialPool = new resources.SurfaceMaterialManager(pEngine);
            this.pSurfaceMaterialPool.initialize(16);

            this.pEffectPool = new resources.EffectManager(pEngine);
            this.pEffectPool.initialize(16);

            this.pRenderMethodPool = new resources.RenderMethodManager(pEngine);
            this.pRenderMethodPool.initialize(16);

            this.pVertexBufferPool = new resources.VertexBufferManager(pEngine);
            this.pVertexBufferPool.initialize(16);

            this.pIndexBufferPool = new resources.IndexBufferManager(pEngine);
            this.pIndexBufferPool.initialize(16);

            this.pModelPool = new resources.ModelManager(pEngine);
            this.pModelPool.initialize(16);

            this.pImagePool = new resources.ImageManager(pEngine);
            this.pImagePool.initialize(16);

            this.pTexturePool = new resources.TextureManager(pEngine);
            this.pTexturePool.initialize(16);

            this.pVideoBufferPool = new resources.VideoBufferManager(pEngine);
            this.pVideoBufferPool.initialize(16);

            this.pShaderProgramPool = new resources.ShaderProgramManager(pEngine);
            this.pShaderProgramPool.initialize(16);

            this.pComponentPool = new resources.ComponentManager(pEngine);
            this.pComponentPool.initialize(16);

            this.pTextLayer = null;
        }

        initialize(): bool {
            this.registerDeviceResources();
            this.initText2Dlayer();
            return true;
        }

        destroy(): void {

        }

        /** @inline */
        draw2DText(iX: int = 0, iY: int = 0, sText: string = "", pFont: IFont2d = new util.Font2d()): IString2d {
            return (new a.String2D(iX, iY, pFont, sStr, this.pTextLayer));
        }

        createDeviceResources(): bool {
            return true;
        }

        destroyDeviceResources(): bool {
            this.disableDeviceResources();

            // then destroy...
            debug_print("Destroying Video Device Resources\n");
            
            this.resourceManager.destroyResourceFamily(ResourceFamilies.VIDEO_RESOURCE);

            return true;
        }

        restoreDeviceResources(): bool {
            debug_print("Restoring Video Device Resources\n");
            this.resourceManager.restoreResourceFamily(ResourceFamilies.VIDEO_RESOURCE);
            return true;
        }

        disableDeviceResources(): bool {
            debug_print("Disabling Video Device Resources\n");
            this.resourceManager.disableResourceFamily(ResourceFamilies.VIDEO_RESOURCE);
            return true;
        }

        private initText2Dlayer(): void {
            var pCanvas: HTMLCanvasElement = this.pEngine.canvas;
            var x: int = findPosX(pCanvas);
            var y: int = findPosY(pCanvas);

            var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement('div');
            var pStyle: CSSStyleDeclaration = pDiv.style;
            var pScreen: IScreenInfo = info.screen;

            var iBorder: int = 0;

            pDiv.setAttribute("id", "akra-canvas-overlay");

            pStyle.width = String(pScreen.width) + "px";
            pStyle.height = String(pScreen.height) + "px";
            
            if (pCanvas.style.border != "none") {
                iBorder = parseInt(pCanvas.style.border);
            }

            pStyle.position = 'absolute';
            pStyle.left = String(x) + 'px';
            pStyle.top = String(y) + 'px';

            pStyle.overflow = 'hidden';
            pStyle.whiteSpace = 'nowrap';

            if (pCanvas.style.zIndex) {
                pStyle.zIndex = pCanvas.style.zIndex + 1;
            }
            else {
                pStyle.zIndex = 2;
            }

            document.body.appendChild(pDiv);

            this.pTextLayer = pDiv;
        }

        private registerDeviceResources(): void {
            debug_print("Registering Video Device Resources\n");
            this.pTexturePool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.TextureResource));
            this.pVertexBufferPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.VertexBufferResource));
            this.pIndexBufferPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.IndexBufferResource));
            this.pEffectPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.RenderResource));
            this.pRenderMethodPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.RenderSetResource));
            this.pModelPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.ModelResource));
            this.pImagePool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.ImageResource));
            this.pSurfaceMaterialPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.SMaterialResource));
            this.pVideoBufferPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.VideoBufferResource));
            this.pShaderProgramPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.ShaderProgramResource));
            this.pComponentPool.registerResourcePool(
                new a.ResourceCode(a.ResourcePoolManager.VideoResource,
                                   a.ResourcePoolManager.ComponentResource));
        }

        private unregisterDeviceResources(): void {
            debug_print("Unregistering Video Device Resources");

            this.pTexturePool.unregisterResourcePool();
            this.pVertexBufferPool.unregisterResourcePool();
            this.pIndexBufferPool.unregisterResourcePool();
            this.pEffectPool.unregisterResourcePool();
            this.pRenderMethodPool.unregisterResourcePool();
            this.pModelPool.unregisterResourcePool();
            this.pImagePool.unregisterResourcePool();
            this.pSurfaceMaterialPool.unregisterResourcePool();
            this.pVideoBufferPool.unregisterResourcePool();
            this.pShaderProgramPool.unregisterResourcePool();
            this.pComponentPool.unregisterResourcePool();
        }

        /** load font texture */
        private createDeviceResources(): bool {
            return true;
        }

        /** destroy device resources */
        private destroyDeviceResources(): bool {
            // first disable...
            this.disableDeviceResources();

            // then destroy...
            debug_print("Destroying Video Device Resources\n");
            
            this.resourceManager.destroyResourceFamily(a.ResourcePoolManager.VideoResource);

            return true;
        }

        /**
         * restore device resources
         * @treturn Boolean always returns true
         */
        private restoreDeviceResources(): bool {
            debug_print("Restoring Video Device Resources");
            this.resourceManager.restoreResourceFamily(a.ResourcePoolManager.VideoResource);
            return true;
        }

        /**
         * disable device resources
         * @treturn Boolean always returns true
         */
        private disableDeviceResources(): void {
            debug_print("Disabling Video Device Resources");
            this.resourceManager.disableResourceFamily(a.ResourcePoolManager.VideoResource);
            return true;
        };

    }
}