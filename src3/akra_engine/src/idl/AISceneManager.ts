// AISceneManager interface
// [write description here...]

/// <reference path="AIManager.ts" />
/// <reference path="AIScene.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AIScene3d.ts" />
/// <reference path="AIScene2d.ts" />
/// <reference path="AIUI.ts" />

interface AISceneManager extends AIManager {
	createScene3D(sName?: string): AIScene3d;
	// createScene2D(): AIScene2d;

	createUI(): AIUI;

	getEngine(): AIEngine;

	getScene3D(): AIScene3d;
	getScene3D(sName: string): AIScene3d;
	getScene3D(iScene: uint): AIScene3d;

	getScene2D(): AIScene2d;
	getScene2D(sName: string): AIScene2d;
	getScene2D(iScene: uint): AIScene2d;

	getScene(iScene?: uint, eType?: AESceneTypes): AIScene;

	update(): void;
	// preUpdate(): void;
	notifyUpdateScene(): void;
	notifyPreUpdateScene(): void;
}	
