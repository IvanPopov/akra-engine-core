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
    }


    Include('libs/xml/xml2json.js');

    a.xml2json = xml2json;

})();
 
