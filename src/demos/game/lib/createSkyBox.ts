/// <reference path="../../../../built/Lib/akra.d.ts"/>

module akra {
	export function createSkyBox(pRmgr: IResourcePoolManager, pViewport: IDSViewport): ITexture {
		var pSkyBoxTexture: ITexture = pRmgr.createTexture(".sky-box-texture");
		pSkyBoxTexture.loadResource("SKYBOX");

		if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
			pViewport.setSkybox(pSkyBoxTexture);
		}

		return pSkyBoxTexture;
	}
}
