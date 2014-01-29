/// <reference path="../../../build/addons/navigation.addon.d.ts" />
/// <reference path="../../../build/addons/filedrop.addon.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IUILabel.ts" />
    /// <reference path="../idl/IUIButton.ts" />
    /// <reference path="../idl/IUISwitch.ts" />
    /// <reference path="../idl/IUICheckboxList.ts" />
    /// <reference path="../idl/IUIRenderTargetStats.ts" />
    /// <reference path="Component.ts" />
    (function (ui) {
        var filedrop = akra.addons.filedrop;

        var ViewportProperties = (function (_super) {
            __extends(ViewportProperties, _super);
            function ViewportProperties(parent, options) {
                _super.call(this, parent, options, 0 /* UNKNOWN */);
                this._pViewport = null;

                this.template("ViewportProperties.tpl");

                this._pStats = this.findEntity("stats");
                this._pFullscreenBtn = this.findEntity("fullscreen");
                this._pFXAASwh = this.findEntity("FXAA");
                this._pResolutionCbl = this.findEntity("resolution-list");
                this._pSkyboxLb = this.findEntity("skybox");
                this._pScreenshotBtn = this.findEntity("screenshot");
                this._pLookAtBtn = this.findEntity("lookat");

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
            ViewportProperties.prototype._fullscreen = function () {
                akra.ui.ide.cmd(1 /* SET_PREVIEW_FULLSCREEN */);
            };

            ViewportProperties.prototype._screenshot = function () {
                akra.ui.ide.cmd(11 /* SCREENSHOT */);
            };

            // _lookat(): void {
            // }
            ViewportProperties.prototype.setupFileDropping = function () {
                var pViewportProperties = this;
                var pRmgr = akra.ui.ide.getResourceManager();
                var pSkyboxLb = this._pSkyboxLb;
                var $el = pSkyboxLb.getElement().find(".label-text:first");

                filedrop.addHandler(null, {
                    drop: function (file, content, format, e) {
                        pSkyboxLb.getElement().removeClass("file-drag-over");

                        var pName = akra.path.parse(file.name);

                        pSkyboxLb.setText(pName.toString());

                        var sName = ".skybox - " + pName.toString();
                        var pSkyBoxTexture = pRmgr.getTexturePool().findResource(sName);

                        if (!pSkyBoxTexture) {
                            var pSkyboxImage = pRmgr.createImg(sName);
                            var pSkyBoxTexture = pRmgr.createTexture(sName);

                            pSkyboxImage.load(new Uint8Array(content));
                            pSkyBoxTexture.loadImage(pSkyboxImage);
                        }

                        if (pViewportProperties.getViewport().getType() === akra.EViewportTypes.DSVIEWPORT) {
                            (pViewportProperties.getViewport()).setSkybox(pSkyBoxTexture);
                        }
                    },
                    verify: function (file, e) {
                        if (e.target !== $el[0] && e.target !== pViewportProperties.getCanvasElement()) {
                            return false;
                        }

                        var pName = akra.path.parse(file.name);

                        if (pName.getExt().toUpperCase() !== "DDS") {
                            alert("unsupported format used: " + file.name);
                            return false;
                        }

                        return true;
                    },
                    // dragenter: (e) => {
                    // 	pSkyboxLb.getElement().addClass("file-drag-over");
                    // },
                    dragover: function (e) {
                        pSkyboxLb.getElement().addClass("file-drag-over");
                    },
                    dragleave: function (e) {
                        pSkyboxLb.getElement().removeClass("file-drag-over");
                    },
                    format: 0 /* ARRAY_BUFFER */
                });
            };

            ViewportProperties.prototype._fxaaChanged = function (pSw, bValue) {
                akra.ui.ide.cmd(6 /* CHANGE_AA */, bValue);
            };

            ViewportProperties.prototype._previewResChanged = function (pCbl, pCb) {
                if (pCb.isChecked()) {
                    switch (pCb.getName()) {
                        case "r800":
                            akra.ui.ide.cmd(0 /* SET_PREVIEW_RESOLUTION */, 800, 600);
                            return;
                        case "r640":
                            akra.ui.ide.cmd(0 /* SET_PREVIEW_RESOLUTION */, 640, 480);
                            return;
                        case "r320":
                            akra.ui.ide.cmd(0 /* SET_PREVIEW_RESOLUTION */, 320, 240);
                            return;
                    }
                }
            };

            ViewportProperties.prototype.setViewport = function (pViewport) {
                akra.debug.assert(akra.isNull(this._pViewport), "viewport cannot be changed");

                this._pViewport = pViewport;

                this.getElement().find("div[name=preview]").append(this.getCanvasElement());

                var pStats = this._pStats;
                pStats.setTarget(pViewport.getTarget());

                akra.ui.ide.cmd(6 /* CHANGE_AA */, this._pFXAASwh.getValue());

                if (pViewport.getType() === akra.EViewportTypes.DSVIEWPORT) {
                    if (pViewport.getSkybox()) {
                        this._pSkyboxLb.setText(pViewport.getSkybox().findResourceName());
                    }

                    pViewport.addedSkybox.connect(this, this._addedSkybox);
                }

                pViewport.enableSupportFor3DEvent(akra.E3DEventTypes.CLICK);

                akra.addons.navigation(pViewport);
            };

            ViewportProperties.prototype._addedSkybox = function (pViewport, pSkyTexture) {
                this._pSkyboxLb.setText(pSkyTexture.findResourceName());
            };

            ViewportProperties.prototype.getRenderer = function () {
                return this._pViewport.getTarget().getRenderer();
            };
            ViewportProperties.prototype.getEngine = function () {
                return this.getRenderer().getEngine();
            };
            ViewportProperties.prototype.getComposer = function () {
                return this.getEngine().getComposer();
            };
            ViewportProperties.prototype.getCanvas = function () {
                return this.getRenderer().getDefaultCanvas();
            };
            ViewportProperties.prototype.getCanvasElement = function () {
                return this.getCanvas()._pCanvas;
            };
            ViewportProperties.prototype.getViewport = function () {
                return this._pViewport;
            };

            ViewportProperties.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-viewportproperties");
            };
            return ViewportProperties;
        })(akra.ui.Component);
        ui.ViewportProperties = ViewportProperties;

        akra.ui.register("ViewportProperties", ViewportProperties);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=ViewportProperties.js.map
