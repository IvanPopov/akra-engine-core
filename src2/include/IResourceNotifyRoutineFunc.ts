module akra {
	export interface IResourceNotifyRoutineFunc {
		(iFlagBit?: int, iResourceFlags?: int, isSet?: bool): void;
		(eEvent?: ResourceItemEvents, iResourceFlags?: int, isSet?: bool): void;
	}
}