/// <reference path="../../../build/akra.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var akra;
(function (akra) {
    /// <reference path="../idl/IUINode.ts" />
    /// <reference path="../idl/IUILayout.ts" />
    /// <reference path="../idl/3d-party/jquery.d.ts" />
    /// <reference path="../idl/3d-party/jqueryui.d.ts" />
    /// @: data/ui/3d-party/jQuery/jquery-1.9.1.js|location()|script()|data_location({data},DATA)
    /// @: data/ui/3d-party/jQuery/jquery-ui.js|location()|script()|data_location({data},DATA)
    (function (ui) {
        ui.$document = $(document);
        ui.$body = $(document.body);

        var RelocatedSignal = (function (_super) {
            __extends(RelocatedSignal, _super);
            function RelocatedSignal() {
                _super.apply(this, arguments);
            }
            RelocatedSignal.prototype.emit = function (pLocation) {
                _super.prototype.emit.call(this, pLocation);

                var pNode = this.getSender();
                var pChild = pNode.getChild();

                while (!akra.isNull(pChild)) {
                    pChild.relocated.emit(pLocation);
                    pChild = pChild.getSibling();
                }
            };
            return RelocatedSignal;
        })(akra.Signal);

        var Node = (function (_super) {
            __extends(Node, _super);
            function Node(parent, eNodeType) {
                if (typeof eNodeType === "undefined") { eNodeType = 0 /* UNKNOWN */; }
                _super.call(this, akra.EEntityTypes.UI_NODE);

                this._pUI = parent instanceof akra.ui.UI ? parent : parent.getUI();
                this._eNodeType = eNodeType;

                if (parent instanceof Node) {
                    this.attachToParent(parent);
                }
            }
            Node.prototype.getUI = function () {
                return this._pUI;
            };
            Node.prototype.getNodeType = function () {
                return this._eNodeType;
            };

            Node.prototype.setupSignals = function () {
                this.relocated = this.relocated || new RelocatedSignal(this);
                _super.prototype.setupSignals.call(this);
            };

            Node.prototype.render = function (to) {
                return false;
            };

            Node.prototype.recursiveRender = function () {
                this.render();

                if (!akra.isNull(this.getSibling())) {
                    this.getSibling().recursiveRender();
                }

                if (!akra.isNull(this.getChild())) {
                    this.getChild().recursiveRender();
                }
            };

            Node.prototype.renderTarget = function () {
                var pTarget = this.findRenderTarget();
                return akra.isNull(pTarget) ? null : pTarget.renderTarget();
            };

            Node.prototype.hasRenderTarget = function () {
                return false;
            };

            Node.prototype.addChild = function (pChild) {
                if (this.getChild()) {
                    var pRightSibling = this.getChild().getRightSibling();

                    if (pRightSibling) {
                        pRightSibling.setSibling(pChild);
                        this.childAdded.emit(pChild);
                        return pChild;
                    }
                }

                return _super.prototype.addChild.call(this, pChild);
            };

            Node.prototype.attachToParent = function (pParent) {
                if (_super.prototype.attachToParent.call(this, pParent)) {
                    this.relocated.emit(pParent);
                    return true;
                }

                return false;
            };

            Node.prototype.findRenderTarget = function () {
                var pParent = this.getParent();

                while (!akra.isNull(pParent)) {
                    if (!akra.isNull(pParent.hasRenderTarget())) {
                        return pParent;
                    }

                    pParent = pParent.getParent();
                }

                return null;
            };
            return Node;
        })(akra.util.Entity);
        ui.Node = Node;

        function isUI(parent) {
            return parent instanceof akra.ui.UI;
        }
        ui.isUI = isUI;

        function getUI(parent) {
            return isUI(parent) ? parent : parent.getUI();
        }
        ui.getUI = getUI;

        function isUINode(pEntity) {
            return akra.isDefAndNotNull(pEntity) && pEntity.getType() === akra.EEntityTypes.UI_NODE;
        }
        ui.isUINode = isUINode;

        function isLayout(pEntity) {
            return isUINode(pEntity) && pEntity.getNodeType() === 3 /* LAYOUT */;
        }
        ui.isLayout = isLayout;

        function containsHTMLElement(pEntity) {
            return isUINode(pEntity) && pEntity.getNodeType() >= 1 /* HTML */;
        }
        ui.containsHTMLElement = containsHTMLElement;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
//# sourceMappingURL=Node.js.map
