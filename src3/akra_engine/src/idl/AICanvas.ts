enum AECanvasTypes {
	TYPE_UNKNOWN = -1,
	TYPE_2D = 1,
	TYPE_3D
};

interface AICanvas {
	type: AECanvasTypes;


	isFullscreen(): boolean;
	setFullscreen(isFullscreen?: boolean): void;
}
