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

		// constructor (pBuffer: ArrayBuffer, iByteOffset?: uint, iByteLength?: uint);
		// constructor (pBuffer: IBinWriter, iByteOffset?: uint, iByteLength?: uint);
		
		inline get template(): IPackerTemplate { return this._pTemplate; }

		private pushPosition(iPosition: uint): void;
		private popPosition(): void;
		private memof(pObject: any, iAddr: int): void;
		private memread(iAddr: int): any;
		private extractHeader(iAddr: int): void;
		private header(pData: IPackerFormat): void;
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

		private extractHeader(iAddr: int): void {
			if (this._iPosition === 4) {
		        if (iAddr !== 8) {
		            this.pushPosition(8);
		            this.header(<IPackerFormat>this.read());
		            this.popPosition();
		        }
		    }
		}

		private header(pData: IPackerFormat): void {
			if (isString(pData)) {
		        WARNING("загрузка шаблонов извне не поддержвиаетя");
		        return;
		    }

		    this.template = new PackerTemplate(pData);
		}

		private readPtr(iAddr: int, sType: string, pObject: any = null): any {
		    if (iAddr === MAX_UINT32) {
		        return null;
		    }

		    var pTmp: any = this.memread(iAddr);
		    var isReadNext: bool = false;
		    var iType: int = -1;
		    var fnReader: Function = null;
		    var iPosition: int;
		    var pTemplate: IPackerTemplate = this.template;
		    var pProperties: IPackerCodec;
		    var pBaseClasses: string[] = null;
		    var pMembers: IPackerCodec = null;
		    var pValue: any;
		    // var pType;

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
		    
		    if (!pObject) {
		        if (isString(pProperties.ctor) || !isDefAndNotNull(pProperties.ctor)) {
		            eval("pObject = new " + (pProperties.ctor || sType) + ";");   
		        }
		        else {
		            pObject = (<Function>pProperties.ctor).call(this);
		        }
		    }

		    pBaseClasses = pProperties.base;

		    if (isDefAndNotNull(pBaseClasses)) {
		        for (var i: int = 0; i < pBaseClasses.length; ++ i) {
		            iAddr = this._iPosition;
		            this.readPtr(iAddr, pBaseClasses[i], pObject);
		        }
		    }

		    this.memof(pObject, iAddr);

		    pMembers = pProperties.members

		    if (isDefAndNotNull(pMembers)) {
		         for (var sName in pMembers) {
		            if (isNull(pMembers[sName]) || 
		                isString(pMembers[sName]) ||
		                isString(pMembers[sName].read)) {
		                pObject[sName] = this.read();
		                continue;
		            }

		            pValue = pMembers[sName].read.call(this, pObject);

		            if (!isDef(pValue)) {
		                pObject[sName] = pValue;
		            }
		        }
		    }

		    //restore prev. position
		    if (!isReadNext) {
		        this.popPosition();
		    }

		    return pObject;
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

