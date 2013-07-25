#ifndef UIVIEWPORTPROPERTIES_TS
#define UIVIEWPORTPROPERTIES_TS

#include "Component.ts"
#include "IUILabel.ts"
#include "IUIButton.ts"
#include "IUISwitch.ts"
#include "IViewport.ts"
#include "IUICheckboxList.ts"
#include "IUIRenderTargetStats.ts"
#include "render/DSViewport.ts"

module akra.ui {
	export class ViewportProperties extends Component {
		protected _pViewport: IViewport = null;
		protected _pStats: IUIRenderTargetStats;
		protected _pFullscreenBtn: IUIButton;
		protected _pResolutionCbl: IUICheckboxList;
		protected _pFXAASwh: IUISwitch;
		protected _pSkyboxLb: IUILabel;
		protected _pScreenshotBtn: IUIButton;

		inline get viewport(): IViewport {
			return this._pViewport;
		}

		constructor (parent, options?) {
			super(parent, options, EUIComponents.UNKNOWN);

			this.template("ViewportProperties.tpl");

			this._pStats = <IUIRenderTargetStats>this.findEntity("stats");
			this._pFullscreenBtn = <IUIButton>this.findEntity("fullscreen");
			this._pFXAASwh = <IUISwitch>this.findEntity("FXAA");
			this._pResolutionCbl = <IUICheckboxList>this.findEntity("resolution-list");
			this._pSkyboxLb = <IUILabel>this.findEntity("skybox");
			this._pScreenshotBtn = <IUIButton>this.findEntity("screenshot");

			this._pFullscreenBtn.bind(SIGNAL(click), () => {
				akra.ide.cmd(akra.ECMD.SET_PREVIEW_FULLSCREEN);
			});

			this.connect(this._pResolutionCbl, SIGNAL(changed), SLOT(_previewResChanged));
			this.connect(this._pFXAASwh, SIGNAL(changed), SLOT(_fxaaChanged));
			this.connect(this._pScreenshotBtn, SIGNAL(click), SLOT(_doScreenshot));

			this._previewResChanged(this._pResolutionCbl, this._pResolutionCbl.checked);

			this.setupFileDropping();
		}

		_doScreenshot(): void {
			ide.cmd(akra.ECMD.SCREENSHOT);
		}

		private setupFileDropping(): void {
			var pViewportProperties = this;
			var pRmgr: IResourcePoolManager = ide.getResourceManager();
			var pSkyboxLb: IUILabel = this._pSkyboxLb;
			var $el = pSkyboxLb.el.find(".label-text:first");

			io.createFileDropArea(null, {
				drop: (file: File, content, format, e: DragEvent): void => {
					pSkyboxLb.el.removeClass("file-drag-over");

					var pName: IPathinfo = path.info(file.name);

				    pSkyboxLb.text = pName.toString();
 					
 					var sName: string = ".skybox - " + pName.toString();
 					var pSkyBoxTexture: ITexture = <ITexture>pRmgr.texturePool.findResource(sName);

				    if (!pSkyBoxTexture) {

					    var pSkyboxImage = pRmgr.createImg(sName);
				    	var pSkyBoxTexture = pRmgr.createTexture(sName);


						pSkyboxImage.load(new Uint8Array(content));
			    		pSkyBoxTexture.loadImage(pSkyboxImage);
		    		}

		    		if (pViewportProperties.getViewport().type === EViewportTypes.DSVIEWPORT) {
						(<render.DSViewport>(pViewportProperties.getViewport())).setSkybox(pSkyBoxTexture);
					}	
		    	},

		    	verify: (file: File, e: DragEvent): bool => {
		    		if (e.target !== $el[0] && e.target !== pViewportProperties.getCanvasElement()) {
						return false;
					}

					var pName: IPathinfo = path.info(file.name);

				    if (pName.ext.toUpperCase() !== "DDS") {
				    	alert("unsupported format used: " + file.name);
				    	return false;
				    }

					return true;
		    	},
		    	// dragenter: (e) => {
		    	// 	pSkyboxLb.el.addClass("file-drag-over");
		    	// },

		    	dragover: (e) => {
		    		pSkyboxLb.el.addClass("file-drag-over");
		    	},

		    	dragleave: (e) => {
		    		pSkyboxLb.el.removeClass("file-drag-over");
		    	},

		    	format: EFileDataTypes.ARRAY_BUFFER
			});
		}

		_fxaaChanged(pSw: IUISwitch, bValue: bool): void {
			ide.cmd(akra.ECMD.CHANGE_AA, bValue);
		}

		_previewResChanged(pCbl: IUICheckboxList, pCb: IUICheckbox): void {
			if (pCb.checked) {
				switch (pCb.name) {
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
			debug_assert(isNull(this._pViewport), "viewport cannot be changed");

			this._pViewport = pViewport;

			this.el.find("div[name=preview]").append(this.getCanvasElement());
			// this.getCanvas().resize(640, 480);

			var pStats: IUIRenderTargetStats = this._pStats;
			pStats.target = pViewport.getTarget();

			ide.cmd(akra.ECMD.CHANGE_AA, this._pFXAASwh.value);

			if (pViewport.type === EViewportTypes.DSVIEWPORT) {
				if ((<IDSViewport>pViewport).getSkybox()) {
					this._pSkyboxLb.text = (<IDSViewport>pViewport).getSkybox().findResourceName();
				}
			}

			this.connect(pViewport, SIGNAL(addedSkybox), SLOT(_addedSkybox));
		}

		_addedSkybox(pViewport: IViewport, pSkyTexture: ITexture): void {
			this._pSkyboxLb.text = pSkyTexture.findResourceName();
		}

		inline getCanvas(): ICanvas3d { return this._pViewport.getTarget().getRenderer().getDefaultCanvas(); }
		inline getCanvasElement(): HTMLCanvasElement { return (<any>this.getCanvas())._pCanvas; }
		inline getViewport(): IViewport { return this._pViewport; }

		rendered(): void {
			super.rendered();
			this.el.addClass("component-viewportproperties");
		}
	}

	register("ViewportProperties", ViewportProperties);
}

#endif

