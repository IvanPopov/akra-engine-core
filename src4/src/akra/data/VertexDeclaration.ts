/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../limit.ts" />
/// <reference path="../types.ts" />
/// <reference path="Usage.ts" />
/// <reference path="VertexElement.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../config/config.ts" />


module akra.data {
	export class VertexDeclaration implements IVertexDeclaration {
		///** readonly */ property for public usage
		stride: uint = 0;

		private _pElements: IVertexElement[] = [];

		getLength(): uint {
			return this._pElements.length;
		}

		//FIXME: typescript error "Overload signature is not compatible with function definition" ???
		constructor(...pElements: IVertexElementInterface[]);
		constructor(pElements?: IVertexElementInterface[]);
		constructor(pElements?: any) {
			if (arguments.length > 0 && isDefAndNotNull(pElements)) {
				this.append.apply(this, arguments);
			}
		}

		element(i: uint): IVertexElement {
			return this._pElements[i] || null;
		}

		append(...pElements: IVertexElementInterface[]): boolean;
		append(pElements?: IVertexElementInterface[]): boolean;
		append(pData?: any) {
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
				else {
					iOffset = pElement.offset;
				}

				var pVertexElement: IVertexElement = new VertexElement(
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

			for (var i: int = 0; i < this.getLength(); ++i) {
				//move "END" element to end of declaration
				if (this._pElements[i].usage === Usages.END) {
					this._pElements.swap(i, i + 1);
				}

				//recalc total stride
				iStride = this._pElements[i].size + this._pElements[i].offset;

				if (this.stride < iStride) {
					this.stride = iStride
				}
			}

			var pLast: IVertexElement = this._pElements.last;

			if (pLast.usage === Usages.END && pLast.offset < this.stride) {
				pLast.offset = this.stride;
			}

			return true;
		}



		extend(decl: IVertexDeclaration): boolean {
			var pDecl: VertexDeclaration = <VertexDeclaration>decl;
			var pElement: IVertexElement;

			for (var i = 0; i < this.getLength(); ++i) {
				for (var j = 0; j < pDecl.getLength(); ++j) {
					if (pDecl.element(j).usage == this._pElements[i].usage) {
						logger.log('inconsistent declarations:', this, pDecl);
						//'The attempt to combine the declaration containing the exact same semantics.'
						return false;
					}
				}
			}

			for (var i = 0; i < pDecl.getLength(); i++) {
				pElement = pDecl.element(i).clone();
				pElement.offset += this.stride;
				this._pElements.push(pElement);
			}

			return this._update();
		}

		hasSemantics(sSemantics: string): boolean {
			return this.findElement(sSemantics) !== null;
		}

		findElement(sSemantics: string, iCount: uint = MAX_INT32): IVertexElement {
			sSemantics = sSemantics.toUpperCase();

			for (var i = 0; i < this.getLength(); ++i) {
				if (this._pElements[i].usage === sSemantics && (iCount === MAX_INT32 || this._pElements[i].count == iCount)) {
					return this._pElements[i];
				}
			}

			return null;
		}

		clone(): IVertexDeclaration {
			var pElements: IVertexElement[] = [];
			var pDecl: VertexDeclaration;

			for (var i = 0; i < this.getLength(); ++i) {
				pElements.push(this._pElements[i].clone());
			}

			pDecl = new VertexDeclaration(pElements);

			if (pDecl._update()) {
				return pDecl;
			}

			return null;
		}

		toString(): string {
			if (config.DEBUG) {
				var s = "\n";

				s += "  VERTEX DECLARATION ( " + this.stride + " b. ) \n";
				s += "---------------------------------------\n";

				for (var i = 0; i < this.getLength(); ++i) {
					s += this._pElements[i].toString() + '\n';
				}

				return s;
			}

			return null;
		}

		static normalize(pElement: IVertexElement): IVertexDeclaration;
		static normalize(pElements: IVertexElementInterface[]): IVertexDeclaration;
		static normalize(pDecl: IVertexDeclaration): IVertexDeclaration;
		static normalize(pData?): IVertexDeclaration {
			if (isNull(pData)) {
				return null;
			}

			if (!(pData instanceof VertexDeclaration)) {
				if (!Array.isArray(pData) && isDefAndNotNull(pData)) {
					pData = [pData];
				}

				pData = new VertexDeclaration(pData);
			}

			return pData;
		}
	}

}
