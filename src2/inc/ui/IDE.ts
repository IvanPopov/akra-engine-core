#include "ui/Component.ts"
#include "ui/scene/Tree.ts"
#include "ui/Inspector.ts"
#include "ui/ViewportProperties.ts"
#include "ui/ListenerEditor.ts"

#include "IUIIDE.ts"


module akra.ui {

	function getFuncBody(f: Function): string {
		var s = f.toString(); 
		var sCode = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"));
		if (sCode.match(/^\s*$/)) { sCode = ""; }
		return sCode;
	}

	function buildFuncByCodeWithSelfContext(sCode, self): Function {
		var f = new Function("self", sCode);
		var fnCallback = () => f(self);
		fnCallback.toString = (): string => "function (self) {" + sCode + "}";
		return fnCallback;
	}

	export class IDE extends Component implements IUIIDE {
		protected _fnMainScript: Function = () => {};

		protected _pEngine: IEngine = null;

		protected _pSceneTree: scene.Tree;
		protected _pInspector: Inspector;

		protected _pPreview: ViewportProperties;

		protected _pTabs: IUITabs;

		protected _pColladaDialog: IUIPopup = null;

		//---------
		protected _pKeymap: IKeyMap;


		//=======================================
		
		_apiEntry: any;

		inline get script(): Function {
			return this._fnMainScript;
		}

		inline set script(fn: Function) {
			this._fnMainScript = fn;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			//common setup

			akra.ide = this;

			this._pEngine = getUI(parent).getManager().getEngine();
			debug_assert(!isNull(this._pEngine), "Engine required!");
			
			this._pKeymap = controls.createKeymap(this.getCanvasElement());

			this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));

			this.template("IDE.tpl");

			//viewport setup
			
			var pViewportProperties: ViewportProperties = this._pPreview = <ViewportProperties>this.findEntity("Preview");

			//setup Node properties

			var pInspector: IUIComponent = this._pInspector = <Inspector>this.findEntity("Inspector");

			//setup Scene tree

			var pTree: scene.Tree = this._pSceneTree = <scene.Tree>this.findEntity("SceneTree");
			pTree.fromScene(this.getScene());

			//connect node properties to scene tree
			this.connect(pInspector, SIGNAL(nodeNameChanged), SLOT(_updateSceneNodeName));

			var pTabs: IUITabs = this._pTabs = <IUITabs>this.findEntity("WorkTabs");
		}

		protected setupApiEntry(): void {
			this._apiEntry = {
				engine: this.getEngine(),
				camera: this.getCamera(),
				viewport: this.getViewport(),
				canvas: this.getCanvas(),
				scene: this.getScene(),
				rsmgr: this.getResourceManager(),
				renderer: this.getEngine().getRenderer(),
				keymap: this.getKeymap()
			};
		}

		inline getEngine(): IEngine { return this._pEngine; }
		inline getCanvas(): ICanvas3d { return this.getEngine().getRenderer().getDefaultCanvas(); }
		inline getScene(): IScene3d { return this.getEngine().getScene(); }
		inline getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }
		inline getResourceManager(): IResourcePoolManager { return this.getEngine().getResourceManager(); }
		inline getViewport(): IViewport { return this._pPreview.viewport; }
		inline getCamera(): ICamera { return this.getViewport().getCamera(); }
		inline getKeymap(): IKeyMap { return this._pKeymap; }

		_updateSceneNodeName(pInspector: Inspector, pNode: ISceneNode): void {
			this._pSceneTree.sync(pNode);
		}

		_viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void {
			this._pPreview.setViewport(pViewport);	
			this.setupApiEntry();	

			this.created();
		}

		cmd(eCommand: ECMD, ...argv: any[]): bool {
			switch (eCommand) {
				case ECMD.SET_PREVIEW_RESOLUTION: 
					return this.setPreviewResolution(parseInt(argv[0]), parseInt(argv[1]));
				case ECMD.SET_PREVIEW_FULLSCREEN:
					return this.setFullscreen();
				case ECMD.INSPECT_SCENE_NODE:
					return this.inspectNode(argv[0]);
				case ECMD.EDIT_ANIMATION_CONTROLLER: 
					return this.editAnimationController(argv[0]);
				case ECMD.INSPECT_ANIMATION_NODE:
					return this.inspectAnimationNode(argv[0]);
				case ECMD.INSPECT_ANIMATION_CONTROLLER:
					return this.inspectAnimationController(argv[0]);
				case ECMD.CHANGE_AA:
					return this.changeAntiAliasing(<bool>argv[0]);
				case ECMD.LOAD_COLLADA:
					return this.loadColladaModel();
				case ECMD.EDIT_EVENT:
					return this.editEvent(<IEventProvider>argv[0], <string>argv[1]);
				case ECMD.EDIT_MAIN_SCRIPT:
					return this.editMainScript();
				case ECMD.CHANGE_CAMERA:
					return this.changeCamera(<ICamera>argv[0]);
			}

			return false;
		}

		protected changeCamera(pCamera: ICamera): bool {
			this.getViewport().setCamera(pCamera);
			return true;
		}

		protected setPreviewResolution(iWidth: uint, iHeight: uint): bool {
			this.getCanvas().resize(iWidth, iHeight);
			return true;
		}

		protected setFullscreen(): bool {
			this.getCanvas().setFullscreen(true);
			return true;
		}

		protected inspectNode(pNode: ISceneNode): bool {
			this._pInspector.inspectNode(pNode);
			return true;
		}

		protected inspectAnimationController(pController: IAnimationController): bool {
			this._pInspector.inspectAnimationController(pController);
			return true;
		}

		protected editAnimationController(pController: IAnimationController): bool {
			var sName: string = "controller-" + pController.getGuid();
			var iTab: int = this._pTabs.findTab(sName);
			
			if (iTab < 0) {
				var pControls: IUIAnimationControls = 
					<IUIAnimationControls>this._pTabs.createComponent("animation.Controls", {
						title: "Edit controller: " + pController.getGuid(), 
						name: sName
					});

				pControls.graph.capture(pController);
				iTab = this._pTabs.findTab(sName);
			}
		
			this._pTabs.select(iTab);

			return true;
		}

		protected inspectAnimationNode(pNode: IUIAnimationNode): bool {
			this._pInspector.inspectAnimationNode(pNode);
			return true;
		}

		protected changeAntiAliasing(bValue: bool): bool {
			(<render.DSViewport>this._pPreview.viewport).setFXAA(bValue);
			return true;
		}

		protected loadColladaModel(): bool {
			var pDlg: IUIPopup = this._pColladaDialog;

			if (isNull(this._pColladaDialog)) {
				pDlg = this._pColladaDialog = <IUIPopup>this.createComponent("Popup", {
					name: "load-collada-dlg",
					title: "Load collada",
					controls: "close",
					template: "custom.LoadColladaDlg.tpl"
				});

				pDlg.bind(SIGNAL(closed), () => {
					if (parseInt(pDlg.el.css("bottom")) == 0) {
						pDlg.el.animate({bottom: -pDlg.el.height()}, 350, "easeInCirc", () => { pDlg.hide() });
					}
					else {
						pDlg.hide();
					}
				});

				var pLoadBtn: IUIButton = <IUIButton>pDlg.findEntity("load");
				var $input: JQuery = pDlg.el.find("input[name=url]");
				var pRmgr: IResourcePoolManager = this.getResourceManager();
				var pScene: IScene3d = this.getScene();

				pLoadBtn.bind(SIGNAL(click), () => {
					var pModel: ICollada = <ICollada>pRmgr.loadModel($input.val());

					if (pModel.isResourceLoaded()) {
						var pModelRoot: IModelEntry = pModel.attachToScene(pScene);
					}
					
					pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
						var pModelRoot: IModelEntry = pModel.attachToScene(pScene);
					});

					pDlg.close();
				});
			}

			var iHeight: int = pDlg.el.height();

			pDlg.el.css('top', 'auto').css('left', 'auto').css({bottom: -iHeight, right: 10});
			pDlg.show();
			pDlg.el.animate({bottom: 0}, 350, "easeOutCirc");

			return true;
		}

		protected editMainScript(): bool {

			var sName: string = "main-script";
			var pListenerEditor: IUIListenerEditor;
			var iTab: int = this._pTabs.findTab(sName);
			var sCode: string = getFuncBody(this._fnMainScript);
			var self = this._apiEntry;
			var pIDE = this;

			if (iTab < 0) {
				pListenerEditor = <IUIListenerEditor>this._pTabs.createComponent("ListenerEditor", {
					title: "Project code", 
					name: sName,
				});

				pListenerEditor.bind(SIGNAL(bindEvent), (pEditor: IUIListenerEditor, sCode: string) => {
					pIDE.script = buildFuncByCodeWithSelfContext(sCode, self);
					(pIDE.script)();
				});

				iTab = pListenerEditor.index;
			}
			else {
				pListenerEditor = <IUIListenerEditor>this._pTabs.tab(iTab);
			}

			this._pTabs.select(iTab);
			
			pListenerEditor.editor.value = sCode;

			return true;
		}

		//предпологается, что мы редактируем любово листенера, и что, исполнитель команды сам укажет нам, 
		//какой номер у листенера, созданного им.
		protected editEvent(pTarget: IEventProvider, sEvent: string, iListener: int = 0, eType: EEventTypes = EEventTypes.BROADCAST): bool {
			var sName: string = "event-" + sEvent + pTarget.getGuid();
			var pListenerEditor: IUIListenerEditor;
			var iTab: int = this._pTabs.findTab(sName);
			var pEvtTable: IEventTable = pTarget.getEventTable();
			var pEventSlots: IEventSlot[] = pEvtTable.findBroadcastSignalMap(pTarget.getGuid(), sEvent);
			var pEventSlot: IEventSlot = null;
			var sCode: string = "";
			var self = this._apiEntry;

			for (var i = 0; i < pEventSlots.length; ++ i) {
				if (isDefAndNotNull(pEventSlots[i].listener)) {
					pEventSlot = pEventSlots[i];
					break;
				}	
			}

			if (!isDefAndNotNull(pEventSlot)) {
				pTarget.bind(sEvent, () => {});
				return this.editEvent(pTarget, sEvent);
			}
			// LOG(pEventSlots, pEventSlot);
			if (!isNull(pEventSlot.target)) {
				ERROR("modifications of target's connectics not allowed!");
			}

			if (!isNull(pEventSlot.listener)) {
				sCode = getFuncBody(pEventSlot.listener);
			}

			if (iTab < 0) {
				pListenerEditor = <IUIListenerEditor>this._pTabs.createComponent("ListenerEditor", {
						title: "Ev.: " + sEvent + "(obj.: " + pTarget.getGuid() + ")", 
						name: sName,
					});

				pListenerEditor.bind(SIGNAL(bindEvent), (pEditor: IUIListenerEditor, sCode: string) => {
					pEventSlot.listener = buildFuncByCodeWithSelfContext(sCode, self);
				});

				iTab = pListenerEditor.index;
			}
			else {
				pListenerEditor = <IUIListenerEditor>this._pTabs.tab(iTab);
			}

			this._pTabs.select(iTab);
			
			pListenerEditor.editor.value = sCode;

			return true;
		}

		BROADCAST(created, VOID);
	}

	register("IDE", IDE);
}