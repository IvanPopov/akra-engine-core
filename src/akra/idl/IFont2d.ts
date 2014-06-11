// IFont2d export interface
// [write description here...]

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
	bold: boolean;
	italic: boolean;
}
}
