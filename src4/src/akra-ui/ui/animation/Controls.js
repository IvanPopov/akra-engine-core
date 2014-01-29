/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIAnimationControls.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../graph/Controls.ts" />
        /// <reference path="Data.ts" />
        /// <reference path="Player.ts" />
        /// <reference path="Blender.ts" />
        /// <reference path="Mask.ts" />
        (function (animation) {
            var Controls = (function (_super) {
                __extends(Controls, _super);
                function Controls(parent, options) {
                    _super.call(this, parent, options, akra.ui.getUI(parent).createComponent("animation.Graph"));

                    var pControlPanel = this.controls;

                    //var pDataBtn: IUIButton = new Button(pControlPanel, {text: "Create data"});
                    var pPlayerBtn = new akra.ui.Button(pControlPanel, { text: "Create player" });
                    var pBlenderBtn = new akra.ui.Button(pControlPanel, { text: "Create blender" });
                    var pMaskBtn = new akra.ui.Button(pControlPanel, { text: "Create mask" });

                    var pExportBtn = new akra.ui.Button(pControlPanel, { text: "{ save controller }" });
                    var pExportBinBtn = new akra.ui.Button(pControlPanel, { text: "{ save controller (binary) }" });

                    ////this.connect(pDataBtn, SIGNAL(click), SLOT(createData));
                    //this.connect(pPlayerBtn, SIGNAL(click), SLOT(createPlayer));
                    //this.connect(pBlenderBtn, SIGNAL(click), SLOT(createBlender));
                    //this.connect(pMaskBtn, SIGNAL(click), SLOT(createMask));
                    pPlayerBtn.click.connect(this, this.createPlayer);
                    pBlenderBtn.click.connect(this, this.createBlender);
                    pMaskBtn.click.connect(this, this.createMask);

                    //this.connect(pExportBtn, SIGNAL(click), SLOT(exportController));
                    //this.connect(pExportBinBtn, SIGNAL(click), SLOT(exportBinController));
                    pExportBtn.click.connect(this, this.exportController);
                    pExportBinBtn.click.connect(this, this.exportBinController);
                }
                Controls.prototype.createData = function () {
                    return new akra.ui.animation.Data(this.graph);
                };

                Controls.prototype.createPlayer = function () {
                    return new akra.ui.animation.Player(this.graph);
                };

                Controls.prototype.createBlender = function () {
                    return new akra.ui.animation.Blender(this.graph);
                };

                Controls.prototype.createMask = function () {
                    return new akra.ui.animation.Mask(this.graph);
                };

                Controls.prototype.createExporter = function () {
                    var pExporter = new akra.exchange.Exporter;
                    var pController = this.graph.getController();
                    var pGraphOffset = this.graph.getElement().offset();

                    pExporter.writeController(pController);

                    for (var i = 0; i < pController.getTotalAnimations(); ++i) {
                        var pAnimation = pController.getAnimation(i);
                        var pEntry = pExporter.findEntry(pAnimation.guid);
                        var pGraphNode = this.graph.findNodeByAnimation(pAnimation);

                        var pOffset = pGraphNode.getElement().offset();

                        if (!pEntry.extra) {
                            pEntry.extra = {};
                        }

                        pEntry.extra.graph = {
                            x: pOffset.left - pGraphOffset.left,
                            y: pOffset.top - pGraphOffset.top
                        };
                    }

                    return pExporter;
                };

                Controls.prototype.exportBinController = function () {
                    var pExporter = this.createExporter();
                    var pController = this.graph.getController();
                    pExporter.saveAs((pController.name || "untitled") + ".bson", 1 /* BINARY_JSON */);
                };

                Controls.prototype.exportController = function () {
                    var pExporter = this.createExporter();
                    var pController = this.graph.getController();
                    pExporter.saveAs((pController.name || "untitled") + ".json");
                };
                return Controls;
            })(akra.ui.graph.Controls);
            animation.Controls = Controls;

            akra.ui.register("animation.Controls", Controls);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=Controls.js.map
