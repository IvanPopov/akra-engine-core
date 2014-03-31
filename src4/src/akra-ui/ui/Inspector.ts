/// <reference path="../idl/IUILabel.ts" />

/// <reference path="Component.ts" />
/// <reference path="resource/Properties.ts" />
/// <reference path="animation/ControllerProperties.ts" />
/// <reference path="model/MeshProperties.ts" />
/// <reference path="light/Properties.ts" />
/// <reference path="scene/Model.ts" />
/// <reference path="animation/NodeProperties.ts" />
/// <reference path="animation/MaskProperties.ts" />
/// <reference path="animation/Controller.ts" />
/// <reference path="camera/Events.ts" />
/// <reference path="scene/Events.ts" />

module akra.ui {
	import Vec3 = math.Vec3;

	export class Inspector extends Component {
		protected _pSceneEvents: scene.Events;

		protected _pNode: ISceneNode = null;
		protected _pNameLabel: IUILabel;
		protected _pPosition: IUIVector;
		protected _pWorldPosition: IUIVector;
		protected _pRotation: IUIVector;
		protected _pScale: IUIVector;
		protected _pInheritance: IUICheckboxList;

		//controllers

		protected _pAddControllerBtn: IUIButton;
		protected _pControllers: ui.animation.Controller[] = [];
		protected _nTotalVisibleControllers: uint = 0;
		protected _bControllerVisible: boolean = false;

		//model entry properties
		protected _pResource: resource.Properties;
		protected _pController: animation.ControllerProperties;

		//scene model properties
		protected _pMesh: model.MeshProperties;
		protected _pSceneModel: scene.Model; 

		//light properties
		protected _pLight: light.Properties;

		//camera properties
		protected _pCameraEvents: camera.Events;

		//inspect animation node
		//----------------------------------------------------
		protected _pAnimationNodeProperties: animation.NodeProperties;
		protected _pAnimationMaskProperties: animation.MaskProperties;



		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("Inspector.tpl");

			this._pSceneEvents = <scene.Events>this.findEntity("scene-events");

			this._pNameLabel = <IUILabel>this.findEntity("node-name");
			this._pPosition = <IUIVector>this.findEntity("position");
			this._pWorldPosition = <IUIVector>this.findEntity("worldPosition");
			this._pScale = <IUIVector>this.findEntity("scale");
			this._pRotation = <IUIVector>this.findEntity("rotation");
			this._pInheritance = <IUICheckboxList>this.findEntity("inheritance");

			this._pAddControllerBtn = <IUIButton>this.findEntity("add-controller");

			this._pResource = <resource.Properties>this.findEntity("resource");
			this._pController = <animation.ControllerProperties>this.findEntity("controller");

			this._pMesh = <model.MeshProperties>this.findEntity("mesh");

			this._pLight = <light.Properties>this.findEntity("light");
			this._pSceneModel = <scene.Model>this.findEntity("scene-model-properties");

			this._pCameraEvents = <camera.Events>this.findEntity("camera-events");

			//this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_updateName));
			//this.connect(this._pPosition, SIGNAL(changed), SLOT(_updateLocalPosition));
			//this.connect(this._pRotation, SIGNAL(changed), SLOT(_updateRotation));
			//this.connect(this._pScale, SIGNAL(changed), SLOT(_updateScale));
			//this.connect(this._pInheritance, SIGNAL(changed), SLOT(_updateInheritance));
			//this.connect(this._pAddControllerBtn, SIGNAL(click), SLOT(_addController));

			this._pNameLabel.changed.connect(this, this._updateName);
			this._pPosition.changed.connect(this, this._updateLocalPosition);
			this._pRotation.changed.connect(this, this._updateRotation);
			this._pScale.changed.connect(this, this._updateScale);
			this._pInheritance.changed.connect(this, this._updateInheritance);

			this._pAddControllerBtn.click.connect(this, this._addController);

			//---------------
			this._pAnimationNodeProperties = <animation.NodeProperties>this.findEntity("animation-node-properties");
			this._pAnimationMaskProperties = <animation.MaskProperties>this.findEntity("animation-mask-properties");

			this.inspectAnimationNode(null);
			this.inspectAnimationController(null);

			this._pSceneEvents.setScene(ide.getScene());
			this._pSceneEvents.show();
		}

		protected setupSignals(): void {
			this.nodeNameChanged = this.nodeNameChanged || new Signal(this);
			super.setupSignals();
		}

		private getControllerUI(): ui.animation.Controller {
			if (this._nTotalVisibleControllers === this._pControllers.length) {
				console.log("create controller >> ");
				var pController: ui.animation.Controller = <ui.animation.Controller>
					this.createComponent("animation.Controller", {
						show: false
					});

				pController.render(this._pAddControllerBtn.getElement().parent());
				//this.connect(pController, SIGNAL(edit), SLOT(_editCintroller));
				//this.connect(pController, SIGNAL(remove), SLOT(_removeController));
				pController.edit.connect(this, this._editCintroller);
				pController.remove.connect(this, this._removeController);
				this._pControllers.push(pController);
			}

			var pControllerUI = this._pControllers[this._nTotalVisibleControllers ++];
			pControllerUI.show();
			return pControllerUI;
		}

		private hideAllControllersUI(): void {
			for (var i = 0; i < this._nTotalVisibleControllers; ++ i) {
				this._pControllers[i].hide();
			}

			this._nTotalVisibleControllers = 0;
		}

		_addController(pBtn: IUIButton): void {
			var pController: IAnimationController = ide.getEngine().createAnimationController();
			var pControllerUI = this.getControllerUI();
			pControllerUI.setController(pController);
			// this._pAddControllerBtn.getElement().append(pControllerUI.getElement().parent());
			this._pNode.addController(pController);
		}

		_removeController(pControllerUI: ui.animation.Controller): void {
			debug.log("remove controller");
		}

		_editCintroller(pControllerUI: ui.animation.Controller): void {
			// LOG("inspect controller");
			ide.cmd(ECMD.INSPECT_ANIMATION_CONTROLLER, pControllerUI.getController());
		}

		_updateName(pLabel: IUILabel, sName: string): void {
			if (sName.length == 0) {
				sName = null;
			}

			this._pNode.setName(sName);
			this.nodeNameChanged.emit(this._pNode);
		}

		_updateInheritance(pCheckboxList: IUICheckboxList, pCheckbox: IUICheckbox): void {
			switch (pCheckbox.getName()) {
				case "position":
					this._pNode.setInheritance(ENodeInheritance.POSITION);
					return;
				case "rotscale":
					this._pNode.setInheritance(ENodeInheritance.ROTSCALE);
					return;
				case "all": 
					this._pNode.setInheritance(ENodeInheritance.ALL);
					return;
			}
		}

		_updateRotation(pVector: IUIVector, pRotation: IVec3): void {
			pRotation.scale(math.PI / 180.);
			this._pNode.setRotationByXYZAxis(pRotation.x, pRotation.y, pRotation.z);
		}

		_updateScale(pVector: IUIVector, pScale: IVec3): void {
			this._pNode.setLocalScale(pScale);
		}

		_updateLocalPosition(pVector: IUIVector, pPos: IVec3): void {
			this._pNode.setLocalPosition(pPos);
		}

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-inspector");
		}

		_scenePostUpdated(pScene: IScene3d): void {
			if (this._pNode.isUpdated()) {
				this.updateProperties();
			}
		}

		private updateProperties(): void {
			var pNode: ISceneNode = this._pNode;

			this._pNameLabel.setText((pNode.getName() || "null").toString());
			this._pPosition.setVec3(pNode.getLocalScale());
			
			var v3fRot: IVec3 = Vec3.temp();
			pNode.getLocalOrientation().toYawPitchRoll(v3fRot);
			this._pRotation.setVec3(Vec3.temp(v3fRot.y, v3fRot.x, v3fRot.z).scale(180.0 / math.PI));
			
			this._pScale.setVec3(pNode.getLocalScale());
			this._pWorldPosition.setVec3(pNode.getWorldPosition());

			var pItems: IUICheckbox[] = this._pInheritance.getItems();

			switch (pNode.getInheritance()) {
				case ENodeInheritance.POSITION: 
					pItems[0].setChecked(true);
					break;
		        case ENodeInheritance.ROTSCALE: 
					pItems[1].setChecked(true);
		        	break;
		    	case ENodeInheritance.ALL: 
					pItems[2].setChecked(true);
		    		break;
			}

			this.hideAllControllersUI();

			for (var i = 0; i < pNode.getTotalControllers(); ++ i) {
				var pControllerUI = this.getControllerUI();
				pControllerUI.setController(pNode.getController(i));
			}

			this.inspectAnimationController(null);
		}

		inspectAnimationNode(pNode: IUIAnimationNode): void {
			if (isNull(pNode) || isNull(pNode.getAnimation())) {
				this.getElement().find("div[name=animation-node]").hide();
				return;
			}

			this.getElement().find("div[name=animation-node]").show();
			this._pAnimationNodeProperties.setNode(pNode);

			if (animation.Mask.isMaskNode(pNode)) {
				this.getElement().find(".animation-mask-properties-row:first").show();
				this._pAnimationMaskProperties.setMask(<IUIAnimationMask>pNode);
			}
			else {
				this.getElement().find(".animation-mask-properties-row:first").hide();
			}
		}

		inspectAnimationController(pController: IAnimationController): void {
			if (isNull(pController)) {
				if (this._bControllerVisible) {
					this.getElement().find("div[name=animation-controller]").hide();
					this._bControllerVisible = false;
				}
				return;
			}
			if (!this._bControllerVisible) {
				this._bControllerVisible = true;
				this.getElement().find("div[name=animation-controller]").show();
			}
			this._pController.setController(pController);
		}

		inspectNode(pNode: ISceneNode): void {
			if (this._pNode) {
				//this.disconnect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
				this._pNode.getScene().postUpdate.disconnect(this, this._scenePostUpdated);
			}

			this._pNode = pNode;
			this.updateProperties();

			if (akra.scene.objects.ModelEntry.isModelEntry(pNode)) {
				var pEntry: IModelEntry = (<IModelEntry>pNode);
				this.getElement().find("div[name=model-entry]").show();
				
				this._pResource.setResource(pEntry.getResource());
			}
			else {
				this.getElement().find("div[name=model-entry]").hide();	
			}

			if (akra.scene.SceneModel.isModel(pNode)) {
				var pModel: ISceneModel = <ISceneModel>pNode;
				this.getElement().find("div[name=scene-model]").show();

				this._pSceneModel.setModel(pModel);

				if (!isNull(pModel.getMesh())) {
					this._pMesh.setMesh(pModel.getMesh());
				}
			}
			else {
				this.getElement().find("div[name=scene-model]").hide();
			}

			if (akra.scene.light.LightPoint.isLightPoint(pNode)) {
				var pPoint: ILightPoint = <ILightPoint>pNode;
				this.getElement().find("div[name=light-point]").show();
				this._pLight.setLight(pPoint);	
			}
			else {
				this.getElement().find("div[name=light-point]").hide();
			}

			if (akra.scene.objects.Camera.isCamera(pNode)) {
				var pCamera: ICamera = <ICamera>pNode;
				this.getElement().find("div[name=camera]").show();
				this._pCameraEvents.setCamera(pCamera);
			}
			else {
				this.getElement().find("div[name=camera]").hide();
			}

			//this.connect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
			this._pNode.getScene().postUpdate.connect(this, this._scenePostUpdated);
		}

		nodeNameChanged: ISignal<{ (pInspector: IUIComponent, pNode: ISceneNode): void;}>

		//BROADCAST(nodeNameChanged, CALL(node));
	}

	register("Inspector", Inspector);
}

