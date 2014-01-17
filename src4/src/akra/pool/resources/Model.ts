///<reference path="../../idl/IModel.ts" />
///<reference path="../../idl/IAnimation.ts" />
///<reference path="../../idl/IAnimationController.ts" />
///<reference path="../../idl/ICollada.ts" />
///<reference path="../../idl/ISceneNode.ts" />
///<reference path="../../idl/IScene3d.ts" />
///<reference path="../../idl/ISkeleton.ts" />
///<reference path="../../idl/IMesh.ts" />

///<reference path="../../io/io.ts" />

///<reference path="../ResourcePoolItem.ts" />

module akra.pool.resources {
	export class Model extends ResourcePoolItem implements IModel {
		protected _pRootNodeList: ISceneNode[];
		protected _pAnimController: IAnimationController;
		protected _pMeshList: IMesh[];
		protected _pSkeletonList: ISkeleton[];

		private _nFilesToBeLoaded: uint;
		private _pNode: ISceneNode;

		 get node(): ISceneNode { return this._pNode; }
		 get totalMeshes(): uint { return this._pMeshList.length; }
		 get totalAnimations(): uint { return this._pAnimController.totalAnimations; }

		constructor () {
			super();

			this._pRootNodeList = [];
			this._pAnimController = this.getManager().getEngine().createAnimationController();
			this._pMeshList = [];
			this._pSkeletonList = [];

			this._nFilesToBeLoaded = 0;
			this._pNode = null;
		}

		destroyResource(): boolean {
			logger.critical("TODO: Model::destroyResource() not implemented.");
			return false;
		}

		 getAnimation(iAnim: uint): IAnimationBase {
			return this._pAnimController.getAnimation(iAnim);
		}

		 setAnimation(iAnim: uint, pAnimation: IAnimationBase): void {
			this._pAnimController.setAnimation(iAnim, pAnimation);
			this.notifyAltered();
		}

		 addAnimation(pAnimation: IAnimationBase): void {
			this._pAnimController.addAnimation(pAnimation);
			this.notifyAltered();
		}

		 getAnimationController(): IAnimationController {
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
		
		attachToScene(pNode: ISceneNode): boolean {
			if (isNull(pScene)) {
				return false;
			}

			if (this._pNode) {
				CRITICAL("TODO: detach from old node...");
			}

			var pNodes: ISceneNode[] = this._pRootNodeList;
			var pRoot: ISceneNode = pNode.scene.createNode();

			if (!pRoot.create()) {
				return false;
			}

			pRoot.setInheritance(ENodeInheritance.ALL);
			
			if (!pRoot.attachToParent(pNode)) {
				return false;
			}

			for (var i: int = 0; i < pNodes.length; ++ i) {
				pNodes[i].attachToParent(pRoot);
			}

			if (isDefAndNotNull(this._pAnimController)) {
				this._pAnimController.bind(pRoot);
			}

			this._pNode = pRoot;

			return true;
		}

		addToScene(pScene: IScene3d): boolean {
			return this.attachToScene(pScene.getRootNode());
		}

		 getRootNodes(): ISceneNode[] {
			return this._pRootNodeList;
		}

		loadResource(sFilename: string = this.findResourceName(), pOptions: IColladaLoadOptions = null, 
			fnCustomCallback: (pModel: IModel) => void = null): boolean {


			var pModel: IModel = this;
			var fnSuccess: Function;
			var fnCallback: Function;


			fnCallback = function (): void {
				if (pModel.isResourceLoaded()) { 
					pModel.setAlteredFlag(); 
				}
				
				fnSuccess();
				
				if (!isNull(fnCustomCallback)) { 
					fnCustomCallback(pModel); 
				}
			};

			fnSuccess = function (): void {
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

				io.fopen(sFilename).read(function(pErr: Error, sContent: string): void {
					if (pErr) {
						logger.error("could not read collada file: " + sFilename);
						return;
					}

					if (!collada.load(this, sContent, pOptions)) {
						logger.error("cannot parse collada content");
						return;
					}
					
					fnCallback(null);
				});

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
			
			fnSuccess();

			return false;
		}

		loadAnimation(sFilename: string): boolean {
			return this.loadResource(sFilename,
							 <IColladaLoadOptions> {
								scene             : false,
								extractPoses      : false,
								skeletons         : this._pSkeletonList,
								animation 		  : { pose: true }
							 });
		}

		//instead old method: applyShadow();
		_setup(): boolean {
			logger.critical("TODO: Model._setup() not implemeted...")
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

		 _notifyFileLoaded(): uint { return (-- this._nFilesToBeLoaded); }
		 _notifyFileLoad(): uint { return (++ this._nFilesToBeLoaded); }
		 _totalFiles(): uint { return this._nFilesToBeLoaded; }
	}

	
}
