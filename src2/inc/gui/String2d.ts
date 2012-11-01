///<reference path="../akra.ts" />

module akra.gui {
	export class String2d implements IString2d {
		private pSpan: HTMLSpanElement = null;
		private pLastSpan: HTMLSpanElement = null;
		private pFont: IFont2d;

		get x(): int { return parseInt(this.pSpan.style.left); }
		get y(): int { return parseInt(this.pSpan.style.top); }
		//font: IFont2d;

		constructor (iX: int = 0, iY: int = 0, sStr: string = "", pParent: HTMLElement = document.body, pFont: IFont2d = new gui.Font2d()) {
			var pSpan: HTMLSpanElement = <HTMLSpanElement>document.createElement("span");
			var pStyle: CSSStyleDeclaration = pSpan.style;

			pStyle.position = "absolute";
		    pStyle.left = String(iX) + 'px';
		    pStyle.top = String(iY) + 'px';

		    this.addSpan(sStr, pFont, pSpan);

    		pParent.appendChild(pSpan);

    		this.pSpan = pSpan;
    		this.pLastSpan = pSpan;
		}

		hide(): void {
			this.show(false);
		}

		show(isVisible: bool = true): void {
			this.pSpan.style.visibility = isVisible? "visible": "hidden";
		}
		
		append(sStr: string, pFont?: IFont2d): void {
			if (isDef(pFont)) {
		        var pStyle: CSSStyleDeclaration = this.pLastSpan.style;

		        if (pStyle.fontSize != pFont.htmlSize ||
		            pStyle.color != pFont.htmlColor ||
		            pStyle.fontFamily != pFont.family ||
		            pStyle.fontWeight != (pFont.bold? "bold": "") ||
		            pStyle.fontStyle != (pFont.italic? "italic": "")) {

		            this.addSpan(sStr, pFont);
		        }
		        else {
		            this.pLastSpan.innerHTML += sStr;
		        }
		    }
		    else {
		        this.pLastSpan.innerHTML += sStr;
		    }
		}

		clear(): void {
			this.pSpan.innerHTML = null;
    		this.pLastSpan = this.pSpan;
		}

		edit(sStr: string): void {
			this.pSpan.innerHTML = sStr;
			this.pLastSpan = this.pSpan;
		}

		toString(): string {
			return this.pSpan.innerHTML;
		}

		private addSpan(sStr: string, pFont: IFont2d, pSpan: HTMLSpanElement = <HTMLSpanElement>document.createElement('span')): void {
			var pStyle: CSSStyleDeclaration = pSpan.style;

		    pStyle.fontSize = pFont.htmlSize;
		    pStyle.color = pFont.htmlColor;
		    pStyle.fontFamily = pFont.family;
		    pStyle.fontWeight = (pFont.bold? "bold": "");
		    pStyle.fontStyle = (pFont.italic? "italic": "");

		    (<any>pStyle).webkitUserSelect = "none";
    		(<any>pStyle).mozUserSelect = "none";

		    pSpan.innerHTML = sStr;

		    if (this.pSpan) {
			    this.pSpan.appendChild(pSpan);
			    this.pLastSpan = pSpan;
		    }
		}
	}
}