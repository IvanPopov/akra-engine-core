#ifndef SCENEMANAGER_TS
#define SCENEMANAGER_TS

#include "IEngine.ts"
#include "ISceneManager.ts"
#include "IScene.ts"
#include "IScene2d.ts"
#include "IScene3d.ts"

#include "Scene3d.ts"

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
#ifdef GUI
                var pUI: IUI = new ui.UI(this);
                return pUI;
#else
                return null;
#endif
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
        getScene2D(scene?: uint): IScene2d {
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





/** @ *//*
        draw2DText(iX: int = 0, iY: int = 0, sText: string = "", pFont: IFont2d = new util.Font2d()): IString2d {
            return (new a.String2D(iX, iY, pFont, sStr, this.pTextLayer));
        }

        

        private initText2Dlayer(): void {
            var pCanvas: HTMLCanvasElement = this.pEngine.canvas;
            var x: int = findPosX(pCanvas);
            var y: int = findPosY(pCanvas);

            var pDiv: HTMLDivElement = <HTMLDivElement>document.createElement('div');
            var pStyle: CSSStyleDeclaration = pDiv.style;
            var pScreen: IScreenInfo = info.screen;

            var iBorder: int = 0;

            pDiv.setAttribute("id", "akra-canvas-overlay");

            pStyle.width = String(pScreen.width) + "px";
            pStyle.height = String(pScreen.height) + "px";
            
            if (pCanvas.style.border != "none") {
                iBorder = parseInt(pCanvas.style.border);
            }

            pStyle.position = 'absolute';
            pStyle.left = String(x) + 'px';
            pStyle.top = String(y) + 'px';

            pStyle.overflow = 'hidden';
            pStyle.whiteSpace = 'nowrap';

            if (pCanvas.style.zIndex) {
                pStyle.zIndex = pCanvas.style.zIndex + 1;
            }
            else {
                pStyle.zIndex = 2;
            }

            document.body.appendChild(pDiv);

            this.pTextLayer = pDiv;
        }
*/
#endif