#include "util/testutils.ts"
#include "akra.ts"

module akra {
	
	var pTable: HTMLElement = document.createElement("table");
	document.body.appendChild(pTable);
	
	var pTr: HTMLElement = document.createElement("tr");

	var pTd = [];
	for (var i = 0; i < 2; ++ i) {
		pTable.appendChild(pTr);
		pTd[i] = document.createElement("td");
		pTr.appendChild(pTd[i]);
		pTd[i].style.verticalAlign = "top";
	}

	var pPrintNode: HTMLElement = document.createElement("pre");
	pPrintNode.style["float"] = "left";
	pTd[0].appendChild(pPrintNode);
	var iGlobalLevel: int = 0;
	var pTreeNode: HTMLElement = document.createElement("pre");
	pTd[1].appendChild(pTreeNode);

	function print(...argv: string[]): void {
		for (var i: int = 0; i < argv.length; ++ i) {
			pPrintNode.innerHTML += argv[i];
		}
	}

	function indentAdd(): void {
		iGlobalLevel ++;
	}

	function indentRem(): void {
		iGlobalLevel --;
	}

	function printLine(sName: string, sValue: string, iLevel: int = -1): void {
		if (!isDefAndNotNull(sValue)) {
			sValue = "***";
		}

		if (iLevel < 0) {
			iLevel = iGlobalLevel;
		}

		var N: int = 80;
		var iSubWidth: int = 3;
		var n: int = N - sName.length - sValue.length - iLevel * iSubWidth;
		var sDot: string = "";
		var sLevel: string = "";
		for (var i = 0; i < iLevel; ++ i) {
			sLevel += ":";
			for (var j: int = 0; j < iSubWidth - 1; j ++) {
				sLevel += ".";	
			}
		}
		for (var i = 0; i < n; ++ i) {
			sDot += ".";
		}

		if (sValue == "no") {
			sValue = "<b>" + sValue + "</b>";
		}

		print("<span style=''><span style='color: #CCC;'>" + sLevel + "</span>" + sName + "<span style='color: #CCC;'>" + sDot + "</span>" + sValue + "</span>\n");
	}

	function fetchAnimationControllerInfo(pController: IAnimationController): void {
		printLine("total animations", pController.totalAnimations.toString());
	}

	function fetchRenderDataInfo(pData: IRenderData): void {

	}

	function fetchMeshSubsetInfo(pSubset: IMeshSubset): void {
		printLine("subset", pSubset.name);
		indentAdd();
			printLine("skinned", pSubset.isSkinned()? "yes": "no");
			indentAdd();
				printLine("total bones", pSubset.skin.totalBones.toString());
				printLine("ready", pSubset.skin.isReady()? "yes": "no");
				printLine("transform data size", pSubset.skin.getBoneTransforms().byteLength + " bytes");
			indentRem();
			printLine("data attributes", pSubset.data.hasAttributes()? "yes": "no");
			fetchRenderDataInfo(pSubset.data);
		indentRem();
	}

	function fetchMeshInfo(pMesh: IMesh): void {
		printLine("mesh", pMesh.name);
		indentAdd();
		printLine("ready for render", pMesh.isReadyForRender()? "yes": "no");
		printLine("total subsets", pMesh.length.toString());
		printLine("RAM", pMesh.data.byteLength.toString() + " bytes");

		indentAdd();
		for (var i = 0; i < pMesh.length; ++ i) {
			fetchMeshSubsetInfo(pMesh.getSubset(i));
		}
		indentRem();
		indentRem();
	}

	function fetchModelInfo(pModel: ICollada): void {
		if (!pModel.isResourceLoaded()) {
			return;
		}

		var pEngine: IEngine = pModel.getManager().getEngine();
		var pScene: IScene3d = pEngine.getScene();
		var pRoot: ISceneNode = pScene.getRootNode();
		var pController: IAnimationController = animation.createController();

		pModel.attachToScene(pRoot, pController);

		pTreeNode.textContent = pRoot.toString(true);

		var pAsset: IColladaAsset = pModel.getAsset();

		printLine("file", pModel.getFilename());
		printLine("unit", pAsset.unit.meter + "/" + pAsset.unit.name);
		printLine("up axis", pAsset.upAxis);
		printLine("title", pAsset.title);
		printLine("created", pAsset.created);
		printLine("visual scene", pModel.isVisualSceneLoaded()? "yes": "no");

		indentAdd();
		if (pModel.isVisualSceneLoaded()) {
			printLine("total nodes", pRoot.descCount().toString());

			var nTotalModels: uint = 0;
			var nTotalMeshes: uint = 0; 
			var nTotalJoints: uint = 0; 

			pRoot.explore((pEntity: IEntity): bool => {
				if (scene.isModel(pEntity)) {
					nTotalModels++;
					
					if (!isNull((<ISceneModel>pEntity).mesh)) {
						nTotalMeshes++;
						indentAdd();
						fetchMeshInfo((<ISceneModel>pEntity).mesh);
						indentRem();
					}
				}

				if (scene.isJoint(pEntity)) {
					nTotalJoints++;
				}

				return true;
			});
			
			printLine("total meshes", nTotalMeshes.toString());
			printLine("total models", nTotalModels.toString());
			printLine("total joints", nTotalJoints.toString());
		}
		indentRem();
		printLine("animation data", pModel.isAnimationLoaded()? "yes": "no");
		indentAdd();
		fetchAnimationControllerInfo(pController);
		indentRem();
	}

	asyncTest("Collada basic usage", () => {
		shouldBeNotNull("Collada model must be laoded");

		var pEngine: IEngine = createEngine();

		// if (pEngine.getRenderer().debug(true, true)) {
		// 	LOG("context debugging enabled");
		// }

		pEngine.bind(SIGNAL(depsLoaded), (pEngine: IEngine) => {
			var pRmgr: IResourcePoolManager = pEngine.getResourceManager();
			var pModel: ICollada = <ICollada>pRmgr.loadModel("../../../data/models/WoodSoldier/WoodSoldier.DAE");
			var pScene: IScene3d = pEngine.getScene();

			pModel.bind(SIGNAL(loaded), (pModel: ICollada) => {
				check(pModel);

				run();
				fetchModelInfo(pModel);
			});
		});

	});
}
