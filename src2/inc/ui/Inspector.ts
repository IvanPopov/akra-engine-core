#ifndef UIINSPECTOR_TS
#define UIINSPECTOR_TS

#include "IUILabel.ts"
#include "IModelEntry.ts"

#include "Component.ts"
#include "resource/Properties.ts"
#include "animation/ControllerProperties.ts"
#include "model/MeshProperties.ts"
#include "light/Properties.ts"
#include "scene/Model.ts"
#include "animation/NodeProperties.ts"
#include "animation/MaskProperties.ts"
#include "camera/Events.ts"
#include "scene/Events.ts"
#include "ui/animation/Controller.ts"

module akra.ui {
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

			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_updateName));
			this.connect(this._pPosition, SIGNAL(changed), SLOT(_updateLocalPosition));
			this.connect(this._pRotation, SIGNAL(changed), SLOT(_updateRotation));
			this.connect(this._pScale, SIGNAL(changed), SLOT(_updateScale));
			this.connect(this._pInheritance, SIGNAL(changed), SLOT(_updateInheritance));
			this.connect(this._pAddControllerBtn, SIGNAL(click), SLOT(_addController));
			//---------------
			this._pAnimationNodeProperties = <animation.NodeProperties>this.findEntity("animation-node-properties");
			this._pAnimationMaskProperties = <animation.MaskProperties>this.findEntity("animation-mask-properties");

			this.inspectAnimationNode(null);
			this.inspectAnimationController(null);

			this._pSceneEvents.setScene(ide.getScene());
			this._pSceneEvents.show();
		}

		private getControllerUI(): ui.animation.Controller {
			if (this._nTotalVisibleControllers === this._pControllers.length) {
				var pController: ui.animation.Controller = <ui.animation.Controller>
					this.createComponent("animation.Controller", {
						show: false
					});

				pController.render(this._pAddControllerBtn.el.parent());
				this.connect(pController, SIGNAL(edit), SLOT(_editCintroller));
				this.connect(pController, SIGNAL(remove), SLOT(_removeController));
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
		}

		_addController(pBtn: IUIButton): void {
			var pController: IAnimationController = ide.getEngine().createAnimationController();
			var pControllerUI = this.getControllerUI();
			pControllerUI.controller = pController;
			// this._pAddControllerBtn.el.append(pControllerUI.el.parent());
			this._pNode.addController(pController);
		}

		_removeController(pControllerUI: ui.animation.Controller): void {
			LOG("remove controller");
		}

		_editCintroller(pControllerUI: ui.animation.Controller): void {
			// LOG("inspect controller");
			ide.cmd(ECMD.INSPECT_ANIMATION_CONTROLLER, pControllerUI.controller);
		}

		_updateName(pLabel: IUILabel, sName: string): void {
			if (sName.length == 0) {
				sName = null;
			}

			this._pNode.name = sName;
			this.nodeNameChanged(this._pNode);
		}

		_updateInheritance(pCheckboxList: IUICheckboxList, pCheckbox: IUICheckbox): void {
			switch (pCheckbox.name) {
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
			this._pNode.localScale = pScale;
		}

		_updateLocalPosition(pVector: IUIVector, pPos: IVec3): void {
			this._pNode.localPosition = pPos;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-inspector");
		}

		_scenePostUpdated(pScene: IScene3d): void {
			if (this._pNode.isUpdated()) {
				this.updateProperties();
			}
		}

		private updateProperties(): void {
			var pNode: ISceneNode = this._pNode;

			this._pNameLabel.text = (pNode.name || "null").toString();
			this._pPosition.setVec3(pNode.localPosition);
			
			var v3fRot: IVec3 = vec3();
			pNode.localOrientation.toYawPitchRoll(v3fRot);
			this._pRotation.setVec3(vec3(v3fRot.y, v3fRot.x, v3fRot.z).scale(180.0 / math.PI));
			
			this._pScale.setVec3(pNode.localScale);
			this._pWorldPosition.setVec3(pNode.worldPosition);

			switch (pNode.getInheritance()) {
				case ENodeInheritance.POSITION: 
					this._pInheritance.items[0].checked = true;
					break;
		        case ENodeInheritance.ROTSCALE: 
		        	this._pInheritance.items[1].checked = true;
		        	break;
		    	case ENodeInheritance.ALL: 
		    		this._pInheritance.items[2].checked = true;
		    		break;
			}

			this.hideAllControllersUI();

			for (var i = 0; i < pNode.totalControllers; ++ i) {
				var pControllerUI = this.getControllerUI();
				pControllerUI.controller = pNode.getController(i);
			}

			this.inspectAnimationController(null);
		}

		inspectAnimationNode(pNode: IUIAnimationNode): void {
			if (isNull(pNode) || isNull(pNode.animation)) {
				this.el.find("div[name=animation-node]").hide();
				return;
			}

			this.el.find("div[name=animation-node]").show();
			this._pAnimationNodeProperties.setNode(pNode);

			if (animation.isMaskNode(pNode)) {
				this.el.find(".animation-mask-properties-row:first").show();
				this._pAnimationMaskProperties.setMask(<IUIAnimationMask>pNode);
			}
			else {
				this.el.find(".animation-mask-properties-row:first").hide();
			}
		}

		inspectAnimationController(pController: IAnimationController): void {
			if (isNull(pController)) {
				this.el.find("div[name=animation-controller]").hide();
				return;
			}

			this.el.find("div[name=animation-controller]").show();
			this._pController.setController(pController);
		}

		inspectNode(pNode: ISceneNode): void {
			if (this._pNode) {
				this.disconnect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
			}

			this._pNode = pNode;
			this.updateProperties();

			if (akra.scene.objects.isModelEntry(pNode)) {
				var pEntry: IModelEntry = (<IModelEntry>pNode);
				this.el.find("div[name=model-entry]").show();
				
				this._pResource.setResource(pEntry.resource);
			}
			else {
				this.el.find("div[name=model-entry]").hide();	
			}

			if (akra.scene.isModel(pNode)) {
				var pModel: ISceneModel = <ISceneModel>pNode;
				this.el.find("div[name=scene-model]").show();

				this._pSceneModel.setModel(pModel);

				if (!isNull(pModel.mesh)) {
					this._pMesh.setMesh(pModel.mesh);
				}
			}
			else {
				this.el.find("div[name=scene-model]").hide();
			}

			if (akra.scene.light.isLightPoint(pNode)) {
				var pPoint: ILightPoint = <ILightPoint>pNode;
				this.el.find("div[name=light-point]").show();
				this._pLight.setLight(pPoint);	
			}
			else {
				this.el.find("div[name=light-point]").hide();
			}

			if (akra.scene.objects.isCamera(pNode)) {
				var pCamera: ICamera = <ICamera>pNode;
				this.el.find("div[name=camera]").show();
				this._pCameraEvents.setCamera(pCamera);
			}
			else {
				this.el.find("div[name=camera]").hide();
			}

			this.connect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
		}

		BROADCAST(nodeNameChanged, CALL(node));
	}

	register("Inspector", Inspector);
}

#endif

