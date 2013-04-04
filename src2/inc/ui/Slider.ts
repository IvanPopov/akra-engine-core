#ifndef UISLIDER_TS
#define UISLIDER_TS

#include "IUISlider.ts"
#include "Component.ts"

module akra.ui {
	export class Slider extends Component implements IUISlider {
		protected _fRange: float = 100.0;
		protected _fValue: float = 0.0;

		protected $progress: JQuery;
		protected $text: JQuery;

		inline get pin(): IUIComponent { return <IUIComponent>this.child; }
		inline get value(): float { return this._fValue * this._fRange; }
		inline get range(): float { return this._fRange; }
		inline set range(fValue: float) { this._fRange = fValue; }
		
		set value(fValue: float) {
			fValue = math.clamp(fValue / this._fRange, 0., 1.);

			var iElementOffset = this.$element.offset().left;

			var iPixelTotal = this.$element.width() - this.pin.$element.width();

			var iPixelCurrent: int = iPixelTotal * fValue;
			var iPinOffset: int = iPixelCurrent + iElementOffset + 1;

			this.pin.$element.offset({left: iPinOffset});

			this._fValue = fValue;
		}

		constructor (parent, options?, eType: EUIComponents = EUIComponents.SLIDER) {
			super(parent, options, eType);

			this.ui.createComponent("pin", {class: "component-pin"}).attachToParent(this);

			//this.$progress = this.$element.find(".slider-progress");
			//this.$text = this.$element.find(".slider-text");

			this.pin.setDraggable();
			this.connect(this.pin, SIGNAL(move), SLOT(_updated));
		}

		rendered(): void {
			super.rendered();
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
				this.updated(this.value);
				// console.log("updated", this.value);
			}
		}

#ifdef DEBUG
		toString(isRecursive: bool = false, iDepth: int = 0): string {
			if (!isRecursive) {
		        return '<slider' + (this.name? " " + this.name: "") + '>';
		    }

		    return super.toString(isRecursive, iDepth);
		}
#endif

		BROADCAST(updated, CALL(value));
	}

	register("Slider", Slider);
}

#endif
