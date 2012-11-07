#ifndef IPARSER_TS
#define IPARSER_TS

module akra.util {
	export enum ELogLevel {
        RELEASE = 0x0000,
        INFORMATION = 0x0001,
        ERROR = 0x0002,
        WARNING = 0x0004,
        LOG = 0x0008,

        DEBUG = 0x0020,
        DEBUG_INFORMATION = 0x0040,
        DEBUG_ERROR = 0x0080,
        DEBUG_WARNING = 0x0100,
        DEBUG_LOG = 0x0200
    }
}

#endif