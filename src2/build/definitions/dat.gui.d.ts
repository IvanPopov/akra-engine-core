declare module dat {
    class Controller {
        onChange(listener: (value: any) => void): Controller;
    }

    export class NumberControllerSlider extends Controller {
        min(value: number): NumberControllerSlider;
        max(value: number): NumberControllerSlider;
        step(value: number): NumberControllerSlider;
    }

    export class OptionController extends Controller {

    }

    export class GUI {
        //button
        add(object: any, property: string): Controller;
        //power bar
        add(object: any, property: string, min: number, max: number): NumberControllerSlider;
        //list
        add(object: any, property: string, values: string[]): OptionController;
        //list
        add(object: any, property: string, values: Object): OptionController;
        addFolder(name: string): GUI;
        addColor(object: any, property: string): Controller;
        open(): void;
    }
}

