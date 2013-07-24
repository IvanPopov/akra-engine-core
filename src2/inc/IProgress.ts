#ifndef IPROGRESS_TS
#define IPROGRESS_TS


module akra {
	export interface IProgress {
		canvas: HTMLCanvasElement;
                context: CanvasRenderingContext2D;
                step: number;
                counterclockwise: bool;
                radius: number;
                thickness: number;
                total: number[];
                border: number;
                lineWidth: number;
                indent: number;
                color: string;

                depth: number;
                element: number;


                fontColor: string;
                fontSize: number;
                size: number;

                width: number;
                height: number;

                loaded(): void;
                next(): void;
                reset(): void;
                draw(): void;
                drawText(sText: string): void;
                printText(sText: string): void;
                cancel(): void;
	}
}

#endif