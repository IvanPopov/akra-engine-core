///<reference path="../akra.ts" />

module akra.util {
	export class VertexDeclaration implements IVertexDeclaration {
		stride: uint = 0;
		length: uint;

		//FIXME: typescript error "Overload signature is not compatible with function definition" ???
		//constructor (...pElement: IVertexElement[]) 
		constructor (pElements: IVertexElement[]) {
			if (arguments.length) {
				if (arguments.length > 1) {
					this.append(<IVertexElement[]><any>arguments);
				}
				else {
					this.append(<IVertexElement[]><any>arguments[0]);
				}
			}
		}

		//append(...pElement: IVertexElement[]): bool;
		append(pElements?: IVertexElement[]): bool {
			return false;
		}

		

		extend(pDecl: IVertexDeclaration): bool {
			return false;
		}

		hasSemantics(sSemantics: string): bool {
			return false;
		}

		findElement(sSemantics: string, iCount?: uint): IVertexElement {
			return null;
		}

		clone(): IVertexDeclaration {
			return null;
		}

		///DEBUG!!!
		toString(): string {
			if (DEBUG) {

			}
			
			return null;
		}
	}

	//FIXME: typescript hack, to extends with Array
	
	var __extends = function (d, b) {
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};

	__extends(VertexDeclaration, Array);
}

module akra {
	export var VertexDeclaration = util.VertexDeclaration;
}