///<reference path="akra.ts" />

module akra {
	export enum EDisplayTypes {
		TYPE_UNKNOWN = -1,
		TYPE_2D = 1,
		TYPE_3D
	};

	export interface IDisplay {
		type: EDisplayTypes;


		isFullscreen(): bool;
		fullscreen(): bool;
	}
}