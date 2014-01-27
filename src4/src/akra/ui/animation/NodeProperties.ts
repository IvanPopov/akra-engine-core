/// <reference path="../../IDL/IUILabel.ts" />

/// <reference path="../Component.ts" />

module akra.ui.animation {
	export class NodeProperties extends Component {
		protected _pNameLb: IUILabel;
		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("animation.NodeProperties.tpl");

			this._pNameLb = <IUILabel>this.findEntity("animation-name");
		}

		setNode(pNode: IUIAnimationNode): void {
			this._pNameLb.text = pNode.animation.name;
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.el.addClass("component-animationnodeproperties");
		}
	}

	register("animation.NodeProperties", NodeProperties);
}
