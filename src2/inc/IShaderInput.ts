#ifndef ISHADERINPUT_TS
#define ISHADERINPUT_TS

module akra {
	IFACE(IRenderStateMap)

	export interface IShaderInput {
		uniforms: {[index: uint]: any;};
		attrs: {[index: uint]: any;};
		renderStates: IRenderStateMap;
	}
}

#endif
