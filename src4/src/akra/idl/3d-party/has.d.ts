interface has {
    (str: string): boolean;
    add(key: string, value?: boolean): void;
    //add(key: string, cond?: (global: Window, document: Document, anElement: Element) => boolean): void;
}

declare var has: has;