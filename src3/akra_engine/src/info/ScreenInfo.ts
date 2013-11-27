/// <reference path="../idl/AIScreenInfo.ts" />


class ScreenInfo implements AIScreenInfo {
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

export = ScreenInfo;