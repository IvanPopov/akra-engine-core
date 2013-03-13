#ifndef UNIQUE_TS
#define UNIQUE_TS

#include "IUnique.ts"

#define UNIQUE() \
	protected _iGuid: int = sid();											\
	inline getGuid(): uint { return this._iGuid; }

#endif