// AIShaderInput interface
// [write description here...]

/// <reference path="AIMap.ts" />

interface AIShaderInput {
	uniforms: {[index: uint]: any;};
	attrs: {[index: uint]: any;};
	renderStates: AIMap<AERenderStateValues>;
}
