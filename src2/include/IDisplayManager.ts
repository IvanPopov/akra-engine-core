///<reference path="akra.ts" />

module akra {
    export interface IDisplayManager extends IManager {
        createDisplay3D(): IDisplay3d;
        createDisplay3D(pCanvas: HTMLCanvasElement): IDisplay3d;
    	createDisplay3D(sCanvas?: string): IDisplay3d;

        createDisplay2D(): IDisplay2d;

        getDisplay3D(iDisplay?: uint): IDisplay3d;
        getDisplay2D(iDisplay?: uint): IDisplay2d;
        getDisplay(iDisplay?: uint, eType?: EDisplayTypes): IDisplay;

        //enable all display
        display(): bool;
    }	
}