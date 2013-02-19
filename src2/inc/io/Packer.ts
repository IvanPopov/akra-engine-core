#ifndef PACKER_TS
#define PACKER_TS

#include "common.ts"
#include "IPacker.ts"
#include "PackerFormat.ts"
#include "BinWriter.ts"

module akra.io {


	interface IHash {
		[type: string]: any[];
	}
	

	class Packer extends BinWriter implements IPacker {
		protected _pHashTable: IHash = {};
		protected _pTemplate: IPackerTemplate = getPackerTemplate();

		inline get template(): IPackerTemplate { return this._pTemplate; }

		private memof(pObject: any, iAddr: int, sType: string): void;
		private addr(pObject: any, sType: string): int;
		private nullPtr(): void;
		private rollback(n?: int): Uint8Array[];
		private append(pData: Uint8Array[]): void;
		private append(pData: ArrayBuffer): void;
		private append(pData: Uint8Array): void;
		private writeData(pObject: any, sType: string): bool;

		write(pObject: any, sType?: string): bool;

		private memof(pObject: any, iAddr: int, sType: string): void {
			var pTable: IHash = this._pHashTable;
		    var pCell: any[] = pTable[sType];

		    if (!isDef(pCell)) {
		        pCell = pTable[sType] = [];
		    }

		    pCell.push(pObject, iAddr);
		}

		private addr(pObject: any, sType: string): int {
			var pTable: IHash = this._pHashTable;
		    var iAddr: int;
		    var pCell: any[] = pTable[sType];

		    if (isDef(pCell)) {

		        for (var i: int = 0, n: int = pCell.length / 2; i < n; ++ i) {
		            var j = 2 * i;

		            if (pCell[j] === pObject) {
		                return <int>pCell[j + 1];
		            }
		        }
		    }

		    return -1;
		}

		private inline nullPtr(): void {
			return this.uint32(MAX_UINT32);
		}


		private rollback(n: int = 1): Uint8Array[] {
		    if (n === -1) {
		        n = this._pArrData.length;
		    }

		    var pRollback: Uint8Array[] = new Array(n);
		    var iRollbackLength: int = 0;

		    for (var i: int = 0; i < n; ++ i) {
		        pRollback[i] = this._pArrData.pop();
		        iRollbackLength += pRollback[i].byteLength;
		    }

		    this._iCountData -= iRollbackLength;

		    return pRollback;
		}

		private append(pData: any): void {
			if (isArray(pData)) {
		        for (var i: int = 0; i < (<Uint8Array[]>pData).length; ++ i) {
		            this._pArrData.push((<Uint8Array[]>pData)[i]);
		            this._iCountData += (<Uint8Array[]>pData)[i].byteLength;
		        }
		    }
		    else{
		        if (isArrayBuffer(pData)) {
		            pData = new Uint8Array(pData);
		        }
		        this._pArrData.push(<Uint8Array>pData);
		        this._iCountData += (<Uint8Array>pData).byteLength;
		    }
		}

		private writeData(pObject: any, sType: string): bool {
			var pTemplate: IPackerTemplate = this.template;
		    var pProperties: IPackerCodec = pTemplate.properties(sType);
		    var fnWriter: Function = null;

		    fnWriter = pProperties.write;
		    
		    if (!isNull(fnWriter)) {
		         if (fnWriter.call(this, pObject) === false) {
		            ERROR("cannot write type: " + sType);
		        }

		        return true;
		    }

		    debug_assert(isDefAndNotNull(pProperties), "unknown object <" + sType + "> type cannot be writed");
		    return true;
		}

		write(pObject: any, sType: string = null): bool {
			var pProperties: IPackerCodec;
		    var iAddr: int, iType: int;
		    var pTemplate: IPackerTemplate = this.template;

		    if (isNull(sType)) {
		        sType = pTemplate.detectType(pObject);
		    }


	        pProperties = pTemplate.properties(sType);
	        iType = pTemplate.getTypeId(sType);
	

		    if (isNull(pObject) || !isDef(pObject) || !isDef(iType)) {
		        this.nullPtr();
		        return false;
		    }
		   
		    iAddr = this.addr(pObject, sType);

		    if (iAddr < 0) {
		        iAddr = this.byteLength + 4 + 4;

		        this.uint32(iAddr); 
		        this.uint32(iType);

		        if (this.writeData(pObject, sType)) {
		            this.memof(pObject, iAddr, sType);
		        }
		        else {
		            this.rollback(2);
		            this.nullPtr();
		        }
		    }
		    else {
		        this.uint32(iAddr);
		        this.uint32(iType);
		    }

		    return true;
		}
	}

	export function dump(pObject: any): ArrayBuffer {
		var pPacker: IPacker = new Packer;
	    pPacker.write(pObject);
	    return pPacker.data();
	}
	
}

#endif
