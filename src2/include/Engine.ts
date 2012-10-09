///<reference path="akra.ts" />

module akra {
    export class Engine implements IEngine {
        private pRenderer: IRenderer = null;
        
        private pResourceManager: IResourceManager = null;
        private pDisplayManager: IDisplayManager = null;
        private pParticleManager: IParticleManager = null;
        private pSpriteManager: ISpriteManager = null;
        private pLightManager: ILightManager = null;

        constructor () {

        }

        create(): bool {
            return false;
        }

        run(): bool {
            return false;
        }

        setupWorldOcTree(): void {

        }

        pause(isPause: bool): void {

        }

        showStats(isShow: bool): void {

        }

        fullscreen(): bool {
            return false;
        }

        notifyOneTimeSceneInit(): bool {
            return false;
        }

        notifyRestoreDeviceObjects(): bool {
            return false;
        }

        notifyDeleteDeviceObjects(): bool {
            return false;
        }

        notifyUpdateScene(): bool {
            return false;
        }

        notifyPreUpdateScene(): bool {
            return false;
        }

        notifyInitDeviceObjects(): bool {
            return false;
        }


        //initialize3DEnvironment(): bool;
        //render3DEnvironment(): bool;
        //cleanup3DEnvironment(): bool;
        //invalidateDeviceObjects(): bool;

        //frameMove(): bool;
        //render(): bool;
        //updateStats(): void;
        //finalCleanup(): bool;
        //updateCamera(): void;

        updateCamera(): void {

        }

        getRootNode(): void {

        }

        getSceneTree(): void {

        }

        getDefaultCamera(): void {

        }

        getActiveViewport(): Viewport {
            return { width: 0, height: 0, x: 0, y: 0 };
        }

        getWorldExtents(): WorldExtents {
            return {};
        }

        getDevice(): WebGLRenderingContext {
            return null;
        }

        getWindowTitle(): string {
            return "";
        }

        getCurrentRenderStage(): number {
            return 0;
        }


        getActiveCamera(): void {

        }

        setActiveCamera(pCamera: ICamera): bool {
            return null;
        }


        inFullscreenMode(): bool {
            return false;
        }


        displayManager(): IDisplayManager {
            return null;
        }

        particleManager(): IParticleManager {
            return null;
        }

        spriteManager(): ISpriteManager {
            return null;
        }

        lightManager(): ILightManager {
            return null;
        }

    }

}