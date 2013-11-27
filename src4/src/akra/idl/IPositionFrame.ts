
/// <reference path="IFrame.ts" />


/// <reference path="IQuat4.ts" />
/// <reference path="IVec3.ts" />
/// <reference path="IMat4.ts" />

module akra {
	export interface IPositionFrame extends IFrame {
		/** readonly */ rotation: IQuat4;
		/** readonly */ scale: IVec3;
		/** readonly */ translation: IVec3;
	
		toMatrix(): IMat4;
	}
	
}
