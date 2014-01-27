module akra {
	export enum ECanvasTypes {
		TYPE_UNKNOWN = -1,
		TYPE_2D = 1,
		TYPE_3D
	};
	
	export interface ICanvas {
		getType(): ECanvasTypes;	
	
		isFullscreen(): boolean;
		setFullscreen(isFullscreen?: boolean): void;
	}
	
}
