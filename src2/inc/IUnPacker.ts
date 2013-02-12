#ifndef IUNPACKER_TS
#define IUNPACKER_TS

#include "IBinReader.ts"

module akra {
	IFACE(IPackerTemplate);

	export interface IUnPacker extends IBinReader {
		template: IPackerTemplate;

		read(): any;
	}
}

#endif
