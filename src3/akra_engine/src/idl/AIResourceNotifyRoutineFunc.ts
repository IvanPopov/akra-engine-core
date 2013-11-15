// AIResourceNotifyRoutineFunc interface

interface AIResourceNotifyRoutineFunc {
	(iFlagBit?: int, iResourceFlags?: int, isSet?: boolean): void;
	(eEvent?: AEResourceItemEvents, iResourceFlags?: int, isSet?: boolean): void;
}

