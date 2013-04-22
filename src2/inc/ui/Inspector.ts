#ifndef UIINSPECTOR_TS
#define UIINSPECTOR_TS

#include "IUILabel.ts"
#include "IModelEntry.ts"

#include "Component.ts"
#include "resource/Properties.ts"
#include "animation/ControllerProperties.ts"
#include "model/MeshProperties.ts"
#include "light/Properties.ts"
#include "animation/NodeProperties.ts"
#include "animation/MaskProperties.ts"

module akra.ui {
	export class Inspector extends Component {
		protected _pNode: ISceneNode = null;
		protected _pNameLabel: IUILabel;
		protected _pPosition: IUIVector;
		protected _pWorldPosition: IUIVector;
		protected _pRotation: IUIVector;
		protected _pScale: IUIVector;
		protected _pInheritance: IUICheckboxList;

		//model entry properties
		protected _pResource: resource.Properties;
		protected _pController: animation.ControllerProperties;

		//scene model properties
		protected _pMesh: model.MeshProperties;

		//light properties
		protected _pLight: light.Properties;

		//inspect animation node
		//----------------------------------------------------
		protected _pAnimationNodeProperties: animation.NodeProperties;
		protected _pAnimationMaskProperties: animation.MaskProperties;



		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("Inspector.tpl");

			this._pNameLabel = <IUILabel>this.findEntity("node-name");
			this._pPosition = <IUIVector>this.findEntity("position");
			this._pWorldPosition = <IUIVector>this.findEntity("worldPosition");
			this._pScale = <IUIVector>this.findEntity("scale");
			this._pRotation = <IUIVector>this.findEntity("rotation");
			this._pInheritance = <IUICheckboxList>this.findEntity("inheritance");

			this._pResource = <resource.Properties>this.findEntity("resource");
			this._pController = <animation.ControllerProperties>this.findEntity("controller");

			this._pMesh = <model.MeshProperties>this.findEntity("mesh");

			this._pLight = <light.Properties>this.findEntity("light");

			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_updateName));
			this.connect(this._pPosition, SIGNAL(changed), SLOT(_updateLocalPosition));
			this.connect(this._pRotation, SIGNAL(changed), SLOT(_updateRotation));
			this.connect(this._pScale, SIGNAL(changed), SLOT(_updateScale));
			this.connect(this._pInheritance, SIGNAL(changed), SLOT(_updateInheritance));

			//---------------
			this._pAnimationNodeProperties = <animation.NodeProperties>this.findEntity("animation-node-properties");
			this._pAnimationMaskProperties = <animation.MaskProperties>this.findEntity("animation-mask-properties");

			this.inspectAnimationNode(null);
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
				
				if (!isNull(pEntry.controller)) {
					this._pController.setController(pEntry.controller);
				}
				else {
					this._pController.hide();
				}
			}
			else {
				this.el.find("div[name=model-entry]").hide();	
			}

			if (akra.scene.isModel(pNode)) {
				var pModel: ISceneModel = <ISceneModel>pNode;
				this.el.find("div[name=scene-model]").show();

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

			this.connect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
		}

		BROADCAST(nodeNameChanged, CALL(node));
	}

	register("Inspector", Inspector);
}

#endif

