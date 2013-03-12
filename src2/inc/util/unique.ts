#ifndef UNIQUE_TS
#define UNIQUE_TS

#include "IUnique.ts"

#define UNIQUE() \
	private _iGuid: int = eval("this._iGuid || akra.sid()");											\
	inline getGuid(): uint {return this._iGuid; }

#endif