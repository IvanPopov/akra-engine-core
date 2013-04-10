#ifndef UISCENENODE_TS
#define UISCENENODE_TS

#include "../Component.ts"
#include "IUILabel.ts"

module akra.ui.scene {
	export class NodeProperties extends Component {
		protected _pNode: ISceneNode = null;
		protected _pNameLabel: IUILabel;
		protected _pPosition: IUIVector;
		protected _pWorldPosition: IUIVector;
		protected _pRotation: IUIVector;
		protected _pScale: IUIVector;
		protected _pInheritance: IUICheckboxList;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ui/templates/SceneNodeProperties.tpl");

			this._pNameLabel = <IUILabel>this.findEntity("name");
			this._pPosition = <IUIVector>this.findEntity("position");
			this._pWorldPosition = <IUIVector>this.findEntity("worldPosition");
			this._pScale = <IUIVector>this.findEntity("scale");
			this._pRotation = <IUIVector>this.findEntity("rotation");
			this._pInheritance = <IUICheckboxList>this.findEntity("inheritance");

			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_updateName));
			this.connect(this._pPosition, SIGNAL(changed), SLOT(_updateLocalPosition));
			this.connect(this._pRotation, SIGNAL(changed), SLOT(_updateRotation));
			this.connect(this._pScale, SIGNAL(changed), SLOT(_updateScale));
			this.connect(this._pInheritance, SIGNAL(changed), SLOT(_updateInheritance));
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
			pRotation.scale(math.HALF_PI / 180.);
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
			this.el.addClass("component-scenenodeproperties");
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
			this._pRotation.setVec3(vec3(v3fRot.y, v3fRot.x, v3fRot.z).scale(180.0 / math.HALF_PI));
			
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

		setNode(pNode: ISceneNode): void {
			if (this._pNode) {
				this.disconnect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
			}

			this._pNode = pNode;
			this.updateProperties();

			if (akra.scene.objects.isModelEntry(pNode)) {
				this.el.find("div[name=model-entry]").show();
			}
			else {
				this.el.find("div[name=model-entry]").hide();	
			}

			this.connect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
		}

		BROADCAST(nodeNameChanged, CALL(node));
	}

	register("SceneNodeProperties", NodeProperties);
}

#endif

