#ifndef ISHADERINPUT_TS
#define ISHADERINPUT_TS

module akra {
	export interface IShaderInput {
		uniforms: {[index: uint]: any;};
		attrs: {[index: uint]: any;};
		// [index: string]: any;
	}
}

#endif
