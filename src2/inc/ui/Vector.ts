#ifndef UIVECTOR_TS
#define UIVECTOR_TS

#include "IUILabel.ts"
#include "IUIVector.ts"
#include "Component.ts"

module akra.ui {
	function prettifyNumber(x: float): string {
		if (x === math.floor(x)) {
			return "" + x + ".";
		}

		return <string><any>x.toFixed(2);
	}

	export class Vector extends Component implements IUIVector {
		x: IUILabel;
		y: IUILabel;
		z: IUILabel;
		w: IUILabel;

		totalComponents: uint = 4;

		protected _iFixed: uint = 2;
		protected _bEditable: bool = false;

		inline get value(): any {
			switch(this.totalComponents) {
				case 2: return this.toVec2();
				case 3: return this.toVec3();
				case 4: return this.toVec4();
			}

			return null;
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.VECTOR) {
			super(ui, options, eType);

			this.template("ui/templates/Vector.tpl");

			this.x = <IUILabel>this.findEntity('x');
			this.y = <IUILabel>this.findEntity('y');
			this.z = <IUILabel>this.findEntity('z');
			this.w = <IUILabel>this.findEntity('w');

			this.connect(this.x, SIGNAL(changed), SLOT(changed));
			this.connect(this.y, SIGNAL(changed), SLOT(changed));
			this.connect(this.z, SIGNAL(changed), SLOT(changed));
			this.connect(this.w, SIGNAL(changed), SLOT(changed));

			this.setVec4(vec4(0.));
		}

		_createdFrom($comp: JQuery): void {
			var bValue: bool = $comp.attr("editable") || false;
			var sPostfix: string = $comp.attr("postfix") || null;

			this.x.postfix = sPostfix;
			this.y.postfix = sPostfix;
			this.z.postfix = sPostfix;
			this.w.postfix = sPostfix;

			this.editable(bValue);
		}

		editable(bValue: bool = true): void {
			if (bValue) {
				this.el.addClass("editable");
			}
			else {
				this.el.removeClass("editable");
			}
			
			this.x.editable(bValue);
			this.y.editable(bValue);
			this.z.editable(bValue);
			this.w.editable(bValue);

			this._bEditable = bValue;
		}

		inline isEditable(): bool {
			return this._bEditable;
		}

		changed(): void {
			EMIT_BROADCAST(changed, _CALL(this.value));
		}

		protected useComponents(n: uint): void {
			if (n === this.totalComponents) {
				return;
			}
			var pSpanList: JQuery = this.el.find(">span");

			switch (n) {
				case 2:
					$(pSpanList[3]).css("display", "none");
					$(pSpanList[2]).css("display", "none");
					break;
				case 3: 
					$(pSpanList[3]).css("display", "none");
					$(pSpanList[2]).css("display", "inline-block");
					break;
				case 4:
					$(pSpanList[3]).css("display", "inline-block");
					$(pSpanList[2]).css("display", "inline-block");
			}

			this.totalComponents = n;
		}

		setVec2(v: IVec2): void {
			var n: uint = this._iFixed;
			this.x.text = prettifyNumber(v.x);
			this.y.text = prettifyNumber(v.y);

			this.useComponents(2);
		}

		setVec3(v: IVec3): void {
			var n: uint = this._iFixed;
			this.x.text = prettifyNumber(v.x);
			this.y.text = prettifyNumber(v.y);
			this.z.text = prettifyNumber(v.z);

			this.useComponents(3);
		}

		setVec4(v: IVec4): void {
			var n: uint = this._iFixed;
			this.x.text = prettifyNumber(v.x);
			this.y.text = prettifyNumber(v.y);
			this.z.text = prettifyNumber(v.z);
			this.w.text = prettifyNumber(v.w);

			this.useComponents(4);
		}

		toVec2(): IVec2 {
			return vec2(
					parseFloat(this.x.text), 
					parseFloat(this.y.text));
		}

		toVec3(): IVec3 {
			return vec3(
					parseFloat(this.x.text), 
					parseFloat(this.y.text), 
					parseFloat(this.z.text));
		}

		toVec4(): IVec4 {
			return vec4(
					parseFloat(this.x.text), 
					parseFloat(this.y.text), 
					parseFloat(this.z.text), 
					parseFloat(this.w.text));
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-vector");
		}
	}

	register("Vector", Vector);
}

#endif
