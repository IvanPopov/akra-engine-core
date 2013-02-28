#ifndef ISTRING2D_TS
#define ISTRING2D_TS

module akra {
	export interface IString2d {
		x: int;
		y: int;
		//font: IFont2d;


		hide(): void;
		show(isVisible?: bool): void;
		
		append(s: string, pFont?: IFont2d): void;
		clear(): void;
		edit(s: string): void;

		toString(): string;
	}
}

#endif