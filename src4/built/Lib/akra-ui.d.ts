/// <reference path="akra.d.ts" />
/// <reference path="../../src/akra-ui/idl/3d-party/jquery.d.ts" />
/// <reference path="../../src/akra-ui/idl/3d-party/jqueryui.d.ts" />
/// <reference path="../../src/akra-ui/idl/3d-party/raphael.d.ts" />
/// <reference path="../../src/akra-ui/idl/3d-party/swig.d.ts" />
/// <reference path="navigation.addon.d.ts" />
/// <reference path="filedrop.addon.d.ts" />
/// <reference path="../../src/akra-ui/idl/3d-party/codemirror.d.ts" />
declare module akra {
    enum EUILayouts {
        UNKNOWN = 0,
        HORIZONTAL = 1,
        VERTICAL = 2,
    }
    interface IUILayoutAttributes {
        comment?: string;
    }
    interface IUILayout extends akra.IUIHTMLNode {
        getLayoutType(): EUILayouts;
        setAttributes(pAttrs: IUILayoutAttributes): void;
        attr(sAttr: string): any;
    }
}
declare module akra {
    enum EUINodeTypes {
        UNKNOWN = 0,
        HTML = 1,
        DND = 2,
        LAYOUT = 3,
        COMPONENT = 4,
    }
    interface IUINode extends akra.IEntity {
        relocated: akra.ISignal<(pNode: IUINode, pLocation: IUINode) => void>;
        getNodeType(): EUINodeTypes;
        getUI(): akra.IUI;
        render(): boolean;
        render(pParent: IUINode): boolean;
        render(pElement: HTMLElement): boolean;
        render(pElement: JQuery): boolean;
        render(sSelector: string): boolean;
        attachToParent(pParent: IUINode): boolean;
        recursiveRender(): void;
        renderTarget(): JQuery;
        hasRenderTarget(): boolean;
    }
}
declare module akra {
    interface IUIEvent extends JQueryEventObject {
    }
    interface IUIHTMLNode extends akra.IUINode {
        $element: JQuery;
        getElement(): JQuery;
        getHTMLElement(): HTMLElement;
        isFocused(): boolean;
        isRendered(): boolean;
        width(): number;
        height(): number;
        attachToParent(pParent: IUIHTMLNode, bRender?: boolean): boolean;
        handleEvent(sEvent: string): boolean;
        disableEvent(sEvent: string): void;
        show(): void;
        hide(): void;
        click: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        dblclick: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mousemove: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mouseup: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mousedown: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mouseover: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mouseout: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mouseenter: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        mouseleave: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        focusin: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        focusout: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        blur: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        change: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        keydown: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        keyup: akra.ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
        resize: akra.ISignal<(pNode: IUIHTMLNode) => void>;
        rendered: akra.ISignal<(pNode: IUIHTMLNode) => void>;
        beforeRender: akra.ISignal<(pNode: IUIHTMLNode) => void>;
    }
}
declare module akra {
    interface IUIComponentOptions {
        show?: boolean;
        name?: string;
        html?: string;
        css?: any;
        class?: string;
        width?: number;
        height?: number;
        draggable?: boolean;
        renderTo?: any;
        dragZone?: any;
        generic?: string;
        layout?: any;
        events?: any;
        parent?: IUIComponent;
        template?: string;
    }
    enum EUIComponents {
        UNKNOWN = 0,
        WINDOW = 1,
        BUTTON = 2,
        SWITCH = 3,
        PANEL = 4,
        POPUP = 5,
        TABS = 6,
        LABEL = 7,
        VECTOR = 8,
        MENU = 9,
        TREE = 10,
        TREE_NODE = 11,
        CANVAS = 12,
        SLIDER = 13,
        CHECKBOX = 14,
        CHECKBOX_LIST = 15,
        VIEWPORT_STATS = 16,
        CODE_EDITOR = 17,
        COLLADA_ANIMATION = 18,
        GRAPH = 19,
        GRAPH_NODE = 20,
        GRAPH_CONNECTOR = 21,
        GRAPH_CONTROLS = 22,
        GRAPH_CONNECTIONAREA = 23,
    }
    interface IUIComponent extends akra.IUIDNDNode {
        getComponentType(): EUIComponents;
        getGenericType(): string;
        isGeneric(): boolean;
        getLayout(): akra.IUILayout;
        setLayout(eType: akra.EUILayouts): boolean;
        setLayout(sType: string): boolean;
        createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent;
        _createdFrom($component: JQuery): void;
        template(sURL: string, pData?: any): void;
        fromStringTemplate(sTpl: string, pData?: any): void;
    }
}
declare module akra {
    interface IUIDraggableOptions {
        disabled?: boolean;
        addClasses?: boolean;
        appendTo?: any;
        axis?: string;
        cancel?: string;
        connectToSortable?: string;
        containment?: any;
        cursor?: string;
        cursorAt?: any;
        delay?: number;
        distance?: number;
        grid?: number[];
        handle?: any;
        helper?: any;
        iframeFix?: any;
        opacity?: number;
        refreshPositions?: boolean;
        revert?: any;
        revertDuration?: number;
        scope?: string;
        scroll?: boolean;
        scrollSensitivity?: number;
        scrollSpeed?: number;
        snap?: any;
        snapMode?: string;
        snapTolerance?: number;
        stack?: string;
        zIndex?: number;
    }
    interface IUIDNDNode extends akra.IUIHTMLNode {
        setDraggable(bValue?: boolean, pOptions?: IUIDraggableOptions): void;
        setDraggableOptions(pOptions: IUIDraggableOptions): void;
        isDraggable(): boolean;
        dragStart: akra.ISignal<(pNode: IUIDNDNode, e: akra.IUIEvent) => void>;
        dragStop: akra.ISignal<(pNode: IUIDNDNode, e: akra.IUIEvent) => void>;
        move: akra.ISignal<(pNode: IUIDNDNode, e: akra.IUIEvent) => void>;
        drop: akra.ISignal<(pNode: IUIDNDNode, e: akra.IUIEvent, comp: akra.IUIComponent, info: any) => void>;
    }
}
declare module akra {
    interface IUIButtonOptions extends akra.IUIComponentOptions {
        text?: string;
    }
    interface IUIButton extends akra.IUIComponent {
        getText(): string;
        setText(sValue: string): void;
    }
}
declare module akra {
    interface IUICheckboxOptions extends akra.IUIComponentOptions {
        text?: string;
    }
    interface IUICheckbox extends akra.IUIComponent {
        changed: akra.ISignal<(pChekbox: IUICheckbox, bValue: boolean) => void>;
        setChecked(bValue: boolean): void;
        getText(): string;
        setText(sValue: string): void;
        isChecked(): boolean;
        _setValue(bValue: boolean): void;
    }
}
declare module akra {
    interface IUICheckboxList extends akra.IUIComponent {
        getLength(): number;
        getItems(): akra.IUICheckbox[];
        isChecked(): akra.IUICheckbox;
        isRadio(): boolean;
        setRadio(bValue: boolean): void;
        hasMultiSelect(): boolean;
        changed: akra.ISignal<(pList: IUICheckboxList, pCheckbox: akra.IUICheckbox) => void>;
    }
}
declare module akra {
    interface IUILabelOptions extends akra.IUIComponentOptions {
        text?: string;
        editable?: boolean;
    }
    interface IUILabel extends akra.IUIComponent {
        changed: akra.ISignal<(pLabel: IUILabel, sValue: string) => void>;
        getText(): string;
        setText(sValue: string): void;
        getPostfix(): string;
        setPostfix(sValue: string): void;
        editable(bValue?: boolean): void;
        isEditable(): boolean;
    }
}
declare module akra {
    interface IUIPanelOptions extends akra.IUIComponentOptions {
        title?: string;
    }
    interface IUIPanel extends akra.IUIComponent {
        index: number;
        isCollapsed(): boolean;
        getTitle(): string;
        setTitle(sValue: string): void;
        collapse(bValue?: boolean): void;
        isCollapsible(): boolean;
        setCollapsible(bValue?: boolean): void;
        titleUpdated: akra.ISignal<(pPabel: IUIPanel, sTitle: string) => void>;
        selected: akra.ISignal<(pPabel: IUIPanel) => void>;
    }
}
declare module akra {
    interface IUIPopup extends akra.IUIComponent {
        getTitle(): string;
        setTitle(sValue: string): void;
        close(): void;
        closed: akra.ISignal<(pPopup: IUIPopup) => void>;
    }
}
declare module akra {
    interface IUITabs extends akra.IUIComponent {
        getActiveTab(): akra.IUIPanel;
        tab(iTab: number): akra.IUIPanel;
        select(i: number): void;
        select(pPanel: akra.IUIPanel): void;
        findTabByTitle(sName: string): number;
        findTab(sName: string): number;
        tabIndex(pPanel: akra.IUIPanel): number;
    }
}
declare module akra {
    interface IUIVector extends akra.IUIComponent {
        /** readonly */ 
        x: akra.IUILabel;
        /** readonly */ 
        y: akra.IUILabel;
        /** readonly */ 
        z: akra.IUILabel;
        /** readonly */ 
        w: akra.IUILabel;
        /** readonly */ 
        totalComponents: number;
        getValue(): any;
        toVec2(): akra.IVec2;
        toVec3(): akra.IVec3;
        toVec4(): akra.IVec4;
        setVec2(v: akra.IVec2): void;
        setVec3(v: akra.IVec3): void;
        setVec4(v: akra.IVec4): void;
        setColor(c: akra.IColorValue): void;
        isEditable(): boolean;
        editable(bValue?: boolean): void;
        changed: akra.ISignal<(pVector: IUIVector, v: any) => void>;
    }
}
declare module akra {
    interface IUI extends akra.IScene2d {
        createHTMLNode(pElement: HTMLElement): akra.IUIHTMLNode;
        createDNDNode(pElement: HTMLElement): akra.IUIDNDNode;
        createComponent(sName: string, pOptions?: akra.IUIComponentOptions): akra.IUIComponent;
        createLayout(eType: akra.EUILayouts, pAttrs?: akra.IUILayoutAttributes): akra.IUILayout;
        createLayout(sType: string, pAttrs?: akra.IUILayoutAttributes): akra.IUILayout;
    }
}
declare module akra.ui {
    var $document: JQuery;
    var $body: JQuery;
    class Node extends akra.util.Entity implements akra.IUINode {
        public relocated: akra.ISignal<(pNode: akra.IUINode, pLocation: akra.IUINode) => void>;
        public _pUI: akra.IUI;
        public _eNodeType: akra.EUINodeTypes;
        public getUI(): akra.IUI;
        public getNodeType(): akra.EUINodeTypes;
        constructor(pParent: akra.IUINode, eNodeType?: akra.EUINodeTypes);
        constructor(pUI: akra.IUI, eNodeType?: akra.EUINodeTypes);
        public setupSignals(): void;
        public render(): boolean;
        public render(pParent: akra.IUINode): boolean;
        public render(pElement: HTMLElement): boolean;
        public render(sSelector: string): boolean;
        public recursiveRender(): void;
        public renderTarget(): JQuery;
        public hasRenderTarget(): boolean;
        public addChild(pChild: akra.IEntity): akra.IEntity;
        public attachToParent(pParent: akra.IUINode): boolean;
        public findRenderTarget(): akra.IUINode;
    }
    function isUI(parent: akra.IUINode): boolean;
    function isUI(parent: akra.IUI): boolean;
    function getUI(parent: akra.IUINode): akra.IUI;
    function getUI(parent: akra.IUI): akra.IUI;
    function isUINode(pEntity: akra.IEntity): boolean;
    function isLayout(pEntity: akra.IEntity): boolean;
    function containsHTMLElement(pEntity: akra.IEntity): boolean;
}
declare module akra.ui {
    class HTMLNode extends ui.Node implements akra.IUIHTMLNode {
        public click: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public dblclick: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mousemove: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mouseup: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mousedown: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mouseover: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mouseout: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mouseenter: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public mouseleave: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public focusin: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public focusout: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public blur: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public change: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public keydown: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public keyup: akra.ISignal<(pNode: akra.IUIHTMLNode, e: akra.IUIEvent) => void>;
        public resize: akra.ISignal<(pNode: akra.IUIHTMLNode) => void>;
        public beforeRender: akra.ISignal<(pNode: akra.IUIHTMLNode) => void>;
        public rendered: akra.ISignal<(pNode: akra.IUIHTMLNode) => void>;
        public $element: JQuery;
        public _fnEventRedirector: Function;
        public getElement(): JQuery;
        constructor(parent: any, pElement?: HTMLElement, eNodeType?: akra.EUINodeTypes);
        constructor(parent: any, $element?: JQuery, eNodeType?: akra.EUINodeTypes);
        public setupSignals(): void;
        public handleEvent(sEvent: string): boolean;
        public disableEvent(sEvent: string): void;
        public hasRenderTarget(): boolean;
        public renderTarget(): JQuery;
        public getHTMLElement(): HTMLElement;
        public render(): boolean;
        public render(pParent: akra.IUINode): boolean;
        public render(pElement: HTMLElement): boolean;
        public render(pElement: JQuery): boolean;
        public render(sSelector: string): boolean;
        public attachToParent(pParent: akra.IUINode, bRender?: boolean): boolean;
        public isFocused(): boolean;
        public isRendered(): boolean;
        public destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void;
        public width(): number;
        public height(): number;
        public valueOf(): JQuery;
        public hide(): void;
        public show(): void;
        public self(): JQuery;
        public finalizeRender(pNode?: akra.IUIHTMLNode): void;
        private static EVENTS;
        static RenderedSignal: typeof RenderedSignal;
    }
}
declare module akra.ui {
    class DNDNode extends ui.HTMLNode implements akra.IUIDNDNode {
        public dragStart: akra.ISignal<(pNode: akra.IUIDNDNode, e: akra.IUIEvent) => void>;
        public dragStop: akra.ISignal<(pNode: akra.IUIDNDNode, e: akra.IUIEvent) => void>;
        public move: akra.ISignal<(pNode: akra.IUIDNDNode, e: akra.IUIEvent) => void>;
        public drop: akra.ISignal<(pNode: akra.IUIDNDNode, e: akra.IUIEvent, pComponent: akra.IUIComponent, info: any) => void>;
        public _bDraggableInited: boolean;
        public _bDroppableInited: boolean;
        constructor(parent: any, element?: any, eNodeType?: akra.EUINodeTypes);
        public setupSignals(): void;
        public isDraggable(): boolean;
        public setDraggable(bValue?: boolean, pOptions?: akra.IUIDraggableOptions): void;
        public setDraggableOptions(pOptions: akra.IUIDraggableOptions): void;
        public setDroppable(bValue?: boolean): void;
        public attachToParent(pParent: akra.IUINode, bRender?: boolean): boolean;
    }
}
declare module akra.ui {
    function template(pNode: akra.IUIComponent, sUrl: string, pData?: any): void;
    var COMPONENTS: {
        [type: string]: typeof Component;
    };
    class Component extends ui.DNDNode implements akra.IUIComponent {
        public _eComponentType: akra.EUIComponents;
        public _sGenericType: string;
        public _pComponentOptions: akra.IUIComponentOptions;
        public getComponentType(): akra.EUIComponents;
        public getGenericType(): string;
        public getName(): string;
        public setName(sName: string): void;
        public getOptions(): akra.IUIComponentOptions;
        public getLayout(): akra.IUILayout;
        constructor(parent: any, sName?: string, eType?: akra.EUIComponents, $el?: JQuery);
        constructor(parent: any, pOptions?: akra.IUIComponentOptions, eType?: akra.EUIComponents, $el?: JQuery);
        public template(sTplName: string, pData?: any): void;
        public fromStringTemplate(sTemplate: string, pData?: any): void;
        public finalizeRender(pNode?: akra.IUIHTMLNode): void;
        public isGeneric(): boolean;
        public setLayout(eType: akra.EUILayouts): boolean;
        public setLayout(sType: string): boolean;
        public attachToParent(pParent: akra.IUINode, bRender?: boolean): boolean;
        public applyOptions(pOptions: akra.IUIComponentOptions): void;
        public createComponent(sType: string, pOptions?: akra.IUIComponentOptions): akra.IUIComponent;
        public _createdFrom($comp: JQuery): void;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
    function register(sType: string, pComponent: typeof Component): void;
    function isComponent(pEntity: akra.IEntity, eComponent?: akra.EUIComponents): boolean;
    function isGeneric(pEntity: akra.IEntity): boolean;
    function mergeOptions(sNameLeft: string, pOptionsRight: akra.IUIComponentOptions): akra.IUIComponentOptions;
    function mergeOptions(sNameLeft: string, sNameRight: string): akra.IUIComponentOptions;
    function mergeOptions(pOptionsLeft: akra.IUIComponentOptions, pOptionsRight: akra.IUIComponentOptions): akra.IUIComponentOptions;
}
declare module akra.ui {
    class Panel extends ui.Component implements akra.IUIPanel {
        public titleUpdated: akra.ISignal<(pPabel: akra.IUIPanel, sTitle: string) => void>;
        public selected: akra.ISignal<(pPabel: akra.IUIPanel) => void>;
        public index: number;
        public $title: JQuery;
        public $controls: JQuery;
        public isCollapsed(): boolean;
        public getTitle(): string;
        public setTitle(sTitle: string): void;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public _createdFrom($comp: JQuery): void;
        public collapse(bValue?: boolean): void;
        public finalizeRender(): void;
        public isCollapsible(): boolean;
        public setCollapsible(bValue?: boolean): void;
    }
    function isPanel(pEntity: akra.IEntity): boolean;
}
declare module akra.ui {
    class Popup extends ui.Component implements akra.IUIPopup {
        public closed: akra.ISignal<(pPopup: akra.IUIPopup) => void>;
        public $title: JQuery;
        public $header: JQuery;
        public $footer: JQuery;
        public $controls: JQuery;
        public $closeBtn: JQuery;
        public getTitle(): string;
        public setTitle(sTitle: string): void;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public close(): void;
        public _createdFrom($comp: JQuery): void;
        static MoveSignal: typeof MoveSignal;
    }
}
declare module akra.ui {
    class Tabs extends ui.Component implements akra.IUITabs {
        public _pTabs: akra.IUIPanel[];
        public _iActiveTab: number;
        public $bookmarks: JQuery;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public getActiveTab(): akra.IUIPanel;
        public getLength(): number;
        public addChild(pEntity: akra.IEntity): akra.IEntity;
        public tabIndex(pPanel: akra.IUIPanel): number;
        public findTabByTitle(sName: string): number;
        public findTab(sName: string): number;
        public tab(iTab: number): akra.IUIPanel;
        public select(panel: any): void;
        public _tabTitleUpdated(pPanel: akra.IUIPanel, sTitle: string): void;
        public bookmarkFor(pPanel: akra.IUIPanel): JQuery;
        public createBookmarkFor(pPanel: akra.IUIPanel): void;
    }
}
declare module akra.ui {
    class Button extends ui.Component implements akra.IUIButton {
        public getText(): string;
        public setText(x: string): void;
        constructor(ui: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public _createdFrom($comp: JQuery): void;
        public applyOptions(pOptions: akra.IUIButtonOptions): void;
        static ClickSignal: typeof ClickSignal;
    }
}
declare module akra.ui {
    class Menu extends ui.Component {
        public $title: JQuery;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public getText(): string;
        public setText(s: string): void;
        public _createdFrom($comp: JQuery): void;
        static MouseleaveSignal: typeof MouseleaveSignal;
        static MouseenterSignal: typeof MouseenterSignal;
    }
}
declare module akra {
    interface IUISwitch extends akra.IUIComponent {
        changed: akra.ISignal<(pSwitch: IUISwitch, bValue: boolean) => void>;
        getValue(): boolean;
        setValue(bValue: boolean): void;
        isOn(): boolean;
        _setValue(bValue: boolean): void;
    }
}
declare module akra.ui {
    class Switch extends ui.Component implements akra.IUISwitch {
        public changed: akra.ISignal<(pSwitch: akra.IUISwitch, bValue: boolean) => void>;
        private $checkbox;
        public getValue(): boolean;
        public setValue(bValue: boolean): void;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public _setValue(bValue: boolean): void;
        public _createdFrom($comp: JQuery): void;
        public isOn(): boolean;
    }
}
declare module akra.ui {
    class Label extends ui.Component implements akra.IUILabel {
        public changed: akra.ISignal<(pLabel: akra.IUILabel, sValue: string) => void>;
        public $text: JQuery;
        public $input: JQuery;
        public _bEditable: boolean;
        public _sPostfix: string;
        public getText(): string;
        public setText(x: string): void;
        public setPostfix(s: string): void;
        public getPostfix(): string;
        constructor(ui: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public _createdFrom($comp: JQuery): void;
        public isEditable(): boolean;
        public editable(bValue?: boolean): void;
        public finalizeRender(): void;
        static ClickSignal: typeof ClickSignal;
        static FocusoutSignal: typeof FocusoutSignal;
        static KeydownSignal: typeof KeydownSignal;
    }
}
declare module akra.ui {
    class Vector extends ui.Component implements akra.IUIVector {
        public changed: akra.ISignal<(pVector: akra.IUIVector, v: any) => void>;
        public x: akra.IUILabel;
        public y: akra.IUILabel;
        public z: akra.IUILabel;
        public w: akra.IUILabel;
        public totalComponents: number;
        public _iFixed: number;
        public _bEditable: boolean;
        public $lock: JQuery;
        constructor(ui: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public getValue(): any;
        public _createdFrom($comp: JQuery): void;
        public editable(bValue?: boolean): void;
        public isEditable(): boolean;
        public useComponents(n: number): void;
        public setVec2(v: akra.IVec2): void;
        public setVec3(v: akra.IVec3): void;
        public setVec4(v: akra.IVec4): void;
        public setColor(c: akra.IColorValue): void;
        public toVec2(): akra.IVec2;
        public toVec3(): akra.IVec3;
        public toVec4(): akra.IVec4;
        public finalizeRender(): void;
    }
}
declare module akra.ui {
    class Layout extends ui.HTMLNode implements akra.IUILayout {
        public _eLayoutType: akra.EUILayouts;
        public _pAttrs: akra.IUILayoutAttributes;
        public getLayoutType(): akra.EUILayouts;
        constructor(parent: any, pElement?: HTMLElement, eType?: akra.EUILayouts);
        constructor(parent: any, pElement?: JQuery, eType?: akra.EUILayouts);
        public attachToParent(pParent: akra.IUINode): boolean;
        public attr(sAttr: string): any;
        public setAttributes(pAttrs: akra.IUILayoutAttributes): void;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
}
declare module akra.ui {
    class Horizontal extends ui.Layout {
        public $row: JQuery;
        public $table: JQuery;
        constructor(parent: any);
        public renderTarget(): JQuery;
        public removeChild(pChild: akra.IEntity): akra.IEntity;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
}
declare module akra.ui {
    class Vertical extends ui.Layout {
        public $table: JQuery;
        constructor(parent: any);
        public renderTarget(): JQuery;
        public removeChild(pChild: akra.IEntity): akra.IEntity;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
}
declare module akra.ui {
    class Slider extends ui.Component implements akra.IUISlider {
        public updated: akra.ISignal<(pSlider: akra.IUISlider, fValue: number) => void>;
        public _fRange: number;
        public _fValue: number;
        public $progress: JQuery;
        public $text: JQuery;
        public getPin(): akra.IUIComponent;
        public getValue(): number;
        public getRange(): number;
        public setRange(fValue: number): void;
        public getText(): string;
        public setText(s: string): void;
        public setValue(fValue: number): void;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public finalizeRender(): void;
        public _updated(pPin: akra.IUIComponent, e: akra.IUIEvent): void;
        public _createdFrom($comp: JQuery): void;
        public toString(isRecursive?: boolean, iDepth?: number): string;
    }
}
declare module akra.ui {
    class Checkbox extends ui.Component implements akra.IUICheckbox {
        public changed: akra.ISignal<(pChekbox: akra.IUICheckbox, bValue: boolean) => void>;
        public _bChecked: boolean;
        public $text: JQuery;
        public setChecked(bValue: boolean): void;
        public getText(): string;
        public setText(sValue: string): void;
        public _setValue(bValue: boolean): void;
        constructor(parent: any, options?: akra.IUICheckboxOptions, eType?: akra.EUIComponents);
        constructor(parent: any, name?: string, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public _createdFrom($comp: JQuery): void;
        public finalizeRender(): void;
        public isChecked(): boolean;
        public toString(isRecursive?: boolean, iDepth?: number): string;
        static ClickSignal: typeof ClickSignal;
    }
    function isCheckbox(pEntity: akra.IEntity): boolean;
}
declare module akra.ui {
    class CheckboxList extends ui.Component implements akra.IUICheckboxList {
        public changed: akra.ISignal<(pList: akra.IUICheckboxList, pCheckbox: akra.IUICheckbox) => void>;
        private _nSize;
        private _pItems;
        private _bMultiSelect;
        private _bLikeRadio;
        public getLength(): number;
        public isRadio(): boolean;
        public setRadio(b: boolean): void;
        public getItems(): akra.IUICheckbox[];
        public isChecked(): akra.IUICheckbox;
        constructor(parent: any, options?: any, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public _createdFrom($comp: JQuery): void;
        public finalizeRender(): void;
        public hasMultiSelect(): boolean;
        public update(): boolean;
        public addCheckbox(pCheckbox: akra.IUICheckbox): void;
        public _childAdded(pLayout: akra.IUILayout, pNode: akra.IUINode): void;
        public _childRemoved(pLayout: akra.IUILayout, pNode: akra.IUINode): void;
        public _changed(pCheckbox: akra.IUICheckbox, bCheked: boolean): void;
    }
}
declare module akra {
    interface IUIWindowOptions extends akra.IUIComponentOptions {
        title?: string;
    }
    interface IUIWindow extends akra.IUIComponent {
    }
}
declare module akra.ui {
    class Window extends ui.Component implements akra.IUIWindow {
        public _pWindow: any;
        public $document: any;
        constructor(pUI: akra.IUI, options?: akra.IUIWindowOptions);
    }
}
declare module akra {
    interface IUIRenderTargetStats extends akra.IUIComponent {
        getTarget(): akra.IRenderTarget;
        setTarget(pTarget: akra.IRenderTarget): void;
    }
}
declare module akra.ui {
    class RenderTargetStats extends ui.Component implements akra.IUIRenderTargetStats {
        public _pInfoElement: HTMLDivElement;
        public _pValues: number[];
        public _pRenderTarget: akra.IRenderTarget;
        public _pTicks: HTMLSpanElement[];
        public _pUpdateInterval: number;
        public getInfo(): HTMLDivElement;
        public getTarget(): akra.IRenderTarget;
        public setTarget(pRenderTarget: akra.IRenderTarget): void;
        constructor(ui: any, options?: any, pRenderTarget?: akra.IRenderTarget);
        private updateStats();
        public finalizeRender(): void;
    }
}
declare module akra {
    interface IUITreeNode {
        /** readonly */ 
        el: JQuery;
        /** readonly */ 
        parent: IUITreeNode;
        /** readonly */ 
        tree: akra.IUITree;
        /** readonly */ 
        source: akra.IEntity;
        /** readonly */ 
        expanded: boolean;
        getTotalChildren(): number;
        isSelected(): boolean;
        setSelected(bValue: boolean): void;
        expand(bValue?: boolean): void;
        destroy(): void;
        sync(bRecursive?: boolean): void;
        select(bValue?: boolean): boolean;
        waitForSync(): void;
        synced(): void;
    }
}
declare module akra {
    interface IUITree extends akra.IUIComponent {
        getRootNode(): akra.IUITreeNode;
        getSelectedNode(): akra.IEntity;
        fromTree(pEntity: akra.IEntity): void;
        sync(pEntity?: akra.IEntity): void;
        select(pNode: akra.IUITreeNode): boolean;
        selectByGuid(iGuid: number): void;
        isSelected(pNode: akra.IUITreeNode): boolean;
        _link(pNode: akra.IUITreeNode): void;
        _unlink(pNode: akra.IUITreeNode): void;
        _createNode(pEntity: akra.IEntity): akra.IUITreeNode;
    }
}
declare module akra.ui {
    interface IUITreeNodeMap {
        [guid: number]: akra.IUITreeNode;
    }
    class TreeNode implements akra.IUITreeNode {
        public el: JQuery;
        public parent: akra.IUITreeNode;
        public tree: akra.IUITree;
        public source: akra.IEntity;
        public expanded: boolean;
        public _pNodeMap: IUITreeNodeMap;
        public $childrenNode: JQuery;
        public getTotalChildren(): number;
        public getElement(): JQuery;
        /** Is this tree node currently selected? */
        public isSelected(): boolean;
        public setSelected(bValue: boolean): void;
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
        public expand(bValue?: boolean): void;
        public select(isSelect?: boolean): boolean;
        public getID(): string;
        public sync(bRecursive?: boolean): void;
        public synced(): void;
        public waitForSync(): void;
        public removeChildren(): void;
        public inChildren(pNode: akra.IEntity): boolean;
        public sourceName(): string;
        public addChild(pNode: akra.IUITreeNode): void;
        public destroy(): void;
    }
    class Tree extends ui.Component implements akra.IUITree {
        public _pNodeMap: IUITreeNodeMap;
        public _pRootNode: akra.IUITreeNode;
        public _pSelectedNode: akra.IUITreeNode;
        public fromTree(pEntity: akra.IEntity): void;
        public getRootNode(): akra.IUITreeNode;
        public getSelectedNode(): akra.IEntity;
        constructor(ui: any, options?: any, eType?: akra.EUIComponents);
        private _select(pNode);
        public select(pNode: akra.IUITreeNode): boolean;
        public selectByGuid(iGuid: number): void;
        public isSelected(pNode: akra.IUITreeNode): boolean;
        public finalizeRender(): void;
        public _createNode(pEntity: akra.IEntity): akra.IUITreeNode;
        public _link(pNode: akra.IUITreeNode): void;
        public _unlink(pNode: akra.IUITreeNode): void;
        public sync(pEntity?: akra.IEntity): void;
    }
}
declare module akra.ui.scene {
    class CameraNode extends ui.TreeNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class SceneObjectNode extends ui.TreeNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class SceneModelNode extends SceneObjectNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class ShadowCasterNode extends ui.TreeNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class JointNode extends ui.TreeNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class LightPointNode extends ui.TreeNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class ModelEntryNode extends ui.TreeNode {
        constructor(pTree: akra.IUITree, pSource: akra.IEntity);
    }
    class SceneTree extends ui.Tree {
        public _pScene: akra.IScene3d;
        public _iUpdateTimer: number;
        public _pIDE: akra.IUIIDE;
        constructor(parent: any, options?: any);
        public fromScene(pScene: akra.IScene3d): void;
        public select(pNode: akra.IUITreeNode): boolean;
        private updateTree(pScene, pSceneNode);
        public _createNode(pEntity: akra.IEntity): akra.IUITreeNode;
    }
    var Tree: typeof SceneTree;
}
declare module akra.ui.animation {
    class ColladaAnimation extends ui.Component {
        public _pCollada: akra.ICollada;
        public _iAnimation: number;
        public _pNameLb: akra.IUILabel;
        public getAnimation(): akra.IColladaAnimation;
        public getCollada(): akra.ICollada;
        public getIndex(): number;
        constructor(parent: any, options?: any);
        public setAnimation(pCollada: akra.ICollada, iAnimation: number): void;
        public _nameChanged(pLb: akra.IUILabel, sName: string): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.resource {
    class Properties extends ui.Component {
        public _pResource: akra.IResourcePoolItem;
        public _pName: akra.IUILabel;
        public _pColldaProperties: akra.IUIComponent;
        public _pColladaAnimations: ui.animation.ColladaAnimation[];
        public $colladaAnimations: JQuery;
        constructor(parent: any, options?: any);
        public setResource(pItem: akra.IResourcePoolItem): void;
        public updateProperties(): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.animation {
    class ControllerProperties extends ui.Component {
        public _pController: akra.IAnimationController;
        public _pTotalAnimLabel: akra.IUILabel;
        public _pActiveAnimation: akra.IUILabel;
        public _pEditBtn: akra.IUIButton;
        constructor(parent: any, options?: any);
        public _editController(pButton: akra.IUIButton): void;
        public setController(pController: akra.IAnimationController): void;
        private updateProperties();
        public finalizeRender(): void;
    }
}
declare module akra.ui {
    class Material extends ui.Component {
        public _pMat: akra.IMaterial;
        public _pName: akra.IUILabel;
        public _pDiffuse: akra.IUIVector;
        public _pAmbient: akra.IUIVector;
        public _pSpecular: akra.IUIVector;
        public _pEmissive: akra.IUIVector;
        public _pShininess: akra.IUILabel;
        constructor(parent: any, options?: any);
        public set(pMaterial: akra.IMaterial): void;
        public _diffuseUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _ambientUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _specularUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _emissiveUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _shininessUpdated(pVec: akra.IUILabel, sValue: string): void;
        private updateProperties();
        public finalizeRender(): void;
    }
}
declare module akra.ui.model {
    class MeshSubsetProperties extends ui.Panel {
        public _pSubset: akra.IMeshSubset;
        public _pName: akra.IUILabel;
        public _pMaterial: ui.Material;
        public _pVisible: akra.IUISwitch;
        public _pShadows: akra.IUISwitch;
        public _pBoundingBox: akra.IUISwitch;
        public _pBoundingSphere: akra.IUISwitch;
        public _pGuid: akra.IUILabel;
        constructor(parent: any, options?: any);
        public _setVisible(pSwc: akra.IUISwitch, bValue: boolean): void;
        public _useShadows(pSwc: akra.IUISwitch, bValue: boolean): void;
        public _useBoundingBox(pSwc: akra.IUISwitch, bValue: boolean): void;
        public _useBoundingSphere(pSwc: akra.IUISwitch, bValue: boolean): void;
        public setSubset(pSubset: akra.IMeshSubset): void;
        private updateProperties();
        public finalizeRender(): void;
    }
}
declare module akra.ui.model {
    class MeshProperties extends ui.Component {
        public _pMesh: akra.IMesh;
        public _pName: akra.IUILabel;
        public _pShadows: akra.IUISwitch;
        public _pBoundingBox: akra.IUISwitch;
        public _pBoundingSphere: akra.IUISwitch;
        public _pSubsets: model.MeshSubsetProperties[];
        constructor(parent: any, options?: any);
        public _useShadows(pSwc: akra.IUISwitch, bValue: boolean): void;
        public _useBoundingBox(pSwc: akra.IUISwitch, bValue: boolean): void;
        public _useBoundingSphere(pSwc: akra.IUISwitch, bValue: boolean): void;
        public setMesh(pMesh: akra.IMesh): void;
        public updateProperties(): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.light {
    class Properties extends ui.Component {
        public _pLight: akra.ILightPoint;
        public _pEnabled: akra.IUISwitch;
        public _pShadows: akra.IUISwitch;
        public _pAmbient: akra.IUIVector;
        public _pDiffuse: akra.IUIVector;
        public _pSpecular: akra.IUIVector;
        public _pAttenuation: akra.IUIVector;
        constructor(parent: any, options?: any);
        public _ambientUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _diffuseUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _specularUpdated(pVec: akra.IUIVector, pValue: akra.IVec4): void;
        public _attenuationUpdated(pVec: akra.IUIVector, pValue: akra.IVec3): void;
        public _useShadows(pSwc: akra.IUISwitch, bValue: boolean): void;
        public _enableLight(pSwc: akra.IUISwitch, bValue: boolean): void;
        public setLight(pLight: akra.ILightPoint): void;
        public updateProperties(): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.scene {
    class Model extends ui.Component {
        public _pModel: akra.ISceneModel;
        public _pVisible: akra.IUISwitch;
        constructor(parent: any, options?: any);
        public _changeVisibility(pSwc: akra.IUISwitch, bValue: boolean): void;
        public setModel(pModel: akra.ISceneModel): void;
        public updateProperties(): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.animation {
    class NodeProperties extends ui.Component {
        public _pNameLb: akra.IUILabel;
        constructor(parent: any, options?: any);
        public setNode(pNode: akra.IUIAnimationNode): void;
        public finalizeRender(): void;
    }
}
declare module akra {
    var UIGRAPH_FLOATING_INPUT: number;
    enum EGraphConnectorOrient {
        UNKNOWN = 0,
        UP = 1,
        DOWN = 2,
        LEFT = 3,
        RIGHT = 4,
    }
    interface IUIGraphConnector extends akra.IUIComponent {
        getRoute(): akra.IUIGraphRoute;
        setRoute(pValue: akra.IUIGraphRoute): void;
        getOrient(): EGraphConnectorOrient;
        setOrient(eValue: EGraphConnectorOrient): void;
        getArea(): akra.IUIGraphConnectionArea;
        getNode(): akra.IUIGraphNode;
        getGraph(): akra.IUIGraph;
        getDirection(): akra.EUIGraphDirections;
        isActive(): boolean;
        isConnected(): boolean;
        activate(bValue?: boolean): void;
        hasRoute(): boolean;
        /** Mark as input connecotr */
        input(): boolean;
        /** Mark as output connector */
        output(): boolean;
        highlight(bToogle?: boolean): void;
        routing(): void;
        sendEvent(e: akra.IUIGraphEvent): void;
        activated: akra.ISignal<(pConnector: IUIGraphConnector, bValue: boolean) => void>;
        connected: akra.ISignal<(pConnector: IUIGraphConnector, pTarget: IUIGraphConnector) => void>;
        routeBreaked: akra.ISignal<(pConnector: IUIGraphConnector, pRoute: akra.IUIGraphRoute) => void>;
    }
}
declare module akra {
    interface IUIGraphRoute {
        getPath(): RaphaelPath;
        setPath(pPath: RaphaelPath): void;
        getLeft(): akra.IUIGraphConnector;
        setLeft(pConnector: akra.IUIGraphConnector): void;
        getRight(): akra.IUIGraphConnector;
        setRight(pConnector: akra.IUIGraphConnector): void;
        getColor(): akra.IColor;
        isEnabled(): boolean;
        setEnabled(bValue: boolean): void;
        isConnectedWithNode(pNode: akra.IUIGraphNode): boolean;
        isConnectedWith(pConnector: akra.IUIGraphConnector): boolean;
        isBridge(): boolean;
        sendEvent(e: akra.IUIGraphEvent): void;
        detach(): void;
        isActive(): boolean;
        activate(bValue?: boolean): void;
        remove(bRecirsive?: boolean): void;
        destroy(): void;
        routing(): void;
    }
    interface IUITempGraphRoute extends IUIGraphRoute {
        routing(pRight?: akra.IPoint): void;
    }
}
declare module akra {
    enum EUIGraphDirections {
        IN = 1,
        OUT = 2,
    }
    enum EUIGraphTypes {
        UNKNOWN = 0,
        ANIMATION = 1,
    }
    enum EUIGraphEvents {
        UNKNOWN = 0,
        DELETE = 1,
        SHOW_MAP = 2,
        HIDE_MAP = 3,
    }
    interface IUIGraphEvent {
        type: EUIGraphEvents;
        traversedRoutes: akra.IUIGraphRoute[];
    }
    interface IUIGraph extends akra.IUIComponent {
        getGraphType(): EUIGraphTypes;
        getNodes(): akra.IUIGraphNode[];
        getCanvas(): RaphaelPaper;
        createRouteFrom(pConnector: akra.IUIGraphConnector): void;
        removeTempRoute(): void;
        connectTo(pConnector: akra.IUIGraphConnector): void;
        isReadyForConnect(): boolean;
        connectionBegin: akra.ISignal<(pGraph: IUIGraph, pRoute: akra.IUIGraphRoute) => void>;
        connectionEnd: akra.ISignal<(pGraph: IUIGraph) => void>;
    }
}
declare module akra {
    interface IUIConnectionAreaOptions extends akra.IUIComponentOptions {
        maxConnections?: number;
        maxInConnections?: number;
        maxOutConnections?: number;
    }
    interface IUIGraphConnectionArea extends akra.IUIPanel {
        getConnectors(): akra.IUIGraphConnector[];
        getNode(): akra.IUIGraphNode;
        setMaxInConnections(nValue: number): void;
        setMaxOutConnections(nValue: number): void;
        setMaxConnections(nValue: number): void;
        connectorsCount(eDir?: akra.EUIGraphDirections): number;
        findRoute(pNode: akra.IUIGraphNode): akra.IUIGraphRoute;
        setMode(iMode: number): void;
        isSupportsIncoming(): boolean;
        isSupportsOutgoing(): boolean;
        hasConnections(): boolean;
        prepareForConnect(): akra.IUIGraphConnector;
        routing(): void;
        activate(bValue?: boolean): void;
        isActive(): boolean;
        sendEvent(e: akra.IUIGraphEvent): void;
        connected: akra.ISignal<(pArea: IUIGraphConnectionArea, pFrom: akra.IUIGraphConnector, pTo: akra.IUIGraphConnector) => void>;
    }
}
declare module akra {
    enum EUIGraphNodes {
        UNKNOWN = 0,
        ANIMATION_DATA = 1,
        ANIMATION_PLAYER = 2,
        ANIMATION_BLENDER = 3,
        ANIMATION_MASK = 4,
    }
    interface IGraphNodeAreaMap {
        [name: string]: akra.IUIGraphConnectionArea;
    }
    interface IUIGraphNode extends akra.IUIComponent {
        getGraphNodeType(): EUIGraphNodes;
        getGraph(): akra.IUIGraph;
        getAreas(): IGraphNodeAreaMap;
        getOutputConnector(): akra.IUIGraphConnector;
        getInputConnector(): akra.IUIGraphConnector;
        findRoute(pNode: IUIGraphNode): akra.IUIGraphRoute;
        isConnectedWith(pNode: IUIGraphNode): boolean;
        activate(bState?: boolean): void;
        isActive(): boolean;
        isSuitable(): boolean;
        sendEvent(e: akra.IUIGraphEvent): void;
        highlight(bValue?: boolean): any;
        canAcceptConnect(): boolean;
        routing(): void;
        beforeDestroy: akra.ISignal<{
            void: any;
            (pNode: IUIGraphNode): any;
        }>;
        selected: akra.ISignal<{
            void: any;
            (pNode: IUIGraphNode, bModified: boolean): any;
        }>;
    }
}
declare module akra {
    interface IUIAnimationNode extends akra.IUIGraphNode {
        getAnimation(): akra.IAnimationBase;
        setAnimation(pAnimation: akra.IAnimationBase): void;
    }
}
declare module akra {
    interface IUIAnimationMask extends akra.IUIAnimationNode {
        getMask(): akra.IMap<number>;
    }
}
declare module akra.ui.animation {
    class MaskProperties extends ui.Component {
        public _pNode: akra.IUIAnimationMask;
        public _pMask: akra.IMap<number>;
        constructor(parent: any, options?: any);
        public setMask(pNode: akra.IUIAnimationMask): void;
        public _changed(pSlider: akra.IUISlider, fValue: number): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.animation {
    class Controller extends ui.Component {
        public edit: akra.ISignal<(pController: akra.IUIComponent) => void>;
        public remove: akra.ISignal<(pController: akra.IUIComponent) => void>;
        public _pController: akra.IAnimationController;
        public _pNameLb: akra.IUILabel;
        public _pEditBtn: akra.IUIButton;
        public _pRemoveBtn: akra.IUIButton;
        public setController(pController: akra.IAnimationController): void;
        public getController(): akra.IAnimationController;
        constructor(parent: any, options?: any);
        public setupSignals(): void;
        public _nameChanged(pLb: akra.IUILabel, sName: string): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.camera {
    class Events extends ui.Component {
        public _pCamera: akra.ICamera;
        public _pPreRenderEvtBtn: akra.IUIButton;
        public _pPostRenderEvtBtn: akra.IUIButton;
        public _pLookThrough: akra.IUIButton;
        constructor(parent: any, options?: any);
        public _lookThrough(pBtn: akra.IUIButton): void;
        public _editPreRenderEvent(pBtn: akra.IUIButton, e: akra.IUIEvent): void;
        public _editPostRenderEvent(pBtn: akra.IUIButton, e: akra.IUIEvent): void;
        public setCamera(pCamera: akra.ICamera): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.scene {
    class Events extends ui.Component {
        public _pScene: akra.IScene;
        public _pPreUpdateEvtBtn: akra.IUIButton;
        public _pPostUpdateEvtBtn: akra.IUIButton;
        public _pBeforeUpdateEvtBtn: akra.IUIButton;
        constructor(parent: any, options?: any);
        public _editPreUpdateEvent(pBtn: akra.IUIButton, e: akra.IUIEvent): void;
        public _editPostUpdateEvent(pBtn: akra.IUIButton, e: akra.IUIEvent): void;
        public _editBeforeUpdateEvent(pBtn: akra.IUIButton, e: akra.IUIEvent): void;
        public setScene(pScene: akra.IScene): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui {
    class Inspector extends ui.Component {
        public _pSceneEvents: ui.scene.Events;
        public _pNode: akra.ISceneNode;
        public _pNameLabel: akra.IUILabel;
        public _pPosition: akra.IUIVector;
        public _pWorldPosition: akra.IUIVector;
        public _pRotation: akra.IUIVector;
        public _pScale: akra.IUIVector;
        public _pInheritance: akra.IUICheckboxList;
        public _pAddControllerBtn: akra.IUIButton;
        public _pControllers: ui.animation.Controller[];
        public _nTotalVisibleControllers: number;
        public _bControllerVisible: boolean;
        public _pResource: ui.resource.Properties;
        public _pController: ui.animation.ControllerProperties;
        public _pMesh: ui.model.MeshProperties;
        public _pSceneModel: ui.scene.Model;
        public _pLight: ui.light.Properties;
        public _pCameraEvents: ui.camera.Events;
        public _pAnimationNodeProperties: ui.animation.NodeProperties;
        public _pAnimationMaskProperties: ui.animation.MaskProperties;
        constructor(parent: any, options?: any);
        public setupSignals(): void;
        private getControllerUI();
        private hideAllControllersUI();
        public _addController(pBtn: akra.IUIButton): void;
        public _removeController(pControllerUI: ui.animation.Controller): void;
        public _editCintroller(pControllerUI: ui.animation.Controller): void;
        public _updateName(pLabel: akra.IUILabel, sName: string): void;
        public _updateInheritance(pCheckboxList: akra.IUICheckboxList, pCheckbox: akra.IUICheckbox): void;
        public _updateRotation(pVector: akra.IUIVector, pRotation: akra.IVec3): void;
        public _updateScale(pVector: akra.IUIVector, pScale: akra.IVec3): void;
        public _updateLocalPosition(pVector: akra.IUIVector, pPos: akra.IVec3): void;
        public finalizeRender(): void;
        public _scenePostUpdated(pScene: akra.IScene3d): void;
        private updateProperties();
        public inspectAnimationNode(pNode: akra.IUIAnimationNode): void;
        public inspectAnimationController(pController: akra.IAnimationController): void;
        public inspectNode(pNode: akra.ISceneNode): void;
        public nodeNameChanged: akra.ISignal<(pInspector: akra.IUIComponent, pNode: akra.ISceneNode) => void>;
    }
}
declare module akra.ui {
    class ViewportProperties extends ui.Component {
        public _pViewport: akra.IViewport;
        public _pStats: akra.IUIRenderTargetStats;
        public _pFullscreenBtn: akra.IUIButton;
        public _pResolutionCbl: akra.IUICheckboxList;
        public _pFXAASwh: akra.IUISwitch;
        public _pSkyboxLb: akra.IUILabel;
        public _pScreenshotBtn: akra.IUIButton;
        public _pLookAtBtn: akra.IUIButton;
        constructor(parent: any, options?: any);
        public _fullscreen(): void;
        public _screenshot(): void;
        private setupFileDropping();
        public _fxaaChanged(pSw: akra.IUISwitch, bValue: boolean): void;
        public _previewResChanged(pCbl: akra.IUICheckboxList, pCb: akra.IUICheckbox): void;
        public setViewport(pViewport: akra.IViewport): void;
        public _addedSkybox(pViewport: akra.IViewport, pSkyTexture: akra.ITexture): void;
        public getRenderer(): akra.IRenderer;
        public getEngine(): akra.IEngine;
        public getComposer(): akra.IAFXComposer;
        public getCanvas(): akra.ICanvas3d;
        public getCanvasElement(): HTMLCanvasElement;
        public getViewport(): akra.IViewport;
        public finalizeRender(): void;
    }
}
declare module akra {
    interface IUICodeEditorOptions extends akra.IUIComponentOptions {
        code?: string;
    }
    interface IUICodeEditor extends akra.IUIComponent {
        getCodeMirror(): CodeMirrorEditor;
        getValue(): string;
        setValue(sValue: string): void;
    }
}
declare module akra {
    interface IUIListenerEditor extends akra.IUIPanel {
        editor: akra.IUICodeEditor;
        bindEvent: akra.ISignal<(pEditor: IUIListenerEditor, sCode: string) => void>;
    }
}
declare module akra.ui {
    class CodeEditor extends ui.Component implements akra.IUICodeEditor {
        public getValue(): string;
        public setValue(sValue: string): void;
        private codemirror;
        constructor(parent: any, options: any);
        public getCodeMirror(): CodeMirrorEditor;
        public finalizeRendere(): void;
    }
}
declare module akra.ui.graph {
    class ListenerEditor extends ui.Panel implements akra.IUIListenerEditor {
        public bindEvent: akra.ISignal<(pEditor: akra.IUIListenerEditor, sCode: string) => void>;
        public editor: akra.IUICodeEditor;
        public _pBindBtn: akra.IUIButton;
        constructor(parent: any, options?: any);
        public setupSignals(): void;
        public _bindEvent(pBtn: akra.IUIButton): void;
        public finalizeRender(): void;
    }
}
declare module akra {
    interface IUIGraphControls extends akra.IUIPanel {
        getGraph(): akra.IUIGraph;
    }
}
declare module akra {
    interface IUIAnimationGraph extends akra.IUIGraph {
        nodeSelected: akra.ISignal<(pGraph: IUIAnimationGraph, pNode: akra.IUIAnimationNode, bPlay: boolean) => void>;
        getController(): akra.IAnimationController;
        selectNode(pNode: akra.IUIAnimationNode, bModified?: boolean): void;
        capture(pController: akra.IAnimationController): boolean;
        addAnimation(pAnimation: akra.IAnimationBase): void;
        removeAnimation(pAnimation: akra.IAnimationBase): any;
        removeAnimation(sAnimation: string): any;
        removeAnimation(iAnimation: number): any;
        findNodeByAnimation(sName: string): akra.IUIAnimationNode;
        findNodeByAnimation(pAnimation: akra.IAnimationBase): akra.IUIAnimationNode;
        createNodeByController(pController: akra.IAnimationController): void;
        createNodeByAnimation(pAnimation: akra.IAnimationBase): akra.IUIAnimationNode;
    }
}
declare module akra {
    interface IUIAnimationControls extends akra.IUIGraphControls {
        /** readonly */ 
        graph: akra.IUIAnimationGraph;
    }
}
declare module akra {
    enum ECMD {
        SET_PREVIEW_RESOLUTION = 0,
        SET_PREVIEW_FULLSCREEN = 1,
        INSPECT_SCENE_NODE = 2,
        INSPECT_ANIMATION_NODE = 3,
        INSPECT_ANIMATION_CONTROLLER = 4,
        EDIT_ANIMATION_CONTROLLER = 5,
        CHANGE_AA = 6,
        EDIT_EVENT = 7,
        EDIT_MAIN_SCRIPT = 8,
        LOAD_COLLADA = 9,
        CHANGE_CAMERA = 10,
        SCREENSHOT = 11,
    }
    interface IUIIDE extends akra.IUIComponent {
        _apiEntry: any;
        getSelectedObject(): akra.ISceneObject;
        getEngine(): akra.IEngine;
        getResourceManager(): akra.IResourcePoolManager;
        getScene(): akra.IScene3d;
        getViewport(): akra.IViewport;
        getCamera(): akra.ICamera;
        getCanvas(): akra.ICanvas3d;
        cmd(eCommand: ECMD, ...argv: any[]): boolean;
        created: akra.ISignal<(pIDE: IUIIDE) => void>;
    }
}
declare module akra.ui {
    var ide: akra.IUIIDE;
    enum IAxis {
        X = 1,
        Y = 4,
        Z = 2,
    }
    enum EEditModes {
        NONE = 0,
        PICK = 1,
        MOVE = 2,
        ROTATE = 3,
        SCALE = 4,
    }
    class IDE extends ui.Component implements akra.IUIIDE {
        public created: akra.ISignal<(pIDE: akra.IUIIDE) => void>;
        public _fnMainScript: Function;
        public _pEngine: akra.IEngine;
        public _pSceneTree: ui.scene.SceneTree;
        public _pInspector: ui.Inspector;
        public _pPreview: ui.ViewportProperties;
        public _pTabs: akra.IUITabs;
        public _pColladaDialog: akra.IUIPopup;
        public _p3DControls: akra.IUICheckboxList;
        public _pSelectedObject: akra.IRIDPair;
        public _eEditMode: EEditModes;
        public _pModelBasisTrans: akra.IModelEntry;
        public _apiEntry: any;
        public getScript(): Function;
        public setScript(fn: Function): void;
        public getSelectedObject(): akra.ISceneObject;
        public getSelectedRenderable(): akra.IRenderableObject;
        public getEditMode(): EEditModes;
        constructor(parent: any, options?: any);
        public setupSignals(): void;
        public _enablePickMode(pCb: akra.IUICheckbox, bValue: boolean): void;
        public _enableTranslateMode(pCb: akra.IUICheckbox, bValue: boolean): void;
        public _enableRotateMode(pCb: akra.IUICheckbox, bValue: boolean): void;
        public _enableScaleMode(pCb: akra.IUICheckbox, bValue: boolean): void;
        public _sceneUpdate(pScene: akra.IScene3d): void;
        public setupApiEntry(): void;
        public getEngine(): akra.IEngine;
        public getCanvas(): akra.ICanvas3d;
        public getScene(): akra.IScene3d;
        public getCanvasElement(): HTMLCanvasElement;
        public getResourceManager(): akra.IResourcePoolManager;
        public getViewport(): akra.IViewport;
        public getCamera(): akra.ICamera;
        public getComposer(): akra.IAFXComposer;
        public _updateSceneNodeName(pInspector: ui.Inspector, pNode: akra.ISceneNode): void;
        public _viewportAdded(pTarget: akra.IRenderTarget, pViewport: akra.IViewport): void;
        private updateEditting(pObjectPrev?, pRenderablePrev?);
        private selected(pObj, pRenderable?);
        public cmd(eCommand: akra.ECMD, ...argv: any[]): boolean;
        public saveScreenshot(): boolean;
        public changeCamera(pCamera: akra.ICamera): boolean;
        public setPreviewResolution(iWidth: number, iHeight: number): boolean;
        public setFullscreen(): boolean;
        public inspectNode(pNode: akra.ISceneNode): boolean;
        public inspectAnimationController(pController: akra.IAnimationController): boolean;
        public editAnimationController(pController: akra.IAnimationController): boolean;
        public inspectAnimationNode(pNode: akra.IUIAnimationNode): boolean;
        public changeAntiAliasing(bValue: boolean): boolean;
        public loadColladaModel(): boolean;
        public editMainScript(): boolean;
        public editEvent(pTarget: akra.IEventProvider, sEvent: string, iListener?: number, eType?: akra.EEventTypes): boolean;
    }
}
declare module akra.ui.graph {
    class Route implements akra.IUIGraphRoute {
        /** Route left address */
        public _pLeft: akra.IUIGraphConnector;
        /** Route right address */
        public _pRight: akra.IUIGraphConnector;
        /** Route status. */
        public _bActive: boolean;
        public _bHighlighted: boolean;
        public _bEnabled: boolean;
        /** Route domain */
        public _pPath: RaphaelPath;
        public _pArrow: RaphaelPath;
        public _pColor: akra.IColor;
        public _pInactiveColor: akra.IColor;
        public _fWeight: number;
        public _fMaxWeight: number;
        public getInactiveColor(): akra.IColor;
        public getColor(): akra.IColor;
        public getLeft(): akra.IUIGraphConnector;
        public getRight(): akra.IUIGraphConnector;
        public getWeight(): number;
        public setLeft(pConnector: akra.IUIGraphConnector): void;
        public setRight(pConnector: akra.IUIGraphConnector): void;
        public getArrow(): RaphaelPath;
        public setArrow(pPath: RaphaelPath): void;
        public setWeight(fWeight: number): void;
        public getPath(): RaphaelPath;
        public getCanvas(): RaphaelPaper;
        public setPath(pPath: RaphaelPath): void;
        public isEnabled(): boolean;
        public setEnabled(b: boolean): void;
        constructor(pLeft: akra.IUIGraphConnector, pRight: akra.IUIGraphConnector);
        public isConnectedWithNode(pNode: akra.IUIGraphNode): boolean;
        public isConnectedWith(pConnector: akra.IUIGraphConnector): boolean;
        public isBridge(): boolean;
        public isActive(): boolean;
        public detach(): void;
        public remove(bRecirsive?: boolean): void;
        public sendEvent(e: akra.IUIGraphEvent): void;
        public destroy(): void;
        public activate(bValue?: boolean): void;
        public routing(): void;
        public drawRoute(pFrom: akra.IPoint, pTo: akra.IPoint, eFromOr?: akra.EGraphConnectorOrient, eToOr?: akra.EGraphConnectorOrient): void;
        static calcPosition(pConnector: akra.IUIGraphConnector): akra.IPoint;
    }
    class TempRoute extends Route implements akra.IUITempGraphRoute {
        constructor(pLeft: akra.IUIGraphConnector);
        public routing(pRight?: akra.IPoint): void;
    }
}
declare module akra.ui.graph {
    class Graph extends ui.Component implements akra.IUIGraph {
        public _eGraphType: akra.EUIGraphTypes;
        public _pCanvas: RaphaelPaper;
        public _pTempRoute: akra.IUITempGraphRoute;
        public $svg: JQuery;
        public getNodes(): akra.IUIGraphNode[];
        public getTempRoute(): akra.IUITempGraphRoute;
        public getGraphType(): akra.EUIGraphTypes;
        public getCanvas(): RaphaelPaper;
        constructor(parent: any, options?: any, eType?: akra.EUIGraphTypes);
        public setupSignals(): void;
        public createRouteFrom(pFrom: akra.IUIGraphConnector): void;
        public removeTempRoute(): void;
        public isReadyForConnect(): boolean;
        public connectTo(pTo: akra.IUIGraphConnector): void;
        public finalizeRender(): void;
        public connectionBegin: akra.ISignal<(pGraph: akra.IUIGraph, pRoute: akra.IUIGraphRoute) => void>;
        public connectionEnd: akra.ISignal<(pGraph: akra.IUIGraph) => void>;
        static KeydownSignal: typeof KeydownSignal;
        static MousemoveSignal: typeof MousemoveSignal;
        static MouseupSignal: typeof MouseupSignal;
        static ClickSignal: typeof ClickSignal;
        static event(eType: akra.EUIGraphEvents): akra.IUIGraphEvent;
    }
}
declare module akra.ui.graph {
    class Connector extends ui.Component implements akra.IUIGraphConnector {
        public _eOrient: akra.EGraphConnectorOrient;
        public _eDirect: akra.EUIGraphDirections;
        public _bActive: boolean;
        public _pRoute: akra.IUIGraphRoute;
        public getOrient(): akra.EGraphConnectorOrient;
        public getArea(): akra.IUIGraphConnectionArea;
        public getNode(): akra.IUIGraphNode;
        public getGraph(): akra.IUIGraph;
        public getRoute(): akra.IUIGraphRoute;
        public getDirection(): akra.EUIGraphDirections;
        public setOrient(e: akra.EGraphConnectorOrient): void;
        public setRoute(pRoute: akra.IUIGraphRoute): void;
        constructor(parent: any, options?: any);
        public setupSignals(): void;
        public hasRoute(): boolean;
        public finalizeRender(): void;
        public isConnected(): boolean;
        public isActive(): boolean;
        public activate(bValue?: boolean): void;
        public sendEvent(e: akra.IUIGraphEvent): void;
        public input(): boolean;
        public output(): boolean;
        public highlight(bToggle?: boolean): void;
        public routing(): void;
        public activated: akra.ISignal<(pConnector: akra.IUIGraphConnector, bValue: boolean) => void>;
        public connected: akra.ISignal<(pConnector: akra.IUIGraphConnector, pTarget: akra.IUIGraphConnector) => void>;
        public routeBreaked: akra.ISignal<(pConnector: akra.IUIGraphConnector, pRoute: akra.IUIGraphRoute) => void>;
        static UIGRAPH_INVALID_CONNECTION: number;
        static ConnectedSignal: typeof ConnectedSignal;
        static MousedownSignal: typeof MousedownSignal;
        static MouseupSignal: typeof MouseupSignal;
    }
}
declare module akra.ui.graph {
    class ConnectionArea extends ui.Panel implements akra.IUIGraphConnectionArea {
        public _iMode: number;
        public _pConnectors: akra.IUIGraphConnector[];
        public _pTempConnect: akra.IUIGraphConnector;
        public _iConnectionLimit: number;
        public _iInConnectionLimit: number;
        public _iOutConnectionLimit: number;
        public _eConectorOrient: akra.EGraphConnectorOrient;
        public getConnectors(): akra.IUIGraphConnector[];
        public getNode(): akra.IUIGraphNode;
        public getGraph(): akra.IUIGraph;
        public setMaxInConnections(n: number): void;
        public setMaxOutConnections(n: number): void;
        public setMaxConnections(n: number): void;
        constructor(parent: any, options?: akra.IUIConnectionAreaOptions, eType?: akra.EUIComponents);
        public setupSignals(): void;
        public attachToParent(pParent: akra.IUIGraphNode): boolean;
        public _createdFrom($comp: JQuery): void;
        public findRoute(pNode: akra.IUIGraphNode): akra.IUIGraphRoute;
        public connectorsCount(eDir?: akra.EUIGraphDirections): number;
        public setMode(iMode: number): void;
        public isSupportsIncoming(): boolean;
        public isSupportsOutgoing(): boolean;
        public isLimitReached(): boolean;
        public hasConnections(): boolean;
        public isActive(): boolean;
        public activate(bValue?: boolean): void;
        public sendEvent(e: akra.IUIGraphEvent): void;
        public prepareForConnect(): akra.IUIGraphConnector;
        public _onNodeMouseover(pNode: akra.IUIGraphNode, e: akra.IUIEvent): void;
        private onConnection(pConnector, pTarget);
        private destroyTempConnect();
        public _onNodeMouseout(pNode: akra.IUIGraphNode, e: akra.IUIEvent): void;
        public routing(): void;
        public finalizeRender(): void;
        public connected: akra.ISignal<(pArea: akra.IUIGraphConnectionArea, pFrom: akra.IUIGraphConnector, pTo: akra.IUIGraphConnector) => void>;
    }
    function isConnectionArea(pEntity: akra.IEntity): boolean;
}
declare module akra.ui.graph {
    class Node extends ui.Component implements akra.IUIGraphNode {
        public _eGraphNodeType: akra.EUIGraphNodes;
        public _isActive: boolean;
        public _pAreas: akra.IGraphNodeAreaMap;
        public _isSuitable: boolean;
        public getGraphNodeType(): akra.EUIGraphNodes;
        public getGraph(): akra.IUIGraph;
        public getAreas(): akra.IGraphNodeAreaMap;
        constructor(pGraph: akra.IUIGraph, options?: any, eType?: akra.EUIGraphNodes, $el?: JQuery);
        public setupSignals(): void;
        public getOutputConnector(): akra.IUIGraphConnector;
        public getInputConnector(): akra.IUIGraphConnector;
        public onConnectionEnd(pGraph: akra.IUIGraph): void;
        public onConnectionBegin(pGraph: akra.IUIGraph, pRoute: akra.IUIGraphRoute): void;
        public linkAreas(): void;
        public isSuitable(): boolean;
        public findRoute(pNode: akra.IUIGraphNode): akra.IUIGraphRoute;
        public isConnectedWith(pNode: akra.IUIGraphNode): boolean;
        public canAcceptConnect(): boolean;
        public finalizeRender(): void;
        public activate(bValue?: boolean): void;
        public isActive(): boolean;
        public init(): void;
        public addConnectionArea(sName: string, pArea: akra.IUIGraphConnectionArea): void;
        public connected(pArea: akra.IUIGraphConnectionArea, pFrom: akra.IUIGraphConnector, pTo: akra.IUIGraphConnector): void;
        public sendEvent(e: akra.IUIGraphEvent): void;
        public highlight(bValue?: boolean): void;
        public routing(): void;
        public beforeDestroy: akra.ISignal<{
            void: any;
            (pNode: akra.IUIGraphNode): any;
        }>;
        public selected: akra.ISignal<{
            void: any;
            (pNode: akra.IUIGraphNode, bModified: boolean): any;
        }>;
        static MouseenterSignal: typeof MouseenterSignal;
        static MouseleaveSignal: typeof MouseleaveSignal;
        static ClickSignal: typeof ClickSignal;
        static MoveSignal: typeof MoveSignal;
        static DbclickSignal: typeof DbclickSignal;
    }
}
declare module akra.ui.graph {
    class Controls extends ui.Panel implements akra.IUIGraphControls {
        public controls: akra.IUIComponent;
        public graph: akra.IUIGraph;
        public getGraph(): akra.IUIGraph;
        constructor(parent: any, options?: any, pGraph?: akra.IUIGraph);
        public createNode(): akra.IUIGraphNode;
        public finalizeRender(): void;
    }
}
declare module akra {
    interface IUIAnimationData extends akra.IUIAnimationNode {
    }
}
declare module akra.ui.animation {
    class Node extends ui.graph.Node implements akra.IUIAnimationNode {
        constructor(parent: any, options?: any, eType?: akra.EUIGraphNodes);
        public attachToParent(pParent: akra.IUIAnimationGraph): boolean;
        public _selected(pGraph: akra.IUIAnimationGraph, pNode: akra.IUIAnimationNode, bPlay: boolean): void;
        public getAnimation(): akra.IAnimationBase;
        public setAnimation(pAnimation: akra.IAnimationBase): void;
        public getGraph(): akra.IUIAnimationGraph;
        public connected(pArea: akra.IUIGraphConnectionArea, pFrom: akra.IUIGraphConnector, pTo: akra.IUIGraphConnector): void;
    }
}
declare module akra.ui.animation {
    class Data extends animation.Node implements akra.IUIAnimationData {
        private _pAnimation;
        public getAnimation(): akra.IAnimation;
        public setAnimation(pAnim: akra.IAnimation): void;
        constructor(pGraph: akra.IUIGraph, pAnim?: akra.IAnimation);
        public finalizeRender(): void;
    }
}
declare module akra {
    interface IUIAnimationPlayer extends akra.IUIAnimationNode {
    }
}
declare module akra.ui.animation {
    class Player extends animation.Node implements akra.IUIAnimationPlayer {
        private _pSpeedLabel;
        private _pSlider;
        private _pPlayBtn;
        private _pLoopBtn;
        private _pReverseBtn;
        private _pEnableBtn;
        private _pLeftInf;
        private _pRightInf;
        private _pNameLabel;
        private _pAnimation;
        public $time: JQuery;
        public getAnimation(): akra.IAnimationBase;
        public setAnimation(pAnim: akra.IAnimationBase): void;
        constructor(pGraph: akra.IUIGraph, pContainer?: akra.IAnimationContainer);
        public connected(pArea: akra.IUIGraphConnectionArea, pFrom: akra.IUIGraphConnector, pTo: akra.IUIGraphConnector): void;
        public onConnectionBegin(pGraph: akra.IUIGraph, pRoute: akra.IUIGraphRoute): void;
        public setup(): void;
        public _enabled(pSwc: akra.IUISwitch, bValue: boolean): void;
        private notifyDisabled(bValue);
        public _setLeftInf(pCheckbox: akra.IUICheckbox, bValue: boolean): void;
        public _setRightInf(pCheckbox: akra.IUICheckbox, bValue: boolean): void;
        public _reverse(pCheckbox: akra.IUICheckbox, bValue: boolean): void;
        public _useLoop(pCheckbox: akra.IUICheckbox, bValue: boolean): void;
        public _pause(pCheckbox: akra.IUICheckbox, bValue: boolean): void;
        public _play(pCheckbox: akra.IUICheckbox, bValue: boolean): void;
        public _setTime(pSlider: akra.IUISlider, fValue: number): void;
        public _setName(pLabel: akra.IUILabel, sName: any): void;
        public _setSpeed(pLabel: akra.IUILabel, x: any): void;
        public _durationUpdated(pContainer: akra.IAnimationContainer, fDuration: number): void;
        public _enterFrame(pContainer: akra.IAnimationContainer, fRealTime: number, fTime: number): void;
        public finalizeRender(): void;
    }
}
declare module akra {
    interface IUIAnimationBlender extends akra.IUIAnimationNode {
        getTotalMasks(): number;
        getMaskNode(iAnim: number): akra.IUIAnimationMask;
        setMaskNode(iAnim: number, pNode: akra.IUIAnimationMask): void;
        setup(): void;
    }
}
declare module akra {
    interface IUISlider extends akra.IUIComponent {
        getPin(): akra.IUIComponent;
        getValue(): number;
        setValue(fValue: number): void;
        getRange(): number;
        setRange(fRange: number): void;
        getText(): string;
        setText(sValue: string): void;
        updated: akra.ISignal<(pSlider: IUISlider, fValue: number) => void>;
    }
}
declare module akra.ui.animation {
    class Mask extends animation.Node implements akra.IUIAnimationMask {
        private _pAnimation;
        private _pMask;
        private _pSliders;
        private _pEditBtn;
        private _pEditPanel;
        public getAnimation(): akra.IAnimationBase;
        public setAnimation(pAnim: akra.IAnimationBase): void;
        constructor(pGraph: akra.IUIGraph, pMask?: akra.IMap<number>);
        public finalizeRender(): void;
        public getMask(): akra.IMap<number>;
        static isMaskNode(pNode: akra.IUIAnimationNode): boolean;
    }
}
declare module akra.ui.animation {
    interface IBlenderSliderContainer {
        slider: akra.IUISlider;
        animation: akra.IAnimationBase;
    }
    class Blender extends animation.Node implements akra.IUIAnimationBlender {
        private _pBlend;
        private _pSliders;
        private _pNameLabel;
        private _pMaskNodes;
        public $time: JQuery;
        public getAnimation(): akra.IAnimationBase;
        public getTotalMasks(): number;
        constructor(pGraph: akra.IUIGraph, pBlender?: akra.IAnimationBlend);
        public onConnectionBegin(pGraph: akra.IUIGraph, pRoute: akra.IUIGraphRoute): void;
        public _textChanged(pLabel: akra.IUILabel, sValue: string): void;
        public destroy(): void;
        public getMaskNode(iAnimation: number): akra.IUIAnimationMask;
        public setMaskNode(iAnimation: number, pNode: akra.IUIAnimationMask): void;
        public setup(): void;
        public _weightUpdated(pBlend: akra.IAnimationBlend, iAnim: number, fWeight: number): void;
        public _durationUpdated(pBlend: akra.IAnimationBlend, fDuration: number): void;
        public connected(pArea: akra.IUIGraphConnectionArea, pFrom: akra.IUIGraphConnector, pTo: akra.IUIGraphConnector): void;
        public finalizeRender(): void;
    }
}
declare module akra.ui.animation {
    class Controls extends ui.graph.Controls implements akra.IUIAnimationControls {
        public graph: akra.IUIAnimationGraph;
        constructor(parent: any, options?: any);
        public createData(): akra.IUIAnimationNode;
        public createPlayer(): akra.IUIAnimationNode;
        public createBlender(): akra.IUIAnimationNode;
        public createMask(): akra.IUIAnimationNode;
        public createExporter(): akra.exchange.Exporter;
        public exportBinController(): void;
        public exportController(): void;
    }
}
declare module akra.ui.animation {
    class Graph extends ui.graph.Graph implements akra.IUIAnimationGraph {
        public nodeSelected: akra.ISignal<(pGraph: akra.IUIAnimationGraph, pNode: akra.IUIAnimationNode, bPlay: boolean) => void>;
        private _pSelectedNode;
        private _pAnimationController;
        constructor(parent: any, options: any);
        public setupSignals(): void;
        private setupFileDropping();
        public getController(): akra.IAnimationController;
        public selectNode(pNode: akra.IUIAnimationNode, bModified?: boolean): void;
        public addAnimation(pAnimation: akra.IAnimationBase): void;
        public removeAnimation(pAnimation: akra.IAnimationBase): void;
        public removeAnimation(sAnimation: string): void;
        public removeAnimation(iAnimation: number): void;
        public findNodeByAnimation(sName: string): akra.IUIAnimationNode;
        public findNodeByAnimation(pAnimation: akra.IAnimationBase): akra.IUIAnimationNode;
        public createNodeByController(pController: akra.IAnimationController): void;
        public createNodeByAnimation(pAnimation: akra.IAnimationBase): akra.IUIAnimationNode;
        public capture(pController: akra.IAnimationController): boolean;
        private animationAdded(pController, pAnimation);
        private onControllerPlay(pController, pAnimation);
        public addChild(pChild: akra.IEntity): akra.IEntity;
        public finalizeRender(): void;
        static DropSignal: typeof DropSignal;
    }
}
declare module akra.ui {
    class UI implements akra.IUI {
        public guid: number;
        private _sUIName;
        public getName(): string;
        public _pManager: akra.ISceneManager;
        public getType(): akra.ESceneTypes;
        constructor(pManager?: akra.ISceneManager);
        public setupSignals(): void;
        public getManager(): akra.ISceneManager;
        public createHTMLNode(pElement: HTMLElement): akra.IUIHTMLNode;
        public createDNDNode(pElement: HTMLElement): akra.IUIDNDNode;
        public createComponent(sType: string, pOptions?: akra.IUIComponentOptions): akra.IUIComponent;
        public createLayout(eType?: akra.EUILayouts, pAttrs?: akra.IUILayoutAttributes): akra.IUILayout;
        public createLayout(sType?: string, pAttrs?: akra.IUILayoutAttributes): akra.IUILayout;
    }
    function createUI(pManager?: akra.ISceneManager): akra.IUI;
}
