// AIShaderInput interface
// [write description here...]

/// <reference path="AIRenderStateMap.ts" />

interface AIShaderInput {
	uniforms: {[index: uint]: any;};
	attrs: {[index: uint]: any;};
	renderStates: AIRenderStateMap;
}
