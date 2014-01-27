/// <reference path="../../idl/ICollada.ts" />
/// <reference path="../Component.ts" />

module akra.ui.animation {
	export class ColladaAnimation extends Component {
		protected _pCollada: ICollada = null;
		protected _iAnimation: uint = 0;
		protected _pNameLb: IUILabel;


		 get animation(): IColladaAnimation {
			return this._pCollada.getAnimation(this._iAnimation);
		}

		 get collada(): ICollada {
			return this._pCollada;
		}

		 get index(): uint {
			return this._iAnimation;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.COLLADA_ANIMATION);

			this.template("animation.ColladaAnimation.tpl");

			this._pNameLb = <IUILabel>this.findEntity("collada-animation-name");
			//this.connect(this._pNameLb, SIGNAL(changed), SLOT(_nameChanged));
			this._pNameLb.changed.connect(this, this._nameChanged);
		}

		setAnimation(pCollada: ICollada, iAnimation: int): void {
			this._pCollada = pCollada;
			this._pNameLb.text = this.animation.name || "unknown";
		}

		_nameChanged(pLb: IUILabel, sName: string): void {
			this.animation.name = sName;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-colladaanimation");

			this.setDraggable(true, {
				helper: "clone", 
				containment: "document",
				cursor: "crosshair",
				scroll: false
			});
		}
	}

	register("animation.ColladaAnimation", ColladaAnimation);
}

