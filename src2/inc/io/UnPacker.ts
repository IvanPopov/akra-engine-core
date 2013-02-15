#ifndef UNPACKER_TS
#define UNPACKER_TS

#include "common.ts"
#include "IUnPacker.ts"
#include "PackerFormat.ts"
#include "BinReader.ts"

module akra.io {
	class UnPacker extends BinReader implements IUnPacker {
		protected _pHashTable: any[] = <any[]><any>{};
		protected _pTemplate: IPackerTemplate = getPackerTemplate();
		protected _pPositions: int[] = [];
		
		inline get template(): IPackerTemplate { return this._pTemplate; }

		private pushPosition(iPosition: uint): void;
		private popPosition(): void;
		private memof(pObject: any, iAddr: int): void;
		private memread(iAddr: int): any;
		private readPtr(iAddr: int, sType: string, pObject?: any): any;
		

		private inline pushPosition(iPosition: uint): void {
			this._pPositions.push(this._iPosition);
		    this._iPosition = iPosition;
		}

		private inline popPosition(): void {
			this._iPosition = this._pPositions.pop();
		}

		private memof(pObject: any, iAddr: int): void {
			this._pHashTable[iAddr] = pObject;
		}

		private memread(iAddr: int): any {
			return this._pHashTable[iAddr] || null;
		}


		private readPtr(iAddr: int, sType: string, pObject: any = null): any {
		    if (iAddr === MAX_UINT32) {
		        return null;
		    }

		    var pTmp: any = this.memread(iAddr);
		    var isReadNext: bool = false;
		    var fnReader: Function = null;
		    var pTemplate: IPackerTemplate = this.template;
		    var pProperties: IPackerCodec;

		    if (isDefAndNotNull(pTmp)) {
		        return pTmp;
		    }

		    if (iAddr === this._iPosition) {
		        isReadNext = true;
		    }
		    else {
		        //set new position
		        this.pushPosition(iAddr);
		    }

		    pProperties = pTemplate.properties(sType);

		    debug_assert(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be readed");

		    fnReader = pProperties.read;

		    //read primal type
		    if (isDefAndNotNull(fnReader)) {
		        pTmp = fnReader.call(this, pObject);
		        this.memof(pTmp, iAddr);
		        
		        //restore prev. position
		        if (!isReadNext) {
		            this.popPosition();
		        }

		        return pTmp;
		    }

		    CRITICAL("unhandled case!");
		    return null;
		}


		read(): any {
		    var iAddr: int = this.uint32();

		    if (iAddr === MAX_UINT32) {
		        return null;
		    }

		    var iType: int = this.uint32();
		    var sType: string = this.template.getType(iType);

		    return this.readPtr(iAddr, sType);
		};
	}

	export function undump (pBuffer: any): any {
	    if (!isDefAndNotNull(pBuffer)) {
	        return null;
	    }

	    return (new UnPacker(pBuffer)).read();
	}
}

#endif

