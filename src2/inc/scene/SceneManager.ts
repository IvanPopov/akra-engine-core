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
        private pEngine: IEngine = null;
        private pSceneList: IScene[] = [];
        

        constructor (pEngine: IEngine) {
            this.pEngine = pEngine;
        }

        createScene3D(): IScene3d {
            var pScene: IScene3d = new Scene3d(this);
            this.pSceneList.push(pScene);

            return pScene;
        }

        createScene2D(): IScene2d {
            return null;
        }

        getScene3D(IScene: uint = 0): IScene3d {
            var pScene: IScene = this.pSceneList[IScene];
            
            if (pScene && pScene.type === ESceneTypes.TYPE_3D) {
                return <IScene3d>pScene;
            }

            return null;
        }

        getScene2D(IScene?: uint): IScene2d {
            var pScene: IScene = this.pSceneList[IScene];
            
            if (pScene && pScene.type === ESceneTypes.TYPE_2D) {
                return pScene;
            }
            
            return null;
        }

        getScene(IScene?: uint, eType?: ESceneTypes): IScene {
            return this.pSceneList[IScene] || null;
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