#ifndef BUFFERMAP_TS
#define BUFFERMAP_TS

#include "IBufferMap.ts"

module akra.model {

	export class BufferMap implements IBufferMap extends ReferenceCounter{
		private _pFlows: IDataFlow[];
		private _nLength: uint;
		private _ePrimitiveType: EPrimitiveType;
		private _pCompleteFlows: IDataFlow[];
		private _nCompleteFlows: uint;
		private _nCompleteVideoBuffers: uint;
		private _pCompleteVideoBuffers;
		private _nUsedFlows: uint;
		private _nStartIndex: uint;
		private _pBuffersCompatibleMap;

		constructor(pEngine: IEngine){
			this._pEngine = pEngine;
			this.reset();
		}

		inline get primType(): EPrimitiveType{
			return this._pIndex ? this._pIndex.getPrimitiveType() : this._ePrimitiveType;
		}

		inline set primType(eType: EPrimitiveType){
			this._ePrimitiveType = eType;
		}

		inline get primCount(): uint{
			switch (this._ePrimitiveType) {
	            case a.PRIMTYPE.TRIANGLELIST:
	                return this.length / 3.;
	            case a.PRIMTYPE.POINTLIST:
	                return this.length;
	            case a.PRIMTYPE.TRIANGLESTRIP:
	        }

	        return undefined;
		}

		inline get index(): IIndexData {
			return this._pIndex;
		}

		inline set index(pIndexData: IIndexData) {
			if (this._pIndex === pIndexData) {
	            return;
	        }
	        this.draw = this.drawElements = pIndexData.drawElements;
	        this._pIndex = pIndexData;
	        this.update();
		}

		inline get limit(): uint {
			return this._pFlows.length;
		}

		inline get length(): uint {
			return (this._pIndex? this._pIndex.getCount(): this._nLength);
		}

		inline set length(nLength: uint) {
			this._nLength = Math.min(this._nLength, nLength);
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
			return (this._pIndex? this._pIndex.getOffset(): 0);
		}

		getFlow(iFlow: int, bComplete?: bool): IDataFlow {
			bComplete = ifndef(bComplete, true);

		    if (typeof arguments[0] === 'string') {
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
		            if (!pFlows[i].pData) {
		                continue;
		            }
		            if (pFlows[i].pData.hasSemantics(arguments[0])) {
		                return pFlows[i];
		            }
		        }

		        return null;
		    }
		    
		    if (bComplete) {
		        
		        for (var i: int = 0, pFlows = this._pCompleteFlows; i < this._nCompleteFlows; ++ i) {
		            if (pFlows[i].iFlow == iFlow) {
		                return pFlows[i];
		            }
		        }

		        return null;
		    }

		    return this._pFlows[iFlow];
		}
		reset(): void {
			this._pIndex = null
		    this._ePrimitiveType = a.PRIMTYPE.TRIANGLELIST;


		    var nFlowLimit = Math.min(
		        16,//a.info.graphics.maxVertexTextureImageUnits(pDevice),
		        info.graphics.maxVertexAttributes
		    );

		    this._pMappers = [];
		    this._pFlows = new Array(nFlowLimit);
		    for (var i = 0; i < nFlowLimit; i++) {
		        this._pFlows[i] = {
		            iFlow: i,
		            pData:  null,
		            eType:  a.BufferMap.FT_UNMAPPABLE,
		            pMapper:null
		        };
		    }

		    this._nLength = MAX_INT32;
		    this._pCompleteFlows = new Array(nFlowLimit);
		    this._nCompleteFlows = 0;
		    this._nStartIndex = MAX_INT32;
		    this._pBuffersCompatibleMap = {};

		    this._pCompleteVideoBuffers = new Array(nFlowLimit);
		    this._nCompleteVideoBuffers = 0;
		    this._nUsedFlows = 0;

		    this.draw = this.drawArrays;
		}

		flow(iFlow: uint, pVertexData: IVertexData): int {
			var pFlow: IDataFlow;

		    if (arguments.length < 2) {
		        pVertexData = arguments[0];
		        iFlow = (this._nUsedFlows ++);
		    }
		    // trace(iFlow, '<<==', pVertexData.getVertexDeclaration().toString());
		    // console.log((new Error).stack);
		    pFlow = this._pFlows[iFlow];

		    debug_assert(iFlow < this.limit,
		        'Invalid strem. Maximum allowable number of stream ' + this.limit + '.');

		    if (!pVertexData || pFlow.pData === pVertexData) {
		        return -1;
		    }

		    if (pVertexData.buffer instanceof a.VertexBuffer) {
		        pFlow.eType = a.BufferMap.FT_UNMAPPABLE;
		        this.length = pVertexData.getCount();
		        //this.startIndex = pVertexData.getStartIndex();
		        debug_assert(this.checkData(pVertexData),
		            'You can use several unmappable data flows from one buffer.');

		        this._pushEtalon(pVertexData);
		    }
		    else {
		        pFlow.eType = a.BufferMap.FT_MAPPABLE;
		    }

		    pFlow.pData = pVertexData;

		    return this.update()? iFlow: -1;
		}

		checkData(pData: IVertexData): bool {
			var pEtalon = this._pBuffersCompatibleMap[pData.resourceHandle()];
		    if (!pEtalon || pEtalon.offset === pData.offset) {
		        return true;
		    }
		    return false;
		}

		protected findMapping(pMap, eSemantics, iAddition) {
		    debug_assert(this.checkData(pMap), 'You can use several different maps from one buffer.');
		    for (var i = 0, pMappers = this._pMappers, pExistsMap; i < pMappers.length; i++) {
		        pExistsMap = pMappers[i].pData;
		        if (pExistsMap === pMap) {
		            //если уже заданные маппинг менял свой стартовый индекс(например при расширении)
		            //то необходимо сменить стартовый индекс на новый
		            if (pMappers[i].eSemantics === eSemantics && pMappers[i].iAddition == iAddition) {
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


		mapping(iFlow: int, pMap: IVertexData, sSemantics: string, iAddition?: int): bool {

		}
		update(): bool;
		clone(bWithMapping?: bool): IBufferMap; 
		toString(): string;
	}
}

#endif