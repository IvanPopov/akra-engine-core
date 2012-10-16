///<reference path="akra.ts" />

module akra {
    export interface IEngine {
        displayManager: IDisplayManager;
        particleManager: IParticleManager;
        spriteManager: ISpriteManager;
        lightManager: ILightManager;
        resourceManager: IResourcePoolManager;
        /*
        rootNode: number;
        sceneTree: number;
        defaultCamera: number;
        activeViewport: Viewport;
        worldExtents: WorldExtents;
        device: WebGLRenderingContext;
        windowTitle: string;
        currentRenderStage: number;
        activeCamera: number;
*/
        setupWorldOcTree(pWorldExtents: geometry.Rect3d): void;

        create(): bool;
        pause(isPause: bool): void;
        run(): bool;
        
        showStats(isShow: bool): void;
        
        fullscreen(): bool;
        inFullscreenMode(): bool;

        notifyOneTimeSceneInit(): bool;
        notifyRestoreDeviceObjects(): bool;
        notifyDeleteDeviceObjects(): bool;
        notifyUpdateScene(): bool;
        notifyPreUpdateScene(): bool;
        notifyInitDeviceObjects(): bool;

        updateCamera(): void;
    };

}