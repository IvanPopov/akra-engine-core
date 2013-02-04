#ifndef MODEL_TS
#define MODEL_TS

#include "IModel.ts"
#include "../ResourcePoolItem.ts"
#include "IAnimation.ts"
#include "IAnimationController.ts"
#include "ICollada.ts"
#include "ISceneNode.ts"
#include "IScene3d.ts"
#include "ISkeleton.ts"
#include "IMesh.ts"
#include "util/util.ts"
#include "collada/collada.ts"

module akra.core.pool.resources {
	export class Model extends ResourcePoolItem implements IModel {
		protected _pRootNodeList: ISceneNode[];
		protected _pAnimController: IAnimationController;
		protected _pMeshList: IMesh[];
		protected _pSkeletonList: ISkeleton[];

		private _nFilesToBeLoaded: uint;
		private _pNode: ISceneNode;

		inline get node(): ISceneNode { return this._pNode; }
		inline get totalMeshes(): uint { return this._pMeshList.length; }
		inline get totalAnimations(): uint { return this._pAnimController.totalAnimations; }

		constructor () {
			super();

			this._pRootNodeList = [];
			this._pAnimController = this.getManager().getEngine().createAnimationController();
			this._pMeshList = [];
			this._pSkeletonList = [];

			this._nFilesToBeLoaded = 0;
			this._pNode = null;
		}

		destroyResource(): bool {
			CRITICAL("TODO: Model::destroyResource() not implemented.");
			return false;
		}

		inline getAnimation(iAnim: uint): IAnimationBase {
			return this._pAnimController.getAnimation(iAnim);
		}

    	inline setAnimation(iAnim: uint, pAnimation: IAnimationBase): void {
    		this._pAnimController.setAnimation(iAnim, pAnimation);
    		this.notifyAltered();
    	}

    	inline addAnimation(pAnimation: IAnimationBase): void {
    		this._pAnimController.addAnimation(pAnimation);
    		this.notifyAltered();
    	}

    	inline getAnimationController(): IAnimationController {
    		return this._pAnimController;
    	}

    	getMesh(iMesh: uint): IMesh {
    		return this._pMeshList[iMesh] || null;
    	}

    	addMesh(pMesh: IMesh): void {
    		this._pMeshList.push(pMesh);
    		this.notifyAltered();
    	}

    	addNode(pNode: ISceneNode): void {
    		this._pRootNodeList.push(pNode);
   			this.notifyAltered();
    	}

    	addSkeleton(pSkeleton: ISkeleton): void {
    		this._pSkeletonList.push(pSkeleton);
    		this.notifyAltered();
    	}
    	
    	addToScene(pScene: IScene3d): bool {
    		if (isNull(pScene)) {
    			return false;
    		}

    		if (this._pNode) {
    			CRITICAL("TODO: detach from old node...");
    		}

    		var pNodes: ISceneNode[] = this._pRootNodeList;
    		var pRoot: ISceneNode = pScene.createSceneNode();

    		if (!pRoot.create()) {
    			return false;
    		}

    		pRoot.setInheritance(ENodeInheritance.ALL);
    		
    		if (!pRoot.attachToParent(pScene.getRootNode())) {
    			return false;
    		}

    		for (var i: int = 0; i < pNodes.length; ++ i) {
    			pNodes[i].attachToParent(pRoot);
    		}

    		this._pAnimController.bind(pRoot);
    		this._pNode = pRoot;

    		return true;
    	}

    	inline getRootNodes(): ISceneNode[] {
    		return this._pRootNodeList;
    	}

    	loadResource(sFilename: string = this.findResourceName(), pOptions: IColladaLoadOptions = null): bool {


		    var pModel: IModel = this;
		    var fnCustomCallback: IColladaLoadCallback;
		    var fnSuccess: IColladaLoadCallback;
		    var fnCallback: IColladaLoadCallback;

		    fnCustomCallback = !isNull(pOptions) && !isNull(pOptions.callback)? pOptions.callback: null;

		    fnCallback = function (pErr: Error, model: IModel) {
		        if (pModel.isResourceLoaded()) { 
		        	pModel.setAlteredFlag(); 
		        }
		        
		        fnSuccess(pErr, pModel);
		        
		        if (!isNull(fnCustomCallback)) { 
		        	fnCustomCallback(pErr, pModel); 
		        }
		    };

		    fnSuccess = function (pErr: Error, model: IModel) {
		    	if (pErr) {
		    		ERROR(pErr.message);
		    	}

		        if (pModel._notifyFileLoaded() == 0) {
		            if (isNull(fnCustomCallback)) {
		                pModel.notifyLoaded();
		            }

		            pModel.notifyRestored();
		        }
		    };


		    pModel._notifyFileLoad();
		    pModel.notifyDisabled();

		    
		    if (util.pathinfo(sFilename).ext.toLowerCase() === "dae") {

		        pOptions = pOptions || Model.DEFAULT_COLLADA_LOAD_OPTIONS;
		        pOptions.file = sFilename;
		        pOptions.model = this;
		        pOptions.callback = fnCallback;

		        collada.load(this.getEngine(), pOptions);
		        return true;
		    }

		    /*
		    if (a.pathinfo(sFilename).ext.toLowerCase() === 'aac') {

		        a.fopen(sFilename, "rb").read(function (pData) {
		            pModel._pAnimController = a.undump(pData, {engine : pModel.getEngine()});
		            fnCallback();
		        });

		        return true;
		    }
			*/
		    
		    fnSuccess(null, this);
		    return false;
    	}

    	loadAnimation(sFilename: string): bool {
    		return this.loadResource(sFilename,
                             <IColladaLoadOptions> {
                                scene             : false,
                                extractPoses      : false,
                                skeletons         : this._pSkeletonList,
                                animation 		  : { pose: true }
                             });
    	}

    	//instead old method: applyShadow();
    	_setup(): bool {
    		CRITICAL("TODO: Model._setup() not implemeted...")
    		// var pMeshes = this._pMeshList, pMesh, pSubMesh;
		    // var i, j;
		    // var pEffectPool = this._pEngine.displayManager().effectPool(),
		    //     pRenderMethodPool = this._pEngine.displayManager().renderMethodPool();
		    // var pEffect;
		    // var pRenderMethod = pRenderMethodPool.findResource(".prepare_shadow_for_mesh");
		    // if (!pRenderMethod) {
		    //     pRenderMethod = pRenderMethodPool.createResource(".prepare_shadow_for_mesh");
		    //     pEffect = pEffectPool.createResource(".prepare_shadow_for_mesh");
		    //     pEffect.create();
		    //     pEffect.use("akra.system.prepareShadows");
		    //     pRenderMethod.effect = pEffect;
		    // }
		    // if (!pMeshes || pMeshes.length === 0) {
		    //     return false;
		    // }
		    // for (i = 0; i < pMeshes.length; i++) {
		    //     pMesh = pMeshes[i];
		    //     for (j = 0; j < pMesh.length; j++) {
		    //         pSubMesh = pMesh[j];
		    //         pSubMesh.addRenderMethod(pRenderMethod, ".prepare_shadows");
		    //         pSubMesh.hasShadow(true);
		    //     }
		    // }

		    return true;
    	}

    	inline _notifyFileLoaded(): uint { return (-- this._nFilesToBeLoaded); }
    	inline _notifyFileLoad(): uint { return (++ this._nFilesToBeLoaded); }
    	inline _totalFiles(): uint { return this._nFilesToBeLoaded; }

    	static DEFAULT_COLLADA_LOAD_OPTIONS: IColladaLoadOptions = 
			<IColladaLoadOptions> {
				drawJoints : false, 
				wireframe : false
			};
	}

	
}

#endif