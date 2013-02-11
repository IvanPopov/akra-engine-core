#ifndef PACKER_TS
#define PACKER_TS

#include "IPacker.ts"
#include "BinWriter.ts"

module akra.io {

	interface IHashCell {
		[i: int]: any;
	}

	interface IHash {
		[type: string]: IHashCell;
	}

	class Packer extends BinWriter implements IPacker {
		protected _pHashTable: IHash = {};
		protected _pBlackList: IBlackList = {};
		protected _pBlackListStack: IBlackList[] = [];
		protected _pTemplate: IPackerTemplate = getPackerTemplate();
		protected _pOptions: IPackerOptions = null;
		protected _iInitialAddr: int = 0;

		inline get byteLength(): int { return this._iCountData; }
		inline get template(): IPackerTemplate { return this._pTemplate; }
		inline get initialAddress(): int { return this._iInitialAddr; }
		inline get options(): IPackerOptions { return this._pOptions; }
		inline set options(pOptions: IPackerOptions) { this._pOptions = pOptions; }

		private memof(pObject: any, iAddr: int, sType: string): void;
		private addr(pObject: any, sType: string): int;
		private nullPtr(): void;
		private jump(iAddr: int): void;
		private rollback(n: uint): Uint8Array[];
		private append(pData: Uint8Array[]): void;
		private append(pData: ArrayBuffer): void;
		private append(pData: Uint8Array): void;
		private pushBlackList(pList: IBlackList): IPacker;
		private popBlackList(): IPacker;
		private blackList(): IBlackList;
		private isInBlacklist(sType: string): bool;
		private writeData(pObject: any, sType: string): bool;
		private header(): ArrayBuffer;

		write(pObject: any, sType?: string, bHeader?: bool): bool;
	}
}

#endif
