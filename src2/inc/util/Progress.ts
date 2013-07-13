#ifndef UTILPROGRESS_TS
#define UTILPROGRESS_TS


#include "IProgress.ts"

module akra.util {
    export class Progress implements IProgress {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        step: number = 5.;
        counterclockwise: bool = false;
        radius: number = 0;
        thickness: number = 20;
        total: number[] = [10, 5, 3];
        border: number = 2;
        lineWidth: number = 8;
        indent: number = 3;
        color: string = "#000000";

        depth: number = 0;
        element: number = 0;


        fontColor: string = "black";
        fontSize: number = 30;
        size: number = 0;


        get width(): number { return this.canvas.width; }
        get height(): number { return this.canvas.height; }

        constructor (iSize: number = 200, iFontSize: number = 30) {
            var pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");

            this.fontSize = iFontSize;
            this.size = iSize;

            pCanvas.width = iSize + 120;
            pCanvas.height = iSize;

            this.canvas = pCanvas;
            this.context = pCanvas.getContext("2d");
            this.radius = iSize / 2. - this.thickness;
        }

        loaded(): void {
            if (this.element < this.total[this.depth]) {
                this.draw();
                this.element ++;
            }
        }

        next(): void {
            if (this.depth < this.total.length) {
                this.element = 0;
                this.depth ++;
            }
        }

        reset(): void {
            this.depth = 0;
            this.element = 0;
            this.context.clearRect (0, 0, this.width, this.height);
        }

        draw(): void {
            this.loadLevel();
            this.updateInfo();
        }

        printText(sText: string): void {
            var pCtx: CanvasRenderingContext2D = this.context;
            var x: number = this.size-2;
            var y: number = this.size - this.fontSize - 2;

            pCtx.clearRect(x, 0, this.width, this.height);

            pCtx.fillStyle = this.fontColor;
            pCtx.font = "bold " + this.fontSize + "px Consolas";

            pCtx.fillText(sText, x, y);
        }

        private updateInfo(): void {
            var pCtx: CanvasRenderingContext2D = this.context;
            var x: number = this.size;
            var y: number = this.size - this.fontSize - 2;

            var n = 0;
            var m = 0;

            for (var i = 0; i < this.total.length; ++ i) {
                if (i < this.depth) {
                    m += this.total[i];
                }

                n += this.total[i];
            }

            m += this.element;

            pCtx.clearRect(x, 0, this.width, this.height);

            pCtx.fillStyle = this.fontColor;
            pCtx.font = "bold " + this.fontSize + "px Consolas";

            pCtx.fillText((/*this.depth / this.total.length*/(m/n) * 100).toFixed(1) + "%", x, y);
        }

        private loadLevel(i: number = this.element, iDepth: number = this.depth): void {
            var fFrom: number = 360 / this.total[iDepth] * i + this.border / 2.;
            var fTo: number = 360 / this.total[iDepth] * (i + 1) - this.border / 2.;

            this.animate(fFrom, fTo, iDepth);
        }



        private animate(fFrom: number = 0, fTo: number = 360, iDepth: number = 0): void {
            var x: number = this.height / 2., 
                y: number = this.height / 2.;

            var pCtx: CanvasRenderingContext2D = this.context;

            var fCurrent: number = fFrom;
            var fRatio: number = Progress.RADIAN_RATIO;

            var iTimer = setInterval(() => {

                var fNext: number = fCurrent + this.step;

                pCtx.beginPath();
                pCtx.arc(x, y, Math.max(0, this.radius - iDepth * (this.lineWidth + this.indent)), fCurrent * fRatio, fNext * fRatio, this.counterclockwise);
                pCtx.lineWidth = this.lineWidth;
                pCtx.lineCap = "butt";
                pCtx.strokeStyle = this.color;
                pCtx.stroke();

                fCurrent = fNext;

                if (fCurrent >= fTo) {
                    clearInterval(iTimer);
                }

            }, 5);


        }

        static RADIAN_RATIO: number = Math.PI / 180.0;

        valueOf(): HTMLCanvasElement {
            return this.canvas;
        }
    }
}

// module akra {
//     export var Progress = util.Progress;
// }

// module akra {
//  export var bar = new util.Progress();
//  document.body.appendChild(bar.canvas);
// }

#endif
