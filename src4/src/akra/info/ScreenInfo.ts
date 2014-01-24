/// <reference path="../idl/IScreenInfo.ts" />


module akra.info {

    export class ScreenInfo implements IScreenInfo {
        getWidth(): int {
            return screen.getWidth();
        }

        getHeight(): int {
            return screen.getHeight();
        }

        getAspect(): float {
            return screen.getWidth() / screen.getHeight();
        }

        getPixelDepth(): int {
            return screen.getPixelDepth();
        }

        getColorDepth(): int {
            return screen.getColorDepth();
        }
    }

}