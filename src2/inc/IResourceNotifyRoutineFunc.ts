#ifndef IRESOURCENOTIFYROUTINEFUNC_TS
#define IRESOURCENOTIFYROUTINEFUNC_TS


module akra {
	export interface IResourceNotifyRoutineFunc {
		(iFlagBit?: int, iResourceFlags?: int, isSet?: bool): void;
		(eEvent?: EResourceItemEvents, iResourceFlags?: int, isSet?: bool): void;
	}
}

#endif
