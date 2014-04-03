/// <reference path="IUIHTMLNode.ts" />
var akra;
(function (akra) {
    (function (EUILayouts) {
        EUILayouts[EUILayouts["UNKNOWN"] = 0] = "UNKNOWN";
        EUILayouts[EUILayouts["HORIZONTAL"] = 1] = "HORIZONTAL";
        EUILayouts[EUILayouts["VERTICAL"] = 2] = "VERTICAL";
    })(akra.EUILayouts || (akra.EUILayouts = {}));
    var EUILayouts = akra.EUILayouts;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUILayout.ts" />
/// <reference path="IUI.ts" />
var akra;
(function (akra) {
    (function (EUINodeTypes) {
        EUINodeTypes[EUINodeTypes["UNKNOWN"] = 0] = "UNKNOWN";
        EUINodeTypes[EUINodeTypes["HTML"] = 1] = "HTML";
        EUINodeTypes[EUINodeTypes["DND"] = 2] = "DND";

        EUINodeTypes[EUINodeTypes["LAYOUT"] = 3] = "LAYOUT";

        EUINodeTypes[EUINodeTypes["COMPONENT"] = 4] = "COMPONENT";
    })(akra.EUINodeTypes || (akra.EUINodeTypes = {}));
    var EUINodeTypes = akra.EUINodeTypes;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="3d-party/jquery.d.ts" />
/// <reference path="IUINode.ts" />
/// <reference path="IUIDNDNode.ts" />
var akra;
(function (akra) {
    (function (EUIComponents) {
        EUIComponents[EUIComponents["UNKNOWN"] = 0] = "UNKNOWN";

        EUIComponents[EUIComponents["WINDOW"] = 1] = "WINDOW";

        EUIComponents[EUIComponents["BUTTON"] = 2] = "BUTTON";
        EUIComponents[EUIComponents["SWITCH"] = 3] = "SWITCH";
        EUIComponents[EUIComponents["PANEL"] = 4] = "PANEL";
        EUIComponents[EUIComponents["POPUP"] = 5] = "POPUP";
        EUIComponents[EUIComponents["TABS"] = 6] = "TABS";
        EUIComponents[EUIComponents["LABEL"] = 7] = "LABEL";
        EUIComponents[EUIComponents["VECTOR"] = 8] = "VECTOR";
        EUIComponents[EUIComponents["MENU"] = 9] = "MENU";
        EUIComponents[EUIComponents["TREE"] = 10] = "TREE";
        EUIComponents[EUIComponents["TREE_NODE"] = 11] = "TREE_NODE";
        EUIComponents[EUIComponents["CANVAS"] = 12] = "CANVAS";
        EUIComponents[EUIComponents["SLIDER"] = 13] = "SLIDER";
        EUIComponents[EUIComponents["CHECKBOX"] = 14] = "CHECKBOX";
        EUIComponents[EUIComponents["CHECKBOX_LIST"] = 15] = "CHECKBOX_LIST";
        EUIComponents[EUIComponents["VIEWPORT_STATS"] = 16] = "VIEWPORT_STATS";

        EUIComponents[EUIComponents["CODE_EDITOR"] = 17] = "CODE_EDITOR";

        // LISTENER_EDITOR,
        EUIComponents[EUIComponents["COLLADA_ANIMATION"] = 18] = "COLLADA_ANIMATION";

        EUIComponents[EUIComponents["GRAPH"] = 19] = "GRAPH";
        EUIComponents[EUIComponents["GRAPH_NODE"] = 20] = "GRAPH_NODE";
        EUIComponents[EUIComponents["GRAPH_CONNECTOR"] = 21] = "GRAPH_CONNECTOR";
        EUIComponents[EUIComponents["GRAPH_CONTROLS"] = 22] = "GRAPH_CONTROLS";
        EUIComponents[EUIComponents["GRAPH_CONNECTIONAREA"] = 23] = "GRAPH_CONNECTIONAREA";
    })(akra.EUIComponents || (akra.EUIComponents = {}));
    var EUIComponents = akra.EUIComponents;
})(akra || (akra = {}));
/// <reference path="IUIHTMLNode.ts" />
/// <reference path="IUIComponent.ts" />
// IUIButton export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
// IUICheckbox export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="IUICheckbox.ts" />
// IUILabel export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
// IUIPanel export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
// IUIPopup export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIPanel.ts" />
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIHTMLNode.ts" />
/// <reference path="IUIDNDNode.ts" />
/// <reference path="IUIButton.ts" />
/// <reference path="IUICheckbox.ts" />
/// <reference path="IUICheckboxList.ts" />
/// <reference path="IUILabel.ts" />
/// <reference path="IUIPanel.ts" />
/// <reference path="IUIPopup.ts" />
/// <reference path="IUITabs.ts" />
/// <reference path="IUIVector.ts" />
/// <reference path="IUILayout.ts" />
/// <reference path="../../../built/lib/akra.d.ts" />
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
                _super.call(this, 100 /* UI_NODE */);

                this._pUI = parent instanceof ui.UI ? parent : parent.getUI();
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
            return parent instanceof ui.UI;
        }
        ui.isUI = isUI;

        function getUI(parent) {
            return isUI(parent) ? parent : parent.getUI();
        }
        ui.getUI = getUI;

        function isUINode(pEntity) {
            return akra.isDefAndNotNull(pEntity) && pEntity.getType() === 100 /* UI_NODE */;
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
/// <reference path="../idl/IUIHTMLNode.ts" />
var akra;
(function (akra) {
    /// <reference path="Node.ts" />
    (function (ui) {
        var RenderedSignal = (function (_super) {
            __extends(RenderedSignal, _super);
            function RenderedSignal() {
                _super.apply(this, arguments);
            }
            RenderedSignal.prototype.emit = function (pNode) {
                if (typeof pNode === "undefined") { pNode = null; }
                _super.prototype.emit.call(this, pNode);
                this.getSender().finalizeRender(pNode);
            };
            return RenderedSignal;
        })(akra.Signal);

        var HTMLNode = (function (_super) {
            __extends(HTMLNode, _super);
            function HTMLNode(parent, pElement, eNodeType) {
                if (typeof pElement === "undefined") { pElement = null; }
                if (typeof eNodeType === "undefined") { eNodeType = 1 /* HTML */; }
                _super.call(this, ui.getUI(parent), eNodeType);
                this.$element = null;
                this._fnEventRedirector = null;

                var pNode = this;
                var fnEventRedirector = this._fnEventRedirector = function (e) {
                    if (HTMLNode.EVENTS.indexOf(e.type) == -1) {
                        return;
                    }

                    return pNode[e.type](e);
                };

                this.$element = $(pElement || "<div />");

                // this.$element.bind(HTMLNode.EVENTS.join(' '), fnEventRedirector);
                if (!ui.isUI(parent)) {
                    this.attachToParent(parent);
                }
            }
            HTMLNode.prototype.getElement = function () {
                return this.$element;
            };

            HTMLNode.prototype.setupSignals = function () {
                this.click = this.click || new akra.Signal(this);
                this.dblclick = this.dblclick || new akra.Signal(this);

                this.mousemove = this.mousemove || new akra.Signal(this);
                this.mouseup = this.mouseup || new akra.Signal(this);
                this.mousedown = this.mousedown || new akra.Signal(this);
                this.mouseover = this.mouseover || new akra.Signal(this);
                this.mouseout = this.mouseout || new akra.Signal(this);
                this.mouseenter = this.mouseenter || new akra.Signal(this);
                this.mouseleave = this.mouseleave || new akra.Signal(this);

                this.focusin = this.focusin || new akra.Signal(this);
                this.focusout = this.focusout || new akra.Signal(this);

                this.blur = this.blur || new akra.Signal(this);
                this.change = this.change || new akra.Signal(this);

                this.keydown = this.keydown || new akra.Signal(this);
                this.keyup = this.keyup || new akra.Signal(this);

                this.resize = this.resize || new akra.Signal(this);
                this.beforeRender = this.beforeRender || new akra.Signal(this);
                this.rendered = this.rendered || new RenderedSignal(this);

                _super.prototype.setupSignals.call(this);
            };

            HTMLNode.prototype.handleEvent = function (sEvent) {
                this.$element.bind(sEvent, this._fnEventRedirector);
                return true;
            };

            HTMLNode.prototype.disableEvent = function (sEvent) {
                this.$element.unbind(sEvent, this._fnEventRedirector);
            };

            HTMLNode.prototype.hasRenderTarget = function () {
                return true;
            };

            HTMLNode.prototype.renderTarget = function () {
                return this.$element;
            };

            HTMLNode.prototype.getHTMLElement = function () {
                return this.$element.get()[0];
            };

            HTMLNode.prototype.render = function (to) {
                var $to = ui.$body;
                var pTarget = null;

                if (!akra.isDef(to)) {
                    pTarget = this.findRenderTarget();
                    $to = akra.isNull(pTarget) ? $to : pTarget.renderTarget();
                } else {
                    if (to instanceof ui.Node) {
                        if (this.getParent() != to) {
                            return this.attachToParent(to);
                        }

                        $to = to.renderTarget();
                    } else {
                        $to = $(to);
                    }
                }

                this.beforeRender.emit();

                //trace($to, this.self());
                $to.append(this.self());

                this.rendered.emit();

                return true;
            };

            HTMLNode.prototype.attachToParent = function (pParent, bRender) {
                if (typeof bRender === "undefined") { bRender = true; }
                if (_super.prototype.attachToParent.call(this, pParent)) {
                    if (bRender && !this.isRendered()) {
                        this.render(pParent);
                    }
                    return true;
                }
                return false;
            };

            HTMLNode.prototype.isFocused = function () {
                return !akra.isNull(this.$element) && this.$element.is(":focus");
            };

            HTMLNode.prototype.isRendered = function () {
                //console.log((<any>new Error).stack)
                return !akra.isNull(this.$element) && this.$element.parent().length > 0;
            };

            HTMLNode.prototype.destroy = function (bRecursive, bPromoteChildren) {
                _super.prototype.destroy.call(this, bRecursive, bPromoteChildren);
                this.$element.remove();
            };

            HTMLNode.prototype.width = function () {
                return this.$element.width();
            };

            HTMLNode.prototype.height = function () {
                return this.$element.height();
            };

            HTMLNode.prototype.valueOf = function () {
                return this.$element;
            };

            HTMLNode.prototype.hide = function () {
                this.getElement().hide();
            };

            HTMLNode.prototype.show = function () {
                this.getElement().show();
            };

            HTMLNode.prototype.self = function () {
                return this.$element;
            };

            HTMLNode.prototype.finalizeRender = function (pNode) {
            };

            HTMLNode.EVENTS = [
                "click",
                "dblclick",
                "mousemove",
                "mouseup",
                "mousedown",
                "mouseover",
                "mouseout",
                "mouseenter",
                "mouseleave",
                "focusin",
                "focusout",
                "blur",
                "change",
                "keydown",
                "keyup",
                "resize"
            ];

            HTMLNode.RenderedSignal = RenderedSignal;
            return HTMLNode;
        })(ui.Node);
        ui.HTMLNode = HTMLNode;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUIDNDNode.ts" />
/// <reference path="HTMLNode.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var DNDNode = (function (_super) {
            __extends(DNDNode, _super);
            function DNDNode(parent, element, eNodeType) {
                if (typeof eNodeType === "undefined") { eNodeType = 2 /* DND */; }
                _super.call(this, ui.getUI(parent), element, eNodeType);
                this._bDraggableInited = false;
                this._bDroppableInited = false;

                if (!ui.isUI(parent)) {
                    this.attachToParent(parent);
                }
            }
            DNDNode.prototype.setupSignals = function () {
                this.dragStart = this.dragStart || new akra.Signal(this);
                this.dragStop = this.dragStop || new akra.Signal(this);
                this.move = this.move || new akra.Signal(this);
                this.drop = this.drop || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            DNDNode.prototype.isDraggable = function () {
                return this._bDraggableInited && !this.$element.draggable("option", "disabled");
            };

            DNDNode.prototype.setDraggable = function (bValue, pOptions) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (typeof pOptions === "undefined") { pOptions = {}; }
                if (!this._bDraggableInited) {
                    var pNode = this;

                    this.$element.draggable({
                        start: function (e) {
                            return pNode.dragStart.emit(e);
                        },
                        stop: function (e) {
                            return pNode.dragStop.emit(e);
                        },
                        drag: function (e) {
                            return pNode.move.emit(e);
                        }
                    }).draggable("disable");

                    this._bDraggableInited = true;
                }

                if (!akra.isNull(this.getParent()) && akra.isDefAndNotNull(this.$element)) {
                    pOptions.containment = akra.isDef(pOptions.containment) ? pOptions.containment : "parent";
                    // this.$element.draggable("option", "containment", "parent");
                }

                pOptions.disabled = !bValue;

                // this.$element.draggable("option", "disabled", !bValue);
                this.setDraggableOptions(pOptions);
            };

            DNDNode.prototype.setDraggableOptions = function (pOptions) {
                this.getElement().draggable(pOptions);
            };

            DNDNode.prototype.setDroppable = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (!this._bDroppableInited) {
                    var pNode = this;

                    this.$element.droppable({
                        drop: function (e, info) {
                            return pNode.drop.emit(e, info.draggable[0].component || null, info);
                        }
                    });

                    this._bDroppableInited = true;
                }
            };

            DNDNode.prototype.attachToParent = function (pParent, bRender) {
                if (typeof bRender === "undefined") { bRender = true; }
                var isAttached = _super.prototype.attachToParent.call(this, pParent, bRender);

                if (this.isDraggable()) {
                    this.setDraggable(true);
                }

                return isAttached;
            };
            return DNDNode;
        })(ui.HTMLNode);
        ui.DNDNode = DNDNode;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUIComponent.ts" />
var akra;
(function (akra) {
    /// <reference path="DNDNode.ts" />
    /// <reference path="../idl/3d-party/raphael.d.ts" />
    /// <reference path="../idl/3d-party/swig.d.ts" />
    /// @: {data}/ui/3d-party/raphael/raphael-min.js|location()|script()|data_location({data},DATA)
    /// @: {data}/ui/3d-party/swig/swig.pack.min.js|location()|script()|data_location({data},DATA)
    /// @: {data}/ui/css/main.css|location()|css()|data_location({data},DATA)
    (function (ui) {
        swig.init({
            filters: {
                data: function (path) {
                    return akra.config.data + path;
                }
            }
        });

        // LOG(swig.compile("{% filter data %}ui/img/switch16.png{% endfilter %}", {filename: "*"})(null));
        function _template(pNode, sTemplate, sName, pData, bRenderAsNormal, iDepth) {
            if (typeof pData === "undefined") { pData = null; }
            if (typeof bRenderAsNormal === "undefined") { bRenderAsNormal = false; }
            if (typeof iDepth === "undefined") { iDepth = 0; }
            var fnTemplate = swig.compile(sTemplate, { filename: sName });
            var sTplData = fnTemplate(pData);
            var $target = pNode.getElement();

            if (!akra.isNull(pNode.getLayout())) {
                $target = pNode.getLayout().renderTarget();
            }

            $target.append(sTplData);
            $target.find("component").each(function (i) {
                var $comp = $(this);
                var sType = $comp.attr("type");
                var sName = $comp.attr("name");

                if ($comp.parents("component").length > 0) {
                    return;
                }

                bRenderAsNormal = $target[0] == $comp.parent()[0];

                var pComponent = pNode.createComponent(sType, { show: bRenderAsNormal, name: sName });
                pComponent._createdFrom($comp);

                if ($comp.text().length > 0 && !$comp.attr("template")) {
                    _template(pComponent, $comp.html(), sName, pData, false, iDepth + 1);
                }

                if (!bRenderAsNormal) {
                    // logger.warn(sTemplate);
                    var $span = $("<span/>");
                    $comp.before($span);

                    pComponent.render($span);
                    pComponent.getElement().unwrap();
                }

                $comp.remove();
            });
        }

        function template(pNode, sUrl, pData) {
            var sTemplate = akra.ajax(sUrl, { async: false }).data;
            _template(pNode, sTemplate, sUrl, pData);
        }
        ui.template = template;

        ui.COMPONENTS = {};

        var Component = (function (_super) {
            __extends(Component, _super);
            function Component(parent, options, eType, $el) {
                if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                _super.call(this, ui.getUI(parent), $el, 4 /* COMPONENT */);
                this._sGenericType = null;
                this._pComponentOptions = null;

                var pOptions = mergeOptions(options, null);

                if (!ui.isUI(parent)) {
                    this.attachToParent(parent, (!akra.isDef(pOptions.show) || pOptions.show == true));
                }

                this._eComponentType = eType;
                this.applyOptions(pOptions);
            }
            Component.prototype.getComponentType = function () {
                return this._eComponentType;
            };
            Component.prototype.getGenericType = function () {
                return this._sGenericType;
            };

            Component.prototype.getName = function () {
                return this._sName;
            };
            Component.prototype.setName = function (sName) {
                this.$element.attr("name", sName);
                this._sName = sName;
            };

            Component.prototype.getOptions = function () {
                return this._pComponentOptions;
            };

            Component.prototype.getLayout = function () {
                return ui.isLayout(this.getChild()) ? this.getChild() : null;
            };

            Component.prototype.template = function (sTplName, pData) {
                template(this, akra.config.data + "ui/templates/" + sTplName, pData);
            };

            Component.prototype.fromStringTemplate = function (sTemplate, pData) {
                _template(this, sTemplate, sTemplate, pData);
            };

            //will be called after the rendering signal will be emitted.
            Component.prototype.finalizeRender = function (pNode) {
                this.getElement().addClass("component");
                this.getHTMLElement()["component"] = this;
            };

            Component.prototype.isGeneric = function () {
                return !akra.isNull(this._sGenericType);
            };

            Component.prototype.setLayout = function (type) {
                var eType = 0 /* UNKNOWN */;

                if (akra.isString(type)) {
                    switch (type.toLowerCase()) {
                        case "horizontal":
                            eType = 1 /* HORIZONTAL */;
                            break;
                        case "vertical":
                            eType = 2 /* VERTICAL */;
                            break;
                    }
                } else {
                    eType = type;
                }

                var pLayout = this.getUI().createLayout(eType);

                if (ui.isLayout(this.getChild())) {
                    var pLayoutPrev = this.getChild();
                    pLayoutPrev.relocateChildren(pLayout);
                    pLayoutPrev.destroy();
                }

                this.relocateChildren(pLayout);

                return pLayout.render(this);
            };

            Component.prototype.attachToParent = function (pParent, bRender) {
                if (typeof bRender === "undefined") { bRender = true; }
                if (isComponent(pParent) && ui.isLayout(pParent.getChild()) && !ui.isLayout(pParent)) {
                    // console.log("redirected to layout ------>", pParent.toString(true));
                    pParent = pParent.getChild();
                }

                return _super.prototype.attachToParent.call(this, pParent, bRender);
            };

            Component.prototype.applyOptions = function (pOptions) {
                if (!akra.isDefAndNotNull(pOptions)) {
                    return;
                }

                var $element = this.getElement();

                this.setName(akra.isDef(pOptions.name) ? pOptions.name : null);

                if (akra.isDefAndNotNull(pOptions.html)) {
                    $element.html(pOptions.html);
                }

                if (akra.isDefAndNotNull(pOptions.css)) {
                    akra.logger.log(pOptions.css);
                    $element.css(pOptions.css);
                }

                if (akra.isDefAndNotNull(pOptions.class)) {
                    $element.addClass(pOptions.class);
                }

                if (akra.isDefAndNotNull(pOptions.width)) {
                    $element.width(pOptions.width);
                }

                if (akra.isDefAndNotNull(pOptions.height)) {
                    $element.height(pOptions.height);
                }

                if (akra.isDefAndNotNull(pOptions.draggable)) {
                    this.setDraggable(pOptions.draggable);
                }

                if (akra.isDefAndNotNull(pOptions.layout)) {
                    this.setLayout(pOptions.layout);
                }

                if (akra.isString(pOptions.generic)) {
                    this._sGenericType = pOptions.generic;
                }

                if (akra.isDefAndNotNull(pOptions.dragZone)) {
                    $element.draggable("option", "containment", pOptions.dragZone);
                }

                if (akra.isDefAndNotNull(pOptions.events)) {
                    if (akra.isArray(pOptions.events)) {
                        pOptions.events = pOptions.events.join(' ');
                    }

                    this.handleEvent(pOptions.events);
                }

                if (akra.isDefAndNotNull(pOptions.parent)) {
                    this.attachToParent(pOptions.parent, akra.isDefAndNotNull(pOptions.show) ? pOptions.show : true);
                }

                if (akra.isDefAndNotNull(pOptions.template)) {
                    this.template(pOptions.template);
                }

                this._pComponentOptions = pOptions;
            };

            Component.prototype.createComponent = function (sType, pOptions) {
                var pComp = this.getUI().createComponent(sType, pOptions);
                pComp.attachToParent(this, !akra.isDefAndNotNull(pOptions) || pOptions.show !== false);
                return pComp;
            };

            Component.prototype._createdFrom = function ($comp) {
                this.$element.attr("style", $comp.attr("style"));
                this.$element.attr("class", $comp.attr("class"));

                var sLayout = $comp.attr("layout");
                var sTemplate = $comp.attr("template");
                var sClick = $comp.attr("onclick");

                if (akra.isString(sTemplate)) {
                    this.template(sTemplate);
                }

                if (akra.isString(sLayout)) {
                    this.setLayout(sLayout);
                }

                if (akra.isString(sClick)) {
                    this.getElement().attr("onclick", sClick);
                }

                this.getElement().attr("id", "cuid-" + this.guid);
            };

            Component.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return (this.isGeneric() ? "<generic-" + this.getGenericType() : "<component-" + "*") + (this.getName() ? " " + this.getName() : "") + ">";
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };
            return Component;
        })(ui.DNDNode);
        ui.Component = Component;

        function register(sType, pComponent) {
            ui.COMPONENTS[sType] = pComponent;
        }
        ui.register = register;

        function isComponent(pEntity, eComponent) {
            if (!ui.isUINode(pEntity) || pEntity.getNodeType() !== 4 /* COMPONENT */) {
                return false;
            }

            if (arguments.length > 1) {
                return pEntity.getComponentType() === eComponent;
            }

            return true;
        }
        ui.isComponent = isComponent;

        function isGeneric(pEntity) {
            return isComponent(pEntity) && pEntity.isGeneric();
        }
        ui.isGeneric = isGeneric;

        function mergeOptions(left, right) {
            var pOptionsLeft;
            var pOptionsRight;

            if (akra.isString(left)) {
                pOptionsLeft = { name: left };
            } else {
                pOptionsLeft = left || {};
            }

            if (akra.isString(right)) {
                pOptionsRight = { name: right };
            } else {
                pOptionsRight = right || {};
            }

            for (var sOpt in pOptionsRight) {
                pOptionsLeft[sOpt] = pOptionsRight[sOpt];
            }

            return pOptionsLeft;
        }
        ui.mergeOptions = mergeOptions;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUIPanel.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Panel = (function (_super) {
            __extends(Panel, _super);
            function Panel(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 4 /* PANEL */; }
                _super.call(this, parent, ui.mergeOptions({ layout: 0 /* UNKNOWN */ }, options), eType, $("<div>\
						<div class='panel-title'>\
							<div class=\"controls\">\
								<input type=\"checkbox\" />\
							</div>\
							<span />\
						</div>\
					</div>"));
                this.index = -1;
                this.$controls = null;

                this.$title = this.getElement().find("div.panel-title:first");
                this.$controls = this.getElement().find("div.controls:first");

                if (akra.isDefAndNotNull(options)) {
                    if (akra.isString(options.title)) {
                        this.setTitle(options.title);
                    }
                }
            }
            Panel.prototype.isCollapsed = function () {
                return this.getElement().hasClass("collapsed");
            };

            Panel.prototype.getTitle = function () {
                return this.$title.find("span:first").html();
            };

            Panel.prototype.setTitle = function (sTitle) {
                this.$title.find("span:first").html(sTitle || "");
                this.titleUpdated.emit(sTitle);
            };

            Panel.prototype.setupSignals = function () {
                this.titleUpdated = this.titleUpdated || new akra.Signal(this);
                this.selected = this.selected || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            Panel.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);
                this.setTitle($comp.attr('title'));

                if (akra.isDef($comp.attr("collapsible"))) {
                    this.setCollapsible($comp.attr("collapsible").toLowerCase() !== "false");
                }

                var sCollapsed = $comp.attr("collapsed");

                if (akra.isString(sCollapsed) && sCollapsed.toLowerCase() !== "false") {
                    this.getElement().addClass("collapsed");
                    this.getLayout().hide();
                }
            };

            Panel.prototype.collapse = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (bValue === this.isCollapsed()) {
                    return;
                }

                this.isCollapsed() ? this.getElement().removeClass("collapsed") : this.getElement().addClass("collapsed");

                var $element = this.getLayout().getElement();

                $element.animate({
                    height: 'toggle'
                }, 500);
            };

            Panel.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-panel");
            };

            Panel.prototype.isCollapsible = function () {
                return this.getElement().hasClass("collapsible");
            };

            Panel.prototype.setCollapsible = function (bValue) {
                var _this = this;
                if (typeof bValue === "undefined") { bValue = true; }
                if (bValue === this.isCollapsible()) {
                    return;
                }

                this.getElement().addClass("collapsible");
                var pPanel = this;

                this.$controls.click(function (e) {
                    pPanel.collapse(!_this.isCollapsed());
                });
            };
            return Panel;
        })(ui.Component);
        ui.Panel = Panel;

        ui.register("Panel", Panel);

        function isPanel(pEntity) {
            return ui.isComponent(pEntity, 4 /* PANEL */);
        }
        ui.isPanel = isPanel;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUILayout.ts" />
/// <reference path="../idl/IUIPopup.ts" />
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    (function (ui) {
        var MoveSignal = (function (_super) {
            __extends(MoveSignal, _super);
            function MoveSignal() {
                _super.apply(this, arguments);
            }
            MoveSignal.prototype.emit = function (e) {
                _super.prototype.emit.call(this, e);
                this.getSender().getElement().css("bottom", "auto");
            };
            return MoveSignal;
        })(akra.Signal);

        var Popup = (function (_super) {
            __extends(Popup, _super);
            function Popup(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 5 /* POPUP */; }
                _super.call(this, parent, ui.mergeOptions({ layout: 0 /* UNKNOWN */ }, options), eType, $("<div class=\"component-popup\"><div class='header'><div class=\"title\"/><div class=\"controls\"/></div></div>"));
                this.$closeBtn = null;

                var pPopup = this;

                this.$header = this.getElement().find("div.header:first");
                this.$title = this.$header.find("div.title");
                this.$footer = $("<div class=\"footer\"/>");
                this.$controls = this.$header.find("div.controls");

                this.getElement().append(this.$footer);

                if (akra.isDefAndNotNull(options)) {
                    if (akra.isString(options.title)) {
                        this.setTitle(options.title);
                    }

                    if (akra.isString(options.controls)) {
                        var pControls = options.controls.split(" ");
                        for (var i = 0; i < pControls.length; ++i) {
                            switch (pControls[i]) {
                                case "close":
                                    this.$closeBtn = $("<div class=\"close-btn\"/>");
                                    this.$controls.append(this.$closeBtn);
                                    break;
                            }
                        }
                    }
                }

                this.setDraggable(true, {
                    containment: "document",
                    handle: ".header"
                });

                this.getElement().offset({ top: 0, left: 0 });

                if (this.$closeBtn) {
                    this.$closeBtn.click(function (e) {
                        pPopup.close();
                    });
                }
            }
            Popup.prototype.getTitle = function () {
                return this.$title.html();
            };

            Popup.prototype.setTitle = function (sTitle) {
                this.$title.html(sTitle || "");
            };

            Popup.prototype.setupSignals = function () {
                this.closed = this.closed || new akra.Signal(this);
                this.move = this.move || new MoveSignal(this);

                _super.prototype.setupSignals.call(this);
            };

            Popup.prototype.close = function () {
                this.closed.emit();
            };

            Popup.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);
                this.setTitle($comp.attr("title"));
            };

            Popup.MoveSignal = MoveSignal;
            return Popup;
        })(ui.Component);
        ui.Popup = Popup;

        ui.register("Popup", Popup);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUITabs.ts" />
/// <reference path="../idl/IUIPanel.ts" />
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    (function (ui) {
        var Tabs = (function (_super) {
            __extends(Tabs, _super);
            function Tabs(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 6 /* TABS */; }
                _super.call(this, parent, options, eType, $("<div class=\"component-tabs\"><div class=\"bookmarks\"></div></div>"));
                this._pTabs = [];
                this._iActiveTab = -1;

                this.$bookmarks = this.getElement().find(".bookmarks:first");
            }
            Tabs.prototype.getActiveTab = function () {
                return this._pTabs[this._iActiveTab] || null;
            };

            Tabs.prototype.getLength = function () {
                return this._pTabs.length;
            };

            Tabs.prototype.addChild = function (pEntity) {
                akra.logger.assert(ui.isPanel(pEntity), "only panels can be added to Tabs");

                var pPanel = pEntity;

                akra.logger.assert(!pPanel.isCollapsible(), "panel cannot be collapsible!");

                this.createBookmarkFor(pPanel);

                // this.connect(pPanel, SIGNAL(titleUpdated), SLOT(_tabTitleUpdated));
                pPanel.titleUpdated.connect(this, this._tabTitleUpdated);

                pPanel.index = this._pTabs.length;

                this._pTabs.push(pPanel);

                if (this._pTabs.length > 1) {
                    pPanel.hide();
                } else {
                    this.select(0);
                }

                return _super.prototype.addChild.call(this, pEntity);
            };

            Tabs.prototype.tabIndex = function (pPanel) {
                for (var i = 0; i < this._pTabs.length; ++i) {
                    if (pPanel == this._pTabs[i]) {
                        return i;
                    }
                }

                return -1;
            };

            Tabs.prototype.findTabByTitle = function (sName) {
                for (var i = 0; i < this._pTabs.length; ++i) {
                    if (this._pTabs[i].getTitle() === sName) {
                        return i;
                    }
                }

                return -1;
            };

            Tabs.prototype.findTab = function (sName) {
                for (var i = 0; i < this._pTabs.length; ++i) {
                    if (this._pTabs[i].getName() === sName) {
                        return i;
                    }
                }

                return -1;
            };

            Tabs.prototype.tab = function (iTab) {
                return this._pTabs[iTab];
            };

            Tabs.prototype.select = function (panel) {
                var n = 0;

                if (akra.isInt(panel)) {
                    n = panel;
                } else {
                    n = this.tabIndex(panel);
                }

                if (n == this._iActiveTab || n < 0 || n > this._pTabs.length) {
                    return;
                }

                if (!akra.isNull(this.getActiveTab())) {
                    this.getActiveTab().hide();
                    this.bookmarkFor(this.getActiveTab()).removeClass("active");
                }

                this.bookmarkFor(this._pTabs[n]).addClass("active");
                this._pTabs[n].show();
                this._pTabs[n].selected.emit();

                this._iActiveTab = n;
            };

            Tabs.prototype._tabTitleUpdated = function (pPanel, sTitle) {
                this.bookmarkFor(pPanel).html(sTitle);
            };

            Tabs.prototype.bookmarkFor = function (pPanel) {
                return this.$bookmarks.find("#tab-" + pPanel.guid);
            };

            Tabs.prototype.createBookmarkFor = function (pPanel) {
                var $bookmark = $("<div class=\"bookmark\" id=\"tab-" + pPanel.guid + "\">" + pPanel.getTitle() + "</div>");
                this.$bookmarks.append($bookmark);

                var pTabs = this;
                $bookmark.click(function (e) {
                    pTabs.select(pPanel.index);
                });
            };
            return Tabs;
        })(ui.Component);
        ui.Tabs = Tabs;

        ui.register("Tabs", Tabs);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUIButton.ts" />
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    (function (_ui) {
        var ClickSignal = (function (_super) {
            __extends(ClickSignal, _super);
            function ClickSignal() {
                _super.apply(this, arguments);
            }
            ClickSignal.prototype.emit = function (e) {
                e.stopPropagation();
                _super.prototype.emit.call(this, e);
            };
            return ClickSignal;
        })(akra.Signal);

        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(ui, options, eType) {
                if (typeof eType === "undefined") { eType = 2 /* BUTTON */; }
                _super.call(this, ui, options, eType, $("<button class=\"component-button\"/>"));

                this.handleEvent("click");
            }
            Button.prototype.getText = function () {
                return this.getElement().html();
            };
            Button.prototype.setText = function (x) {
                this.getElement().html(x);
            };

            Button.prototype.setupSignals = function () {
                this.click = this.click || new ClickSignal(this);
                _super.prototype.setupSignals.call(this);
            };

            Button.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);

                var sImage = $comp.attr("img");

                if (akra.isString(sImage)) {
                    this.setText(("<img src='" + sImage + "' />"));
                } else {
                    this.setText($comp.attr("text") || (sImage ? "" : "push"));
                }
            };

            Button.prototype.applyOptions = function (pOptions) {
                _super.prototype.applyOptions.call(this, pOptions);
                this.setText(pOptions.text || "push");
            };

            Button.ClickSignal = ClickSignal;
            return Button;
        })(_ui.Component);
        _ui.Button = Button;

        _ui.register("Button", Button);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="Component.ts" />
/// <reference path="Button.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var MouseleaveSignal = (function (_super) {
            __extends(MouseleaveSignal, _super);
            function MouseleaveSignal() {
                _super.apply(this, arguments);
            }
            MouseleaveSignal.prototype.emit = function (e) {
                _super.prototype.emit.call(this, e);
                this.getSender().getLayout().hide();
            };
            return MouseleaveSignal;
        })(akra.Signal);

        var MouseenterSignal = (function (_super) {
            __extends(MouseenterSignal, _super);
            function MouseenterSignal() {
                _super.apply(this, arguments);
            }
            MouseenterSignal.prototype.emit = function (e) {
                _super.prototype.emit.call(this, e);
                this.getSender().getLayout().show();
            };
            return MouseenterSignal;
        })(akra.Signal);

        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 9 /* MENU */; }
                _super.call(this, parent, ui.mergeOptions({ layout: 2 /* VERTICAL */ }, options), eType, $("<div class=\"component-menu\">\
					<div class=\"menu-title\"></div>\
				</div>"));

                this.$title = this.getElement().find(".menu-title:first");

                this.handleEvent("mouseenter mouseleave");
            }
            Menu.prototype.setupSignals = function () {
                this.mouseleave = this.mouseleave || new MouseleaveSignal(this);
                this.mouseenter = this.mouseenter || new MouseenterSignal(this);

                _super.prototype.setupSignals.call(this);
            };

            Menu.prototype.getText = function () {
                return this.$title.html();
            };
            Menu.prototype.setText = function (s) {
                this.$title.html(s);
            };

            Menu.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);

                var sText = $comp.attr("text");

                if (akra.isString(sText)) {
                    this.setText(sText);
                }
            };

            Menu.MouseleaveSignal = MouseleaveSignal;
            Menu.MouseenterSignal = MouseenterSignal;
            return Menu;
        })(ui.Component);
        ui.Menu = Menu;

        ui.register("Menu", Menu);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="IUIComponent.ts" />
/// <reference path="../idl/IUISwitch.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Switch = (function (_super) {
            __extends(Switch, _super);
            function Switch(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 3 /* SWITCH */; }
                var _this = this;
                _super.call(this, parent, options, eType, $(("<div class=\"component-switch\">" + "<input type=\"checkbox\" id=\"slider-$1\" />" + "<label for=\"slider-$1\"></label>" + "</div>").replace(/\$1/g, String(akra.guid()))));

                // this.handleEvent("click");
                this.$checkbox = this.getElement().find("input[type=checkbox]");

                this.$checkbox.click(function (e) {
                    e.stopPropagation();
                    _this.changed.emit(_this.getValue());
                });
            }
            Switch.prototype.getValue = function () {
                return this.isOn();
            };

            Switch.prototype.setValue = function (bValue) {
                if (bValue != this.getValue()) {
                    this._setValue(bValue);
                    this.changed.emit(bValue);
                }
            };

            Switch.prototype.setupSignals = function () {
                this.changed = this.changed || new akra.Signal(this);
                _super.prototype.setupSignals.call(this);
            };

            Switch.prototype._setValue = function (bValue) {
                this.$checkbox.prop('checked', bValue);
            };

            Switch.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);

                this.setValue(akra.isDef($comp.attr("on")));
            };

            Switch.prototype.isOn = function () {
                return this.$checkbox.is(':checked');
            };
            return Switch;
        })(ui.Component);
        ui.Switch = Switch;

        ui.register("Switch", Switch);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUILabel.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (_ui) {
        var ClickSignal = (function (_super) {
            __extends(ClickSignal, _super);
            function ClickSignal() {
                _super.apply(this, arguments);
            }
            ClickSignal.prototype.emit = function (e) {
                var pLabel = this.getSender();

                pLabel.$text.css("display", "none");
                pLabel.$input.val(pLabel.getText());
                pLabel.$input.css("display", "-block").focus();

                _super.prototype.emit.call(this, e);
            };
            return ClickSignal;
        })(akra.Signal);

        var FocusoutSignal = (function (_super) {
            __extends(FocusoutSignal, _super);
            function FocusoutSignal() {
                _super.apply(this, arguments);
            }
            FocusoutSignal.prototype.emit = function (e) {
                var pLabel = this.getSender();

                var sText = pLabel.$input.val();
                var isChanged = (pLabel.getText() !== sText);

                pLabel.setText(sText);
                pLabel.$text.css("display", "block");
                pLabel.$input.css("display", "none");

                if (isChanged) {
                    pLabel.changed.emit(sText);
                }

                _super.prototype.emit.call(this, e);
            };
            return FocusoutSignal;
        })(akra.Signal);

        var KeydownSignal = (function (_super) {
            __extends(KeydownSignal, _super);
            function KeydownSignal() {
                _super.apply(this, arguments);
            }
            KeydownSignal.prototype.emit = function (e) {
                var pLabel = this.getSender();

                if (pLabel.$input.is(":focus")) {
                    if (e.keyCode == 13 /* ENTER */) {
                        pLabel.focusout.emit(e);
                    }
                }

                _super.prototype.emit.call(this, e);
            };
            return KeydownSignal;
        })(akra.Signal);

        var Label = (function (_super) {
            __extends(Label, _super);
            function Label(ui, options, eType) {
                if (typeof eType === "undefined") { eType = 7 /* LABEL */; }
                _super.call(this, ui, options, eType, $("<div>\
					<div class='label-text'></div>\
					<input \
					onfocus=\"this.style.width = ((this.value.length + 1) * 6) + 'px';\" \
					onkeyup=\"this.style.width = ((this.value.length + 1) * 6) + 'px';\" class='label-input' style='display:none;' type='text' value=''/>\
				</div>"));
                this._bEditable = false;
                this._sPostfix = null;

                this.$text = this.$element.find(".label-text");
                this.$input = this.$element.find(".label-input");

                this.setText(akra.isObject(options) ? options.text || "" : "");
                this.editable(akra.isObject(options) ? options.editable || false : false);
            }
            Label.prototype.getText = function () {
                var s = this.$text.html();
                return s.substr(0, s.length - (this._sPostfix || "").length);
            };

            Label.prototype.setText = function (x) {
                this.$text.html(x + (this._sPostfix || ""));
            };
            Label.prototype.setPostfix = function (s) {
                this._sPostfix = s;
            };
            Label.prototype.getPostfix = function () {
                return this._sPostfix;
            };

            Label.prototype.setupSignals = function () {
                this.click = this.click || new ClickSignal(this);
                this.changed = this.changed || new akra.Signal(this);
                this.focusout = this.focusout || new FocusoutSignal(this);
                this.keydown = this.keydown || new KeydownSignal(this);

                _super.prototype.setupSignals.call(this);
            };

            Label.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);

                this.setText($comp.attr("text"));
                this.editable(akra.isDef($comp.attr("editable")) || false);
                this.setPostfix($comp.attr("postfix"));
            };

            Label.prototype.isEditable = function () {
                return this._bEditable;
            };

            Label.prototype.editable = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                this._bEditable = bValue;

                if (bValue) {
                    this.handleEvent("click keydown focusout");
                    this.getElement().addClass("editable");
                } else {
                    this.getElement().removeClass("editable");
                    this.disableEvent("click keydown focusout");
                }
            };

            Label.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-label");
            };

            Label.ClickSignal = ClickSignal;
            Label.FocusoutSignal = FocusoutSignal;
            Label.KeydownSignal = KeydownSignal;
            return Label;
        })(_ui.Component);
        _ui.Label = Label;

        _ui.register("Label", Label);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUILabel.ts" />
/// <reference path="../idl/IUIVector.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (_ui) {
        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        function prettifyNumber(x) {
            if (x === akra.math.floor(x)) {
                return "" + x + ".";
            }

            return x.toFixed(2);
        }

        var ChangedSignal = (function (_super) {
            __extends(ChangedSignal, _super);
            function ChangedSignal() {
                _super.apply(this, arguments);
            }
            ChangedSignal.prototype.emit = function (pLabel, sValue) {
                var pVector = this.getSender();

                if (pVector.$lock.prop("checked")) {
                    //pVector.x.setText(pVector.y.setText(pVector.z.setText(pVector.w.setText(sValue;
                    pVector.x.setText(sValue);
                    pVector.y.setText(sValue);
                    pVector.z.setText(sValue);
                    pVector.w.setText(sValue);
                }

                _super.prototype.emit.call(this, pVector.getValue());
            };
            return ChangedSignal;
        })(akra.Signal);

        var Vector = (function (_super) {
            __extends(Vector, _super);
            function Vector(ui, options, eType) {
                if (typeof eType === "undefined") { eType = 8 /* VECTOR */; }
                _super.call(this, ui, options, eType);
                this.totalComponents = 4;
                this._iFixed = 2;
                this._bEditable = false;

                this.template("Vector.tpl");

                this.x = this.findEntity('x');
                this.y = this.findEntity('y');
                this.z = this.findEntity('z');
                this.w = this.findEntity('w');

                //this.connect(this.x, SIGNAL(changed), SLOT(changed));
                //this.connect(this.y, SIGNAL(changed), SLOT(changed));
                //this.connect(this.z, SIGNAL(changed), SLOT(changed));
                //this.connect(this.w, SIGNAL(changed), SLOT(changed));
                this.x.changed.connect(this.changed);
                this.y.changed.connect(this.changed);
                this.z.changed.connect(this.changed);
                this.w.changed.connect(this.changed);

                this.$lock = this.getElement().find("input[type=checkbox]:first");

                this.setVec4(Vec4.temp(0.));
            }
            Vector.prototype.setupSignals = function () {
                this.changed = this.changed || new ChangedSignal(this);
                _super.prototype.setupSignals.call(this);
            };

            Vector.prototype.getValue = function () {
                switch (this.totalComponents) {
                    case 2:
                        return this.toVec2();
                    case 3:
                        return this.toVec3();
                    case 4:
                        return this.toVec4();
                }

                return null;
            };

            Vector.prototype._createdFrom = function ($comp) {
                var bValue = akra.isDefAndNotNull($comp.attr("editable")) || false;
                var sPostfix = $comp.attr("postfix") || null;

                this.x.setPostfix(sPostfix);
                this.y.setPostfix(sPostfix);
                this.z.setPostfix(sPostfix);
                this.w.setPostfix(sPostfix);

                this.editable(bValue);
            };

            Vector.prototype.editable = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (bValue) {
                    this.getElement().addClass("editable");
                    this.$lock.show();
                } else {
                    this.getElement().removeClass("editable");
                    this.$lock.hide();
                }

                this.x.editable(bValue);
                this.y.editable(bValue);
                this.z.editable(bValue);
                this.w.editable(bValue);

                this._bEditable = bValue;
            };

            Vector.prototype.isEditable = function () {
                return this._bEditable;
            };

            Vector.prototype.useComponents = function (n) {
                if (n === this.totalComponents) {
                    return;
                }
                var pSpanList = this.getElement().find(">span");

                switch (n) {
                    case 2:
                        $(pSpanList[3]).css("display", "none");
                        $(pSpanList[2]).css("display", "none");
                        break;
                    case 3:
                        $(pSpanList[3]).css("display", "none");
                        $(pSpanList[2]).css("display", "-block");
                        break;
                    case 4:
                        $(pSpanList[3]).css("display", "-block");
                        $(pSpanList[2]).css("display", "-block");
                }

                this.totalComponents = n;
            };

            Vector.prototype.setVec2 = function (v) {
                var n = this._iFixed;
                this.x.setText(prettifyNumber(v.x));
                this.y.setText(prettifyNumber(v.y));

                this.useComponents(2);
            };

            Vector.prototype.setVec3 = function (v) {
                var n = this._iFixed;
                this.x.setText(prettifyNumber(v.x));
                this.y.setText(prettifyNumber(v.y));
                this.z.setText(prettifyNumber(v.z));

                this.useComponents(3);
            };

            Vector.prototype.setVec4 = function (v) {
                var n = this._iFixed;
                this.x.setText(prettifyNumber(v.x));
                this.y.setText(prettifyNumber(v.y));
                this.z.setText(prettifyNumber(v.z));
                this.w.setText(prettifyNumber(v.w));

                this.useComponents(4);
            };

            Vector.prototype.setColor = function (c) {
                this.x.setText(prettifyNumber(c.r));
                this.y.setText(prettifyNumber(c.g));
                this.z.setText(prettifyNumber(c.b));
                this.w.setText(prettifyNumber(c.a));
                this.useComponents(4);
            };

            Vector.prototype.toVec2 = function () {
                return Vec2.temp(parseFloat(this.x.getText()), parseFloat(this.y.getText()));
            };

            Vector.prototype.toVec3 = function () {
                return Vec3.temp(parseFloat(this.x.getText()), parseFloat(this.y.getText()), parseFloat(this.z.getText()));
            };

            Vector.prototype.toVec4 = function () {
                return Vec4.temp(parseFloat(this.x.getText()), parseFloat(this.y.getText()), parseFloat(this.z.getText()), parseFloat(this.w.getText()));
            };

            Vector.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-vector");
            };
            return Vector;
        })(_ui.Component);
        _ui.Vector = Vector;

        _ui.register("Vector", Vector);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUILayout.ts" />
/// <reference path="HTMLNode.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Layout = (function (_super) {
            __extends(Layout, _super);
            function Layout(parent, element, eType) {
                if (typeof element === "undefined") { element = $("<div class=\"layout\"/>"); }
                if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                _super.call(this, parent, element, 3 /* LAYOUT */);
                this._pAttrs = null;
                this._eLayoutType = eType;
            }
            Layout.prototype.getLayoutType = function () {
                return this._eLayoutType;
            };

            Layout.prototype.attachToParent = function (pParent) {
                //layout must be a first child
                if (akra.isNull(pParent) || !akra.isNull(pParent.getChild())) {
                    //return false;
                    //logger.warn("Node: \n" + pParent.toString(true) + "\nalready has layout node as child.");
                }

                return _super.prototype.attachToParent.call(this, pParent);
            };

            Layout.prototype.attr = function (sAttr) {
                return akra.isNull(this._pAttrs) ? null : this._pAttrs[sAttr];
            };

            Layout.prototype.setAttributes = function (pAttrs) {
                if (akra.isNull(pAttrs)) {
                    return;
                }

                this._pAttrs = pAttrs;
            };

            Layout.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return '<layout' + (this.getName() ? " " + this.getName() : "") + '>';
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };
            return Layout;
        })(ui.HTMLNode);
        ui.Layout = Layout;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="Layout.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Horizontal = (function (_super) {
            __extends(Horizontal, _super);
            function Horizontal(parent) {
                //style=\"margin: 0 auto;\"
                _super.call(this, parent, $("<div class='layout horizontal'><table/></div>"), 1 /* HORIZONTAL */);

                this.$table = this.$element.find("table:first");
                this.$row = $("<tr />");
                this.$table.append(this.$row);
            }
            Horizontal.prototype.renderTarget = function () {
                var $td = $("<td />");
                this.$row.append($td);
                return $td;
            };

            Horizontal.prototype.removeChild = function (pChild) {
                if (ui.containsHTMLElement(pChild)) {
                    pChild.$element.parent().remove();
                }

                return _super.prototype.removeChild.call(this, pChild);
            };

            Horizontal.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return '<horizontal' + (this.getName() ? " " + this.getName() : "") + '>';
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };
            return Horizontal;
        })(ui.Layout);
        ui.Horizontal = Horizontal;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="Layout.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Vertical = (function (_super) {
            __extends(Vertical, _super);
            function Vertical(parent) {
                _super.call(this, parent, $("<div class='layout vertical'><table /></div>"), 2 /* VERTICAL */);

                this.$table = this.$element.find("table:first");
            }
            Vertical.prototype.renderTarget = function () {
                var $trtd = $("<tr><td /></tr>");
                this.$table.append($trtd);
                return $trtd.find("> td");
            };

            Vertical.prototype.removeChild = function (pChild) {
                if (ui.containsHTMLElement(pChild)) {
                    var $el = pChild.$element;
                    $el.parent().parent().remove();
                }

                return _super.prototype.removeChild.call(this, pChild);
            };

            Vertical.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return '<vertical' + (this.getName() ? " " + this.getName() : "") + '>';
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };
            return Vertical;
        })(ui.Layout);
        ui.Vertical = Vertical;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <referece path="Component.ts" />
/// <referece path="../idl/IUISlider.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Slider = (function (_super) {
            __extends(Slider, _super);
            function Slider(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 13 /* SLIDER */; }
                _super.call(this, parent, options, eType);
                this._fRange = 100.0;
                this._fValue = 0.0;

                this.getUI().createComponent("pin", { class: "component-pin" }).attachToParent(this);
                this.getElement().append("<div class=\"slider-text\"></div>");

                //this.$progress = this.$element.find(".slider-progress");
                this.$text = this.$element.find(".slider-text");

                this.getPin().setDraggable();

                // this.connect(this.getPin(), SIGNAL(move), SLOT(_updated));
                this.getPin().move.connect(this, this._updated);
            }
            Slider.prototype.getPin = function () {
                return this.getChild();
            };
            Slider.prototype.getValue = function () {
                return this._fValue * this._fRange;
            };
            Slider.prototype.getRange = function () {
                return this._fRange;
            };
            Slider.prototype.setRange = function (fValue) {
                this._fRange = fValue;
            };
            Slider.prototype.getText = function () {
                return this.$text.text();
            };
            Slider.prototype.setText = function (s) {
                this.$text.text(s);
            };

            Slider.prototype.setValue = function (fValue) {
                if (fValue == this._fValue) {
                    return;
                }

                fValue = akra.math.clamp(fValue / this._fRange, 0., 1.);

                var iElementOffset = this.$element.offset().left;

                var iPixelTotal = this.$element.width() - this.getPin().$element.width();

                var iPixelCurrent = iPixelTotal * fValue;
                var iPinOffset = iPixelCurrent + iElementOffset + 1;

                this.getPin().$element.offset({ left: iPinOffset });

                this._fValue = fValue;

                this.updated.emit(this.getValue());
            };

            Slider.prototype.setupSignals = function () {
                this.updated = this.updated || new akra.Signal(this);

                _super.prototype.setupSignals.call(this);
            };

            Slider.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-slider");
            };

            Slider.prototype._updated = function (pPin, e) {
                var fValuePrev = this._fValue;
                var fValue;

                var iPinOffset = this.getPin().$element.offset().left;
                var iElementOffset = this.$element.offset().left;

                var iPixelTotal = this.$element.width() - this.getPin().$element.width();

                //FIXME: white offsets not equals????
                var iPixelCurrent = iPinOffset - iElementOffset - 1;

                fValue = this._fValue = akra.math.clamp(iPixelCurrent / iPixelTotal, 0., 1.);

                if (fValue != fValuePrev) {
                    this.updated.emit(this.getValue());
                    // console.log("updated", this.value);
                }
            };

            Slider.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);

                var sRange = $comp.attr("range");

                if (akra.isString(sRange)) {
                    this.setRange(parseFloat(sRange));
                }

                var sValue = $comp.attr("value");

                if (akra.isString(sValue)) {
                    this.setValue(parseFloat(sValue));
                }
            };

            Slider.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return '<slider' + (this.getName() ? " " + this.getName() : "") + '>';
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };
            return Slider;
        })(ui.Component);
        ui.Slider = Slider;

        ui.register("Slider", Slider);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUICheckbox.ts" />
/// <reference path="../idl/IUICheckboxList.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var ClickSignal = (function (_super) {
            __extends(ClickSignal, _super);
            function ClickSignal() {
                _super.apply(this, arguments);
            }
            ClickSignal.prototype.emit = function (e) {
                var pChb = this.getSender();
                pChb.setChecked(!pChb.isChecked());
                e.stopPropagation();
                _super.prototype.emit.call(this, e);
            };
            return ClickSignal;
        })(akra.Signal);

        var Checkbox = (function (_super) {
            __extends(Checkbox, _super);
            function Checkbox(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 14 /* CHECKBOX */; }
                _super.call(this, ui.getUI(parent), options, eType, $("<div><span class=\"checkbox-item-text\"></span></div>"));
                this._bChecked = false;

                this.$text = this.$element.find(".checkbox-item-text:first");

                if (akra.isDefAndNotNull(options) && akra.isString(options.text)) {
                    this.setText(options.text);
                }

                if (!ui.isUI(parent)) {
                    this.attachToParent(parent);
                }

                this.setText(akra.isObject(options) ? options.text || "" : "");
                this.handleEvent("click");
            }
            Checkbox.prototype.setChecked = function (bValue) {
                var bPrev = this.isChecked();

                this._setValue(bValue);

                if (bValue != bPrev) {
                    this.changed.emit(bValue);
                }
            };

            Checkbox.prototype.getText = function () {
                return this.$text.html();
            };
            Checkbox.prototype.setText = function (sValue) {
                this.$text.html(sValue);
            };

            Checkbox.prototype._setValue = function (bValue) {
                if (bValue) {
                    this.$element.addClass("active");
                } else {
                    this.$element.removeClass("active");
                }

                this._bChecked = bValue;
            };

            Checkbox.prototype.setupSignals = function () {
                this.changed = this.changed || new akra.Signal(this);
                _super.prototype.setupSignals.call(this);
            };

            Checkbox.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);
                this.setText($comp.attr("text"));

                if (akra.isDef($comp.attr("checked"))) {
                    this.setChecked(true);
                }

                var sImage = $comp.attr("img");
                if (akra.isString(sImage)) {
                    this.$text.before("<img src='" + sImage + "' />");
                }
            };

            Checkbox.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-checkbox");
            };

            Checkbox.prototype.isChecked = function () {
                return this._bChecked;
            };

            Checkbox.prototype.toString = function (isRecursive, iDepth) {
                if (typeof isRecursive === "undefined") { isRecursive = false; }
                if (typeof iDepth === "undefined") { iDepth = 0; }
                if (!isRecursive) {
                    return '<checkbox' + (this.getName() ? " " + this.getName() : "") + '>';
                }

                return _super.prototype.toString.call(this, isRecursive, iDepth);
            };

            Checkbox.ClickSignal = ClickSignal;
            return Checkbox;
        })(ui.Component);
        ui.Checkbox = Checkbox;

        function isCheckbox(pEntity) {
            return ui.isComponent(pEntity, 14 /* CHECKBOX */);
        }
        ui.isCheckbox = isCheckbox;

        ui.register("Checkbox", Checkbox);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUICheckboxList.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var CheckboxList = (function (_super) {
            __extends(CheckboxList, _super);
            function CheckboxList(parent, options, eType) {
                if (typeof eType === "undefined") { eType = 15 /* CHECKBOX_LIST */; }
                _super.call(this, parent, options, eType);
                this._nSize = 0;
                this._pItems = [];
                this._bMultiSelect = false;
                this._bLikeRadio = false;

                this.setLayout(1 /* HORIZONTAL */);

                this.getLayout().childAdded.connect(this, this._childAdded, 0 /* UNICAST */);
                this.getLayout().childRemoved.connect(this, this._childRemoved, 0 /* UNICAST */);

                // this.connect(this.layout, SIGNAL(childAdded), SLOT(_childAdded), EEventTypes.UNICAST);
                // this.connect(this.layout, SIGNAL(childRemoved), SLOT(_childRemoved), EEventTypes.UNICAST);\
                var pChild = this.getLayout().getChild();

                while (!akra.isNull(pChild)) {
                    if (ui.isCheckbox(pChild)) {
                        this.addCheckbox(pChild);
                    }

                    pChild = pChild.getSibling();
                }
            }
            CheckboxList.prototype.getLength = function () {
                return this._nSize;
            };
            CheckboxList.prototype.isRadio = function () {
                return this._bLikeRadio;
            };
            CheckboxList.prototype.setRadio = function (b) {
                this._bLikeRadio = b;
            };
            CheckboxList.prototype.getItems = function () {
                return this._pItems;
            };

            CheckboxList.prototype.isChecked = function () {
                for (var i = 0; i < this._pItems.length; ++i) {
                    if (this._pItems[i].isChecked()) {
                        return this._pItems[i];
                    }
                }

                return null;
            };

            CheckboxList.prototype.setupSignals = function () {
                this.changed = this.changed || new akra.Signal(this);
                _super.prototype.setupSignals.call(this);
            };

            CheckboxList.prototype._createdFrom = function ($comp) {
                _super.prototype._createdFrom.call(this, $comp);
                this.setRadio(akra.isDef($comp.attr("radio")) && $comp.attr("radio").toLowerCase() !== "false");
                this._bMultiSelect = akra.isDef($comp.attr("multiselect")) && $comp.attr("multiselect").toLowerCase() !== "false";
            };

            CheckboxList.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-checkboxlist");
            };

            CheckboxList.prototype.hasMultiSelect = function () {
                return this._bMultiSelect;
            };

            //when checkbox added to childs
            CheckboxList.prototype.update = function () {
                var pItems = this._pItems;

                if (pItems.length == 0) {
                    return;
                }

                pItems.first.$element.addClass("first");

                for (var i = 0; i < pItems.length - 1; ++i) {
                    pItems[i].$element.removeClass("last");
                }
                ;

                pItems.last.$element.addClass("last");

                return _super.prototype.update.call(this);
            };

            CheckboxList.prototype.addCheckbox = function (pCheckbox) {
                this._pItems.push(pCheckbox);

                // this.connect(pCheckbox, SIGNAL(changed), SLOT(_changed));
                pCheckbox.changed.connect(this, this._changed);
                this.update();
            };

            CheckboxList.prototype._childAdded = function (pLayout, pNode) {
                if (ui.isCheckbox(pNode)) {
                    this.addCheckbox(pNode);
                }
            };

            CheckboxList.prototype._childRemoved = function (pLayout, pNode) {
                if (ui.isCheckbox(pNode)) {
                    var i = this._pItems.indexOf(pNode);
                    if (i != -1) {
                        var pCheckbox = this._pItems[i];

                        // this.disconnect(pCheckbox, SIGNAL(changed), SLOT(_changed));
                        pCheckbox.changed.disconnect(this, this._changed);

                        this._pItems.splice(i, 1);
                        this.update();
                    }
                }
            };

            CheckboxList.prototype._changed = function (pCheckbox, bCheked) {
                if (this.hasMultiSelect()) {
                    this.changed.emit(pCheckbox);
                    return;
                } else {
                    if (!bCheked && this.isRadio()) {
                        pCheckbox.setChecked(true);
                        return;
                    }

                    var pItems = this._pItems;
                    for (var i = 0; i < pItems.length; ++i) {
                        if (pItems[i] === pCheckbox) {
                            continue;
                        }

                        pItems[i]._setValue(false);
                    }

                    this.changed.emit(pCheckbox);
                }
            };
            return CheckboxList;
        })(ui.Component);
        ui.CheckboxList = CheckboxList;

        ui.register("CheckboxList", CheckboxList);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
// IUIWindow export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
/// <reference path="../idl/IUIWindow.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        var Window = (function (_super) {
            __extends(Window, _super);
            function Window(pUI, options) {
                _super.call(this, pUI, options, 1 /* WINDOW */);

                this._pWindow = window.open("", "", "height=480, width=640", false);
                this.$document = $(this._pWindow.document);
                this.$element = this.$document.find("body");

                this.$document.find("head").append(ui.$document.find("link"));

                //clear window content
                this.$element.html("");
            }
            return Window;
        })(ui.Component);
        ui.Window = Window;

        ui.register("Window", Window);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="../idl/IUIRenderTargetStats.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    (function (_ui) {
        var RenderTargetStats = (function (_super) {
            __extends(RenderTargetStats, _super);
            function RenderTargetStats(ui, options, pRenderTarget) {
                _super.call(this, ui, options, 16 /* VIEWPORT_STATS */, $("<div class=\"component-fps\" ><div class=\"info\"></div><div class=\"graph\"></div></div>"));
                this._pRenderTarget = null;
                this._pUpdateInterval = -1;

                var $graph = this.getElement().find(".graph");
                var pInfo = this.getElement().find(".info").get()[0];
                var pTicks = [];
                var pValues = [];

                //FIXME: write float adaptive values
                var iTotal = 100;

                for (var i = 0; i < iTotal; ++i) {
                    var $tick = $("<span class=\"tick\"/>");
                    $graph.append($tick);

                    pTicks.push($tick.get()[0]);
                    pValues.push(0);
                }

                this._pInfoElement = pInfo;
                this._pValues = pValues;
                this._pTicks = pTicks;

                if (akra.isDefAndNotNull(pRenderTarget)) {
                    this.setTarget(pRenderTarget);
                }
            }
            RenderTargetStats.prototype.getInfo = function () {
                return this._pInfoElement;
            };
            RenderTargetStats.prototype.getTarget = function () {
                return this._pRenderTarget;
            };

            RenderTargetStats.prototype.setTarget = function (pRenderTarget) {
                var _this = this;
                if (!akra.isNull(this._pRenderTarget)) {
                    //this.disconnect(this._pRenderTarget, SIGNAL(postUpdate), SLOT(updateStats));
                    clearInterval(this._pUpdateInterval);
                }

                //this.connect(pRenderTarget, SIGNAL(postUpdate), SLOT(updateStats));
                this._pRenderTarget = pRenderTarget;
                this._pUpdateInterval = setInterval(function () {
                    _this.updateStats();
                }, 1000);
            };

            RenderTargetStats.prototype.updateStats = function () {
                var pTarget = this.getTarget();
                var pStat = pTarget.getStatistics();
                var fFPS = pStat.fps.last;
                var v = this._pValues;
                var iTotal = v.length;
                var iMaxHeight = 27;
                var sFps = fFPS.toFixed(2);

                for (var i = 0, n = iTotal - 1; i < n; ++i) {
                    v[i] = v[i + 1];
                }

                v[n] = fFPS;

                this.getInfo().textContent = "FPS: " + ((v[n] < 100 ? (v[n] < 10 ? "  " + sFps : " " + sFps) : sFps));

                var max = akra.math.max.apply(akra.math, v);
                var pTicks = this._pTicks;

                for (var i = 0; i < iTotal; ++i) {
                    pTicks[i].style.height = akra.math.floor(v[i] / max * iMaxHeight) + "px";

                    var fColor = akra.math.min(v[i], 60.) / 60.;

                    pTicks[i].style.backgroundColor = "rgb(" + (akra.math.floor((1 - fColor) * 125) + 125) + ", " + (akra.math.floor(fColor * 125) + 125) + ", 0)";
                }
            };

            RenderTargetStats.prototype.finalizeRender = function () {
                this.getElement().addClass("component-fps");
            };
            return RenderTargetStats;
        })(_ui.Component);
        _ui.RenderTargetStats = RenderTargetStats;

        _ui.register("RenderTargetStats", RenderTargetStats);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="IUITree.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="IUITreeNode.ts" />
/// <reference path="../idl/IUITree.ts" />
/// <reference path="../idl/IUITreeNode.ts" />
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    (function (_ui) {
        var TreeNode = (function () {
            function TreeNode(pTree, pSource) {
                this.el = null;
                this.parent = null;
                this.tree = null;
                this.source = null;
                this.expanded = false;
                this._pNodeMap = {};
                this.$childrenNode = null;
                this.tree = pTree;
                this.source = pSource;

                akra.debug.assert(!akra.isNull(pSource), "source entity can not be null");

                var pNode = this;

                this.el = $("<li><label  for=\"" + this.getID() + "\">" + this.sourceName() + "</label></li>");
                this.getElement().find("label:first").click(function (e) {
                    e.stopPropagation();
                    pNode.select();
                });

                this.tree._link(this);

                this.sync();
            }
            TreeNode.prototype.getTotalChildren = function () {
                return Object.keys(this._pNodeMap).length;
            };

            TreeNode.prototype.getElement = function () {
                return this.el;
            };

            /** Is this tree node currently selected? */
            TreeNode.prototype.isSelected = function () {
                return this.tree.isSelected(this);
            };

            TreeNode.prototype.setSelected = function (bValue) {
                if (!this.isSelected() && !bValue) {
                    this.getElement().find("label:first").removeClass("selected");
                } else if (this.isSelected() && bValue) {
                    this.getElement().find("label:first").addClass("selected");
                }
            };

            TreeNode.prototype.expand = function (bValue) {
                if (typeof bValue === "undefined") { bValue = true; }
                if (this.getTotalChildren()) {
                    this.getElement().find("input").attr("checked", bValue);
                }

                this.expanded = bValue;
            };

            TreeNode.prototype.select = function (isSelect) {
                if (typeof isSelect === "undefined") { isSelect = true; }
                return this.tree.select(this);
            };

            TreeNode.prototype.getID = function () {
                return "node-guid-" + this.source.guid;
            };

            TreeNode.prototype.sync = function (bRecursive) {
                if (typeof bRecursive === "undefined") { bRecursive = true; }
                this.getElement().find("label:first").html(this.sourceName());

                if (bRecursive) {
                    var pChildren = this.source.children();

                    var pChildMap = {};

                    for (var i = 0; i < pChildren.length; ++i) {
                        var pChild = pChildren[i];
                        pChildMap[pChild.guid] = pChild;

                        if (!this.inChildren(pChild)) {
                            this.addChild(this.tree._createNode(pChild));
                        }
                    }

                    for (var iGuid in this._pNodeMap) {
                        if (!akra.isDef(pChildMap[iGuid])) {
                            this._pNodeMap[iGuid].destroy();
                        }
                    }
                }
            };

            TreeNode.prototype.synced = function () {
                this.getElement().find("label:first").removeClass("updating");
            };

            TreeNode.prototype.waitForSync = function () {
                this.getElement().find("label:first").addClass("updating");
            };

            TreeNode.prototype.removeChildren = function () {
                for (var i in this._pNodeMap) {
                    if (!akra.isNull(this._pNodeMap[i])) {
                        this._pNodeMap[i].destroy();
                        this._pNodeMap[i] = null;
                    }
                }
            };

            TreeNode.prototype.inChildren = function (pNode) {
                return akra.isDefAndNotNull(this._pNodeMap[pNode.guid]);
            };

            TreeNode.prototype.sourceName = function () {
                return this.source.getName() ? this.source.getName() : "<span class=\"unnamed\">[unnamed]</span>";
            };

            TreeNode.prototype.addChild = function (pNode) {
                if (akra.isNull(this.$childrenNode)) {
                    this.getElement().append("<input " + (this.expanded ? "checked" : "") + " type=\"checkbox\"  id=\"" + this.getID() + "\" />");
                    this.getElement().removeClass("file");
                    this.$childrenNode = $("<ol />");
                    this.getElement().append(this.$childrenNode);
                }

                this.$childrenNode.append(pNode.el);
                this._pNodeMap[pNode.source.guid] = pNode;
            };

            TreeNode.prototype.destroy = function () {
                this.removeChildren();

                if (!akra.isNull(this.tree)) {
                    this.tree._unlink(this);
                    this.tree = null;
                }

                this.source = null;
                this.getElement().remove();
            };
            return TreeNode;
        })();
        _ui.TreeNode = TreeNode;

        var Tree = (function (_super) {
            __extends(Tree, _super);
            function Tree(ui, options, eType) {
                if (typeof eType === "undefined") { eType = 10 /* TREE */; }
                _super.call(this, ui, options, eType, $("<ol class='tree'/>"));
                this._pNodeMap = {};
                this._pRootNode = null;
                this._pSelectedNode = null;
            }
            Tree.prototype.fromTree = function (pEntity) {
                if (!akra.isNull(this._pRootNode)) {
                    akra.logger.critical("TODO: replace node");
                }

                this._pRootNode = this._createNode(pEntity);
                this._pRootNode.sync();
                this._pRootNode.expand();
                this.getElement().append(this._pRootNode.el);

                this._pRootNode.select();
            };

            Tree.prototype.getRootNode = function () {
                return this._pRootNode;
            };

            Tree.prototype.getSelectedNode = function () {
                return !akra.isNull(this._pSelectedNode) ? this._pSelectedNode.source : null;
            };

            Tree.prototype._select = function (pNode) {
                var pPrev = this._pSelectedNode;

                this._pSelectedNode = null;

                if (!akra.isNull(pPrev)) {
                    pPrev.setSelected(false);
                }

                this._pSelectedNode = pNode;

                if (!akra.isNull(this._pSelectedNode)) {
                    this._pSelectedNode.setSelected(true);
                }

                return true;
            };

            Tree.prototype.select = function (pNode) {
                return this._select(pNode);
            };

            Tree.prototype.selectByGuid = function (iGuid) {
                if (this._pSelectedNode && this._pSelectedNode.source.guid === iGuid) {
                    return;
                }

                var pNode = this._pNodeMap[iGuid];

                if (pNode) {
                    this._select(pNode);
                }
            };

            Tree.prototype.isSelected = function (pNode) {
                return this._pSelectedNode === pNode;
            };

            Tree.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-tree");
            };

            Tree.prototype._createNode = function (pEntity) {
                var pNode = new TreeNode(this, pEntity);
                return pNode;
            };

            Tree.prototype._link = function (pNode) {
                this._pNodeMap[pNode.source.guid] = pNode;
            };

            Tree.prototype._unlink = function (pNode) {
                this._pNodeMap[pNode.source.guid] = null;
            };

            Tree.prototype.sync = function (pEntity) {
                if (arguments.length && !akra.isNull(pEntity)) {
                    this._pNodeMap[pEntity.guid].sync(false);
                } else {
                    this.getRootNode().sync();
                }
            };
            return Tree;
        })(_ui.Component);
        _ui.Tree = Tree;

        _ui.register("Tree", Tree);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../Tree.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (scene) {
            var CameraNode = (function (_super) {
                __extends(CameraNode, _super);
                function CameraNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);

                    this.el.bind("dblclick", function () {
                        akra.logger.log("look through");
                    });

                    this.el.find("label:first").addClass("camera");
                }
                return CameraNode;
            })(ui.TreeNode);
            scene.CameraNode = CameraNode;

            var SceneObjectNode = (function (_super) {
                __extends(SceneObjectNode, _super);
                function SceneObjectNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);
                    //this.el.find("label:first").before("<div class=\"scene-object-show-btn\" />");
                }
                return SceneObjectNode;
            })(ui.TreeNode);
            scene.SceneObjectNode = SceneObjectNode;

            var SceneModelNode = (function (_super) {
                __extends(SceneModelNode, _super);
                function SceneModelNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);

                    this.el.find("label:first").addClass("scene-model");
                }
                return SceneModelNode;
            })(SceneObjectNode);
            scene.SceneModelNode = SceneModelNode;

            var ShadowCasterNode = (function (_super) {
                __extends(ShadowCasterNode, _super);
                function ShadowCasterNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);

                    this.el.find("label:first").addClass("shadow-caster");
                }
                return ShadowCasterNode;
            })(ui.TreeNode);
            scene.ShadowCasterNode = ShadowCasterNode;

            var JointNode = (function (_super) {
                __extends(JointNode, _super);
                function JointNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);

                    this.el.find("label:first").addClass("joint");
                }
                return JointNode;
            })(ui.TreeNode);
            scene.JointNode = JointNode;

            var LightPointNode = (function (_super) {
                __extends(LightPointNode, _super);
                function LightPointNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);

                    this.el.find("label:first").addClass("light-point");
                }
                return LightPointNode;
            })(ui.TreeNode);
            scene.LightPointNode = LightPointNode;

            var ModelEntryNode = (function (_super) {
                __extends(ModelEntryNode, _super);
                function ModelEntryNode(pTree, pSource) {
                    _super.call(this, pTree, pSource);

                    this.el.find("label:first").addClass("model-entry");
                }
                return ModelEntryNode;
            })(ui.TreeNode);
            scene.ModelEntryNode = ModelEntryNode;

            var SceneTree = (function (_super) {
                __extends(SceneTree, _super);
                function SceneTree(parent, options) {
                    _super.call(this, parent, options);
                    this._pScene = null;
                    this._iUpdateTimer = -1;
                    this._pIDE = null;
                }
                SceneTree.prototype.fromScene = function (pScene) {
                    this._pScene = pScene;

                    //this.connect(pScene, SIGNAL(nodeAttachment), SLOT(updateTree));
                    //this.connect(pScene, SIGNAL(nodeDetachment), SLOT(updateTree));
                    pScene.nodeAttachment.connect(this, this.updateTree);
                    pScene.nodeDetachment.connect(this, this.updateTree);

                    this.fromTree(pScene.getRootNode());
                };

                SceneTree.prototype.select = function (pNode) {
                    if (ui.ide.cmd(2 /* INSPECT_SCENE_NODE */, pNode.source)) {
                        return _super.prototype.select.call(this, pNode);
                    }

                    return false;
                };

                SceneTree.prototype.updateTree = function (pScene, pSceneNode) {
                    clearTimeout(this._iUpdateTimer);

                    var pTree = this;
                    pTree.getRootNode().waitForSync();

                    this._iUpdateTimer = setTimeout(function () {
                        pTree.sync();
                        pTree.getRootNode().synced();
                    }, 1000);
                };

                SceneTree.prototype._createNode = function (pEntity) {
                    if (akra.scene.light.ShadowCaster.isShadowCaster(pEntity)) {
                        return new ShadowCasterNode(this, pEntity);
                    }

                    if (akra.scene.SceneModel.isModel(pEntity)) {
                        return new SceneModelNode(this, pEntity);
                    }

                    if (akra.scene.Joint.isJoint(pEntity)) {
                        return new JointNode(this, pEntity);
                    }

                    if (akra.scene.light.LightPoint.isLightPoint(pEntity)) {
                        return new LightPointNode(this, pEntity);
                    }

                    if (akra.scene.objects.ModelEntry.isModelEntry(pEntity)) {
                        return new ModelEntryNode(this, pEntity);
                    }

                    if (akra.scene.objects.Camera.isCamera(pEntity)) {
                        return new CameraNode(this, pEntity);
                    }

                    return _super.prototype._createNode.call(this, pEntity);
                };
                return SceneTree;
            })(akra.ui.Tree);
            scene.SceneTree = SceneTree;

            scene.Tree = SceneTree;

            ui.register("SceneTree", SceneTree);
        })(ui.scene || (ui.scene = {}));
        var scene = ui.scene;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (animation) {
            var ColladaAnimation = (function (_super) {
                __extends(ColladaAnimation, _super);
                function ColladaAnimation(parent, options) {
                    _super.call(this, parent, options, 18 /* COLLADA_ANIMATION */);
                    this._pCollada = null;
                    this._iAnimation = 0;

                    this.template("animation.ColladaAnimation.tpl");

                    this._pNameLb = this.findEntity("collada-animation-name");

                    //this.connect(this._pNameLb, SIGNAL(changed), SLOT(_nameChanged));
                    this._pNameLb.changed.connect(this, this._nameChanged);
                }
                ColladaAnimation.prototype.getAnimation = function () {
                    return this._pCollada.getAnimation(this._iAnimation);
                };

                ColladaAnimation.prototype.getCollada = function () {
                    return this._pCollada;
                };

                ColladaAnimation.prototype.getIndex = function () {
                    return this._iAnimation;
                };

                ColladaAnimation.prototype.setAnimation = function (pCollada, iAnimation) {
                    this._pCollada = pCollada;
                    this._pNameLb.setText(this.getAnimation().name || "unknown");
                };

                ColladaAnimation.prototype._nameChanged = function (pLb, sName) {
                    this.getAnimation().name = sName;
                };

                ColladaAnimation.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-colladaanimation");

                    this.setDraggable(true, {
                        helper: "clone",
                        containment: "document",
                        cursor: "crosshair",
                        scroll: false
                    });
                };
                return ColladaAnimation;
            })(ui.Component);
            animation.ColladaAnimation = ColladaAnimation;

            ui.register("animation.ColladaAnimation", ColladaAnimation);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUILabel.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../animation/ColladaAnimation.ts" />
        /// <reference path="../Component.ts" />
        (function (resource) {
            var Properties = (function (_super) {
                __extends(Properties, _super);
                function Properties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pResource = null;
                    this._pColladaAnimations = [];

                    this.template("resource.Properties.tpl");

                    this._pName = this.findEntity("name");
                    this._pColldaProperties = this.findEntity("collada-properties");
                    this.$colladaAnimations = this._pColldaProperties.getElement().find("div.row:first");
                }
                Properties.prototype.setResource = function (pItem) {
                    if (!akra.isNull(this._pResource)) {
                        this._pResource.release();
                    }

                    pItem.addRef();
                    this._pResource = pItem;
                    this.updateProperties();
                };

                Properties.prototype.updateProperties = function () {
                    var pItem = this._pResource;

                    this._pName.setText(pItem.findResourceName());

                    //collada-properties
                    if (akra.pool.resources.Collada.isColladaResource(pItem)) {
                        this._pColldaProperties.show();

                        var pCollada = pItem;
                        var pAnimations = pCollada.getAnimations();
                        var pColladaAnimations = this._pColladaAnimations;

                        for (var i = 0; i < pColladaAnimations.length; ++i) {
                            pColladaAnimations[i].hide();
                        }

                        for (var i = 0; i < pAnimations.length; ++i) {
                            var pComp;

                            if (pColladaAnimations.length > i) {
                                pComp = pColladaAnimations[i];
                            } else {
                                pComp = pColladaAnimations[pColladaAnimations.length] = this._pColldaProperties.createComponent("animation.ColladaAnimation", { show: false });

                                pComp.render(this.$colladaAnimations);
                            }

                            pComp.show();
                            pComp.setAnimation(pCollada, i);
                        }
                    } else {
                        this._pColldaProperties.hide();
                    }
                };

                Properties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-resourceproperties");
                };
                return Properties;
            })(ui.Component);
            resource.Properties = Properties;

            ui.register("resource.Properties", Properties);
        })(ui.resource || (ui.resource = {}));
        var resource = ui.resource;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (animation) {
            var ControllerProperties = (function (_super) {
                __extends(ControllerProperties, _super);
                function ControllerProperties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pController = null;

                    this.template("animation.ControllerProperties.tpl");

                    this._pTotalAnimLabel = this.findEntity("total");
                    this._pActiveAnimation = this.findEntity("active");

                    this._pEditBtn = this.findEntity("edit");

                    //this.connect(this._pEditBtn, SIGNAL(click), SLOT(_editController));
                    this._pEditBtn.click.connect(this, this._editController);
                }
                ControllerProperties.prototype._editController = function (pButton) {
                    ui.ide.cmd(5 /* EDIT_ANIMATION_CONTROLLER */, this._pController);
                };

                ControllerProperties.prototype.setController = function (pController) {
                    if (!akra.isNull(this._pController)) {
                        //this.disconnect(this._pController, SIGNAL(animationAdded), SLOT(updateProperties));
                        this._pController.animationAdded.disconnect(this, this.updateProperties);
                    }

                    //this.connect(pController, SIGNAL(animationAdded), SLOT(updateProperties));
                    //this.connect(pController, SIGNAL(play), SLOT(updateProperties));
                    pController.animationAdded.connect(this, this.updateProperties);
                    pController.play.connect(this, this.updateProperties);

                    this._pController = pController;
                    this.updateProperties();
                };

                ControllerProperties.prototype.updateProperties = function () {
                    var pController = this._pController;
                    this._pTotalAnimLabel.setText(pController.getTotalAnimations());
                    this._pActiveAnimation.setText(pController.getActive() ? pController.getActive().getName() : "[not selected]");
                };

                ControllerProperties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationcontrollerproperties");
                };
                return ControllerProperties;
            })(ui.Component);
            animation.ControllerProperties = ControllerProperties;

            ui.register("AnimationControllerProperties", ControllerProperties);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUIVector.ts" />
/// <reference path="../idl/IUILabel.ts" />
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    (function (ui) {
        var Material = (function (_super) {
            __extends(Material, _super);
            function Material(parent, options) {
                _super.call(this, parent, options, 0 /* UNKNOWN */);
                this._pMat = null;

                this.template("Material.tpl");
                this._pName = this.findEntity("name");

                this._pDiffuse = this.findEntity("diffuse");
                this._pAmbient = this.findEntity("ambient");
                this._pSpecular = this.findEntity("specular");
                this._pEmissive = this.findEntity("emissive");

                this._pShininess = this.findEntity("shininess");

                this._pDiffuse.changed.connect(this, this._diffuseUpdated);
                this._pAmbient.changed.connect(this, this._ambientUpdated);
                this._pSpecular.changed.connect(this, this._specularUpdated);
                this._pEmissive.changed.connect(this, this._emissiveUpdated);

                this._pShininess.changed.connect(this, this._shininessUpdated);
            }
            Material.prototype.set = function (pMaterial) {
                this._pMat = pMaterial;
                this.updateProperties();
            };

            Material.prototype._diffuseUpdated = function (pVec, pValue) {
                this._pMat.diffuse.r = pValue.x;
                this._pMat.diffuse.g = pValue.y;
                this._pMat.diffuse.b = pValue.z;
                this._pMat.diffuse.a = pValue.w;
            };

            Material.prototype._ambientUpdated = function (pVec, pValue) {
                this._pMat.ambient.r = pValue.x;
                this._pMat.ambient.g = pValue.y;
                this._pMat.ambient.b = pValue.z;
                this._pMat.ambient.a = pValue.w;
            };

            Material.prototype._specularUpdated = function (pVec, pValue) {
                this._pMat.specular.r = pValue.x;
                this._pMat.specular.g = pValue.y;
                this._pMat.specular.b = pValue.z;
                this._pMat.specular.a = pValue.w;
            };

            Material.prototype._emissiveUpdated = function (pVec, pValue) {
                this._pMat.emissive.r = pValue.x;
                this._pMat.emissive.g = pValue.y;
                this._pMat.emissive.b = pValue.z;
                this._pMat.emissive.a = pValue.w;
            };

            Material.prototype._shininessUpdated = function (pVec, sValue) {
                this._pMat.shininess = parseFloat(sValue) || 0.;
            };

            Material.prototype.updateProperties = function () {
                this._pName.setText(this._pMat.name);
                this._pDiffuse.setColor(this._pMat.diffuse);
                this._pAmbient.setColor(this._pMat.ambient);
                this._pSpecular.setColor(this._pMat.specular);
                this._pEmissive.setColor(this._pMat.emissive);
                this._pShininess.setText(this._pMat.shininess.toFixed(2));
            };

            Material.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-material");
            };
            return Material;
        })(ui.Component);
        ui.Material = Material;

        ui.register("Material", Material);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../Panel.ts" />
/// <reference path="../Material.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (model) {
            var MeshSubsetProperties = (function (_super) {
                __extends(MeshSubsetProperties, _super);
                function MeshSubsetProperties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pSubset = null;

                    this.template("model.MeshSubsetProperties.tpl");
                    this._pName = this.findEntity("name");
                    this._pMaterial = this.findEntity("material");

                    this._pVisible = this.findEntity("sub-visible");
                    this._pShadows = this.findEntity("sub-shadows");
                    this._pBoundingBox = this.findEntity("sub-bounding-box");
                    this._pBoundingSphere = this.findEntity("sub-bounding-sphere");
                    this._pGuid = this.findEntity("sub-guid");

                    //this.connect(this._pVisible, SIGNAL(changed), SLOT(_setVisible));
                    //this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
                    //this.connect(this._pBoundingBox, SIGNAL(changed), SLOT(_useBoundingBox));
                    //this.connect(this._pBoundingSphere, SIGNAL(changed), SLOT(_useBoundingSphere));
                    this._pVisible.changed.connect(this, this._setVisible);
                    this._pShadows.changed.connect(this, this._useShadows);
                    this._pBoundingBox.changed.connect(this, this._useBoundingBox);
                    this._pBoundingSphere.changed.connect(this, this._useBoundingSphere);

                    this.setCollapsible();
                    this.collapse(true);
                }
                MeshSubsetProperties.prototype._setVisible = function (pSwc, bValue) {
                    this._pSubset.setVisible(bValue);
                };

                MeshSubsetProperties.prototype._useShadows = function (pSwc, bValue) {
                    this._pSubset.setShadow(bValue);
                };

                MeshSubsetProperties.prototype._useBoundingBox = function (pSwc, bValue) {
                    bValue ? this._pSubset.showBoundingBox() : this._pSubset.hideBoundingBox();

                    this.updateProperties();
                };

                MeshSubsetProperties.prototype._useBoundingSphere = function (pSwc, bValue) {
                    bValue ? this._pSubset.showBoundingSphere() : this._pSubset.hideBoundingSphere();
                    this.updateProperties();
                };

                MeshSubsetProperties.prototype.setSubset = function (pSubset) {
                    this._pSubset = pSubset;
                    this.updateProperties();
                };

                MeshSubsetProperties.prototype.updateProperties = function () {
                    this._pName.setText(this._pSubset.getName());
                    this._pSubset.switchRenderMethod(null);
                    this._pMaterial.set(this._pSubset.getMaterial());
                    this.setTitle(this._pSubset.getName());
                    this._pShadows._setValue(this._pSubset.getShadow());
                    this._pBoundingBox._setValue(this._pSubset.isBoundingBoxVisible());
                    this._pBoundingSphere._setValue(this._pSubset.isBoundingSphereVisible());
                    this._pVisible._setValue(this._pSubset.isVisible());
                    this._pGuid.setText(this._pSubset.guid);
                };

                MeshSubsetProperties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-meshsubsetproperties");
                };
                return MeshSubsetProperties;
            })(ui.Panel);
            model.MeshSubsetProperties = MeshSubsetProperties;

            ui.register("model.MeshSubsetProperties", MeshSubsetProperties);
        })(ui.model || (ui.model = {}));
        var model = ui.model;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../../idl/IUISwitch.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../Component.ts" />
        /// <reference path="MeshSubsetProperties.ts" />
        (function (model) {
            var MeshProperties = (function (_super) {
                __extends(MeshProperties, _super);
                function MeshProperties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pMesh = null;
                    this._pSubsets = [];

                    this.template("model.MeshProperties.tpl");

                    this._pName = this.findEntity("name");
                    this._pShadows = this.findEntity("shadows");
                    this._pBoundingBox = this.findEntity("bounding-box");
                    this._pBoundingSphere = this.findEntity("bounding-sphere");

                    //this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
                    //this.connect(this._pBoundingBox, SIGNAL(changed), SLOT(_useBoundingBox));
                    //this.connect(this._pBoundingSphere, SIGNAL(changed), SLOT(_useBoundingSphere));
                    this._pShadows.changed.connect(this, this._useShadows);
                    this._pBoundingBox.changed.connect(this, this._useBoundingBox);
                    this._pBoundingSphere.changed.connect(this, this._useBoundingSphere);
                }
                MeshProperties.prototype._useShadows = function (pSwc, bValue) {
                    this._pMesh.setShadow(bValue);
                };

                MeshProperties.prototype._useBoundingBox = function (pSwc, bValue) {
                    if (bValue) {
                        this._pMesh.showBoundingBox();
                    } else {
                        this._pMesh.hideBoundingBox();
                    }

                    this.updateProperties();
                };

                MeshProperties.prototype._useBoundingSphere = function (pSwc, bValue) {
                    bValue ? this._pMesh.showBoundingSphere() : this._pMesh.hideBoundingSphere();
                    this.updateProperties();
                };

                MeshProperties.prototype.setMesh = function (pMesh) {
                    this._pMesh = pMesh;
                    this.updateProperties();
                };

                MeshProperties.prototype.updateProperties = function () {
                    var pMesh = this._pMesh;

                    this._pName.setText(pMesh.getName());
                    this._pShadows._setValue(pMesh.getShadow());
                    this._pBoundingBox._setValue(pMesh.isBoundingBoxVisible());
                    this._pBoundingSphere._setValue(pMesh.isBoundingSphereVisible());

                    for (var i = 0; i < pMesh.getLength(); ++i) {
                        var pSubsetProperties = null;

                        if (this._pSubsets.length > i) {
                            pSubsetProperties = this._pSubsets[i];
                        } else {
                            pSubsetProperties = this.createComponent("model.MeshSubsetProperties");
                            this._pSubsets.push(pSubsetProperties);
                        }

                        pSubsetProperties.show();
                        pSubsetProperties.setSubset(pMesh.getSubset(i));
                    }

                    for (var i = pMesh.getLength(); i < this._pSubsets.length; ++i) {
                        this._pSubsets[i].hide();
                    }
                };

                MeshProperties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-meshproperties");
                };
                return MeshProperties;
            })(ui.Component);
            model.MeshProperties = MeshProperties;

            ui.register("model.MeshProperties", MeshProperties);
        })(ui.model || (ui.model = {}));
        var model = ui.model;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../../idl/IUISwitch.ts" />
/// <reference path="../Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (light) {
            var Properties = (function (_super) {
                __extends(Properties, _super);
                function Properties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pLight = null;

                    this.template("light.Properties.tpl");

                    this._pEnabled = this.findEntity("enabled");
                    this._pShadows = this.findEntity("shadows");

                    this._pAmbient = this.findEntity("ambient");
                    this._pDiffuse = this.findEntity("diffuse");
                    this._pSpecular = this.findEntity("specular");
                    this._pAttenuation = this.findEntity("attenuation");

                    //this.connect(this._pEnabled, SIGNAL(changed), SLOT(_enableLight));
                    this._pEnabled.changed.connect(this, this._enableLight);

                    //this.connect(this._pShadows, SIGNAL(changed), SLOT(_useShadows));
                    this._pShadows.changed.connect(this, this._useShadows);

                    //this.connect(this._pAmbient, SIGNAL(changed), SLOT(_ambientUpdated));
                    this._pAmbient.changed.connect(this, this._ambientUpdated);

                    //this.connect(this._pDiffuse, SIGNAL(changed), SLOT(_diffuseUpdated));
                    this._pDiffuse.changed.connect(this, this._diffuseUpdated);

                    //this.connect(this._pSpecular, SIGNAL(changed), SLOT(_specularUpdated));
                    this._pSpecular.changed.connect(this, this._specularUpdated);

                    //this.connect(this._pAttenuation, SIGNAL(changed), SLOT(_attenuationUpdated));
                    this._pAttenuation.changed.connect(this, this._attenuationUpdated);
                }
                Properties.prototype._ambientUpdated = function (pVec, pValue) {
                    var c4fAmbient = this._pLight.getParams().ambient;
                    c4fAmbient.r = pValue.x;
                    c4fAmbient.g = pValue.y;
                    c4fAmbient.b = pValue.z;
                    c4fAmbient.a = pValue.w;
                };

                Properties.prototype._diffuseUpdated = function (pVec, pValue) {
                    var c4fDiffuse = this._pLight.getParams().diffuse;
                    c4fDiffuse.r = pValue.x;
                    c4fDiffuse.g = pValue.y;
                    c4fDiffuse.b = pValue.z;
                    c4fDiffuse.a = pValue.w;
                };

                Properties.prototype._specularUpdated = function (pVec, pValue) {
                    var c4fSpecular = this._pLight.getParams().specular;
                    c4fSpecular.r = pValue.x;
                    c4fSpecular.g = pValue.y;
                    c4fSpecular.b = pValue.z;
                    c4fSpecular.a = pValue.w;
                };

                Properties.prototype._attenuationUpdated = function (pVec, pValue) {
                    this._pLight.getParams().attenuation.set(pValue);
                };
                Properties.prototype._useShadows = function (pSwc, bValue) {
                    this._pLight.setShadowCaster(bValue);
                };

                Properties.prototype._enableLight = function (pSwc, bValue) {
                    this._pLight.setEnabled(bValue);
                };

                Properties.prototype.setLight = function (pLight) {
                    this._pLight = pLight;
                    this.updateProperties();
                };

                Properties.prototype.updateProperties = function () {
                    var pLight = this._pLight;

                    this._pShadows._setValue(pLight.isShadowCaster());
                    this._pEnabled._setValue(pLight.isEnabled());

                    this._pDiffuse.setColor(this._pLight.getParams().diffuse);
                    this._pAmbient.setColor(this._pLight.getParams().ambient);
                    this._pSpecular.setColor(this._pLight.getParams().specular);
                    this._pAttenuation.setVec3(this._pLight.getParams().attenuation);
                };

                Properties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-lightproperties");
                };
                return Properties;
            })(ui.Component);
            light.Properties = Properties;

            ui.register("light.Properties", Properties);
        })(ui.light || (ui.light = {}));
        var light = ui.light;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUILabel.ts" />
/// <reference path="../../idl/IUISwitch.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../Component.ts" />
        (function (scene) {
            var Model = (function (_super) {
                __extends(Model, _super);
                function Model(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pModel = null;

                    this.template("scene.Model.tpl");

                    this._pVisible = this.findEntity("visible");

                    //this.connect(this._pVisible, SIGNAL(changed), SLOT(_changeVisibility));
                    this._pVisible.changed.connect(this, this._changeVisibility);
                }
                Model.prototype._changeVisibility = function (pSwc, bValue) {
                    this._pModel.setVisible(bValue);
                };

                Model.prototype.setModel = function (pModel) {
                    this._pModel = pModel;
                    this.updateProperties();
                };

                Model.prototype.updateProperties = function () {
                    var pModel = this._pModel;

                    this._pVisible._setValue(pModel.isVisible());
                };

                Model.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-scenemodel");
                };
                return Model;
            })(ui.Component);
            scene.Model = Model;

            ui.register("scene.Model", Model);
        })(ui.scene || (ui.scene = {}));
        var scene = ui.scene;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../IDL/IUILabel.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../Component.ts" />
        (function (animation) {
            var NodeProperties = (function (_super) {
                __extends(NodeProperties, _super);
                function NodeProperties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);

                    this.template("animation.NodeProperties.tpl");

                    this._pNameLb = this.findEntity("animation-name");
                }
                NodeProperties.prototype.setNode = function (pNode) {
                    this._pNameLb.setText(pNode.getAnimation().getName());
                };

                NodeProperties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationnodeproperties");
                };
                return NodeProperties;
            })(ui.Component);
            animation.NodeProperties = NodeProperties;

            ui.register("animation.NodeProperties", NodeProperties);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
// IUIGraphConnector export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIGraphNode.ts" />
//#define UIGRAPH_FLOATING_INPUT -1
var akra;
(function (akra) {
    akra.UIGRAPH_FLOATING_INPUT = -1;

    (function (EGraphConnectorOrient) {
        EGraphConnectorOrient[EGraphConnectorOrient["UNKNOWN"] = 0] = "UNKNOWN";
        EGraphConnectorOrient[EGraphConnectorOrient["UP"] = 1] = "UP";
        EGraphConnectorOrient[EGraphConnectorOrient["DOWN"] = 2] = "DOWN";
        EGraphConnectorOrient[EGraphConnectorOrient["LEFT"] = 3] = "LEFT";
        EGraphConnectorOrient[EGraphConnectorOrient["RIGHT"] = 4] = "RIGHT";
    })(akra.EGraphConnectorOrient || (akra.EGraphConnectorOrient = {}));
    var EGraphConnectorOrient = akra.EGraphConnectorOrient;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIGraphConnector.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIGraphConnector.ts" />
/// <reference path="IUIGraphRoute.ts" />
var akra;
(function (akra) {
    (function (EUIGraphDirections) {
        EUIGraphDirections[EUIGraphDirections["IN"] = 0x01] = "IN";
        EUIGraphDirections[EUIGraphDirections["OUT"] = 0x02] = "OUT";
    })(akra.EUIGraphDirections || (akra.EUIGraphDirections = {}));
    var EUIGraphDirections = akra.EUIGraphDirections;

    (function (EUIGraphTypes) {
        EUIGraphTypes[EUIGraphTypes["UNKNOWN"] = 0] = "UNKNOWN";
        EUIGraphTypes[EUIGraphTypes["ANIMATION"] = 1] = "ANIMATION";
    })(akra.EUIGraphTypes || (akra.EUIGraphTypes = {}));
    var EUIGraphTypes = akra.EUIGraphTypes;

    (function (EUIGraphEvents) {
        EUIGraphEvents[EUIGraphEvents["UNKNOWN"] = 0] = "UNKNOWN";
        EUIGraphEvents[EUIGraphEvents["DELETE"] = 1] = "DELETE";
        EUIGraphEvents[EUIGraphEvents["SHOW_MAP"] = 2] = "SHOW_MAP";
        EUIGraphEvents[EUIGraphEvents["HIDE_MAP"] = 3] = "HIDE_MAP";
    })(akra.EUIGraphEvents || (akra.EUIGraphEvents = {}));
    var EUIGraphEvents = akra.EUIGraphEvents;
})(akra || (akra = {}));
/// <reference path="IUIPanel.ts" />
/// <reference path="IUIGraphConnector.ts" />
/// <reference path="IUIGraphNode.ts" />
/// <reference path="IUIGraphRoute.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="IUIGraph.ts" />
/// <reference path="IUIGraphRoute.ts" />
/// <reference path="IUIGraphConnectionArea.ts" />
var akra;
(function (akra) {
    (function (EUIGraphNodes) {
        EUIGraphNodes[EUIGraphNodes["UNKNOWN"] = 0] = "UNKNOWN";

        EUIGraphNodes[EUIGraphNodes["ANIMATION_DATA"] = 1] = "ANIMATION_DATA";
        EUIGraphNodes[EUIGraphNodes["ANIMATION_PLAYER"] = 2] = "ANIMATION_PLAYER";
        EUIGraphNodes[EUIGraphNodes["ANIMATION_BLENDER"] = 3] = "ANIMATION_BLENDER";
        EUIGraphNodes[EUIGraphNodes["ANIMATION_MASK"] = 4] = "ANIMATION_MASK";
    })(akra.EUIGraphNodes || (akra.EUIGraphNodes = {}));
    var EUIGraphNodes = akra.EUIGraphNodes;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIGraphNode.ts" />
// IUIAnimationMask export interface
// [write description here...]
/// <reference path="IUIAnimationNode.ts" />
/// <reference path="../../idl/IUIAnimationMask.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../Component.ts" />
        (function (animation) {
            var MaskProperties = (function (_super) {
                __extends(MaskProperties, _super);
                function MaskProperties(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pNode = null;
                    this._pMask = null;
                }
                MaskProperties.prototype.setMask = function (pNode) {
                    var _this = this;
                    var pMask = pNode.getMask();
                    var pBones = Object.keys(pMask);
                    var nTotal = pBones.length;
                    var nSliders = this.childCount();

                    this._pNode = pNode;
                    this._pMask = pMask;

                    if (nTotal > nSliders) {
                        for (var i = nSliders; i < nTotal; ++i) {
                            this.fromStringTemplate("<div class=\"row\">\
									<span>bone:</span>\
									<component type=\"Slider\" range=\"100\" />;\
								</div>", { bone: "bone" });
                        }
                    }

                    var pSliders = this.children();

                    if (nTotal > nSliders) {
                        for (var i = nSliders; i < nTotal; ++i) {
                            //this.connect(pSliders[i], SIGNAL(updated), SLOT(_changed));
                            pSliders[i].updated.connect(this, this._changed);
                        }
                    }

                    if (nSliders > 0) {
                        pSliders[nSliders - 1].getElement().removeClass("last");
                    }

                    if (nTotal < nSliders) {
                        for (var i = nTotal; i < nSliders; ++i) {
                            pSliders[i].hide();
                        }
                    }

                    this.getElement().find(".row > span").each(function (i, el) {
                        if (i === nTotal) {
                            return false;
                        }

                        pSliders[i].setName(pBones[i]);
                        pSliders[i].setValue(pMask[pBones[i]]);

                        _this._changed(pSliders[i], pMask[pBones[i]]);

                        $(el).html(pBones[i] + ":");
                    });

                    pSliders[0].getElement().parent().addClass("first");
                    pSliders[nTotal - 1].getElement().parent().addClass("last");
                };

                MaskProperties.prototype._changed = function (pSlider, fValue) {
                    pSlider.setText(fValue.toFixed(1));
                    this._pMask[pSlider.getName()] = fValue;
                };

                MaskProperties.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationmaskproperties");
                };
                return MaskProperties;
            })(ui.Component);
            animation.MaskProperties = MaskProperties;

            ui.register("animation.MaskProperties", MaskProperties);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (animation) {
            var Controller = (function (_super) {
                __extends(Controller, _super);
                function Controller(parent, options) {
                    _super.call(this, parent, options);
                    this._pController = null;

                    this.template("animation.Controller.tpl");

                    this._pNameLb = this.findEntity("controller-name");
                    this._pEditBtn = this.findEntity("edit-controller");
                    this._pRemoveBtn = this.findEntity("remove-controller");

                    //this.connect(this._pNameLb, SIGNAL(changed), SLOT(_nameChanged));
                    //this.connect(this._pEditBtn, SIGNAL(click), SLOT(edit));
                    //this.connect(this._pRemoveBtn, SIGNAL(click), SLOT(remove));
                    this._pNameLb.changed.connect(this, this._nameChanged);
                    this._pEditBtn.click.connect(this.edit);
                    this._pRemoveBtn.click.connect(this.remove);

                    if (options && options.controller) {
                        this.setController(options.controller);
                    }
                }
                Controller.prototype.setController = function (pController) {
                    this._pController = pController;
                    this._pNameLb.setText(pController.name || "unknown");
                };

                Controller.prototype.getController = function () {
                    return this._pController;
                };

                Controller.prototype.setupSignals = function () {
                    this.edit = this.edit || new akra.Signal(this);
                    this.remove = this.remove || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                Controller.prototype._nameChanged = function (pLb, sName) {
                    this._pController.name = sName;
                };

                Controller.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationcontroller");
                };
                return Controller;
            })(ui.Component);
            animation.Controller = Controller;

            ui.register("animation.Controller", Controller);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIButton.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../Component.ts" />
        (function (camera) {
            var Events = (function (_super) {
                __extends(Events, _super);
                function Events(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pCamera = null;

                    this.template("camera.Events.tpl");

                    this._pLookThrough = this.findEntity("look-through");

                    this._pPreRenderEvtBtn = this.findEntity("pre-render-scene");
                    this._pPostRenderEvtBtn = this.findEntity("post-render-scene");

                    //this.connect(this._pLookThrough, SIGNAL(click), SLOT(_lookThrough));
                    this._pLookThrough.click.connect(this, this._lookThrough);

                    //this.connect(this._pPreRenderEvtBtn, SIGNAL(click), SLOT(_editPreRenderEvent));
                    //this.connect(this._pPostRenderEvtBtn, SIGNAL(click), SLOT(_editPostRenderEvent));
                    this._pPreRenderEvtBtn.click.connect(this, this._editPreRenderEvent);
                    this._pPostRenderEvtBtn.click.connect(this, this._editPostRenderEvent);
                }
                Events.prototype._lookThrough = function (pBtn) {
                    ui.ide.cmd(10 /* CHANGE_CAMERA */, this._pCamera);
                };

                Events.prototype._editPreRenderEvent = function (pBtn, e) {
                    ui.ide.cmd(7 /* EDIT_EVENT */, this._pCamera, "preRenderScene");
                };

                Events.prototype._editPostRenderEvent = function (pBtn, e) {
                    ui.ide.cmd(7 /* EDIT_EVENT */, this._pCamera, "postRenderScene");
                };

                Events.prototype.setCamera = function (pCamera) {
                    if (!akra.isNull(this._pCamera)) {
                        this._pCamera.release();
                    }

                    pCamera.addRef();
                    this._pCamera = pCamera;
                };

                Events.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-cameraevents");
                };
                return Events;
            })(ui.Component);
            camera.Events = Events;

            ui.register("camera.Events", Events);
        })(ui.camera || (ui.camera = {}));
        var camera = ui.camera;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIButton.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../Component.ts" />
        (function (scene) {
            var Events = (function (_super) {
                __extends(Events, _super);
                function Events(parent, options) {
                    _super.call(this, parent, options, 0 /* UNKNOWN */);
                    this._pScene = null;

                    this.template("scene.Events.tpl");

                    this._pPreUpdateEvtBtn = this.findEntity("pre-update");
                    this._pPostUpdateEvtBtn = this.findEntity("post-update");
                    this._pBeforeUpdateEvtBtn = this.findEntity("before-update");

                    //this.connect(this._pPreUpdateEvtBtn, SIGNAL(click), SLOT(_editPreUpdateEvent));
                    //this.connect(this._pPostUpdateEvtBtn, SIGNAL(click), SLOT(_editPostUpdateEvent));
                    //this.connect(this._pBeforeUpdateEvtBtn, SIGNAL(click), SLOT(_editBeforeUpdateEvent));
                    this._pPreUpdateEvtBtn.click.connect(this, this._editPreUpdateEvent);
                    this._pPostUpdateEvtBtn.click.connect(this, this._editPostUpdateEvent);
                    this._pBeforeUpdateEvtBtn.click.connect(this, this._editBeforeUpdateEvent);
                }
                Events.prototype._editPreUpdateEvent = function (pBtn, e) {
                    ui.ide.cmd(7 /* EDIT_EVENT */, this._pScene, "preUpdate");
                };

                Events.prototype._editPostUpdateEvent = function (pBtn, e) {
                    ui.ide.cmd(7 /* EDIT_EVENT */, this._pScene, "postUpdate");
                };

                Events.prototype._editBeforeUpdateEvent = function (pBtn, e) {
                    ui.ide.cmd(7 /* EDIT_EVENT */, this._pScene, "beforeUpdate");
                };

                Events.prototype.setScene = function (pScene) {
                    this._pScene = pScene;
                };

                Events.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-sceneevents");
                };
                return Events;
            })(ui.Component);
            scene.Events = Events;

            ui.register("scene.Events", Events);
        })(ui.scene || (ui.scene = {}));
        var scene = ui.scene;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUILabel.ts" />
var akra;
(function (akra) {
    /// <reference path="Component.ts" />
    /// <reference path="resource/Properties.ts" />
    /// <reference path="animation/ControllerProperties.ts" />
    /// <reference path="model/MeshProperties.ts" />
    /// <reference path="light/Properties.ts" />
    /// <reference path="scene/Model.ts" />
    /// <reference path="animation/NodeProperties.ts" />
    /// <reference path="animation/MaskProperties.ts" />
    /// <reference path="animation/Controller.ts" />
    /// <reference path="camera/Events.ts" />
    /// <reference path="scene/Events.ts" />
    (function (ui) {
        var Vec3 = akra.math.Vec3;

        var Inspector = (function (_super) {
            __extends(Inspector, _super);
            function Inspector(parent, options) {
                _super.call(this, parent, options, 0 /* UNKNOWN */);
                this._pNode = null;
                this._pControllers = [];
                this._nTotalVisibleControllers = 0;
                this._bControllerVisible = false;

                this.template("Inspector.tpl");

                this._pSceneEvents = this.findEntity("scene-events");

                this._pNameLabel = this.findEntity("node-name");
                this._pPosition = this.findEntity("position");
                this._pWorldPosition = this.findEntity("worldPosition");
                this._pScale = this.findEntity("scale");
                this._pRotation = this.findEntity("rotation");
                this._pInheritance = this.findEntity("inheritance");

                this._pAddControllerBtn = this.findEntity("add-controller");

                this._pResource = this.findEntity("resource");
                this._pController = this.findEntity("controller");

                this._pMesh = this.findEntity("mesh");

                this._pLight = this.findEntity("light");
                this._pSceneModel = this.findEntity("scene-model-properties");

                this._pCameraEvents = this.findEntity("camera-events");

                //this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_updateName));
                //this.connect(this._pPosition, SIGNAL(changed), SLOT(_updateLocalPosition));
                //this.connect(this._pRotation, SIGNAL(changed), SLOT(_updateRotation));
                //this.connect(this._pScale, SIGNAL(changed), SLOT(_updateScale));
                //this.connect(this._pInheritance, SIGNAL(changed), SLOT(_updateInheritance));
                //this.connect(this._pAddControllerBtn, SIGNAL(click), SLOT(_addController));
                this._pNameLabel.changed.connect(this, this._updateName);
                this._pPosition.changed.connect(this, this._updateLocalPosition);
                this._pRotation.changed.connect(this, this._updateRotation);
                this._pScale.changed.connect(this, this._updateScale);
                this._pInheritance.changed.connect(this, this._updateInheritance);

                this._pAddControllerBtn.click.connect(this, this._addController);

                //---------------
                this._pAnimationNodeProperties = this.findEntity("animation-node-properties");
                this._pAnimationMaskProperties = this.findEntity("animation-mask-properties");

                this.inspectAnimationNode(null);
                this.inspectAnimationController(null);

                this._pSceneEvents.setScene(ui.ide.getScene());
                this._pSceneEvents.show();
            }
            Inspector.prototype.setupSignals = function () {
                this.nodeNameChanged = this.nodeNameChanged || new akra.Signal(this);
                _super.prototype.setupSignals.call(this);
            };

            Inspector.prototype.getControllerUI = function () {
                if (this._nTotalVisibleControllers === this._pControllers.length) {
                    console.log("create controller >> ");
                    var pController = this.createComponent("animation.Controller", {
                        show: false
                    });

                    pController.render(this._pAddControllerBtn.getElement().parent());

                    //this.connect(pController, SIGNAL(edit), SLOT(_editCintroller));
                    //this.connect(pController, SIGNAL(remove), SLOT(_removeController));
                    pController.edit.connect(this, this._editCintroller);
                    pController.remove.connect(this, this._removeController);
                    this._pControllers.push(pController);
                }

                var pControllerUI = this._pControllers[this._nTotalVisibleControllers++];
                pControllerUI.show();
                return pControllerUI;
            };

            Inspector.prototype.hideAllControllersUI = function () {
                for (var i = 0; i < this._nTotalVisibleControllers; ++i) {
                    this._pControllers[i].hide();
                }

                this._nTotalVisibleControllers = 0;
            };

            Inspector.prototype._addController = function (pBtn) {
                var pController = ui.ide.getEngine().createAnimationController();
                var pControllerUI = this.getControllerUI();
                pControllerUI.setController(pController);

                // this._pAddControllerBtn.getElement().append(pControllerUI.getElement().parent());
                this._pNode.addController(pController);
            };

            Inspector.prototype._removeController = function (pControllerUI) {
                akra.debug.log("remove controller");
            };

            Inspector.prototype._editCintroller = function (pControllerUI) {
                // LOG("inspect controller");
                ui.ide.cmd(4 /* INSPECT_ANIMATION_CONTROLLER */, pControllerUI.getController());
            };

            Inspector.prototype._updateName = function (pLabel, sName) {
                if (sName.length == 0) {
                    sName = null;
                }

                this._pNode.setName(sName);
                this.nodeNameChanged.emit(this._pNode);
            };

            Inspector.prototype._updateInheritance = function (pCheckboxList, pCheckbox) {
                switch (pCheckbox.getName()) {
                    case "position":
                        this._pNode.setInheritance(1 /* POSITION */);
                        return;
                    case "rotscale":
                        this._pNode.setInheritance(2 /* ROTSCALE */);
                        return;
                    case "all":
                        this._pNode.setInheritance(4 /* ALL */);
                        return;
                }
            };

            Inspector.prototype._updateRotation = function (pVector, pRotation) {
                pRotation.scale(akra.math.PI / 180.);
                this._pNode.setRotationByXYZAxis(pRotation.x, pRotation.y, pRotation.z);
            };

            Inspector.prototype._updateScale = function (pVector, pScale) {
                this._pNode.setLocalScale(pScale);
            };

            Inspector.prototype._updateLocalPosition = function (pVector, pPos) {
                this._pNode.setLocalPosition(pPos);
            };

            Inspector.prototype.finalizeRender = function () {
                _super.prototype.finalizeRender.call(this);
                this.getElement().addClass("component-inspector");
            };

            Inspector.prototype._scenePostUpdated = function (pScene) {
                if (this._pNode.isUpdated()) {
                    this.updateProperties();
                }
            };

            Inspector.prototype.updateProperties = function () {
                var pNode = this._pNode;

                this._pNameLabel.setText((pNode.getName() || "null").toString());
                this._pPosition.setVec3(pNode.getLocalScale());

                var v3fRot = Vec3.temp();
                pNode.getLocalOrientation().toYawPitchRoll(v3fRot);
                this._pRotation.setVec3(Vec3.temp(v3fRot.y, v3fRot.x, v3fRot.z).scale(180.0 / akra.math.PI));

                this._pScale.setVec3(pNode.getLocalScale());
                this._pWorldPosition.setVec3(pNode.getWorldPosition());

                var pItems = this._pInheritance.getItems();

                switch (pNode.getInheritance()) {
                    case 1 /* POSITION */:
                        pItems[0].setChecked(true);
                        break;
                    case 2 /* ROTSCALE */:
                        pItems[1].setChecked(true);
                        break;
                    case 4 /* ALL */:
                        pItems[2].setChecked(true);
                        break;
                }

                this.hideAllControllersUI();

                for (var i = 0; i < pNode.getTotalControllers(); ++i) {
                    var pControllerUI = this.getControllerUI();
                    pControllerUI.setController(pNode.getController(i));
                }

                this.inspectAnimationController(null);
            };

            Inspector.prototype.inspectAnimationNode = function (pNode) {
                if (akra.isNull(pNode) || akra.isNull(pNode.getAnimation())) {
                    this.getElement().find("div[name=animation-node]").hide();
                    return;
                }

                this.getElement().find("div[name=animation-node]").show();
                this._pAnimationNodeProperties.setNode(pNode);

                if (ui.animation.Mask.isMaskNode(pNode)) {
                    this.getElement().find(".animation-mask-properties-row:first").show();
                    this._pAnimationMaskProperties.setMask(pNode);
                } else {
                    this.getElement().find(".animation-mask-properties-row:first").hide();
                }
            };

            Inspector.prototype.inspectAnimationController = function (pController) {
                if (akra.isNull(pController)) {
                    if (this._bControllerVisible) {
                        this.getElement().find("div[name=animation-controller]").hide();
                        this._bControllerVisible = false;
                    }
                    return;
                }
                if (!this._bControllerVisible) {
                    this._bControllerVisible = true;
                    this.getElement().find("div[name=animation-controller]").show();
                }
                this._pController.setController(pController);
            };

            Inspector.prototype.inspectNode = function (pNode) {
                if (this._pNode) {
                    //this.disconnect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
                    this._pNode.getScene().postUpdate.disconnect(this, this._scenePostUpdated);
                }

                this._pNode = pNode;
                this.updateProperties();

                if (akra.scene.objects.ModelEntry.isModelEntry(pNode)) {
                    var pEntry = pNode;
                    this.getElement().find("div[name=model-entry]").show();

                    this._pResource.setResource(pEntry.getResource());
                } else {
                    this.getElement().find("div[name=model-entry]").hide();
                }

                if (akra.scene.SceneModel.isModel(pNode)) {
                    var pModel = pNode;
                    this.getElement().find("div[name=scene-model]").show();

                    this._pSceneModel.setModel(pModel);

                    if (!akra.isNull(pModel.getMesh())) {
                        this._pMesh.setMesh(pModel.getMesh());
                    }
                } else {
                    this.getElement().find("div[name=scene-model]").hide();
                }

                if (akra.scene.light.LightPoint.isLightPoint(pNode)) {
                    var pPoint = pNode;
                    this.getElement().find("div[name=light-point]").show();
                    this._pLight.setLight(pPoint);
                } else {
                    this.getElement().find("div[name=light-point]").hide();
                }

                if (akra.scene.objects.Camera.isCamera(pNode)) {
                    var pCamera = pNode;
                    this.getElement().find("div[name=camera]").show();
                    this._pCameraEvents.setCamera(pCamera);
                } else {
                    this.getElement().find("div[name=camera]").hide();
                }

                //this.connect(this._pNode.scene, SIGNAL(postUpdate), SLOT(_scenePostUpdated));
                this._pNode.getScene().postUpdate.connect(this, this._scenePostUpdated);
            };
            return Inspector;
        })(ui.Component);
        ui.Inspector = Inspector;

        ui.register("Inspector", Inspector);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../../built/Lib/navigation.addon.d.ts" />
/// <reference path="../../../built/Lib/filedrop.addon.d.ts" />
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
                ui.ide.cmd(1 /* SET_PREVIEW_FULLSCREEN */);
            };

            ViewportProperties.prototype._screenshot = function () {
                ui.ide.cmd(11 /* SCREENSHOT */);
            };

            // _lookat(): void {
            // }
            ViewportProperties.prototype.setupFileDropping = function () {
                var pViewportProperties = this;
                var pRmgr = ui.ide.getResourceManager();
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

                        if (pViewportProperties.getViewport().getType() === 1 /* DSVIEWPORT */) {
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
                ui.ide.cmd(6 /* CHANGE_AA */, bValue);
            };

            ViewportProperties.prototype._previewResChanged = function (pCbl, pCb) {
                if (pCb.isChecked()) {
                    switch (pCb.getName()) {
                        case "r800":
                            ui.ide.cmd(0 /* SET_PREVIEW_RESOLUTION */, 800, 600);
                            return;
                        case "r640":
                            ui.ide.cmd(0 /* SET_PREVIEW_RESOLUTION */, 640, 480);
                            return;
                        case "r320":
                            ui.ide.cmd(0 /* SET_PREVIEW_RESOLUTION */, 320, 240);
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

                ui.ide.cmd(6 /* CHANGE_AA */, this._pFXAASwh.getValue());

                if (pViewport.getType() === 1 /* DSVIEWPORT */) {
                    if (pViewport.getSkybox()) {
                        this._pSkyboxLb.setText(pViewport.getSkybox().findResourceName());
                    }

                    pViewport.addedSkybox.connect(this, this._addedSkybox);
                }

                pViewport.enableSupportFor3DEvent(1 /* CLICK */);

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
        })(ui.Component);
        ui.ViewportProperties = ViewportProperties;

        ui.register("ViewportProperties", ViewportProperties);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
// IUICodeEditor export interface
// [write description here...]
/// <reference path="IUIComponent.ts" />
// IUIListenerEditor export interface
// [write description here...]
/// <reference path="IUIPanel.ts" />
/// <reference path="IUICodeEditor.ts" />
/// <reference path="../idl/3d-party/codemirror.d.ts" />
/// <reference path="../idl/IUICodeEditor.ts" />
/// <reference path="Component.ts" />
var akra;
(function (akra) {
    /// @: {data}/ui/3d-party/codemirror/lib/codemirror.css|location()|css()|data_location({data},DATA)
    /// @: {data}/ui/3d-party/codemirror/lib/codemirror.js|location()|script()|data_location({data},DATA)
    /// @: {data}/ui/3d-party/codemirror/addon/hint/show-hint.js|location()|script()|data_location({data},DATA)
    /// @: {data}/ui/3d-party/codemirror/addon/hint/show-hint.css|location()|css()|data_location({data},DATA)
    /// @: {data}/ui/3d-party/codemirror/addon/hint/javascript-hint.js|location()|script()|data_location({data},DATA)
    /// @: {data}/ui/3d-party/codemirror/mode/javascript/javascript.js|location()|script()|data_location({data},DATA)
    (function (ui) {
        var CodeEditor = (function (_super) {
            __extends(CodeEditor, _super);
            function CodeEditor(parent, options) {
                _super.call(this, parent, options, 17 /* CODE_EDITOR */, $("<textarea />"));
                this.codemirror = null;
            }
            CodeEditor.prototype.getValue = function () {
                return this.codemirror.getValue();
            };
            CodeEditor.prototype.setValue = function (sValue) {
                this.codemirror.setValue(sValue);
            };

            CodeEditor.prototype.getCodeMirror = function () {
                return this.codemirror;
            };

            CodeEditor.prototype.finalizeRendere = function () {
                _super.prototype.finalizeRender.call(this);

                CodeMirror.commands.autocomplete = function (cm) {
                    CodeMirror.showHint(cm, CodeMirror.javascriptHint, {
                        additionalContext: { self: ui.ide._apiEntry }
                    });
                };

                this.codemirror = CodeMirror.fromTextArea(this.getHTMLElement(), {
                    lineNumbers: true,
                    extraKeys: { "Ctrl-Space": "autocomplete" },
                    value: this.getOptions().code || ""
                });
            };
            return CodeEditor;
        })(ui.Component);
        ui.CodeEditor = CodeEditor;

        ui.register("CodeEditor", CodeEditor);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../idl/IUIListenerEditor.ts" />
/// <reference path="../idl/IUIButton.ts" />
/// <reference path="CodeEditor.ts" />
/// <reference path="Panel.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (graph) {
            var ListenerEditor = (function (_super) {
                __extends(ListenerEditor, _super);
                function ListenerEditor(parent, options) {
                    _super.call(this, parent, options);

                    this.template("ListenerEditor.tpl");

                    var editor = this.editor = this.findEntity("js-editor");
                    this._pBindBtn = this.findEntity("bind-event");

                    // this.connect(this._pBindBtn, SIGNAL(click), SLOT(_bindEvent));
                    this._pBindBtn.click.connect(this, this._bindEvent);

                    this.findEntity("mouse-controls-tip").click.connect(function () {
                        editor.setValue(editor.getValue() + "\n\
if (self.keymap.isMousePress() && self.keymap.isMouseMoved()) {\n\
		var v2fMouseShift = self.keymap.getMouseShift();\n\
		var fdX = v2fMouseShift.x / self.viewport.actualWidth * 10.0;\n\
		var fdY = v2fMouseShift.y / self.viewport.actualHeight * 10.0;\n\
		self.camera.setRotationByXYZAxis(-fdY, -fdX, 0);\n\
	}\n\
");
                    });
                }
                ListenerEditor.prototype.setupSignals = function () {
                    this.bindEvent = this.bindEvent || new akra.Signal(this);

                    _super.prototype.setupSignals.call(this);
                };

                ListenerEditor.prototype._bindEvent = function (pBtn) {
                    this.bindEvent.emit(this.editor.getValue());
                };

                ListenerEditor.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-listenereditor");
                };
                return ListenerEditor;
            })(ui.Panel);
            graph.ListenerEditor = ListenerEditor;

            ui.register("ListenerEditor", ListenerEditor);
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
// IUIGraphControls export interface
// [write description here...]
/// <reference path="IUIPanel.ts" />
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIGraph.ts" />
/// <reference path="IUIAnimationNode.ts" />
/// <reference path="IUIGraphControls.ts" />
/// <reference path="IUIAnimationGraph.ts" />
/// <reference path="../../../built/Lib/akra.d.ts" />
/// <reference path="IUIComponent.ts" />
var akra;
(function (akra) {
    (function (ECMD) {
        ECMD[ECMD["SET_PREVIEW_RESOLUTION"] = 0] = "SET_PREVIEW_RESOLUTION";
        ECMD[ECMD["SET_PREVIEW_FULLSCREEN"] = 1] = "SET_PREVIEW_FULLSCREEN";

        ECMD[ECMD["INSPECT_SCENE_NODE"] = 2] = "INSPECT_SCENE_NODE";
        ECMD[ECMD["INSPECT_ANIMATION_NODE"] = 3] = "INSPECT_ANIMATION_NODE";
        ECMD[ECMD["INSPECT_ANIMATION_CONTROLLER"] = 4] = "INSPECT_ANIMATION_CONTROLLER";

        ECMD[ECMD["EDIT_ANIMATION_CONTROLLER"] = 5] = "EDIT_ANIMATION_CONTROLLER";

        //меняем антиалисинг
        ECMD[ECMD["CHANGE_AA"] = 6] = "CHANGE_AA";

        //редактируем код происходящие на событие eventprovider'a
        ECMD[ECMD["EDIT_EVENT"] = 7] = "EDIT_EVENT";

        //редактируем основной код демо
        ECMD[ECMD["EDIT_MAIN_SCRIPT"] = 8] = "EDIT_MAIN_SCRIPT";

        ECMD[ECMD["LOAD_COLLADA"] = 9] = "LOAD_COLLADA";

        ECMD[ECMD["CHANGE_CAMERA"] = 10] = "CHANGE_CAMERA";

        ECMD[ECMD["SCREENSHOT"] = 11] = "SCREENSHOT";
    })(akra.ECMD || (akra.ECMD = {}));
    var ECMD = akra.ECMD;
})(akra || (akra = {}));
/// <reference path="Component.ts" />
/// <reference path="scene/Tree.ts" />
/// <reference path="Inspector.ts" />
/// <reference path="ViewportProperties.ts" />
/// <reference path="ListenerEditor.ts" />
var akra;
(function (akra) {
    /// <reference path="../idl/IUITabs.ts" />
    /// <reference path="../idl/IUIPopup.ts" />
    /// <reference path="../idl/IUICheckboxList.ts" />
    /// <reference path="../idl/IUIAnimationControls.ts" />
    /// <reference path="../idl/IUIIDE.ts" />
    (function (ui) {
        ui.ide = null;

        var Vec2 = akra.math.Vec2;
        var Vec3 = akra.math.Vec3;
        var Vec4 = akra.math.Vec4;

        (function (IAxis) {
            IAxis[IAxis["X"] = 0x01] = "X";
            IAxis[IAxis["Y"] = 0x04] = "Y";
            IAxis[IAxis["Z"] = 0x02] = "Z";
        })(ui.IAxis || (ui.IAxis = {}));
        var IAxis = ui.IAxis;

        function getFuncBody(f) {
            var s = f.toString();
            var sCode = s.slice(s.indexOf("{") + 1, s.lastIndexOf("}"));
            if (sCode.match(/^\s*$/)) {
                sCode = "";
            }
            return sCode;
        }

        function buildFuncByCodeWithSelfContext(sCode, self) {
            var f = new Function("self", sCode);
            var fnCallback = function () {
                return f(self);
            };
            fnCallback.toString = function () {
                return "function (self) {" + sCode + "}";
            };
            return fnCallback;
        }

        (function (EEditModes) {
            EEditModes[EEditModes["NONE"] = 0] = "NONE";
            EEditModes[EEditModes["PICK"] = 1] = "PICK";
            EEditModes[EEditModes["MOVE"] = 2] = "MOVE";
            EEditModes[EEditModes["ROTATE"] = 3] = "ROTATE";
            EEditModes[EEditModes["SCALE"] = 4] = "SCALE";
        })(ui.EEditModes || (ui.EEditModes = {}));
        var EEditModes = ui.EEditModes;

        var IDE = (function (_super) {
            __extends(IDE, _super);
            function IDE(parent, options) {
                var _this = this;
                _super.call(this, parent, options, 0 /* UNKNOWN */);
                this._fnMainScript = function () {
                };
                this._pEngine = null;
                this._pColladaDialog = null;
                //picking
                this._pSelectedObject = { object: null, renderable: null };
                //editing
                this._eEditMode = 0 /* NONE */;

                //common setup
                ui.ide = this;

                this._pEngine = ui.getUI(parent).getManager().getEngine();
                akra.debug.assert(!akra.isNull(this._pEngine), "Engine required!");

                //this.connect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));
                this.getCanvas().viewportAdded.connect(this, this._viewportAdded);

                this.template("IDE.tpl");

                //viewport setup
                var pViewportProperties = this._pPreview = this.findEntity("Preview");

                //setup Node properties
                var pInspector = this._pInspector = this.findEntity("Inspector");

                //setup Scene tree
                var pTree = this._pSceneTree = this.findEntity("SceneTree");
                pTree.fromScene(this.getScene());

                //setup 3d controls
                var p3DControls = this._p3DControls = this.findEntity("3d-controls");

                //this.connect(<IUICheckbox>p3DControls.findEntity("pick"), SIGNAL(changed), SLOT(_enablePickMode));
                //this.connect(<IUICheckbox>p3DControls.findEntity("translate"), SIGNAL(changed), SLOT(_enableTranslateMode));
                //this.connect(<IUICheckbox>p3DControls.findEntity("rotate"), SIGNAL(changed), SLOT(_enableRotateMode));
                //this.connect(<IUICheckbox>p3DControls.findEntity("scale-control"), SIGNAL(changed), SLOT(_enableScaleMode));
                p3DControls.findEntity("pick").changed.connect(this, this._enablePickMode);
                p3DControls.findEntity("translate").changed.connect(this, this._enableTranslateMode);
                p3DControls.findEntity("rotate").changed.connect(this, this._enableRotateMode);
                p3DControls.findEntity("scale-control").changed.connect(this, this._enableScaleMode);

                //connect node properties to scene tree
                //FIXME: Enter the interface IUIInspector and describe it signals.
                pInspector.nodeNameChanged.connect(this, this._updateSceneNodeName);

                var pTabs = this._pTabs = this.findEntity("WorkTabs");

                //create mode basis
                var pScene = this.getScene();

                // var pBasis: ISceneModel = util.basis(pScene);
                // pBasis.name = ".model-basis";
                // pBasis.visible = false;
                // pBasis.setInheritance(ENodeInheritance.ROTPOSITION);
                // this._pModelBasis = pBasis;
                var pBasisTranslation = this.getResourceManager().loadModel(akra.config.data + "/models/basis_translation.DAE", { shadows: false });

                pBasisTranslation.loaded.connect(function (pModel) {
                    var pModelRoot = pModel.attachToScene(pScene);

                    pModelRoot.attachToParent(pScene.getRootNode());

                    var pEl = pModelRoot.getChild();

                    /*while(!isNull(pEl)) {
                    var pMesh: IMesh = pEl.mesh;
                    
                    for (var i = 0; i < pMesh.length; ++ i) {
                    // console.log(pMesh.getSubset(i));
                    // pMesh.getSubset(i).bind(SIGNAL(beforeRender),
                    // 	(pRenderable: IRenderableObject, pViewport: IViewport, pTechnique: IRenderTechnique) => {
                    // 	pTechnique.getPass(0).setRenderState(ERenderStates.ZENABLE, ERenderStateValues.FALSE);
                    // });
                    }
                    
                    pEl = <ISceneModel>pEl.sibling;
                    }*/
                    _this._pModelBasisTrans = pModelRoot;

                    pModelRoot.setInheritance(4 /* ALL */);
                    pModelRoot.hide(true);

                    var iAxis = 0;

                    //basis-model center in world coord system
                    var vCenter = new Vec3;

                    //point under cursor in screen space
                    var vB = new Vec2;

                    //drag start point in screen space
                    var vO = new Vec2;

                    //basis model world position before dragging
                    var vStart = new Vec3;

                    //axis modifiers info array
                    var am = [];

                    function createAxisModifier(pModelRoot, pViewport, iAx) {
                        if (!akra.isDef(am[iAx])) {
                            am[iAx] = {
                                dir: new Vec3,
                                axis: new Vec4,
                                axisOrigin: new Vec4,
                                a: new Vec2
                            };
                        }

                        var vDir = am[iAx].dir;
                        var vAxis = am[iAx].axis;
                        var vAxisOrigin = am[iAx].axisOrigin;
                        var vA = am[iAx].a;

                        switch (iAx) {
                            case 1 /* X */:
                                vAxisOrigin.set(0.1, 0., 0., 1.);
                                break;
                            case 2 /* Z */:
                                vAxisOrigin.set(0., 0., 0.1, 1.);
                                break;
                            case 4 /* Y */:
                                vAxisOrigin.set(0., 0.1, 0., 1.);
                                break;
                        }

                        iAxis |= iAx;

                        pModelRoot.getWorldMatrix().multiplyVec4(vAxisOrigin, vAxis);

                        pViewport.projectPoint(vAxis.clone('xyz'), vDir);

                        vDir.clone('xy').subtract(vCenter.clone('xy'), vA);
                    }

                    function applyAxisModifier(m) {
                        var vA = m.a;
                        var vAxisOrigin = m.axisOrigin;

                        //угол между направлением куда тянет пользователь и проекциец ветора вдоль которго тянуть на экран.
                        var cosAlpha = vA.dot(vB) / (vA.length() * vB.length());

                        var fX = (cosAlpha * vB.length()) / vA.length();

                        //длинна вектора на который надо сдвинуть объект в пространстве камеры.
                        var vAx = Vec2.temp(vA.x * fX, vA.y * fX);
                        var vC = vO.add(vAx, Vec2.temp(0.));

                        var vC3d = vAxisOrigin.clone('xyz').scale(fX);

                        return vC3d.add(vStart);
                    }

                    var pNodes = pModelRoot.children();

                    for (var i = 0; i < pNodes.length; ++i) {
                        pNodes[i].mouseover.connect(function (pModel, pViewport, pSubset) {
                            var c = pSubset.getRenderMethodDefault().getMaterial().emissive;
                            c.set(c.r / 2., c.g / 2., c.b / 2., c.a / 2.);
                        });

                        pNodes[i].mouseout.connect(function (pModel, pViewport, pSubset) {
                            var c = pSubset.getRenderMethodDefault().getMaterial().emissive;
                            c.set(c.r * 2., c.g * 2., c.b * 2., c.a * 2.);
                        });

                        pNodes[i].dragstart.connect(function (pModel, pViewport, pSubset, x, y) {
                            var c = pSubset.getRenderMethodDefault().getMaterial().emissive;

                            vO.set(x, y);
                            vStart.set(pModelRoot.getWorldPosition());
                            pViewport.projectPoint(pModelRoot.getWorldPosition(), vCenter);

                            //colors at basis model on Y and Z axis was swaped, FAIL :(
                            if (c.r > 0) {
                                createAxisModifier(pModelRoot, pViewport, 1 /* X */);
                            }

                            if (c.g > 0) {
                                createAxisModifier(pModelRoot, pViewport, 2 /* Z */);
                            }

                            if (c.b > 0) {
                                createAxisModifier(pModelRoot, pViewport, 4 /* Y */);
                            }
                        });

                        pNodes[i].dragstop.connect(function (pModel, pViewport, pSubset) {
                            iAxis = 0;
                        });

                        pNodes[i].dragging.connect(function (pModel, pViewport, pSubset, x, y) {
                            Vec2.temp(x, y).subtract(vO, vB);

                            var vPos = Vec3.temp(0.);

                            if (iAxis & 1 /* X */) {
                                vPos.add(applyAxisModifier(am[1 /* X */]));
                            }

                            if (iAxis & 4 /* Y */) {
                                vPos.add(applyAxisModifier(am[4 /* Y */]));
                            }

                            if (iAxis & 2 /* Z */) {
                                vPos.add(applyAxisModifier(am[2 /* Z */]));
                            }

                            vPos.scale(1. / (iAxis).toString(2).match(/1/gi).length);

                            pModelRoot.setPosition(vPos);
                            _this.getSelectedObject().setWorldPosition(vPos);
                        });
                    }
                });
            }
            IDE.prototype.getScript = function () {
                return this._fnMainScript;
            };

            IDE.prototype.setScript = function (fn) {
                this._fnMainScript = fn;
            };

            //-===============================
            IDE.prototype.getSelectedObject = function () {
                return this._pSelectedObject.object;
            };

            IDE.prototype.getSelectedRenderable = function () {
                return this._pSelectedObject.renderable;
            };

            IDE.prototype.getEditMode = function () {
                return this._eEditMode;
            };

            IDE.prototype.setupSignals = function () {
                this.created = this.created || new akra.Signal(this);
                _super.prototype.setupSignals.call(this);
            };

            IDE.prototype._enablePickMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 1 /* PICK */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._enableTranslateMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 2 /* MOVE */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._enableRotateMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 3 /* ROTATE */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._enableScaleMode = function (pCb, bValue) {
                this._eEditMode = bValue ? 4 /* SCALE */ : 0 /* NONE */;
                this.updateEditting();
            };

            IDE.prototype._sceneUpdate = function (pScene) {
            };

            IDE.prototype.setupApiEntry = function () {
                this._apiEntry = {
                    engine: this.getEngine(),
                    camera: this.getCamera(),
                    viewport: this.getViewport(),
                    canvas: this.getCanvas(),
                    scene: this.getScene(),
                    rsmgr: this.getResourceManager(),
                    renderer: this.getEngine().getRenderer()
                };
            };

            IDE.prototype.getEngine = function () {
                return this._pEngine;
            };
            IDE.prototype.getCanvas = function () {
                return this.getEngine().getRenderer().getDefaultCanvas();
            };
            IDE.prototype.getScene = function () {
                return this.getEngine().getScene();
            };
            IDE.prototype.getCanvasElement = function () {
                return this.getCanvas()._pCanvas;
            };
            IDE.prototype.getResourceManager = function () {
                return this.getEngine().getResourceManager();
            };
            IDE.prototype.getViewport = function () {
                return this._pPreview.getViewport();
            };
            IDE.prototype.getCamera = function () {
                return this.getViewport().getCamera();
            };
            IDE.prototype.getComposer = function () {
                return this.getEngine().getComposer();
            };

            IDE.prototype._updateSceneNodeName = function (pInspector, pNode) {
                this._pSceneTree.sync(pNode);
            };

            IDE.prototype._viewportAdded = function (pTarget, pViewport) {
                var _this = this;
                //this.disconnect(this.getCanvas(), SIGNAL(viewportAdded), SLOT(_viewportAdded));
                this.getCanvas().viewportAdded.disconnect(this, this._viewportAdded);

                pViewport.enableSupportFor3DEvent(1 /* CLICK */ | 16 /* MOUSEOVER */ | 32 /* MOUSEOUT */ | 64 /* DRAGSTART */ | 128 /* DRAGSTOP */);

                this._pPreview.setViewport(pViewport);
                this.setupApiEntry();

                //this.connect(this.getScene(), SIGNAL(beforeUpdate), SLOT(_sceneUpdate));
                this.getScene().beforeUpdate.connect(this, this._sceneUpdate);
                this.created.emit();

                pViewport.click.connect(function (pViewport, x, y) {
                    if (_this.getEditMode() !== 0 /* NONE */) {
                        var pRes = pViewport.pick(x, y);

                        if (!_this._pModelBasisTrans.isAChild(pRes.object)) {
                            _this.selected(pRes.object, pRes.renderable);
                            _this.inspectNode(pRes.object);
                        }
                    }
                });
            };

            IDE.prototype.updateEditting = function (pObjectPrev, pRenderablePrev) {
                if (typeof pObjectPrev === "undefined") { pObjectPrev = null; }
                if (typeof pRenderablePrev === "undefined") { pRenderablePrev = null; }
                var pViewport = this.getViewport();
                var pObject = this.getSelectedObject();
                var pRenderable = this.getSelectedRenderable();

                if (akra.isNull(pViewport)) {
                    return;
                }

                if (!akra.isNull(pObjectPrev)) {
                    if (akra.scene.SceneModel.isModel(pObjectPrev)) {
                        pObjectPrev.getMesh().hideBoundingBox();
                    }
                }

                if (this.getEditMode() === 0 /* NONE */) {
                    pViewport.highlight(null, null);
                }

                if (this.getEditMode() !== 0 /* NONE */) {
                    pViewport.highlight(pObject, pRenderable);

                    if (akra.scene.SceneModel.isModel(pObject)) {
                        pObject.getMesh().hideBoundingBox();
                    }
                }

                if (this.getEditMode() === 2 /* MOVE */ && !akra.isNull(pObject)) {
                    if (akra.scene.SceneModel.isModel(pObject)) {
                        pObject.getMesh().showBoundingBox();
                    }

                    this._pModelBasisTrans.hide(false);
                    this._pModelBasisTrans.setPosition(pObject.getWorldPosition());
                } else {
                    this._pModelBasisTrans.hide();
                }
            };

            IDE.prototype.selected = function (pObj, pRenderable) {
                if (typeof pRenderable === "undefined") { pRenderable = null; }
                var pObjectPrev = this.getSelectedObject();
                var pRenderablePrev = this.getSelectedRenderable();

                var p = this._pSelectedObject;

                p.object = pObj;
                p.renderable = pRenderable;

                this.updateEditting(pObjectPrev, pRenderablePrev);
            };

            IDE.prototype.cmd = function (eCommand) {
                var argv = [];
                for (var _i = 0; _i < (arguments.length - 1); _i++) {
                    argv[_i] = arguments[_i + 1];
                }
                switch (eCommand) {
                    case 0 /* SET_PREVIEW_RESOLUTION */:
                        return this.setPreviewResolution(parseInt(argv[0]), parseInt(argv[1]));
                    case 1 /* SET_PREVIEW_FULLSCREEN */:
                        return this.setFullscreen();
                    case 2 /* INSPECT_SCENE_NODE */:
                        this.selected(argv[0]);
                        return this.inspectNode(argv[0]);

                    case 5 /* EDIT_ANIMATION_CONTROLLER */:
                        return this.editAnimationController(argv[0]);
                    case 3 /* INSPECT_ANIMATION_NODE */:
                        return this.inspectAnimationNode(argv[0]);
                    case 4 /* INSPECT_ANIMATION_CONTROLLER */:
                        return this.inspectAnimationController(argv[0]);
                    case 6 /* CHANGE_AA */:
                        return this.changeAntiAliasing(argv[0]);
                    case 9 /* LOAD_COLLADA */:
                        return this.loadColladaModel();
                    case 7 /* EDIT_EVENT */:
                        return this.editEvent(argv[0], argv[1]);
                    case 8 /* EDIT_MAIN_SCRIPT */:
                        return this.editMainScript();
                    case 10 /* CHANGE_CAMERA */:
                        return this.changeCamera(argv[0]);
                    case 11 /* SCREENSHOT */:
                        return this.saveScreenshot();
                }

                return false;
            };

            IDE.prototype.saveScreenshot = function () {
                saveAs(akra.conv.dutob(this.getCanvasElement().toDataURL("image/png")), "screen.png");
                return true;
            };

            IDE.prototype.changeCamera = function (pCamera) {
                this.getViewport().setCamera(pCamera);
                return true;
            };

            IDE.prototype.setPreviewResolution = function (iWidth, iHeight) {
                this.getCanvas().resize(iWidth, iHeight);
                return true;
            };

            IDE.prototype.setFullscreen = function () {
                this.getCanvas().setFullscreen(true);
                return true;
            };

            IDE.prototype.inspectNode = function (pNode) {
                if (akra.isNull(pNode)) {
                    return false;
                }

                this._pSceneTree.selectByGuid(pNode.guid);
                this._pInspector.inspectNode(pNode);
                return true;
            };

            IDE.prototype.inspectAnimationController = function (pController) {
                this._pInspector.inspectAnimationController(pController);
                return true;
            };

            IDE.prototype.editAnimationController = function (pController) {
                var sName = "controller-" + pController.guid;
                var iTab = this._pTabs.findTab(sName);

                if (iTab < 0) {
                    var pControls = this._pTabs.createComponent("animation.Controls", {
                        title: "Edit controller: " + pController.guid,
                        name: sName
                    });

                    pControls.graph.capture(pController);
                    iTab = this._pTabs.findTab(sName);
                }

                this._pTabs.select(iTab);

                return true;
            };

            IDE.prototype.inspectAnimationNode = function (pNode) {
                this._pInspector.inspectAnimationNode(pNode);
                return true;
            };

            IDE.prototype.changeAntiAliasing = function (bValue) {
                var pViewport = this.getViewport();
                if (pViewport.getType() === 1 /* DSVIEWPORT */) {
                    this._pPreview.getViewport().setFXAA(bValue);
                }
                return true;
            };

            IDE.prototype.loadColladaModel = function () {
                var pDlg = this._pColladaDialog;

                if (akra.isNull(this._pColladaDialog)) {
                    pDlg = this._pColladaDialog = this.createComponent("Popup", {
                        name: "load-collada-dlg",
                        title: "Load collada",
                        controls: "close",
                        template: "custom.LoadColladaDlg.tpl"
                    });

                    pDlg.closed.connect(function () {
                        if (parseInt(pDlg.getElement().css("bottom")) == 0) {
                            pDlg.getElement().animate({ bottom: -pDlg.getElement().height() }, 350, "easeInCirc", function () {
                                pDlg.hide();
                            });
                        } else {
                            pDlg.hide();
                        }
                    });

                    var pLoadBtn = pDlg.findEntity("load");
                    var $input = pDlg.getElement().find("input[name=url]");
                    var pRmgr = this.getResourceManager();
                    var pScene = this.getScene();

                    pLoadBtn.click.connect(function () {
                        var pModel = pRmgr.loadModel($input.val());

                        if (pModel.isResourceLoaded()) {
                            var pModelRoot = pModel.attachToScene(pScene);
                        }

                        pModel.loaded.connect(function (pModel) {
                            var pModelRoot = pModel.attachToScene(pScene);
                        });

                        pDlg.close();
                    });
                }

                var iHeight = pDlg.getElement().height();

                pDlg.getElement().css('top', 'auto').css('left', 'auto').css({ bottom: -iHeight, right: 10 });
                pDlg.show();
                pDlg.getElement().animate({ bottom: 0 }, 350, "easeOutCirc");

                return true;
            };

            IDE.prototype.editMainScript = function () {
                var sName = "main-script";
                var pListenerEditor;
                var iTab = this._pTabs.findTab(sName);
                var sCode = getFuncBody(this._fnMainScript);
                var self = this._apiEntry;
                var pIDE = this;

                if (iTab < 0) {
                    pListenerEditor = this._pTabs.createComponent("ListenerEditor", {
                        title: "Project code",
                        name: sName
                    });

                    pListenerEditor.bindEvent.connect(function (pEditor, sCode) {
                        pIDE.setScript(buildFuncByCodeWithSelfContext(sCode, self));
                        (pIDE.getScript())();
                    });

                    iTab = pListenerEditor.index;
                } else {
                    pListenerEditor = this._pTabs.tab(iTab);
                }

                this._pTabs.select(iTab);

                pListenerEditor.editor.setValue(sCode);

                return true;
            };

            //предпологается, что мы редактируем любого листенера, и что, исполнитель команды сам укажет нам,
            //какой номер у листенера, созданного им.
            IDE.prototype.editEvent = function (pTarget, sEvent, iListener, eType) {
                if (typeof iListener === "undefined") { iListener = 0; }
                if (typeof eType === "undefined") { eType = 1 /* BROADCAST */; }
                var sName = "event-" + sEvent + pTarget.guid;
                var pListenerEditor;
                var iTab = this._pTabs.findTab(sName);

                var pSign = pTarget[sEvent];
                var pListeners = pSign.getListeners(1 /* BROADCAST */);

                //editable listener
                var pListener = null;

                var sCode = "";
                var self = this._apiEntry;

                for (var i = 0; i < pListeners.length; ++i) {
                    if (akra.isNull(pListeners[i].reciever)) {
                        pListener = pListeners[i];
                        break;
                    }
                }

                if (akra.isNull(pListener.callback)) {
                    pSign.connect(function () {
                    });
                    return this.editEvent(pTarget, sEvent);
                }

                sCode = getFuncBody(pListener.callback);

                if (iTab < 0) {
                    pListenerEditor = this._pTabs.createComponent("ListenerEditor", {
                        title: "Ev.: " + sEvent + "(obj.: " + pTarget.guid + ")",
                        name: sName
                    });

                    pListenerEditor.bindEvent.connect(function (pEditor, sCode) {
                        pListener.callback = buildFuncByCodeWithSelfContext(sCode, self);
                    });

                    iTab = pListenerEditor.index;
                } else {
                    pListenerEditor = this._pTabs.tab(iTab);
                }

                this._pTabs.select(iTab);

                pListenerEditor.editor.setValue(sCode);

                return true;
            };
            return IDE;
        })(ui.Component);
        ui.IDE = IDE;

        ui.register("IDE", IDE);
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphRoute.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (graph) {
            var Route = (function () {
                function Route(pLeft, pRight) {
                    /** Route left address */
                    this._pLeft = null;
                    /** Route right address */
                    this._pRight = null;
                    /** Route status. */
                    this._bActive = false;
                    this._bHighlighted = false;
                    this._bEnabled = true;
                    /** Route domain */
                    this._pPath = null;
                    this._pArrow = null;
                    this._pInactiveColor = new akra.color.Color(.0, .0, .0, .75);
                    this._fWeight = 1.;
                    this._fMaxWeight = 1.;
                    this._pLeft = pLeft;
                    this._pRight = pRight;
                    this._pColor = akra.color.random(true);
                    this._pColor.a = .5;

                    if (!akra.isNull(pLeft)) {
                        pLeft.setRoute(this);
                    }

                    if (!akra.isNull(pRight)) {
                        pRight.setRoute(this);
                    }
                }
                Route.prototype.getInactiveColor = function () {
                    return this._pInactiveColor;
                };
                Route.prototype.getColor = function () {
                    return this._pColor;
                };
                Route.prototype.getLeft = function () {
                    return this._pLeft;
                };
                Route.prototype.getRight = function () {
                    return this._pRight;
                };
                Route.prototype.getWeight = function () {
                    return this._fWeight;
                };

                Route.prototype.setLeft = function (pConnector) {
                    if (!akra.isNull(this._pLeft)) {
                        this._pLeft.destroy();
                    }

                    this._pLeft = pConnector;
                };

                Route.prototype.setRight = function (pConnector) {
                    if (!akra.isNull(this._pRight)) {
                        this._pRight.destroy();
                    }

                    this._pRight = pConnector;
                };

                Route.prototype.getArrow = function () {
                    return this._pArrow;
                };

                Route.prototype.setArrow = function (pPath) {
                    var pRoute = this;

                    pPath.click(function (e) {
                        e.stopPropagation();
                        pRoute.activate(!pRoute.isActive());
                    });

                    this._pArrow = pPath;
                };

                Route.prototype.setWeight = function (fWeight) {
                    this._fWeight = fWeight;
                };

                Route.prototype.getPath = function () {
                    return this._pPath;
                };

                Route.prototype.getCanvas = function () {
                    return this.getLeft().getGraph().getCanvas();
                };

                Route.prototype.setPath = function (pPath) {
                    var pRoute = this;

                    pPath.click(function (e) {
                        e.stopPropagation();
                        pRoute.activate(!pRoute.isActive());
                    });

                    this._pPath = pPath;
                };

                Route.prototype.isEnabled = function () {
                    return this._bEnabled;
                };
                Route.prototype.setEnabled = function (b) {
                    if (b === this._bEnabled) {
                        return;
                    }

                    this._bEnabled = b;

                    this.routing();
                };

                Route.prototype.isConnectedWithNode = function (pNode) {
                    return this.getLeft().getNode() === pNode || this.getRight().getNode() === pNode;
                };

                Route.prototype.isConnectedWith = function (pConnector) {
                    return this.getLeft() === pConnector || this.getRight() === pConnector;
                };

                Route.prototype.isBridge = function () {
                    return !akra.isNull(this.getLeft()) && !akra.isNull(this.getRight());
                };

                Route.prototype.isActive = function () {
                    return this._bActive;
                };

                Route.prototype.detach = function () {
                    this._pLeft = null;
                    this._pRight = null;
                };

                Route.prototype.remove = function (bRecirsive) {
                    if (typeof bRecirsive === "undefined") { bRecirsive = false; }
                    if (!akra.isNull(this.getLeft())) {
                        this.getLeft().routeBreaked.emit(this);
                        bRecirsive && this.getLeft().destroy();
                    }

                    if (!akra.isNull(this.getRight())) {
                        this.getLeft().routeBreaked.emit(this);
                        bRecirsive && this.getRight().destroy();
                    }

                    if (!akra.isNull(this.getPath())) {
                        this.getPath().remove();
                        this.getArrow().remove();
                    }
                };

                Route.prototype.sendEvent = function (e) {
                    if (!this.isEnabled()) {
                        return;
                    }

                    for (var i = 0; i < e.traversedRoutes.length; ++i) {
                        if (e.traversedRoutes[i] === this) {
                            return;
                        }
                    }

                    e.traversedRoutes.push(this);

                    if (!akra.isNull(this.getRight())) {
                        this.getRight().sendEvent(e);
                    }

                    switch (e.type) {
                        case 2 /* SHOW_MAP */:
                            this._bHighlighted = true;
                            this.getLeft().getElement().css("backgroundColor", this.getColor().getHtml());
                            this.getRight().getElement().css("backgroundColor", this.getColor().getHtml());
                            this.routing();
                            break;
                        case 3 /* HIDE_MAP */:
                            this._bHighlighted = false;
                            this.getLeft().getElement().css("backgroundColor", "");
                            this.getRight().getElement().css("backgroundColor", "");
                            this.routing();
                            break;
                    }
                };

                Route.prototype.destroy = function () {
                    this.remove(false);
                };

                Route.prototype.activate = function (bValue) {
                    if (typeof bValue === "undefined") { bValue = true; }
                    if (this.isActive() === bValue) {
                        return;
                    }

                    // if (bValue === false && (this.left.isActive() || this.right.isActive())) {
                    // 	return;
                    // }
                    this._bActive = bValue;

                    if (!akra.isNull(this.getPath())) {
                        this.getPath().attr({ "stroke-width": bValue ? 3 : 1 });
                    }

                    this.getLeft() && this.getLeft().activate(bValue);
                    this.getRight() && this.getRight().activate(bValue);
                };

                Route.prototype.routing = function () {
                    var pLeft = Route.calcPosition(this.getLeft());
                    var pRight = Route.calcPosition(this.getRight());

                    this.drawRoute(pLeft, pRight, this.getLeft().getOrient(), this.getRight().getOrient());
                };

                Route.prototype.drawRoute = function (pFrom, pTo, eFromOr, eToOr) {
                    if (typeof eFromOr === "undefined") { eFromOr = 0 /* UNKNOWN */; }
                    if (typeof eToOr === "undefined") { eToOr = 0 /* UNKNOWN */; }
                    var pFromAdd = { x: 0, y: 0 };
                    var pToAdd = { x: 0, y: 0 };
                    var dY = pTo.y - pFrom.y;
                    var dX = pTo.x - pFrom.x;
                    var isVertF = false;
                    var isVertT = false;

                    if (eFromOr == 1 /* UP */ || eFromOr == 2 /* DOWN */) {
                        isVertF = true;
                    }

                    if (eToOr == 1 /* UP */ || eToOr == 2 /* DOWN */) {
                        isVertT = true;
                    }

                    if (isVertT != isVertF) {
                        this.drawRoute(pFrom, pTo);
                        return;
                    }

                    if (dY > 0) {
                        if (eFromOr == 1 /* UP */) {
                            pFromAdd.y = dY;
                        }

                        if (eToOr == 2 /* DOWN */) {
                            pToAdd.y = -dY;
                        }
                    }

                    if (dY < 0) {
                        if (eFromOr == 2 /* DOWN */) {
                            pFromAdd.y = -dY;
                        }

                        if (eToOr == 1 /* UP */) {
                            pToAdd.y = dY;
                        }
                    }

                    if (dX > 0) {
                        if (eFromOr == 3 /* LEFT */) {
                            pFromAdd.x = dX;
                        }

                        if (eToOr == 4 /* RIGHT */) {
                            pToAdd.x = -dX;
                        }
                    }

                    if (dX < 0) {
                        if (eFromOr == 4 /* RIGHT */) {
                            pFromAdd.x = -dX;
                        }

                        if (eToOr == 3 /* LEFT */) {
                            pToAdd.x = dX;
                        }
                    }

                    var pPath = [
                        ["M", pFrom.x, pFrom.y], [
                            "C",
                            pFrom.x,
                            pFrom.y,
                            isVertF ? pFrom.x : ((pFrom.x + pFromAdd.x) * 7 + pTo.x * 3) / 10,
                            isVertF ? ((pFrom.y + pFromAdd.y) * 7 + pTo.y * 3) / 10 : pFrom.y,
                            (pFrom.x + pTo.x) / 2,
                            (pFrom.y + pTo.y) / 2,
                            (pFrom.x + pTo.x) / 2,
                            (pFrom.y + pTo.y) / 2,
                            isVertT ? pTo.x : (pFrom.x * 3 + (pTo.x + pToAdd.x) * 7) / 10,
                            isVertT ? (pFrom.y * 3 + (pTo.y + pToAdd.y) * 7) / 10 : pTo.y,
                            pTo.x,
                            pTo.y
                        ]
                    ];
                    var sColor = this._bHighlighted ? this.getColor().getHtmlRgba() : this.getInactiveColor().getHtmlRgba();
                    var fWeight = this._bHighlighted ? 2. * this._fMaxWeight * this._fWeight : this._fMaxWeight * this._fWeight;

                    sColor = this.isBridge() ? sColor : "rgba(255, 255, 255, 1.)";

                    if (!this.isEnabled()) {
                        sColor = "rgba(55, 55, 55, .5)";
                        fWeight = this._fMaxWeight * this._fWeight;
                    }

                    if (!akra.isNull(this.getPath())) {
                        this.getPath().attr({
                            path: pPath,
                            "stroke": sColor,
                            "stroke-width": fWeight
                        });
                    } else {
                        this.setPath(this.getCanvas().getPath()(pPath).attr({
                            "stroke": sColor,
                            "stroke-width": fWeight,
                            "stroke-linecap": "round"
                        }));
                    }

                    var iLength = this.getPath().getTotalLength();
                    var iArrowHeight = 3;
                    var iArrowWidth = 10;

                    var pCenter = this.getPath().getPointAtLength(akra.math.max(iLength - iArrowWidth, 0));
                    var pArrowPos = this.getPath().getPointAtLength(akra.math.max(this.isBridge() ? iLength - 5 : iLength, 0));

                    var fAngle = akra.math.HALF_PI + akra.math.atan2(pCenter.x - pTo.x, pTo.y - pCenter.y);

                    // fAngle = (fAngle / (math.TWO_PI)) * 360;
                    var pA0 = { x: (0 - iArrowWidth), y: (0 - iArrowHeight) };
                    var pA1 = { x: (0 - iArrowWidth), y: (0 + iArrowHeight) };

                    var pA0n = {
                        x: pA0.x * akra.math.cos(fAngle) - pA0.y * akra.math.sin(fAngle),
                        y: pA0.x * akra.math.sin(fAngle) + pA0.y * akra.math.cos(fAngle)
                    };

                    var pA1n = {
                        x: pA1.x * akra.math.cos(fAngle) - pA1.y * akra.math.sin(fAngle),
                        y: pA1.x * akra.math.sin(fAngle) + pA1.y * akra.math.cos(fAngle)
                    };

                    var pArrow = [
                        ["M", pArrowPos.x, pArrowPos.y],
                        ["L", pArrowPos.x + pA0n.x, pArrowPos.y + pA0n.y],
                        ["L", pArrowPos.x + pA1n.x, pArrowPos.y + pA1n.y],
                        ["L", (pArrowPos.x), (pArrowPos.y)]
                    ];

                    if (!akra.isNull(this.getArrow())) {
                        this.getArrow().attr({
                            path: pArrow,
                            "fill": sColor
                        });
                    } else {
                        this.setArrow(this.getCanvas().getPath()(pArrow).attr({
                            "fill": sColor,
                            //"stroke": "#FF0",
                            "stroke-width": 1
                        }));
                    }
                    // (<any>this.arrow).rotate(90 + fAngle, pTo.x, pTo.y);
                };

                Route.calcPosition = function (pConnector) {
                    var pGraph = pConnector.getGraph();

                    var pGraphOffset = pGraph.$element.offset();
                    var pPosition = pConnector.$element.offset();
                    var pOut = { x: pPosition.left - pGraphOffset.left, y: pPosition.top - pGraphOffset.top };

                    pOut.x += pConnector.$element.width() / 2.;
                    pOut.y += pConnector.$element.height() / 2.;

                    return pOut;
                };
                return Route;
            })();
            graph.Route = Route;

            var TempRoute = (function (_super) {
                __extends(TempRoute, _super);
                function TempRoute(pLeft) {
                    _super.call(this, pLeft, null);
                }
                TempRoute.prototype.routing = function (pRight) {
                    if (typeof pRight === "undefined") { pRight = { x: 0, y: 0 }; }
                    var pLeft = Route.calcPosition(this.getLeft());

                    this.drawRoute(pLeft, pRight);
                };
                return TempRoute;
            })(Route);
            graph.TempRoute = TempRoute;
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraphRoute.ts" />
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="Route.ts" />
        /// <reference path="../Component.ts" />
        (function (graph) {
            var KeydownSignal = (function (_super) {
                __extends(KeydownSignal, _super);
                function KeydownSignal() {
                    _super.apply(this, arguments);
                }
                KeydownSignal.prototype.emit = function (e) {
                    var pGraph = this.getSender();
                    var pNodes = pGraph.getNodes();

                    for (var i = 0; i < pNodes.length; ++i) {
                        var iKeyCode = e.keyCode;
                        if (iKeyCode === 46 /* DELETE */) {
                            pNodes[i].sendEvent(Graph.event(1 /* DELETE */));
                        }
                    }

                    _super.prototype.emit.call(this, e);
                };
                return KeydownSignal;
            })(akra.Signal);

            var MouseupSignal = (function (_super) {
                __extends(MouseupSignal, _super);
                function MouseupSignal() {
                    _super.apply(this, arguments);
                }
                MouseupSignal.prototype.emit = function (e) {
                    var pGraph = this.getSender();

                    if (!akra.isNull(pGraph.getTempRoute())) {
                        pGraph.removeTempRoute();
                    }
                };
                return MouseupSignal;
            })(akra.Signal);

            var MousemoveSignal = (function (_super) {
                __extends(MousemoveSignal, _super);
                function MousemoveSignal() {
                    _super.apply(this, arguments);
                }
                MousemoveSignal.prototype.emit = function (e) {
                    var pGraph = this.getSender();

                    if (!akra.isNull(pGraph.getTempRoute())) {
                        var pOffset = pGraph.getElement().offset();
                        pGraph.getTempRoute().routing({ x: e.pageX - pOffset.left, y: e.pageY - pOffset.top });
                    }
                };
                return MousemoveSignal;
            })(akra.Signal);

            var ClickSignal = (function (_super) {
                __extends(ClickSignal, _super);
                function ClickSignal() {
                    _super.apply(this, arguments);
                }
                ClickSignal.prototype.emit = function (e) {
                    var pGraph = this.getSender();

                    _super.prototype.emit.call(this, e);

                    var pNodes = pGraph.getNodes();

                    for (var i = 0; i < pNodes.length; ++i) {
                        // LOG("deactivate node > ", pNodes[i]);
                        pNodes[i].activate(false);
                    }

                    _super.prototype.emit.call(this, e);
                };
                return ClickSignal;
            })(akra.Signal);

            var Graph = (function (_super) {
                __extends(Graph, _super);
                function Graph(parent, options, eType) {
                    if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                    _super.call(this, parent, options, 19 /* GRAPH */);
                    this._pCanvas = null;
                    this._pTempRoute = null;
                    this.$svg = null;

                    this._eGraphType = eType;

                    //FIXME: unblock selection
                    // this.getHTMLElement().onselectstart = () => { return false };
                    this.getElement().disableSelection();
                    this.handleEvent("mouseup mousemove keydown click");
                }
                Graph.prototype.getNodes = function () {
                    var pNodes = [];
                    var pChild = this.getChild();

                    while (!akra.isNull(pChild)) {
                        pNodes.push(pChild);
                        pChild = pChild.getSibling();
                    }

                    return pNodes;
                };

                Graph.prototype.getTempRoute = function () {
                    return this._pTempRoute;
                };

                Graph.prototype.getGraphType = function () {
                    return this._eGraphType;
                };
                Graph.prototype.getCanvas = function () {
                    return this._pCanvas;
                };

                Graph.prototype.setupSignals = function () {
                    this.keydown = this.keydown || new KeydownSignal(this);
                    this.mousemove = this.mousemove || new MousemoveSignal(this);
                    this.mouseup = this.mouseup || new MouseupSignal(this);
                    this.click = this.click || new ClickSignal(this);

                    this.connectionBegin = this.connectionBegin || new akra.Signal(this);
                    this.connectionEnd = this.connectionEnd || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                Graph.prototype.createRouteFrom = function (pFrom) {
                    this._pTempRoute = new graph.TempRoute(pFrom);
                    this.connectionBegin.emit(this._pTempRoute);
                };

                Graph.prototype.removeTempRoute = function () {
                    this._pTempRoute.destroy();
                    this._pTempRoute = null;
                    this.connectionEnd.emit();
                };

                Graph.prototype.isReadyForConnect = function () {
                    return !akra.isNull(this._pTempRoute);
                };

                Graph.prototype.connectTo = function (pTo) {
                    if (akra.isNull(this._pTempRoute)) {
                        return;
                    }

                    var pFrom = this._pTempRoute.getLeft();

                    if (pFrom.getNode() === pTo.getNode()) {
                        akra.debug.log("connection to same node forbidden");
                        this.removeTempRoute();
                        return;
                    }

                    var pRoute = new graph.Route(pFrom, pTo);
                    pRoute.routing();

                    this._pTempRoute.detach();
                    this.removeTempRoute();
                };

                Graph.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);

                    this._pCanvas = Raphael(this.getHTMLElement(), 0, 0);

                    var $svg = this.$svg = this.$element.children(":first");

                    $svg.css({
                        width: "100%",
                        height: "100%"
                    });

                    this.getElement().addClass("component-graph");
                };

                Graph.event = function (eType) {
                    return {
                        type: eType,
                        traversedRoutes: []
                    };
                };
                Graph.KeydownSignal = KeydownSignal;
                Graph.MousemoveSignal = MousemoveSignal;
                Graph.MouseupSignal = MouseupSignal;
                Graph.ClickSignal = ClickSignal;
                return Graph;
            })(ui.Component);
            graph.Graph = Graph;

            ui.register("Graph", Graph);
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />
/// <reference path="../../idl/IUIGraphConnectionArea.ts"/>
/// <reference path="../Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (graph) {
            var ConnectedSignal = (function (_super) {
                __extends(ConnectedSignal, _super);
                function ConnectedSignal() {
                    _super.apply(this, arguments);
                }
                ConnectedSignal.prototype.emit = function (pTarget) {
                    this.getSender().getElement().addClass("connected");
                    _super.prototype.emit.call(this, pTarget);
                };
                return ConnectedSignal;
            })(akra.Signal);

            var MousedownSignal = (function (_super) {
                __extends(MousedownSignal, _super);
                function MousedownSignal() {
                    _super.apply(this, arguments);
                }
                MousedownSignal.prototype.emit = function (e) {
                    var pConnector = this.getSender();

                    e.preventDefault();
                    e.stopPropagation();

                    if (!akra.isNull(pConnector.getRoute())) {
                        return;
                    }

                    pConnector.getGraph().createRouteFrom(pConnector);
                };
                return MousedownSignal;
            })(akra.Signal);

            var MouseupSignal = (function (_super) {
                __extends(MouseupSignal, _super);
                function MouseupSignal() {
                    _super.apply(this, arguments);
                }
                MouseupSignal.prototype.emit = function (e) {
                    var pConnector = this.getSender();

                    if (pConnector.getDirection() === 1 /* IN */ && !pConnector.isConnected() && pConnector.getNode().isSuitable()) {
                        e.stopPropagation();
                        pConnector.getGraph().connectTo(pConnector);
                    }
                };
                return MouseupSignal;
            })(akra.Signal);

            var Connector = (function (_super) {
                __extends(Connector, _super);
                function Connector(parent, options) {
                    _super.call(this, parent, options, 21 /* GRAPH_CONNECTOR */);
                    this._eOrient = 0 /* UNKNOWN */;
                    this._eDirect = 1 /* IN */;
                    this._bActive = false;
                    this._pRoute = null;

                    this.handleEvent("mousedown mouseup");
                    this.getElement().disableSelection();
                }
                Connector.prototype.getOrient = function () {
                    return this._eOrient;
                };
                Connector.prototype.getArea = function () {
                    return this.getParent().getParent();
                };
                Connector.prototype.getNode = function () {
                    return this.getArea().getNode();
                };
                Connector.prototype.getGraph = function () {
                    return this.getNode().getGraph();
                };
                Connector.prototype.getRoute = function () {
                    return this._pRoute;
                };
                Connector.prototype.getDirection = function () {
                    return this._eDirect;
                };

                Connector.prototype.setOrient = function (e) {
                    this._eOrient = e;
                };

                Connector.prototype.setRoute = function (pRoute) {
                    this._pRoute = pRoute;

                    if (pRoute.isBridge()) {
                        if (this === pRoute.getLeft()) {
                            this.output();
                            this.connected.emit(pRoute.getRight());
                        } else {
                            this.input();
                            this.connected.emit(pRoute.getLeft());
                        }
                    }
                };

                Connector.prototype.setupSignals = function () {
                    this.mouseup = this.mouseup || new MouseupSignal(this);
                    this.mousedown = this.mousedown || new MousedownSignal(this);

                    this.activated = this.activated || new akra.Signal(this);
                    this.connected = this.connected || new ConnectedSignal(this);
                    this.routeBreaked = this.routeBreaked || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                Connector.prototype.hasRoute = function () {
                    return !akra.isNull(this.getRoute());
                };

                Connector.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-graphconnector");
                };

                Connector.prototype.isConnected = function () {
                    return !akra.isNull(this.getRoute()) && this.getRoute().isBridge();
                };

                Connector.prototype.isActive = function () {
                    return this._bActive;
                };

                Connector.prototype.activate = function (bValue) {
                    if (typeof bValue === "undefined") { bValue = true; }
                    if (this.isActive() === bValue) {
                        return;
                    }

                    this._bActive = bValue;
                    this.activated.emit(bValue);
                    this.highlight(bValue);

                    this.getRoute().activate(bValue);
                };

                Connector.prototype.sendEvent = function (e) {
                    this.getNode().sendEvent(e);
                };

                Connector.prototype.input = function () {
                    this.getElement().addClass("in");
                    this._eDirect = 1 /* IN */;
                    return true;
                };

                Connector.prototype.output = function () {
                    this.getElement().addClass("out");
                    this._eDirect = 2 /* OUT */;
                    return true;
                };

                // setDirection(eDirect: EUIGraphDirections): boolean {
                // 	return (eDirect === EUIGraphDirections.IN? this.input(): this.output());
                // }
                Connector.prototype.highlight = function (bToggle) {
                    if (typeof bToggle === "undefined") { bToggle = false; }
                    bToggle ? this.$element.addClass("highlight") : this.$element.removeClass("highlight");
                };

                Connector.prototype.routing = function () {
                    // LOG("routing");
                    this.getRoute().routing();
                };

                Connector.UIGRAPH_INVALID_CONNECTION = -1;

                Connector.ConnectedSignal = ConnectedSignal;
                Connector.MousedownSignal = MousedownSignal;
                Connector.MouseupSignal = MouseupSignal;
                return Connector;
            })(ui.Component);
            graph.Connector = Connector;

            ui.register("GraphConnector", Connector);
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraphConnectionArea.ts" />
/// <reference path="../../idl/IUIGraphConnector.ts" />
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../Panel.ts" />
/// <reference path="Connector.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (graph) {
            var ConnectionArea = (function (_super) {
                __extends(ConnectionArea, _super);
                function ConnectionArea(parent, options, eType) {
                    if (typeof eType === "undefined") { eType = 23 /* GRAPH_CONNECTIONAREA */; }
                    _super.call(this, parent, options, eType);
                    this._iMode = 1 /* IN */ | 2 /* OUT */;
                    this._pConnectors = new Array();
                    this._pTempConnect = null;
                    this._iConnectionLimit = -1;
                    this._iInConnectionLimit = akra.MAX_INT8;
                    this._iOutConnectionLimit = akra.MAX_INT8;
                    this._eConectorOrient = 0 /* UNKNOWN */;

                    if (!akra.isNull(options)) {
                        this._iConnectionLimit = akra.isInt(options.maxConnections) ? options.maxConnections : -1;
                        this._iInConnectionLimit = akra.isInt(options.maxInConnections) ? options.maxInConnections : akra.MAX_INT8;
                        this._iOutConnectionLimit = akra.isInt(options.maxOutConnections) ? options.maxOutConnections : akra.MAX_INT8;
                    }

                    if (this._iConnectionLimit == -1) {
                        this._iConnectionLimit = this._iInConnectionLimit + this._iOutConnectionLimit;
                    }

                    this.getElement().disableSelection();
                }
                ConnectionArea.prototype.getConnectors = function () {
                    return this._pConnectors;
                };

                ConnectionArea.prototype.getNode = function () {
                    return this.getParent();
                };
                ConnectionArea.prototype.getGraph = function () {
                    return this.getNode().getGraph();
                };

                ConnectionArea.prototype.setMaxInConnections = function (n) {
                    this._iInConnectionLimit = n;
                };

                ConnectionArea.prototype.setMaxOutConnections = function (n) {
                    this._iOutConnectionLimit = n;
                };

                ConnectionArea.prototype.setMaxConnections = function (n) {
                    this._iConnectionLimit = n;
                };

                ConnectionArea.prototype.setupSignals = function () {
                    this.connected = this.connected || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                ConnectionArea.prototype.attachToParent = function (pParent) {
                    akra.logger.assert(ui.isComponent(pParent, 20 /* GRAPH_NODE */), "only graph node can be parent!!");
                    if (_super.prototype.attachToParent.call(this, pParent)) {
                        //this.connect(this.node, SIGNAL(mouseenter), SLOT(_onNodeMouseover));
                        this.getNode().mouseenter.connect(this, this._onNodeMouseover);

                        //this.connect(this.node, SIGNAL(mouseleave), SLOT(_onNodeMouseout));
                        this.getNode().mouseleave.connect(this, this._onNodeMouseout);
                    }

                    return false;
                };

                ConnectionArea.prototype._createdFrom = function ($comp) {
                    _super.prototype._createdFrom.call(this, $comp);

                    var sMode = $comp.attr("mode");
                    var sMaxConnections = $comp.attr("connections-limit");
                    var sMaxInConnections = $comp.attr("connections-in-limit");
                    var sMaxOutConnections = $comp.attr("connections-out-limit");
                    var sOrient = $comp.attr("orientation");

                    if (akra.isString(sMode)) {
                        if (sMode === "out") {
                            this.setMode(2 /* OUT */);
                        } else if (sMode === "in") {
                            this.setMode(1 /* IN */);
                        } else if (sMode === "inout") {
                            this.setMode(1 /* IN */ | 2 /* OUT */);
                        }
                    }

                    if (akra.isString(sMaxConnections)) {
                        this.setMaxConnections(parseInt(sMaxConnections));
                    }

                    if (akra.isString(sMaxInConnections)) {
                        this.setMaxConnections(parseInt(sMaxInConnections));
                    }

                    if (akra.isString(sMaxOutConnections)) {
                        this.setMaxConnections(parseInt(sMaxOutConnections));
                    }

                    if (akra.isString(sOrient)) {
                        switch (sOrient.toLowerCase()) {
                            case "up":
                                this._eConectorOrient = 1 /* UP */;
                                break;
                            case "down":
                                this._eConectorOrient = 2 /* DOWN */;
                                break;
                            case "left":
                                this._eConectorOrient = 3 /* LEFT */;
                                break;
                            case "right":
                                this._eConectorOrient = 4 /* RIGHT */;
                                break;
                        }
                    }
                };

                ConnectionArea.prototype.findRoute = function (pNode) {
                    for (var i = 0; i < this._pConnectors.length; ++i) {
                        var pRoute = this._pConnectors[i].getRoute();
                        if (pRoute.isConnectedWithNode(pNode)) {
                            return pRoute;
                        }
                    }

                    return null;
                };

                ConnectionArea.prototype.connectorsCount = function (eDir) {
                    if (arguments.length === 0) {
                        return this._pConnectors.length;
                    }

                    var n = 0;

                    for (var i = 0; i < this._pConnectors.length; ++i) {
                        if (this._pConnectors[i].getDirection() === eDir) {
                            n++;
                        }
                    }

                    return n;
                };

                ConnectionArea.prototype.setMode = function (iMode) {
                    this._iMode = iMode;
                };

                ConnectionArea.prototype.isSupportsIncoming = function () {
                    return this.connectorsCount(1 /* IN */) < this._iInConnectionLimit && akra.bf.testAny(this._iMode, 1 /* IN */) && !this.isLimitReached();
                };

                ConnectionArea.prototype.isSupportsOutgoing = function () {
                    return this.connectorsCount(2 /* OUT */) < this._iOutConnectionLimit && akra.bf.testAny(this._iMode, 2 /* OUT */) && !this.isLimitReached();
                };

                ConnectionArea.prototype.isLimitReached = function () {
                    return this._pConnectors.length >= this._iConnectionLimit;
                };

                ConnectionArea.prototype.hasConnections = function () {
                    return !(this.getConnectors().length == 0 || akra.isNull(this.getConnectors()[0]));
                };

                ConnectionArea.prototype.isActive = function () {
                    return this.getNode().isActive();
                };

                ConnectionArea.prototype.activate = function (bValue) {
                    if (typeof bValue === "undefined") { bValue = true; }
                    for (var i = 0; i < this._pConnectors.length; ++i) {
                        this._pConnectors[i].activate(bValue);
                    }
                };

                ConnectionArea.prototype.sendEvent = function (e) {
                    for (var i = 0; i < this._pConnectors.length; ++i) {
                        if (this._pConnectors[i].getDirection() === 2 /* OUT */) {
                            this._pConnectors[i].getRoute().sendEvent(e);
                        }
                    }

                    if (e.type === 1 /* DELETE */) {
                        if (this.isActive()) {
                            this.destroy();
                        }
                    }
                };

                ConnectionArea.prototype.prepareForConnect = function () {
                    var pConnector = this._pTempConnect = new graph.Connector(this);
                    pConnector.setOrient(this._eConectorOrient);

                    //this.graph.isReadyForConnect()? pConnector.input(): pConnector.output();
                    //this.connect(pConnector, SIGNAL(routeBreaked), SLOT(destroyTempConnect));
                    pConnector.routeBreaked.connect(this, this.destroyTempConnect);

                    //this.connect(pConnector, SIGNAL(connected), SLOT(onConnection));
                    pConnector.connected.connect(this, this.onConnection);

                    return pConnector;
                };

                ConnectionArea.prototype._onNodeMouseover = function (pNode, e) {
                    //FIXME
                    var pArea = this;
                    setTimeout(function () {
                        pArea.routing();
                    }, 10);

                    if ((!this.isSupportsIncoming() && this.getGraph().isReadyForConnect()) || (!this.isSupportsOutgoing() && !this.getGraph().isReadyForConnect())) {
                        return;
                    }

                    if (!akra.isNull(this._pTempConnect)) {
                        return;
                    }

                    this.prepareForConnect();
                };

                ConnectionArea.prototype.onConnection = function (pConnector, pTarget) {
                    akra.debug.assert(pConnector === this._pTempConnect, "oO!!");

                    // LOG("connected!! node(" + this.node.getGuid() + ") connector(" + pConnector.getGuid() + ")");
                    //this.disconnect(pConnector, SIGNAL(connected), SLOT(onConnection));
                    pConnector.connected.disconnect(this, this.onConnection);
                    this._pTempConnect = null;
                    this._pConnectors.push(pConnector);

                    this.connected.emit(pConnector, pTarget);
                };

                ConnectionArea.prototype.destroyTempConnect = function () {
                    this._pTempConnect.destroy();
                    this._pTempConnect = null;
                };

                ConnectionArea.prototype._onNodeMouseout = function (pNode, e) {
                    //FIXME
                    var pArea = this;
                    setTimeout(function () {
                        pArea.routing();
                    }, 10);

                    if (akra.isNull(this._pTempConnect) || this._pTempConnect.hasRoute()) {
                        return;
                    }

                    this.destroyTempConnect();
                };

                ConnectionArea.prototype.routing = function () {
                    for (var i = 0; i < this._pConnectors.length; ++i) {
                        this._pConnectors[i].routing();
                    }
                };

                ConnectionArea.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-connectionarea");
                };
                return ConnectionArea;
            })(ui.Panel);
            graph.ConnectionArea = ConnectionArea;

            function isConnectionArea(pEntity) {
                return ui.isComponent(pEntity, 23 /* GRAPH_CONNECTIONAREA */);
            }
            graph.isConnectionArea = isConnectionArea;

            ui.register("GraphConnectionArea", ConnectionArea);
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../Component.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="Connector.ts" />
        /// <reference path="Route.ts" />
        /// <reference path="ConnectionArea.ts" />
        (function (graph) {
            var MouseenterSignal = (function (_super) {
                __extends(MouseenterSignal, _super);
                function MouseenterSignal() {
                    _super.apply(this, arguments);
                }
                MouseenterSignal.prototype.emit = function (e) {
                    var pNode = this.getSender();

                    _super.prototype.emit.call(this, e);

                    // this.routing();
                    pNode.sendEvent(graph.Graph.event(2 /* SHOW_MAP */));
                };
                return MouseenterSignal;
            })(akra.Signal);

            var MouseleaveSignal = (function (_super) {
                __extends(MouseleaveSignal, _super);
                function MouseleaveSignal() {
                    _super.apply(this, arguments);
                }
                MouseleaveSignal.prototype.emit = function (e) {
                    var pNode = this.getSender();

                    _super.prototype.emit.call(this, e);

                    // this.routing();
                    pNode.sendEvent(graph.Graph.event(3 /* HIDE_MAP */));
                };
                return MouseleaveSignal;
            })(akra.Signal);

            var MoveSignal = (function (_super) {
                __extends(MoveSignal, _super);
                function MoveSignal() {
                    _super.apply(this, arguments);
                }
                MoveSignal.prototype.emit = function (e) {
                    var pNode = this.getSender();

                    pNode.routing();
                };
                return MoveSignal;
            })(akra.Signal);

            var DbclickSignal = (function (_super) {
                __extends(DbclickSignal, _super);
                function DbclickSignal() {
                    _super.apply(this, arguments);
                }
                DbclickSignal.prototype.emit = function (e) {
                    var pNode = this.getSender();

                    pNode.activate(!pNode.isActive());
                };
                return DbclickSignal;
            })(akra.Signal);

            var ClickSignal = (function (_super) {
                __extends(ClickSignal, _super);
                function ClickSignal() {
                    _super.apply(this, arguments);
                }
                ClickSignal.prototype.emit = function (e) {
                    var pNode = this.getSender();

                    e.stopPropagation();
                    _super.prototype.emit.call(this, e);
                    pNode.selected.emit(false);
                };
                return ClickSignal;
            })(akra.Signal);

            var Node = (function (_super) {
                __extends(Node, _super);
                function Node(pGraph, options, eType, $el) {
                    if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                    _super.call(this, ui.getUI(pGraph), options, 20 /* GRAPH_NODE */, $el);
                    this._isActive = false;
                    this._pAreas = {};
                    this._isSuitable = true;

                    this._eGraphNodeType = eType;

                    akra.logger.assert(ui.isComponent(pGraph, 19 /* GRAPH */), "only graph may be as parent", pGraph);

                    this.attachToParent(pGraph);

                    if (!akra.isDef(options) || options.init !== false) {
                        this.template("graph.Node.tpl");
                        this.init();
                    }

                    this.handleEvent("mouseenter mouseleave dblclick click");
                    this.setDraggable();

                    var node = this;

                    //FIXME: without timeout must be all OK!
                    setTimeout(function () {
                        node.getElement().css("position", "absolute");
                        node.getElement().offset(node.getGraph().getElement().offset());
                    }, 5);

                    //this.connect(pGraph, SIGNAL(connectionBegin), SLOT(onConnectionBegin));
                    //this.connect(pGraph, SIGNAL(connectionEnd), SLOT(onConnectionEnd));
                    pGraph.connectionBegin.connect(this, this.onConnectionBegin);
                    pGraph.connectionEnd.connect(this, this.onConnectionEnd);

                    this.getElement().disableSelection();
                }
                Node.prototype.getGraphNodeType = function () {
                    return this._eGraphNodeType;
                };

                Node.prototype.getGraph = function () {
                    return this.getParent();
                };

                Node.prototype.getAreas = function () {
                    return this._pAreas;
                };

                Node.prototype.setupSignals = function () {
                    this.mouseenter = this.mouseenter || new MouseenterSignal(this);
                    this.mouseleave = this.mouseleave || new MouseleaveSignal(this);
                    this.click = this.click || new ClickSignal(this);
                    this.move = this.move || new MoveSignal(this);
                    this.dblclick = this.dblclick || new DbclickSignal(this);

                    this.beforeDestroy = this.beforeDestroy || new akra.Signal(this);
                    this.selected = this.selected || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                Node.prototype.getOutputConnector = function () {
                    for (var i in this.getAreas()) {
                        if (this.getAreas()[i].isSupportsOutgoing()) {
                            return this.getAreas()[i].prepareForConnect();
                        }
                    }

                    return null;
                };

                Node.prototype.getInputConnector = function () {
                    for (var i in this.getAreas()) {
                        if (this.getAreas()[i].isSupportsIncoming()) {
                            return this.getAreas()[i].prepareForConnect();
                        }
                    }
                };

                Node.prototype.onConnectionEnd = function (pGraph) {
                    this._isSuitable = false;
                    this.getElement().removeClass("open blocked");
                    this.routing();
                };

                Node.prototype.onConnectionBegin = function (pGraph, pRoute) {
                    if (pRoute.getLeft().getNode() === this) {
                        return;
                    }

                    if (!this.canAcceptConnect()) {
                        this.getElement().addClass("blocked");
                        return;
                    }

                    this._isSuitable = true;
                    this.getElement().addClass("open");
                };

                //finding areas in direct childrens
                Node.prototype.linkAreas = function () {
                    var pChildren = this.children();

                    for (var i = 0; i < pChildren.length; ++i) {
                        if (graph.isConnectionArea(pChildren[i])) {
                            this.addConnectionArea(pChildren[i].getName(), pChildren[i]);
                        }
                    }
                };

                Node.prototype.isSuitable = function () {
                    return this._isSuitable;
                };

                Node.prototype.findRoute = function (pNode) {
                    var pRoute = null;

                    for (var i in this.getAreas()) {
                        pRoute = this.getAreas()[i].findRoute(pNode);
                        if (!akra.isNull(pRoute)) {
                            return pRoute;
                        }
                    }

                    return null;
                };

                Node.prototype.isConnectedWith = function (pNode) {
                    return !akra.isNull(this.findRoute(pNode));
                };

                Node.prototype.canAcceptConnect = function () {
                    for (var i in this.getAreas()) {
                        if (this.getAreas()[i].isSupportsIncoming()) {
                            return true;
                        }
                    }

                    return false;
                };

                Node.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-graphnode");
                };

                Node.prototype.activate = function (bValue) {
                    if (typeof bValue === "undefined") { bValue = true; }
                    this._isActive = bValue;
                    this.highlight(bValue);

                    for (var sArea in this._pAreas) {
                        this._pAreas[sArea].activate(bValue);
                    }
                };

                Node.prototype.isActive = function () {
                    return this._isActive;
                };

                Node.prototype.init = function () {
                    var pSidesLR = ["left", "right"];
                    var pSidesTB = ["top", "bottom"];
                    var pSidePanels = [];

                    for (var i = 0; i < pSidesTB.length; ++i) {
                        var sSide = pSidesTB[i];

                        pSidePanels[i] = new graph.ConnectionArea(this, { show: false });
                        pSidePanels[i].setLayout(1 /* HORIZONTAL */);
                        pSidePanels[i].render(this.getElement().find(".graph-node-" + sSide + ":first"));

                        this._pAreas[sSide] = pSidePanels[i];
                    }

                    for (var i = 0; i < pSidesLR.length; ++i) {
                        var sSide = pSidesLR[i];

                        pSidePanels[i] = new graph.ConnectionArea(this, { show: false });
                        pSidePanels[i].render(this.getElement().find(".graph-node-" + sSide + ":first"));

                        this.addConnectionArea(sSide, pSidePanels[i]);
                    }
                };

                Node.prototype.addConnectionArea = function (sName, pArea) {
                    //this.connect(pArea, SIGNAL(connected), SLOT(connected));
                    pArea.connected.connect(this, this.connected);
                    this._pAreas[sName] = pArea;
                };

                Node.prototype.connected = function (pArea, pFrom, pTo) {
                };

                Node.prototype.sendEvent = function (e) {
                    for (var i in this._pAreas) {
                        this._pAreas[i].sendEvent(e);
                    }

                    if (e.type === 1 /* DELETE */) {
                        if (this.isActive()) {
                            this.beforeDestroy.emit();
                            this.destroy();
                        }
                    }
                };

                Node.prototype.highlight = function (bValue) {
                    if (typeof bValue === "undefined") { bValue = true; }
                    if (bValue) {
                        this.$element.addClass('highlight');
                    } else {
                        this.$element.removeClass('highlight');
                    }
                };

                Node.prototype.routing = function () {
                    for (var i in this._pAreas) {
                        this._pAreas[i].routing();
                    }
                };

                Node.MouseenterSignal = MouseenterSignal;
                Node.MouseleaveSignal = MouseleaveSignal;
                Node.ClickSignal = ClickSignal;
                Node.MoveSignal = MoveSignal;
                Node.DbclickSignal = DbclickSignal;
                return Node;
            })(ui.Component);
            graph.Node = Node;

            ui.register("graph.Node", Node);
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraph.ts" />
/// <reference path="../../idl/IUIGraphControls.ts" />
/// <reference path="../Panel.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (graph) {
            var Controls = (function (_super) {
                __extends(Controls, _super);
                function Controls(parent, options, pGraph) {
                    if (typeof pGraph === "undefined") { pGraph = null; }
                    _super.call(this, parent, options); /*EUIComponents.GRAPH_CONTROLS*/

                    this.controls = this.getUI().createComponent("Controls");
                    this.graph = pGraph || this.getUI().createComponent("Graph");

                    this.controls.attachToParent(this);
                    this.graph.attachToParent(this);

                    var pControlPanel = this.controls;
                    // var pNodeBtn: IUIButton = new Button(pControlPanel, {text: "Create graph node"});
                    // this.connect(pNodeBtn, SIGNAL(click), SLOT(createNode));
                }
                Controls.prototype.getGraph = function () {
                    return this.graph;
                };

                Controls.prototype.createNode = function () {
                    return new graph.Node(this.graph);
                };

                Controls.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-graphcontrols");
                };
                return Controls;
            })(ui.Panel);
            graph.Controls = Controls;

            ui.register("graph.Controls", Controls);
        })(ui.graph || (ui.graph = {}));
        var graph = ui.graph;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
// IUIAnimationData export interface
// [write description here...]
/// <reference path="IUIAnimationNode.ts" />
/// <reference path="../../idl/IUIAnimationNode.ts" />
/// <reference path="../graph/Node.ts" />
var akra;
(function (akra) {
    (function (ui) {
        (function (animation) {
            var Node = (function (_super) {
                __extends(Node, _super);
                function Node(parent, options, eType) {
                    if (typeof eType === "undefined") { eType = 0 /* UNKNOWN */; }
                    _super.call(this, parent, options, eType);
                }
                Node.prototype.attachToParent = function (pParent) {
                    if (_super.prototype.attachToParent.call(this, pParent)) {
                        pParent.nodeSelected.connect(this, this._selected);
                    }

                    return false;
                };

                Node.prototype._selected = function (pGraph, pNode, bPlay) {
                    if (this === pNode) {
                        this.getElement().addClass("selected");
                    } else {
                        this.getElement().removeClass("selected");
                    }
                };

                Node.prototype.getAnimation = function () {
                    return null;
                };

                Node.prototype.setAnimation = function (pAnimation) {
                };

                Node.prototype.getGraph = function () {
                    return this.getParent();
                };

                Node.prototype.connected = function (pArea, pFrom, pTo) {
                    if (pFrom.getDirection() === 1 /* IN */) {
                        this.setAnimation(pTo.getNode().getAnimation());
                    }
                };
                return Node;
            })(ui.graph.Node);
            animation.Node = Node;
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIAnimationData.ts" />
/// <reference path="../../idl/IUILabel.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="Node.ts" />
        (function (animation) {
            var Data = (function (_super) {
                __extends(Data, _super);
                function Data(pGraph, pAnim) {
                    if (typeof pAnim === "undefined") { pAnim = null; }
                    _super.call(this, pGraph, { init: false }, 1 /* ANIMATION_DATA */);
                    this._pAnimation = null;

                    this.template("animation.Data.tpl");

                    if (!akra.isNull(pAnim)) {
                        this.setAnimation(pAnim);
                    }

                    this.linkAreas();
                }
                Data.prototype.getAnimation = function () {
                    return this._pAnimation;
                };

                Data.prototype.setAnimation = function (pAnim) {
                    this._pAnimation = pAnim;
                    this.getChild().setText(pAnim.getName());
                };

                Data.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationdata");
                };
                return Data;
            })(animation.Node);
            animation.Data = Data;

            ui.register("animation.Data", Data);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
// IUIAnimationPlayer export interface
// [write description here...]
/// <reference path="IUIAnimationNode.ts" />
/// <reference path="../../IDL/IUIAnimationGraph.ts" />
/// <reference path="../../IDL/IUIAnimationPlayer.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="Node.ts" />
        (function (animation) {
            var Player = (function (_super) {
                __extends(Player, _super);
                function Player(pGraph, pContainer) {
                    if (typeof pContainer === "undefined") { pContainer = null; }
                    _super.call(this, pGraph, { init: false }, 2 /* ANIMATION_PLAYER */);
                    this._pAnimation = null;

                    this.template("animation.Player.tpl");
                    this.linkAreas();

                    this._pSpeedLabel = this.findEntity("speed");
                    this._pSlider = this.findEntity("state");
                    this._pPlayBtn = this.findEntity("play");
                    this._pLoopBtn = this.findEntity("loop");
                    this._pReverseBtn = this.findEntity("reverse");
                    this._pLeftInf = this.findEntity("left-inf");
                    this._pRightInf = this.findEntity("right-inf");
                    this._pNameLabel = this.findEntity("name");
                    this._pEnableBtn = this.findEntity("enabled");

                    this._pAnimation = pContainer = pContainer || akra.animation.createContainer();
                    this.getGraph().addAnimation(pContainer);

                    //this.connect(pContainer, SIGNAL(enterFrame), SLOT(_enterFrame));
                    //this.connect(pContainer, SIGNAL(durationUpdated), SLOT(_durationUpdated));
                    pContainer.enterFrame.connect(this, this._enterFrame);
                    pContainer.durationUpdated.connect(this, this._durationUpdated);

                    //this.connect(this._pEnableBtn, SIGNAL(changed), SLOT(_enabled));
                    //this.connect(this._pLoopBtn, SIGNAL(changed), SLOT(_useLoop));
                    //this.connect(this._pReverseBtn, SIGNAL(changed), SLOT(_reverse));
                    //this.connect(this._pPlayBtn, SIGNAL(changed), SLOT(_play));
                    //this.connect(this._pSpeedLabel, SIGNAL(changed), SLOT(_setSpeed));
                    //this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_setName));
                    //this.connect(this._pLeftInf, SIGNAL(changed), SLOT(_setLeftInf));
                    //this.connect(this._pRightInf, SIGNAL(changed), SLOT(_setRightInf));
                    this._pEnableBtn.changed.connect(this, this._enabled);
                    this._pLoopBtn.changed.connect(this, this._useLoop);
                    this._pReverseBtn.changed.connect(this, this._reverse);
                    this._pPlayBtn.changed.connect(this, this._play);
                    this._pSpeedLabel.changed.connect(this, this._setSpeed);
                    this._pNameLabel.changed.connect(this, this._setName);
                    this._pLeftInf.changed.connect(this, this._setLeftInf);
                    this._pRightInf.changed.connect(this, this._setRightInf);

                    this.$time = this.getElement().find(".time:first");

                    this.setup();
                }
                Player.prototype.getAnimation = function () {
                    return this._pAnimation;
                };

                Player.prototype.setAnimation = function (pAnim) {
                    //logger.assert(isNull(this.animation), "animation container already setuped in player");
                    if (this._pAnimation.getAnimation() === pAnim) {
                        return;
                    }

                    this._pAnimation.setAnimation(pAnim);
                    this.setup();
                };

                Player.prototype.connected = function (pArea, pFrom, pTo) {
                    _super.prototype.connected.call(this, pArea, pFrom, pTo);
                    this.notifyDisabled(!this._pEnableBtn.getValue());
                };

                Player.prototype.onConnectionBegin = function (pGraph, pRoute) {
                    if (!akra.isNull(this._pAnimation.getAnimation())) {
                        this.getElement().addClass("blocked");
                    } else {
                        _super.prototype.onConnectionBegin.call(this, pGraph, pRoute);
                    }
                };

                Player.prototype.setup = function () {
                    var pAnimation = this._pAnimation;

                    this._pSlider.setRange(pAnimation.getDuration());
                    this._pPlayBtn.setChecked(!pAnimation.isPaused());

                    this._pLoopBtn.setChecked(pAnimation.inLoop());
                    this._pReverseBtn.setChecked(pAnimation.isReversed());

                    this._pNameLabel.setText(pAnimation.getName());
                    this._pSpeedLabel.setText(pAnimation.getSpeed().toString());

                    this._pLeftInf.setChecked(pAnimation.inLeftInfinity());
                    this._pRightInf.setChecked(pAnimation.inRightInfinity());

                    this._pEnableBtn.setValue(pAnimation.isEnabled());
                };

                Player.prototype._enabled = function (pSwc, bValue) {
                    this.notifyDisabled(!bValue);
                };

                Player.prototype.notifyDisabled = function (bValue) {
                    !bValue ? this._pAnimation.enable() : this._pAnimation.disable();

                    if (!bValue) {
                        this.getElement().removeClass("disabled");
                    } else {
                        this.getElement().addClass("disabled");
                    }

                    for (var i in this._pAreas) {
                        var pConnectors = this._pAreas[i].getConnectors();

                        for (var j = 0; j < pConnectors.length; ++j) {
                            pConnectors[j].getRoute().setEnabled(!bValue);
                        }
                    }
                };

                Player.prototype._setLeftInf = function (pCheckbox, bValue) {
                    this._pAnimation.leftInfinity(bValue);
                };

                Player.prototype._setRightInf = function (pCheckbox, bValue) {
                    this._pAnimation.rightInfinity(bValue);
                };

                Player.prototype._reverse = function (pCheckbox, bValue) {
                    this._pAnimation.reverse(bValue);
                };

                Player.prototype._useLoop = function (pCheckbox, bValue) {
                    // LOG(this._pAnimation.isEnabled())
                    this._pAnimation.useLoop(bValue);
                };

                Player.prototype._pause = function (pCheckbox, bValue) {
                    this._pAnimation.pause(bValue);
                };

                Player.prototype._play = function (pCheckbox, bValue) {
                    this._pAnimation.pause(!bValue);

                    if (!bValue) {
                        //this.connect(this._pSlider, SIGNAL(updated), SLOT(_setTime));
                        this._pSlider.updated.connect(this, this._setTime);

                        //this.disconnect(this._pAnimation, SIGNAL(enterFrame), SLOT(_enterFrame));
                        this._pAnimation.enterFrame.disconnect(this, this._enterFrame);
                    } else {
                        //this.disconnect(this._pSlider, SIGNAL(updated), SLOT(_setTime));
                        this._pSlider.updated.disconnect(this, this._setTime);

                        //this.connect(this._pAnimation, SIGNAL(enterFrame), SLOT(_enterFrame));
                        this._pAnimation.enterFrame.connect(this, this._enterFrame);
                    }
                };

                Player.prototype._setTime = function (pSlider, fValue) {
                    this._pAnimation.pause(false);
                    this._pAnimation.play(0);
                    this._pAnimation.apply(fValue);
                    this._pAnimation.pause(true);
                };

                Player.prototype._setName = function (pLabel, sName) {
                    this._pAnimation.setName(sName);
                };

                Player.prototype._setSpeed = function (pLabel, x) {
                    this._pAnimation.setSpeed(parseFloat(x));
                };

                Player.prototype._durationUpdated = function (pContainer, fDuration) {
                    this._pSlider.setRange(fDuration);
                };

                Player.prototype._enterFrame = function (pContainer, fRealTime, fTime) {
                    if (this._pAnimation.isPaused()) {
                        //this._pAnimation.rewind(this._pSlider.value);
                    } else {
                        if (this._pAnimation.inLoop()) {
                            this._pSlider.setValue(akra.math.mod((fRealTime - this._pAnimation.getStartTime()), this._pAnimation.getDuration()));
                        } else if (fRealTime >= this._pAnimation.getStartTime()) {
                            this._pSlider.setValue(akra.math.min(fTime, this._pAnimation.getDuration()));
                        }

                        this.$time.text(fTime.toFixed(1) + "/" + this._pAnimation.getDuration().toFixed(1) + "s");
                    }
                };

                Player.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationplayer");
                };
                return Player;
            })(animation.Node);
            animation.Player = Player;

            ui.register("animation.Player", Player);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="IUIAnimationNode.ts" />
/// <reference path="IUIComponent.ts" />
/// <reference path="../../idl/IUISlider.ts" />
/// <reference path="../../idl/IUIButton.ts" />
/// <reference path="../../idl/IUIAnimationMask.ts" />
/// <reference path="../../idl/IUIGraphRoute.ts" />
/// <reference path="../../idl/IUIIDE.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="Node.ts" />
        (function (animation) {
            var Mask = (function (_super) {
                __extends(Mask, _super);
                function Mask(pGraph, pMask) {
                    if (typeof pMask === "undefined") { pMask = null; }
                    _super.call(this, pGraph, { init: false }, 4 /* ANIMATION_MASK */);
                    this._pAnimation = null;
                    this._pMask = null;
                    this._pSliders = [];
                    this._pEditBtn = null;
                    this._pEditPanel = null;

                    this.template("animation.Mask.tpl");
                    this.linkAreas();

                    this._pEditBtn = this.findEntity("edit");
                    this._pMask = pMask;
                }
                Mask.prototype.getAnimation = function () {
                    return this._pAnimation;
                };

                Mask.prototype.setAnimation = function (pAnim) {
                    this._pAnimation = pAnim;
                    this._pMask = this._pMask || pAnim.createAnimationMask();
                    this.selected.emit(true);
                };

                Mask.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationmask");
                };

                Mask.prototype.getMask = function () {
                    return this._pMask;
                };

                Mask.isMaskNode = function (pNode) {
                    return pNode.getGraphNodeType() === 4 /* ANIMATION_MASK */;
                };
                return Mask;
            })(animation.Node);
            animation.Mask = Mask;

            ui.register("animation.Mask", Mask);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIAnimationMask.ts" />
/// <reference path="../../idl/IUIAnimationBlender.ts" />
/// <reference path="../../idl/IUISlider.ts" />
/// <reference path="../../idl/IUILabel.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="Node.ts" />
        /// <reference path="Mask.ts" />
        (function (_animation) {
            var Blender = (function (_super) {
                __extends(Blender, _super);
                function Blender(pGraph, pBlender) {
                    if (typeof pBlender === "undefined") { pBlender = null; }
                    _super.call(this, pGraph, { init: false }, 3 /* ANIMATION_BLENDER */);
                    this._pBlend = null;
                    this._pSliders = [];
                    this._pMaskNodes = [];

                    this.template("animation.Blender.tpl");

                    this.linkAreas();

                    this._pNameLabel = this.findEntity("name");

                    //this.connect(this._pNameLabel, SIGNAL(changed), SLOT(_textChanged));
                    this._pNameLabel.changed.connect(this, this._textChanged);

                    this._pBlend = pBlender = pBlender || akra.animation.createBlend();

                    //this.connect(this._pBlend, SIGNAL(weightUpdated), SLOT(_weightUpdated));
                    //this.connect(this._pBlend, SIGNAL(durationUpdated), SLOT(_durationUpdated));
                    this._pBlend.weightUpdated.connect(this, this._weightUpdated);
                    this._pBlend.durationUpdated.connect(this, this._durationUpdated);

                    this.getGraph().addAnimation(pBlender);
                    this._pNameLabel.setText(pBlender.getName());

                    this.$time = this.getElement().find(".time:first");
                }
                Blender.prototype.getAnimation = function () {
                    return this._pBlend;
                };

                Blender.prototype.getTotalMasks = function () {
                    return this._pMaskNodes.length;
                };

                Blender.prototype.onConnectionBegin = function (pGraph, pRoute) {
                    if (pRoute.getLeft().getNode() === this) {
                        return;
                    }

                    if (!this.isConnectedWith(pRoute.getLeft().getNode())) {
                        _super.prototype.onConnectionBegin.call(this, pGraph, pRoute);
                        return;
                    }

                    this.getElement().addClass("blocked");
                };

                Blender.prototype._textChanged = function (pLabel, sValue) {
                    this._pBlend.setName(sValue);
                };

                Blender.prototype.destroy = function () {
                    this.getGraph().removeAnimation(this._pBlend);
                    _super.prototype.destroy.call(this);
                };

                Blender.prototype.getMaskNode = function (iAnimation) {
                    return this._pMaskNodes[iAnimation] || null;
                };

                Blender.prototype.setMaskNode = function (iAnimation, pNode) {
                    this._pMaskNodes[iAnimation] = pNode;
                };

                Blender.prototype.setup = function () {
                    var pBlend = this._pBlend;

                    for (var i = 0; i < pBlend.getTotalAnimations(); i++) {
                        for (var j = 0; j < this._pSliders.length; ++j) {
                            if (this._pSliders[j].animation === pBlend.getAnimation(i)) {
                                this._pSliders[j].slider.setValue(pBlend.getAnimationWeight(i));
                            }
                        }
                    }

                    this._pNameLabel.setText(pBlend.getName());
                };

                Blender.prototype._weightUpdated = function (pBlend, iAnim, fWeight) {
                    var pSlider = this._pSliders[iAnim].slider;
                    var pRoute = this.getAreas()["in"].getConnectors()[iAnim].getRoute();

                    pRoute.setEnabled(fWeight !== 0);
                    pSlider.setText(fWeight.toFixed(2));
                };

                Blender.prototype._durationUpdated = function (pBlend, fDuration) {
                    this.$time.text(pBlend.getDuration().toFixed(1) + "s");
                };

                Blender.prototype.connected = function (pArea, pFrom, pTo) {
                    if (pFrom.getDirection() === 1 /* IN */) {
                        var pTarget = pTo.getNode();

                        var pAnimation = pTarget.getAnimation();
                        var pBlend = this._pBlend;
                        var pSlider = null;

                        var pMask;
                        var iAnim = pBlend.getAnimationIndex(pAnimation.getName());

                        pSlider = this.createComponent("Slider", { show: false });
                        pSlider.render(this.getElement().find("td.graph-node-center > div.controls:first"));
                        pSlider.setRange(100.0);

                        if (iAnim == -1) {
                            iAnim = pBlend.addAnimation(pAnimation);
                            this._pSliders[iAnim] = { slider: pSlider, animation: pAnimation };
                        } else {
                            this._pSliders[iAnim] = { slider: pSlider, animation: pAnimation };

                            //animation already exists, and all parameters already setuped right
                            pSlider.setValue(pBlend.getAnimationWeight(iAnim));
                            this._weightUpdated(pBlend, iAnim, pBlend.getAnimationWeight(iAnim));
                        }

                        pSlider.updated.connect(function (pSlider, fWeight) {
                            pBlend.setAnimationWeight(iAnim, fWeight);
                        });

                        pSlider.updated.emit(pSlider.getValue());

                        if (pTarget.getGraphNodeType() === 4 /* ANIMATION_MASK */) {
                            pMask = pTarget.getMask();

                            pBlend.setAnimationMask(iAnim, pMask);
                            this.setMaskNode(iAnim, pTarget);
                        }
                    }
                };

                Blender.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationblender");
                };
                return Blender;
            })(_animation.Node);
            _animation.Blender = Blender;

            ui.register("animation.Blender", Blender);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../idl/IUIGraphNode.ts" />
/// <reference path="../../idl/IUIAnimationControls.ts" />
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
                    _super.call(this, parent, options, ui.getUI(parent).createComponent("animation.Graph"));

                    var pControlPanel = this.controls;

                    //var pDataBtn: IUIButton = new Button(pControlPanel, {text: "Create data"});
                    var pPlayerBtn = new ui.Button(pControlPanel, { text: "Create player" });
                    var pBlenderBtn = new ui.Button(pControlPanel, { text: "Create blender" });
                    var pMaskBtn = new ui.Button(pControlPanel, { text: "Create mask" });

                    var pExportBtn = new ui.Button(pControlPanel, { text: "{ save controller }" });
                    var pExportBinBtn = new ui.Button(pControlPanel, { text: "{ save controller (binary) }" });

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
                    return new animation.Data(this.graph);
                };

                Controls.prototype.createPlayer = function () {
                    return new animation.Player(this.graph);
                };

                Controls.prototype.createBlender = function () {
                    return new animation.Blender(this.graph);
                };

                Controls.prototype.createMask = function () {
                    return new animation.Mask(this.graph);
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
            })(ui.graph.Controls);
            animation.Controls = Controls;

            ui.register("animation.Controls", Controls);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
/// <reference path="../../../../built/Lib/filedrop.addon.d.ts" />
var akra;
(function (akra) {
    (function (ui) {
        /// <reference path="../../idl/IUIAnimationGraph.ts" />
        /// <reference path="../../idl/IUIAnimationNode.ts" />
        /// <reference path="../../idl/IUIAnimationBlender.ts" />
        /// <reference path="../../idl/IUIAnimationPlayer.ts" />
        /// <reference path="../graph/Graph.ts" />
        /// <reference path="Controls.ts" />
        /// <reference path="Blender.ts" />
        (function (_animation) {
            var filedrop = akra.addons.filedrop;

            var DropSignal = (function (_super) {
                __extends(DropSignal, _super);
                function DropSignal() {
                    _super.apply(this, arguments);
                }
                DropSignal.prototype.emit = function (e, pComponent, pInfo) {
                    _super.prototype.emit.call(this, e, pComponent, akra.info);

                    var pGraph = this.getSender();

                    if (ui.isComponent(pComponent, 18 /* COLLADA_ANIMATION */)) {
                        var pColladaAnimation = pComponent;
                        var pAnimation = pColladaAnimation.collada.extractAnimation(pColladaAnimation.index);

                        // this.addAnimation(pAnimation);
                        pGraph.createNodeByAnimation(pAnimation);
                    }
                };
                return DropSignal;
            })(akra.Signal);

            var Graph = (function (_super) {
                __extends(Graph, _super);
                function Graph(parent, options) {
                    _super.call(this, parent, options, 1 /* ANIMATION */);
                    this._pSelectedNode = null;
                    this._pAnimationController = null;

                    this.setupFileDropping();
                    this.setDroppable();
                }
                Graph.prototype.setupSignals = function () {
                    this.drop = this.drop || new DropSignal(this);
                    this.nodeSelected = this.nodeSelected || new akra.Signal(this);
                    _super.prototype.setupSignals.call(this);
                };

                Graph.prototype.setupFileDropping = function () {
                    var _this = this;
                    var pGraph = this;
                    var pRmgr = ui.ide.getResourceManager();

                    filedrop.addHandler(null, {
                        drop: function (file, content, format, e) {
                            pGraph.getElement().removeClass("file-drag-over");

                            var pName = akra.path.parse(file.name);
                            var sExt = pName.getExt().toUpperCase();

                            if (sExt == "DAE") {
                                console.log("before resource creation...");
                                var pModelResource = pRmgr.getColladaPool().createResource(pName.toString());
                                console.log("before model parsing...");
                                pModelResource.parse(content, { scene: false, name: pName.toString() });

                                var pAnimations = pModelResource.extractAnimations();

                                for (var j = 0; j < pAnimations.length; ++j) {
                                    pGraph.addAnimation(pAnimations[j]);
                                    pGraph.createNodeByAnimation(pAnimations[j]);
                                }
                            }

                            if (sExt == "JSON") {
                                var pImporter = new akra.exchange.Importer(ui.ide.getEngine());
                                pImporter.import(content);
                                _this.createNodeByController(pImporter.getController());
                            }
                        },
                        verify: function (file, e) {
                            if (e.target !== pGraph.$svg[0]) {
                                return false;
                            }

                            return true;
                        },
                        // dragenter: (e) => {
                        // 	pGraph.getElement().addClass("file-drag-over");
                        // },
                        dragover: function (e) {
                            pGraph.getElement().addClass("file-drag-over");
                        },
                        dragleave: function (e) {
                            pGraph.getElement().removeClass("file-drag-over");
                        },
                        format: 2 /* TEXT */
                    });
                };

                Graph.prototype.getController = function () {
                    return this._pAnimationController;
                };

                Graph.prototype.selectNode = function (pNode, bModified) {
                    if (typeof bModified === "undefined") { bModified = false; }
                    var bPlay = true;

                    if (this._pSelectedNode === pNode) {
                        if (bModified) {
                            ui.ide.cmd(3 /* INSPECT_ANIMATION_NODE */, pNode);
                        }

                        return;
                    }

                    ui.ide.cmd(3 /* INSPECT_ANIMATION_NODE */, pNode);

                    this._pSelectedNode = pNode;

                    if (bPlay) {
                        this._pAnimationController.play.emit(pNode.getAnimation());
                    }

                    this.nodeSelected.emit(pNode, bPlay);
                };

                //BROADCAST(nodeSelected, CALL(pNode, bPlay));
                Graph.prototype.addAnimation = function (pAnimation) {
                    this._pAnimationController.addAnimation(pAnimation);
                };

                Graph.prototype.removeAnimation = function (animation) {
                    this._pAnimationController.removeAnimation(animation);
                };

                Graph.prototype.findNodeByAnimation = function (animation) {
                    var sName = !akra.isString(animation) ? animation.getName() : animation;
                    var pNodes = this.getNodes();

                    for (var i = 0; i < pNodes.length; i++) {
                        var pAnim = pNodes[i].getAnimation();

                        if (!akra.isNull(pAnim) && pAnim.getName() === sName) {
                            return pNodes[i];
                        }
                    }

                    return null;
                };

                Graph.prototype.createNodeByController = function (pController) {
                    var pNode = null;

                    for (var i = 0; i < pController.getTotalAnimations(); ++i) {
                        var pAnimation = pController.getAnimation(i);
                        pNode = this.createNodeByAnimation(pAnimation);
                    }

                    return;
                };

                Graph.prototype.createNodeByAnimation = function (pAnimation) {
                    var pNode = this.findNodeByAnimation(pAnimation.getName());
                    var pSubAnim = null;
                    var pSubNode = null;
                    var pBlend = null;
                    var pBlender = null;
                    var pPlayer = null;
                    var pMaskNode = null;

                    var pMask = null;
                    var pGraph = this;

                    function connect(pGraph, pFrom, pTo) {
                        pGraph.createRouteFrom(pFrom.getOutputConnector());
                        pGraph.connectTo(pTo.getInputConnector());
                    }

                    if (!akra.isNull(pNode)) {
                        return pNode;
                    }

                    if (akra.animation.Animation.isAnimation(pAnimation)) {
                        pNode = new _animation.Data(this, pAnimation);
                        this.addAnimation(pAnimation);
                    } else if (akra.animation.Blend.isBlend(pAnimation)) {
                        pBlender = pNode = new _animation.Blender(this, pAnimation);
                        pBlend = pAnimation;

                        for (var i = 0; i < pBlend.getTotalAnimations(); i++) {
                            pSubAnim = pBlend.getAnimation(i);
                            pSubNode = this.createNodeByAnimation(pSubAnim);
                            pMask = pBlend.getAnimationMask(i);

                            if (akra.isDefAndNotNull(pMask)) {
                                pMaskNode = pBlender.getMaskNode(i);

                                if (!pMaskNode) {
                                    pMaskNode = new _animation.Mask(this, pMask);
                                    // pMaskNode.animation = pSubAnim;
                                }

                                connect(this, pSubNode, pMaskNode);
                                connect(this, pMaskNode, pBlender);

                                // if (pSubAnim.extra && pSubAnim.extra.mask) {
                                //     if (pSubAnim.extra.mask.position) {
                                //         pMaskNode.position(pSubAnim.extra.mask.position.x, pSubAnim.extra.mask.position.y);
                                //     }
                                // }
                                pMaskNode.routing();
                            } else {
                                connect(this, pSubNode, pBlender);
                            }

                            pSubNode.routing();
                        }
                        ;

                        pBlender.setup();
                    } else if (akra.animation.Container.isContainer(pAnimation)) {
                        pPlayer = pNode = new _animation.Player(this, pAnimation);

                        // pPlayer.animation = pAnimation;
                        pSubAnim = pAnimation.getAnimation();

                        // console.log(pSubAnim);
                        pSubNode = this.createNodeByAnimation(pSubAnim);

                        // console.log(this, pSubNode, pPlayer);
                        connect(this, pSubNode, pPlayer);
                    } else {
                        akra.logger.error("unsupported type of animation detected >> ", pAnimation);
                    }

                    if (pAnimation.extra) {
                        if (pAnimation.extra.graph) {
                            setTimeout(function () {
                                var o = pGraph.getElement().offset();
                                pNode.getElement().offset({ left: o.left + pAnimation.extra.graph.x, top: o.top + pAnimation.extra.graph.y });

                                if (pBlender) {
                                    var o = pBlender.getElement().offset();
                                    for (var i = 0; i < pBlender.getTotalMasks(); ++i) {
                                        var pMaskNode = pBlender.getMaskNode(i);

                                        if (!pMaskNode) {
                                            continue;
                                        }

                                        pMaskNode.getElement().offset({ left: o.left - 60 - pMaskNode.getElement().width() + i * 30, top: o.top - 30 + i * 30 });
                                        pMaskNode.routing();
                                    }
                                }

                                pNode.routing();
                            }, 15);
                        }
                    }

                    pNode.routing();

                    if (pAnimation === this.getController().getActive()) {
                        this.selectNode(pNode);
                    }

                    return pNode;
                };

                Graph.prototype.capture = function (pController) {
                    akra.logger.assert(akra.isNull(this._pAnimationController), ("controller exists!!!"));

                    this._pAnimationController = pController;

                    //this.connect(pController, SIGNAL(play), SLOT(onControllerPlay));
                    pController.play.connect(this, this.onControllerPlay);

                    //this.connect(pController, SIGNAL(animationAdded), SLOT(animationAdded));
                    pController.animationAdded.connect(this, this.animationAdded);

                    this.createNodeByController(pController);

                    return true;
                };

                Graph.prototype.animationAdded = function (pController, pAnimation) {
                };

                Graph.prototype.onControllerPlay = function (pController, pAnimation) {
                    // var pNode: IUIAnimationNode = this.findNodeByAnimation(pAnimation.name);
                    // this.selectNode(pNode);
                };

                Graph.prototype.addChild = function (pChild) {
                    pChild = _super.prototype.addChild.call(this, pChild);

                    if (ui.isComponent(pChild, 20 /* GRAPH_NODE */)) {
                        var pNode = pChild;

                        //this.connect(pNode, SIGNAL(selected), SLOT(selectNode));
                        pNode.selected.connect(this, this.selectNode);
                    }

                    return pChild;
                };

                Graph.prototype.finalizeRender = function () {
                    _super.prototype.finalizeRender.call(this);
                    this.getElement().addClass("component-animationgraph");
                };

                Graph.DropSignal = DropSignal;
                return Graph;
            })(ui.graph.Graph);
            _animation.Graph = Graph;

            ui.register("animation.Graph", Graph);
        })(ui.animation || (ui.animation = {}));
        var animation = ui.animation;
    })(akra.ui || (akra.ui = {}));
    var ui = akra.ui;
})(akra || (akra = {}));
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
                return 1 /* TYPE_2D */;
            };

            UI.prototype.setupSignals = function () {
            };

            UI.prototype.getManager = function () {
                return this._pManager;
            };

            UI.prototype.createHTMLNode = function (pElement) {
                return new ui.HTMLNode(this, pElement);
            };

            UI.prototype.createDNDNode = function (pElement) {
                return new ui.DNDNode(this, pElement);
            };

            UI.prototype.createComponent = function (sType, pOptions) {
                if (akra.isDefAndNotNull(ui.COMPONENTS[sType])) {
                    //console.log("Founded non-generic type: " + sType);
                    return new ui.COMPONENTS[sType](this, pOptions);
                }

                return new ui.Component(this, ui.mergeOptions(pOptions, { generic: sType }));
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
                        pLayout = new ui.Horizontal(this);
                        break;
                    case "vertical":
                    case 2 /* VERTICAL */:
                        pLayout = new ui.Vertical(this);
                        break;
                    default:
                        pLayout = new ui.Layout(this);
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
