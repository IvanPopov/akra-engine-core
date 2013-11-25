module akra {
	enum ECanvasTypes {
		TYPE_UNKNOWN = -1,
		TYPE_2D = 1,
		TYPE_3D
	};
	
	interface ICanvas {
		type: ECanvasTypes;
	
	
		isFullscreen(): boolean;
		setFullscreen(isFullscreen?: boolean): void;
	}
	
}
