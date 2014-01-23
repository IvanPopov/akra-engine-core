/// <reference path="../idl/IUILabel.ts" />
/// <reference path="../idl/IUIVector.ts" />
/// <reference path="Component.ts" />

module akra.ui {
	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;


	function prettifyNumber(x: float): string {
		if (x === math.floor(x)) {
			return "" + x + ".";
		}

		return <string><any>x.toFixed(2);
	}

	class ChangedSignal extends Signal<{ (pNode: IUIComponent, e: IUIEvent): void; }, IUIComponent> {
		emit(e?: IUIEvent, sValue?: string): void {
			var pVector: Vector = <Vector>this.getSender();

			if (pVector.$lock.prop("checked")) {
				pVector.x.text = pVector.y.text = pVector.z.text = pVector.w.text = sValue;
			}

			super.emit(e);
		}
	}

	export class Vector extends Component implements IUIVector {
		changed: ISignal<{ (pVector: IUIVector): void; }>;

		x: IUILabel;
		y: IUILabel;
		z: IUILabel;
		w: IUILabel;

		totalComponents: uint = 4;

		protected _iFixed: uint = 2;
		protected _bEditable: boolean = false;
		protected $lock: JQuery;

		 get value(): any {
			switch(this.totalComponents) {
				case 2: return this.toVec2();
				case 3: return this.toVec3();
				case 4: return this.toVec4();
			}

			return null;
		}

		constructor (ui, options?, eType: EUIComponents = EUIComponents.VECTOR) {
			super(ui, options, eType);

			this.template("Vector.tpl");

			this.x = <IUILabel>this.findEntity('x');
			this.y = <IUILabel>this.findEntity('y');
			this.z = <IUILabel>this.findEntity('z');
			this.w = <IUILabel>this.findEntity('w');

			//this.connect(this.x, SIGNAL(changed), SLOT(changed));
			//this.connect(this.y, SIGNAL(changed), SLOT(changed));
			//this.connect(this.z, SIGNAL(changed), SLOT(changed));
			//this.connect(this.w, SIGNAL(changed), SLOT(changed));

			this.x.changed.connect(this.changed);
			this.y.changed.connect(this.changed);
			this.z.changed.connect(this.changed);
			this.w.changed.connect(this.changed);

			this.$lock = this.el.find("input[type=checkbox]:first");


			this.setVec4(Vec4.temp(0.));
		}

		protected setupSignals(): void {
			this.changed = this.changed || new ChangedSignal(this);
			super.setupSignals();
		}

		_createdFrom($comp: JQuery): void {
			var bValue: boolean = isDefAndNotNull($comp.attr("editable")) || false;
			var sPostfix: string = $comp.attr("postfix") || null;

			this.x.postfix = sPostfix;
			this.y.postfix = sPostfix;
			this.z.postfix = sPostfix;
			this.w.postfix = sPostfix;

			this.editable(bValue);
		}

		editable(bValue: boolean = true): void {
			if (bValue) {
				this.el.addClass("editable");
				this.$lock.show();
			}
			else {
				this.el.removeClass("editable");
				this.$lock.hide();
			}
			
			this.x.editable(bValue);
			this.y.editable(bValue);
			this.z.editable(bValue);
			this.w.editable(bValue);

			this._bEditable = bValue;
		}

		 isEditable(): boolean {
			return this._bEditable;
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
					$(pSpanList[2]).css("display", "-block");
					break;
				case 4:
					$(pSpanList[3]).css("display", "-block");
					$(pSpanList[2]).css("display", "-block");
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

		setColor(c: IColorValue): void {
			this.x.text = prettifyNumber(c.r);
			this.y.text = prettifyNumber(c.g);
			this.z.text = prettifyNumber(c.b);
			this.w.text = prettifyNumber(c.a);
			this.useComponents(4);
		}

		toVec2(): IVec2 {
			return Vec2.temp(
					parseFloat(this.x.text), 
					parseFloat(this.y.text));
		}

		toVec3(): IVec3 {
			return Vec3.temp(
					parseFloat(this.x.text), 
					parseFloat(this.y.text), 
					parseFloat(this.z.text));
		}

		toVec4(): IVec4 {
			return Vec4.temp(
					parseFloat(this.x.text), 
					parseFloat(this.y.text), 
					parseFloat(this.z.text), 
					parseFloat(this.w.text));
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-vector");
		}
	}

	register("Vector", Vector);
}
