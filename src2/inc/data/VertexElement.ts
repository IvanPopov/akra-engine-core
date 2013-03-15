#ifndef VERTEXELEMENT_TS
#define VERTEXELEMENT_TS

#include "IVertexDeclaration.ts"
#include "IVertexElement.ts"


module akra.data {
	export class VertexElement implements IVertexElement {
		count: uint;
		type: EDataTypes;
		usage: string;
		offset: int;

		// this properties is readonly for public usage.
		size: uint = 0;
		index: int = 0;
		semantics: string = DeclarationUsages.UNKNOWN;

		constructor (
			nCount: uint = 1, 
			eType: EDataTypes = EDataTypes.FLOAT, 
			eUsage: string = DeclarationUsages.POSITION,
			//mark invalid offset, for determine true offset in VertexDeclaration::_update();
			iOffset: int = UNKNOWN_OFFSET) {

			this.count = nCount;
			this.type = eType;
			this.usage = eUsage;
			this.offset = iOffset;

			this.update();
		}

		private update(): void {
			this.size = this.count * getTypeSize(this.type);
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
		};

		clone(): IVertexElement {
			return new VertexElement(this.count, this.type, this.usage, this.offset);
		};

		inline static hasUnknownOffset(pElement: IVertexElementInterface): bool {
			return (!isDef(pElement.offset) || (pElement.offset === UNKNOWN_OFFSET));
		};

		toString(): string {
#ifdef DEBUG
			function _an(data: any, n: uint, bBackward: bool = false): string {
		        var s: string = String(data);

		        for (var i = 0, t = n - s.length; i < t; ++ i) {
		            if (bBackward) {
		                s = " " + s;
		            }
		            else {
		                s += " ";
		            }
		        }
		        return s;
		    }

		    var s = "[ USAGE: " + _an(this.usage == DeclUsages.END? "<END>": this.usage, 12) + ", OFFSET " + _an(this.offset, 4) 
		    				+ ", SIZE " + _an(this.size, 4) +" ]";

		    return s;
#else
			return null;
#endif
		}
	}
}

module akra {
	export var VertexElement = VertexElement;
}

#endif