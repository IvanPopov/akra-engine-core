#ifndef IAFXMAKER_TS
#define IAFXMAKER_TS

#include "IShaderProgram.ts"
#include "IUnique.ts"
#include "IAFXPassInputBlend.ts"
#include "fx/BlendContainers.ts"
#include "fx/SamplerBlender.ts"

module akra {
	IFACE(IAFXPassInputBlend);
	IFACE(IBufferMap);
	IFACE(IAFXPassInputBlend);
	IFACE(IShaderInput);

	export interface IAFXMakerMap {
		[index: string]: IAFXMaker;
		[index: uint]: IAFXMaker;
	}

	export interface IAFXMaker extends IUnique {
		readonly shaderProgram: IShaderProgram;
		readonly attributeSemantics: string[];
		readonly attributeNames: string[];


		_create(sVertex: string, sPixel: string): bool;
		
		isUniformExists(sName: string): bool;
		isAttrExists(sName: string): bool;

		isArray(sName: string): bool;
		getType(sName: string): EAFXShaderVariableType;
		getLength(sName: string): uint;
		setUniform(sName: string, pValue: any): void;

		_make(pPassInput: IAFXPassInputBlend, pBufferMap: IBufferMap): IShaderInput;
		_initInput(pPassInput: IAFXPassInputBlend, pBlend: fx.SamplerBlender, 
				pAttrs: fx.AttributeBlendContainer): bool;
		_createDataPool(): IShaderInput;
		_getShaderInput(): IShaderInput;
		_releaseShaderInput(pPool: IShaderInput): void;

	}
}

#endif