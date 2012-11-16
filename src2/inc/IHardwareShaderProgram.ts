#ifndef IHARDWARESHADERPROGRAM_TS
#define IHARDWARESHADERPROGRAM_TS

#include "IHardwareObject.ts"

module akra {

	export enum EShaderTypes {
        PIXEL = 0x8B30,
        VERTEX
    };

	export interface IHardwareShaderProgram extends IHardwareObject {
		activate(): void;
		deactivate(): void;

		attachShader(pShader: IHardwareShader): void;
		detachShader(pShader: IHardwareShader): void;
		getAttachedShaders(): IHardwareShader[];

		getParameter(eParam: int): any;
		getInfoLog(): string;
		//bindAttributeLocation(...): void
		
		compile(): void;
		link(): void;
		validate(): void;

		getActiveUniform(iIndex: uint): IUniformInfo;
		getActiveAttrib(iIndex: uint): IAttribInfo;

		getAttribLocation(sName: string): int;
		getUniformLocation(sName: string): int;

		getVertexAttrib(iIndex: int, eParam: int): any;
		getVertexAttribOffset(iIndex: uint, eParam: int): uint;

		getUniform(iLoc: int): any;
		vertexAttribPointer(indx: uint, size: uint, type: int, normalized: bool, stride: uint, offset: uint);

		//vertexAttrib();
		//vertexAttribPointer
		//uniform[1234][fi]
		//uniform[1234][fi]v
		//uniformMatrix[234]fv
	}

}

#endif

