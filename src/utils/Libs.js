/**
 * @file
 * @author Ivan Popov
 * @email vantuziast@odserve.org
 *
 */

(function () {

    Include('libs/strings/utf8.js');

    /**
     * Encodes an ISO-8859-1 string to UTF-8
     * @treturn String
     */
    String.prototype.toUTF8 = function () {
        return utf8_encode(this);
    };

    /**
     * Converts a UTF-8 encoded string to ISO-8859-1
     * @treturn String
     */
    String.prototype.fromUTF8 = function () {
        return utf8_decode(this);
    };

    Include('libs/crypto/md5.js');
    Include('libs/crypto/sha-1.js');
    Include('libs/crypto/crc32.js');


    String.prototype.md5 = function () {
        return md5(this);
    };

    String.prototype.sha1 = function () {
        return sha1(this);
    };

    String.prototype.crc32 = function () {
        return crc32(this);
    };

    String.prototype.replaceAt = function (n, chr) {
        return this.substr(0, n) + chr + this.substr(n + chr.length);
    };

    Number.prototype.toHex = function (iLength) {
        'use strict';
        var sValue = this.toString(16);
        for (var i = 0; i < iLength - sValue.length; ++ i) {
            sValue = '0' + sValue;
        }
        return sValue;
    };

    Object.defineProperty(Array.prototype, 'last', {
        enumerable: false,
        configurable: true,
        get: function() {
            return this[this.length - 1];
        },
        set: undefined
    });

    Object.defineProperty(Array.prototype, 'el', {
        enumerable: false,
        configurable: true,
        value: function (i) {i = i || 0; return this[i < 0? this.length + i: i];} 
    });

    Object.defineProperty(Array.prototype, 'clear', {
        enumerable: false,
        configurable: true,
        value: function () {this.length = 0;} 
    });
	
	Object.defineProperty(Array.prototype, 'set', {
        enumerable: false,
        configurable: true,
        value: function (iValue,iStart,iCount) 
			{
				var iS=iStart|0;
				var iC=iCount|(this.length-iStart);
				for(var i=iS;i<iS+iC;i++)
				{
					this[i]=iValue;
				}
			} 
    });
	

    Object.defineProperty(Array.prototype, 'swap', {
        enumerable: false,
        configurable: true,
        value: function (i, j) {
            if (i < this.length && j < this.length) {
                var t = this[i]; this[i] = this[j]; this[j] = t;
            }
        }    
    });

    Object.defineProperty(Array.prototype, 'insert', {
        enumerable: false,
        configurable: true,
        value: function (pElement) {
            if (typeof pElement.length === 'number') {
                for (var i = 0, n = pElement.length; i < n; ++ i) {
                    this.push(pElement[i]);
                };
            }
            else {
                this.push(pElement);
            }
        }    
    });


    Define(first, __[0]);

    //Include('libs/xml/xml2json.js');

    //a.xml2json = xml2json;

})();
 
