///<reference path="akra.ts" />

module akra {
    export class DisplayManager implements IDisplayManager {
        private pEngine: IEngine = null;
        
        /** @deprecated */
        private pCanvas: HTMLCanvasElement = null;
        
        /** @deprecated */
        private pDevice: WebGLRenderingContext = null;
        
        /** @deprecated */
        private pResourceManager: IResourceManager = null;
        
        /** 
         * @deprecated 
         * --> renderer
         */
        private bClearEachFrame: bool = true;


        //private pSurfaceMaterialPool:IResourcePool = null;

        initialize(): bool {
            return false;
        }
    }
}