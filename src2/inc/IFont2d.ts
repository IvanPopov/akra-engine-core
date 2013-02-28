#ifndef IFONT2D_TS
#define IFONT2D_TS

module akra {
	export enum FontStyle {
		ITALIC,
		BOLD
	};

	export interface IFont2d {
		size: uint;
		htmlSize: string;
		color: uint;
		htmlColor: string;
		family: string;
		bold: bool;
		italic: bool;
	}
}

#endif