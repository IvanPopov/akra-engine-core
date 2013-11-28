module akra {
	export interface IResourceNotifyRoutineFunc {
		(iFlagBit?: int, iResourceFlags?: int, isSet?: boolean): void;
		(eEvent?: EResourceItemEvents, iResourceFlags?: int, isSet?: boolean): void;
	}
}
