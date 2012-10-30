///<reference path="akra.ts" />

module akra {
	export interface IScene3d extends IScene {
		recursivePreUpdate(): void;
		updateCamera(): bool;
		updateScene(): bool;
		recursiveUpdate(): void;
	}
}