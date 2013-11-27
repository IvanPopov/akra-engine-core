/** @deprecated Move to idl/AIResourcePool.ts */
//export var INVALID_INDEX: int = 0xffff;
//export function
(window).URL = (window).URL ? (window).URL : (window).webkitURL ? (window).webkitURL : null;
(window).BlobBuilder = (window).WebKitBlobBuilder || (window).MozBlobBuilder || (window).BlobBuilder;
(window).requestFileSystem = (window).requestFileSystem || (window).webkitRequestFileSystem;
(window).requestAnimationFrame = (window).requestAnimationFrame || (window).webkitRequestAnimationFrame || (window).mozRequestAnimationFrame;
(window).WebSocket = (window).WebSocket || (window).MozWebSocket;

// (<any>window).storageInfo = (<any>window).storageInfo || (<any>window).webkitPersistentStorage ;
(window).storageInfo = (window).storageInfo || (window).webkitTemporaryStorage;
(navigator).gamepads = (navigator).gamepads || (navigator).webkitGamepads;
(navigator).getGamepads = (navigator).getGamepads || (navigator).webkitGetGamepads;

Worker.prototype.postMessage = (Worker).prototype.webkitPostMessage || Worker.prototype.postMessage;
//# sourceMappingURL=common.js.map
