/** @deprecated Move to idl/AIResourcePool.ts */
//export var INVALID_INDEX: int = 0xffff;





//export function 

(<any>window).URL = (<any>window).URL ? (<any>window).URL : (<any>window).webkitURL ? (<any>window).webkitURL : null;
(<any>window).BlobBuilder = (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder || (<any>window).BlobBuilder;
(<any>window).requestFileSystem = (<any>window).requestFileSystem || (<any>window).webkitRequestFileSystem;
(<any>window).requestAnimationFrame = (<any>window).requestAnimationFrame || (<any>window).webkitRequestAnimationFrame ||
(<any>window).mozRequestAnimationFrame;
(<any>window).WebSocket = (<any>window).WebSocket || (<any>window).MozWebSocket;
// (<any>window).storageInfo = (<any>window).storageInfo || (<any>window).webkitPersistentStorage ;
(<any>window).storageInfo = (<any>window).storageInfo || (<any>window).webkitTemporaryStorage;
(<any>navigator).gamepads = (<any>navigator).gamepads || (<any>navigator).webkitGamepads;
(<any>navigator).getGamepads = (<any>navigator).getGamepads || (<any>navigator).webkitGetGamepads;

Worker.prototype.postMessage = (<any>Worker).prototype.webkitPostMessage || Worker.prototype.postMessage;
