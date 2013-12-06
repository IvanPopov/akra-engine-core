var akra = {};

/**
 * / <reference path="../idl/IConverter.ts" />
 * / <reference path="../idl/EDataTypes.ts" />
 * / <reference path="../idl/3d-party/fixes.d.ts" />
 * / <reference path="../common.ts" />
 */
akra.conv = {};

/** @type {akra.IConvertionTable} */ akra.conv.conversionFormats;

/**
 * @param {string} sValue
 * @returns {boolean}
 */
akra.conv.parseBool = function (sValue) {
  return (sValue === "true");
};

/**
 * @param {string} sValue
 * @returns {string}
 */
akra.conv.parseString = function (sValue) {
  return String(sValue);
};

/**
 * @param {string} sJSON
 * @returns {?}
 */
akra.conv.parseJSON = function (sJSON) {
  return eval('(' + sJSON + ')');
};

/**
 * Convert text/html into Dom object.
 *
 * @param {string} sHTML
 * @returns {NodeList}
 */
akra.conv.parseHTML = function (sHTML) {
  /** @type {HTMLDivElement} */ var pDivEl = /** @type {HTMLDivElement} */ (/** @type {HTMLDivElement} */ (document.createElement('div')));
  /** @type {DocumentFragment} */ var pDocFrag;

  pDivEl.innerHTML = sHTML;

  return pDivEl.childNodes;
};

/**
 * @param {string} sHtml
 * @returns {DocumentFragment}
 */
akra.conv.parseHTMLDocument = function (sHtml) {
  /** @type {DocumentFragment} */ var pDocFrag;
  /** @type {NodeList} */ var pNodes = akra.conv.parseHTML(sHtml);

  pDocFrag = document.createDocumentFragment();

  for (var i = 0, len = pNodes.length; i < len; ++i) {
    if (!akra.isDef(pNodes[i])) {
      continue;
    }

    pDocFrag.appendChild(pNodes[i]);
  }

  return pDocFrag;
};

/**
 * @param {?} pSrc
 * @param {?} pDst
 * @param {number=} iStride
 * @param {number=} iFrom
 * @param {number=} iCount
 * @param {number=} iOffset
 * @param {number=} iLen
 * @returns {number}
 */
akra.conv.retrieve = function (pSrc, pDst, iStride, iFrom, iCount, iOffset, iLen) {
  if (!akra.isDef(iCount)) {
    iCount = ((/** @type {Array.<?>} */ (/** @type {?} */ (pSrc))).length / iStride - iFrom);
  }

  if (iOffset + iLen > iStride) {
    iLen = iStride - iOffset;
  }

  /** @type {number} */ var iBegin = iFrom * iStride;
  /** @type {number} */ var n = 0;

  for (var i = 0; i < iCount; ++i) {
    for (var j = 0; j < iLen; ++j) {
      pDst[n++] = (pSrc[iBegin + i * iStride + iOffset + j]);
    }
  }

  return n;
};

/**
 * @param {string} sData
 * @param {Array.<?>} ppData
 * @param {?function(string, ...[?]): ?} fnConv
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.string2Array = function (sData, ppData, fnConv, iFrom) {
  /** @type {Array.<string>} */ var pData = /** @type {Array.<string>} */ (sData.split(/[\s]+/g));

  for (var i = 0, n = pData.length, j = 0; i < n; ++i) {
    if (pData[i] != "") {
      ppData[iFrom + j] = fnConv(pData[i]);
      j++;
    }
  }

  return j;
};
/**
 * @param {string} sData
 * @param {Array.<number>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stoia = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, parseInt, iFrom);
};
/**
 * @param {string} sData
 * @param {Array.<number>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stofa = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, parseFloat, iFrom);
};
/**
 * @param {string} sData
 * @param {Array.<boolean>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stoba = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, akra.conv.parseBool, iFrom);
};
/**
 * @param {string} sData
 * @param {Array.<string>} ppData
 * @param {number=} iFrom
 * @returns {number}
 */
akra.conv.stosa = function (sData, ppData, iFrom) {
  return akra.conv.string2Array(sData, ppData, akra.conv.parseString, iFrom);
};

/**
 * @param {string} sData
 * @param {number} n
 * @param {string} sType
 * @param {boolean=} isArray
 * @returns {?}
 */
akra.conv.stoa = function (sData, n, sType, isArray) {
  /** @type {akra.IConvertionTableRow} */ var pRow = akra.conv.conversionFormats[sType];
  /** @type {?} */ var ppData = new (pRow.type)(n);
  pRow.converter(sData, ppData);

  if (n == 1 && !isArray) {
    return ppData[0];
  }

  return ppData;
};

// data convertion
akra.conv.conversionFormats = {
  "int": { type: Int32Array, converter: akra.conv.stoia },
  "float": { type: Float32Array, converter: akra.conv.stofa },
  "boolean": { type: Array, converter: akra.conv.stoba },
  "string": { type: Array, converter: akra.conv.stosa }
};

/**
 * ////////////////
 * Convert string to ArrayBuffer.
 *
 * @param {string} s
 * @returns {ArrayBuffer}
 */
akra.conv.stoab = function (s) {
  /** @type {number} */ var len = s.length;
  /** @type {Uint8Array} */ var pCodeList = new Uint8Array(len);

  for (var i = 0; i < len; ++i) {
    pCodeList[i] = s.charCodeAt(i);
  }

  return pCodeList.buffer;
};

/**
 * Convert ArrayBuffer to string.
 *
 * @param {ArrayBuffer} pBuf
 * @returns {string}
 */
akra.conv.abtos = function (pBuf) {
  /** @type {Uint8Array} */ var pData = new Uint8Array(pBuf);
  /** @type {string} */ var s = "";

  for (var n = 0; n < pData.length; ++n) {
    s += String.fromCharCode(pData[n]);
  }

  return s;
  // return String.fromCharCode.apply(null, Array.prototype.slice.call(new Uint8Array(pBuf), 0));
};

/**
 * Convert ArrayBuffer to string via BlobReader.
 *
 * @param {ArrayBuffer} pBuffer
 * @param {?function(string)} callback
 */
akra.conv.abtosAsync = function (pBuffer, callback) {
  /** @type {Blob} */ var bb = new Blob([pBuffer]);
  /** @type {FileReader} */ var f = new FileReader();

  f.onload = function (e) {
    callback(e.target.result);
  };

  f.readAsText(bb);
};

/**
 * Convert ArrayBuffer to typed array.
 *
 * @param {ArrayBuffer} pBuffer
 * @param {akra.EDataTypes} eType
 * @returns {ArrayBufferView}
 */
akra.conv.abtota = function (pBuffer, eType) {
  switch (eType) {
    case akra.EDataTypes.FLOAT:
      return new Float32Array(pBuffer);
    case akra.EDataTypes.SHORT:
      return new Int16Array(pBuffer);
    case akra.EDataTypes.UNSIGNED_SHORT:
      return new Uint16Array(pBuffer);
    case akra.EDataTypes.INT:
      return new Int32Array(pBuffer);
    case akra.EDataTypes.UNSIGNED_INT:
      return new Uint32Array(pBuffer);
    case akra.EDataTypes.BYTE:
      return new Int8Array(pBuffer);
    default:
    case akra.EDataTypes.UNSIGNED_BYTE:
      return new Uint8Array(pBuffer);
  }
};

/**
 * Blob to ArrayBuffer async.
 *
 * @param {Blob} pBlob
 * @param {?function(ErrorEvent, ArrayBuffer)} fn
 */
akra.conv.btoaAsync = function (pBlob, fn) {
  /** @type {FileReader} */ var pReader = new FileReader();

  pReader.onload = function (e) {
    fn(null, e.target.result);
  };

  pReader.onerror = function (e) {
    fn(e, null);
  };

  pReader.readAsArrayBuffer(pBlob);
};

/**
 * DataURL to Blob object async.
 *
 * @param {string} sBlobURL
 * @param {?function(Blob)} fn
 */
akra.conv.dutobAsync = function (sBlobURL, fn) {
  /** @type {XMLHttpRequest} */ var xhr = new XMLHttpRequest();
  xhr.open("GET", sBlobURL, true);
  xhr.responseType = "blob";

  xhr.onload = function (e) {
    if (this.status == 200) {
      fn(/** @type {Blob} */ (this.response));
    }
  };

  xhr.send();
};

/**
 * Data URL to JSON.
 *
 * @param {string} sBlobURL
 * @param {?function(Object)} fn
 */
akra.conv.dutojAsync = function (sBlobURL, fn) {
  /** @type {XMLHttpRequest} */ var xhr = new XMLHttpRequest();

  xhr.open("GET", sBlobURL, true);
  xhr.overrideMimeType('application/json');
  xhr.responseType = "json";

  xhr.onload = function (e) {
    if (this.status == 200) {
      fn(/** @type {Object} */ (this.response));
    }
  };

  xhr.send();
};

/**
 * Data URL to Blob object.
 *
 * @param {?} dataURI
 * @returns {Blob}
 */
akra.conv.dutob = function (dataURI) {
  /**
   * convert base64 to raw binary data held in a string
   * doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
   *
   * @type {string}
   */
  var byteString = atob(dataURI.split(',')[1]);

  /**
   * separate out the mime component
   *
   * @type {?}
   */
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  /**
   * write the bytes of the string to an ArrayBuffer
   *
   * @type {ArrayBuffer}
   */
  var ab = new ArrayBuffer(byteString.length);
  /** @type {Uint8Array} */ var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  /**
   * write the ArrayBuffer to a blob, and you're done
   *
   * @type {Blob}
   */
  var bb = new Blob([ab], { type: mimeString });
  return bb;
};

/**
 * TODO: remove this
 *
 * @param {?} data
 * @param {string=} mime
 * @returns {string}
 */
akra.conv.toURL = function (data, mime) {
  if (typeof mime === "undefined") mime = "text/plain";
  /** @type {Blob} */ var blob;

  try  {
    blob = new Blob([data], { type: mime });
  } catch (e) {
    /**
     * Backwards-compatibility
     *
     * @type {BlobBuilder}
     */
    var bb = new BlobBuilder();
    bb.append(data);
    blob = bb.getBlob(mime);
  }

  return URL.createObjectURL(blob);
};

/**
 * Convert UTF8 string to Base64 string
 *
 * @param {string} s
 * @returns {string}
 */
akra.conv.utf8tob64 = function (s) {
  return window.btoa(unescape(encodeURIComponent(s)));
};

/**
 * @param {string} argString
 * @returns {string}
 */
akra.conv.toUTF8 = function (argString) {
  if (argString === null || typeof argString === "undefined") {
    return "";
  }

  /**
   * .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
   *
   * @type {string}
   */
  var string = (argString + "");
  /** @type {string} */ var utftext = "";
  /** @type {?} */ var start;
  /** @type {?} */ var end;
  /** @type {number} */ var stringl = 0;

  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    /** @type {number} */ var c1 = string.charCodeAt(n);
    /** @type {?} */ var enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl);
  }

  return utftext;
};

/**
 * @param {string} str_data
 * @returns {string}
 */
akra.conv.fromUTF8 = function (str_data) {
  /**
   * http://kevin.vanzonneveld.net
   * +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
   * +      input by: Aman Gupta
   * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * +   improved by: Norman "zEh" Fuchs
   * +   bugfixed by: hitwork
   * +   bugfixed by: Onno Marsman
   * +      input by: Brett Zamir (http://brett-zamir.me)
   * +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * *     example 1: utf8_decode('Kevin van Zonneveld');
   * *     returns 1: 'Kevin van Zonneveld'
   *
   * @type {Array.<?>}
   */
  var tmp_arr = [];
  /** @type {number} */ var i = 0;
  /** @type {number} */ var ac = 0;
  /** @type {number} */ var c1 = 0;
  /** @type {number} */ var c2 = 0;
  /** @type {number} */ var c3 = 0;

  str_data += "";

  while (i < str_data.length) {
    c1 = str_data.charCodeAt(i);
    if (c1 < 128) {
      tmp_arr[ac++] = String.fromCharCode(c1);
      i++;
    } else if (c1 > 191 && c1 < 224) {
      c2 = str_data.charCodeAt(i + 1);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = str_data.charCodeAt(i + 1);
      c3 = str_data.charCodeAt(i + 2);
      tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }

  return tmp_arr.join("");
};
