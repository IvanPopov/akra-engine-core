// IFont2d interface
// [write description here...]

module akra {
	enum EFontStyles {
		ITALIC,
		BOLD
	}

	interface IFont2d {
		size: uint;
		htmlSize: string;
		color: uint;
		htmlColor: string;
		family: string;
		bold: boolean;
		italic: boolean;
	}
}

