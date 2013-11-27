// AIUIComponent interface
// [write description here...]

/// <reference path="AIUIDNDNode.ts" />

interface AIUIComponentType {
    new (...argv: any[]): AIUIComponent;
}

interface AIUIComponentOptions {
    show?: boolean;
    name?: string;
    html?: string;
    css?: any;
    class?: string;
    width?: uint;
    height?: uint;
    draggable?: boolean;
    //string, jQuery/HTMLElement or AIUIHTMLNode
    renderTo?: any;
    //string like parent/window/document or array [x, y, w, h]
    dragZone?: any;

    generic?: string;

    //string/AEUILayouts/Layout
    layout?: any;
    //string, string[]
    events?: any;
    parent?: AIUIComponent;
    template?: string;
}

enum AEUIComponents {
    UNKNOWN,

    WINDOW,

    BUTTON,
    SWITCH,
    PANEL,
    POPUP,
    TABS,
    LABEL,
    VECTOR,
    MENU,
    TREE,
    TREE_NODE,
    CANVAS,
    SLIDER,
    CHECKBOX,
    CHECKBOX_LIST,
    VIEWPORT_STATS,

    CODE_EDITOR,
    // LISTENER_EDITOR,

    COLLADA_ANIMATION,

    GRAPH,
    GRAPH_NODE,
    GRAPH_CONNECTOR,
    GRAPH_CONTROLS,
    GRAPH_CONNECTIONAREA
}

interface AIUIComponent extends AIUIDNDNode {
    /** readonly */ componentType: AEUIComponents;
    /** readonly */ genericType: string;

    /** readonly */ layout: AIUILayout;

    isGeneric(): boolean;

    setLayout(eType: AEUILayouts): boolean;
    setLayout(sType: string): boolean;

    createComponent(sType: string, pOptions?: AIUIComponentOptions): AIUIComponent;

    _createdFrom($component: JQuery): void;

    template(sURL: string, pData?: any): void;
    fromStringTemplate(sTpl: string, pData?: any): void;
}


