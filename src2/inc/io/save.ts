#ifndef IOSAVE_TS
#define IOSAVE_TS

#include "FileSaver.d.ts"

#ifdef DEBUG

/// @FILESAVER: {data}/3d-party/FileSaver/FileSaver.min.js|location()|script()|data_location({data},DATA)

#else

///added unquoated script
/// @FILESAVER: |content({data}/3d-party/FileSaver/FileSaver.min.js)|minify()

"@FILESAVER"

#endif

#endif

