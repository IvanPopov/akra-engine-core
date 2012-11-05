#ifndef IDISPLAYMANAGER_TS
#define IDISPLAYMANAGER_TS

#include "IEngine.ts"
#include "IDisplayManager.ts"
#include "IDisplay.ts"
#include "IDisplay2d.ts"
#include "IDisplay3d.ts"


module akra {
    export class DisplayManager implements IDisplayManager {
        private pEngine: IEngine = null;
        private pDisplayList: IDisplay[] = [];
        

        constructor (pEngine: IEngine) {
            this.pEngine = pEngine;
        }

        createDisplay3D(): IDisplay3d;
        createDisplay3D(pCanvas: HTMLCanvasElement): IDisplay3d;
        createDisplay3D(sCanvas?: string): IDisplay3d {
            var pDisplay: IDisplay3d = new display.Display3d(this, sCanvas);
            this.pDisplayList.push(pDisplay);

            return pDisplay;
        }

        createDisplay2D(): IDisplay2d {
            return null;
        }

        getDisplay3D(iDisplay: uint = 0): IDisplay3d {
            var pDisplay: IDisplay = this.pDisplayList[iDisplay];
            
            if (pDisplay && pDisplay.type === EDisplayTypes.TYPE_3D) {
                return <IDisplay3d>pDisplay;
            }

            return null;
        }

        getDisplay2D(iDisplay?: uint): IDisplay2d {
            var pDisplay: IDisplay = this.pDisplayList[iDisplay];
            
            if (pDisplay && pDisplay.type === EDisplayTypes.TYPE_2D) {
                return pDisplay;
            }
            
            return null;
        }

        getDisplay(iDisplay?: uint, eType?: EDisplayTypes): IDisplay {
            return this.pDisplayList[iDisplay] || null;
        }

        //enable all display
        display(): bool {
            return false;
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