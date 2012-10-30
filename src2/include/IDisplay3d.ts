///<reference path="akra.ts" />

module akra {
	export interface IDisplay3d extends IDisplay {
		render(): void;
		renderFrame(): bool;
		
		play(): bool;
		pause(isPaused?: bool): bool;
		
		inRendering(): bool;


		getCanvas(): HTMLCanvasElement;
		getScene(): IScene3d;
		getBuilder(): ISceneBuilder;
		getRenderer(): IRenderer;
		getScreen(): IScreen;

		getTime(): float;
		getElapsedTime(): float;
		getFPS(): float;

	}
}