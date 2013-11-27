

module akra {
	export enum ECompareFunction {
		ALWAYS_FAIL,
		ALWAYS_PASS,
		LESS,
		LESS_EQUAL,
		EQUAL,
		NOT_EQUAL,
		GREATER_EQUAL,
		GREATER
	}
	
	export enum ECullingMode {
		NONE = 1,
		CLOCKWISE = 2,
		ANTICLOCKWISE = 3
	}
	
	export enum EFrameBufferTypes {
		COLOR  = 0x1,
		DEPTH   = 0x2,
		STENCIL = 0x4
	}
	
	export interface IViewportState {
		cullingMode: ECullingMode;
	
		depthTest: boolean;
		depthWrite: boolean;
		depthFunction: ECompareFunction;
	
		clearColor: IColor;
		clearDepth: float;
		clearBuffers: int;
	}
	
	
	
}
