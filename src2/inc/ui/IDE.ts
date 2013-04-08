#include "ui/Component.ts"
#include "ui/scene/Tree.ts"

#include "IUIIDE.ts"

module akra.ui {


	export class IDE extends Component implements IUIIDE {
		protected _pEngine: IEngine = null;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			template(this, "ui/templates/IDE.tpl");

			this._pEngine = getUI(parent).getManager().getEngine();

			debug_assert(!isNull(this._pEngine), "Engine required!");

			var $preview: JQuery = this.el.find("#preview-area");

			$preview.append(this.getCanvasElement());
			this.getCanvas().resize(640, 480);

			this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));


			var pTree: scene.Tree = new scene.Tree(this, {show: false});
			pTree.render(this.el.find("#tree"));
			pTree.fromScene(this.getScene());

			akra.ide = this;
		}

		inline getEngine(): IEngine { return this._pEngine; }
		inline getCanvas(): ICanvas3d { return this.getEngine().getRenderer().getDefaultCanvas(); }
		inline getScene(): IScene3d { return this.getEngine().getScene(); }
		inline getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }

		_viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void {
			var $preview: JQuery = this.el.find("#preview-area"); 
			var pStats: IUIRenderTargetStats = <IUIRenderTargetStats>this.ui.createComponent("RenderTargetStats");

			pStats.target = pViewport.getTarget();
			//pStats.el.css({position: "relative", top: -$preview.height()});
			pStats.render($preview);			
		}

		cmd(eCommand: ECMD, ...argv: any[]): bool {
			switch (eCommand) {
				case ECMD.SET_PREVIEW_RESOLUTION: 
					var iWidth: int = parseInt(argv[0]);
					var iHeight: int = parseInt(argv[1]);
					this.getCanvas().resize(iWidth, iHeight);
					return true;
				case ECMD.SET_PREVIEW_FULLSCREEN:
					this.getCanvas().setFullscreen(true);
					return true;
			}
			return true;
		}
	}

	register("IDE", IDE);
}