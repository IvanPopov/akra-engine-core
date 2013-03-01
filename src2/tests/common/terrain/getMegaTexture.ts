#include "net/RPC.ts"
#include "util/testutils.ts"

module akra {
	export var pRpc: IRPC = null;

	test("init tests", () => {
		shouldBeNotNull("rpc");

		pRpc = net.createRpc();
		

		ok(pRpc);
	});

	const IMG_WIDTH = 1024;
	const IMG_HEIGHT = 1024;

	const BLOCK_WIDTH = 32;
	const BLOCK_HEIGHT = 32;

	var pDebugCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");
	var pDebugCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D>((<any>pDebugCanvas).getContext("2d"));

	pDebugCanvas.width = pDebugCanvas.height = IMG_WIDTH;
	pDebugCanvas.style.border = "1px solid #ccc";

	document.body.appendChild(pDebugCanvas);

	var nBlocksLoaded = 0;
	var nBlocksTotal = (IMG_WIDTH / BLOCK_WIDTH) * (IMG_HEIGHT / BLOCK_HEIGHT);

	const pWrongBlock = new Uint8Array(BLOCK_HEIGHT * BLOCK_WIDTH * 3);
	for (var i = 0; i < pWrongBlock.length; i += 3) {
		pWrongBlock[i] = 255;
	}

	function updateCanvas(pBuffer: Uint8Array, x, y): void {
		if (isNull(pBuffer)) {
			pBuffer = pWrongBlock;
		}

		var pData: ImageData = pDebugCtx.getImageData(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);

		for (var p = 0, p1 = 0; p < pData.data.length; p += 4) {
            pData.data[p + 0] = pBuffer[p1 + 0];
            pData.data[p + 1] = pBuffer[p1 + 1];
            pData.data[p + 2] = pBuffer[p1 + 2];
            pData.data[p + 3] = 255;

            p1 += 3;
		}
		
		pDebugCtx.putImageData(pData, x, y);
		nBlocksLoaded ++;

		if (nBlocksLoaded == nBlocksTotal) {
			ok(true);
			run();
			pRpc.detach();
		}
		else {
			//console.log(nBlocksLoaded, "/", nBlocksTotal);
		}
	}

	export function getTextureFrom(x: uint, y: uint): void {
		pRpc.proc("getMegaTexture", "main", 
			IMG_WIDTH, IMG_HEIGHT, 					/* width, height */
			x, y, 									/* x, y */
			BLOCK_WIDTH, BLOCK_HEIGHT,				/* block size X, Y */ 
			0x1907,									/* RGB */
			(err: Error, pData: Uint8Array) => {
				if (!isNull(err)) {
					WARNING(err.message); 
				}

				updateCanvas(pData, x, y); 
			});
	}

	var x: uint = 0, y: uint = 0;

	export function exploreWholeTexture(): void {
		

		if (x >= IMG_WIDTH) {
			x = 0;
			y += BLOCK_HEIGHT;
		}

		if (y >= IMG_HEIGHT) {
			y = 0;
		}
		else {
			getTextureFrom(x, y);
			x += BLOCK_WIDTH;
			exploreWholeTexture();
		}

		
	}

	//var iTimer: int = -1;

	asyncTest("fetch mega texture", () => {
		shouldBeTrue("fetch whole texture");

		pRpc.join("ws://localhost:6112");
		pRpc.bind(SIGNAL(joined), (pRpc: IRPC) => {
			exploreWholeTexture();
		});
	});
}

