#include "ui/Component.ts"
#include "ui/scene/Tree.ts"
#include "ui/scene/NodeProperties.ts"
#include "ui/ViewportProperties.ts"

#include "IUIIDE.ts"

module akra.ui {
	export class IDE extends Component implements IUIIDE {
		protected _pEngine: IEngine = null;

		protected _pSceneTree: scene.Tree;
		protected _pSceneNodeProperties: scene.NodeProperties;

		protected _pPreview: ViewportProperties;

		protected _pTabs: IUITabs;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			//common setup

			akra.ide = this;

			this._pEngine = getUI(parent).getManager().getEngine();
			debug_assert(!isNull(this._pEngine), "Engine required!");
			this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));

			this.template("ui/templates/IDE.tpl");

			//viewport setup
			
			var pViewportProperties: ViewportProperties = this._pPreview = <ViewportProperties>this.findEntity("Preview");

			//setup Node properties

			var pNodeProperties: IUIComponent = this._pSceneNodeProperties = <scene.NodeProperties>this.findEntity("NodeProperties");

			//setup Scene tree

			var pTree: scene.Tree = this._pSceneTree = <scene.Tree>this.findEntity("SceneTree");
			pTree.fromScene(this.getScene());

			//connect node properties to scene tree
			this.connect(pNodeProperties, SIGNAL(nodeNameChanged), SLOT(_updateSceneNodeName));

			var pTabs: IUITabs = this._pTabs = <IUITabs>this.findEntity("WorkTabs");
		}

		inline getEngine(): IEngine { return this._pEngine; }
		inline getCanvas(): ICanvas3d { return this.getEngine().getRenderer().getDefaultCanvas(); }
		inline getScene(): IScene3d { return this.getEngine().getScene(); }
		inline getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }

		_updateSceneNodeName(pProperties: scene.NodeProperties, pNode: ISceneNode): void {
			this._pSceneTree.sync(pNode);
		}

		_viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void {
			this._pPreview.setViewport(pViewport);		
		}

		cmd(eCommand: ECMD, ...argv: any[]): bool {
			switch (eCommand) {
				case ECMD.SET_PREVIEW_RESOLUTION: 
					LOG("preview resolution is", argv[0] + "x" +  argv[1]);
					var iWidth: int = parseInt(argv[0]);
					var iHeight: int = parseInt(argv[1]);
					this.getCanvas().resize(iWidth, iHeight);
					return true;
				case ECMD.SET_PREVIEW_FULLSCREEN:
					this.getCanvas().setFullscreen(true);
					return true;
				case ECMD.SELECT_SCENE_NODE:
					var pNode: ISceneNode = argv[0];
					this._pSceneNodeProperties.setNode(pNode);
					return true;
				case ECMD.EDIT_ANIMATION_CONTROLLER: 
					var iTab: int = this._pTabs.findTabByTitle("Edit controller");
					if (iTab < 0) {
						var pController: IAnimationController = argv[0];
						var pControls: IUIAnimationControls = 
							<IUIAnimationControls>this._pTabs.createComponent("AnimationControls", {title: "Edit controller"});
						pControls.graph.capture(pController);
					}
					else {
						this._pTabs.select(iTab);
					}
					return true;
				case ECMD.CHANGE_AA:
					(<render.DSViewport>this._pPreview.viewport).setFXAA(<bool>argv[0]);
					return true;
			}
			return true;
		}
	}

	register("IDE", IDE);
}