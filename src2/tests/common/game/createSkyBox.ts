function createSkyBox(pRmgr: IResourcePoolManager, pViewport: IDSViewport): ITexture {
	var pSkyBoxTexture: ITexture = pRmgr.createTexture(".sky-box-texture");
	pSkyBoxTexture.loadResource("SKYBOX");

	if (pViewport.type === EViewportTypes.DSVIEWPORT) {
		pViewport.setSkybox(pSkyBoxTexture);
	}

	return pSkyBoxTexture;
}