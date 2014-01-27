/// <reference path="../idl/IVertexData.ts" />
/// <reference path="../idl/IVertexDeclaration.ts" />
/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../pool/resources/VertexBuffer.ts" />
/// <reference path="webgl.ts" />

module akra.webgl {

	export class WebGLVertexBuffer extends pool.resources.VertexBuffer implements IVertexBuffer {
		protected _iByteSize: uint;

		protected _pWebGLBuffer: WebGLBuffer;

		private _pLockData: Uint8Array = null;
		protected _sCS: string = null;

		getType(): EVertexBufferTypes {
			return EVertexBufferTypes.VBO;
		}

		getByteLength(): uint {
			return this._iByteSize;
		}

		constructor(/*pManager: IResourcePoolManager*/) {
			super(/*pManager*/);
		}

		create(iByteSize: uint, iFlags: uint = EHardwareBufferFlags.STATIC, pData: ArrayBufferView = null): boolean {

			iByteSize = math.max(iByteSize, config.webgl.vertexbufferMinSize);

			if (bf.testAny(iFlags, EHardwareBufferFlags.READABLE)) {
				iFlags = bf.setAll(iFlags, EHardwareBufferFlags.BACKUP_COPY);
			}

			super.create(iByteSize, iFlags, pData);

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();
			var i: int;

			debug.assert(this._pWebGLBuffer == null, "webgl buffer already allocated");

			this._iByteSize = iByteSize;
			this._iFlags = iFlags;
			pWebGLContext = pWebGLRenderer.getWebGLContext();

			debug.assert(pWebGLContext !== null, "cannot grab webgl context");

			//Софтварного рендеринга буфера у нас нет
			debug.assert(!this.isSoftware(), "no sftware rendering");

			//Если есть локальная копия то буфер можно читать
			if (this.isBackupPresent()) {
				this._iFlags = bf.setAll(this._iFlags, EHardwareBufferFlags.READABLE);
			}

			debug.assert(!pData || pData.byteLength <= iByteSize,
				"Размер переданного массива больше переданного размера буфера");


			this._pWebGLBuffer = pWebGLRenderer.createWebGLBuffer();

			if (!this._pWebGLBuffer) {
				logger.critical("Не удалось создать буфер");

				this.destroy();
				return false;
			}

			pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, this._pWebGLBuffer);
			pWebGLContext.bufferData(gl.ARRAY_BUFFER, this._iByteSize, getWebGLUsage(this._iFlags));

			if (isDefAndNotNull(pData)) {
				/*pWebGLContext.bufferSubData(
					gl.ARRAY_BUFFER, 0, isArrayBuffer(pData)? <ArrayBuffer>pData: (<Uint8Array>pData).buffer);*/

				pWebGLContext.bufferSubData(gl.ARRAY_BUFFER, 0, pData.buffer);

			}

			return true;
		}

		destroy(): void {
			super.destroy();

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();

			pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);

			this._pWebGLBuffer = null;
			this._iByteSize = 0;
		}

		readData(ppDest: ArrayBufferView): boolean;
		readData(iOffset: uint, iSize: uint, ppDest: ArrayBufferView): boolean;
		readData(iOffset: any, iSize?: any, ppDest?: any): boolean {
			debug.assert(!isNull(this._pWebGLBuffer), "Буффер еще не создан");

			if (!this.isBackupPresent()) {
				return false;
			}

			if (arguments.length === 1) {
				this._pBackupCopy.readData(arguments[0]);
			}
			else {
				this._pBackupCopy.readData(iOffset, iSize, ppDest);
			}

			return true;
		}

		writeData(pData: Uint8Array, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: ArrayBufferView, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer?: boolean): boolean;
		writeData(pData: any, iOffset?: uint, iSize?: uint, bDiscardWholeBuffer: boolean = false): boolean {

			debug.assert(!isNull(this._pWebGLBuffer), "WebGL buffer not exists");

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, this._pWebGLBuffer);

			debug.assert(pData.byteLength <= iSize, "Размер переданного массива больше переданного размера");
			debug.assert(this.getByteLength() >= iOffset + iSize, "Данные выйдут за предел буфера");

			var pU8Data: Uint8Array = null;

			if (isArrayBuffer(pData)) {
				pU8Data = new Uint8Array(pData);
			}
			else {
				pU8Data = new Uint8Array(pData.buffer, pData.byteOffset, pData.byteLength);
			}

			pU8Data = pU8Data.subarray(0, iSize);

			pWebGLContext.bufferSubData(gl.ARRAY_BUFFER, iOffset, pU8Data);

			if (this.isBackupPresent()) {
				this._pBackupCopy.writeData(pU8Data, iOffset);
			}

			this.notifyAltered();

			return true;
		}

		resize(iSize: uint): boolean {
			var eUsage: int;
			var pData: Uint8Array;
			var iMax: int = 0;
			var pVertexData: IVertexData;

			var pWebGLRenderer: WebGLRenderer = <WebGLRenderer>this.getEngine().getRenderer();
			var pWebGLContext: WebGLRenderingContext = pWebGLRenderer.getWebGLContext();

			if (!this.isBackupPresent()) {
				debug.log("Not resized, because backup not present!");
				return false;
			}

			debug.log("WebGLVertexBuffer resized from " + this.getByteLength() + " to " + iSize + "(" + this.guid + ")");
			// debug.log(__CALLSTACK__);


			if (iSize < this.getByteLength()) {
				for (var k: int = 0; k < this._pVertexDataArray.length; ++k) {
					pVertexData = this._pVertexDataArray[k];

					if (pVertexData.getByteOffset() + pVertexData.getByteLength() > iMax) {
						iMax = pVertexData.getByteOffset() + pVertexData.getByteLength();
					}
				}

				debug.assert(iMax <= iSize,
					"Уменьшение невозможно. Страая разметка не укладывается в новый размер");
			}

			if (pWebGLContext.isBuffer(this._pWebGLBuffer)) {
				pWebGLRenderer.deleteWebGLBuffer(this._pWebGLBuffer);
			}

			eUsage = getWebGLUsage(this._iFlags);

			this._pWebGLBuffer = pWebGLRenderer.createWebGLBuffer();

			if (!this._pWebGLBuffer) {
				logger.critical("Не удалось создать буфер");

				this.destroy();
				return false;
			}


			pWebGLRenderer.bindWebGLBuffer(gl.ARRAY_BUFFER, this._pWebGLBuffer);
			pWebGLContext.bufferData(gl.ARRAY_BUFFER, iSize, eUsage);

			pData = new Uint8Array(this._iByteSize);

			if (!this.readData(pData)) {
				debug.warn("cannot read data from buffer");
				return false;
			}


			this.writeData(pData, 0, this._iByteSize);
			this._pBackupCopy.resize(iSize);
			this._iByteSize = iSize;

			this.notifyAltered();

			return true;
		}

		getWebGLBuffer(): WebGLBuffer {
			return this._pWebGLBuffer;
		}

		protected lockImpl(iOffset: uint, iSize: uint, iLockFlags: int): any {
			var pRetData: Uint8Array = new Uint8Array(iSize);

			this.readData(iOffset, iSize, pRetData);

			this._pLockData = pRetData;

			return pRetData;
		}

		protected unlockImpl(): void {
			this.writeData(this._pLockData, this._iLockStart, this._iLockSize);
		}

		protected copyBackupToRealImpl(pRealData: Uint8Array, pBackupData: Uint8Array, iLockFlags: int): void {
			pRealData.set(pBackupData);
		}
	}
}