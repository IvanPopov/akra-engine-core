module akra {
	export function createLightShafts(pViewport: IDSViewport, pSky) {
		var pEffect = pViewport.getEffect();

		pEffect.addComponent("akra.system.sunshaft");

		var pSunshaftData = {
			SUNSHAFT_ANGLE: null,
			SUNSHAFT_SAMPLES: 70,
			SUNSHAFT_COLOR: new math.Vec3(1., 0.96, 0.9),
			SUNSHAFT_INTENSITY: 0.25,
			SUNSHAFT_DECAY: 1.2,
			SUNSHAFT_SHARPNESS: 2,
			SUNSHAFT_EXPOSURE: .9
		};

		pViewport.render.connect((pViewport: IViewport, pTechnique: IRenderTechnique,
			iPass: uint, pRenderable: IRenderableObject, pSceneObject: ISceneObject) => {

			var pDepthTexture: ITexture = (<render.DSViewport>pViewport).getDepthTexture();
			var pPass: IRenderPass = pTechnique.getPass(iPass);

			var v3fLightDir: IVec3 = math.Vec3.temp(pSky.getSunDirection());
			var pLightInDeviceSpace: IVec3 = math.Vec3.temp();
			var pCamera: ICamera = pViewport.getCamera();

			pCamera.projectPoint(math.Vec3.temp(pCamera.getWorldPosition()).add(v3fLightDir), pLightInDeviceSpace);
			pSunshaftData.SUNSHAFT_ANGLE = pCamera.getWorldMatrix().toQuat4().multiplyVec3(math.Vec3.temp(0., 0., -1.)).dot(v3fLightDir);

			pLightInDeviceSpace.x = (pLightInDeviceSpace.x + 1) / 2;
			pLightInDeviceSpace.y = (pLightInDeviceSpace.y + 1) / 2;

			pPass.setUniform('SUNSHAFT_ANGLE', pSunshaftData.SUNSHAFT_ANGLE);
			pPass.setTexture('DEPTH_TEXTURE', pDepthTexture);
			pPass.setUniform('SUNSHAFT_SAMPLES', pSunshaftData.SUNSHAFT_SAMPLES);
			pPass.setUniform('SUNSHAFT_DEPTH', 1.);
			pPass.setUniform('SUNSHAFT_COLOR', pSunshaftData.SUNSHAFT_COLOR);
			pPass.setUniform('SUNSHAFT_INTENSITY', pSunshaftData.SUNSHAFT_INTENSITY);
			pPass.setUniform('SUNSHAFT_DECAY', pSunshaftData.SUNSHAFT_DECAY);
			pPass.setUniform('SUNSHAFT_SHARPNESS', pSunshaftData.SUNSHAFT_SHARPNESS);
			pPass.setUniform('SUNSHAFT_EXPOSURE', pSunshaftData.SUNSHAFT_EXPOSURE);
			pPass.setUniform('SUNSHAFT_POSITION', pLightInDeviceSpace.clone("xy"));

			pPass.setUniform("INPUT_TEXTURE_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pDepthTexture.getWidth(), pDepthTexture.getWidth() / pDepthTexture.getHeight()));
			pPass.setUniform("SCREEN_ASPECT_RATIO",
				math.Vec2.temp(pViewport.getActualWidth() / pViewport.getActualHeight(), 1.));
		});

		return pSunshaftData;
	}


}
