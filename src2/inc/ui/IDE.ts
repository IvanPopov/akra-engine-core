#include "ui/Component.ts"
#include "ui/scene/Tree.ts"
#include "ui/Inspector.ts"
#include "ui/ViewportProperties.ts"
#include "ui/ListenerEditor.ts"

#include "IUIIDE.ts"
#include "IRID.ts"

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

	export enum EEditModes {
		NONE,
		PICK,
		MOVE,
		ROTATE,
		SCALE
	}

	export class IDE extends Component implements IUIIDE {
		protected _fnMainScript: Function = () => {};

		protected _pEngine: IEngine = null;

		protected _pSceneTree: scene.SceneTree;
		protected _pInspector: Inspector;
		protected _pPreview: ViewportProperties;
		protected _pTabs: IUITabs;
		protected _pColladaDialog: IUIPopup = null;
		protected _p3DControls: IUICheckboxList;


		//picking
		protected _pSelectedObject: IRIDPair = {object: null, renderable: null};

		//editing
		protected _eEditMode: EEditModes = EEditModes.NONE;
		// protected _pModelBasis: ISceneModel;
		protected _pModelBasisTrans: IModelEntry;


		//=======================================
		
		_apiEntry: any;

		inline get script(): Function {
			return this._fnMainScript;
		}

		inline set script(fn: Function) {
			this._fnMainScript = fn;
		}

		//-===============================
		inline get selectedObject(): ISceneObject {
			return this._pSelectedObject.object;
		}

		inline get selectedRenderable(): IRenderableObject {
			return this._pSelectedObject.renderable;
		}

		inline get editMode(): EEditModes {
			return this._eEditMode;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			//common setup

			akra.ide = this;

			this._pEngine = getUI(parent).getManager().getEngine();
			debug_assert(!isNull(this._pEngine), "Engine required!");

			this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));

			this.template("IDE.tpl");

			//viewport setup
			
			var pViewportProperties: ViewportProperties = this._pPreview = <ViewportProperties>this.findEntity("Preview");

			//setup Node properties

			var pInspector: IUIComponent = this._pInspector = <Inspector>this.findEntity("Inspector");

			//setup Scene tree

			var pTree: scene.SceneTree = this._pSceneTree = <scene.SceneTree>this.findEntity("SceneTree");
			pTree.fromScene(this.getScene());

			//setup 3d controls
			var p3DControls: IUICheckboxList = this._p3DControls = <IUICheckboxList>this.findEntity("3d-controls");

			this.connect(<IUICheckbox>p3DControls.findEntity("pick"), SIGNAL(changed), SLOT(_enablePickMode));
			this.connect(<IUICheckbox>p3DControls.findEntity("translate"), SIGNAL(changed), SLOT(_enableTranslateMode));
			this.connect(<IUICheckbox>p3DControls.findEntity("rotate"), SIGNAL(changed), SLOT(_enableRotateMode));
			this.connect(<IUICheckbox>p3DControls.findEntity("scale-control"), SIGNAL(changed), SLOT(_enableScaleMode));

			//connect node properties to scene tree
			this.connect(pInspector, SIGNAL(nodeNameChanged), SLOT(_updateSceneNodeName));

			var pTabs: IUITabs = this._pTabs = <IUITabs>this.findEntity("WorkTabs");
			this.setupKeyControls();

			//create mode basis
			var pScene: IScene3d = this.getScene();
			// var pBasis: ISceneModel = util.basis(pScene);

			// pBasis.name = ".model-basis";
			// pBasis.visible = false;
			// pBasis.setInheritance(ENodeInheritance.ROTPOSITION);

			// this._pModelBasis = pBasis;

			var pBasisTranslation: ICollada = <ICollada>this.getResourceManager().colladaPool.loadResource(DATA + "/models/basis_translation.DAE");

			pBasisTranslation.bind(SIGNAL(loaded), (pModel: ICollada): void => {
				var pModelRoot: IModelEntry = pModel.attachToScene(pScene);
				pModelRoot.attachToParent(pScene.getRootNode());
				this._pModelBasisTrans = pModelRoot;
				this._pModelBasisTrans.setInheritance(ENodeInheritance.ALL);
				// pModelRoot.visible = false;
			});
		}

		private setupKeyControls(): void {
			
		}

		_enablePickMode(pCb: IUICheckbox, bValue: bool): void {
			this._eEditMode = bValue? EEditModes.PICK: EEditModes.NONE;
			this.updateEditting();
		}

		_enableTranslateMode(pCb: IUICheckbox, bValue: bool): void {
			this._eEditMode = bValue? EEditModes.MOVE: EEditModes.NONE;
			this.updateEditting();
		}

		_enableRotateMode(pCb: IUICheckbox, bValue: bool): void {
			this._eEditMode = bValue? EEditModes.ROTATE: EEditModes.NONE;
			this.updateEditting();
		}

		_enableScaleMode(pCb: IUICheckbox, bValue: bool): void {
			this._eEditMode = bValue? EEditModes.SCALE: EEditModes.NONE;
			this.updateEditting();
		}


		private setupObjectPicking(): void {
			// var pSearchCam: ICamera;
			
			// pSearchCam = this.getScene().createCamera(".search-cam");
			// pSearchCam.setOrthoParams(0.1, 0.1, 0.01, 0.1);
			// pSearchCam.update();

			// pSearchCam.attachToParent(this.getScene().getRootNode());

			// var pResMgr: IResourcePoolManager = this.getResourceManager();
			// var pColorTex: ITexture = <ITexture>pResMgr.texturePool.createResource(".texture_for_color_picking");
			// var pColorTarget: IRenderTarget;
			// var pDepthTex: ITexture;

			// pColorTex.create(640, 480, 1, null, ETextureFlags.RENDERTARGET, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.BYTE_RGB);

			// pColorTarget = pColorTex.getBuffer().getRenderTarget();
			// pColorTarget.setAutoUpdated(false);

			// pDepthTex = pResMgr.createTexture(".texture_for_color_picking_depth");
			// pDepthTex.create(640, 480, 1, null, 0, 0, 0, ETextureTypes.TEXTURE_2D, EPixelFormats.DEPTH32);

			// pColorTarget.attachDepthTexture(pDepthTex);

			// var pViewport: IViewport = pColorTarget.addViewport(this.getCamera()pSearchCam, EViewportTypes.COLORVIEWPORT);
			// pViewport.setAutoUpdated(false);

			// this._pColorViewport = pViewport;
			// this._pSearchCam = pSearchCam;
			// this._pColorTexture = pColorTex;
			var pViewport: IViewport = this.getViewport();
		}

		_sceneUpdate(pScene: IScene3d): void {
			
		}


		protected setupApiEntry(): void {
			this._apiEntry = {
				engine: this.getEngine(),
				camera: this.getCamera(),
				viewport: this.getViewport(),
				canvas: this.getCanvas(),
				scene: this.getScene(),
				rsmgr: this.getResourceManager(),
				renderer: this.getEngine().getRenderer()
			};
		}

		inline getEngine(): IEngine { return this._pEngine; }
		inline getCanvas(): ICanvas3d { return this.getEngine().getRenderer().getDefaultCanvas(); }
		inline getScene(): IScene3d { return this.getEngine().getScene(); }
		inline getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }
		inline getResourceManager(): IResourcePoolManager { return this.getEngine().getResourceManager(); }
		inline getViewport(): IViewport { return this._pPreview.viewport; }
		inline getCamera(): ICamera { return this.getViewport().getCamera(); }
		inline getComposer(): IAFXComposer { return this.getEngine().getComposer(); }

		_updateSceneNodeName(pInspector: Inspector, pNode: ISceneNode): void {
			this._pSceneTree.sync(pNode);
		}

		_viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void {
			this.disconnect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));

			this._pPreview.setViewport(pViewport);	
			this.setupApiEntry();	

			this.connect(this.getScene(), SIGNAL(beforeUpdate), SLOT(_sceneUpdate));
			this.setupObjectPicking();
			this.created();

			pViewport.bind(SIGNAL(click), (pViewport: IDSViewport, x: uint, y: uint): void => {
				var pObjectPrev: ISceneObject = this.selectedObject;
				var pRenderablePrev: IRenderableObject = this.selectedRenderable;

				if (this.editMode !== EEditModes.NONE) {
					var pRes: IRIDPair = pViewport.pick(x, y);
					// var vPoint: IVec3 = pViewport.unprojectPoint(x, y, vec3());
					// console.log(x, y, vPoint.toString());

					this.selected(pRes.object, pRes.renderable);
					this.inspectNode(pRes.object);
				}

				this.updateEditting(pObjectPrev, pRenderablePrev);
			});
		}

		private updateEditting(pObjectPrev: ISceneObject = null, pRenderablePrev: IRenderableObject = null): void {
			var pViewport: IDSViewport = <IDSViewport>this.getViewport();
			var pObject: ISceneObject = this.selectedObject;
			var pRenderable: IRenderableObject = this.selectedRenderable;

			if (!isNull(pObjectPrev)) {
				if (akra.scene.isModel(pObjectPrev)) {
					(<ISceneModel>pObjectPrev).mesh.hideBoundingBox();
				}
			}

			if (this.editMode === EEditModes.NONE) {
				pViewport.highlight(null, null);
			}

			if (this.editMode !== EEditModes.NONE) {
				pViewport.highlight(pObject, pRenderable);
				if (akra.scene.isModel(pObject)) {
					(<ISceneModel>pObject).mesh.hideBoundingBox();
				}
			}

			if (this.editMode === EEditModes.MOVE) {
				if (akra.scene.isModel(pObject)) {
					(<ISceneModel>pObject).mesh.showBoundingBox();
				}

				if (!isNull(pObject)) {
					// this._pModelBasis.visible = true;
					// this._pModelBasis.setPosition(vec3(0));

					// (<ISceneModel>this._pModelBasisTrans.child).visible = true;
					this._pModelBasisTrans.setPosition(pObject.worldPosition);
				}
			}
			else {
				// (<ISceneModel>this._pModelBasisTrans.child).visible = false;
			}
		}

		private selected(pObj: ISceneObject, pRenderable: IRenderableObject = null): void {
			var p = this._pSelectedObject;
			
			p.object = pObj;
			p.renderable = pRenderable;
		}

		cmd(eCommand: ECMD, ...argv: any[]): bool {
			switch (eCommand) {
				case ECMD.SET_PREVIEW_RESOLUTION: 
					return this.setPreviewResolution(parseInt(argv[0]), parseInt(argv[1]));
				case ECMD.SET_PREVIEW_FULLSCREEN:
					return this.setFullscreen();
				case ECMD.INSPECT_SCENE_NODE:
					
					this.selected(akra.scene.isSceneObject(argv[0])? argv[0]: null);
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
				case ECMD.SCREENSHOT:
					return this.saveScreenshot();
			}

			return false;
		}

		protected saveScreenshot(): bool {
			saveAs(util.dataURItoBlob(this.getCanvasElement().toDataURL("image/png")), "screen.png");
			return true;
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
			if (isNull(pNode)) {
				return false;
			}

			this._pSceneTree.selectByGuid(pNode.getGuid());
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
			var pViewport: IViewport = this.getViewport();
			if (pViewport.type === EViewportTypes.DSVIEWPORT) {
				(<render.DSViewport>this._pPreview.viewport).setFXAA(bValue);
			}
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