#ifndef IDISPLAYLIST_TS
#define IDISPLAYLIST_TS

module akra {
	export interface IDisplayList extends IEventProvider {
		findObjects(pCamera: ICamera): ISceneObject[];
	}
}

#endif