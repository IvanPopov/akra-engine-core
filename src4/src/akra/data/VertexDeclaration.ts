/// <reference path="../idl/AIVertexDeclaration.ts" />

import VertexElement = require("data/VertexElement");
import logger = require("logger");
import limit = require("limit");
import Usage = require("data/Usage");



class VertexDeclaration implements AIVertexDeclaration {
    ///** readonly */ property for public usage
    stride: uint = 0;

    private _pElements: AIVertexElement[] = [];

    /** inline */ get length(): uint {
        return this._pElements.length;
    }

    //FIXME: typescript error "Overload signature is not compatible with function definition" ???
    constructor(...pElements: AIVertexElementInterface[]);
    constructor(pElements: AIVertexElementInterface[]);
    constructor(pElements: any) {
        if (arguments.length > 0 && isDefAndNotNull(pElements)) {
            this.append.apply(this, arguments);
        }
    }

    /** inline */ element(i: uint): AIVertexElement {
        return this._pElements[i] || null;
    }

    append(...pElements: AIVertexElementInterface[]): boolean;
    append(pElements: AIVertexElementInterface[]): boolean;
    append(pData: any) {
        var pElements: AIVertexElementInterface[];

        if (!isArray(arguments[0])) {
            pElements = <AIVertexElementInterface[]><any>arguments;
        }
        else {
            pElements = <AIVertexElementInterface[]><any>arguments[0];
        }

        for (var i: int = 0; i < pElements.length; i++) {
            var pElement: AIVertexElementInterface = pElements[i];
            var iOffset: uint;

            if (VertexElement.hasUnknownOffset(pElement)) {
                //add element to end
                iOffset = this.stride;
            }
            else {
                iOffset = pElement.offset;
            }

            var pVertexElement: AIVertexElement = new VertexElement(
                pElement.count,
                pElement.type,
                pElement.usage,
                iOffset);

            this._pElements.push(pVertexElement);

            var iStride: uint = iOffset + pVertexElement.size;

            if (this.stride < iStride) {
                this.stride = iStride;
            }
        }

        return this._update();
    }

    _update(): boolean {
        var iStride: int;

        for (var i: int = 0; i < this.length; ++i) {
            //move "END" element to end of declaration
            if (this._pElements[i].usage === Usage.END) {
                this._pElements.swap(i, i + 1);
            }

            //recalc total stride
            iStride = this._pElements[i].size + this._pElements[i].offset;

            if (this.stride < iStride) {
                this.stride = iStride
				}
        }

        var pLast: AIVertexElement = this._pElements.last;

        if (pLast.usage === Usage.END && pLast.offset < this.stride) {
            pLast.offset = this.stride;
        }

        return true;
    }



    extend(decl: AIVertexDeclaration): boolean {
        var pDecl: VertexDeclaration = <VertexDeclaration>decl;
        var pElement: AIVertexElement;

        for (var i = 0; i < this.length; ++i) {
            for (var j = 0; j < pDecl.length; ++j) {
                if (pDecl.element(j).usage == this._pElements[i].usage) {
                    logger.log('inconsistent declarations:', this, pDecl);
                    //'The attempt to combine the declaration containing the exact same semantics.'
                    return false;
                }
            }
        }

        for (var i = 0; i < pDecl.length; i++) {
            pElement = pDecl.element(i).clone();
            pElement.offset += this.stride;
            this._pElements.push(pElement);
        }

        return this._update();
    }

    /** inline */ hasSemantics(sSemantics: string): boolean {
        return this.findElement(sSemantics) !== null;
    }

    findElement(sSemantics: string, iCount: uint = limit.MAX_INT32): AIVertexElement {
        sSemantics = sSemantics.toUpperCase();

        for (var i = 0; i < this.length; ++i) {
            if (this._pElements[i].usage === sSemantics && (iCount === limit.MAX_INT32 || this._pElements[i].count == iCount)) {
                return this._pElements[i];
            }
        }

        return null;
    }

    clone(): AIVertexDeclaration {
        var pElements: AIVertexElement[] = [];
        var pDecl: VertexDeclaration;

        for (var i = 0; i < this.length; ++i) {
            pElements.push(this._pElements[i].clone());
        }

        pDecl = new VertexDeclaration(pElements);

        if (pDecl._update()) {
            return pDecl;
        }

        return null;
    }

    toString(): string {
        if (has("DEBUG")) {
            var s = "\n";

            s += "  VERTEX DECLARATION ( " + this.stride + " b. ) \n";
            s += "---------------------------------------\n";

            for (var i = 0; i < this.length; ++i) {
                s += this._pElements[i].toString() + '\n';
            }

            return s;
        }

        return null;
    }

    static normalize(pElement: AIVertexElement): AIVertexDeclaration;
    static normalize(pElements: AIVertexElementInterface[]): AIVertexDeclaration;
    static normalize(pDecl: AIVertexDeclaration): AIVertexDeclaration;
    static normalize(pData?): AIVertexDeclaration {
        if (!(pData instanceof VertexDeclaration)) {
            if (!Array.isArray(pData) && isDefAndNotNull(pData)) {
                pData = [pData];
            }

            pData = new VertexDeclaration(pData);
        }

        return pData;
    }
}

export = VertexDeclaration;


