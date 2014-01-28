/// <reference path="../idl/IUILabel.ts" />
/// <reference path="../idl/IUIButton.ts" />
/// <reference path="../idl/IUISwitch.ts" />
/// <reference path="../idl/IViewport.ts" />
/// <reference path="../idl/IUICheckboxList.ts" />
/// <reference path="../idl/IUIRenderTargetStats.ts" />

/// <reference path="../render/DSViewport.ts" />
/// <reference path="../addons/navigation.ts" />

/// <reference path="Component.ts" />

module akra.ui {


	export class ViewportProperties extends Component {
		protected _pViewport: IViewport = null;
		protected _pStats: IUIRenderTargetStats;
		protected _pFullscreenBtn: IUIButton;
		protected _pResolutionCbl: IUICheckboxList;
		protected _pFXAASwh: IUISwitch;
		protected _pSkyboxLb: IUILabel;
		protected _pScreenshotBtn: IUIButton;
		protected _pLookAtBtn: IUIButton;

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ViewportProperties.tpl");

			this._pStats 			= <IUIRenderTargetStats>this.findEntity("stats");
			this._pFullscreenBtn 	= <IUIButton>this.findEntity("fullscreen");
			this._pFXAASwh 			= <IUISwitch>this.findEntity("FXAA");
			this._pResolutionCbl 	= <IUICheckboxList>this.findEntity("resolution-list");
			this._pSkyboxLb 		= <IUILabel>this.findEntity("skybox");
			this._pScreenshotBtn 	= <IUIButton>this.findEntity("screenshot");
			this._pLookAtBtn		= <IUIButton>this.findEntity("lookat");


			//this.connect(this._pResolutionCbl, SIGNAL(changed), SLOT(_previewResChanged));
			//this.connect(this._pFXAASwh, 	   SIGNAL(changed), SLOT(_fxaaChanged));
			//this.connect(this._pScreenshotBtn, SIGNAL(click), SLOT(_screenshot));
			//this.connect(this._pFullscreenBtn, SIGNAL(click), SLOT(_fullscreen));
			//// this.connect(this._pLookAt, SIGNAL(click), SLOT(_lookat));

			this._pResolutionCbl.changed.connect(this, this._previewResChanged);
			this._pFXAASwh.changed.connect(this, this._fxaaChanged);
			this._pScreenshotBtn.click.connect(this, this._screenshot);
			this._pFullscreenBtn.click.connect(this, this._fullscreen);

			this._previewResChanged(this._pResolutionCbl, this._pResolutionCbl.isChecked());

			this.setupFileDropping();
		}

		_fullscreen(): void {
			ide.cmd(akra.ECMD.SET_PREVIEW_FULLSCREEN);
		}

		_screenshot(): void {
			ide.cmd(akra.ECMD.SCREENSHOT);
		}

		// _lookat(): void {

		// }

		private setupFileDropping(): void {
			var pViewportProperties = this;
			var pRmgr: IResourcePoolManager = ide.getResourceManager();
			var pSkyboxLb: IUILabel = this._pSkyboxLb;
			var $el = pSkyboxLb.getElement().find(".label-text:first");

			filedrop.addHandler(null, {
				drop: (file: File, content, format, e: DragEvent): void => {
					pSkyboxLb.getElement().removeClass("file-drag-over");

					var pName: IPathinfo = path.parse(file.name);

					pSkyboxLb.setText(pName.toString());
					
					var sName: string = ".skybox - " + pName.toString();
					var pSkyBoxTexture: ITexture = <ITexture>pRmgr.getTexturePool().findResource(sName);

					if (!pSkyBoxTexture) {

						var pSkyboxImage = pRmgr.createImg(sName);
						var pSkyBoxTexture = pRmgr.createTexture(sName);


						pSkyboxImage.load(new Uint8Array(content));
						pSkyBoxTexture.loadImage(pSkyboxImage);
					}

					if (pViewportProperties.getViewport().getType() === EViewportTypes.DSVIEWPORT) {
						(<render.DSViewport>(pViewportProperties.getViewport())).setSkybox(pSkyBoxTexture);
					}	
				},

				verify: (file: File, e: DragEvent): boolean => {
					if (e.target !== $el[0] && e.target !== pViewportProperties.getCanvasElement()) {
						return false;
					}

					var pName: IPathinfo = path.parse(file.name);

					if (pName.getExt().toUpperCase() !== "DDS") {
						alert("unsupported format used: " + file.name);
						return false;
					}

					return true;
				},
				// dragenter: (e) => {
				// 	pSkyboxLb.getElement().addClass("file-drag-over");
				// },

				dragover: (e) => {
					pSkyboxLb.getElement().addClass("file-drag-over");
				},

				dragleave: (e) => {
					pSkyboxLb.getElement().removeClass("file-drag-over");
				},

				format: EFileDataTypes.ARRAY_BUFFER
			});
		}

		_fxaaChanged(pSw: IUISwitch, bValue: boolean): void {
			ide.cmd(akra.ECMD.CHANGE_AA, bValue);
		}

		_previewResChanged(pCbl: IUICheckboxList, pCb: IUICheckbox): void {
			if (pCb.isChecked()) {
				switch (pCb.getName()) {
					case "r800":
						ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 800, 600);
						return;
					case "r640":
						ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 640, 480);
						return;
					case "r320":
						ide.cmd(akra.ECMD.SET_PREVIEW_RESOLUTION, 320, 240);
						return;
				}
			}
		}

		setViewport(pViewport: IViewport): void {
			debug.assert(isNull(this._pViewport), "viewport cannot be changed");

			this._pViewport = pViewport;

			this.getElement().find("div[name=preview]").append(this.getCanvasElement());

			var pStats: IUIRenderTargetStats = this._pStats;
			pStats.target = pViewport.getTarget();

			ide.cmd(akra.ECMD.CHANGE_AA, this._pFXAASwh.getValue());

			if (pViewport.getType() === EViewportTypes.DSVIEWPORT) {
				if ((<IDSViewport>pViewport).getSkybox()) {
					this._pSkyboxLb.setText((<IDSViewport>pViewport).getSkybox().findResourceName());
				}

				(<IDSViewport>pViewport).addedSkybox.connect(this, this._addedSkybox);
			}			

			pViewport.enableSupportFor3DEvent(E3DEventTypes.CLICK);

			addons.navigation(pViewport);
		}
		

		_addedSkybox(pViewport: IViewport, pSkyTexture: ITexture): void {
			this._pSkyboxLb.setText(pSkyTexture.findResourceName());
		}

		 getRenderer(): IRenderer { return this._pViewport.getTarget().getRenderer(); }
		 getEngine(): IEngine { return this.getRenderer().getEngine(); }
		 getComposer(): IAFXComposer { return this.getEngine().getComposer(); }
		 getCanvas(): ICanvas3d { return this.getRenderer().getDefaultCanvas(); }
		 getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }
		 getViewport(): IViewport { return this._pViewport; }

		protected finalizeRender(): void {
			super.finalizeRender();
			this.getElement().addClass("component-viewportproperties");
		}
	}

	register("ViewportProperties", ViewportProperties);
}

