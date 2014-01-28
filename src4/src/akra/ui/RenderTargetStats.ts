/// <reference path="../../../build/akra.d.ts" />


/// <reference path="../idl/IUIRenderTargetStats.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	export class RenderTargetStats extends Component implements IUIRenderTargetStats {
		protected _pInfoElement: HTMLDivElement;
		protected _pValues: uint[];
		protected _pRenderTarget: IRenderTarget = null;
		protected _pTicks: HTMLSpanElement[];
		protected _pUpdateInterval: int = -1;

		getInfo(): HTMLDivElement { return this._pInfoElement; }
		getTarget(): IRenderTarget { return this._pRenderTarget; }

		setTarget(pRenderTarget: IRenderTarget) {
			if (!isNull(this._pRenderTarget)) {
				//this.disconnect(this._pRenderTarget, SIGNAL(postUpdate), SLOT(updateStats));
				clearInterval(this._pUpdateInterval);
			}

			//this.connect(pRenderTarget, SIGNAL(postUpdate), SLOT(updateStats));
			this._pRenderTarget = pRenderTarget;
			this._pUpdateInterval = setInterval(() => {
				this.updateStats();
			}, 1000);
		}

		constructor(ui, options?, pRenderTarget?: IRenderTarget) {
			super(ui, options, EUIComponents.VIEWPORT_STATS,
				$("<div class=\"component-fps\" ><div class=\"info\"></div><div class=\"graph\"></div></div>"));

			var $graph: JQuery = this.getElement().find(".graph");
			var pInfo: HTMLDivElement = this.getElement().find(".info").get()[0];
			var pTicks: HTMLSpanElement[] = [];
			var pValues: uint[] = [];

			//FIXME: write float adaptive values
			var iTotal: int = 100;

			for (var i: int = 0; i < iTotal; ++i) {
				var $tick: JQuery = $("<span class=\"tick\"/>");
				$graph.append($tick);

				pTicks.push($tick.get()[0]);
				pValues.push(0);
			}

			this._pInfoElement = pInfo;
			this._pValues = pValues;
			this._pTicks = pTicks;

			if (isDefAndNotNull(pRenderTarget)) {
				this.setTarget(pRenderTarget);
			}
		}

		private updateStats(): void {
			var pTarget: IRenderTarget = this.getTarget();
			var pStat: IFrameStats = pTarget.getStatistics();
			var fFPS: float = pStat.fps.last;
			var v: uint[] = this._pValues;
			var iTotal: int = v.length;
			var iMaxHeight: int = 27;
			var sFps: string = fFPS.toFixed(2);

			for (var i: int = 0, n: uint = iTotal - 1; i < n; ++i) {
				v[i] = v[i + 1];
			}

			v[n] = fFPS;

			this.getInfo().textContent = "FPS: " + ((v[n] < 100 ? (v[n] < 10 ? "  " + sFps : " " + sFps) : sFps));

			var max: int = math.max.apply(math, v);
			var pTicks: HTMLSpanElement[] = this._pTicks;

			for (var i: int = 0; i < iTotal; ++i) {
				pTicks[i].style.height = math.floor(v[i] / max * iMaxHeight) + "px";

				var fColor: float = math.min(v[i], 60.) / 60.;

				pTicks[i].style.backgroundColor = "rgb(" + (math.floor((1 - fColor) * 125) + 125) + ", " + (math.floor(fColor * 125) + 125) + ", 0)";
			}
		}

		protected finalizeRender(): void {
			this.getElement().addClass("component-fps");
		}
	}

	register("RenderTargetStats", RenderTargetStats);
}

