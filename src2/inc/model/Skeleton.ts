#ifndef SKELETON_TS
#define SKELETON_TS

#include "ISkeleton.ts"
#include "INode.ts"
#include "scene/Joint.ts"

module akra.model {

	export class Skeleton implements ISkeleton{
		private _sName: string;
		private _pEngine: IEngine;
		private _pRootJoints: INode[] = [];
		private _pJointList: INodeMap = null;
		private _pNodeList: INode[]  = null;
		private _pMeshNode: INode = null;
		private _iFlags: bool = false;

		inline get totalBones(): int{
			return Object.keys(this._pJointList).length;
		}

		inline get totalNodes(): int{
			return this._pNodeList.length;
		}

		inline get name(): string{
			return this._sName;
		}

		inline get root(): INode{
			return this._pRootJoints[0] || null;
		}

		getEngine(): IEngine {
			return this._pEngine;
		}

		getRootJoint(): INode {
			return this.getRootJoints()[0];
		}

		getRootJoints(): INode[] {
			return this._pRootJoints;
		}

		getJointMap(): INodeMap{
			return this._pJointList;
		}

		getNodeList(): INode[]{
			return this._pNodeList;
		}

		addRootJoint(pJoint: INode): bool {
			debug_assert(pJoint instanceof scene.Joint, 'node must be joint');

		    var pRootJoints = this._pRootJoints;

			for (var i = 0; i < pRootJoints.length; i++) {
				if (pJoint.childOf(pRootJoints[i])) {
					return false;
				}	
				else if (pRootJoints[i].childOf(pJoint)) {
					pRootJoints.splice(i, 1);
				}
			};

			this._pRootJoints.push(pJoint);

			return this.update();
		}

		update(): bool {
			var pRootJoints = this._pRootJoints;
		    var pJointList = this._pJointList = {};
		    var pNodeList = this._pNodeList = [];
		    //var pNotificationJoints = this._pNotificationJoints = [];

		    function findNodes (pNode) {
		    	var sJoint;

		    	if (pNode) {
			    	sJoint = pNode.boneName;

			    	if (sJoint) {
			    		debug_assert(!pJointList[sJoint], 
			    			'joint with name<' + sJoint + '> already exists in skeleton <' + this._sName + '>');
			    		pJointList[sJoint] = pNode;
			    	}

			    	pNodeList.push(pNode);

			    	findNodes(pNode.sibling());
			    	findNodes(pNode.child());
		    	}
		    }

		    for (var i = 0; i < pRootJoints.length; i++) {
		    	findNodes(pRootJoints[i]);
		    };

			// for (var sJoint in pJointList) {
			// 	var pJoint = pJointList[sJoint];

		 //    	if (pJoint.sibling() == null && pJoint.child() == null) {
		 //    		pNotificationJoints.push(pJoint);
		 //    	}
		 //    };    

			return true;
		}

		findJoint(sName: string): INode {
			return this._pJointList[sName];
		}

		findJointByName(sName: string): INode {
			for (var s in this._pJointList) {
				if (this._pJointList[s].name === sName) {
					return this._pJointList[s];
				}
			}

			return null;
		}

		attachMesh(pMesh: IMesh): void {
			/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
			/*FIX a. , getEngine*/
			/*debug_assert(this.getEngine() === pMesh.getEngine(), 'mesh must be from same engine instance');

		    if (this._pMeshNode == null) {
		    	this._pMeshNode = new scene.objects.SceneModel(this.getEngine());
		    	this._pMeshNode.create();
		    	this._pMeshNode.setInheritance(a.Scene.k_inheritAll);
		    	this._pMeshNode.attachToParent(this.root);
		    }
*/
		    this._pMeshNode.name = this.name + "[mesh-container]";
		    this._pMeshNode.addMesh(pMesh);
		}

		detachMesh(): void {
			//TODO: write detach method.
		}
	}
}

#endif