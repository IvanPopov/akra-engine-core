
module akra.util {
	export class ProgressBar {
		canvas: HTMLCanvasElement;
		context: CanvasRenderingContext2D;
		step: number = 5.;
		counterclockwise: bool = false;
		radius: number = 0;
		thickness: number = 20;
		total: number[] = [10, 5, 3];
		border: number = 10;
		lineWidth: number = 20;
		indent: number = 5;

		depth: number = 0;
		element: number = 0;


		get width(): number { return this.canvas.width; }
		get height(): number { return this.canvas.height; }

		constructor (iWidth: number = 256, iHeight: number = 256) {
			var pCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");

			pCanvas.width = iWidth;
			pCanvas.height = iHeight;

			this.canvas = pCanvas;
			this.context = pCanvas.getContext("2d");
			this.radius = Math.min(iWidth, iHeight) / 2. - this.thickness;
		}

		loaded(): void {
			if (this.element < this.total[this.depth]) {
				this.loadLevel();
				this.element ++;
			}
		}

		next(): void {
			if (this.depth < this.total.length) {
				this.element = 0;
				this.depth ++;
			}
		}

		private loadLevel(i: number = this.element, iDepth: number = this.depth): void {
			var fFrom: number = 360 / this.total[iDepth] * i + this.border / 2.;
			var fTo: number = 360 / this.total[iDepth] * (i + 1) - this.border / 2.;
			
			this.animate(fFrom, fTo, iDepth);
		}



		private animate(fFrom: number = 0, fTo: number = 360, iDepth: number = 0): void {
			var x: number = this.width / 2., 
				y: number = this.height / 2.;

			var pCtx: CanvasRenderingContext2D = this.context;

			var fCurrent: number = fFrom;
			var fRatio: number = ProgressBar.RADIAN_RATIO;

			var iTimer = setInterval(() => {
				
				var fNext: number = fCurrent + this.step;

				pCtx.beginPath();
				pCtx.arc(x, y, this.radius - iDepth * (this.lineWidth + this.indent), fCurrent * fRatio, fNext * fRatio, this.counterclockwise);
				pCtx.lineWidth = this.lineWidth;
				pCtx.lineCap = "butt";
				pCtx.strokeStyle = "#000000";
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

module akra {
	export var bar = new util.ProgressBar();
	document.body.appendChild(bar.canvas);
}