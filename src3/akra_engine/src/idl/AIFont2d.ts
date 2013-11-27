// AIFont2d interface
// [write description here...]

module akra {
enum FontStyle {
	ITALIC,
	BOLD
};

interface AIFont2d {
	size: uint;
	htmlSize: string;
	color: uint;
	htmlColor: string;
	family: string;
	bold: boolean;
	italic: boolean;
}
}
