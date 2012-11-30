#ifndef SKIN_TS
#define SKEIN_TS

#include "ISkeleton.ts"
#include "INode.ts"

module akra.model {

	export class Skin implements ISkin{
		private _m4fBindMatrix: IMat4;
		private _pRenderDataBuffer;
		private _pSkeleton: ISkeleton = null;
		private _pBoneTransformMatrixData = null;
		private _pBoneTransformMatrices  = null;
		private _pBoneOffsetMatrixBuffer = null;
		private _pNodeNames = null;
		private _pBoneOffsetMatrices = null;
		private _pAffectingNodes = null;
		private _pInfMetaData = null;
		private _pInfData = null;
		private _pWeightData = null;
		private _pTiedData = [];

		constructor(pRenderDataBuffer){
			if (arguments[0] instanceof a.Mesh) {
		        pRenderDataBuffer = arguments[0].data;
		    }

		    debug_assert(pRenderDataBuffer, 'you must specify mesh for skin');
		}

		inline get buffer(){
			return this._pRenderDataBuffer;
		}

		inline get data(){
			return this._pRenderDataBuffer;
		}

		inline get skeleton(): ISkeleton{
			return this._pSkeleton;
		}

		inline get totalBones(): int{
			return this._pNodeNames.length;
		}

		setBindMatrix(m4fMatrix): void {
			this._m4fBindMatrix.set(m4fMatrix);
		}

		getBindMatrix() {
			return this.getRootJoints()[0];
		}

		getBoneOffsetMatrices() {
			var pBoneNames = this._pNodeNames;
		    for (var i = 0; i < pBoneNames.length; i++) {
		        if (pBoneNames[i] === sBoneName) {
		            return this._pBoneOffsetMatrices[i];
		        }
		    };

		    return null;
		}

		hasSkeleton(): bool{
			return this._pSkeleton !== null;
		}

		getNodeList(): INode[]{
			return this._pNodeList;
		}

		addRootJoint(pJoint: INode): bool {
			/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
			/*FIX a. */
			/*debug_assert(pJoint instanceof a.Joint, 'node must be joint');*/

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
		    	this._pMeshNode = new a.SceneModel(this.getEngine());
		    	this._pMeshNode.create();
		    	this._pMeshNode.setInheritance(a.Scene.k_inheritAll);
		    	this._pMeshNode.attachToParent(this.root);
		    }*/

		    this._pMeshNode.name = this.name + "[mesh-container]";
		    this._pMeshNode.addMesh(pMesh);
		}

		detachMesh(): void {
			//TODO: write detach method.
		}
	}
}

#endif