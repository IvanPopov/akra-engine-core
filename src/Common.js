/**
 * @file
 * @brief Общие функции, типы, макросы.
 * @author Ivan Popov
 * @email vantuziast@odserve.org
 */

Define(__AKRA_ENGINE__, true);
// Define(trace(__ARGS__), function () { /*console.log(__ARGS__);*/ });
window.trace = console.log.bind(console);

// ========== NAMEPSPACEs ========

Define(PROPERTY_GUARD(object, $$property, value), function () {
    object[property] = value;
});

Define(A_DEFINE_NAMESPACE($$name), function () {
    if (!a[name]) a[name] = {};
});
Define(A_DEFINE_NAMESPACE($$name, $$space), function () {
    if (!a[space][name]) a[space][name] = {};
});
Define(A_NAMESPACE(object, $$space), function () {
    PROPERTY_GUARD(a[space], object, object)
});

Define(A_NAMESPACE(object), function () {
    PROPERTY_GUARD(a, object, object);
});

A_DEFINE_NAMESPACE(fx);
A_DEFINE_NAMESPACE(util);


/**
 * Implementation inheritance in Javascript.
 * @tparam pChild Child object.
 * @tparam pParent Parent object.
 */
function extend(pChild) {
    var fnGet, fnSet, i, sKey;
    var pParent = arguments[1];
    var argv = arguments;

    //classical inheritance
    pChild.prototype = Object.create(pParent.prototype);
    pChild.prototype.constructor = pChild;
    pChild.superclass = pParent.prototype;

//    console.log(argv);
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
            var pCtorValue = argv[i].apply(this, arguments);
            if (pCtorValue !== undefined) {
                return pCtorValue;
            }
        }
    };
};

A_NAMESPACE(extend);

Define(TO_STRING($$object), function () {
    object;
});

Define(A_CHECK_STORAGE(), function () {
    if (this === window || !this || this === window.AKRA) {
        //FIXME: remove debug info
        //if (__FUNC__._iIndex === __FUNC__._nStorageSize - 1) {trace('REACHED LIMIT OF ', GET_FUNC_NAME(__FUNC__));}
        __FUNC__._iIndex = __FUNC__._iIndex === __FUNC__._nStorageSize - 1? 0: __FUNC__._iIndex;
        return __FUNC__._pStorage[__FUNC__._iIndex ++];
    }
});
    
function allocateStorage(pObject, nSize) {
    var nStorageSize = nSize || 100;

    pObject._nStorageSize = nStorageSize;
    pObject._pStorage = new Array(pObject._nStorageSize);
    pObject._iIndex = 0;

    var pStorage = pObject._pStorage;
    for(var i=0;i<pObject._nStorageSize;i++){
        pStorage[i] = new pObject();
    }
}

A_NAMESPACE(allocateStorage);

Define(A_ALLOCATE_STORAGE(object, n), function () {
    a.allocateStorage(object, n);
});
Define(A_ALLOCATE_STORAGE(object), function () {
    a.allocateStorage(object, 16);
});

function now () {
    'use strict';
    return (new Date).getTime();
}

A_NAMESPACE(now);
// function childOf (pChild, tParent) {
//     'use strict';

//     warning('childOf: function is dangerous and should not be used.');

//     if (pChild.constructor === tParent) {
//         return true;
//     }

//     var sParent = GET_FUNC_NAME(tParent);
//     for (var k in pChild.constructor.superclasses) {
//         if (k === sParent) {
//             return true;
//         }

//         console.log('--->', pChild.constructor.superclasses[k]);
//     };

//     return false;
// };

//A_NAMESPACE(childOf);

Define(EXTENDS(__ARGS__), function () {a.extend(__ARGS__)});

/**
 * Copy object
 * @tparam Object pObject Исходный объект.
 * @treturn Object Копия объекта.
 */

a.clone = function (pObject) {
    if (pObject === null || typeof(pObject) !== 'object') {
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
function getClass(pObj) {
    if (pObj && typeof pObj === 'object' &&
        Object.prototype.toString.call(pObj) !== '[object Array]' && pObj.constructor && pObj != this.window) {
        var arr = pObj.constructor.toString().match(/function\s*(\w+)/);
        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    var sType = typeof pObj;
    return sType[0].toUpperCase() + sType.substr(1);
};

A_NAMESPACE(getClass);

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

A_NAMESPACE(parseJSON);

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

Ifdef(__RELEASE)
Elseif()
    Define(__DEBUG, 1)
Endif()

Ifdef(A_CORE_HOME)

Elseif()
Define(A_CORE_HOME, '');
Endif();

Ifdef(__DEBUG)

Define(a.isDebug, true)

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

Define(PROPERTY(pObj, property, getter, setter), function () { a.defineProperty(pObj, property, getter, setter); });
Define(PROPERTY(pObj, property, getter), function () { a.defineProperty(pObj, property, getter); });
Define(PROPERTY(pObj, property), function () {});
Define(GETTER(pObj, property, getter), function () {PROPERTY(pObj, property, getter);});
Define(SETTER(pObj, property, setter), function () {PROPERTY(pObj, property, undefined, setter);});

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

Define(DISMETHOD(pObj, method), function () {
    pObj.prototype.method = undefined;
});

Define(DISPROPERTY(pObj, $$property), function () {
    PROPERTY(pObj, property, undefined, undefined);
});

Define(A_CLASS(args), function () { var _pCtorValue = __FUNC__.ctor.apply(this, args); if (_pCtorValue) {return _pCtorValue; } });
Define(A_CLASS(), function () { A_CLASS(arguments) });
Define(A_CLASS, A_CLASS());

Define(parent, parent(), true);
Define(parent(), function () { this.constructor.superclass; }, true);
Define(parent.__(__ARGS__), function () { parent.__.call(this, __ARGS__); }, true);
Define(parent.get.__, LOOKUPGETTER(parent, __), true);
Define(parent.set.__, LOOKUPSETTER(parent, __), true);
Define(parent($$obj), function () {this.constructor.superclasses[obj]}, true);



Define(LOOKUPGETTER(pObj, $$getter), function () { pObj.__lookupGetter__(getter).apply(this) });
Define(LOOKUPSETTER(pObj, $$setter), function () { pObj.__lookupSetter__(setter).apply(this) });

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


/**
 TRACER API
 */

Ifdef (__ANALYZER);

Define (A_TRACER.MESG(message), function() { window['A_TRACER.trace'](message);});
Define(A_TRACER.BEGIN(),        function() { window['A_TRACER.beginTracing']();});
Define(A_TRACER.END(),          function() { window['A_TRACER.endTracing']();});

Elseif ();

Define(A_TRACER.MESG(message),  function() {});
Define(A_TRACER.BEGIN(),        function() {});
Define(A_TRACER.END(),          function() {});

Endif ();