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
  interface IUILayout extends IUIHTMLNode {
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
  interface IUINode extends IEntity {
    relocated: ISignal<(pNode: IUINode, pLocation: IUINode) => void>;
    getNodeType(): EUINodeTypes;
    getUI(): IUI;
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
  interface IUIHTMLNode extends IUINode {
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
    click: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    dblclick: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mousemove: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mouseup: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mousedown: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mouseover: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mouseout: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mouseenter: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    mouseleave: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    focusin: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    focusout: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    blur: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    change: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    keydown: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    keyup: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    resize: ISignal<(pNode: IUIHTMLNode) => void>;
    rendered: ISignal<(pNode: IUIHTMLNode) => void>;
    beforeRender: ISignal<(pNode: IUIHTMLNode) => void>;
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
  interface IUIComponent extends IUIDNDNode {
    getComponentType(): EUIComponents;
    getGenericType(): string;
    isGeneric(): boolean;
    getLayout(): IUILayout;
    setLayout(eType: EUILayouts): boolean;
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
  interface IUIDNDNode extends IUIHTMLNode {
    setDraggable(bValue?: boolean, pOptions?: IUIDraggableOptions): void;
    setDraggableOptions(pOptions: IUIDraggableOptions): void;
    isDraggable(): boolean;
    dragStart: ISignal<(pNode: IUIDNDNode, e: IUIEvent) => void>;
    dragStop: ISignal<(pNode: IUIDNDNode, e: IUIEvent) => void>;
    move: ISignal<(pNode: IUIDNDNode, e: IUIEvent) => void>;
    drop: ISignal<(pNode: IUIDNDNode, e: IUIEvent, comp: IUIComponent, info: any) => void>;
  }
}
declare module akra {
  interface IUIButtonOptions extends IUIComponentOptions {
    text?: string;
  }
  interface IUIButton extends IUIComponent {
    getText(): string;
    setText(sValue: string): void;
  }
}
declare module akra {
  interface IUICheckboxOptions extends IUIComponentOptions {
    text?: string;
  }
  interface IUICheckbox extends IUIComponent {
    changed: ISignal<(pChekbox: IUICheckbox, bValue: boolean) => void>;
    setChecked(bValue: boolean): void;
    getText(): string;
    setText(sValue: string): void;
    isChecked(): boolean;
    _setValue(bValue: boolean): void;
  }
}
declare module akra {
  interface IUICheckboxList extends IUIComponent {
    getLength(): number;
    getItems(): IUICheckbox[];
    isChecked(): IUICheckbox;
    isRadio(): boolean;
    setRadio(bValue: boolean): void;
    hasMultiSelect(): boolean;
    changed: ISignal<(pList: IUICheckboxList, pCheckbox: IUICheckbox) => void>;
  }
}
declare module akra {
  interface IUILabelOptions extends IUIComponentOptions {
    text?: string;
    editable?: boolean;
  }
  interface IUILabel extends IUIComponent {
    changed: ISignal<(pLabel: IUILabel, sValue: string) => void>;
    getText(): string;
    setText(sValue: string): void;
    getPostfix(): string;
    setPostfix(sValue: string): void;
    editable(bValue?: boolean): void;
    isEditable(): boolean;
  }
}
declare module akra {
  interface IUIPanelOptions extends IUIComponentOptions {
    title?: string;
  }
  interface IUIPanel extends IUIComponent {
    index: number;
    isCollapsed(): boolean;
    getTitle(): string;
    setTitle(sValue: string): void;
    collapse(bValue?: boolean): void;
    isCollapsible(): boolean;
    setCollapsible(bValue?: boolean): void;
    titleUpdated: ISignal<(pPabel: IUIPanel, sTitle: string) => void>;
    selected: ISignal<(pPabel: IUIPanel) => void>;
  }
}
declare module akra {
  interface IUIPopup extends IUIComponent {
    getTitle(): string;
    setTitle(sValue: string): void;
    close(): void;
    closed: ISignal<(pPopup: IUIPopup) => void>;
  }
}
declare module akra {
  interface IUITabs extends IUIComponent {
    getActiveTab(): IUIPanel;
    tab(iTab: number): IUIPanel;
    select(i: number): void;
    select(pPanel: IUIPanel): void;
    findTabByTitle(sName: string): number;
    findTab(sName: string): number;
    tabIndex(pPanel: IUIPanel): number;
  }
}
declare module akra {
  interface IUIVector extends IUIComponent {
    /** readonly */ 
    x: IUILabel;
    /** readonly */ 
    y: IUILabel;
    /** readonly */ 
    z: IUILabel;
    /** readonly */ 
    w: IUILabel;
    /** readonly */ 
    totalComponents: number;
    getValue(): any;
    toVec2(): IVec2;
    toVec3(): IVec3;
    toVec4(): IVec4;
    setVec2(v: IVec2): void;
    setVec3(v: IVec3): void;
    setVec4(v: IVec4): void;
    setColor(c: IColorValue): void;
    isEditable(): boolean;
    editable(bValue?: boolean): void;
    changed: ISignal<(pVector: IUIVector, v: any) => void>;
  }
}
declare module akra {
  interface IUI extends IScene2d {
    createHTMLNode(pElement: HTMLElement): IUIHTMLNode;
    createDNDNode(pElement: HTMLElement): IUIDNDNode;
    createComponent(sName: string, pOptions?: IUIComponentOptions): IUIComponent;
    createLayout(eType: EUILayouts, pAttrs?: IUILayoutAttributes): IUILayout;
    createLayout(sType: string, pAttrs?: IUILayoutAttributes): IUILayout;
  }
}
declare module akra.ui {
  var $document: JQuery;
  var $body: JQuery;
  class Node extends util.Entity implements IUINode {
    public relocated: ISignal<(pNode: IUINode, pLocation: IUINode) => void>;
    public _pUI: IUI;
    public _eNodeType: EUINodeTypes;
    public getUI(): IUI;
    public getNodeType(): EUINodeTypes;
    constructor(pParent: IUINode, eNodeType?: EUINodeTypes);
    constructor(pUI: IUI, eNodeType?: EUINodeTypes);
    public setupSignals(): void;
    public render(): boolean;
    public render(pParent: IUINode): boolean;
    public render(pElement: HTMLElement): boolean;
    public render(sSelector: string): boolean;
    public recursiveRender(): void;
    public renderTarget(): JQuery;
    public hasRenderTarget(): boolean;
    public addChild(pChild: IEntity): IEntity;
    public attachToParent(pParent: IUINode): boolean;
    public findRenderTarget(): IUINode;
  }
  function isUI(parent: IUINode): boolean;
  function isUI(parent: IUI): boolean;
  function getUI(parent: IUINode): IUI;
  function getUI(parent: IUI): IUI;
  function isUINode(pEntity: IEntity): boolean;
  function isLayout(pEntity: IEntity): boolean;
  function containsHTMLElement(pEntity: IEntity): boolean;
}
declare module akra.ui {
  class HTMLNode extends Node implements IUIHTMLNode {
    public click: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public dblclick: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mousemove: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mouseup: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mousedown: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mouseover: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mouseout: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mouseenter: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public mouseleave: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public focusin: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public focusout: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public blur: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public change: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public keydown: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public keyup: ISignal<(pNode: IUIHTMLNode, e: IUIEvent) => void>;
    public resize: ISignal<(pNode: IUIHTMLNode) => void>;
    public beforeRender: ISignal<(pNode: IUIHTMLNode) => void>;
    public rendered: ISignal<(pNode: IUIHTMLNode) => void>;
    public $element: JQuery;
    public _fnEventRedirector: Function;
    public getElement(): JQuery;
    constructor(parent: any, pElement?: HTMLElement, eNodeType?: EUINodeTypes);
    constructor(parent: any, $element?: JQuery, eNodeType?: EUINodeTypes);
    public setupSignals(): void;
    public handleEvent(sEvent: string): boolean;
    public disableEvent(sEvent: string): void;
    public hasRenderTarget(): boolean;
    public renderTarget(): JQuery;
    public getHTMLElement(): HTMLElement;
    public render(): boolean;
    public render(pParent: IUINode): boolean;
    public render(pElement: HTMLElement): boolean;
    public render(pElement: JQuery): boolean;
    public render(sSelector: string): boolean;
    public attachToParent(pParent: IUINode, bRender?: boolean): boolean;
    public isFocused(): boolean;
    public isRendered(): boolean;
    public destroy(bRecursive?: boolean, bPromoteChildren?: boolean): void;
    public width(): number;
    public height(): number;
    public valueOf(): JQuery;
    public hide(): void;
    public show(): void;
    public self(): JQuery;
    public finalizeRender(pNode?: IUIHTMLNode): void;
    private static EVENTS;
    static RenderedSignal: typeof Signal;
  }
}
declare module akra.ui {
  class DNDNode extends HTMLNode implements IUIDNDNode {
    public dragStart: ISignal<(pNode: IUIDNDNode, e: IUIEvent) => void>;
    public dragStop: ISignal<(pNode: IUIDNDNode, e: IUIEvent) => void>;
    public move: ISignal<(pNode: IUIDNDNode, e: IUIEvent) => void>;
    public drop: ISignal<(pNode: IUIDNDNode, e: IUIEvent, pComponent: IUIComponent, info: any) => void>;
    public _bDraggableInited: boolean;
    public _bDroppableInited: boolean;
    constructor(parent: any, element?: any, eNodeType?: EUINodeTypes);
    public setupSignals(): void;
    public isDraggable(): boolean;
    public setDraggable(bValue?: boolean, pOptions?: IUIDraggableOptions): void;
    public setDraggableOptions(pOptions: IUIDraggableOptions): void;
    public setDroppable(bValue?: boolean): void;
    public attachToParent(pParent: IUINode, bRender?: boolean): boolean;
  }
}
declare module akra.ui {
  function template(pNode: IUIComponent, sUrl: string, pData?: any): void;
  var COMPONENTS: {
    [type: string]: typeof Component;
  };
  class Component extends DNDNode implements IUIComponent {
    public _eComponentType: EUIComponents;
    public _sGenericType: string;
    public _pComponentOptions: IUIComponentOptions;
    public getComponentType(): EUIComponents;
    public getGenericType(): string;
    public getName(): string;
    public setName(sName: string): void;
    public getOptions(): IUIComponentOptions;
    public getLayout(): IUILayout;
    constructor(parent: any, sName?: string, eType?: EUIComponents, $el?: JQuery);
    constructor(parent: any, pOptions?: IUIComponentOptions, eType?: EUIComponents, $el?: JQuery);
    public template(sTplName: string, pData?: any): void;
    public fromStringTemplate(sTemplate: string, pData?: any): void;
    public finalizeRender(pNode?: IUIHTMLNode): void;
    public isGeneric(): boolean;
    public setLayout(eType: EUILayouts): boolean;
    public setLayout(sType: string): boolean;
    public attachToParent(pParent: IUINode, bRender?: boolean): boolean;
    public applyOptions(pOptions: IUIComponentOptions): void;
    public createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent;
    public _createdFrom($comp: JQuery): void;
    public toString(isRecursive?: boolean, iDepth?: number): string;
  }
  function register(sType: string, pComponent: typeof Component): void;
  function isComponent(pEntity: IEntity, eComponent?: EUIComponents): boolean;
  function isGeneric(pEntity: IEntity): boolean;
  function mergeOptions(sNameLeft: string, pOptionsRight: IUIComponentOptions): IUIComponentOptions;
  function mergeOptions(sNameLeft: string, sNameRight: string): IUIComponentOptions;
  function mergeOptions(pOptionsLeft: IUIComponentOptions, pOptionsRight: IUIComponentOptions): IUIComponentOptions;
}
declare module akra.ui {
  class Panel extends Component implements IUIPanel {
    public titleUpdated: ISignal<(pPabel: IUIPanel, sTitle: string) => void>;
    public selected: ISignal<(pPabel: IUIPanel) => void>;
    public index: number;
    public $title: JQuery;
    public $controls: JQuery;
    public isCollapsed(): boolean;
    public getTitle(): string;
    public setTitle(sTitle: string): void;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public _createdFrom($comp: JQuery): void;
    public collapse(bValue?: boolean): void;
    public finalizeRender(): void;
    public isCollapsible(): boolean;
    public setCollapsible(bValue?: boolean): void;
  }
  function isPanel(pEntity: IEntity): boolean;
}
declare module akra.ui {
  class Popup extends Component implements IUIPopup {
    public closed: ISignal<(pPopup: IUIPopup) => void>;
    public $title: JQuery;
    public $header: JQuery;
    public $footer: JQuery;
    public $controls: JQuery;
    public $closeBtn: JQuery;
    public getTitle(): string;
    public setTitle(sTitle: string): void;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public close(): void;
    public _createdFrom($comp: JQuery): void;
    static MoveSignal: typeof Signal;
  }
}
declare module akra.ui {
  class Tabs extends Component implements IUITabs {
    public _pTabs: IUIPanel[];
    public _iActiveTab: number;
    public $bookmarks: JQuery;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public getActiveTab(): IUIPanel;
    public getLength(): number;
    public addChild(pEntity: IEntity): IEntity;
    public tabIndex(pPanel: IUIPanel): number;
    public findTabByTitle(sName: string): number;
    public findTab(sName: string): number;
    public tab(iTab: number): IUIPanel;
    public select(panel: any): void;
    public _tabTitleUpdated(pPanel: IUIPanel, sTitle: string): void;
    public bookmarkFor(pPanel: IUIPanel): JQuery;
    public createBookmarkFor(pPanel: IUIPanel): void;
  }
}
declare module akra.ui {
  class Button extends Component implements IUIButton {
    public getText(): string;
    public setText(x: string): void;
    constructor(ui: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public _createdFrom($comp: JQuery): void;
    public applyOptions(pOptions: IUIButtonOptions): void;
    static ClickSignal: typeof Signal;
  }
}
declare module akra.ui {
  class Menu extends Component {
    public $title: JQuery;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public getText(): string;
    public setText(s: string): void;
    public _createdFrom($comp: JQuery): void;
    static MouseleaveSignal: typeof Signal;
    static MouseenterSignal: typeof Signal;
  }
}
declare module akra {
  interface IUISwitch extends IUIComponent {
    changed: ISignal<(pSwitch: IUISwitch, bValue: boolean) => void>;
    getValue(): boolean;
    setValue(bValue: boolean): void;
    isOn(): boolean;
    _setValue(bValue: boolean): void;
  }
}
declare module akra.ui {
  class Switch extends Component implements IUISwitch {
    public changed: ISignal<(pSwitch: IUISwitch, bValue: boolean) => void>;
    private $checkbox;
    public getValue(): boolean;
    public setValue(bValue: boolean): void;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public _setValue(bValue: boolean): void;
    public _createdFrom($comp: JQuery): void;
    public isOn(): boolean;
  }
}
declare module akra.ui {
  class Label extends Component implements IUILabel {
    public changed: ISignal<(pLabel: IUILabel, sValue: string) => void>;
    public $text: JQuery;
    public $input: JQuery;
    public _bEditable: boolean;
    public _sPostfix: string;
    public getText(): string;
    public setText(x: string): void;
    public setPostfix(s: string): void;
    public getPostfix(): string;
    constructor(ui: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public _createdFrom($comp: JQuery): void;
    public isEditable(): boolean;
    public editable(bValue?: boolean): void;
    public finalizeRender(): void;
    static ClickSignal: typeof Signal;
    static FocusoutSignal: typeof Signal;
    static KeydownSignal: typeof Signal;
  }
}
declare module akra.ui {
  class Vector extends Component implements IUIVector {
    public changed: ISignal<(pVector: IUIVector, v: any) => void>;
    public x: IUILabel;
    public y: IUILabel;
    public z: IUILabel;
    public w: IUILabel;
    public totalComponents: number;
    public _iFixed: number;
    public _bEditable: boolean;
    public $lock: JQuery;
    constructor(ui: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public getValue(): any;
    public _createdFrom($comp: JQuery): void;
    public editable(bValue?: boolean): void;
    public isEditable(): boolean;
    public useComponents(n: number): void;
    public setVec2(v: IVec2): void;
    public setVec3(v: IVec3): void;
    public setVec4(v: IVec4): void;
    public setColor(c: IColorValue): void;
    public toVec2(): IVec2;
    public toVec3(): IVec3;
    public toVec4(): IVec4;
    public finalizeRender(): void;
  }
}
declare module akra.ui {
  class Layout extends HTMLNode implements IUILayout {
    public _eLayoutType: EUILayouts;
    public _pAttrs: IUILayoutAttributes;
    public getLayoutType(): EUILayouts;
    constructor(parent: any, pElement?: HTMLElement, eType?: EUILayouts);
    constructor(parent: any, pElement?: JQuery, eType?: EUILayouts);
    public attachToParent(pParent: IUINode): boolean;
    public attr(sAttr: string): any;
    public setAttributes(pAttrs: IUILayoutAttributes): void;
    public toString(isRecursive?: boolean, iDepth?: number): string;
  }
}
declare module akra.ui {
  class Horizontal extends Layout {
    public $row: JQuery;
    public $table: JQuery;
    constructor(parent: any);
    public renderTarget(): JQuery;
    public removeChild(pChild: IEntity): IEntity;
    public toString(isRecursive?: boolean, iDepth?: number): string;
  }
}
declare module akra.ui {
  class Vertical extends Layout {
    public $table: JQuery;
    constructor(parent: any);
    public renderTarget(): JQuery;
    public removeChild(pChild: IEntity): IEntity;
    public toString(isRecursive?: boolean, iDepth?: number): string;
  }
}
declare module akra.ui {
  class Slider extends Component implements IUISlider {
    public updated: ISignal<(pSlider: IUISlider, fValue: number) => void>;
    public _fRange: number;
    public _fValue: number;
    public $progress: JQuery;
    public $text: JQuery;
    public getPin(): IUIComponent;
    public getValue(): number;
    public getRange(): number;
    public setRange(fValue: number): void;
    public getText(): string;
    public setText(s: string): void;
    public setValue(fValue: number): void;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public finalizeRender(): void;
    public _updated(pPin: IUIComponent, e: IUIEvent): void;
    public _createdFrom($comp: JQuery): void;
    public toString(isRecursive?: boolean, iDepth?: number): string;
  }
}
declare module akra.ui {
  class Checkbox extends Component implements IUICheckbox {
    public changed: ISignal<(pChekbox: IUICheckbox, bValue: boolean) => void>;
    public _bChecked: boolean;
    public $text: JQuery;
    public setChecked(bValue: boolean): void;
    public getText(): string;
    public setText(sValue: string): void;
    public _setValue(bValue: boolean): void;
    constructor(parent: any, options?: IUICheckboxOptions, eType?: EUIComponents);
    constructor(parent: any, name?: string, eType?: EUIComponents);
    public setupSignals(): void;
    public _createdFrom($comp: JQuery): void;
    public finalizeRender(): void;
    public isChecked(): boolean;
    public toString(isRecursive?: boolean, iDepth?: number): string;
    static ClickSignal: typeof Signal;
  }
  function isCheckbox(pEntity: IEntity): boolean;
}
declare module akra.ui {
  class CheckboxList extends Component implements IUICheckboxList {
    public changed: ISignal<(pList: IUICheckboxList, pCheckbox: IUICheckbox) => void>;
    private _nSize;
    private _pItems;
    private _bMultiSelect;
    private _bLikeRadio;
    public getLength(): number;
    public isRadio(): boolean;
    public setRadio(b: boolean): void;
    public getItems(): IUICheckbox[];
    public isChecked(): IUICheckbox;
    constructor(parent: any, options?: any, eType?: EUIComponents);
    public setupSignals(): void;
    public _createdFrom($comp: JQuery): void;
    public finalizeRender(): void;
    public hasMultiSelect(): boolean;
    public update(): boolean;
    public addCheckbox(pCheckbox: IUICheckbox): void;
    public _childAdded(pLayout: IUILayout, pNode: IUINode): void;
    public _childRemoved(pLayout: IUILayout, pNode: IUINode): void;
    public _changed(pCheckbox: IUICheckbox, bCheked: boolean): void;
  }
}
declare module akra {
  interface IUIWindowOptions extends IUIComponentOptions {
    title?: string;
  }
  interface IUIWindow extends IUIComponent {
  }
}
declare module akra.ui {
  class Window extends Component implements IUIWindow {
    public _pWindow: any;
    public $document: any;
    constructor(pUI: IUI, options?: IUIWindowOptions);
  }
}
declare module akra {
  interface IUIRenderTargetStats extends IUIComponent {
    getTarget(): IRenderTarget;
    setTarget(pTarget: IRenderTarget): void;
  }
}
declare module akra.ui {
  class RenderTargetStats extends Component implements IUIRenderTargetStats {
    public _pInfoElement: HTMLDivElement;
    public _pValues: number[];
    public _pRenderTarget: IRenderTarget;
    public _pTicks: HTMLSpanElement[];
    public _pUpdateInterval: number;
    public getInfo(): HTMLDivElement;
    public getTarget(): IRenderTarget;
    public setTarget(pRenderTarget: IRenderTarget): void;
    constructor(ui: any, options?: any, pRenderTarget?: IRenderTarget);
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
    tree: IUITree;
    /** readonly */ 
    source: IEntity;
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
  interface IUITree extends IUIComponent {
    getRootNode(): IUITreeNode;
    getSelectedNode(): IEntity;
    fromTree(pEntity: IEntity): void;
    sync(pEntity?: IEntity): void;
    select(pNode: IUITreeNode): boolean;
    selectByGuid(iGuid: number): void;
    isSelected(pNode: IUITreeNode): boolean;
    _link(pNode: IUITreeNode): void;
    _unlink(pNode: IUITreeNode): void;
    _createNode(pEntity: IEntity): IUITreeNode;
  }
}
declare module akra.ui {
  interface IUITreeNodeMap {
    [guid: number]: IUITreeNode;
  }
  class TreeNode implements IUITreeNode {
    public el: JQuery;
    public parent: IUITreeNode;
    public tree: IUITree;
    public source: IEntity;
    public expanded: boolean;
    public _pNodeMap: IUITreeNodeMap;
    public $childrenNode: JQuery;
    public getTotalChildren(): number;
    public getElement(): JQuery;
    /** Is this tree node currently selected? */
    public isSelected(): boolean;
    public setSelected(bValue: boolean): void;
    constructor(pTree: IUITree, pSource: IEntity);
    public expand(bValue?: boolean): void;
    public select(isSelect?: boolean): boolean;
    public getID(): string;
    public sync(bRecursive?: boolean): void;
    public synced(): void;
    public waitForSync(): void;
    public removeChildren(): void;
    public inChildren(pNode: IEntity): boolean;
    public sourceName(): string;
    public addChild(pNode: IUITreeNode): void;
    public destroy(): void;
  }
  class Tree extends Component implements IUITree {
    public _pNodeMap: IUITreeNodeMap;
    public _pRootNode: IUITreeNode;
    public _pSelectedNode: IUITreeNode;
    public fromTree(pEntity: IEntity): void;
    public getRootNode(): IUITreeNode;
    public getSelectedNode(): IEntity;
    constructor(ui: any, options?: any, eType?: EUIComponents);
    private _select(pNode);
    public select(pNode: IUITreeNode): boolean;
    public selectByGuid(iGuid: number): void;
    public isSelected(pNode: IUITreeNode): boolean;
    public finalizeRender(): void;
    public _createNode(pEntity: IEntity): IUITreeNode;
    public _link(pNode: IUITreeNode): void;
    public _unlink(pNode: IUITreeNode): void;
    public sync(pEntity?: IEntity): void;
  }
}
declare module akra.ui.scene {
  class CameraNode extends TreeNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class SceneObjectNode extends TreeNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class SceneModelNode extends SceneObjectNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class ShadowCasterNode extends TreeNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class JointNode extends TreeNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class LightPointNode extends TreeNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class ModelEntryNode extends TreeNode {
    constructor(pTree: IUITree, pSource: IEntity);
  }
  class SceneTree extends Tree {
    public _pScene: IScene3d;
    public _iUpdateTimer: number;
    public _pIDE: IUIIDE;
    public fromScene(pScene: IScene3d): void;
    public select(pNode: IUITreeNode): boolean;
    private updateTree(pScene, pSceneNode);
    public _createNode(pEntity: IEntity): IUITreeNode;
  }
}
declare module akra.ui.animation {
  class ColladaAnimation extends Component {
    public _pCollada: ICollada;
    public _iAnimation: number;
    public _pNameLb: IUILabel;
    public getAnimation(): IColladaAnimation;
    public getCollada(): ICollada;
    public getIndex(): number;
    constructor(parent: any, options?: any);
    public setAnimation(pCollada: ICollada, iAnimation: number): void;
    public _nameChanged(pLb: IUILabel, sName: string): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.resource {
  class Properties extends Component {
    public _pResource: IResourcePoolItem;
    public _pName: IUILabel;
    public _pColldaProperties: IUIComponent;
    public _pColladaAnimations: animation.ColladaAnimation[];
    public $colladaAnimations: JQuery;
    constructor(parent: any, options?: any);
    public setResource(pItem: IResourcePoolItem): void;
    public updateProperties(): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.animation {
  class ControllerProperties extends Component {
    public _pController: IAnimationController;
    public _pTotalAnimLabel: IUILabel;
    public _pActiveAnimation: IUILabel;
    public _pEditBtn: IUIButton;
    constructor(parent: any, options?: any);
    public _editController(pButton: IUIButton): void;
    public setController(pController: IAnimationController): void;
    private updateProperties();
    public finalizeRender(): void;
  }
}
declare module akra.ui {
  class Material extends Component {
    public _pMat: IMaterial;
    public _pName: IUILabel;
    public _pDiffuse: IUIVector;
    public _pAmbient: IUIVector;
    public _pSpecular: IUIVector;
    public _pEmissive: IUIVector;
    public _pShininess: IUILabel;
    constructor(parent: any, options?: any);
    public set(pMaterial: IMaterial): void;
    public _diffuseUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _ambientUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _specularUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _emissiveUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _shininessUpdated(pVec: IUILabel, sValue: string): void;
    private updateProperties();
    public finalizeRender(): void;
  }
}
declare module akra.ui.model {
  class MeshSubsetProperties extends Panel {
    public _pSubset: IMeshSubset;
    public _pName: IUILabel;
    public _pMaterial: Material;
    public _pVisible: IUISwitch;
    public _pShadows: IUISwitch;
    public _pBoundingBox: IUISwitch;
    public _pBoundingSphere: IUISwitch;
    public _pGuid: IUILabel;
    constructor(parent: any, options?: any);
    public _setVisible(pSwc: IUISwitch, bValue: boolean): void;
    public _useShadows(pSwc: IUISwitch, bValue: boolean): void;
    public _useBoundingBox(pSwc: IUISwitch, bValue: boolean): void;
    public _useBoundingSphere(pSwc: IUISwitch, bValue: boolean): void;
    public setSubset(pSubset: IMeshSubset): void;
    private updateProperties();
    public finalizeRender(): void;
  }
}
declare module akra.ui.model {
  class MeshProperties extends Component {
    public _pMesh: IMesh;
    public _pName: IUILabel;
    public _pShadows: IUISwitch;
    public _pBoundingBox: IUISwitch;
    public _pBoundingSphere: IUISwitch;
    public _pSubsets: MeshSubsetProperties[];
    constructor(parent: any, options?: any);
    public _useShadows(pSwc: IUISwitch, bValue: boolean): void;
    public _useBoundingBox(pSwc: IUISwitch, bValue: boolean): void;
    public _useBoundingSphere(pSwc: IUISwitch, bValue: boolean): void;
    public setMesh(pMesh: IMesh): void;
    public updateProperties(): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.light {
  class Properties extends Component {
    public _pLight: ILightPoint;
    public _pEnabled: IUISwitch;
    public _pShadows: IUISwitch;
    public _pAmbient: IUIVector;
    public _pDiffuse: IUIVector;
    public _pSpecular: IUIVector;
    public _pAttenuation: IUIVector;
    constructor(parent: any, options?: any);
    public _ambientUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _diffuseUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _specularUpdated(pVec: IUIVector, pValue: IVec4): void;
    public _attenuationUpdated(pVec: IUIVector, pValue: IVec3): void;
    public _useShadows(pSwc: IUISwitch, bValue: boolean): void;
    public _enableLight(pSwc: IUISwitch, bValue: boolean): void;
    public setLight(pLight: ILightPoint): void;
    public updateProperties(): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.scene {
  class Model extends Component {
    public _pModel: ISceneModel;
    public _pVisible: IUISwitch;
    constructor(parent: any, options?: any);
    public _changeVisibility(pSwc: IUISwitch, bValue: boolean): void;
    public setModel(pModel: ISceneModel): void;
    public updateProperties(): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.animation {
  class NodeProperties extends Component {
    public _pNameLb: IUILabel;
    constructor(parent: any, options?: any);
    public setNode(pNode: IUIAnimationNode): void;
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
  interface IUIGraphConnector extends IUIComponent {
    getRoute(): IUIGraphRoute;
    setRoute(pValue: IUIGraphRoute): void;
    getOrient(): EGraphConnectorOrient;
    setOrient(eValue: EGraphConnectorOrient): void;
    getArea(): IUIGraphConnectionArea;
    getNode(): IUIGraphNode;
    getGraph(): IUIGraph;
    getDirection(): EUIGraphDirections;
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
    sendEvent(e: IUIGraphEvent): void;
    activated: ISignal<(pConnector: IUIGraphConnector, bValue: boolean) => void>;
    connected: ISignal<(pConnector: IUIGraphConnector, pTarget: IUIGraphConnector) => void>;
    routeBreaked: ISignal<(pConnector: IUIGraphConnector, pRoute: IUIGraphRoute) => void>;
  }
}
declare module akra {
  interface IUIGraphRoute {
    getPath(): RaphaelPath;
    setPath(pPath: RaphaelPath): void;
    getLeft(): IUIGraphConnector;
    setLeft(pConnector: IUIGraphConnector): void;
    getRight(): IUIGraphConnector;
    setRight(pConnector: IUIGraphConnector): void;
    getColor(): IColor;
    isEnabled(): boolean;
    setEnabled(bValue: boolean): void;
    isConnectedWithNode(pNode: IUIGraphNode): boolean;
    isConnectedWith(pConnector: IUIGraphConnector): boolean;
    isBridge(): boolean;
    sendEvent(e: IUIGraphEvent): void;
    detach(): void;
    isActive(): boolean;
    activate(bValue?: boolean): void;
    remove(bRecirsive?: boolean): void;
    destroy(): void;
    routing(): void;
  }
  interface IUITempGraphRoute extends IUIGraphRoute {
    routing(pRight?: IPoint): void;
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
    traversedRoutes: IUIGraphRoute[];
  }
  interface IUIGraph extends IUIComponent {
    getGraphType(): EUIGraphTypes;
    getNodes(): IUIGraphNode[];
    getCanvas(): RaphaelPaper;
    createRouteFrom(pConnector: IUIGraphConnector): void;
    removeTempRoute(): void;
    connectTo(pConnector: IUIGraphConnector): void;
    isReadyForConnect(): boolean;
    connectionBegin: ISignal<(pGraph: IUIGraph, pRoute: IUIGraphRoute) => void>;
    connectionEnd: ISignal<(pGraph: IUIGraph) => void>;
  }
}
declare module akra {
  interface IUIConnectionAreaOptions extends IUIComponentOptions {
    maxConnections?: number;
    maxInConnections?: number;
    maxOutConnections?: number;
  }
  interface IUIGraphConnectionArea extends IUIPanel {
    getConnectors(): IUIGraphConnector[];
    getNode(): IUIGraphNode;
    setMaxInConnections(nValue: number): void;
    setMaxOutConnections(nValue: number): void;
    setMaxConnections(nValue: number): void;
    connectorsCount(eDir?: EUIGraphDirections): number;
    findRoute(pNode: IUIGraphNode): IUIGraphRoute;
    setMode(iMode: number): void;
    isSupportsIncoming(): boolean;
    isSupportsOutgoing(): boolean;
    hasConnections(): boolean;
    prepareForConnect(): IUIGraphConnector;
    routing(): void;
    activate(bValue?: boolean): void;
    isActive(): boolean;
    sendEvent(e: IUIGraphEvent): void;
    connected: ISignal<(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector) => void>;
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
    [name: string]: IUIGraphConnectionArea;
  }
  interface IUIGraphNode extends IUIComponent {
    getGraphNodeType(): EUIGraphNodes;
    getGraph(): IUIGraph;
    getAreas(): IGraphNodeAreaMap;
    getOutputConnector(): IUIGraphConnector;
    getInputConnector(): IUIGraphConnector;
    findRoute(pNode: IUIGraphNode): IUIGraphRoute;
    isConnectedWith(pNode: IUIGraphNode): boolean;
    activate(bState?: boolean): void;
    isActive(): boolean;
    isSuitable(): boolean;
    sendEvent(e: IUIGraphEvent): void;
    highlight(bValue?: boolean): any;
    canAcceptConnect(): boolean;
    routing(): void;
    beforeDestroy: ISignal<(pNode: IUIGraphNode) => void>;
    selected: ISignal<(pNode: IUIGraphNode, bModified: boolean) => void>;
  }
}
declare module akra {
  interface IUIAnimationNode extends IUIGraphNode {
    getAnimation(): IAnimationBase;
    setAnimation(pAnimation: IAnimationBase): void;
  }
}
declare module akra {
  interface IUIAnimationMask extends IUIAnimationNode {
    getMask(): IMap<number>;
  }
}
declare module akra.ui.animation {
  class MaskProperties extends Component {
    public _pNode: IUIAnimationMask;
    public _pMask: IMap<number>;
    constructor(parent: any, options?: any);
    public setMask(pNode: IUIAnimationMask): void;
    public _changed(pSlider: IUISlider, fValue: number): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.animation {
  class Controller extends Component {
    public edit: ISignal<(pController: IUIComponent) => void>;
    public remove: ISignal<(pController: IUIComponent) => void>;
    public _pController: IAnimationController;
    public _pNameLb: IUILabel;
    public _pEditBtn: IUIButton;
    public _pRemoveBtn: IUIButton;
    public setController(pController: IAnimationController): void;
    public getController(): IAnimationController;
    constructor(parent: any, options?: any);
    public setupSignals(): void;
    public _nameChanged(pLb: IUILabel, sName: string): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.camera {
  class Events extends Component {
    public _pCamera: ICamera;
    public _pPreRenderEvtBtn: IUIButton;
    public _pPostRenderEvtBtn: IUIButton;
    public _pLookThrough: IUIButton;
    constructor(parent: any, options?: any);
    public _lookThrough(pBtn: IUIButton): void;
    public _editPreRenderEvent(pBtn: IUIButton, e: IUIEvent): void;
    public _editPostRenderEvent(pBtn: IUIButton, e: IUIEvent): void;
    public setCamera(pCamera: ICamera): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.scene {
  class Events extends Component {
    public _pScene: IScene;
    public _pPreUpdateEvtBtn: IUIButton;
    public _pPostUpdateEvtBtn: IUIButton;
    public _pBeforeUpdateEvtBtn: IUIButton;
    constructor(parent: any, options?: any);
    public _editPreUpdateEvent(pBtn: IUIButton, e: IUIEvent): void;
    public _editPostUpdateEvent(pBtn: IUIButton, e: IUIEvent): void;
    public _editBeforeUpdateEvent(pBtn: IUIButton, e: IUIEvent): void;
    public setScene(pScene: IScene): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui {
  class Inspector extends Component {
    public _pSceneEvents: scene.Events;
    public _pNode: ISceneNode;
    public _pNameLabel: IUILabel;
    public _pPosition: IUIVector;
    public _pWorldPosition: IUIVector;
    public _pRotation: IUIVector;
    public _pScale: IUIVector;
    public _pInheritance: IUICheckboxList;
    public _pAddControllerBtn: IUIButton;
    public _pControllers: animation.Controller[];
    public _nTotalVisibleControllers: number;
    public _bControllerVisible: boolean;
    public _pResource: resource.Properties;
    public _pController: animation.ControllerProperties;
    public _pMesh: model.MeshProperties;
    public _pSceneModel: scene.Model;
    public _pLight: light.Properties;
    public _pCameraEvents: camera.Events;
    public _pAnimationNodeProperties: animation.NodeProperties;
    public _pAnimationMaskProperties: animation.MaskProperties;
    constructor(parent: any, options?: any);
    public setupSignals(): void;
    private getControllerUI();
    private hideAllControllersUI();
    public _addController(pBtn: IUIButton): void;
    public _removeController(pControllerUI: animation.Controller): void;
    public _editCintroller(pControllerUI: animation.Controller): void;
    public _updateName(pLabel: IUILabel, sName: string): void;
    public _updateInheritance(pCheckboxList: IUICheckboxList, pCheckbox: IUICheckbox): void;
    public _updateRotation(pVector: IUIVector, pRotation: IVec3): void;
    public _updateScale(pVector: IUIVector, pScale: IVec3): void;
    public _updateLocalPosition(pVector: IUIVector, pPos: IVec3): void;
    public finalizeRender(): void;
    public _scenePostUpdated(pScene: IScene3d): void;
    private updateProperties();
    public inspectAnimationNode(pNode: IUIAnimationNode): void;
    public inspectAnimationController(pController: IAnimationController): void;
    public inspectNode(pNode: ISceneNode): void;
    public nodeNameChanged: ISignal<(pInspector: IUIComponent, pNode: ISceneNode) => void>;
  }
}
declare module akra.ui {
  class ViewportProperties extends Component {
    public _pViewport: IViewport;
    public _pStats: IUIRenderTargetStats;
    public _pFullscreenBtn: IUIButton;
    public _pResolutionCbl: IUICheckboxList;
    public _pFXAASwh: IUISwitch;
    public _pSkyboxLb: IUILabel;
    public _pScreenshotBtn: IUIButton;
    public _pLookAtBtn: IUIButton;
    constructor(parent: any, options?: any);
    public _fullscreen(): void;
    public _screenshot(): void;
    private setupFileDropping();
    public _fxaaChanged(pSw: IUISwitch, bValue: boolean): void;
    public _previewResChanged(pCbl: IUICheckboxList, pCb: IUICheckbox): void;
    public setViewport(pViewport: IViewport): void;
    public _addedSkybox(pViewport: IViewport, pSkyTexture: ITexture): void;
    public getRenderer(): IRenderer;
    public getEngine(): IEngine;
    public getComposer(): IAFXComposer;
    public getCanvas(): ICanvas3d;
    public getCanvasElement(): HTMLCanvasElement;
    public getViewport(): IViewport;
    public finalizeRender(): void;
  }
}
declare module akra {
  interface IUICodeEditorOptions extends IUIComponentOptions {
    code?: string;
  }
  interface IUICodeEditor extends IUIComponent {
    getCodeMirror(): CodeMirrorEditor;
    getValue(): string;
    setValue(sValue: string): void;
  }
}
declare module akra {
  interface IUIListenerEditor extends IUIPanel {
    editor: IUICodeEditor;
    bindEvent: ISignal<(pEditor: IUIListenerEditor, sCode: string) => void>;
  }
}
declare module akra.ui {
  class CodeEditor extends Component implements IUICodeEditor {
    public getValue(): string;
    public setValue(sValue: string): void;
    private codemirror;
    constructor(parent: any, options: any);
    public getCodeMirror(): CodeMirrorEditor;
    public finalizeRendere(): void;
  }
}
declare module akra.ui.graph {
  class ListenerEditor extends Panel implements IUIListenerEditor {
    public bindEvent: ISignal<(pEditor: IUIListenerEditor, sCode: string) => void>;
    public editor: IUICodeEditor;
    public _pBindBtn: IUIButton;
    constructor(parent: any, options?: any);
    public setupSignals(): void;
    public _bindEvent(pBtn: IUIButton): void;
    public finalizeRender(): void;
  }
}
declare module akra {
  interface IUIGraphControls extends IUIPanel {
    getGraph(): IUIGraph;
  }
}
declare module akra {
  interface IUIAnimationGraph extends IUIGraph {
    nodeSelected: ISignal<(pGraph: IUIAnimationGraph, pNode: IUIAnimationNode, bPlay: boolean) => void>;
    getController(): IAnimationController;
    selectNode(pNode: IUIAnimationNode, bModified?: boolean): void;
    capture(pController: IAnimationController): boolean;
    addAnimation(pAnimation: IAnimationBase): void;
    removeAnimation(pAnimation: IAnimationBase): any;
    removeAnimation(sAnimation: string): any;
    removeAnimation(iAnimation: number): any;
    findNodeByAnimation(sName: string): IUIAnimationNode;
    findNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;
    createNodeByController(pController: IAnimationController): void;
    createNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;
  }
}
declare module akra {
  interface IUIAnimationControls extends IUIGraphControls {
    /** readonly */ 
    graph: IUIAnimationGraph;
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
  interface IUIIDE extends IUIComponent {
    _apiEntry: any;
    getSelectedObject(): ISceneObject;
    getEngine(): IEngine;
    getResourceManager(): IResourcePoolManager;
    getScene(): IScene3d;
    getViewport(): IViewport;
    getCamera(): ICamera;
    getCanvas(): ICanvas3d;
    cmd(eCommand: ECMD, ...argv: any[]): boolean;
    created: ISignal<(pIDE: IUIIDE) => void>;
  }
}
declare module akra.ui {
  var ide: IUIIDE;
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
  class IDE extends Component implements IUIIDE {
    public created: ISignal<(pIDE: IUIIDE) => void>;
    public _fnMainScript: Function;
    public _pEngine: IEngine;
    public _pSceneTree: scene.SceneTree;
    public _pInspector: Inspector;
    public _pPreview: ViewportProperties;
    public _pTabs: IUITabs;
    public _pColladaDialog: IUIPopup;
    public _p3DControls: IUICheckboxList;
    public _pSelectedObject: IRIDPair;
    public _eEditMode: EEditModes;
    public _pModelBasisTrans: IModelEntry;
    public _apiEntry: any;
    public getScript(): Function;
    public setScript(fn: Function): void;
    public getSelectedObject(): ISceneObject;
    public getSelectedRenderable(): IRenderableObject;
    public getEditMode(): EEditModes;
    constructor(parent: any, options?: any);
    public setupSignals(): void;
    public _enablePickMode(pCb: IUICheckbox, bValue: boolean): void;
    public _enableTranslateMode(pCb: IUICheckbox, bValue: boolean): void;
    public _enableRotateMode(pCb: IUICheckbox, bValue: boolean): void;
    public _enableScaleMode(pCb: IUICheckbox, bValue: boolean): void;
    public _sceneUpdate(pScene: IScene3d): void;
    public setupApiEntry(): void;
    public getEngine(): IEngine;
    public getCanvas(): ICanvas3d;
    public getScene(): IScene3d;
    public getCanvasElement(): HTMLCanvasElement;
    public getResourceManager(): IResourcePoolManager;
    public getViewport(): IViewport;
    public getCamera(): ICamera;
    public getComposer(): IAFXComposer;
    public _updateSceneNodeName(pInspector: Inspector, pNode: ISceneNode): void;
    public _viewportAdded(pTarget: IRenderTarget, pViewport: IViewport): void;
    private updateEditting(pObjectPrev?, pRenderablePrev?);
    private selected(pObj, pRenderable?);
    public cmd(eCommand: ECMD, ...argv: any[]): boolean;
    public saveScreenshot(): boolean;
    public changeCamera(pCamera: ICamera): boolean;
    public setPreviewResolution(iWidth: number, iHeight: number): boolean;
    public setFullscreen(): boolean;
    public inspectNode(pNode: ISceneNode): boolean;
    public inspectAnimationController(pController: IAnimationController): boolean;
    public editAnimationController(pController: IAnimationController): boolean;
    public inspectAnimationNode(pNode: IUIAnimationNode): boolean;
    public changeAntiAliasing(bValue: boolean): boolean;
    public loadColladaModel(): boolean;
    public editMainScript(): boolean;
    public editEvent(pTarget: IEventProvider, sEvent: string, iListener?: number, eType?: EEventTypes): boolean;
  }
}
declare module akra.ui.graph {
  class Route implements IUIGraphRoute {
    /** Route left address */
    public _pLeft: IUIGraphConnector;
    /** Route right address */
    public _pRight: IUIGraphConnector;
    /** Route status. */
    public _bActive: boolean;
    public _bHighlighted: boolean;
    public _bEnabled: boolean;
    /** Route domain */
    public _pPath: RaphaelPath;
    public _pArrow: RaphaelPath;
    public _pColor: IColor;
    public _pInactiveColor: IColor;
    public _fWeight: number;
    public _fMaxWeight: number;
    public getInactiveColor(): IColor;
    public getColor(): IColor;
    public getLeft(): IUIGraphConnector;
    public getRight(): IUIGraphConnector;
    public getWeight(): number;
    public setLeft(pConnector: IUIGraphConnector): void;
    public setRight(pConnector: IUIGraphConnector): void;
    public getArrow(): RaphaelPath;
    public setArrow(pPath: RaphaelPath): void;
    public setWeight(fWeight: number): void;
    public getPath(): RaphaelPath;
    public getCanvas(): RaphaelPaper;
    public setPath(pPath: RaphaelPath): void;
    public isEnabled(): boolean;
    public setEnabled(b: boolean): void;
    constructor(pLeft: IUIGraphConnector, pRight: IUIGraphConnector);
    public isConnectedWithNode(pNode: IUIGraphNode): boolean;
    public isConnectedWith(pConnector: IUIGraphConnector): boolean;
    public isBridge(): boolean;
    public isActive(): boolean;
    public detach(): void;
    public remove(bRecirsive?: boolean): void;
    public sendEvent(e: IUIGraphEvent): void;
    public destroy(): void;
    public activate(bValue?: boolean): void;
    public routing(): void;
    public drawRoute(pFrom: IPoint, pTo: IPoint, eFromOr?: EGraphConnectorOrient, eToOr?: EGraphConnectorOrient): void;
    static calcPosition(pConnector: IUIGraphConnector): IPoint;
  }
  class TempRoute extends Route implements IUITempGraphRoute {
    constructor(pLeft: IUIGraphConnector);
    public routing(pRight?: IPoint): void;
  }
}
declare module akra.ui.graph {
  class Graph extends Component implements IUIGraph {
    public _eGraphType: EUIGraphTypes;
    public _pCanvas: RaphaelPaper;
    public _pTempRoute: IUITempGraphRoute;
    public $svg: JQuery;
    public getNodes(): IUIGraphNode[];
    public getTempRoute(): IUITempGraphRoute;
    public getGraphType(): EUIGraphTypes;
    public getCanvas(): RaphaelPaper;
    constructor(parent: any, options?: any, eType?: EUIGraphTypes);
    public setupSignals(): void;
    public createRouteFrom(pFrom: IUIGraphConnector): void;
    public removeTempRoute(): void;
    public isReadyForConnect(): boolean;
    public connectTo(pTo: IUIGraphConnector): void;
    public finalizeRender(): void;
    public connectionBegin: ISignal<(pGraph: IUIGraph, pRoute: IUIGraphRoute) => void>;
    public connectionEnd: ISignal<(pGraph: IUIGraph) => void>;
    static KeydownSignal: typeof Signal;
    static MousemoveSignal: typeof Signal;
    static MouseupSignal: typeof Signal;
    static ClickSignal: typeof Signal;
    static event(eType: EUIGraphEvents): IUIGraphEvent;
  }
}
declare module akra.ui.graph {
  class Connector extends Component implements IUIGraphConnector {
    public _eOrient: EGraphConnectorOrient;
    public _eDirect: EUIGraphDirections;
    public _bActive: boolean;
    public _pRoute: IUIGraphRoute;
    public getOrient(): EGraphConnectorOrient;
    public getArea(): IUIGraphConnectionArea;
    public getNode(): IUIGraphNode;
    public getGraph(): IUIGraph;
    public getRoute(): IUIGraphRoute;
    public getDirection(): EUIGraphDirections;
    public setOrient(e: EGraphConnectorOrient): void;
    public setRoute(pRoute: IUIGraphRoute): void;
    constructor(parent: any, options?: any);
    public setupSignals(): void;
    public hasRoute(): boolean;
    public finalizeRender(): void;
    public isConnected(): boolean;
    public isActive(): boolean;
    public activate(bValue?: boolean): void;
    public sendEvent(e: IUIGraphEvent): void;
    public input(): boolean;
    public output(): boolean;
    public highlight(bToggle?: boolean): void;
    public routing(): void;
    public activated: ISignal<(pConnector: IUIGraphConnector, bValue: boolean) => void>;
    public connected: ISignal<(pConnector: IUIGraphConnector, pTarget: IUIGraphConnector) => void>;
    public routeBreaked: ISignal<(pConnector: IUIGraphConnector, pRoute: IUIGraphRoute) => void>;
    static UIGRAPH_INVALID_CONNECTION: number;
    static ConnectedSignal: typeof Signal;
    static MousedownSignal: typeof Signal;
    static MouseupSignal: typeof Signal;
  }
}
declare module akra.ui.graph {
  class ConnectionArea extends Panel implements IUIGraphConnectionArea {
    public _iMode: number;
    public _pConnectors: IUIGraphConnector[];
    public _pTempConnect: IUIGraphConnector;
    public _iConnectionLimit: number;
    public _iInConnectionLimit: number;
    public _iOutConnectionLimit: number;
    public _eConectorOrient: EGraphConnectorOrient;
    public getConnectors(): IUIGraphConnector[];
    public getNode(): IUIGraphNode;
    public getGraph(): IUIGraph;
    public setMaxInConnections(n: number): void;
    public setMaxOutConnections(n: number): void;
    public setMaxConnections(n: number): void;
    constructor(parent: any, options?: IUIConnectionAreaOptions, eType?: EUIComponents);
    public setupSignals(): void;
    public attachToParent(pParent: IUIGraphNode): boolean;
    public _createdFrom($comp: JQuery): void;
    public findRoute(pNode: IUIGraphNode): IUIGraphRoute;
    public connectorsCount(eDir?: EUIGraphDirections): number;
    public setMode(iMode: number): void;
    public isSupportsIncoming(): boolean;
    public isSupportsOutgoing(): boolean;
    public isLimitReached(): boolean;
    public hasConnections(): boolean;
    public isActive(): boolean;
    public activate(bValue?: boolean): void;
    public sendEvent(e: IUIGraphEvent): void;
    public prepareForConnect(): IUIGraphConnector;
    public _onNodeMouseover(pNode: IUIGraphNode, e: IUIEvent): void;
    private onConnection(pConnector, pTarget);
    private destroyTempConnect();
    public _onNodeMouseout(pNode: IUIGraphNode, e: IUIEvent): void;
    public routing(): void;
    public finalizeRender(): void;
    public connected: ISignal<(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector) => void>;
  }
  function isConnectionArea(pEntity: IEntity): boolean;
}
declare module akra.ui.graph {
  class Node extends Component implements IUIGraphNode {
    public _eGraphNodeType: EUIGraphNodes;
    public _isActive: boolean;
    public _pAreas: IGraphNodeAreaMap;
    public _isSuitable: boolean;
    public getGraphNodeType(): EUIGraphNodes;
    public getGraph(): IUIGraph;
    public getAreas(): IGraphNodeAreaMap;
    constructor(pGraph: IUIGraph, options?: any, eType?: EUIGraphNodes, $el?: JQuery);
    public setupSignals(): void;
    public getOutputConnector(): IUIGraphConnector;
    public getInputConnector(): IUIGraphConnector;
    public onConnectionEnd(pGraph: IUIGraph): void;
    public onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void;
    public linkAreas(): void;
    public isSuitable(): boolean;
    public findRoute(pNode: IUIGraphNode): IUIGraphRoute;
    public isConnectedWith(pNode: IUIGraphNode): boolean;
    public canAcceptConnect(): boolean;
    public finalizeRender(): void;
    public activate(bValue?: boolean): void;
    public isActive(): boolean;
    public init(): void;
    public addConnectionArea(sName: string, pArea: IUIGraphConnectionArea): void;
    public connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void;
    public sendEvent(e: IUIGraphEvent): void;
    public highlight(bValue?: boolean): void;
    public routing(): void;
    public beforeDestroy: ISignal<(pNode: IUIGraphNode) => void>;
    public selected: ISignal<(pNode: IUIGraphNode, bModified: boolean) => void>;
    static MouseenterSignal: typeof Signal;
    static MouseleaveSignal: typeof Signal;
    static ClickSignal: typeof Signal;
    static MoveSignal: typeof Signal;
    static DbclickSignal: typeof Signal;
  }
}
declare module akra.ui.graph {
  class Controls extends Panel implements IUIGraphControls {
    public controls: IUIComponent;
    public graph: IUIGraph;
    public getGraph(): IUIGraph;
    constructor(parent: any, options?: any, pGraph?: IUIGraph);
    public createNode(): IUIGraphNode;
    public finalizeRender(): void;
  }
}
declare module akra {
  interface IUIAnimationData extends IUIAnimationNode {
  }
}
declare module akra.ui.animation {
  class Node extends graph.Node implements IUIAnimationNode {
    constructor(parent: any, options?: any, eType?: EUIGraphNodes);
    public attachToParent(pParent: IUIAnimationGraph): boolean;
    public _selected(pGraph: IUIAnimationGraph, pNode: IUIAnimationNode, bPlay: boolean): void;
    public getAnimation(): IAnimationBase;
    public setAnimation(pAnimation: IAnimationBase): void;
    public getGraph(): IUIAnimationGraph;
    public connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void;
  }
}
declare module akra.ui.animation {
  class Data extends Node implements IUIAnimationData {
    private _pAnimation;
    public getAnimation(): IAnimation;
    public setAnimation(pAnim: IAnimation): void;
    constructor(pGraph: IUIGraph, pAnim?: IAnimation);
    public finalizeRender(): void;
  }
}
declare module akra {
  interface IUIAnimationPlayer extends IUIAnimationNode {
  }
}
declare module akra.ui.animation {
  class Player extends Node implements IUIAnimationPlayer {
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
    public getAnimation(): IAnimationBase;
    public setAnimation(pAnim: IAnimationBase): void;
    constructor(pGraph: IUIGraph, pContainer?: IAnimationContainer);
    public connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void;
    public onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void;
    public setup(): void;
    public _enabled(pSwc: IUISwitch, bValue: boolean): void;
    private notifyDisabled(bValue);
    public _setLeftInf(pCheckbox: IUICheckbox, bValue: boolean): void;
    public _setRightInf(pCheckbox: IUICheckbox, bValue: boolean): void;
    public _reverse(pCheckbox: IUICheckbox, bValue: boolean): void;
    public _useLoop(pCheckbox: IUICheckbox, bValue: boolean): void;
    public _pause(pCheckbox: IUICheckbox, bValue: boolean): void;
    public _play(pCheckbox: IUICheckbox, bValue: boolean): void;
    public _setTime(pSlider: IUISlider, fValue: number): void;
    public _setName(pLabel: IUILabel, sName: any): void;
    public _setSpeed(pLabel: IUILabel, x: any): void;
    public _durationUpdated(pContainer: IAnimationContainer, fDuration: number): void;
    public _enterFrame(pContainer: IAnimationContainer, fRealTime: number, fTime: number): void;
    public finalizeRender(): void;
  }
}
declare module akra {
  interface IUIAnimationBlender extends IUIAnimationNode {
    getTotalMasks(): number;
    getMaskNode(iAnim: number): IUIAnimationMask;
    setMaskNode(iAnim: number, pNode: IUIAnimationMask): void;
    setup(): void;
  }
}
declare module akra {
  interface IUISlider extends IUIComponent {
    getPin(): IUIComponent;
    getValue(): number;
    setValue(fValue: number): void;
    getRange(): number;
    setRange(fRange: number): void;
    getText(): string;
    setText(sValue: string): void;
    updated: ISignal<(pSlider: IUISlider, fValue: number) => void>;
  }
}
declare module akra.ui.animation {
  class Mask extends Node implements IUIAnimationMask {
    private _pAnimation;
    private _pMask;
    private _pSliders;
    private _pEditBtn;
    private _pEditPanel;
    public getAnimation(): IAnimationBase;
    public setAnimation(pAnim: IAnimationBase): void;
    constructor(pGraph: IUIGraph, pMask?: IMap<number>);
    public finalizeRender(): void;
    public getMask(): IMap<number>;
    static isMaskNode(pNode: IUIAnimationNode): boolean;
  }
}
declare module akra.ui.animation {
  interface IBlenderSliderContainer {
    slider: IUISlider;
    animation: IAnimationBase;
  }
  class Blender extends Node implements IUIAnimationBlender {
    private _pBlend;
    private _pSliders;
    private _pNameLabel;
    private _pMaskNodes;
    public $time: JQuery;
    public getAnimation(): IAnimationBase;
    public getTotalMasks(): number;
    constructor(pGraph: IUIGraph, pBlender?: IAnimationBlend);
    public onConnectionBegin(pGraph: IUIGraph, pRoute: IUIGraphRoute): void;
    public _textChanged(pLabel: IUILabel, sValue: string): void;
    public destroy(): void;
    public getMaskNode(iAnimation: number): IUIAnimationMask;
    public setMaskNode(iAnimation: number, pNode: IUIAnimationMask): void;
    public setup(): void;
    public _weightUpdated(pBlend: IAnimationBlend, iAnim: number, fWeight: number): void;
    public _durationUpdated(pBlend: IAnimationBlend, fDuration: number): void;
    public connected(pArea: IUIGraphConnectionArea, pFrom: IUIGraphConnector, pTo: IUIGraphConnector): void;
    public finalizeRender(): void;
  }
}
declare module akra.ui.animation {
  class Controls extends graph.Controls implements IUIAnimationControls {
    public graph: IUIAnimationGraph;
    constructor(parent: any, options?: any);
    public createData(): IUIAnimationNode;
    public createPlayer(): IUIAnimationNode;
    public createBlender(): IUIAnimationNode;
    public createMask(): IUIAnimationNode;
    public createExporter(): exchange.Exporter;
    public exportBinController(): void;
    public exportController(): void;
  }
}
declare module akra.ui.animation {
  class Graph extends graph.Graph implements IUIAnimationGraph {
    public nodeSelected: ISignal<(pGraph: IUIAnimationGraph, pNode: IUIAnimationNode, bPlay: boolean) => void>;
    private _pSelectedNode;
    private _pAnimationController;
    constructor(parent: any, options: any);
    public setupSignals(): void;
    private setupFileDropping();
    public getController(): IAnimationController;
    public selectNode(pNode: IUIAnimationNode, bModified?: boolean): void;
    public addAnimation(pAnimation: IAnimationBase): void;
    public removeAnimation(pAnimation: IAnimationBase): void;
    public removeAnimation(sAnimation: string): void;
    public removeAnimation(iAnimation: number): void;
    public findNodeByAnimation(sName: string): IUIAnimationNode;
    public findNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;
    public createNodeByController(pController: IAnimationController): void;
    public createNodeByAnimation(pAnimation: IAnimationBase): IUIAnimationNode;
    public capture(pController: IAnimationController): boolean;
    private animationAdded(pController, pAnimation);
    private onControllerPlay(pController, pAnimation);
    public addChild(pChild: IEntity): IEntity;
    public finalizeRender(): void;
    static DropSignal: typeof Signal;
  }
}
declare module akra.ui {
  class UI implements IUI {
    public guid: number;
    private _sUIName;
    public getName(): string;
    public _pManager: ISceneManager;
    public getType(): ESceneTypes;
    constructor(pManager?: ISceneManager);
    public setupSignals(): void;
    public getManager(): ISceneManager;
    public createHTMLNode(pElement: HTMLElement): IUIHTMLNode;
    public createDNDNode(pElement: HTMLElement): IUIDNDNode;
    public createComponent(sType: string, pOptions?: IUIComponentOptions): IUIComponent;
    public createLayout(eType?: EUILayouts, pAttrs?: IUILayoutAttributes): IUILayout;
    public createLayout(sType?: string, pAttrs?: IUILayoutAttributes): IUILayout;
  }
  function createUI(pManager?: ISceneManager): IUI;
}
