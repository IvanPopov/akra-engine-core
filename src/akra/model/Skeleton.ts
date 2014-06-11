/// <reference path="../idl/ISkeleton.ts" />
/// <reference path="../idl/ISceneNode.ts" />

/// <reference path="../scene/Joint.ts" />

module akra.model {

	class Skeleton implements ISkeleton {
		private _sName: string;
		private _pRootJoints: IJoint[] = [];
		private _pJointMap: IJointMap = null;
		private _pNodeList: ISceneNode[]  = null;
		private _pMeshNode: ISceneModel = null;
		// private _iFlags: boolean = false;


		getTotalBones(): int {
			return Object.keys(this._pJointMap).length;
		}

		getTotalNodes(): int {
			return this._pNodeList.length;
		}

		getName(): string {
			return this._sName;
		}

		getRoot(): IJoint {
			return this._pRootJoints[0] || null;
		}

		constructor (sName: string = null) {
			this._sName = sName;
		}

		getRootJoint(): IJoint {
			return this.getRootJoints()[0];
		}

		getRootJoints(): IJoint[] {
			return this._pRootJoints;
		}

		getJointMap(): IJointMap {
			return this._pJointMap;
		}

		getNodeList(): ISceneNode[] {
			return this._pNodeList;
		}

		addRootJoint(pJoint: IJoint): boolean {
			debug.assert(pJoint instanceof scene.Joint, 'node must be joint');

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

		update(): boolean {
			var pRootJoints: IJoint[] 	= this.getRootJoints();
		    var pJointMap: IJointMap 	= this._pJointMap = <IJointMap>{};
		    var pNodeList: ISceneNode[] = this._pNodeList = [];
		    //var pNotificationJoints = this._pNotificationJoints = [];

		    function findNodes (pNode: ISceneNode): void {
		    	var sJoint: string = null;

		    	if (!isNull(pNode)) {
		    		if (scene.Joint.isJoint(pNode)) {
			    		sJoint = (<IJoint>pNode).getBoneName();
			    	}

			    	if (!isNull(sJoint)) {
			    		debug.assert(!pJointMap[sJoint], 
			    			'joint with name<' + sJoint + '> already exists in skeleton <' + this._sName + '>');
			    		
			    		pJointMap[sJoint] = <IJoint>pNode;
			    	}

			    	pNodeList.push(pNode);

			    	findNodes(<ISceneNode>pNode.getSibling());
			    	findNodes(<ISceneNode>pNode.getChild());
		    	}
		    }

		    for (var i = 0; i < pRootJoints.length; i++) {
		    	findNodes(pRootJoints[i]);
		    };

			// for (var sJoint in pJointMap) {
			// 	var pJoint = pJointMap[sJoint];

		 //    	if (pJoint.sibling() == null && pJoint.child() == null) {
		 //    		pNotificationJoints.push(pJoint);
		 //    	}
		 //    };    

			return true;
		}

		findJoint(sName: string): IJoint {
			return this._pJointMap[sName];
		}

		findJointByName(sName: string): IJoint {
			for (var s in this._pJointMap) {
				if (this._pJointMap[s].getName() === sName) {
					return this._pJointMap[s];
				}
			}

			return null;
		}

		attachMesh(pMesh: IMesh): boolean {
			if (isNull(this.getRoot())) {
				return false;
			}

			for (var i = 0; i < pMesh.getLength(); ++i) {
				logger.assert(pMesh.getSubset(i).getSkin().setSkeleton(this), "Could not set skeleton to skin.");
			}


		    if (this._pMeshNode == null) {
		    	this._pMeshNode = this.getRoot().getScene().createModel();
		    	this._pMeshNode.setInheritance(ENodeInheritance.ALL);
		    	this._pMeshNode.attachToParent(this.getRoot());
		    }

		    this._pMeshNode.setName(this.getName() + "[mesh-container]");
			this._pMeshNode.setMesh(pMesh);

			
		    return true;
		}

		detachMesh(): void {
			//TODO: write detach method.
		}
	}

	export function createSkeleton(sName: string = null): ISkeleton {
		return new Skeleton(sName);
	}
}
