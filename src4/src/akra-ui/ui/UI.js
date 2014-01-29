/// <reference path="../idl/IUI.ts" />
var akra;
(function (akra) {
    /// <reference path="HTMLNode.ts" />
    /// <reference path="DNDNode.ts" />
    /// <reference path="Component.ts" />
    /// <reference path="Panel.ts" />
    /// <reference path="Popup.ts" />
    /// <reference path="Tabs.ts" />
    /// <reference path="Button.ts" />
    /// <reference path="Menu.ts" />
    /// <reference path="Switch.ts" />
    /// <reference path="Label.ts" />
    /// <reference path="Vector.ts" />
    /// <reference path="Layout.ts" />
    /// <reference path="Horizontal.ts" />
    /// <reference path="Vertical.ts" />
    /// <reference path="Slider.ts" />
    /// <reference path="Checkbox.ts" />
    /// <reference path="CheckboxList.ts" />
    /// <reference path="Window.ts" />
    /// <reference path="RenderTargetStats.ts" />
    /// <reference path="Tree.ts" />
    /// <reference path="IDE.ts" />
    /// <reference path="CodeEditor.ts" />
    /// <reference path="graph/Graph.ts" />
    /// <reference path="graph/Node.ts" />
    /// <reference path="graph/Connector.ts" />
    /// <reference path="graph/Route.ts" />
    /// <reference path="graph/Controls.ts" />
    /// <reference path="animation/Controls.ts" />
    /// <reference path="animation/Graph.ts" />
    (function (ui) {
        akra.config.UI = true;

        var UI = (function () {
            function UI(pManager) {
                if (typeof pManager === "undefined") { pManager = null; }
                this.guid = akra.guid();
                this._sUIName = null;
                this._pManager = pManager;
            }
            UI.prototype.getName = function () {
                return this._sUIName;
            };

            UI.prototype.getType = function () {
                return akra.ESceneTypes.TYPE_2D;
            };

            UI.prototype.setupSignals = function () {
            };

            UI.prototype.getManager = function () {
                return this._pManager;
            };

            UI.prototype.createHTMLNode = function (pElement) {
                return new akra.ui.HTMLNode(this, pElement);
            };

            UI.prototype.createDNDNode = function (pElement) {
                return new akra.ui.DNDNode(this, pElement);
            };

            UI.prototype.createComponent = function (sType, pOptions) {
                if (akra.isDefAndNotNull(akra.ui.COMPONENTS[sType])) {
                    //console.log("Founded non-generic type: " + sType);
                    return new akra.ui.COMPONENTS[sType](this, pOptions);
                }

                return new akra.ui.Component(this, akra.ui.mergeOptions(pOptions, { generic: sType }));
            };

            UI.prototype.createLayout = function (type, pAttrs) {
                if (typeof type === "undefined") { type = null; }
                if (typeof pAttrs === "undefined") { pAttrs = null; }
                var pLayout = null;

                if (akra.isString(type)) {
                    type = type.toLowerCase();
                }

                switch (type) {
                    case "horizontal":
                    case 1 /* HORIZONTAL */:
                        pLayout = new akra.ui.Horizontal(this);
                        break;
                    case "vertical":
                    case 2 /* VERTICAL */:
                        pLayout = new akra.ui.Vertical(this);
                        break;
                    default:
                        pLayout = new akra.ui.Layout(this);
                }

                if (!akra.isNull(pLayout) && !akra.isNull(pAttrs)) {
                    pLayout.setAttributes(pAttrs);
                }

                return pLayout;
            };
            return UI;
        })();
        ui.UI = UI;

        function createUI(pManager) {
            return new UI(pManager);
        }
        ui.createUI = createUI;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=UI.js.map
