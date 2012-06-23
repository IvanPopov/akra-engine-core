/**
 * @author reinor
 */

function computeAdjacencyBuffer(pVertices,pIndexes){
    var nVerticesCount = pVertices.length/3;
    var i,j,k;
    var nVertex0,nVertex1,nVertex2;
    var arrVerticesAdjacency = [];
    for(i=0;i<nVerticesCount;i++){
        arrVerticesAdjacency[i] = [];
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
                arrVerticesAdjacency[nVertex0].push([i,nVertex1,nVertex2]);
                arrVerticesAdjacency[nVertex1].push([i,nVertex2]);
            }
            else if(nVertex0 < nVertex2){
                arrVerticesAdjacency[nVertex0].push([i,nVertex2,nVertex1]);
                arrVerticesAdjacency[nVertex2].push([i,nVertex1]);
            }
            else{
                arrVerticesAdjacency[nVertex2].push([i,nVertex0,nVertex1]);
                arrVerticesAdjacency[nVertex0].push([i,nVertex1]);
            }
        }
        else{
            if(nVertex0 < nVertex2){
                arrVerticesAdjacency[nVertex1].push([i,nVertex0,nVertex2]);
                arrVerticesAdjacency[nVertex0].push([i,nVertex2]);
            }
            else if(nVertex1 < nVertex2){
                arrVerticesAdjacency[nVertex1].push([i,nVertex2,nVertex0]);
                arrVerticesAdjacency[nVertex2].push([i,nVertex0]);
            }
            else{
                arrVerticesAdjacency[nVertex2].push([i,nVertex1,nVertex0]);
                arrVerticesAdjacency[nVertex1].push([i,nVertex0]);
            }
        }
        pAdjacencyBuffer[i] = [];
    }
    
    //trace(arrVerticesAdjacency[325],"<---------325 vertex---------");
    //trace(arrVerticesAdjacency);
    
    
    for(i=0;i<arrVerticesAdjacency.length;i++){
        var pVertex = arrVerticesAdjacency[i];
        
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

    //var t1 = new Date().getTime();
    
    var pIndexes = pIndexesOriginal.slice(0,pIndexesOriginal.length);
    optimizeMesh(pVertices,pIndexes);

    var pAdjacencyBuffer = computeAdjacencyBuffer(pVertices,pIndexes);
    //console.log("time >>>>",new Date().getTime() - t1);
    //
    //console.log(pAdjacencyBuffer);

	var pVertexFaces = [];
    var pVertexNeighbors = [];

    var pFacesNormals = []; //хранит нормали для каждого полигона
    //console.log(pNormals);
    if(pNormals){
        for(var i=0;i<pIndexes.length/3;i++){
            var pFaceNormals = [];//нормали для данного полигона
            for(var j=0;j<3;j++){
                var nIndex = pIndexes[3*i+j];
                var pNormal = pNormals.slice(3*nIndex,3*nIndex+3);

                //нормаль должна быть единичной длины
                
                var fLength = Math.sqrt(pNormal[0]*pNormal[0] + pNormal[1]*pNormal[1] + pNormal[2]*pNormal[2]);
                if(fLength != 0){
                    pNormal[0] = pNormal[0]/fLength;
                    pNormal[1] = pNormal[1]/fLength;
                    pNormal[2] = pNormal[2]/fLength;
                }

                pFaceNormals = pFaceNormals.concat(pNormal);
            }
            pFacesNormals.push(pFaceNormals);
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

            Vec3.set(pVertices.slice(3*nIndex0,3*nIndex0 + 3),v3fVertex0);
            Vec3.set(pVertices.slice(3*nIndex1,3*nIndex1 + 3),v3fVertex1);
            Vec3.set(pVertices.slice(3*nIndex2,3*nIndex2 + 3),v3fVertex2);

            Vec3.subtract(v3fVertex1,v3fVertex0,v3fDirection1);
            Vec3.subtract(v3fVertex2,v3fVertex0,v3fDirection2);

            Vec3.cross(v3fDirection1,v3fDirection2,v3fNormal);

            Vec3.normalize(v3fNormal);

            var pTemp = [v3fNormal.X,v3fNormal.Y,v3fNormal.Z];

            pFacesNormals.push(pTemp.concat(pTemp,pTemp));
        }
    }

    //console.log(pFacesNormals);

	for(var i=0;i<pVertices.length/3;i++){
		pVertexFaces[i] = [];
        pVertexNeighbors[i] = [];
	}

	for(var i=0;i<pIndexes.length;i++){
		pVertexFaces[pIndexes[i]].push(Math.floor(i/3));//добавляем треугольник содержащий эту вершину
	}
    
    var pDeleteCandidates = [];
    for(var i=0; i<pVertexFaces.length;i++){
        if(pVertexFaces[i].length > 0){
            pDeleteCandidates.push(i);
        }
    }

    //var iCurrentPosition;

    for(var i=0;i<pDeleteCandidates.length;i++){
        //trace(i,pDeleteCandidates.length,'<---------current condition------------');
        var fMaxDeviation;
        var pAverageNormal = [0,0,0];
        var nCurrentVertex = pDeleteCandidates[i];
        var pNeighbours = [];

        for(var j=0;j<pVertexFaces[nCurrentVertex].length;j++){
            var pFace = pIndexes.slice(pVertexFaces[nCurrentVertex][j]*3,pVertexFaces[nCurrentVertex][j]*3 + 3);

            var pFaceNormals = pFacesNormals[pVertexFaces[nCurrentVertex][j]];
            for(var k=0;k<3;k++){
                pAverageNormal[k] += pFaceNormals[k] + pFaceNormals[k+3] + pFaceNormals[k+6];
            }

            //add Neighbours 
            for(var k=0;k<3;k++){
                var nVertex = pFace[k];
                //так как вершины с меньшие текущего вертекса уже викинуты
                if(nVertex > nCurrentVertex){
                    if(pNeighbours.indexOf(nVertex) == -1){
                        pNeighbours.push(nVertex);
                    }
                }
            }
        }

        var fLength = Math.sqrt(pAverageNormal[0]*pAverageNormal[0] + pAverageNormal[1]*pAverageNormal[1] + pAverageNormal[2]*pAverageNormal[2]);
        if(fLength != 0){
            pAverageNormal[0] = pAverageNormal[0]/fLength;
            pAverageNormal[1] = pAverageNormal[1]/fLength;
            pAverageNormal[2] = pAverageNormal[2]/fLength;
        }

        fMaxDeviation = 0;
        for(var j=0;j<pVertexFaces[nCurrentVertex].length;j++){
            var pFaceNormals = pFacesNormals[pVertexFaces[nCurrentVertex][j]];
            var pTemp;
            for(var k=0;k<3;k++){
                pTemp = [
                            pAverageNormal[0] - pFaceNormals[3*k    ],
                            pAverageNormal[1] - pFaceNormals[3*k + 1],
                            pAverageNormal[2] - pFaceNormals[3*k + 2]
                        ];
                //console.log(pTemp);
                var fLength = Math.sqrt(pTemp[0]*pTemp[0] + pTemp[1]*pTemp[1] + pTemp[2]*pTemp[2]);

                if(fLength > fMaxDeviation){
                    fMaxDeviation = fLength;
                }
            }
        }
        //console.log(fMaxDeviation);
        if(fMaxDeviation < fThreshold){
            //удаляем из delete candidates все вершины, которые соседние с нашей
            for(var j=0;j<pNeighbours.length;j++){
                var iIndex = pDeleteCandidates.indexOf(pNeighbours[j],i);
                if(iIndex != -1){
                    pDeleteCandidates.splice(iIndex,1);
                }
            }
            // for(var j=0;j<pVertexFaces[nCurrentVertex].length;j++){
            //     var pFace = pIndexes.slice(pVertexFaces[nCurrentVertex][j]*3,pVertexFaces[nCurrentVertex][j]*3 + 3);
            //     for(var k=0;k<3;k++){
            //         if(pFace[k] > nCurrentVertex){
            //             var iIndex = pDeleteCandidates.indexOf(pFace[k],i);
            //             if(iIndex != -1){
            //                 pDeleteCandidates.splice(iIndex,1);
            //             }
            //         }
            //     }
            // }
        }
        else{
            pDeleteCandidates.splice(i,1);
            i--;
        }
    }
    trace(pDeleteCandidates.length,"<------ delete candidates dirty ------");

    //var nTmp = Math.floor(Math.random()*100);
    //if(nTmp%2 == 1){
    //    pDeleteCandidates.reverse();
    //}

    // for(var i=0;i<pDeleteCandidates.length;i++){

    //     var nVertexCandidate1 = pDeleteCandidates[i];

    //     for(var j=i+1;j<pDeleteCandidates.length;j++){

    //         var nVertexCandidate2 = pDeleteCandidates[j];

    //         if(pVertexNeighbors[nVertexCandidate1].indexOf(nVertexCandidate2) != -1){
    //             pDeleteCandidates.splice(j,1);
    //             j--;
    //         }
    //     }
    // }
    //console.log(pDeleteCandidates);
    trace(pDeleteCandidates.length,"<------ delete candidates cleared ------");

    var pDeletedFaces = []; //складываются грани, которые необходимо удалить после даусемплинга

    //var nVertex = Math.floor(530*Math.random());
    for(var i=0;i<pDeleteCandidates.length;i++){
        var nVertex = pDeleteCandidates[i];
        
        deleteVertex(nVertex,pVertexFaces[nVertex],pIndexes,pAdjacencyBuffer,pDeletedFaces);

        //if(i%200 == 0){
        //    trace(i,"<-----vertices removed------");
        //}
    }

    //sorting for easy delete without additional shifts
    pDeletedFaces.sort(function(a,b){return b-a});
    for(var i=0;i<pDeletedFaces.length;i++){
        pIndexes.splice(pDeletedFaces[i]*3,3);
    }
    trace(pIndexes.length/3,"<-----------faces count------");
    //alert(pIndexes.length/3);
    //}
    //console.log(pFaces);
    //
    return pIndexes;
}

function deleteVertex(nVertex,pFaces,pIndexes,pAdjacencyBuffer,pDeletedFaces){

    var pAdjacencyGroups = buildAdjacencyGroups(pFaces,pAdjacencyBuffer);
    //console.log(pAdjacencyGroups);
    if(pAdjacencyGroups.length>1){
        return;
    }
    for(var i=0;i<pAdjacencyGroups.length;i++){
        pGroup = pAdjacencyGroups[i];

        var nRootVertex; //вершина, в которой будут сходиться новые полигоны
        var nVertex1, nVertex2; // оставшиеся две новые вершины полигона
        var pNewFaces = [];

        var nEndIndex;

        //
        //trace(pIndexes.slice(pGroup[0]*3,pGroup[0]*3+3));
        //trace(pIndexes.slice(pGroup[pGroup.length-1]*3,pGroup[pGroup.length-1]*3+3));
        //

        //если группа круговая, то при даунсемплинге число полигонов может быть уменьшено на 2
        //если группа не круговая, то число полигонов может быть уменьшено на 1
        if(isCircleGroup(pGroup,pAdjacencyBuffer)){
            nEndIndex = pGroup.length - 2;
            //trace("circle group <-----------");
        }
        else{
            nEndIndex = pGroup.length - 1;
            //trace("uncircle group <-----------");   
            return;
        }

        //ищем rootVertex
        
        var pFace1 = pIndexes.slice(pGroup[0]*3,pGroup[0]*3 + 3);
        var pFace2 = pIndexes.slice(pGroup[1]*3,pGroup[1]*3 + 3);
        var iIndex;
        for(var j=0;j<3;j++){//face - triangle
            if((iIndex = pFace1.indexOf(pFace2[j]))!=-1){
                if(pFace2[j]!=nVertex){
                    nVertex1 = pFace2[j];//смежная вершина, но не та которую надо удалить
                }
                pFace1.splice(iIndex,1);
            }
        }
        if(pFace1.length > 0){
            nRootVertex = pFace1[0];
        }
        else{
            warning("наложенные треугольники");
            return;
        }

        for(var j=0;j<nEndIndex;j++){
            pFace1 = pIndexes.slice(pGroup[j]*3,pGroup[j]*3 + 3);
            pFace2 = pIndexes.slice(pGroup[j+1]*3,pGroup[j+1]*3 + 3);
            for(var k=0;k<3;k++){
                if((iIndex = pFace2.indexOf(pFace1[k]))!=-1){
                    pFace2.splice(iIndex,1);
                }
            }
            if(pFace2.length > 0){
                nVertex2 = pFace2[0]; //что осталось то и нужная (несмежная вершина)
            }
            else{
                warning("наложенные треугольники");
                return;
            }
            //trace(pIndexes.slice(pGroup[j]*3,pGroup[j]*3 + 3),"<-----------------pFace1---------");
            //trace(pIndexes.slice(pGroup[j+1]*3,pGroup[j+1]*3 + 3),"<-----------------pFace2---------");

            //запоминаем новый полигон
            
            pNewFaces.push(nRootVertex,nVertex1,nVertex2);
            //console.log(nRootVertex,nVertex1,nVertex2);
            //меняем позицию nVertex1

            nVertex1 = nVertex2;
        }

        for(var j=0;j<pNewFaces.length;j++){
            iIndex = pGroup[j]*3;
            pIndexes[iIndex] = pNewFaces[3*j];
            pIndexes[iIndex+1] = pNewFaces[3*j + 1];
            pIndexes[iIndex+2] = pNewFaces[3*j + 2];
        }

        //удаляем последние треугольники
        for(var j=nEndIndex;j<pGroup.length;j++){
            pDeletedFaces.push(pGroup[j]);
        }
    }
};

function buildParticalAdjancecy(pFaces,pAdjacencyBuffer){

    var iIndex;

    var pParticalAdjacency = [];

    for(var i=0;i<pFaces.length;i++){
        pParticalAdjacency[i] = [];
        var pAdjacency = pAdjacencyBuffer[pFaces[i]];
        //console.log(pFaces[i],pAdjacency);
        for(var j=0;j<pAdjacency.length;j++){
            if((iIndex = pFaces.indexOf(pAdjacency[j]))!=-1){
                pParticalAdjacency[i].push(iIndex);
                //pParticalAdjancecy[i].push(pAdjancecy[j]);
            }
        }
    }
    //console.log(pParticalAdjacency);
    return pParticalAdjacency;
};

function buildAdjacencyGroups(pFaces,pAdjacencyBuffer){

    var pParticalAdjacency = buildParticalAdjancecy(pFaces,pAdjacencyBuffer);
    var pAdjacencyGroups = [];

    for(var i=0;i<pFaces.length;i++){
        if(pFaces[i]!=-1){
            pAdjacencyGroups.push(buildAdjacencyGroup(i,pFaces,pParticalAdjacency));
        }
    }
    return pAdjacencyGroups;
    //console.log(pParticalAdjacency);
    //console.log(pAdjacencyGroups);
}

function buildAdjacencyGroup(iStart,pFaces,pParticalAdjacency,pGroup){
    if(pGroup == undefined){
        pGroup = [];
    }
    pGroup.push(pFaces[iStart]);

    for(var i=0;i<pParticalAdjacency[iStart].length;i++){
        nFace = pParticalAdjacency[iStart][i];
        var iIndex = pParticalAdjacency[nFace].indexOf(iStart);
        pParticalAdjacency[nFace].splice(iIndex,1);
    }

    for(var i=0;i<pParticalAdjacency[iStart].length;i++){
        nFace = pParticalAdjacency[iStart][i];
        if(pFaces[nFace] != -1){
            //ну если у нас круговая група, то у каждого элемента имеется два соседа,
            //и после первого рекурсивного вызова все элементы попадут в группу,
            //а если у нас не круговая группа, то у некоторых элементов количество соседей не два, а один
            //и если мы начинаем с полигона у которога один сосед, то все нормально, а если у полигона два соседа
            //то мы получим неупорядоченный массив, то есть массив не будет соответствовать реальной смежности
            //поэтому то что сделано дает корректное заполнение массива смежности, то есть чтобы проход по массиву 
            //соответствовал перемещению по треугольникам по часовой или против часовой стрелки
            
            if(i==0){
                buildAdjacencyGroup(nFace,pFaces,pParticalAdjacency,pGroup);
            }
            else if(i==1){
                var pTemp = buildAdjacencyGroup(nFace,pFaces,pParticalAdjacency);
                pGroup = pTemp.reverse().concat(pGroup);
            }
        }
    }
    pFaces[iStart] = -1;
    return pGroup;
}

function isCircleGroup(pGroup,pAdjacencyBuffer){
    if(pGroup.length < 3){
        return false;
    }
    var nStartFace = pGroup[0];
    var nEndFace = pGroup[pGroup.length - 1];

    var pAdjacency = pAdjacencyBuffer[nStartFace];

    if(pAdjacency.indexOf(nEndFace) != -1){
        return true;
    }
    else{
        return false;
    }
}

function optimizeMesh(pVertices,pIndexes){
    var nVerticesCount = pVertices.length/3;
    var i,j,k;
    var nVertex0,nVertex1,nVertex2;
    var arrVerticesAdjacency = [];
    for(i=0;i<nVerticesCount;i++){
        arrVerticesAdjacency[i] = [];
    }

    for(i=0;i<pIndexes.length/3;i++){

        nVertex0 = pIndexes[3*i];
        nVertex1 = pIndexes[3*i + 1];
        nVertex2 = pIndexes[3*i + 2];
        
        if(nVertex0 == nVertex1 || nVertex1 == nVertex2 || nVertex0 == nVertex2){
            //удаляем треугольники нулевой площади
            pIndexes.splice(3*i,3);
            i--;
        }
        if(nVertex0 < nVertex1){
            if(nVertex1 < nVertex2){
                arrVerticesAdjacency[nVertex0].push([i,nVertex1,nVertex2]);
                arrVerticesAdjacency[nVertex1].push([i,nVertex2]);
            }
            else if(nVertex0 < nVertex2){
                arrVerticesAdjacency[nVertex0].push([i,nVertex2,nVertex1]);
                arrVerticesAdjacency[nVertex2].push([i,nVertex1]);
            }
            else{
                arrVerticesAdjacency[nVertex2].push([i,nVertex0,nVertex1]);
                arrVerticesAdjacency[nVertex0].push([i,nVertex1]);
            }
        }
        else{
            if(nVertex0 < nVertex2){
                arrVerticesAdjacency[nVertex1].push([i,nVertex0,nVertex2]);
                arrVerticesAdjacency[nVertex0].push([i,nVertex2]);
            }
            else if(nVertex1 < nVertex2){
                arrVerticesAdjacency[nVertex1].push([i,nVertex2,nVertex0]);
                arrVerticesAdjacency[nVertex2].push([i,nVertex0]);
            }
            else{
                arrVerticesAdjacency[nVertex2].push([i,nVertex1,nVertex0]);
                arrVerticesAdjacency[nVertex1].push([i,nVertex0]);
            }
        }
    }
    
    var pDeletedFaces = [];

    for(i=0;i<arrVerticesAdjacency.length;i++){
        var pVertex = arrVerticesAdjacency[i];
        
        for(j=0;j<pVertex.length;j++){
            var pData1 = pVertex[j];
                
            for(k=j+1;k<pVertex.length;k++){
                var pData2 = pVertex[k];

                if(pData1.length == 3 && pData2.length == 3){
                    if(pData1[1] == pData2[1] && pData1[2] == pData2[2]){
                        //наложенные треугольники
                        pDeletedFaces.push(pData2[0]);
                    }
                }
            }     
        }
    }

    pDeletedFaces.sort(function(a,b){return b-a});
    for(var i=0;i<pDeletedFaces.length;i++){
        pIndexes.splice(pDeletedFaces[i]*3,3);
    }
}