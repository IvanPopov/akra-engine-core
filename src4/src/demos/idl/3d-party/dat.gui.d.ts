declare module dat {
	class Controller {
		__precision: number;

		onChange(listener: (value: any) => void): Controller;
		name(text: string): Controller;
		listen(): Controller;
		updateDisplay(): Controller;
	}

	export class NumberControllerSlider extends Controller {
		min(value: number): NumberControllerSlider;
		max(value: number): NumberControllerSlider;
		step(value: number): NumberControllerSlider;
	}

	export class OptionController extends Controller {

	}

	export class GUI {
		__controllers: any;
		autoListen: boolean;

		listen();

		//button
		add(object: any, property: string): Controller;
		//power bar
		add(object: any, property: string, min: number, max: number, step?: number): NumberControllerSlider;
		//list
		add(object: any, property: string, values: string[]): OptionController;
		//list
		add(object: any, property: string, values: Object): OptionController;
		addFolder(name: string): GUI;
		addColor(object: any, property: string): Controller;
		open(): void;
	}
}

