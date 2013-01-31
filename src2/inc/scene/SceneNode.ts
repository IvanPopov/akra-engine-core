#ifndef SCENENODE_TS
#define SCENENODE_TS

#include "IEngine.ts"
#include "IScene3d.ts"
#include "ISceneNode.ts"
#include "scene/Node.ts"

module akra.scene {
	export class SceneNode extends Node implements ISceneNode {
		protected _pScene: IScene3d = null;

		inline get scene(): IScene3d { return this._pScene; }
		inline set scene(pScene: IScene3d) { this._pScene = pScene; }
		
		constructor (pScene: IScene3d) {
			super();

			// pScene.connect(this, SIGNAL(attached), SLOT(nodeAttachment), EEventTypes.UNICAST);
			// pScene.connect(this, SIGNAL(detached), SLOT(nodeDetachment), EEventTypes.UNICAST);

			this.scene = pScene;

			this._eType = EEntityTypes.SCENE_NODE;

			this.create();
		}

		create(): bool {
			super.create();

			this._m4fLocalMatrix        = new Mat4(1);
		    this._m4fWorldMatrix        = new Mat4(1);
		    this._m4fInverseWorldMatrix = new Mat4(1);
		    this._m3fNormalMatrix       = new Mat3(1);
		    
		    this._v3fWorldPosition  = new Vec3();

		    this._v3fTranslation    = new Vec3(0);
		    this._v3fScale          = new Vec3(1);
		    this._qRotation         = new Quat4(0, 1);

		    return true;
		}

		destroy(): void {
			super.destroy();
		}

		render(): void {

		}

		recursiveRender(): void {
			// render myself
		    this.prepareForRender();
		    this.render();
		    // render my sibling
		    if (this.sibling) {
		        (<ISceneNode>(this.sibling)).recursiveRender();
		    }
		    // render my child
		    if (this.child) {
		        (<ISceneNode>(this.child)).recursiveRender();
		    }
		}

		prepareForRender(): void {

		}

		attachToParent(pParent: IEntity): bool {
			if ((<ISceneNode>pParent).scene !== this._pScene) {
				WARNING("transfer of the scene node between trees scene - forbidden");
				return false;
			}

			return super.attachToParent(pParent);
		}

		toString(isRecursive: bool = false, iDepth: uint = 0): string {
			if (!isRecursive) {
		        return "<scene_node" + (this.name? " " + this.name: "") + ">";
		    }

		    return super.toString(isRecursive, iDepth);
		}

	}
}

#endif