#ifndef UISCENENODE_TS
#define UISCENENODE_TS

#include "../Component.ts"
#include "IUILabel.ts"

module akra.ui.scene {
	export class NodeProperties extends Component {
		protected _pNode: ISceneNode = null;
		protected _pNameLabel: IUILabel;
		protected _pLocalPosition: IUIVector;
		protected _pWorldPosition: IUIVector;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ui/templates/SceneNodeProperties.tpl");

			this._pNameLabel = <IUILabel>this.findEntity("name");
			this._pLocalPosition = <IUIVector>this.findEntity("localPosition");
			this._pWorldPosition = <IUIVector>this.findEntity("worldPosition");

			this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_updateName));
			this.connect(this._pLocalPosition, SIGNAL(changed), SLOT(_updateLocalPosition));
		}

		_updateName(pLabel: IUILabel, sName: string): void {
			if (sName.length == 0) {
				sName = null;
			}

			this._pNode.name = sName;
			this.nodeNameChanged(this._pNode);
		}

		_updateLocalPosition(pVector: IUIVector, pPos: IVec3): void {
			this._pNode.localPosition = pPos;
		}

		rendered(): void {
			super.rendered();
			this.el.addClass("component-scenenodeproperties");
		}

		setNode(pNode: ISceneNode): void {
			this._pNode = pNode;
			this._pNameLabel.text = (pNode.name || "null").toString();
			this._pLocalPosition.setVec3(pNode.localPosition);
			this._pWorldPosition.setVec3(pNode.worldPosition);
		}

		BROADCAST(nodeNameChanged, CALL(node));
	}

	register("SceneNodeProperties", NodeProperties);
}

#endif

