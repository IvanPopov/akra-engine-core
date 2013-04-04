#include "ui/Component.ts"

module akra.ui {
	export class IDE extends Component {
		protected _pEngine: IEngine = null;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			template(this, "IDE.tpl");

			this._pEngine = getUI(parent).getManager().getEngine();

			debug_assert(!isNull(this._pEngine), "Engine required!");

			var $stage: JQuery = this.el.find("#stage");

			$stage.append((<any>this.getCanvas())._pCanvas);
			this.getCanvas().resize(4/3 * 800, 800);

			this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));


			var pTree: IUITree = new Tree(this, {show: false});
			pTree.render(this.el.find("#tree"));
		}

		inline getEngine(): IEngine { return this._pEngine; }
		inline getCanvas(): ICanvas3d { return this.getEngine().getRenderer().getDefaultCanvas(); }


		_viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void {
			var $stage: JQuery = this.el.find("#stage"); 
			var pStats: IUIRenderTargetStats = <IUIRenderTargetStats>this.ui.createComponent("RenderTargetStats");

			pStats.target = pViewport.getTarget();
			pStats.el.css({position: "relative", top: "-800px"});
			pStats.render($stage);			
		}
	}

	register("IDE", IDE);
}