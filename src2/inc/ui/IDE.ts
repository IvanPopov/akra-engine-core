#include "ui/Component.ts"
#include "ui/scene/Tree.ts"
#include "ui/Inspector.ts"
#include "ui/ViewportProperties.ts"

#include "IUIIDE.ts"

module akra.ui {
	export class IDE extends Component implements IUIIDE {
		protected _pEngine: IEngine = null;

		protected _pSceneTree: scene.Tree;
		protected _pInspector: Inspector;

		protected _pPreview: ViewportProperties;

		protected _pTabs: IUITabs;

		protected _pColladaDialog: IUIComponent = null;

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

			var pNodeProperties: IUIComponent = this._pInspector = <Inspector>this.findEntity("Inspector");

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

		_updateSceneNodeName(pInspector: Inspector, pNode: ISceneNode): void {
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
				case ECMD.INSPECT_SCENE_NODE:
					var pNode: ISceneNode = argv[0];
					this._pInspector.inspectNode(pNode);
					return true;
				case ECMD.EDIT_ANIMATION_CONTROLLER: 
					var iTab: int = this._pTabs.findTabByTitle("Edit controller");
					
					if (iTab < 0) {
						var pController: IAnimationController = argv[0];
						var pControls: IUIAnimationControls = 
							<IUIAnimationControls>this._pTabs.createComponent("AnimationControls", {title: "Edit controller"});
						pControls.graph.capture(pController);
					}
				
					this._pTabs.select(iTab);
					
					return true;
				case ECMD.INSPECT_ANIMATION_NODE:
					this._pInspector.inspectAnimationNode(argv[0]);
					break;
				case ECMD.CHANGE_AA:
					(<render.DSViewport>this._pPreview.viewport).setFXAA(<bool>argv[0]);
					return true;

				case ECMD.LOAD_COLLADA:
					this._pColladaDialog = this.createComponent("Popup", {title: "Load collada"});
					// this._pColladaDialog.el.offset({top: 500, left: 500});
					return false;
			}
			return true;
		}
	}

	register("IDE", IDE);
}