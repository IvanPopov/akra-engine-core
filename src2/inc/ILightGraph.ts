#ifndef ILIGHTGRAPH_TS
#define ILIGHTGRAPH_TS

module akra{

	IFACE(IDisplayList);
	IFACE(ICamera);
	IFACE(IObjectArray);

	export interface ILightGraph extends IDisplayList{
	};
};

#endif