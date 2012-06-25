/**
 * @file
 * @brief Общие функции, типы, макросы.
 * @author Ivan Popov
 * @email vantuziast@odserve.org
 */

Define(__AKRA_ENGINE__, true);
Define(trace(__ARGS__), function () { console.log(__ARGS__); });


/**
 * Implementation inheritance in Javascript.
 * @tparam pChild Child object.
 * @tparam pParent Parent object.
 */
a.extend = function (pChild) {
    var fnGet, fnSet, i, sKey;
    var pParent = arguments[1];
    var argv = arguments;

    //classical inheritance
    pChild.prototype = Object.create(pParent.prototype);
    pChild.prototype.constructor = pChild;
    pChild.superclass = pParent.prototype;


    //multiple inheritance
    for (i = 2; i < argv.length; ++i) {
        for (sKey in argv[i].prototype) {
            if (sKey === 'constructor') {
                continue;
            }

            fnGet = argv[i].prototype.__lookupGetter__(sKey);
            fnSet = argv[i].prototype.__lookupSetter__(sKey);

            if (!fnGet && !fnSet) {
                pChild.prototype[sKey] = argv[i].prototype[sKey];
                continue;
            }

            if (fnGet) {
                a.defineProperty(pChild, sKey, fnGet);
            }

            if (fnSet) {
                a.defineProperty(pChild, sKey, null, fnSet);
            }
        }
    }

    //maintaining the parent classes
    pChild.superclasses = {};
    for (var i = 1; i < argv.length; ++i) {
        pChild.superclasses[arguments[i].toString().match(/function\s*(\w+)/)[1]] = arguments[i].prototype;
    }

    //simplified call parent constructors
    pChild.ctor = function () {
        for (var i = 1; i < argv.length; ++i) {
            argv[i].apply(this, arguments);
        }
    };
};

Define(EXTENDS(__ARGS__), function () {a.extend(__ARGS__)});

/**
 * Copy object
 * @tparam Object pObject Исходный объект.
 * @treturn Object Копия объекта.
 */
a.clone = function (pObject) {
    if (pObject == null || typeof(obj) != 'object') {
        return pObject;
    }

    var tmp = pObject.constructor();

    for (var i in pObject) {
        tmp[i] = a.clone(pObject[i]);
    }
    return tmp;
};

Define(GET_FUNC_NAME(fn), function () {
    fn.toString().match(/function\s*(\w+)/)[1]
});

/**
 * @def
 * translate macro
 */
Define(tr(str), function () {
    str;
})

/**
 * Get class of object as string.
 * @note Use eval(a.getClass(obj)) for get real type of object.
 *
 * @tparam Object pObj Исходный объект
 * @tretrurn String
 */
a.getClass = function (pObj) {
    if (pObj && typeof pObj === 'object' &&
        Object.prototype.toString.call(pObj) !== '[object Array]' && pObj.constructor && pObj != this.window) {
        var arr = pObj.constructor.toString().match(/function\s*(\w+)/);
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    return false;
};



/**
 * Преобразование json-сформированного текста
 * в Object.
 * @tparam String sJSON Исходный текст.
 * @treturn Object
 */
function parseJSON(sJSON) {
    return eval('(' + sJSON + ')');
    /*JSON.parse(sJSON, function (key, value) {
     var type;
     if (value && typeof value === 'object') {
     type = value.type;
     if (typeof type === 'string' && typeof window[type] === 'function') {
     return new (window[type])(value);
     }
     }
     return value;
     });*/
};
a.parseJSON = parseJSON;

/**
 * Преобразование html-сформированного текста
 * в dom.
 * @tparam String sHTML Исходный текст.
 * @treturn DocumentFragment
 */
function toDOM(sHTML, useDocFragment) {
    useDocFragment = useDocFragment === undefined? true: useDocFragment;
    
    var pDivEl = document.createElement('div');
    var pDocFrag = document.createDocumentFragment();

    pDivEl.innerHTML = sHTML;

    if (!useDocFragment) {
        return pDivEl.childNodes;
    }

    for (var i = 0, len = pDivEl.childNodes.length; i < len; ++i) {
        if (typeof pDivEl.childNodes[i] === 'undefined') {
            continue;
        }
        pDocFrag.appendChild(pDivEl.childNodes[i]);
    }

    return pDocFrag;
};

A_NAMESPACE(toDOM);

function sid() {
    return ++ sid.iValue;
}
sid.iValue = 0;

A_NAMESPACE(sid);

/**
 * Преобразование ArrayBuffer в строку.
 * @tparam ArrayBuffer pBuf Исходный буфер.
 */
function buf2str(pBuf) {
    var s = '';
    for (var n = 0; n < pBuf.length; ++n) {
        var c = String.fromCharCode(pBuf[n]);
        s += c;
    }
    return s;
}
A_NAMESPACE(buf2str);
/**
 * Преобразование строки в ArrayBuffer
 * @tparam String s Исходная строка.
 */
function str2buf(s) {
    var arr = new Array(len);
    for (var i = 0, len = s.length; i < len; ++i) {
        arr[ i ] = s.charCodeAt(i);// & 0xFF;
    }
    return (new Uint8Array(arr)).buffer;
}

A_NAMESPACE(str2buf);

ArrayBuffer.prototype.toTypedArray = function (eType) {
    switch (eType) {
        case a.DTYPE.FLOAT:
            return new Float32Array(this);
        case a.DTYPE.SHORT:
            return new Int16Array(this);
        case a.DTYPE.UNSIGNED_SHORT:
            return new Uint16Array(this);
        case a.DTYPE.INT:
            return new Int32Array(this);
        case a.DTYPE.UNSIGNED_INT:
            return new Uint32Array(this);
        case a.DTYPE.BYTE:
            return new Int8Array(this);
        default:
        case a.DTYPE.UNSIGNED_BYTE:
            return new Uint8Array(this);
    }
    return null;
}

Ifdef(__RELEASE)
Elseif()
    Define(__DEBUG, 1)
Endif()

If(A_CORE_HOME)

Elseif()
Define(A_CORE_HOME, '');
Endif();

Ifdef(__DEBUG)

Define(a.isDebug, true)

Number.prototype.printBinary = function (isPretty) {
    var res = '';
    for (i = 0; i < 32; ++i) {
        if (i && (i % 4) == 0 && isPretty) {
            res = ' ' + res;
        }
        (this >> i & 0x1 ? res = '1' + res : res = '0' + res);
    }
    return res;
};

Define(debug_assert(cond, comment), function () {
    if (!cond) {
        var err = "Error:: " + comment + "\n" +
            "\tfile: " + __FILE__ + "\n" +
            "\tline: " + __LINE__ + "\n";
        if (confirm(err + "Accept to exit, refuse to continue.")) {
            throw new Error(comment);
        }
    }
});

Define(debug_assert_win(cond, caption, content), function () {
	if (!cond) {
	        var err = "Error:: " + caption + "\n" +
	            "\tfile: " + __FILE__ + "\n" +
	            "\tline: " + __LINE__ + "\n";
	        if (confirm(err + "Accept to exit, refuse to continue.")) {
		        (new a.DebugWindow(caption)).print(content);
	        }
	    }
});

Define(warning(x), function () {
    console.warn('[WARNING][' + __FILE__ + '][' + __LINE__ + ']' + x);
});

Define(warn_assert(cond, comment), function () {
    if (!cond) {
        warning(comment);
    }
});

Define(debug_error(x), function () {
    debug_assert(0, x);
});

Define(assert(x), function () {
    debug_assert(x, "");
});

Define(ASSERT(cond, comment), function () {
    debug_assert(cond, comment);
});

Define(assert(cond, comment), function () {
    debug_assert(cond, comment);
});

Define(ASSERT(x), function () {
    debug_assert(x, "");
});

Define(error(x), function () {
    debug_error(x);
});

Define(BUILD_PATH(FILE, PATH), function () {
    A_CORE_HOME + PATH + FILE;
});

Define(MEDIA_PATH(FILE, PATH), function () {
    PATH + FILE;
});

Define(debug_print(x), function () {
    console.log('[DEBUG][' + __FILE__ + '][' + __LINE__ + ']' + x);
});

Define(TRACE(x), function () {
    debug_print(x);
});


Define(INLINE(), function () {

});

Define(INLINE(x), function () {

});

Define(PR_DISPLAYMNGR, this._pEngine.displayManager());
Define(PR_UNIQMNGR, this._pEngine.uniqManager());

Define(TODO(x), function () {
    debug_print('TODO:: ' + x);
    throw new Error('TODO::\n' + x);
});

Endif()


/* RELEASE BUILD
--------------------------------------
******************************************/

Ifdef(__RELEASE);

Define(a.isDebug, false);
Define(debug_assert(cond, comment), function () {});
Define(warning(x), function () {console.warn(x);});
Define(warn_assert(cond, comment), function () { if (!cond) warning(comment); });
Define(debug_error(x), function () {});
Define(error(x), function () {throw new Error(x);});
Define(assert(x), function () {error(x);});
Define(ASSERT(x), function () {assert(x);});
Define(assert(cond, comment), function () {if (!cond) error(comment);});
Define(ASSERT(cond, comment), function () {assert(cond, comment);});
Define(BUILD_PATH(FILE, PATH), function () {A_CORE_HOME + FILE;})
Define(debug_print(x), function () {});
Define(TRACE(x), function () {});
Define(INLINE(), function () {});
Define(INLINE(x), function () {});
Define(TODO(x), function () {error('unsupported future');});
Define(MEDIA_PATH(FILE, PATH), function () {PATH + FILE;});
Endif()

Define(ifelse(test, v1, v2), function () { (test ? v1 : v2);});
Define(ifndef(x, v), function () {(x === undefined ? v : x);});
Define(isset(v), function () {(v !== undefined); });

/**
 * Com helpers
 */

Define(remove_reference(p), function () {
    if (p) {
        (p).release();
    }
});

Define(safe_release(p), function () {
    if (p) {
        var safe_release_refcount = (p).release();
        if (safe_release_refcount != 0) {
            debug_assert(0, "WARNING: non-zero reference count on release (" + safe_release_refcount + ")\n");
        }
        p = 0;

        //return(safe_release_refcount);
    }
//return(0);
});

Define(PROPERTY(obj, property, getter, setter), function () { a.defineProperty(obj, property, getter, setter); });
Define(PROPERTY(obj, property, getter), function () { a.defineProperty(obj, property, getter); });
Define(PROPERTY(obj, property), function () {});
Define(GETTER(obj, property, getter), function () {PROPERTY(obj, property, getter);});
Define(SETTER(obj, property, setter), function () {PROPERTY(obj, property, undefined, setter);});

a.defineProperty = function (pObj, sProperty, fnGetter, fnSetter) {
    if (!fnGetter && !fnSetter) return;

    fnGetter = fnGetter || pObj.prototype.__lookupGetter__(sProperty);
    fnSetter = fnSetter || pObj.prototype.__lookupSetter__(sProperty);

    Object.defineProperty(pObj.prototype, sProperty, {
        get:         fnGetter,
        set:         fnSetter,
        enumerable:  true,
        configurable:true
    });
};

Define(DISMETHOD(obj, method), function () {
    obj.prototype.method = undefined;
});

Define(DISPROPERTY(obj, $$property), function () {
    PROPERTY(obj, property, undefined, undefined);
});

Define(A_CLASS(args), function () { __FUNC__.ctor.apply(this, args); });
Define(A_CLASS(), function () { A_CLASS(arguments) });
Define(A_CLASS, A_CLASS());

Define(parent, parent(), true);
Define(parent(), function () { this.constructor.superclass; }, true);
Define(parent.__(__ARGS__), function () { parent.__.call(this, __ARGS__); }, true);
Define(parent.get.__, LOOKUPGETTER(parent, __), true);
Define(parent.set.__, LOOKUPSETTER(parent, __), true);
Define(parent($$obj), function () {this.constructor.superclasses[obj]}, true);



Define(LOOKUPGETTER(obj, $$getter), function () { obj.__lookupGetter__(getter).apply(this) });
Define(LOOKUPSETTER(obj, $$setter), function () { obj.__lookupSetter__(setter).apply(this) });

Define(statics.__, this.constructor.__);
Define(STATIC(name, value), function () {
    if (!this.constructor.name) {
        this.constructor.name = value;
    }
});
Define(STATIC(object, name, value), function () {
    object.name = value;
});


/**
 * memory
 */

Define(safe_delete_array(p), function () {
    {
        if (p) {
            for (var _s = 0; _s < p.length; ++ _s) {
                safe_delete(p[_s]);
            }
            delete (p);
            (p) = null;
        }
    }
});

Define(safe_delete(p), function () {
    {
        if (p) {
            if (p.destructor) {
                p.destructor();
            }
            delete(p);
            (p) = null;
        }
    }
});


/**
 * Генерация типизированного массива на N элементов.
 * @tparam * pType Тип объекта.
 * @tparam Uint nSize Число элементов.
 */
window['GEN_ARRAY'] = function (pType, nSize) {
    var tmp = new Array(nSize);
    for (var _i = 0; _i < nSize; ++_i) {
        tmp[_i] = (pType? new pType: null);
    }
    return tmp;
}

Define(GEN_ARRAY(name, type, size), function () {
    name = [];
    for (var _i = 0; _i < size; ++_i) {
        name[_i] = (type ? (new type) : null);
    }
});

Define(A_DEFINE_NAMESPACE(name), function () {
    if (!a.name) a.name = {};
});
Define(A_DEFINE_NAMESPACE(name, space), function () {
    if (!a.space.name) a.space.name = {};
});
Define(A_NAMESPACE(object, space), function () {
    a.space.object = object;
});

Define(A_NAMESPACE(object), function () {
    a.object = object;
});

/**
 TRACER API
 */

Define(A_TRACER.MESG(message), function () {});
Define(A_TRACER.BEGIN(), function() {});
Define(A_TRACER.END(), function() {});