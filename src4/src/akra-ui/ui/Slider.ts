/// <referece path="Component.ts" />
/// <referece path="../idl/IUISlider.ts" />

module akra.ui {
	export class Slider extends Component implements IUISlider {

		updated: ISignal<{ (pSlider: IUISlider, fValue: float): void; }>;

		protected _fRange: float = 100.0;
		protected _fValue: float = 0.0;

		protected $progress: JQuery;
		protected $text: JQuery;

		getPin(): IUIComponent { return <IUIComponent>this.getChild(); }
		getValue(): float { return this._fValue * this._fRange; }
		getRange(): float { return this._fRange; }
		setRange(fValue: float): void { this._fRange = fValue; }
		getText(): string { return this.$text.text(); }
		setText(s: string): void { this.$text.text(s); }

		setValue(fValue: float): void {
			if (fValue == this._fValue) {
				return;
			}

			fValue = math.clamp(fValue / this._fRange, 0., 1.);

			var iElementOffset = this.$element.offset().left;

			var iPixelTotal = this.$element.width() - this.getPin().$element.width();

			var iPixelCurrent: int = iPixelTotal * fValue;
			var iPinOffset: int = iPixelCurrent + iElementOffset + 1;

			this.getPin().$element.offset({ left: iPinOffset });

			this._fValue = fValue;

			this.updated.emit(this.getValue());
		}

		constructor(parent, options?, eType: EUIComponents = EUIComponents.SLIDER) {
			super(parent, options, eType);

			this.getUI().createComponent("pin", { class: "component-pin" }).attachToParent(this);
			this.getElement().append("<div class=\"slider-text\"></div>");

			//this.$progress = this.$element.find(".slider-progress");
			this.$text = this.$element.find(".slider-text");

			this.getPin().setDraggable();
			// this.connect(this.getPin(), SIGNAL(move), SLOT(_updated));
			this.getPin().move.connect(this, this._updated);
		}

		protected setupSignals(): void {
			this.updated = this.updated || new Signal(<any>this);

			super.setupSignals();
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-slider");
		}



		_updated(pPin: IUIComponent, e: IUIEvent): void {
			var fValuePrev: float = this._fValue;
			var fValue: float;

			var iPinOffset: int = this.getPin().$element.offset().left;
			var iElementOffset: int = this.$element.offset().left;

			var iPixelTotal: int = this.$element.width() - this.getPin().$element.width();
			//FIXME: white offsets not equals????
			var iPixelCurrent: int = iPinOffset - iElementOffset - 1;

			fValue = this._fValue = math.clamp(iPixelCurrent / iPixelTotal, 0., 1.);

			if (fValue != fValuePrev) {
				this.updated.emit(this.getValue());
				// console.log("updated", this.value);
			}
		}

		_createdFrom($comp: JQuery): void {
			super._createdFrom($comp);

			var sRange: string = $comp.attr("range");

			if (isString(sRange)) {
				this.setRange(parseFloat(sRange));
			}

			var sValue: string = $comp.attr("value");

			if (isString(sValue)) {
				this.setValue(parseFloat(sValue));
			}
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (!isRecursive) {
				return '<slider' + (this.getName() ? " " + this.getName() : "") + '>';
			}

			return super.toString(isRecursive, iDepth);
		}

	}

	register("Slider", Slider);
}

