#ifndef UIANIMATIONNODEPROPERTIES_TS
#define UIANIMATIONNODEPROPERTIES_TS

#include "ui/Component.ts"
#include "IUILabel.ts"

module akra.ui.animation {
	export class NodeProperties extends Component {
		protected _pNameLb: IUILabel;
		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ui/templates/animation.NodeProperties.tpl");

			this._pNameLb = <IUILabel>this.findEntity("animation-name");
		}

		setNode(pNode: IUIAnimationNode): void {
			this._pNameLb.text = pNode.animation.name;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-animationnodeproperties");
		}
	}

	register("animation.NodeProperties", NodeProperties);
}

#endif
