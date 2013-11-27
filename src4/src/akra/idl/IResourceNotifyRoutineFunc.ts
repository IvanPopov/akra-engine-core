module akra {
	export interface AIResourceNotifyRoutineFunc {
		(iFlagBit?: int, iResourceFlags?: int, isSet?: boolean): void;
		(eEvent?: EResourceItemEvents, iResourceFlags?: int, isSet?: boolean): void;
	}
	
	
}
