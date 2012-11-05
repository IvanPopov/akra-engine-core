#ifndef SCREENINFO_TS
#define SCREENINFO_TS

#include "IScreenInfo.ts"

module akra.util {
	export class ScreenInfo implements IScreenInfo {
		get width(): int {
			return screen.width;
		}

		get height(): int {
			return screen.height;
		}

		get aspect(): float {
			return screen.width / screen.height;
		}

		get pixelDepth(): int {
			return screen.pixelDepth;
		}

		get colorDepth(): int {
			return screen.colorDepth;
		}
	}
}

#endif
