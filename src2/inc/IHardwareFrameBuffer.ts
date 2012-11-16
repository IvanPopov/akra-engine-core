#ifndef IHARDWAREFRAMEBUFFER_TS
#define IHARDWAREFRAMEBUFFER_TS

#include "IHardwareObject.ts"

module akra {

	export interface IHardwareFrameBuffer extends IHardwareObject {
		activate(): void;
		deactivate(): void;

		attachTexture2D(): void;
		attachRenderbuffer(pBuffer: IHardwareRenderBuffer): void;
		
		getAttachmentParameter(eAttachment: int, eParam: int): any;
		checkStatus(): int;
	}

}

#endif

