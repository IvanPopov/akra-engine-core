
/// <reference path="IMap.ts" />

module akra {
	export interface IShaderInput {
		uniforms: {[index: uint]: any;};
		attrs: {[index: uint]: any;};
		renderStates: IMap<ERenderStateValues>;
	}
	
}
