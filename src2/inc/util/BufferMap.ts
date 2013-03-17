#ifndef BUFFERMAP_TS
#define BUFFERMAP_TS

#include "IBufferMap.ts"
#include "IVertexBuffer.ts"
#include "IEngine.ts"
#include "core/pool/ReferenceCounter.ts"

#include "data/IndexData.ts"
#include "IVertexDeclaration.ts"

#ifdef WEBGL
	#include "webgl/webgl.ts"
	#include "webgl/WebGLRenderer.ts"
#endif

module akra.util {
	export interface IBuffersCompatibleMap {
		[handle: int]: IVertexData;
	}

	export class BufferMap implements IBufferMap extends ReferenceCounter{
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

		constructor(pEngine: IEngine){
			super();
			this._pEngine = pEngine;
			this.reset();
		};

		inline get primType(): EPrimitiveTypes{
			return this._pIndex ? this._pIndex.getPrimitiveType() : this._ePrimitiveType;
		};

		inline set primType(eType: EPrimitiveTypes){
			this._ePrimitiveType = eType;
		};

		inline get primCount(): uint {
			return data.IndexData.getPrimitiveCount(this.primType, this.length);
		};

		inline get index(): IIndexData {
			return this._pIndex;
		};

		inline set index(pIndexData: IIndexData) {
			if (this._pIndex === pIndexData) {
	            return;
	        }

	        this._pIndex = pIndexData;
	        this.update();
		};

		inline get limit(): uint {
			return this._pFlows.length;
		};

		inline get length(): uint {
			return (this._pIndex ? this._pIndex.length : this._nLength);
		}

		inline set length(nLength: uint) {
			this._nLength = Math.min(this._nLength, nLength);
		}

		inline set _length(nLength: uint) {
			this._nLength = nLength;
		}

		inline get startIndex(): uint {
			return this._nStartIndex;
		}

		inline get size(): uint{
			return this._nCompleteFlows;
		}

		inline get flows(): IDataFlow[] {
			return this._pCompleteFlows;
		}

		inline get mappers(): IDataMapper[] {
			return this._pMappers;
		}

		inline get offset(): uint {
			return (this._pIndex? this._pIndex.byteOffset: 0);
		}

		_draw(): void {
			this._pEngine.getRenderer().getActiveProgram().applyBufferMap(this);
			isNull(this._pIndex)? this.drawArrays(): this.drawElements();
		}

		private inline drawArrays(): void {
#ifdef WEBGL
			(<webgl.WebGLRenderer>this._pEngine.getRenderer()).getWebGLContext().drawArrays(
				webgl.getWebGLPrimitiveType(this._ePrimitiveType), 
				this._nStartIndex, 
				this._nLength);
#else
		CRITICAL("BufferMap::drawElements() unsupported for unknown API.");			
#endif
		}

		private inline drawElements(): void {
#ifdef WEBGL
			(<webgl.WebGLRenderer>this._pEngine.getRenderer()).getWebGLContext().drawElements(
				this.primCount, 
				this._pIndex.getPrimitiveCount(), 
				webgl.getWebGLPrimitiveType(this._pIndex.getPrimitiveType()), 
				this._pIndex.byteOffset / 4); 
			//FIXME: offset of drawElement() in Glintptr = long long = 32 byte???
#else
		CRITICAL("BufferMap::drawElements() unsupported for unknown API.");			
#endif
		}

		getFlow(sSemantics: string, bComplete: bool = true): IDataFlow;
		getFlow(iFlow: int, bComplete: bool = true): IDataFlow;
		getFlow(iFlow: any, bComplete: bool = true): IDataFlow {

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

		        for (var i: int = 0; i < nTotal; ++ i) {
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
		        
		        for (var i: int = 0, pFlows = this._pCompleteFlows; i < this._nCompleteFlows; ++ i) {
		            if (pFlows[i].flow == iFlow) {
		                return pFlows[i];
		            }
		        }

		        return null;
		    }

		    return this._pFlows[iFlow];
		}

		reset(): void {
			this._pIndex = null
		    this._ePrimitiveType = EPrimitiveTypes.TRIANGLELIST;


		    var nFlowLimit: uint = 16;
#ifdef WEBGL
			nFlowLimit = Math.min(16/*webgl.maxVertexTextureImageUnits*/, webgl.maxVertexAttributes);
#endif

		    this._pMappers = [];
		    this._pFlows = new Array(nFlowLimit);
		    for (var i = 0; i < nFlowLimit; i++) {
		        this._pFlows[i] = {
		            flow: i,
		            data:  null,
		            type:  EDataFlowTypes.UNMAPPABLE,
		            mapper:null
		        };
		    }

		    this._nLength = MAX_INT32;
		    this._pCompleteFlows = new Array(nFlowLimit);
		    this._nCompleteFlows = 0;
		    this._nStartIndex = MAX_INT32;
		    this._pBuffersCompatibleMap = <IBuffersCompatibleMap>{};

		    this._pCompleteVideoBuffers = new Array(nFlowLimit);
		    this._nCompleteVideoBuffers = 0;
		    this._nUsedFlows = 0;
		}

		flow(pVertexData: IVertexData): int;
		flow(iFlow: uint, pVertexData: IVertexData): int;
		flow(iFlow, pData?): int {
			var pFlow: IDataFlow = null;
			var pVertexData: IVertexData = null;

		    if (arguments.length < 2) {
		        pVertexData = <IVertexData>arguments[0];
		        iFlow = (this._nUsedFlows ++);
		    }
		    // trace(iFlow, '<<==', pVertexData.getVertexDeclaration().toString());
		    // console.log((new Error).stack);
		    pFlow = this._pFlows[iFlow];

		    debug_assert(iFlow < this.limit,
		        'Invalid strem. Maximum allowable number of stream ' + this.limit + '.');

		    if (!pVertexData || pFlow.data === pVertexData) {
		        return -1;
		    }

		    if (pVertexData.buffer instanceof webgl.WebGLVertexBuffer/*core.pool.resources.VertexBuffer*/) {
		        pFlow.type = EDataFlowTypes.UNMAPPABLE;
		        this.length = pVertexData.length;
		        //this.startIndex = pVertexData.getStartIndex();
		        debug_assert(this.checkData(pVertexData),
		            'You can use several unmappable data flows from one buffer.');

		        this.pushEtalon(pVertexData);
		    }
		    else {
		        pFlow.type = EDataFlowTypes.MAPPABLE;
		    }

		    pFlow.data = pVertexData;

		    return this.update() ? iFlow : -1;
		}

		checkData(pData: IVertexData): bool {
			var pEtalon = this._pBuffersCompatibleMap[pData.getBufferHandle()];
		    if (!pEtalon || pEtalon.byteOffset === pData.byteOffset) {
		        return true;
		    }
		    return false;
		}

		protected findMapping(pMap, eSemantics, iAddition): IDataMapper {
		    debug_assert(this.checkData(pMap), 'You can use several different maps from one buffer.');
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
		            debug_assert(pExistsMap.getStartIndex() === pMap.getStartIndex(),
		                'You can not use maps with different indexing');
		        }
		    }
		    return null;
		};


		mapping(iFlow: int, pMap: IVertexData, eSemantics: string, iAddition?: int): bool {
			iAddition = iAddition || 0;

		    var pMapper: IDataMapper = this.findMapping(pMap, eSemantics, iAddition);
		    var pFlow: IDataFlow     = this._pFlows[iFlow];

		    debug_assert(isDefAndNotNull(pFlow.data) && (pFlow.type === EDataFlowTypes.MAPPABLE),
		        'Cannot mapping empty/unmappable flow.');
		    debug_assert(isDef(pMap), 'Passed empty mapper.');

		    if (!eSemantics) {
		        eSemantics = pMap.getVertexDeclaration()[0].eUsage;
		    }
		    else if (pMap.hasSemantics(eSemantics) === false) {
		        debug_error('Passed mapper does not have semantics: ' + eSemantics + '.');
		        return false;
		    }

		    if (pMapper) {
		        if (pFlow.mapper === pMapper) {
		            return pMapper.semantics === eSemantics &&
		                pMapper.addition === iAddition? true: false;
		        }
		    }
		    else {
		        pMapper = {data: pMap, semantics: eSemantics, addition: iAddition};

		        this._pMappers.push(pMapper);
		        this.length = pMap.length;
		        //this.startIndex = pMap.getStartIndex();
		        this.pushEtalon(pMap);
		    }

		    pFlow.mapper = pMapper;

		    return this.update();
		}

		private pushEtalon(pData: IVertexData): void {
			this._pBuffersCompatibleMap[pData.getBufferHandle()] = pData;
		}

		update(): bool {
			var pFlows: IDataFlow[] = this._pFlows;
		    var pFlow: IDataFlow;
		    var pMapper: IDataMapper;
		    var isMappable: bool = false;
		    var pCompleteFlows: IDataFlow[] = this._pCompleteFlows;
		    var nCompleteFlows: int = 0;
		    var pCompleteVideoBuffers: IVertexBuffer[] = this._pCompleteVideoBuffers;
		    var nCompleteVideoBuffers: int = 0;
		    var nUsedFlows: int = 0;
		    var pVideoBuffer: IVertexBuffer;
		    var isVideoBufferAdded: bool = false;
		    var nStartIndex: int = MAX_INT32, nCurStartIndex: int;

		    for (var i: int = 0; i < pFlows.length; i++) {
		        pFlow = pFlows[i];
		        pMapper = pFlow.mapper;
		        isMappable = (pFlow.type === EDataFlowTypes.MAPPABLE);
		        
		        if (pFlow.data) {
		            nUsedFlows ++;
		        }

		        if (pFlow.data === null || (isMappable && pMapper === null)) {
		            continue;
		        }

		        pCompleteFlows[nCompleteFlows ++] = pFlow;

		        if (isMappable) {
		            nCurStartIndex = pMapper.data.startIndex;
		            pVideoBuffer = <IVertexBuffer>pFlow.data.buffer;
		            for (var j = 0; j < nCompleteVideoBuffers; j++) {
		                if (pCompleteVideoBuffers[j] === pVideoBuffer) {
		                    isVideoBufferAdded = true;
		                    break;
		                }
		            }
		            if (!isVideoBufferAdded) {
		                pCompleteVideoBuffers[nCompleteVideoBuffers ++] = pVideoBuffer;
		            }
		        }
		        else {
		            nCurStartIndex = pFlow.data.startIndex;
		        }

		        if (nStartIndex === MAX_INT32) {
		            nStartIndex = nCurStartIndex;
		            continue;
		        }

		        debug_assert(nStartIndex == nCurStartIndex,
		            'You can not use a maps or unmappable buffers having different starting index.');
		    }

		    this._nStartIndex = nStartIndex;
		    this._nCompleteFlows = nCompleteFlows;
		    this._nCompleteVideoBuffers = nCompleteVideoBuffers;
		    this._nUsedFlows = nUsedFlows;

		    return true;
		}
		clone(bWithMapping?: bool): IBufferMap {
			bWithMapping = isDef(bWithMapping) ? bWithMapping : true;

		    var pMap: IBufferMap = new BufferMap(this._pEngine);
		    for (var i = 0, pFlows = this._pFlows; i < pFlows.length; ++ i) {
		        if (pFlows[i].data === null) {
		            continue;
		        }

		        if (pMap.flow(pFlows[i].flow, pFlows[i].data) < 0) {
		            pMap = null;
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
		toString(bListAll: bool = false): string {
			function _an(sValue, n: int, bBackward?: bool) {
		        sValue = String(sValue);
		        bBackward = bBackward || false;

		        if (sValue.length < n) {
		            for (var i = 0, l = sValue.length; i < n - l; ++ i) {
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
		    s = s.replace("$1", bListAll? "   Total": "Complete");
		    t  = '-------------------------:-----------------+---------------------:--------------------------:--------+------------------\n';
		    // = '#%1 [ %2 ]           :     %6 / %7     |       %3 / %4       :         %5       :        |                  \n';
		    // = '#%1 [ %2 ]           :     %6 / %7     |       %3 / %4       :         %5       :        |                  \n';
		    s += t;

		    var pFlows: IDataFlow[] = bListAll? this._pFlows: this._pCompleteFlows;
		    var nFlows: uint = bListAll? this._nUsedFlows: this._nCompleteFlows;
		    for (var i: int = 0; i < nFlows; ++ i) {
		        var pFlow: IDataFlow = pFlows[i];
		        var pMapper: IDataMapper = pFlow.mapper;
		        var pVertexData: IVertexData = pFlow.data;
		        var pDecl: data.VertexDeclaration = pVertexData.getVertexDeclaration();
		        //trace(pMapper); window['pMapper'] = pMapper;
		        s += '#' + _an(pFlow.flow, 2) + ' ' + 
		            _an('[ ' + (pDecl.element(0).usage !== DeclUsages.END? pDecl.element(0).usage: '<end>') + ' ]', 20) + 
		            ' : ' + _an(pDecl.element(0).offset, 6, true) + ' / ' + _an(pDecl.element(0).size, 6) + 
		            ' | ' + 
		            _an(pVertexData.getBufferHandle(), 8, true) + ' / ' + _an(pVertexData.byteOffset, 8) + 
		            ' : ' + 
		            (pMapper? _an(pMapper.semantics, 15, true) + ' / ' + _an(pMapper.addition, 7) + ': ' + 
		                _an(pMapper.data.getVertexDeclaration().findElement(pMapper.semantics).offset, 6) :
		            _an('-----', 25) + ': ' + _an('-----', 6)) + ' |                  \n';
		        

		        for (var j = 1; j < pDecl.length; ++ j) {
		            s += '    ' + 
		            _an('[ ' + (pDecl.element(j).usage !== DeclUsages.END? pDecl.element(j).usage: '<end>') + ' ]', 20) + ' : ' + _an(pDecl.element(j).offset, 6, true) + ' / ' + _an(pDecl.element(j).size, 6) +  
		                  ' |                     :                          :        |                  \n';
		        }
		        s += t;
		    };
		    s += '=================================================================\n';
		    s += '      PRIMITIVE TYPE : ' + '0x' + Number(this.primType).toString(16) + '\n';
		    s += '     PRIMITIVE COUNT : ' + this.primCount + '\n';
		    s += '         START INDEX : ' + this.startIndex + '\n';
		    s += '              LENGTH : ' + this.length + '\n';
		    s += '  USING INDEX BUFFER : ' + (this.index? 'TRUE': 'FALSE') + '\n';
		    s += '=================================================================\n';

		    return s + '\n\n';
		}
	}

	export function createBufferMap(pEngine: IEngine): IBufferMap {
		return new BufferMap(pEngine);
	}
}

#endif