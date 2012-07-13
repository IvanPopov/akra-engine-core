/**
 * @enum
 * Используется для задания семантики использования данных вершинного буфера
 */
Enum([
    POSITION = "POSITION",
    POSITION1,
    POSITION2,
    POSITION3,
    BLENDWEIGHT = "BLENDWEIGHT",
    BLENDINDICES = "BLENDINDICES",
    NORMAL = "NORMAL",
    NORMAL1,
    NORMAL2,
    NORMAL3,
    PSIZE = "PSIZE",
    TEXCOORD = "TEXCOORD",
    TEXCOORD1,
    TEXCOORD2,
    TEXCOORD3,
    TEXCOORD4,
    TEXCOORD5,
    TANGENT = "TANGENT",
    BINORMAL = "BINORMAL",
    TESSFACTOR = "TESSFACTOR",
    COLOR = "COLOR",
    FOG = "FOG",
    DEPTH = "DEPTH",
    SAMPLE = "SAMPLE",
    INDEX = "INDEX",
    INDEX1,
    INDEX2,
    INDEX3,
    INDEX10 = "INDEX10", //system indices starts from 10
    INDEX11,
    INDEX12,
    INDEX13,
    MATERIAL = "MATERIAL",
    MATERIAL1,
    MATERIAL2,
    DIFFUSE = "DIFFUSE",
    AMBIENT = "AMBIENT",
    SPECULAR = "SPECULAR",
    EMISSIVE = "EMISSIVE",
    SHININESS = "SHININESS",
    UNKNOWN = "UNKNOWN"
], DECLARATION_USAGE, a.DECLUSAGE);


Define(VE_CUSTOM(name, type, count, offset), function () {
    new Object({nCount:count, eType:type, eUsage:name, iOffset:offset});
});
Define(VE_CUSTOM(name, type, count), function () {
    VE_CUSTOM(name, type, count, undefined);
});

Define(VE_CUSTOM(name, type), function () {
    VE_CUSTOM(name, type, 1);
});

Define(VE_CUSTOM(name), function () {
    VE_CUSTOM(name, a.DTYPE.FLOAT);
})

Define(VE_FLOAT(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 1, offset);});
Define(VE_FLOAT3(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 3, offset); });
Define(VE_FLOAT2(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 2, offset); });
Define(VE_FLOAT4(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 4, offset); });
Define(VE_VEC2(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 2, offset); });
Define(VE_VEC3(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 3, offset); });
Define(VE_VEC4(name, offset), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 4, offset); });
Define(VE_INT(name, offset), function () {VE_CUSTOM(name, a.DTYPE.INT, 1, offset);});

Define(VE_FLOAT(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT); });
Define(VE_FLOAT3(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 3); });
Define(VE_FLOAT4(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 4); });
Define(VE_FLOAT2(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 2); });
Define(VE_VEC2(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 2); });
Define(VE_VEC3(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 3); });
Define(VE_VEC4(name), function () {VE_CUSTOM(name, a.DTYPE.FLOAT, 4); });
Define(VE_INT(name), function () {VE_CUSTOM(name, a.DTYPE.INT)});



/**
 * @property VertexDeclaration(Int count, String sAttrName)
 * Конструктор, создающий структура описывающую вершинный подбуфер
 * @memberof VertexDeclaration
 * @param nCount количесвто элементов
 **/

/**
 * VertexDeclaration Class
 * @ctor
 * Constructor of VertexDeclaration class
 **/
function VertexElement (nCount, eType, eUsage, iOffset) {
    this.nCount = nCount || 1;
    this.eType = eType || a.DTYPE.FLOAT;
    this.eUsage = eUsage || a.DECLUSAGE.POSITION;
    this.eUsage = this.eUsage.toString().toUpperCase();
    this.iOffset = iOffset;

    this.update();
}

/**
 * Get size of vertex element in bytes.
 * @return {Uint} 
 */
PROPERTY(VertexElement, "size", function () {
    return this.iSize;
});

/**
 * @protected
 */
VertexElement.prototype.update = function () {
    this.iSize = this.nCount * a.getTypeSize(this.eType);
};

/**
 * Get clone of element.
 * @return {VertexElement}
 */
VertexElement.prototype.clone = function () {
    return new a.VertexElement(this.nCount, this.eType, this.eUsage, this.iOffset);
};

Ifdef (__DEBUG);

VertexElement.prototype.toString = function() {
    'use strict';

    function _an(s, n, bBackward) {
        s = String(s);
        bBackward = ifndef(bBackward, false);
        for (var i = 0, t = n - s.length; i < t; ++ i) {
            if (bBackward) {
                s = ' ' + s;
            }
            else {
                s += ' ';
            }
        }
        return s;
    }

    var s = '[ USAGE: ' + _an(this.eUsage, 12) + ', OFFSET ' + _an(this.iOffset, 4) + ' ]';

    return s;
};

Endif ();

A_NAMESPACE(VertexElement);

function VertexDeclaration (pArrayElements) {
    //A_CLASS;    
    this.iStride = 0;

    if (arguments.length) {
        this.append(pArrayElements);
    }
}

EXTENDS(VertexDeclaration, Array);

PROPERTY(VertexDeclaration, "stride", function () {
    return this.iStride;
});

/**
 * Update some inner info for vertex declaration.
 * @protected
 */
VertexDeclaration.prototype.update = function () {
    var iStride;
    for (var i = 0; i < this.length; ++ i) {
        iStride = this[i].iSize + this[i].iOffset;
        if (this.iStride < iStride) {
            this.iStride = iStride
        }
    }

    return true;
};


/**
 * Append array of vertex elements.
 * @param  {!Array.<VertexElement>} pArrayElements Elements to append.
 */
VertexDeclaration.prototype.append = function (pArrayElements) {
    debug_assert(pArrayElements instanceof Array, 
        'only array of vertex elements can be appended to vertex declaration.');

    var iOffset;

    for (var i = 0; i < pArrayElements.length; i++) {
        iOffset = pArrayElements[i].iOffset;
        if (iOffset === undefined) {
            if (i > 0) {
                iOffset = this[i - 1].iOffset + this[i - 1].iSize;
            }
            else {
                iOffset = 0;
            }
        }

        this.push(new VertexElement(
            pArrayElements[i].nCount,
            pArrayElements[i].eType,
            pArrayElements[i].eUsage,
            iOffset));
    }

    return this.update();
};

VertexDeclaration.prototype.extend = function (pVertexDecl) {
    var pElement;

    for (var i = 0; i < this.length; ++ i) {
        for (var j = 0; j < pVertexDecl.length; ++ j) {
            if (pVertexDecl[j].eUsage == this[i].eUsage) {
                trace('inconsistent declarations:', this, pVertexDecl);
                debug_error('The attempt to combine the declaration containing the exact same semantics.');
                return false;
            }
        }
    }

    for (var i = 0; i < pVertexDecl.length; i++) {
        pElement = pVertexDecl[i].clone();
        pElement.iOffset += this.iStride;
        this.push(pElement);
    }

    return this.update();
};

VertexDeclaration.prototype.hasSemantics = function (eSemantics) {
    return this.element(eSemantics) !== null;
};

VertexDeclaration.prototype.element = function (eSemantics) {
    eSemantics = eSemantics.toUpperCase();
    for (var i = 0; i < this.length; ++i) {
        if (this[i].eUsage === eSemantics) {
            return this[i];
        }
    }

    return null;
};

VertexDeclaration.prototype.clone = function () {
    var pDecl = new a.VertexDeclaration;
    for (var i = 0; i < this.length; i++) {
        pDecl.push(this[i].clone());
    }
    pDecl.update();
    return pDecl
};

Ifdef (__DEBUG);

VertexDeclaration.prototype.toString = function() {
    'use strict';

    var s = '';
    s += '  VERTEX DECLARATION ( ' + this.iStride +' b. ) \n';
    s += '---------------------------------------\n';
    for (var i = 0; i < this.length; ++ i) {
        s += this[i].toString() + '\n';
    }

    return s;
};

Endif ();

A_NAMESPACE(VertexDeclaration);


/**
 * Get VertexDeclaration from anything.
 * @system
 * @return {VertexDeclarartion}
 */
function normalizeVertexDecl (pDataDecl) {
    if (!(pDataDecl instanceof a.VertexDeclaration)) {
        if (!(pDataDecl instanceof Array)) {
            pDataDecl = [pDataDecl];
        }

        pDataDecl = new a.VertexDeclaration(pDataDecl);
    }

    return pDataDecl;
}

A_NAMESPACE(normalizeVertexDecl);

/**
 * @property VertexData(pVertexBuffer,Int iOffset, Int iCount, pVertexDeclaration)
 * @memberof VertexData
 * @param pVertexBuffer буфер которому принадлежит вертех дата
 * @param iOffset смещение вертех даты в вертех буфере
 * @param iCount количесвто строк в буфере
 * @param pVertexDeclaration описанеи строки
 * @return
 **/
function VertexData (pVertexBuffer, iOffset, iCount, pVertexDeclaration) {
    debug_assert(pVertexBuffer, "Вертекс буффер не передан при создании VertexData");


    /**
     * @enum eBufferStateBits
     * maximum number of vertex elements stored
     * @memberof VertexData
     **/
    Enum([MaxElementsSize = 256], //Маскимальный размер строки буфера в байтах
        VERTEXDATA_LIMITS, a.VertexData);


    /**
     * Указатель на буффер, которому принадлежит VertexData
     * @type VertexBuffer
     * @memberof VertexData
     **/
    this._pVertexBuffer = pVertexBuffer;


    this._iOffset = iOffset;

    /**
     * Количесвто строк
     * @type Int
     * @memberof VertexData
     **/
    this._nMemberCount = iCount;

    /**
     * Описание подбуферов
     * @type VertexDeclaration
     * @memberof VertexData
     **/
    this._pVertexDeclaration = null;

    this._iStride = undefined;

    this._iID = this._pVertexBuffer.getNextID();

    if (typeof(pVertexDeclaration) == "number") {
        this._iStride = pVertexDeclaration;
    }
    else {
        this._iStride = pVertexDeclaration.stride;
        this.setVertexDeclaration(pVertexDeclaration);
    }

    debug_assert(this._pVertexBuffer.size >= this.size + this.getOffset(), "IndexData выходит за пределы IndexBuffer");
}


VertexData.prototype.toNumber = function () {
    return this._iID;
}

PROPERTY(VertexData, 'declaration',
    function () {
        return this._pVertexDeclaration;
    });

PROPERTY(VertexData, "buffer", function () {return this._pVertexBuffer;});


/**
 * @property getOffset()
 * Возвращает начало VertexData в индексном буфере
 * @memberof VertexData
 * @return Int
 **/
VertexData.prototype.getOffset = function () {
    return this._iOffset;
};



VertexData.prototype.getVertexBuffer = function () {
    return this._pVertexBuffer;
};

/**
 * @property getOffset()
 * Возвращает начало VertexData в индексном буфере
 * @memberof VertexData
 * @return Int
 **/
VertexData.prototype.getStartIndex = function () {
    var iIndex = this.getOffset() / this.getStride();
    debug_assert(iIndex % 1 == 0, "Вычислить значенеи индекса указывающего на первый элемен нельзя)");
    return iIndex;
};


VertexData.prototype.destroy = function () {
    this._pVertexDeclaration = null;
    this._nMemberCount = undefined;
};


/**
 * @property size
 * Размер VertexData
 * @memberof VertexData
 * @return Int
 **/
PROPERTY(VertexData, "size", function () {
    return this.getStride() * this.getCount();
});

PROPERTY(VertexData, 'length',
    function () {
        return this._nMemberCount;
    });

PROPERTY(VertexData, 'stride',
    function () {
        return this._iStride;
    });


VertexData.prototype.extend = function (pVertexDecl, pData) {
    pVertexDecl = a.normalizeVertexDecl(pVertexDecl);
    pData = new Uint8Array(pData.buffer);

    debug_assert(this.length === pData.byteLength / pVertexDecl.stride,
        'invalid data size for extending');

    var nCount = this._nMemberCount;
    //strides modifications
    var nStrideNew = pVertexDecl.stride;
    var nStridePrev = this.stride;
    var nStrideNext = nStridePrev + nStrideNew;
    //total bytes after extending
    var nTotalSize = nStrideNext * this.length;
    var pDecl = this.getVertexDeclaration().clone();

    //data migration
    var pDataPrev = new Uint8Array(this.getData());
    var pDataNext = new Uint8Array(nTotalSize);

    for (var i = 0, iOffset; i < nCount; ++i) {
        iOffset = i * nStrideNext;
        pDataNext.set(pDataPrev.subarray(i * nStridePrev, (i + 1) * nStridePrev), iOffset);
        pDataNext.set(pData.subarray(i * nStrideNew, (i + 1) * nStrideNew), iOffset + nStridePrev);
    }

    if (!pDecl.extend(pVertexDecl)) {
        return false;
    }

    if (!this.resize(nCount, pDecl)) {
        return false;
    }

    return this.setData(pDataNext, 0, nStrideNext);;
};

VertexData.prototype.applyModifier = function(eSemantics, fnModifier) {
    'use strict';

    var pData = this.getTypedData(eSemantics);
    fnModifier(pData);
    return this.setData(pData, eSemantics);
};

VertexData.prototype.resize = function (nCount, pVertexDeclaration) {
    var iStride = 0;

    if (arguments.length == 2) {
        if (typeof(pVertexDeclaration) == "number") {
            iStride = pVertexDeclaration;
        }
        else {
            iStride = pVertexDeclaration.stride;
        }

        if (nCount * iStride <= this.size) {
            this._nMemberCount = nCount;
            this._iStride = iStride;
            this._pVertexDeclaration = null;

            if (typeof(pVertexDeclaration) != "number") {
                this.setVertexDeclaration(pVertexDeclaration);
            }

            return true;
        }
        else {
            var pOldVertexBuffer = this.getVertexBuffer();

            this._pVertexBuffer.freeVertexData(this);

            if (pOldVertexBuffer.getEmptyVertexData(nCount, pVertexDeclaration, this) !== this) {
                return false;
            }
            return true;
        }
    }
    else if (arguments.length == 1) {
        if (nCount <= this.size) {
            this._nMemberCount = nCount;
            return true;
        }
        else {
            var pOldVertexBuffer = this.getVertexBuffer();
            var pOldVertexDeclaration = this.getVertexDeclaration();
            var iOldStride = this.getStride();

            this._pVertexBuffer.freeVertexData(this);

            if (pOldVertexBuffer.getEmptyVertexData(nCount, iOldStride, this) == null) {
                return false;
            }

            this.setVertexDeclaration(pOldVertexDeclaration);
            return true;
        }
    }

    return false;
}

/**
 * @property setData(ArrayBuffer pData, String sSematic)
 * @param pData данные одного типа
 * @param sSematic имя сематики, которую заполняем
 * Выставить определеные элементы в буфере
 * @return
 **/

/**
 * @property setData(ArrayBuffer pData,Int iOffset, Int iSize)
 * @param pData данные одного типа
 * @param iOffset смещение данных относительно начала строки
 * @param iSize размер этих данных в одной строке
 * @param nCountStart номер строки с которой происходит добавление
 * @param nCount количество вставляемых элементов
 * Выставить определеные элементы в буфере
 * @return
 **/
VertexData.prototype.setData = function (pData, iOffset, iSize, nCountStart, nCount) {

    switch (arguments.length) {
        case 5:
            var iStride = this.getStride();
            if (iStride != iSize) {
                //FIXME: очень тормознутое место, крайне медленно работает...
                for (var i = nCountStart; i < nCount + nCountStart; i++) {
                    this._pVertexBuffer.setData(pData.buffer.slice(iSize * (i - nCountStart),
                        iSize * (i - nCountStart) + iSize), iStride * i + iOffset + this.getOffset(),
                        iSize);
                }
            }
            else {
                this._pVertexBuffer.setData(pData.buffer.slice(0, iStride * nCount), iOffset + this.getOffset(),
                    iStride * nCount); 
            }
            return true;
        case 4:
            var pDeclaration = this._pVertexDeclaration,
                pElement = null;

            if (typeof(arguments[1]) == "string") {
                pElement = pDeclaration.element(arguments[1]);
                if (pElement) {
                    return this.setData(
                        pData,
                        pElement.iOffset,
                        pElement.iSize,
                        arguments[2], arguments[3]);
                }
                return false;
            }
            else {
                nCountStart = nCountStart || 0;
                if (!nCount) {
                    nCount = pData.buffer.byteLength / iSize;
                }
                return this.setData(pData, iOffset, iSize, nCountStart, nCount);
            }
            return false;
        case 2:
        case 3:
            var pDeclaration = this._pVertexDeclaration,
                pElement = null;

            if (typeof(arguments[1]) == "string") {
                pElement = pDeclaration.element(arguments[1]);

                if (pElement) {
                    arguments[2] = arguments[2] || 0;
                    if (!arguments[3]) {
                        arguments[3] = pData.buffer.byteLength / pElement.iSize;
                    }
                    return this.setData(pData,
                        pElement.iOffset,
                        pElement.iSize, arguments[2], arguments[3])
                }
                return false
            }
            else if (arguments.length === 3) {
                nCountStart = nCountStart || 0;
                if (!nCount) {
                    nCount = pData.byteLength / iSize;
                }

                return this.setData(pData, iOffset, iSize, nCountStart, nCount);
            }

            return false;
        case 1:
            return this.setData(pData, this._pVertexDeclaration[0].eUsage);
        default:
            return false;
    }
    return false;
}


VertexData.prototype.getTypedData = function (eUsage, iFrom, iCount) {
    eUsage = eUsage || this._pVertexDeclaration[0].eUsage;

    var pVertexElement = this._pVertexDeclaration.element(eUsage);

    if (pVertexElement) {
        return this.getData(eUsage, iFrom, iCount).toTypedArray(pVertexElement.eType);
    }

    return null;
};

/**
 * @property getData(sSematic)
 * @param sSematic  имя сематики, которую получаем
 * Получить определенные элементы из буффера
 * @return
 **/


/**
 * @property getData(Int iOffset, Int iSize)
 * @param iOffset смещение данных относительно начала строки
 * @param iSize размер этих данных в одной строке
 * Получить определенные элементы из буффера
 * @return
 **/
VertexData.prototype.getData = function (iOffset, iSize, iFrom, iCount) {
    switch (arguments.length) {
        case 4:
        case 2:
            if (typeof arguments[0] === 'string') {
                return this.getData(arguments[0], arguments[1], 0, this._nMemberCount);
            }

            iFrom = iFrom || 0;
            iCount = iCount || this._nMemberCount;
            iCount = Math.min(iCount, this._nMemberCount);

            var iStride = this.getStride();
            var pBufferData = new Uint8Array(iSize * this.getCount());

            for (var i = iFrom; i < iCount; i++) {
                pBufferData.set(new Uint8Array(this._pVertexBuffer.getData(iStride * i + iOffset + this.getOffset(),
                    iSize)), i * iSize);
            }

            return pBufferData.buffer;
        case 3:
        case 1:
            var pDeclaration = this._pVertexDeclaration,
                pElement = null;

            if (typeof(arguments[0]) == "string") {
                pElement = pDeclaration.element(arguments[0]);

                if (pElement) {
                    return this.getData(
                        pElement.iOffset,
                        pElement.iSize, 
                        arguments[1], 
                        arguments[2]
                        )
                }
                return null;
            }
            return null;
        case 0:
            return this.getData(0, this._pVertexDeclaration.stride);
        default:
            return null;
    }
    return null;
}


/**
 * @property activate()
 * Активировать буфер
 * @memberof VertexBuffer
 **/
VertexData.prototype.activate = function () {   
    this._pVertexBuffer.activate();
    return true;
}

/**
 * @property setVertexDeclaration(pVertexDeclaration,iElementCount)
 * Прикурчивание к шейдеру атрибутов и их инициализация
 * @memberof VertexData
 * @param pVertexDeclaration массив с описанием парметров подбуфеорв
 * @return Boolean
 **/
VertexData.prototype.setVertexDeclaration = function (pVertexDeclaration) {
    debug_assert(!this._pVertexDeclaration, "pVertexDeclaration уже выставлен");

    var iStride = 0;
    var nVertexElementCount;

    this._pVertexDeclaration = pVertexDeclaration.clone();

    iStride = this._pVertexDeclaration.stride;

    debug_assert(iStride < a.VertexData.MaxElementsSize, "stride max is 255 bytes");
    debug_assert(iStride <= this.getStride(), "stride in VertexDeclaration больше чем stride in construtor");

    return true;
};

/**
 * @property stride()
 * Возвращает размер строки в байтах
 * @memberof VertexData
 * @return Int размер строки
 **/
VertexData.prototype.getStride = function () {
    return this._iStride;
}


/**
 * @property count()
 * Возвращает количество строк в буфере
 * @memberof VertexData
 * @return Int
 **/
VertexData.prototype.getCount = function () {
    return this._nMemberCount;
}

/**
 * @property vertexElementCount()
 *
 * @memberof VertexData
 * @return Int
 **/
VertexData.prototype.getVertexElementCount = function () {
    return this._pVertexDeclaration.length;
}

/**
 * @property VertexDeclaration()
 * Возвращает массив описателей подбуферов свзяанных с буфером
 * @memberof VertexData
 * @return Array
 **/
VertexData.prototype.getVertexDeclaration = function () {
    return this._pVertexDeclaration;
}

VertexData.prototype.hasSemantics = function (eSemantics) {
    if (this._pVertexDeclaration != null) {
        return this._pVertexDeclaration.hasSemantics(eSemantics);
    }
    return false;
}

VertexData.prototype.resourceHandle = function () {
    return this._pVertexBuffer.resourceHandle();
}

Ifdef (__DEBUG)

VertexData.prototype.toString = function() {
    'use strict';

    var s = '';
    s += '          VERTEX DATA  #' + this.toNumber() + '\n';
    s += '---------------+-----------------------\n';
    s += '        BUFFER : ' + this.resourceHandle() + '\n';
    s += '          SIZE : ' + this.size + ' b.\n';
    s += '        OFFSET : ' + this.getOffset() + ' b.\n';
    s += '---------------+-----------------------\n';
    s += ' MEMBERS COUNT : ' + this.getCount() + ' \n';
    s += '        STRIDE : ' + this.getStride() + ' \n';
    s += '---------------+-----------------------\n';
    s += this.getVertexDeclaration().toString();
    return s;
};

Endif ();

A_NAMESPACE(VertexData);