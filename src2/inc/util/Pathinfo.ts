#ifndef PATHINFO_TS
#define PATHINFO_TS

#include "IPathinfo.ts"

module akra {
	export class Pathinfo implements IPathinfo {
		private _sDirname: string = null;
		private _sExtension: string = null;
		private _sFilename: string = null;

		inline get path(): string { return this.toString(); }
		inline set path(sPath: string) { this.set(sPath); }

		inline get dirname(): string { return this._sDirname; }
		inline set dirname(sDirname: string) { this._sDirname = sDirname; }

		inline get filename(): string { return this._sFilename; }
		inline set filename(sFilename: string) { this._sFilename = sFilename; }

		inline get ext(): string { return this._sExtension; }
		inline set ext(sExtension: string) { this._sExtension = sExtension; }

		inline get basename(): string { 
			return (this._sFilename ? this._sFilename + (this._sExtension ? "." + this._sExtension : "") : ""); 
		}

		inline set basename(sBasename: string) {
			var nPos: uint = sBasename.lastIndexOf(".");

	        if (nPos < 0) {
	            this._sFilename = sBasename.substr(0);
	            this._sExtension = null;
	        }
	        else {
	            this._sFilename = sBasename.substr(0, nPos);
	            this._sExtension = sBasename.substr(nPos + 1);
	        }
		}


		constructor (pPath: IPathinfo);
		constructor (sPath: string);
		constructor (pPath?: any) {
			if (isDef(pPath)) {
				this.set(<string>pPath);
			}
		}


		set(sPath: string): void;
		set(pPath: IPathinfo): void;
		set(sPath?: any) {
			if (isString(sPath)) {
		        var pParts: string[] = sPath.replace('\\', '/').split('/');
		        
		        this.basename = pParts.pop();

		        this._sDirname = pParts.join('/');
		    }
		    else if (sPath instanceof Pathinfo) {
		        this._sDirname = sPath.dirname;
		        this._sFilename = sPath.filename;
		        this._sExtension = sPath.ext;
		    }
		    else {
		        //critical_error
		        ERROR("Unexpected data type was used.");
		    }
		}

		isAbsolute(): bool { return this._sDirname[0] === "/"; }


		toString(): string {
			return (this._sDirname ? this._sDirname + "/" : "") + (this.basename);
		}

	}
	
}

#endif