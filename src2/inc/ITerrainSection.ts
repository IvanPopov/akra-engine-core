#ifndef ITERRAINSECTION_TS
#define ITERRAINSECTION_TS

module akra {
	IFACE(ITerrainSystem);
	IFACE(ISceneObject);
	IFACE(IRect2d);
	IFACE(IVertexElementInterface);
	IFACE(IRenderableObject);

	export interface ITerrainSection extends ISceneObject {
		readonly sectorX: uint;
		readonly sectorY: uint;
		readonly renderable: IRenderableObject;
		readonly terrainSystem: ITerrain;
		readonly sectionIndex: uint;
		readonly heightY: float;
		readonly heightX: float;
		readonly vertexDescription: IVertexElementInterface[];
		_internalCreate(pRootNode?: ISceneNode, pParentSystem?: ITerrain, iSectorX?: uint, iSectorY?: uint, iHeightMapX?: uint, iHeightMapY?: uint, iXVerts?: uint, iYVerts?: uint, pWorldRect?: IRect2d): bool;
		render(): bool;
		setRenderData(pData: IRenderData): void;
		prepareForRender(): void;
	}

	export function createSingleStripGrid (pIndexValues, iXVerts: uint, iYVerts: uint, iXStep: uint, iYStep: uint, iSride: uint, iFlags: uint): uint{
		//TRIANGLESTRIP
	    var iTotalStrips: uint = iYVerts - 1;
	    var iTotalIndexesPerStrip: uint = iXVerts << 1;

	    // the total number of indices is equal
	    // to the number of strips times the
	    // indices used per strip plus one
	    // degenerate triangle between each strip

	    //общее количество идексов равно количесву линий умноженному на колчесвто идексов в линии + вырожденный треуголник между полосами

	    var iTotalIndexes: uint = (iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1) - 2;

	    if(pIndexValues.length<iTotalIndexes)
		{
			return 0;
		}

	    var iIndex: uint = 0;
	    var iStartVert: uint = 0;
	    var iLineStep: uint = iYStep * iSride;

	    for (var j: uint = 0; j < iTotalStrips; ++j) {
	        var k: uint = 0;
	        var iVert: uint = iStartVert;
	        // create a strip for this row
	        for (k = 0; k < iXVerts; ++k) {
	            pIndexValues[iIndex++] = iVert;
	            pIndexValues[iIndex++] = iVert + iLineStep;
	            iVert += iXStep;
	        }
	        iStartVert += iLineStep;

	        if (j + 1 < iTotalStrips) {
	            // add a degenerate to attach to
	            // the next row
	            pIndexValues[iIndex++] = (iVert - iXStep) + iLineStep;
	            pIndexValues[iIndex++] = iStartVert;
	        }
	    }

	    // return
	    return iTotalIndexes;
	}

	export function getCountIndexForStripGrid(iXVerts: uint, iYVerts: uint): uint {
		//TRIANGLESTRIP
		var iTotalStrips: uint = iYVerts - 1;
		var iTotalIndexesPerStrip: uint = iXVerts << 1;
		var iTotalIndexes: uint = (iTotalStrips * iTotalIndexesPerStrip) + (iTotalStrips << 1) - 2;
		return iTotalIndexes;
	}
}

#endif