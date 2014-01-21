/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/ISceneManager.ts" />
/// <reference path="../idl/IScene.ts" />
/// <reference path="../idl/IScene2d.ts" />
/// <reference path="../idl/IScene3d.ts" />

/// <reference path="Scene3d.ts" />

module akra.scene {
	export class SceneManager implements ISceneManager {
		private _pEngine: IEngine = null;
		private _pSceneList: IScene[] = [];

		private _fUpdateTimeCount: float = 0.;
		private _fMillisecondsPerTick: float = 0.01666; /*60 updates per frame*/
		

		constructor (pEngine: IEngine) {
			this._pEngine = pEngine;
		}

		getEngine(): IEngine{
			return this._pEngine;
		}

		update(): void {
			var isSceneUpdated: boolean = false;
			// add the real time elapsed to our
			// internal delay counter
			this._fUpdateTimeCount += this._pEngine.elapsedTime;
			// is there an update ready to happen?

			// LOG(this._fUpdateTimeCount, this._pEngine.elapsedTime);

			var fUpdateTime: float = this._fUpdateTimeCount;

			while (this._fUpdateTimeCount > this._fMillisecondsPerTick) {
				// update the scene
				this.notifyUpdateScene();

				// subtract the time interval
				// emulated with each tick
				this._fUpdateTimeCount -= this._fMillisecondsPerTick;
			}

			if (fUpdateTime !== this._fUpdateTimeCount) {
				this.notifyPreUpdateScene();
			}
		}

		//  preUpdate(): void {
		//     this.notifyPreUpdateScene();
		// }

		notifyUpdateScene(): void {
			// update the scene attached to the root node
			for (var i = 0; i < this._pSceneList.length; ++ i) {
				var pScene: IScene = this._pSceneList[i];
				
				if (pScene.type != ESceneTypes.TYPE_3D) {
					continue;
				}
				
				(<IScene3d>pScene).recursiveUpdate();
			}
		}

		notifyPreUpdateScene(): void {
			for (var i = 0; i < this._pSceneList.length; ++ i) {
				var pScene: IScene = this._pSceneList[i];
				
				if (pScene.type != ESceneTypes.TYPE_3D) {
					continue;
				}
				
				(<IScene3d>pScene).recursivePreUpdate();
			}
		}

		createScene3D(sName: string = null): IScene3d {
			var pScene: IScene3d = new Scene3d(this, sName);
			this._pSceneList.push(pScene);

			return pScene;
		}

		createScene2D(sName: string = null): IScene2d {
			return null;
		}

		createUI(): IUI {
			if (config.GUI) {
				var pUI: IUI = new ui.UI(this);
				return pUI;
			}
			else {
				return null;
			}
		}

		getScene3D(): IScene3d;
		getScene3D(sName: string): IScene3d;
		getScene3D(iScene: int): IScene3d;
		getScene3D(scene?: any): IScene3d {
			if (isNumber(arguments[0]) || !isDef(arguments[0])) {
				var iScene: int = <int>arguments[0] || 0;
				var pScene: IScene;

				if (iScene === 0 && this._pSceneList.length === 0) {
					this.createScene3D();
					debug.log("Default scene automatically created.");
				}

				pScene = this._pSceneList[iScene];
				
				if (pScene && pScene.type === ESceneTypes.TYPE_3D) {
					return <IScene3d>pScene;
				}

				return null;
			}
			else if (isString(arguments[0])) {
				for (var i: int = 0; i < this._pSceneList.length; ++ i) {
					if (this._pSceneList[i].name === <string>arguments[0]) {
						return <IScene3d>this._pSceneList[i];
					}
				}
			}

			return null;

		}

		getScene2D(): IScene2d;
		getScene2D(sName: string): IScene2d;
		getScene2D(iScene: uint): IScene2d;
		getScene2D(scene?: any): IScene2d {
			if (isNumber(arguments[0]) || !isDef(arguments[0])) {
				var iScene: int = arguments[0] || 0;
				var pScene: IScene = this._pSceneList[iScene];
				
				if (pScene && pScene.type === ESceneTypes.TYPE_2D) {
					return <IScene2d>pScene;
				}
			}
			
			return null;
		}

		getScene(IScene?: uint, eType?: ESceneTypes): IScene {
			return this._pSceneList[IScene] || null;
		}


		initialize(): boolean {
			//this.initText2Dlayer();
			return true;
		}

		destroy(): void {
			
		}
	}
}