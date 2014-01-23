/// <referece path="../idl/IUISlider.ts" />
/// <referece path="Component.ts" />

module akra.ui {
	export class Slider extends Component implements IUISlider {

		updated: ISignal<{ (pSlider: IUISlider, fValue: float): void; }>;

		protected _fRange: float = 100.0;
		protected _fValue: float = 0.0;

		protected $progress: JQuery;
		protected $text: JQuery;

		get pin(): IUIComponent { return <IUIComponent>this.child; }
		get value(): float { return this._fValue * this._fRange; }
		get range(): float { return this._fRange; }
		set range(fValue: float) { this._fRange = fValue; }
		set text(s: string) {
			this.$text.text(s);
		}

		get text(): string {
			return this.$text.text();
		}

		set value(fValue: float) {
			if (fValue == this._fValue) {
				return;
			}

			fValue = math.clamp(fValue / this._fRange, 0., 1.);

			var iElementOffset = this.$element.offset().left;

			var iPixelTotal = this.$element.width() - this.pin.$element.width();

			var iPixelCurrent: int = iPixelTotal * fValue;
			var iPinOffset: int = iPixelCurrent + iElementOffset + 1;

			this.pin.$element.offset({ left: iPinOffset });

			this._fValue = fValue;

			this.updated.emit(this.value);
		}

		constructor(parent, options?, eType: EUIComponents = EUIComponents.SLIDER) {
			super(parent, options, eType);

			this.ui.createComponent("pin", { class: "component-pin" }).attachToParent(this);
			this.el.append("<div class=\"slider-text\"></div>");

			//this.$progress = this.$element.find(".slider-progress");
			this.$text = this.$element.find(".slider-text");

			this.pin.setDraggable();
			// this.connect(this.pin, SIGNAL(move), SLOT(_updated));
			this.pin.move.connect(this, this._updated);
		}

		protected setupSignals(): void {
			this.updated = this.updated || new Signal(<any>this);

			super.setupSignals();
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-slider");
		}



		_updated(pPin: IUIComponent, e: IUIEvent): void {
			var fValuePrev: float = this._fValue;
			var fValue: float;

			var iPinOffset: int = this.pin.$element.offset().left;
			var iElementOffset: int = this.$element.offset().left;

			var iPixelTotal: int = this.$element.width() - this.pin.$element.width();
			//FIXME: white offsets not equals????
			var iPixelCurrent: int = iPinOffset - iElementOffset - 1;

			fValue = this._fValue = math.clamp(iPixelCurrent / iPixelTotal, 0., 1.);

			if (fValue != fValuePrev) {
				this.updated.emit(this.value);
				// console.log("updated", this.value);
			}
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sRange: string = $comp.attr("range");

			if (isString(sRange)) {
				this.range = parseFloat(sRange);
			}

			var sValue: string = $comp.attr("value");

			if (isString(sValue)) {
				this.value = parseFloat(sValue);
			}
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (!isRecursive) {
				return '<slider' + (this.name ? " " + this.name : "") + '>';
			}

			return super.toString(isRecursive, iDepth);
		}

	}

	register("Slider", Slider);
}

