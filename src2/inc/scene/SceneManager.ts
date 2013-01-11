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
        private _pTimer: IUtilTimer;

        private _fUpdateTimeCount: float = 0.;
        private _fMillisecondsPerTick: float = 0.0333;
        

        constructor (pEngine: IEngine) {
            this._pEngine = pEngine;
            this._pTimer = pEngine.getTimer();
        }

        update(): void {
            var isSceneUpdated: bool = false;
            // add the real time elapsed to our
            // internal delay counter
            this._fUpdateTimeCount += this._pTimer.elapsedTime;
            // is there an update ready to happen?
            
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

        createScene3D(): IScene3d {
            var pScene: IScene3d = new Scene3d(this);
            this._pSceneList.push(pScene);

            return pScene;
        }

        createScene2D(): IScene2d {
            return null;
        }

        getScene3D(IScene: uint = 0): IScene3d {
            var pScene: IScene = this._pSceneList[IScene];
            
            if (pScene && pScene.type === ESceneTypes.TYPE_3D) {
                return <IScene3d>pScene;
            }

            return null;
        }

        getScene2D(IScene?: uint): IScene2d {
            var pScene: IScene = this._pSceneList[IScene];
            
            if (pScene && pScene.type === ESceneTypes.TYPE_2D) {
                return pScene;
            }
            
            return null;
        }

        getScene(IScene?: uint, eType?: ESceneTypes): IScene {
            return this._pSceneList[IScene] || null;
        }


        initialize(): bool {
            //this.initText2Dlayer();
            return true;
        }

        destroy(): void {
            
        }
    }
} 





/** @inline *//*
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