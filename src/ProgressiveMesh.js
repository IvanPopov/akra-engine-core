/**
 * @author reinor
 */

Enum([
         CIRCLE,
         UNCIRCLE
     ], GROUPS_TYPE, a.ProgressiveMesh);

function computeAdjacencyBuffer(pVertices,pIndexes){
    var nVerticesCount = pVertices.length/3;
    var i,j,k;
    var nVertex0,nVertex1,nVertex2;
    var pVerticesAdjacency = [];
    for(i=0;i<nVerticesCount;i++){
        pVerticesAdjacency[i] = [];
    }
    var pAdjacencyBuffer = [];
    for(i=0;i<pIndexes.length/3;i++){
        //по хардкору
        nVertex0 = pIndexes[3*i];
        nVertex1 = pIndexes[3*i + 1];
        nVertex2 = pIndexes[3*i + 2];

        if(nVertex0 == nVertex1 || nVertex1 == nVertex2 || nVertex0 == nVertex2){
            console.error(i,"same vertex",nVertex0,nVertex1,nVertex2);
            continue;
            //alert(1);
        }
        if(nVertex0 < nVertex1){
            if(nVertex1 < nVertex2){
                pVerticesAdjacency[nVertex0].push([i,nVertex1,nVertex2]);
                pVerticesAdjacency[nVertex1].push([i,nVertex2]);
            }
            else if(nVertex0 < nVertex2){
                pVerticesAdjacency[nVertex0].push([i,nVertex2,nVertex1]);
                pVerticesAdjacency[nVertex2].push([i,nVertex1]);
            }
            else{
                pVerticesAdjacency[nVertex2].push([i,nVertex0,nVertex1]);
                pVerticesAdjacency[nVertex0].push([i,nVertex1]);
            }
        }
        else{
            if(nVertex0 < nVertex2){
                pVerticesAdjacency[nVertex1].push([i,nVertex0,nVertex2]);
                pVerticesAdjacency[nVertex0].push([i,nVertex2]);
            }
            else if(nVertex1 < nVertex2){
                pVerticesAdjacency[nVertex1].push([i,nVertex2,nVertex0]);
                pVerticesAdjacency[nVertex2].push([i,nVertex0]);
            }
            else{
                pVerticesAdjacency[nVertex2].push([i,nVertex1,nVertex0]);
                pVerticesAdjacency[nVertex1].push([i,nVertex0]);
            }
        }
        pAdjacencyBuffer[i] = [];
    }
    
    
    for(i=0;i<pVerticesAdjacency.length;i++){
        var pVertex = pVerticesAdjacency[i];
        
        for(j=0;j<pVertex.length;j++){
            var pData1 = pVertex[j];
                
            for(k=j+1;k<pVertex.length;k++){
                var pData2 = pVertex[k];

                if(pData1[1] == pData2[1]){
                    pAdjacencyBuffer[pData1[0]].push(pData2[0]);
                    pAdjacencyBuffer[pData2[0]].push(pData1[0]);
                }
                else{
                    if(pData2.length == 3){
                        if(pData1[1] == pData2[2]){
                            pAdjacencyBuffer[pData1[0]].push(pData2[0]);
                            pAdjacencyBuffer[pData2[0]].push(pData1[0]);
                        }
                        else if(pData1.length == 3){
                            if(pData1[2] == pData2[1]){
                                pAdjacencyBuffer[pData1[0]].push(pData2[0]);
                                pAdjacencyBuffer[pData2[0]].push(pData1[0]);
                            }
                            else if(pData1[2] == pData2[2]){
                                pAdjacencyBuffer[pData1[0]].push(pData2[0]);
                                pAdjacencyBuffer[pData2[0]].push(pData1[0]);
                            }
                        }
                    }
                    else if(pData1.length == 3){
                        if(pData1[2] == pData2[1]){
                            pAdjacencyBuffer[pData1[0]].push(pData2[0]);
                            pAdjacencyBuffer[pData2[0]].push(pData1[0]);
                        }
                    }
                }
            }     
        }
    }
    return pAdjacencyBuffer;
};

function performDownsampling(pVertices,pNormals,pIndexesOriginal,fThreshold){
    var pIndexes = pIndexesOriginal.slice(0,pIndexesOriginal.length); //копируем индексы

    optimizeMesh(pVertices,pIndexes);

	var pVertexFaces = [];
    var pFacesNormals = []; //хранит нормали для каждого полигона

    if(pNormals){
        for(var i=0;i<pIndexes.length/3;i++){
            var pFaceNormals = [];//нормали для данного полигона

            var fNormalX = 0;
            var fNormalY = 0;
            var fNormalZ = 0;
            //вычисляем среднюю нормаль на полигон
            for(var j=0;j<3;j++){
                var nIndex = pIndexes[3*i+j];
                var pNormalStartIndex = 3*nIndex;

                fNormalX += pNormals[pNormalStartIndex    ];
                fNormalY += pNormals[pNormalStartIndex + 1];
                fNormalZ += pNormals[pNormalStartIndex + 2];
            }
            //нормаль должна быть единичной длины
            var fLength = Math.sqrt(fNormalX*fNormalX + fNormalY*fNormalY + fNormalY*fNormalY);
            if(fLength != 0){
                pFacesNormals.push(fNormalX/fLength,fNormalY/fLength,fNormalZ/fLength);
            }
            else{
                pFacesNormals.push(0,0,0);
            }
        }
    }
    else{
        var v3fVertex0 = new Vector3;
        var v3fVertex1 = new Vector3;
        var v3fVertex2 = new Vector3;

        var v3fDirection1 = new Vector3;
        var v3fDirection2 = new Vector3;

        var v3fNormal = new Vector3;

        for(var i=0;i<pIndexes.length/3;i++){
            var nIndex0 = pIndexes[3*i    ];
            var nIndex1 = pIndexes[3*i + 1];
            var nIndex2 = pIndexes[3*i + 2];

            var pVertex0 = pVertices.slice(3*nIndex0,3*nIndex0 + 3);
            var pVertex1 = pVertices.slice(3*nIndex0,3*nIndex0 + 3);
            var pVertex2 = pVertices.slice(3*nIndex0,3*nIndex0 + 3);

            Vec3.set(pVertex0,v3fVertex0);
            Vec3.set(pVertex1,v3fVertex1);
            Vec3.set(pVertex2,v3fVertex2);

            Vec3.subtract(v3fVertex1,v3fVertex0,v3fDirection1);
            Vec3.subtract(v3fVertex2,v3fVertex0,v3fDirection2);

            Vec3.cross(v3fDirection1,v3fDirection2,v3fNormal);

            Vec3.normalize(v3fNormal);

            pFacesNormals.push(v3fNormal.X,v3fNormal.Y,v3fNormal.Z);
        }
    }

	for(var i=0;i<pVertices.length/3;i++){
		pVertexFaces[i] = [];
	}
	for(var i=0;i<pIndexes.length/3;i++){
        //добавляем номер треугольника в вершины образающие этот треугольник
		pVertexFaces[pIndexes[3*i    ]].push(i);
        pVertexFaces[pIndexes[3*i + 1]].push(i);
        pVertexFaces[pIndexes[3*i + 2]].push(i);
	}

    var pDeleteCandidates = [];
    for(var i=0; i<pVertexFaces.length;i++){
        if(pVertexFaces[i].length > 0){
            pDeleteCandidates[i] = i;
        }
        else{
            pDeleteCandidates[i] = -1;
        }
    }
    
    for(var i=0;i<pDeleteCandidates.length;i++){
        var nCurrentVertex = pDeleteCandidates[i];

        if(nCurrentVertex != -1){
            var fMaxDeviation;
            var pAverageNormalX = 0;
            var pAverageNormalY = 0;
            var pAverageNormalZ = 0;

            for(var j=0;j<pVertexFaces[nCurrentVertex].length;j++){
                var pNormalStartIndex = pVertexFaces[nCurrentVertex][j]*3
                //используются средние нормали для полигона
                pAverageNormalX += pFacesNormals[pNormalStartIndex    ];
                pAverageNormalY += pFacesNormals[pNormalStartIndex + 1];
                pAverageNormalZ += pFacesNormals[pNormalStartIndex + 2];
            }

            var fLength = Math.sqrt(pAverageNormalX*pAverageNormalX + pAverageNormalY*pAverageNormalY + pAverageNormalZ*pAverageNormalZ);
            if(fLength != 0){
                pAverageNormalX = pAverageNormalX/fLength;
                pAverageNormalY = pAverageNormalY/fLength;
                pAverageNormalZ = pAverageNormalZ/fLength;
            }

            fMaxDeviation = 0;
            for(var j=0;j<pVertexFaces[nCurrentVertex].length;j++){
                var pNormalStartIndex = pVertexFaces[nCurrentVertex][j]*3
                var fDeviationX,fDeviationY,fDeviationZ;
                //используются средние нормали для полигона
                fDeviationX = pAverageNormalX - pFacesNormals[pNormalStartIndex    ];
                fDeviationY = pAverageNormalY - pFacesNormals[pNormalStartIndex + 1];
                fDeviationZ = pAverageNormalZ - pFacesNormals[pNormalStartIndex + 2];

                var fLength = Math.sqrt(fDeviationX*fDeviationX + fDeviationY*fDeviationY + fDeviationZ*fDeviationZ);

                if(fLength > fMaxDeviation){
                    fMaxDeviation = fLength;
                }
            }
            
            if(fMaxDeviation < fThreshold){

                for(var j=0;j<pVertexFaces[nCurrentVertex].length;j++){
                    var pFaceStartIndex = pVertexFaces[nCurrentVertex][j]*3;
                    //вычеркиваем из рассмотрения соседние точки
                    for(var k=0;k<3;k++){
                        var nVertex = pIndexes[pFaceStartIndex + k];//pFace[k];
                        //так как вершины с меньшие текущего вертекса уже заведомо проставлены, как -1
                        if(nVertex > nCurrentVertex){
                            //проставляем вершины соседние с нашей, как -1
                            pDeleteCandidates[nVertex] = -1;
                        }
                    }
                }
            }
            else{
                pDeleteCandidates[i] = -1;
            }
        }
    }
    
    //убираем -1 из массива
    var nOffset = 0;
    for(var i=0;(i + nOffset)<pDeleteCandidates.length;i++){
        while(pDeleteCandidates[i + nOffset] == -1){
            nOffset++;
        }
        pDeleteCandidates[i] = pDeleteCandidates[i+nOffset];
    }
    pDeleteCandidates.length = pDeleteCandidates.length - nOffset;

    trace(pDeleteCandidates.length,"<------ delete candidates ------");

    var pDeletedFaces = []; //складываются грани, которые необходимо удалить после даусемплинга

    for(var i=0;i<pDeleteCandidates.length;i++){
        var nVertex = pDeleteCandidates[i];
        deleteVertex(nVertex,pVertexFaces[nVertex],pIndexes,pDeletedFaces);
    }
    //сортировка необходима для более быстрого удаления
    pDeletedFaces.sort(function(a,b){return a-b});

    var nOffset = 0;
    var nDeletedFace = pDeletedFaces[nOffset];
    
    var nPolygonsCount = pIndexes.length/3;

    for(var i=nDeletedFace;(i+nOffset)<nPolygonsCount;i++){
        while((i + nOffset) == nDeletedFace){
            nOffset++;
            nDeletedFace = pDeletedFaces[nOffset];
        }
        var iIndex1 = 3*i;
        var iIndex2 = 3*(i + nOffset);
        pIndexes[iIndex1    ] = pIndexes[iIndex2    ];
        pIndexes[iIndex1 + 1] = pIndexes[iIndex2 + 1];
        pIndexes[iIndex1 + 2] = pIndexes[iIndex2 + 2];
    }
    pIndexes.length = pIndexes.length - nOffset*3;
    trace(pIndexes.length/3,"<-----------new faces count------");
    return pIndexes;
}

function deleteVertex(nVertex,pFacesNumbers,pIndexes,pDeletedFaces){
    var pParticalPolygons = []; //содержит только две вершины из трех, убираю ту, которую собираюсь удалить
    for(var i=0; i<pFacesNumbers.length;i++){
        pParticalPolygons[i] = pIndexes.slice(pFacesNumbers[i]*3,pFacesNumbers[i]*3+3);
        //console.log(nVertex,pParticalPolygons[i]);
        var iIndex = pParticalPolygons[i].indexOf(nVertex);
        pParticalPolygons[i].splice(iIndex,1);
    }

    var pAdjacencyGroups = buildAdjacencyGroups(pParticalPolygons);
    //console.log(pAdjacencyGroups);
    if(pAdjacencyGroups.length>1){
        return;
    }
    for(var i=0;i<pAdjacencyGroups.length;i++){
        var pAdjacencyGroup = pAdjacencyGroups[i];
        var pGroup = pAdjacencyGroup.group;
        var pAdjacency = pAdjacencyGroup.adjacency;

        var nRootVertex; //вершина, в которой будут сходиться новые полигоны
        var nVertex1, nVertex2; // оставшиеся две новые вершины полигона

        var nEndIndex;

        //если группа круговая, то при даунсемплинге число полигонов может быть уменьшено на 2
        //если группа не круговая, то число полигонов может быть уменьшено на 1
        if(pAdjacencyGroup.type == a.ProgressiveMesh.CIRCLE){
            nEndIndex = pGroup.length - 2;
            //trace("circle group <-----------");
        }
        else{
            nEndIndex = pGroup.length - 1;
            //trace("uncircle group <-----------");   
            return;
        }

        //ищем rootVertex
        //TODO : выбрать rootVertex оптимальным способом

        nRootVertex = pGroup[0];

        for(var j=0;j<nEndIndex;j++){
            nVertex1 = pGroup[j + 1];
            nVertex2 = pGroup[j + 2];

            var iIndex = pFacesNumbers[pAdjacency[j]]*3;
            pIndexes[iIndex    ] = nRootVertex;
            pIndexes[iIndex + 1] = nVertex1;
            pIndexes[iIndex + 2] = nVertex2;
        }

        //удаляем последние треугольники
        for(var j=nEndIndex;j<pGroup.length;j++){
            pDeletedFaces.push(pFacesNumbers[pAdjacency[j]]);
        }
    }
};

function buildAdjacencyGroups(pParticalPolygons){

    //сначала надо определить смежность этих треугольников

    var pPolygonsCopy = pParticalPolygons.slice(0,pParticalPolygons.length);
    var pGroups = [];
    for(var i=0;i<pPolygonsCopy.length;i++){
        if(pPolygonsCopy[i]!=-1){
            var pPolygon = pPolygonsCopy[i];
            var nVertex0 = pPolygonsCopy[i][0];
            var nVertex1 = pPolygonsCopy[i][1];

            var nVertexCurrent = nVertex0;
            var pGroup = [];
            var pAdjacencyData = [i]

            do{
                var j;
                for(j=i+1;j<pPolygonsCopy.length;j++){
                    if(pPolygonsCopy[j]!=-1){
                        if(pPolygonsCopy[j][0] == nVertexCurrent){
                            pGroup.push(nVertexCurrent);
                            pAdjacencyData.push(j);
                            nVertexCurrent = pPolygonsCopy[j][1];
                            pPolygonsCopy[j] = -1;
                            break;
                        }
                        else if(pPolygonsCopy[j][1] == nVertexCurrent){
                            pGroup.push(nVertexCurrent);
                            pAdjacencyData.push(j);
                            nVertexCurrent = pPolygonsCopy[j][0];
                            pPolygonsCopy[j] = -1;
                            break;
                        }
                    }
                }
            }while((j != pPolygonsCopy.length) && (nVertexCurrent != nVertex1));

            if(nVertexCurrent == nVertex0){
                pGroup.push(nVertex0);
            }
            else if(nVertexCurrent == nVertex1){
                pGroup.push(nVertexCurrent);
                pGroups.push({"group" : pGroup, "type" : a.ProgressiveMesh.CIRCLE, "adjacency" : pAdjacencyData});
                pPolygonsCopy[i] = -1;
                continue;
            }
            else{
                nCurrentVertex = nVertex1;
                //начинаем обходить в другую сторону, поэтому и вершины добавляются не в начало, а в конец
                do{
                    var j;
                    for(j=i+1;j<pPolygonsCopy.length;j++){
                        if(pPolygonsCopy[j]!=-1){
                            if(pPolygonsCopy[j][0] == nVertexCurrent){
                                pGroup.unshift(nVertexCurrent);
                                pAdjacencyData.unshift(j);
                                nVertexCurrent = pPolygonsCopy[j][1];
                                pPolygonsCopy[j] = -1;
                                break;
                            }
                            else if(pPolygonsCopy[j][1] == nVertexCurrent){
                                pGroup.unshift(nVertexCurrent);
                                pAdjacencyData.unshift(j);
                                nVertexCurrent = pPolygonsCopy[j][0];
                                pPolygonsCopy[j] = -1;
                                break;
                            }
                        }
                    }
                }while(j != pPolygonsCopy.length);

                pGroup.unshift(nCurrentVertex);
                pGroups.push({"group" : pGroup, "type" : a.ProgressiveMesh.UNCIRCLE, "adjacency" : pAdjacencyData});
                pPolygonsCopy[i] = -1;
                continue;
            }
        }
    }
    return pGroups;
}

function optimizeMesh(pVertices,pIndexes){
    var nVerticesCount = pVertices.length/3;
    var i,j,k;
    var nVertex0,nVertex1,nVertex2;
    var pVerticesAdjacency = [];
    for(i=0;i<nVerticesCount;i++){
        pVerticesAdjacency[i] = [];
    }

    var pDeletedFaces = [];

    for(i=0;i<pIndexes.length/3;i++){

        nVertex0 = pIndexes[3*i];
        nVertex1 = pIndexes[3*i + 1];
        nVertex2 = pIndexes[3*i + 2];
        
        if(nVertex0 == nVertex1 || nVertex1 == nVertex2 || nVertex0 == nVertex2){
            //удаляем треугольники нулевой площади
            pDeletedFaces.push(i);
        }
        else{
            //для определения наложенных треугольников хватит и половины информации
            if(nVertex0 < nVertex1){
                if(nVertex1 < nVertex2){
                    pVerticesAdjacency[nVertex0].push([i,nVertex1,nVertex2]);
                    //pVerticesAdjacency[nVertex1].push([i,nVertex2]);
                }
                else if(nVertex0 < nVertex2){
                    pVerticesAdjacency[nVertex0].push([i,nVertex2,nVertex1]);
                    //pVerticesAdjacency[nVertex2].push([i,nVertex1]);
                }
                else{
                    pVerticesAdjacency[nVertex2].push([i,nVertex0,nVertex1]);
                    //pVerticesAdjacency[nVertex0].push([i,nVertex1]);
                }
            }
            else{
                if(nVertex0 < nVertex2){
                    pVerticesAdjacency[nVertex1].push([i,nVertex0,nVertex2]);
                    //pVerticesAdjacency[nVertex0].push([i,nVertex2]);
                }
                else if(nVertex1 < nVertex2){
                    pVerticesAdjacency[nVertex1].push([i,nVertex2,nVertex0]);
                    //pVerticesAdjacency[nVertex2].push([i,nVertex0]);
                }
                else{
                    pVerticesAdjacency[nVertex2].push([i,nVertex1,nVertex0]);
                    //pVerticesAdjacency[nVertex1].push([i,nVertex0]);
                }
            }
        }
    }

    for(i=0;i<pVerticesAdjacency.length;i++){
        var pVertex = pVerticesAdjacency[i];
        
        for(j=0;j<pVertex.length;j++){
            var pData1 = pVertex[j];
                
            for(k=j+1;k<pVertex.length;k++){
                var pData2 = pVertex[k];

                if(pData1[1] == pData2[1] && pData1[2] == pData2[2]){
                    //наложенные треугольники
                    pDeletedFaces.push(pData2[0]);
                }
            }     
        }
    }
    
    if(pDeletedFaces.length > 0){
        //сортируем для быстрого удаления
        pDeletedFaces.sort(function(a,b){return a-b});

        var nOffset = 0;
        var nDeletedFace = pDeletedFaces[nOffset]
        for(var i=nDeletedFace;(i+nOffset)<pIndexes.length/3;i++){
            while(i+nOffset == nDeletedFace){
                nOffset++;
                nDeletedFace = pDeletedFaces[nOffset];
            }
            var iIndex1 = 3*i;
            var iIndex2 = 3*(i + nOffset);
            pIndexes[iIndex1    ] = pIndexes[iIndex2    ];
            pIndexes[iIndex1 + 1] = pIndexes[iIndex2 + 1];
            pIndexes[iIndex1 + 2] = pIndexes[iIndex2 + 2];
        }
        pIndexes.length = pIndexes.length - nOffset*3;
    }
}