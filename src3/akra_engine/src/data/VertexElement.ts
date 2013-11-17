/// <reference path="../idl/AIVertexDeclaration.ts" />
/// <reference path="../idl/AIVertexElement.ts" />
/// <reference path="../idl/AEDataTypes.ts" />

import limit = require("limit");
import dt = require("dataType");
import Usage = require("data/Usage");

/** @const */
var UNKNOWN_OFFSET = limit.MAX_INT32;

class VertexElement implements AIVertexElement {
    count: uint;
    type: AEDataTypes;
    usage: string;
    offset: int;

    // this properties is /** readonly */ for public usage.
    size: uint = 0;
    index: int = 0;
    semantics: string = Usage.UNKNOWN;

    constructor(
        nCount: uint = 1,
        eType: AEDataTypes = AEDataTypes.FLOAT,
        eUsage: string = Usage.POSITION,
        //mark invalid offset, for determine true offset in VertexDeclaration::_update();
        iOffset: int = UNKNOWN_OFFSET) {

        this.count = nCount;
        this.type = eType;
        this.usage = eUsage;
        this.offset = iOffset;

        this.update();
    }

    private update(): void {
        this.size = this.count * dt.size(this.type);
        this.index = 0;
        this.semantics = null;

        var pMatches: string[] = this.usage.match(/^(.*?\w)(\d+)$/i);

        if (!isNull(pMatches)) {
            this.semantics = pMatches[1];
            this.index = parseInt(pMatches[2]);

            // To avoid the colosseum between the "usage" of the element as POSITION & POSITION0, 
            // given that this is the same thing, here are the elements with index 0 
            // for "usage" with the POSITION.
            // if (this.index === 0) {
            // 	this.usage = this.semantics;
            // }
        }
        else {
            this.semantics = this.usage;
        }
    }

    clone(): AIVertexElement {
        return new VertexElement(this.count, this.type, this.usage, this.offset);
    }

    /** inline */ static hasUnknownOffset(pElement: AIVertexElementInterface): boolean {
        return (!isDef(pElement.offset) || (pElement.offset === UNKNOWN_OFFSET));
    }

    /** inline */ isEnd(): boolean {
        return this.semantics === Usage.END;
    }

    toString(): string {
        if (has("DEBUG")) {
            function _an(data: any, n: uint, bBackward: boolean = false): string {
                var s: string = String(data);

                for (var i = 0, t = n - s.length; i < t; ++i) {
                    if (bBackward) {
                        s = " " + s;
                    }
                    else {
                        s += " ";
                    }
                }
                return s;
            }

            var s = "[ USAGE: " + _an(this.usage == Usage.END ? "<END>" : this.usage, 12) + ", OFFSET " + _an(this.offset, 4)
                + ", SIZE " + _an(this.size, 4) + " ]";

            return s;
        }
        return null;
    }
}


export = VertexElement;