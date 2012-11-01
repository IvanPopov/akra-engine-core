///<reference path="../akra.ts" />

module akra.gui {
	export class Font2d implements IFont2d {
		private iColor: uint;
		private nSize: uint;
		private iStyle: int;
		private sFamily: string;

		constructor (nSize: uint = 12, iColor: uint = 0xFFFFFF, iStyle: int = 0, sFontFamily: string = "monospace") {
			this.nSize = nSize;
			this.iColor = iColor;
			this.iStyle = iStyle;
		}

		/** @inline */
		get size(): uint { return this.nSize; }
		/** @inline */
		set size(nSize: uint) { this.nSize = nSize; }

		/** @inline */
		get color(): uint { return this.iColor; }
		/** @inline */
		set color(iColor: uint) { this.iColor = iColor; }

		/** @inline */
		get family(): string { return this.sFamily; }
		/** @inline */
		set family(sFamily: string) { this.sFamily = sFamily; }

		/** @inline */
		get bold(): bool { return bf.testBit(this.iStyle, <number>FontStyle.BOLD); }
		/** @inline */
		set bold(bValue: bool) { this.iStyle = bf.setBit(this.iStyle, <number>FontStyle.BOLD, bValue); }

		/** @inline */
		get italic(): bool { return bf.testBit(this.iStyle, <number>FontStyle.BOLD); }
		/** @inline */
		set italic(bValue: bool) { this.iStyle = bf.setBit(this.iStyle, <number>FontStyle.ITALIC, bValue); }
		
		/** @inline */
		get htmlColor(): string {
			return "#" + Number(this.iColor).toString(16);
		}
		
		/** @inline */
		get htmlSize(): string {
			return String(this.size) + "px";
		}
	}
}