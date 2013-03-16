#ifndef VERTEXDECLARATION_TS
#define VERTEXDECLARATION_TS

#include "IVertexDeclaration.ts"
#include "VertexElement.ts"

module akra.data {

	export class VertexDeclaration implements IVertexDeclaration {
		//readonly property for public usage
		stride: uint = 0;

		private _pElements: IVertexElement[] = [];

		inline get length(): uint {
			return this._pElements.length;
		}

		//FIXME: typescript error "Overload signature is not compatible with function definition" ???
		//constructor (...pElement: IVertexElement[]) 
		constructor (...pElements: IVertexElementInterface[]);
		constructor (pElements: IVertexElementInterface[]);
		constructor (pElements: any) {
			if (arguments.length > 0) {
				this.append.apply(this, arguments);
			}
		}

		inline element(i: uint): IVertexElement {
			return this._pElements[i] || null;
		}

		append(...pElement: IVertexElementInterface[]): bool;
		append(pElements: IVertexElementInterface[]): bool;
		append(pData: any) {
			var pElements: IVertexElementInterface[];

			if (!isArray(arguments[0])) {
				pElements = <IVertexElementInterface[]><any>arguments;
			}
			else {
				pElements = <IVertexElementInterface[]><any>arguments[0];
			}

			for (var i: int = 0; i < pElements.length; i++) {
				var pElement: IVertexElementInterface = pElements[i];
				var iOffset: uint;

				if (VertexElement.hasUnknownOffset(pElement)) {
					//add element to end
					iOffset = this.stride;
				}
				else{
					iOffset = pElement.offset;
				}

				var pVertexElement: IVertexElement = new VertexElement(
															pElement.count,
												            pElement.type,
												            pElement.usage,
												            iOffset);

				this._pElements.push(pVertexElement);

				var iStride: uint = iOffset + pVertexElement.size;

				if(this.stride < iStride){
					this.stride = iStride;
				}
			}

			return this._update();
		}

		_update(): bool {
			var iStride: int;

			for (var i: int = 0; i < this.length; ++ i) {
				//move "END" element to end of declaration
				if (this._pElements[i].usage === DeclUsages.END) {
		            this._pElements.swap(i, i + 1);
		        }

		        //recalc total stride
		        iStride = this._pElements[i].size + this._pElements[i].offset;

		        if (this.stride < iStride) {
		            this.stride = iStride
		        }
			}

			var pLast: IVertexElement = this._pElements.last;
    
		    if (pLast.usage === DeclUsages.END && pLast.offset < this.stride) {
		        pLast.offset = this.stride;
		    }

		    return true;
		}

		

		extend(decl: IVertexDeclaration): bool {
			var pDecl: VertexDeclaration = <VertexDeclaration>decl;
			var pElement: IVertexElement;

		    for (var i = 0; i < this.length; ++ i) {
		        for (var j = 0; j < pDecl.length; ++ j) {
		            if (pDecl.element(j).usage == this._pElements[i].usage) {
		                LOG('inconsistent declarations:', this, pDecl);
		                debug_error('The attempt to combine the declaration containing the exact same semantics.');
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

		inline hasSemantics(sSemantics: string): bool {
			return this.findElement(sSemantics) !== null;
		}

		findElement(sSemantics: string, iCount: uint = MAX_INT32): IVertexElement {
			sSemantics = sSemantics.toUpperCase();

			for (var i = 0; i < this.length; ++i) {
				if (this._pElements[i].usage === sSemantics && (iCount === MAX_INT32 || this._pElements[i].count == iCount)) {
					return this._pElements[i];
				}
			}

			return null;
		}

		clone(): IVertexDeclaration {
			var pElements: IVertexElement[] = [];
			var pDecl: VertexDeclaration;

		    for (var i = 0; i < this.length; ++ i) {
		        pElements.push(this._pElements[i].clone());
		    }

		    pDecl = new VertexDeclaration(pElements);

		    if (pDecl._update()) {
		    	return pDecl;
		    }

		    return null;
		}

		///DEBUG!!!
		toString(): string {
#ifdef DEBUG
			var s = "\n";

	    	s += "  VERTEX DECLARATION ( " + this.stride +" b. ) \n";
		    s += "---------------------------------------\n";

		    for (var i = 0; i < this.length; ++ i) {
		        s += this._pElements[i].toString() + '\n';
		    }

		    return s;
#else		
			return null;
#endif
		}
	}
}

module akra {
	export var VertexDeclaration = data.VertexDeclaration;
	
	export var createVertexDeclaration = function (pData?): data.VertexDeclaration {
		if (!(pData instanceof VertexDeclaration)) {
	        if (!(pData instanceof Array)) {
	            pData = [pData];
	        }

	        pData = new VertexDeclaration(pData);
	    }

	    return pData;
	}
	
}

#endif
