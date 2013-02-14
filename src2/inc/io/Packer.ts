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
		protected _pBlackList: IPackerBlacklist = {};
		protected _pBlackListStack: IPackerBlacklist[] = [];
		protected _pTemplate: IPackerTemplate = getPackerTemplate();
		protected _pOptions: IPackerOptions = null;
		protected _iInitialAddr: int = 0;

		inline get template(): IPackerTemplate { return this._pTemplate; }
		inline get initialAddress(): int { return this._iInitialAddr; }
		inline get options(): IPackerOptions { return this._pOptions; }
		inline set options(pOptions: IPackerOptions) { this._pOptions = pOptions; }

		private memof(pObject: any, iAddr: int, sType: string): void;
		private addr(pObject: any, sType: string): int;
		private nullPtr(): void;
		private rollback(n?: int): Uint8Array[];
		private append(pData: Uint8Array[]): void;
		private append(pData: ArrayBuffer): void;
		private append(pData: Uint8Array): void;
		private pushBlackList(pList: IPackerBlacklist): IPacker;
		private popBlackList(): IPacker;
		private blackList(): IPackerBlacklist;
		private isInBlacklist(sType: string): bool;
		private writeData(pObject: any, sType: string): bool;
		private header(): ArrayBuffer;

		_jump(iAddr: int): void;
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

		inline _jump(iAddr: int): void {
			this._iInitialAddr = iAddr;
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
		    //pRollback.byteLength = iRollbackLength;

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

		private pushBlackList(pList: IPackerBlacklist): IPacker {
		    this._pBlackListStack.push(this._pBlackList);
		    
		    var pBlackList: IPackerBlacklist = {};

		    if (isDefAndNotNull(pList)) {
		        for (var i in pList) {
		            pBlackList[i] = pList[i];
		        }
		    }

		    for (var i in this._pBlackList) {
		        pBlackList[i] = this._pBlackList[i];
		    }

		    this._pBlackList = pBlackList;
		    return this;
		}

		private inline popBlackList(): IPacker {
			this._pBlackList = this._pBlackListStack.pop();
		    return this;
		}

		private inline blackList(): IPackerBlacklist {
			return this._pBlackList;
		}

		private inline isInBlacklist(sType: string): bool {
			return isDef(this._pBlackList[sType]);
		}

		private writeData(pObject: any, sType: string): bool {
			var pTemplate: IPackerTemplate = this.template;
		    var pProperties: IPackerCodec = pTemplate.properties(sType);

		    var fnWriter: Function = null;
		    var pBaseClasses: string[];
		    var pBlackList: IPackerBlacklist;
		    var pMembers: IPackerCodec;

		    this.pushBlackList(pProperties.blacklist);

		    pBlackList = this.blackList();

		    if (isDefAndNotNull(pBlackList) &&  isDef(pBlackList[sType])) {
		        if (isNull(pBlackList[sType])) {
		            return false;
		        }
		        else if (isFunction(pBlackList[sType])) {
		            pObject = (<Function>pBlackList[sType]).call(this, pObject);
		        }
		    } 

		    
		    fnWriter = pProperties.write;
		    
		    if (!isNull(fnWriter)) {
		         if (fnWriter.call(this, pObject) === false) {
		            ERROR("cannot write type: " + sType);
		        }

		        this.popBlackList();
		        return true;
		    }

		    debug_assert(pProperties, "unknown object <" + sType + "> type cannot be writed");

		    pBaseClasses = pProperties.base;

		    if (isDefAndNotNull(pBaseClasses)) {
		        for (var i = 0; i < pBaseClasses.length; ++ i) {
		            debug_assert(pBlackList[pBaseClasses[i]] === undefined, 
		                "you cannot add to black list your parent classes");
		            this.writeData(pObject, pBaseClasses[i]);
		        }
		    }

		    pMembers = pProperties.members;

		    if (isDefAndNotNull(pMembers)) {
		        //writing structure
		        for (var sName in pMembers) {
		            //writing complex type of structure member
		            if (isNull(pMembers[sName]) || isString(pMembers[sName])) {
		                this.write(pObject[sName], pMembers[sName]);
		                continue;
		            }
		            //trace(sType, pObject, pMembers, sName, pProperties);
		            if (isString(pMembers[sName].write)) {
		                this.write(pObject[sName], pMembers[sName].write);
		                continue;
		            }
		            else if (!pMembers[sName].write) {
		                this.write(pObject[sName], null);
		            }
		            else {
		                pMembers[sName].write.call(this, pObject);
		            }
		        }
		    }
		    
		    this.popBlackList();
		    return true;
		}

		private header(): ArrayBuffer {
			var useHeader: bool = this.options? this.options.header: false;
			var pHeader: IPackerFormat;

		    if (!useHeader) {
		        return null;
		    }

		    var pPacker: Packer = new Packer;

		    if (useHeader) {
		        //пишем данные шаблона
		        pHeader = this.template.data();
		    }
		    
		    pPacker._jump(8);
		    pPacker.write(pHeader);

		    return pPacker.data();
		}

		write(pObject: any, sType: string = null): bool {
			var pProperties: IPackerCodec;
		    var iAddr: int, iType: int;
		    var pTemplate: IPackerTemplate = this.template;
		    var pHeader: ArrayBuffer = this.header();
		    
		    // this.setupHashTable();
		    
		    if (isNull(sType)) {
		        sType = pTemplate.detectType(pObject);
		    }

		    if (!this.isInBlacklist(sType)) {    
		        pProperties = pTemplate.properties(sType);
		        iType = pTemplate.getTypeId(sType);
		    }
		    else {
		        pObject = null;
		    }

		    if (isNull(pObject) || !isDef(pObject) || !isDef(iType)) {
		        this.nullPtr();
		        return false;
		    }
		   
		    iAddr = this.addr(pObject, sType);

		    if (iAddr < 0) {
		        iAddr = 0;

		        if (pHeader) {
		            iAddr += pHeader.byteLength;
		        }

		        iAddr += this.byteLength + 4 + 4 + this.initialAddress;

		        this.uint32(iAddr); 
		        this.uint32(iType);

		        if (pHeader) {
		            this.append(pHeader);
		        }

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

	export function dump(pObject: any, pOptions: IPackerOptions = {}): ArrayBuffer {
		var pPacker: IPacker = new Packer;
	    
	    if (!isDef(pOptions.header)) {
	        pOptions.header = true;
	    }   

	    pPacker.options = pOptions;
	    pPacker.write(pObject);

	    return pPacker.data();
	}
	
}

#endif
