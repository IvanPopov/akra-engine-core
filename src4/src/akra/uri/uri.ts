/// <reference path="../idl/IURI.ts" />
/// <reference path="../idl/IDataURI.ts" />
/// <reference path="../logger.ts" />
/// <reference path="../path/path.ts" />

module akra.uri {

    class URI implements IURI {
        private sScheme: string = null;
        private sUserinfo: string = null;
        private sHost: string = null;
        private nPort: uint = 0;
        private sPath: string = null;
        private sQuery: string = null;
        private sFragment: string = null;

        get urn(): string {
            return (this.sPath ? this.sPath : "") +
                (this.sQuery ? '?' + this.sQuery : "") +
                (this.sFragment ? '#' + this.sFragment : "");
        }

        get url(): string {
            return (this.sScheme ? this.sScheme : "") + this.authority;
        }

        get authority(): string {
            return (this.sHost ? '//' + (this.sUserinfo ? this.sUserinfo + '@' : "") +
                this.sHost + (this.nPort ? ':' + this.nPort : "") : "");
        }

        get scheme(): string {
            return this.sScheme;
        }

        get protocol(): string {
            if (!this.sScheme) {
                return this.sScheme;
            }

            return (this.sScheme.substr(0, this.sScheme.lastIndexOf(':')));
        }

        get userinfo(): string {
            return this.sUserinfo;
        }

        get host(): string {
            return this.sHost;
        }

        set host(sHost: string) {
            //TODO: check host format
            this.sHost = sHost;
        }

        get port(): uint {
            return this.nPort;
        }

        set port(iPort: uint) {
            this.nPort = iPort;
        }

        get path(): string {
            return this.sPath;
        }

        set path(sPath: string) {
            // debug_assert(!isNull(sPath.match(new RegExp("^(/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)$"))), 
            // 	"invalid path used: " + sPath);
            //TODO: check path format
            this.sPath = sPath;
        }

        get query(): string {
            //TODO: check query format
            return this.sQuery;
        }

        set query(sQuery: string) {
            this.sQuery = sQuery;
        }

        get fragment(): string {
            return this.sFragment;
        }


        constructor(pUri: URI);
        constructor(sUri: string);
        constructor(pUri?) {
            if (pUri) {
                this.set(pUri);
            }
        }

        set(pUri: URI);
        set(sUri: string);
        set(pData?): URI {
            if (isString(pData)) {
                var pUri: RegExpExecArray = URI.uriExp.exec(<string>pData);

                logger.assert(pUri !== null, 'Invalid URI format used.\nused uri: ' + pData);

                if (!pUri) {
                    return null;
                }

                this.sScheme = pUri[1] || null;
                this.sUserinfo = pUri[2] || null;
                this.sHost = pUri[3] || null;
                this.nPort = parseInt(pUri[4]) || null;
                this.sPath = pUri[5] || pUri[6] || null;
                this.sQuery = pUri[7] || null;
                this.sFragment = pUri[8] || null;

                return this;

            }
            else if (pData instanceof URI) {
                return this.set(pData.toString());
            }

            logger.error('Unexpected data type was used.');

            return null;
        }

        toString(): string {
            return this.url + this.urn;
        }

        static here(): IURI {
            return new URI(document.location.href);
        }

        //------------------------------------------------------------------//
        //----- Validate a URI -----//
        //------------------------------------------------------------------//
        //- The different parts are kept in their own groups and can be recombined
        //  depending on the scheme:
        //  - http as $1://$3:$4$5?$7#$8
        //  - ftp as $1://$2@$3:$4$5
        //  - mailto as $1:$6?$7
        //- groups are as follows:
        //  1   == scheme
        //  2   == userinfo
        //  3   == host
        //  4   == port
        //  5,6 == path (5 if it has an authority, 6 if it doesn't)
        //  7   == query
        //  8   == fragment


        private static uriExp: RegExp = new RegExp("^([a-z0-9+.-]+:)?(?:\\/\\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\\d*))?(\\/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?|(\\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?)(?:\\?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*))?$", "i");

        /*
         composed as follows:
         ^
         ([a-z0-9+.-]+):							#scheme
         (?:
         //							#it has an authority:
         (?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?	#userinfo
         ((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)		#host
         (?::(\d*))?						#port
         (/(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
         |
         #it doesn't have an authority:
         (/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?	#path
         )
         (?:
         \?((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#query string
         )?
         (?:
         #((?:[a-z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)	#fragment
         )?
         $
         */
    }


    function normalizeURIPath(pFile: IURI): IURI {
        if (!isNull(pFile.path)) {
            if (pFile.scheme === "filesystem:") {
                var pUri: IURI = parse(pFile.path);

                pUri.path = path.normalize(pUri.path);
                pFile.path = pUri.toString();
            }
            else {
                pFile.path = path.normalize(pFile.path);
            }
        }

        return pFile;
    }



    export function resolve(sFrom: string, sTo: string = document.location.href): string {
        var pCurrentPath: IURI = parse(sTo);
        var pFile: IURI = parse(sFrom);
        var sDirname: string;

        normalizeURIPath(pFile);
        normalizeURIPath(pCurrentPath);

        if (!isNull(pFile.scheme) || !isNull(pFile.host) || path.parse(pFile.path).isAbsolute()) {
            //another server or absolute path
            return sFrom;
        }

        sDirname = path.parse(pCurrentPath.path).dirname;
        pCurrentPath.path = sDirname ? sDirname + "/" + sFrom : sFrom;

        return normalizeURIPath(pCurrentPath).toString();
    }

    export function parseDataURI(sUri: string): IDataURI {
        var re: RegExp = /^data:([\w\d\-\/]+)?(;charset=[\w\d\-]*)?(;base64)?,(.*)$/;
        var m: string[] = sUri.match(re);

        return {
            //like [text/plain]
            mediatype: m[1] || null,
            //like [;charset=windows-1251]
            charset: isString(m[2]) ? m[2].substr(9) : null,
            //like [;base64]
            base64: isDef(m[3]),
            data: m[4] || null
        };
    }


    export function parse(sUri: string): IURI {
        return new URI(sUri);
    }

}