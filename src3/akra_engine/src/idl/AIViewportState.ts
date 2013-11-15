// AIViewportState interface
// [write description here...]


enum AECompareFunction {
	ALWAYS_FAIL,
	ALWAYS_PASS,
	LESS,
	LESS_EQUAL,
	EQUAL,
	NOT_EQUAL,
	GREATER_EQUAL,
	GREATER
}

enum AECullingMode {
	NONE = 1,
	CLOCKWISE = 2,
	ANTICLOCKWISE = 3
}

enum AEFrameBufferTypes {
	COLOR  = 0x1,
	DEPTH   = 0x2,
	STENCIL = 0x4
}

interface AIViewportState {
	cullingMode: AECullingMode;

	depthTest: boolean;
	depthWrite: boolean;
	depthFunction: AECompareFunction;

	clearColor: AIColor;
	clearDepth: float;
	clearBuffers: int;
}


