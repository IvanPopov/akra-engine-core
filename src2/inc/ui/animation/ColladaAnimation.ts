#ifndef COLLADAANIMATIONS_TS
#define COLLADAANIMATIONS_TS

#include "ICollada.ts"
#include "ui/Component.ts"

module akra.ui.animation {
	export class ColladaAnimation extends Component {
		protected _pCollada: ICollada = null;
		protected _iAnimation: uint = 0;
		protected _pNameLb: IUILabel;


		inline get animation(): IColladaAnimation {
			return this._pCollada.getAnimation(this._iAnimation);
		}

		inline get collada(): ICollada {
			return this._pCollada;
		}

		inline get index(): uint {
			return this._iAnimation;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.COLLADA_ANIMATION);

			this.template("animation.ColladaAnimation.tpl");

			this._pNameLb = <IUILabel>this.findEntity("collada-animation-name");
			this.connect(this._pNameLb, SIGNAL(changed), SLOT(_nameChanged));
		}

		setAnimation(pCollada: ICollada, iAnimation: int): void {
			this._pCollada = pCollada;
			this._pNameLb.text = this.animation.name || "unknown";
		}

		_nameChanged(pLb: IUILabel, sName: string): void {
			this.animation.name = sName;
		}

		rendered(): void {
			super.rendered();
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

#endif
