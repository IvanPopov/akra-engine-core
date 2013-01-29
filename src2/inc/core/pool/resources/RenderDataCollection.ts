#ifndef RENDERDATACOLLECTION_TS
#define RENDERDATACOLLECTION_TS

#include "IRenderDataCollection.ts"

module akra.core.pool.resources {

	export class RenderDataCollection implements IRenderDataCollection extends ReferenceCounter{
		private _pDataBuffer = null;
		private _pEngine: IEngine = null;
		private _eDataOptions: int = 0;
		private _pSubsetType = null;
		private _pDataArray = [];

		inline get buffer(): IVertexBuffer{
			return this._pDataBuffer;
		}

		inline get dataType(): IRenderDataType{
			return this._pSubsetType;
		}

		inline set dataType(pSubsetType: IRenderDataType){
			debug_assert(this._pSubsetType === null, 'subset type already set.');
        	this._pSubsetType = pSubsetType;
		}

        getEngine(): IEngine {
        	return this._pEngine;
        }

        getOptions(): int {
        	return this._eDataOptions;
        }

        /**
         * Find VertexData with given semantics/usage.
         */
        getData(): IVertexData {
        	var pData: IVertexData[];

        	if (this._pDataBuffer) {
        	    pData = pData = this._pDataBuffer._pVertexDataArray;
        	    if (typeof arguments[0] === 'string') {
        	        for (var i = 0; i < pData.length; i++) {
        	            if (pData[i].hasSemantics(arguments[0])) {
        	                return pData[i];
        	            }
        	        };
        	    }
        	    else {
        	        for (var i = 0; i < pData.length; i++) {
        	            if (pData[i].getOffset() === arguments[0]) {
        	                return pData[i];
        	            }
        	        };
        	    }
        	}

        	return null;
        }

        /**
         * Положить данные в буфер.
         */
        _allocateData(pVertexDecl: IVertexDeclaration, pData) {
        	if (!this._pDataBuffer) {
        	    this._createDataBuffer();
        	}

        	pVertexDecl = normalizeVertexDecl(pVertexDecl);
        	var pVertexData: IVertexData;
        	
        	if ((arguments.length < 2) || (typeof arguments[1] === 'number') || pData === null) {
        	    pVertexData = this._pDataBuffer.getEmptyVertexData(pData || 1, pVertexDecl);
        	}
        	else {
        	    pVertexData = this._pDataBuffer.allocateData(pVertexDecl, pData);    
        	}

        	debug_assert(pVertexData !== null, 'cannot allocate data:\n' + pVertexDecl.toString());
        	return pVertexData;
        }

        allocateData(pDataDecl: IVertexDeclaration, pData: ArrayBufferView, isCommon?: bool): int {
        	    isCommon = ifndef(isCommon, true);

        	    var pVertexData: IVertexData;

        	    pDataDecl = normalizeVertexDecl(pDataDecl);

        	Ifdef (__DEBUG);
        	    
        	    for (var i: int = 0; i < pDataDecl.length; i++) {
        	        if (this.getData(pDataDecl[i].eUsage) !== null && pDataDecl[i].nCount !== 0) { 
        	            warning("data buffer already contains data with similar vertex decloration <" + 
        	                pDataDecl[i].eUsage + ">.");
        	        }
        	    };

        	Endif ();

        	    pVertexData = this._allocateData(pDataDecl, pData);

        	    if (isCommon) {
        	        for (var i: int = 0; i < this._pDataArray.length; ++ i) {
        	            this._pDataArray[i]._addData(pVertexData);
        	        }
        	    }

        	    return pVertexData.getOffset();
        }

        getDataLocation(sSemantics: string): int {
        	if (this._pDataBuffer) {
        	    var pDataList: IVertexData[] = this._pDataBuffer._pVertexDataArray;
        	    
        	    for (var i: int = 0; i < pDataList.length; i++) {
        	        if (pDataList[i].hasSemantics(sSemantics)) {
        	            return pDataList[i].getOffset();
        	        }
        	    };
        	}

        	return -1;
        }

        private _createDataBuffer() {
            //TODO: add support for eOptions
            var iVbOption: int = 0;
            var iOptions: int = this._eDataOptions;

            if (iOptions & a.RenderDataBuffer.VB_READABLE) {
                SET_BIT(iVbOption, FLAG(a.VBufferBase.ReadableBit), true);
            }
            //trace('creating new video buffer for render data buffer ...');
            this._pDataBuffer = this._pEngine.pDisplayManager.videoBufferPool().createResource('render_data_buffer' + '_' + a.sid());
            this._pDataBuffer.create(0, iVbOption);
            this._pDataBuffer.addRef();
            return this._pDataBuffer !== null;
        };

        getRenderData(iSubset: uint): IRenderData {
        	return this._pDataArray[iSubset];
        }

        getEmptyRenderData(ePrimType: EPrimitiveTypes, iOptions: int): IRenderData {
        	debug_assert(this._pSubsetType !== null, 'subset type not specified.');

        	var iSubsetId: int = this._pDataArray.length;
        	var pDataset = new this._pSubsetType(this._pEngine);

        	eOptions |= this._eDataOptions;

        	if (!pDataset.setup(this, iSubsetId, ePrimType, eOptions)) {
        	    debug_error('cannot setup submesh...');
        	}
        	

        	this._pDataArray.push(pDataset);

        	return pDataset;
        }

        draw(iSubset: uint): bool {
        	if (iSubset !== undefined) {
        	    return this._pDataArray[iSubset].draw();
        	}

        	for (var i: int = 0; i < this._pDataArray.length; i++) {
        	    this._pDataArray[i].draw();
        	};

        	return true;
        }

        protected setup(eOptions: int) {
            this._eDataOptions = eOptions;
            if (!this._pSubsetType) {
                this._pSubsetType = a.RenderData;
            }
        };

        destroy(): void {
        	this._pDataArray = null
    
            if (this._pDataBuffer) {
                this._pDataBuffer.relese();
                this._pDataBuffer.destroy();
                this._pDataBuffer = null;
            }

            this._pEngine = null;
            this._eDataOptions = 0;
            this._pSubsetType = null;
        }
	}
}

#endif