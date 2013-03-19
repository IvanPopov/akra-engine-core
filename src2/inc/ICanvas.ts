#ifndef ICanvas_TS
#define ICanvas_TS

module akra {
	export enum ECanvasTypes {
		TYPE_UNKNOWN = -1,
		TYPE_2D = 1,
		TYPE_3D
	};

	export interface ICanvas {
		type: ECanvasTypes;


		isFullscreen(): bool;
		setFullscreen(isFullscreen?: bool): void;
	}
}

#endif
