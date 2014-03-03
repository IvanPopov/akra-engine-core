/// <reference path="../idl/IBufferMap.ts" />
/// <reference path="../idl/IVertexBuffer.ts" />
/// <reference path="../idl/IEngine.ts" />
/// <reference path="../idl/IVertexDeclaration.ts" />

/// <reference path="../util/ReferenceCounter.ts" />

/// <reference path="IndexData.ts" />
/// <reference path="Usage.ts" />
/// <reference path="../pool/resources/VertexBuffer.ts" />

/// <reference path="../events.ts" />
/// <reference path="../debug.ts" />
/// <reference path="../guid.ts" />
/// <reference path="../config/config.ts" />

//#ifdef WEBGL
//	#include "webgl/webgl.ts"
//	#include "webgl/WebGLRenderer.ts"
//#endif

module akra.data {
	import DeclUsages = data.Usages;

	interface IBuffersCompatibleMap {
		[handle: int]: IVertexData;
	}

	interface ISemanticsMap {
		[semantics: string]: IDataFlow;
	}

	export class BufferMap extends util.ReferenceCounter implements IBufferMap {
		guid: uint = guid();

		modified: ISignal<{ (pMap: IBufferMap): void; }>;

		private _pFlows: IDataFlow[] = null;
		private _pMappers: IDataMapper[] = null;
		private _pIndex: IIndexData = null;
		private _nLength: uint = 0;
		private _ePrimitiveType: EPrimitiveTypes;
		private _pCompleteFlows: IDataFlow[] = null;
		private _nCompleteFlows: uint = 0;
		private _nCompleteVideoBuffers: uint = 0;
		private _pCompleteVideoBuffers: IVertexBuffer[] = null;
		private _nUsedFlows: uint = 0;
		private _pEngine: IEngine = null;
		private _nStartIndex: uint = 0;
		private _pBuffersCompatibleMap: IBuffersCompatibleMap = null;
		private _pSemanticsMap: ISemanticsMap = null;
		private _nUpdates: int = 0;

		constructor(pEngine: IEngine) {
			super();
			this.setupSignals();

			this._pEngine = pEngine;
			this.reset();

			this.modified.connect(() => {
				this._nUpdates++;
			});
		}

		protected setupSignals(): void {
			this.modified = this.modified || <any> new Signal(this);
		}


		getPrimType(): EPrimitiveTypes {
			return this._pIndex ? this._pIndex.getPrimitiveType() : this._ePrimitiveType;
		}

		setPrimType(eType: EPrimitiveTypes): void {
			this._ePrimitiveType = eType;
			this.modified.emit();
		}

		getIndex(): IIndexData {
			return this._pIndex;
		}

		setIndex(pIndexData: IIndexData): void {
			if (this._pIndex === pIndexData) {
				return;
			}

			this._pIndex = pIndexData;
			this.update();
		}

		getLength(): uint {
			return (this._pIndex ? this._pIndex.getLength() : this._nLength);
		}

		setLength(nLength: uint): void {
			this._nLength = Math.min(this._nLength, nLength);
			this.modified.emit();
		}

		_setLengthForce(nLength: uint): void {
			this._nLength = nLength;
			this.modified.emit();
		}

		getTotalUpdates(): uint {
			return this._nUpdates;
		}

		getPrimCount(): uint {
			return IndexData.getPrimitiveCount(this.getPrimType(), this.getLength());
		}

		getLimit(): uint {
			return this._pFlows.length;
		}

		getStartIndex(): uint {
			return this._nStartIndex;
		}

		getSize(): uint {
			return this._nCompleteFlows;
		}

		getFlows(): IDataFlow[] {
			return this._pCompleteFlows;
		}

		getMappers(): IDataMapper[] {
			return this._pMappers;
		}

		getOffset(): uint {
			return (this._pIndex ? this._pIndex.getByteOffset() : 0);
		}

		_draw(): void {
			// this._pEngine.getComposer().applyBufferMap(this);
			// this._pEngine.getRenderer().getActiveProgram().applyBufferMap(this);
			isNull(this._pIndex) ? this.drawArrays() : this.drawElements();
		}

		private drawArrays(): void {
			if (config.WEBGL) {
				(<webgl.WebGLRenderer>this._pEngine.getRenderer()).getWebGLContext().drawArrays(
					webgl.getWebGLPrimitiveType(this._ePrimitiveType),
					// GL_POINTS,
					this._nStartIndex,
					this._nLength);
			}
			else {
				logger.critical("BufferMap::drawElements() unsupported for unknown API.");
			}
		}

		private drawElements(): void {
			if (config.WEBGL) {
				(<webgl.WebGLRenderer>this._pEngine.getRenderer()).getWebGLContext().drawElements(
					webgl.getWebGLPrimitiveType(this._ePrimitiveType),
					this._pIndex.getPrimitiveCount(),
					webgl.getWebGLPrimitiveType(this._pIndex.getPrimitiveType()),
					this._pIndex.getByteOffset() / 4);
				//FIXME: offset of drawElement() in Glintptr = long long = 32 byte???
			}
			else {
				logger.critical("BufferMap::drawElements() unsupported for unknown API.");
			}
		}

		getFlow(sSemantics: string, bComplete?: boolean): IDataFlow;
		getFlow(iFlow: int, bComplete?: boolean): IDataFlow;
		getFlow(iFlow: any, bComplete: boolean = true): IDataFlow {

			if (isString(arguments[0])) {
				var nTotal: int;
				var pFlows: IDataFlow[];

				if (bComplete) {
					pFlows = this._pCompleteFlows;
					nTotal = this._nCompleteFlows;
				}
				else {
					pFlows = this._pFlows;
					nTotal = this._pFlows.length;
				}

				for (var i: int = 0; i < nTotal; ++i) {
					if (!pFlows[i].data) {
						continue;
					}
					if (pFlows[i].data.hasSemantics(arguments[0])) {
						return pFlows[i];
					}
				}

				return null;
			}

			if (bComplete) {

				for (var i: int = 0, pFlows = this._pCompleteFlows; i < this._nCompleteFlows; ++i) {
					if (pFlows[i].flow == iFlow) {
						return pFlows[i];
					}
				}

				return null;
			}

			return this._pFlows[iFlow];
		}

		//TODO: It is temp method for test deoptimozation of code
		getFlowBySemantic(sSemantics: string): IDataFlow {
			for (var i: int = 0; i < this._nCompleteFlows; ++i) {
				if (this._pCompleteFlows[i].data.hasSemantics(sSemantics)) {
					return this._pCompleteFlows[i];
				}
			}

			return null;
		}

		reset(nFlowLimit: uint = 16): void {
			this._pIndex = null
		    this._ePrimitiveType = EPrimitiveTypes.TRIANGLELIST;


			//#ifdef WEBGL
			//			nFlowLimit = Math.min(16/*webgl.maxVertexTextureImageUnits*/, webgl.maxVertexAttributes);
			//#endif

			this._pMappers = [];
			this._pFlows = new Array<IDataFlow>(nFlowLimit);
			for (var i = 0; i < nFlowLimit; i++) {
				this._pFlows[i] = {
					flow: i,
					data: null,
					type: EDataFlowTypes.UNMAPPABLE,
					mapper: null
				}
		    }

			this._nLength = MAX_INT32;
			this._pCompleteFlows = new Array<IDataFlow>(nFlowLimit);
			this._nCompleteFlows = 0;
			this._nStartIndex = MAX_INT32;
			this._pBuffersCompatibleMap = <IBuffersCompatibleMap>{}

		    this._pCompleteVideoBuffers = new Array<IVertexBuffer>(nFlowLimit);
			this._nCompleteVideoBuffers = 0;
			this._nUsedFlows = 0;

			this._pSemanticsMap = {}
		    this._nUpdates = 0;

			this.modified.emit();
		}

		flow(pVertexData: IVertexData): int;
		flow(iFlow: uint, pVertexData: IVertexData): int;
		flow(iFlow, pData?): int {
			var pFlow: IDataFlow = null;
			var pVertexData: IVertexData = null;
			var isOk: boolean;

			if (arguments.length < 2) {
				pVertexData = <IVertexData>arguments[0];
				iFlow = (this._nUsedFlows++);
			}
			else {
				iFlow = arguments[0];
				pVertexData = arguments[1];
			}

			pFlow = this._pFlows[iFlow];

			debug.assert(iFlow < this.getLimit(),
				'Invalid strem. Maximum allowable number of stream ' + this.getLimit() + '.');

			if (!pVertexData || pFlow.data === pVertexData) {
				debug.warn("BufferMap::flow(", iFlow, pVertexData, ") failed.",
					isNull(pVertexData) ? "vertex data is null" : "flow.data alreay has same vertex data");
				return -1;
			}

			if (pool.resources.VertexBuffer.isVBO(<IVertexBuffer>pVertexData.getBuffer())) {
				pFlow.type = EDataFlowTypes.UNMAPPABLE;
				this.setLength(pVertexData.getLength());
				//this.startIndex = pVertexData.getStartIndex();
				isOk = this.checkData(pVertexData);
				debug.assert(isOk, "You can use several unmappable data flows from one buffer.");

				this.trackData(pVertexData);
			}
			else {
				pFlow.type = EDataFlowTypes.MAPPABLE;
			}

			if (isDefAndNotNull(pFlow.data)) {
				this.untrackData(pVertexData);
			}

			pFlow.data = pVertexData;

			return this.update() ? iFlow : -1;
		}

		private clearLinks(): void {
			for (var sSemantics in this._pSemanticsMap) {
				this._pSemanticsMap[sSemantics] = null;
			}
		}

		private linkFlow(pFlow: IDataFlow): void {
			var pDecl: IVertexDeclaration = pFlow.data.getVertexDeclaration();

			for (var i: int = 0; i < pDecl.getLength(); ++i) {
				var pElement: data.VertexElement = <data.VertexElement>pDecl.element(i);
				var sSemantics: string = pElement.semantics;

				if (pElement.isEnd()) {
					continue;
				}

				var isSemanticsExists: boolean = isDefAndNotNull(this._pSemanticsMap[sSemantics]);

				debug.assert(!isSemanticsExists, "overwrited semantics: " + sSemantics);

				if (!isSemanticsExists) {
					this._pSemanticsMap[sSemantics] = pFlow;
				}
			}

			if (pFlow.type === EDataFlowTypes.MAPPABLE) {
				var sSemantics: string = pFlow.mapper.semantics;
				var isSemanticsExists: boolean = isDefAndNotNull(this._pSemanticsMap[sSemantics]);

				debug.assert(!isSemanticsExists, "overwrited semantics(MAPPER!): " + sSemantics);

				if (!isSemanticsExists) {
					this._pSemanticsMap[sSemantics] = pFlow;
				}
			}
		}

		checkData(pData: IVertexData): boolean {
			var pEtalon = this._pBuffersCompatibleMap[pData.getBufferHandle()];

			if (!pEtalon || pEtalon.getByteOffset() === pData.getByteOffset()) {
				return true;
			}

			return false;
		}

		protected findMapping(pMap, eSemantics, iAddition): IDataMapper {
			var isOk: boolean = this.checkData(pMap);
			debug.assert(isOk, 'You can use several different maps from one buffer.');

			for (var i: int = 0, pMappers: IDataMapper[] = this._pMappers, pExistsMap; i < pMappers.length; i++) {
				pExistsMap = pMappers[i].data;
				if (pExistsMap === pMap) {
					//если уже заданные маппинг менял свой стартовый индекс(например при расширении)
					//то необходимо сменить стартовый индекс на новый
					if (pMappers[i].semantics === eSemantics && pMappers[i].addition == iAddition) {
						return pMappers[i];
					}
				}
				else {
					debug.assert(pExistsMap.getStartIndex() === pMap.getStartIndex(),
						'You can not use maps with different indexing');
				}
			}
			return null;
		}


		mapping(iFlow: int, pMap: IVertexData, eSemantics: string, iAddition: int = 0): boolean {
			var pMapper: IDataMapper = this.findMapping(pMap, eSemantics, iAddition);
			var pFlow: IDataFlow = this._pFlows[iFlow];

			debug.assert(isDefAndNotNull(pFlow.data) && (pFlow.type === EDataFlowTypes.MAPPABLE),
				'Cannot mapping empty/unmappable flow.');
			debug.assert(isDef(pMap), 'Passed empty mapper.');

			if (!eSemantics) {
				eSemantics = pMap.getVertexDeclaration()[0].eUsage;
			}
			else if (pMap.hasSemantics(eSemantics) === false) {
				debug.error('Passed mapper does not have semantics: ' + eSemantics + '.');
				return false;
			}

			if (pMapper) {
				if (pFlow.mapper === pMapper) {
					return pMapper.semantics === eSemantics &&
						pMapper.addition === iAddition ? true : false;
				}
			}
			else {
				pMapper = <IDataMapper>{
					data: pMap,
					semantics: eSemantics,
					addition: iAddition
				}

		        this._pMappers.push(pMapper);
				this.setLength(pMap.getLength());
				this.trackData(pMap);
			}

			pFlow.mapper = pMapper;

			return this.update();
		}

		private trackData(pData: IVertexData): void {
			//only one vertex data may be used in one veetex buffer
			//случаи, когда выделяются 2 vertex data'ы в одной области памяти не рассматриваются
			this._pBuffersCompatibleMap[pData.getBufferHandle()] = pData;

			pData.declarationChanged.connect(this.modified);
		}

		private untrackData(pData: IVertexData): void {
			delete this._pBuffersCompatibleMap[pData.getBufferHandle()];

			pData.declarationChanged.disconnect(this.modified);
		}

		update(): boolean {
			var pFlows: IDataFlow[] = this._pFlows;
			var pFlow: IDataFlow;
			var pMapper: IDataMapper;
			var isMappable: boolean = false;
			var pCompleteFlows: IDataFlow[] = this._pCompleteFlows;
			var nCompleteFlows: int = 0;
			var pCompleteVideoBuffers: IVertexBuffer[] = this._pCompleteVideoBuffers;
			var nCompleteVideoBuffers: int = 0;
			var nUsedFlows: int = 0;
			var pVideoBuffer: IVertexBuffer;
			var isVideoBufferAdded: boolean = false;
			var nStartIndex: int = MAX_INT32, nCurStartIndex: int;

			this.clearLinks();

			for (var i: int = 0; i < pFlows.length; i++) {
				pFlow = pFlows[i];
				pMapper = pFlow.mapper;
				isMappable = (pFlow.type === EDataFlowTypes.MAPPABLE);

				if (pFlow.data) {
					nUsedFlows++;
				}

				if (pFlow.data === null || (isMappable && pMapper === null)) {
					continue;
				}

				pCompleteFlows[nCompleteFlows++] = pFlow;
				this.linkFlow(pFlow);

				if (isMappable) {
					nCurStartIndex = pMapper.data.getStartIndex();
					pVideoBuffer = <IVertexBuffer>pFlow.data.getBuffer();
					for (var j = 0; j < nCompleteVideoBuffers; j++) {
						if (pCompleteVideoBuffers[j] === pVideoBuffer) {
							isVideoBufferAdded = true;
							break;
						}
					}
					if (!isVideoBufferAdded) {
						pCompleteVideoBuffers[nCompleteVideoBuffers++] = pVideoBuffer;
					}
				}
				else {
					nCurStartIndex = pFlow.data.getStartIndex();
				}

				if (nStartIndex === MAX_INT32) {
					nStartIndex = nCurStartIndex;
					continue;
				}

				debug.assert(nStartIndex == nCurStartIndex,
					'You can not use a maps or unmappable buffers having different starting index.');
			}

			this._nStartIndex = nStartIndex;
			this._nCompleteFlows = nCompleteFlows;
			this._nCompleteVideoBuffers = nCompleteVideoBuffers;
			this._nUsedFlows = nUsedFlows;

			this.modified.emit();

			return true;
		}

		findFlow(sSemantics: string): IDataFlow {
			return !isDef(this._pSemanticsMap[sSemantics]) ? (this._pSemanticsMap[sSemantics] = null) : this._pSemanticsMap[sSemantics];
		}

		clone(bWithMapping: boolean = true): IBufferMap {

			var pMap: IBufferMap = this._pEngine.createBufferMap();

			for (var i = 0, pFlows = this._pFlows; i < pFlows.length; ++i) {
				if (pFlows[i].data === null) {
					continue;
				}

				if (pMap.flow(pFlows[i].flow, pFlows[i].data) < 0) {
					pMap = null;
					debug.log("BufferMap::clone() failed on", pFlows[i].flow, pFlows[i].data);
					return null;
				}

				if (!bWithMapping) {
					continue;
				}

				if (pFlows[i].mapper) {
					pMap.mapping(pFlows[i].flow,
						pFlows[i].mapper.data,
						pFlows[i].mapper.semantics,
						pFlows[i].mapper.addition);
				}
			}

			return pMap;
		}

		toString(bListAll: boolean = false): string {
			if (config.DEBUG) {
				function _an(sValue, n: int, bBackward?: boolean) {
					sValue = String(sValue);
					bBackward = bBackward || false;

					if (sValue.length < n) {
						for (var i = 0, l = sValue.length; i < n - l; ++i) {
							if (!bBackward) {
								sValue += ' ';
							}
							else {
								sValue = ' ' + sValue;
							}
						}
					}

					return sValue;
				}

				var s = '\n\n', t;
				s += '      $1 Flows     : OFFSET / SIZE   |   BUFFER / OFFSET   :      Mapping  / Shift    : OFFSET |    Additional    \n';
				s = s.replace("$1", bListAll ? "   Total" : "Complete");
				t = '-------------------------:-----------------+---------------------:--------------------------:--------+------------------\n';
				// = '#%1 [ %2 ]           :     %6 / %7     |       %3 / %4       :         %5       :        |                  \n';
				// = '#%1 [ %2 ]           :     %6 / %7     |       %3 / %4       :         %5       :        |                  \n';
				s += t;

				var pFlows: IDataFlow[] = bListAll ? this._pFlows : this._pCompleteFlows;
				var nFlows: uint = bListAll ? this._nUsedFlows : this._nCompleteFlows;
				for (var i: int = 0; i < nFlows; ++i) {
					var pFlow: IDataFlow = pFlows[i];
					var pMapper: IDataMapper = pFlow.mapper;
					var pVertexData: IVertexData = pFlow.data;
					var pDecl: IVertexDeclaration = pVertexData.getVertexDeclaration();
					//trace(pMapper); window['pMapper'] = pMapper;
					s += '#' + _an(pFlow.flow, 2) + ' ' +
					_an('[ ' + (pDecl.element(0).usage !== DeclUsages.END ? pDecl.element(0).usage : '<end>') + ' ]', 20) +
					' : ' + _an(pDecl.element(0).offset, 6, true) + ' / ' + _an(pDecl.element(0).size, 6) +
					' | ' +
					_an(pVertexData.getBufferHandle(), 8, true) + ' / ' + _an(pVertexData.getByteOffset(), 8) +
					' : ' +
					(pMapper ? _an(pMapper.semantics, 15, true) + ' / ' + _an(pMapper.addition, 7) + ': ' +
					_an(pMapper.data.getVertexDeclaration().findElement(pMapper.semantics).offset, 6) :
					_an('-----', 25) + ': ' + _an('-----', 6)) + ' |                  \n';


					for (var j = 1; j < pDecl.getLength(); ++j) {
						s += '    ' +
						_an('[ ' + (pDecl.element(j).usage !== DeclUsages.END ? pDecl.element(j).usage : '<end>') + ' ]', 20) + ' : ' + _an(pDecl.element(j).offset, 6, true) + ' / ' + _an(pDecl.element(j).size, 6) +
						' |                     :                          :        |                  \n';
					}
					s += t;
				}
				s += '=================================================================\n';
				s += '      PRIMITIVE TYPE : ' + '0x' + Number(this.getPrimType()).toString(16) + '\n';
				s += '     PRIMITIVE COUNT : ' + this.getPrimCount() + '\n';
				s += '         START INDEX : ' + this.getStartIndex() + '\n';
				s += '              LENGTH : ' + this.getLength() + '\n';
				s += '  USING INDEX BUFFER : ' + (this.getIndex() ? 'TRUE' : 'FALSE') + '\n';
				s += '=================================================================\n';

				return s + '\n\n';
			}

			return null;
		}
	}

	export function createBufferMap(pEngine: IEngine): IBufferMap {
		return new BufferMap(pEngine);
	}
}
