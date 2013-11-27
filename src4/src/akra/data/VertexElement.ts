/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../idl/IVertexElement.ts" />
/// <reference path="../idl/EDataTypes.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../types.ts" />
/// <reference path="Usage.ts" />

module akra.data {

    /** @const */
    var UNKNOWN_OFFSET = MAX_INT32;

    export class VertexElement implements IVertexElement {
        count: uint;
        type: EDataTypes;
        usage: string;
        offset: int;

        // this properties is /** readonly */ for public usage.
        size: uint = 0;
        index: int = 0;
        semantics: string = Usages.UNKNOWN;

        constructor(
            nCount: uint = 1,
            eType: EDataTypes = EDataTypes.FLOAT,
            eUsage: string = Usages.POSITION,
            //mark invalid offset, for determine true offset in VertexDeclaration::_update();
            iOffset: int = UNKNOWN_OFFSET) {

            this.count = nCount;
            this.type = eType;
            this.usage = eUsage;
            this.offset = iOffset;

            this.update();
        }

        private update(): void {
            this.size = this.count * sizeof(this.type);
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

        clone(): IVertexElement {
            return new VertexElement(this.count, this.type, this.usage, this.offset);
        }

        /**  */ static hasUnknownOffset(pElement: IVertexElementInterface): boolean {
            return (!isDef(pElement.offset) || (pElement.offset === UNKNOWN_OFFSET));
        }

        /**  */ isEnd(): boolean {
            return this.semantics === Usages.END;
        }

        toString(): string {
            if (config.DEBUG) {
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

                var s = "[ USAGE: " + _an(this.usage == Usages.END ? "<END>" : this.usage, 12) + ", OFFSET " + _an(this.offset, 4)
                    + ", SIZE " + _an(this.size, 4) + " ]";

                return s;
            }
            return null;
        }


        static custom(sUsage: string, eType: EDataTypes = EDataTypes.FLOAT, iCount: uint = 1, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return {
                count: iCount,
                type: eType,
                usage: sUsage,
                offset: iOffset
            };
        }

        static float(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return VertexElement.custom(sUsage, EDataTypes.FLOAT, 1, iOffset);
        }

        static float2(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return VertexElement.custom(sUsage, EDataTypes.FLOAT, 2, iOffset);
        }

        static float3(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return VertexElement.custom(sUsage, EDataTypes.FLOAT, 3, iOffset);
        }

        static float4(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return VertexElement.custom(sUsage, EDataTypes.FLOAT, 4, iOffset);
        }

        static float4x4(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return VertexElement.custom(sUsage, EDataTypes.FLOAT, 16, iOffset);
        }

        static int(sUsage: string, iOffset: uint = UNKNOWN_OFFSET): IVertexElementInterface {
            return VertexElement.custom(sUsage, EDataTypes.INT, 1, iOffset);
        }

        static end(iOffset: uint = 0): IVertexElementInterface {
            return VertexElement.custom(Usages.END, EDataTypes.UNSIGNED_BYTE, 0, iOffset);
        }
    }
}

