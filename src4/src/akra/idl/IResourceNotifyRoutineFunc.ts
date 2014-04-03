module akra {
	export interface IResourceNotifyRoutineFunc {
		(pSender: IResourcePoolItem, iFlagBit?: int, iResourceFlags?: int, isSet?: boolean): void;
		(pSender: IResourcePoolItem, eEvent?: EResourceItemEvents, iResourceFlags?: int, isSet?: boolean): void;
	}
}
