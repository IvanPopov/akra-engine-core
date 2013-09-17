#ifndef ISPRITEMANAGER_TS
#define ISPRITEMANAGER_TS

module akra {
	IFACE(ISprite);
	IFACE(IRenderData);

	export interface ISpriteManager {
		_allocateSprite(pSprite: ISprite): IRenderData;
	}
}

#endif
