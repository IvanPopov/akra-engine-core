#include "net/RPC.ts"
#include "util/testutils.ts"

module akra {
	export var pRpc: IRPC = null;

	test("init tests", () => {
		shouldBeNotNull("rpc");

		pRpc = net.createRpc({callsFrequency: 30});
		

		ok(pRpc);
	});

	const IMG_WIDTH = 1024;
	const IMG_HEIGHT = 1024;

	const BLOCK_WIDTH = 32;
	const BLOCK_HEIGHT = 32;

	const iRes = 16;

	var iBeginTime = 0;

	var pDebugCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement("canvas");
	var pDebugCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D>((<any>pDebugCanvas).getContext("2d"));

	document.body.appendChild(pDebugCanvas);

	pDebugCanvas.width = pDebugCanvas.height = IMG_WIDTH;
	pDebugCanvas.style.border = "1px solid #ccc";
	pDebugCanvas.style.zoom = ".5";


	var nBlocksLoaded = 0;
	var nBlocksTotal = (IMG_WIDTH / BLOCK_WIDTH) * (IMG_HEIGHT / BLOCK_HEIGHT);

	const pWrongBlock = new Uint8Array(BLOCK_HEIGHT * BLOCK_WIDTH * 3);
	for (var i = 0; i < pWrongBlock.length; i += 3) {
		pWrongBlock[i] = 255;
	}


	var pLastProcDuration: HTMLDivElement = <HTMLDivElement>document.createElement("div");
	var pAverageProcDuration: HTMLDivElement = <HTMLDivElement>document.createElement("div");

	pLastProcDuration.style.fontFamily = pAverageProcDuration.style.fontFamily = "consolas";

	document.body.appendChild(pLastProcDuration);
	document.body.appendChild(pAverageProcDuration);

	var nStatUpdatesTotal = 0;
	var iDurationTotal = 0;
	function updateStats(iProcDuration): void {

		iDurationTotal += iProcDuration;
		nStatUpdatesTotal ++;

		pLastProcDuration.textContent 	 = " 	last procedure duration: " + iProcDuration.toFixed(2) + " ms";
		pAverageProcDuration.textContent = "aveg. procedure duration: " + (iDurationTotal / nStatUpdatesTotal).toFixed(2) + " ms";
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
			console.log("level loaded for ", now() - iBeginTime, "ms");
			// ok(true);
			// run();
			// pRpc.detach();
			
			// if (iRes == 1) {
			// 	iRes = 32;
			// }
			// else {
			// 	iRes /= 2;
			// }

			iBeginTime = now();
			nBlocksLoaded = 0;
		}
		// else {
		// 	console.log(nBlocksLoaded, "/", nBlocksTotal);
		// }
	}

	export function getTextureFrom(x: uint, y: uint): void {
		var iBegin = now();
		pRpc.proc("getMegaTexture", "main", 
			IMG_WIDTH * iRes, IMG_HEIGHT * iRes, 	/* width, height */
			x, y, 									/* x, y */
			BLOCK_WIDTH, BLOCK_HEIGHT,				/* block size X, Y */ 
			0x1907,									/* RGB */
			(err: Error, pData: Uint8Array) => {
				if (!isNull(err)) {
					WARNING(err.message); 
				}
				
				updateStats(now() - iBegin);
				updateCanvas(pData, x, y); 
			});
	}

	var x: uint = 0, y: uint = 0;
	var n: int = 0;

	export function exploreWholeTexture(): void {
		

		if (x >= IMG_WIDTH) {
			x = 0;
			y += BLOCK_HEIGHT;
		}

		if (y >= IMG_HEIGHT) {
			y = 0;
		}
		// else {
			getTextureFrom(x, y);
			x += BLOCK_WIDTH;
			// if (n < 128) {
			// 	n ++;
			// 	exploreWholeTexture();
			// }
			// else {
			// 	n = 0;
				setTimeout(exploreWholeTexture, 1);
			// }
			// exploreWholeTexture();
		// }
	}

	asyncTest("fetch mega texture", () => {
		shouldBeTrue("fetch whole texture");

		pRpc.join("ws://localhost:6112");
		pRpc.bind(SIGNAL(joined), (pRpc: IRPC) => {
			iBeginTime = now();
			exploreWholeTexture();
		});
	});
}

