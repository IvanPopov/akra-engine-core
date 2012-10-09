///<reference path="akra.ts" />

module akra {
    export interface IEngine {
        setupWorldOcTree(): void;

        create(): bool;
        pause(isPause: bool): void;
        run(): bool;
        showStats(isShow: bool): void;
        fullscreen(): bool;

        notifyOneTimeSceneInit(): bool;
        notifyRestoreDeviceObjects(): bool;
        notifyDeleteDeviceObjects(): bool;
        notifyUpdateScene(): bool;
        notifyPreUpdateScene(): bool;
        notifyInitDeviceObjects(): bool;

        updateCamera(): void;

        getRootNode(): void;
        getSceneTree(): void;
        getDefaultCamera(): void;
        getActiveViewport(): Viewport;
        getWorldExtents(): WorldExtents;
        getDevice(): WebGLRenderingContext;
        getWindowTitle(): string;
        getCurrentRenderStage(): number;

        getActiveCamera(): void;
        setActiveCamera(pCamera: ICamera): bool;

        inFullscreenMode(): bool;

        displayManager(): IDisplayManager;
        particleManager(): IParticleManager;
        spriteManager(): ISpriteManager;
        lightManager(): ILightManager;
    };

}