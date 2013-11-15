// AIPositionFrame interface
// [write description here...]

/// <reference path="AIFrame.ts" />


/// <reference path="AIQuat4.ts" />
/// <reference path="AIVec3.ts" />
/// <reference path="AIMat4.ts" />

interface AIPositionFrame extends AIFrame {
	/** readonly */ rotation: AIQuat4;
	/** readonly */ scale: AIVec3;
	/** readonly */ translation: AIVec3;

	toMatrix(): AIMat4;
}