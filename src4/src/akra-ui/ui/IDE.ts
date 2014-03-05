/// <reference path="Component.ts" />
/// <reference path="scene/Tree.ts" />
/// <reference path="Inspector.ts" />
/// <reference path="ViewportProperties.ts" />
/// <reference path="ListenerEditor.ts" />

/// <reference path="../idl/IUITabs.ts" />
/// <reference path="../idl/IUIPopup.ts" />
/// <reference path="../idl/IUICheckboxList.ts" />
/// <reference path="../idl/IUIAnimationControls.ts" />
/// <reference path="../idl/IUIIDE.ts" />

module akra.ui {

	export var ide: IUIIDE = null;

	import Vec2 = math.Vec2;
	import Vec3 = math.Vec3;
	import Vec4 = math.Vec4;

	export enum IAxis {
		X = 0x01,
		Y = 0x04,
		Z = 0x02
	}

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

	interface IAxisModifier {
		//конце оси вдоль которой двигаем спроецированный на экран
		dir: IVec3;
		//направление вдоль которого двигаем в мировой системе координат
		axis: IVec4;
		//направление вдоль которого двигаем в локальной системе координат
		axisOrigin: IVec4;
		//напрвление вдоль которого двигаем оъект в системе координат экрана
		a: IVec2;
	}

	export class IDE extends Component implements IUIIDE {
		created: ISignal<{ (pIDE: IUIIDE): void; }>;

		protected _fnMainScript: Function = () => { };

		protected _pEngine: IEngine = null;

		protected _pSceneTree: scene.SceneTree;
		protected _pInspector: Inspector;
		protected _pPreview: ViewportProperties;
		protected _pTabs: IUITabs;
		protected _pColladaDialog: IUIPopup = null;
		protected _p3DControls: IUICheckboxList;


		//picking
		protected _pSelectedObject: IRIDPair = { object: null, renderable: null };

		//editing
		protected _eEditMode: EEditModes = EEditModes.NONE;
		// protected _pModelBasis: ISceneModel;
		protected _pModelBasisTrans: IModelEntry;


		//=======================================

		_apiEntry: any;

		getScript(): Function {
			return this._fnMainScript;
		}

		setScript(fn: Function) {
			this._fnMainScript = fn;
		}

		//-===============================
		getSelectedObject(): ISceneObject {
			return this._pSelectedObject.object;
		}

		getSelectedRenderable(): IRenderableObject {
			return this._pSelectedObject.renderable;
		}

		getEditMode(): EEditModes {
			return this._eEditMode;
		}

		constructor(parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			//common setup

			ide = this;

			this._pEngine = getUI(parent).getManager().getEngine();
			debug.assert(!isNull(this._pEngine), "Engine required!");

			//this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));
			this.getCanvas().viewportAdded.connect(this, this._viewportAdded);

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

			//this.connect(<IUICheckbox>p3DControls.findEntity("pick"), SIGNAL(changed), SLOT(_enablePickMode));
			//this.connect(<IUICheckbox>p3DControls.findEntity("translate"), SIGNAL(changed), SLOT(_enableTranslateMode));
			//this.connect(<IUICheckbox>p3DControls.findEntity("rotate"), SIGNAL(changed), SLOT(_enableRotateMode));
			//this.connect(<IUICheckbox>p3DControls.findEntity("scale-control"), SIGNAL(changed), SLOT(_enableScaleMode));
			(<IUICheckbox>p3DControls.findEntity("pick")).changed.connect(this, this._enablePickMode);
			(<IUICheckbox>p3DControls.findEntity("translate")).changed.connect(this, this._enableTranslateMode);
			(<IUICheckbox>p3DControls.findEntity("rotate")).changed.connect(this, this._enableRotateMode);
			(<IUICheckbox>p3DControls.findEntity("scale-control")).changed.connect(this, this._enableScaleMode);

			//connect node properties to scene tree
			//FIXME: Enter the interface IUIInspector and describe it signals.
			(<any>pInspector).nodeNameChanged.connect(this, this._updateSceneNodeName);

			var pTabs: IUITabs = this._pTabs = <IUITabs>this.findEntity("WorkTabs");

			//create mode basis
			var pScene: IScene3d = this.getScene();
			// var pBasis: ISceneModel = util.basis(pScene);

			// pBasis.name = ".model-basis";
			// pBasis.visible = false;
			// pBasis.setInheritance(ENodeInheritance.ROTPOSITION);

			// this._pModelBasis = pBasis;

			var pBasisTranslation: ICollada = <ICollada>this.getResourceManager().loadModel(config.data + "/models/basis_translation.DAE", { shadows: false });

			pBasisTranslation.loaded.connect((pModel: ICollada): void => {
				var pModelRoot: IModelEntry = pModel.attachToScene(pScene);

				pModelRoot.attachToParent(pScene.getRootNode());

				var pEl: ISceneModel = <ISceneModel>pModelRoot.getChild();

				/*while(!isNull(pEl)) {
					var pMesh: IMesh = pEl.mesh;

					for (var i = 0; i < pMesh.length; ++ i) {
						// console.log(pMesh.getSubset(i));
						// pMesh.getSubset(i).bind(SIGNAL(beforeRender), 
						// 	(pRenderable: IRenderableObject, pViewport: IViewport, pTechnique: IRenderTechnique) => {
						// 	pTechnique.getPass(0).setRenderState(ERenderStates.ZENABLE, ERenderStateValues.FALSE);
						// });
					}

					pEl = <ISceneModel>pEl.sibling;
				}*/

				this._pModelBasisTrans = pModelRoot;

				pModelRoot.setInheritance(ENodeInheritance.ALL);
				pModelRoot.hide(true);

				var iAxis: int = 0;
				//basis-model center in world coord system
				var vCenter: IVec3 = new Vec3;
				//point under cursor in screen space
				var vB: IVec2 = new Vec2;
				//drag start point in screen space
				var vO: IVec2 = new Vec2;
				//basis model world position before dragging
				var vStart: IVec3 = new Vec3;

				//axis modifiers info array
				var am: IAxisModifier[] = [];

				function createAxisModifier(pModelRoot: ISceneNode, pViewport: IViewport, iAx: IAxis): void {

					if (!isDef(am[iAx])) {
						am[iAx] = {
							dir: new Vec3,
							axis: new Vec4,
							axisOrigin: new Vec4,
							a: new Vec2
						};
					}

					var vDir: IVec3 = am[iAx].dir;
					var vAxis: IVec4 = am[iAx].axis;
					var vAxisOrigin: IVec4 = am[iAx].axisOrigin;
					var vA: IVec2 = am[iAx].a;

					switch (iAx) {
						case IAxis.X: vAxisOrigin.set(0.1, 0., 0., 1.); break;
						case IAxis.Z: vAxisOrigin.set(0., 0., 0.1, 1.); break;
						case IAxis.Y: vAxisOrigin.set(0., 0.1, 0., 1.); break;
					}


					iAxis |= iAx;

					pModelRoot.getWorldMatrix().multiplyVec4(vAxisOrigin, vAxis);

					pViewport.projectPoint(vAxis.clone('xyz'), vDir);

					vDir.clone('xy').subtract(vCenter.clone('xy'), vA);
				}

				function applyAxisModifier(m: IAxisModifier): IVec3 {
					var vA: IVec2 = m.a;
					var vAxisOrigin: IVec4 = m.axisOrigin;

					//угол между направлением куда тянет пользователь и проекциец ветора вдоль которго тянуть на экран.
					var cosAlpha: float = vA.dot(vB) / (vA.length() * vB.length());

					var fX: float = (cosAlpha * vB.length()) / vA.length();
					//длинна вектора на который надо сдвинуть объект в пространстве камеры.
					var vAx: IVec2 = Vec2.temp(vA.x * fX, vA.y * fX);
					var vC: IVec2 = vO.add(vAx, Vec2.temp(0.));

					var vC3d: IVec3 = vAxisOrigin.clone('xyz').scale(fX);

					return vC3d.add(vStart);
				}

				var pNodes: ISceneObject[] = <ISceneObject[]>pModelRoot.children();

				for (var i: int = 0; i < pNodes.length; ++i) {
					pNodes[i].mouseover.connect((pModel: ISceneModel, pViewport: IViewport, pSubset: IMeshSubset) => {
						var c: IColor = <IColor>pSubset.getRenderMethodDefault().getMaterial().emissive;
						c.set(c.r / 2., c.g / 2., c.b / 2., c.a / 2.);
					});

					pNodes[i].mouseout.connect((pModel: ISceneModel, pViewport: IViewport, pSubset: IMeshSubset) => {
						var c: IColor = <IColor>pSubset.getRenderMethodDefault().getMaterial().emissive;
						c.set(c.r * 2., c.g * 2., c.b * 2., c.a * 2.);
					});


					pNodes[i].dragstart.connect((pModel: ISceneModel, pViewport: IViewport, pSubset: IMeshSubset, x, y) => {
						var c: IColor = <IColor>pSubset.getRenderMethodDefault().getMaterial().emissive;

						vO.set(x, y);
						vStart.set(pModelRoot.getWorldPosition());
						pViewport.projectPoint(pModelRoot.getWorldPosition(), vCenter);

						//colors at basis model on Y and Z axis was swaped, FAIL :(
						if (c.r > 0) {
							createAxisModifier(pModelRoot, pViewport, IAxis.X);
						}

						if (c.g > 0) {
							createAxisModifier(pModelRoot, pViewport, IAxis.Z);
						}

						if (c.b > 0) {
							createAxisModifier(pModelRoot, pViewport, IAxis.Y);
						}
					});

					pNodes[i].dragstop.connect((pModel: ISceneModel, pViewport: IViewport, pSubset: IMeshSubset) => {
						iAxis = 0;
					});

					pNodes[i].dragging.connect((pModel: ISceneModel, pViewport: IViewport, pSubset: IMeshSubset, x, y) => {
						Vec2.temp(x, y).subtract(vO, vB);

						var vPos: IVec3 = Vec3.temp(0.);

						if (iAxis & IAxis.X) {
							vPos.add(applyAxisModifier(am[IAxis.X]));
						}

						if (iAxis & IAxis.Y) {
							vPos.add(applyAxisModifier(am[IAxis.Y]));
						}

						if (iAxis & IAxis.Z) {
							vPos.add(applyAxisModifier(am[IAxis.Z]));
						}

						vPos.scale(1. / (iAxis).toString(2).match(/1/gi).length);


						pModelRoot.setPosition(vPos);
						this.getSelectedObject().setWorldPosition(vPos);
					});
				}

			});
		}

		protected setupSignals(): void {
			this.created = this.created || new Signal(this)
			super.setupSignals();
		}

		_enablePickMode(pCb: IUICheckbox, bValue: boolean): void {
			this._eEditMode = bValue ? EEditModes.PICK : EEditModes.NONE;
			this.updateEditting();
		}

		_enableTranslateMode(pCb: IUICheckbox, bValue: boolean): void {
			this._eEditMode = bValue ? EEditModes.MOVE : EEditModes.NONE;
			this.updateEditting();
		}

		_enableRotateMode(pCb: IUICheckbox, bValue: boolean): void {
			this._eEditMode = bValue ? EEditModes.ROTATE : EEditModes.NONE;
			this.updateEditting();
		}

		_enableScaleMode(pCb: IUICheckbox, bValue: boolean): void {
			this._eEditMode = bValue ? EEditModes.SCALE : EEditModes.NONE;
			this.updateEditting();
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

		getEngine(): IEngine { return this._pEngine; }
		getCanvas(): ICanvas3d { return this.getEngine().getRenderer().getDefaultCanvas(); }
		getScene(): IScene3d { return this.getEngine().getScene(); }
		getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }
		getResourceManager(): IResourcePoolManager { return this.getEngine().getResourceManager(); }
		getViewport(): IViewport { return this._pPreview.getViewport(); }
		getCamera(): ICamera { return this.getViewport().getCamera(); }
		getComposer(): IAFXComposer { return this.getEngine().getComposer(); }

		_updateSceneNodeName(pInspector: Inspector, pNode: ISceneNode): void {
			this._pSceneTree.sync(pNode);
		}

		_viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void {
			//this.disconnect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));
			this.getCanvas().viewportAdded.disconnect(this, this._viewportAdded);

			pViewport.enableSupportFor3DEvent(E3DEventTypes.CLICK | E3DEventTypes.MOUSEOVER | E3DEventTypes.MOUSEOUT |
				E3DEventTypes.DRAGSTART | E3DEventTypes.DRAGSTOP);

			this._pPreview.setViewport(pViewport);
			this.setupApiEntry();

			//this.connect(this.getScene(), SIGNAL(beforeUpdate), SLOT(_sceneUpdate));
			this.getScene().beforeUpdate.connect(this, this._sceneUpdate);
			this.created.emit();

			pViewport.click.connect((pViewport: IDSViewport, x: uint, y: uint): void => {
				if (this.getEditMode() !== EEditModes.NONE) {
					var pRes: IRIDPair = pViewport.pick(x, y);

					if (!this._pModelBasisTrans.isAChild(pRes.object)) {
						this.selected(pRes.object, pRes.renderable);
						this.inspectNode(pRes.object);
					}
				}
			});
		}

		private updateEditting(pObjectPrev: ISceneObject = null, pRenderablePrev: IRenderableObject = null): void {
			var pViewport: IDSViewport = <IDSViewport>this.getViewport();
			var pObject: ISceneObject = this.getSelectedObject();
			var pRenderable: IRenderableObject = this.getSelectedRenderable();

			if (isNull(pViewport)) {
				return;
			}

			if (!isNull(pObjectPrev)) {
				if (akra.scene.SceneModel.isModel(pObjectPrev)) {
					(<ISceneModel>pObjectPrev).getMesh().hideBoundingBox();
				}
			}

			if (this.getEditMode() === EEditModes.NONE) {
				pViewport.highlight(null, null);
			}

			if (this.getEditMode() !== EEditModes.NONE) {
				pViewport.highlight(pObject, pRenderable);

				if (akra.scene.SceneModel.isModel(pObject)) {
					(<ISceneModel>pObject).getMesh().hideBoundingBox();
				}
			}

			if (this.getEditMode() === EEditModes.MOVE && !isNull(pObject)) {
				if (akra.scene.SceneModel.isModel(pObject)) {
					(<ISceneModel>pObject).getMesh().showBoundingBox();
				}

				this._pModelBasisTrans.hide(false);
				this._pModelBasisTrans.setPosition(pObject.getWorldPosition());
			}
			else {
				this._pModelBasisTrans.hide();
			}
		}

		private selected(pObj: ISceneObject, pRenderable: IRenderableObject = null): void {
			var pObjectPrev: ISceneObject = this.getSelectedObject();
			var pRenderablePrev: IRenderableObject = this.getSelectedRenderable();

			var p = this._pSelectedObject;

			p.object = pObj;
			p.renderable = pRenderable;

			this.updateEditting(pObjectPrev, pRenderablePrev);
		}

		cmd(eCommand: ECMD, ...argv: any[]): boolean {
			switch (eCommand) {
				case ECMD.SET_PREVIEW_RESOLUTION:
					return this.setPreviewResolution(parseInt(argv[0]), parseInt(argv[1]));
				case ECMD.SET_PREVIEW_FULLSCREEN:
					return this.setFullscreen();
				case ECMD.INSPECT_SCENE_NODE:
					this.selected(/*akra.scene.isSceneObject(argv[0])? argv[0]: null*/argv[0]);
					return this.inspectNode(argv[0]);

				case ECMD.EDIT_ANIMATION_CONTROLLER:
					return this.editAnimationController(argv[0]);
				case ECMD.INSPECT_ANIMATION_NODE:
					return this.inspectAnimationNode(argv[0]);
				case ECMD.INSPECT_ANIMATION_CONTROLLER:
					return this.inspectAnimationController(argv[0]);
				case ECMD.CHANGE_AA:
					return this.changeAntiAliasing(<boolean>argv[0]);
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

		protected saveScreenshot(): boolean {
			saveAs(conv.dutob(this.getCanvasElement().toDataURL("image/png")), "screen.png");
			return true;
		}

		protected changeCamera(pCamera: ICamera): boolean {
			this.getViewport().setCamera(pCamera);
			return true;
		}

		protected setPreviewResolution(iWidth: uint, iHeight: uint): boolean {
			this.getCanvas().resize(iWidth, iHeight);
			return true;
		}

		protected setFullscreen(): boolean {
			this.getCanvas().setFullscreen(true);
			return true;
		}

		protected inspectNode(pNode: ISceneNode): boolean {
			if (isNull(pNode)) {
				return false;
			}

			this._pSceneTree.selectByGuid(pNode.guid);
			this._pInspector.inspectNode(pNode);
			return true;
		}

		protected inspectAnimationController(pController: IAnimationController): boolean {
			this._pInspector.inspectAnimationController(pController);
			return true;
		}

		protected editAnimationController(pController: IAnimationController): boolean {
			var sName: string = "controller-" + pController.guid;
			var iTab: int = this._pTabs.findTab(sName);

			if (iTab < 0) {
				var pControls: IUIAnimationControls =
					<IUIAnimationControls>this._pTabs.createComponent("animation.Controls", {
						title: "Edit controller: " + pController.guid,
						name: sName
					});

				pControls.graph.capture(pController);
				iTab = this._pTabs.findTab(sName);
			}

			this._pTabs.select(iTab);

			return true;
		}

		protected inspectAnimationNode(pNode: IUIAnimationNode): boolean {
			this._pInspector.inspectAnimationNode(pNode);
			return true;
		}

		protected changeAntiAliasing(bValue: boolean): boolean {
			var pViewport: IViewport = this.getViewport();
			if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
				(<render.DSViewport>this._pPreview.getViewport()).setFXAA(bValue);
			}
			return true;
		}

		protected loadColladaModel(): boolean {
			var pDlg: IUIPopup = this._pColladaDialog;

			if (isNull(this._pColladaDialog)) {
				pDlg = this._pColladaDialog = <IUIPopup>this.createComponent("Popup", {
					name: "load-collada-dlg",
					title: "Load collada",
					controls: "close",
					template: "custom.LoadColladaDlg.tpl"
				});

				pDlg.closed.connect(() => {
					if (parseInt(pDlg.getElement().css("bottom")) == 0) {
						pDlg.getElement().animate({ bottom: -pDlg.getElement().height() }, 350, "easeInCirc", () => { pDlg.hide() });
					}
					else {
						pDlg.hide();
					}
				});

				var pLoadBtn: IUIButton = <IUIButton>pDlg.findEntity("load");
				var $input: JQuery = pDlg.getElement().find("input[name=url]");
				var pRmgr: IResourcePoolManager = this.getResourceManager();
				var pScene: IScene3d = this.getScene();

				pLoadBtn.click.connect(() => {
					var pModel: ICollada = <ICollada>pRmgr.loadModel($input.val());

					if (pModel.isResourceLoaded()) {
						var pModelRoot: IModelEntry = pModel.attachToScene(pScene);
					}

					pModel.loaded.connect((pModel: ICollada) => {
						var pModelRoot: IModelEntry = pModel.attachToScene(pScene);
					});

					pDlg.close();
				});
			}

			var iHeight: int = pDlg.getElement().height();

			pDlg.getElement().css('top', 'auto').css('left', 'auto').css({ bottom: -iHeight, right: 10 });
			pDlg.show();
			pDlg.getElement().animate({ bottom: 0 }, 350, "easeOutCirc");

			return true;
		}

		protected editMainScript(): boolean {

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

				pListenerEditor.bindEvent.connect((pEditor: IUIListenerEditor, sCode: string) => {
					pIDE.setScript(buildFuncByCodeWithSelfContext(sCode, self));
					(pIDE.getScript())();
				});

				iTab = pListenerEditor.index;
			}
			else {
				pListenerEditor = <IUIListenerEditor>this._pTabs.tab(iTab);
			}

			this._pTabs.select(iTab);

			pListenerEditor.editor.setValue(sCode);

			return true;
		}

		//предпологается, что мы редактируем любого листенера, и что, исполнитель команды сам укажет нам, 
		//какой номер у листенера, созданного им.
		protected editEvent(pTarget: IEventProvider, sEvent: string, iListener: int = 0, eType: EEventTypes = EEventTypes.BROADCAST): boolean {
			var sName: string = "event-" + sEvent + pTarget.guid;
			var pListenerEditor: IUIListenerEditor;
			var iTab: int = this._pTabs.findTab(sName);

			var pSign: ISignal<any> = pTarget[sEvent];
			var pListeners: IListener<any>[] = pSign.getListeners(EEventTypes.BROADCAST);
			//editable listener
			var pListener: IListener<any> = null;

			var sCode: string = "";
			var self = this._apiEntry;

			for (var i = 0; i < pListeners.length; ++i) {
				if (isNull(pListeners[i].reciever)) {
					pListener = pListeners[i];
					break;
				}
			}

			if (isNull(pListener.callback)) {
				pSign.connect(() => { });
				return this.editEvent(pTarget, sEvent);
			}


			sCode = getFuncBody(pListener.callback);
			

			if (iTab < 0) {
				pListenerEditor = <IUIListenerEditor>this._pTabs.createComponent("ListenerEditor", {
					title: "Ev.: " + sEvent + "(obj.: " + pTarget.guid + ")",
					name: sName,
				});

				pListenerEditor.bindEvent.connect((pEditor: IUIListenerEditor, sCode: string) => {
					pListener.callback = buildFuncByCodeWithSelfContext(sCode, self);
				});

				iTab = pListenerEditor.index;
			}
			else {
				pListenerEditor = <IUIListenerEditor>this._pTabs.tab(iTab);
			}

			this._pTabs.select(iTab);

			pListenerEditor.editor.setValue(sCode);

			return true;
		}
	}

	register("IDE", IDE);
}