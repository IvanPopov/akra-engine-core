// AIRenderer interface
// [write description here...]
//API SPECIFIFC CONSTANTS
var AERenderCapabilitiesCategory;
(function (AERenderCapabilitiesCategory) {
    AERenderCapabilitiesCategory[AERenderCapabilitiesCategory["C_COMMON"] = 0] = "C_COMMON";
    AERenderCapabilitiesCategory[AERenderCapabilitiesCategory["C_COMMON_2"] = 1] = "C_COMMON_2";
    AERenderCapabilitiesCategory[AERenderCapabilitiesCategory["C_WEBGL"] = 2] = "C_WEBGL";

    AERenderCapabilitiesCategory[AERenderCapabilitiesCategory["COUNT"] = 3] = "COUNT";
})(AERenderCapabilitiesCategory || (AERenderCapabilitiesCategory = {}));

var AERenderCapabilities;
(function (AERenderCapabilities) {
})(AERenderCapabilities || (AERenderCapabilities = {}));

// enum AEGLSpecifics {
//	 UNPACK_ALIGNMENT = 0x0CF5,
//	 PACK_ALIGNMENT = 0x0D05,
//	 UNPACK_FLIP_Y_WEBGL = 0x9240,
//	 UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
//	 CONTEXT_LOST_WEBGL = 0x9242,
//	 UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
//	 BROWSER_DEFAULT_WEBGL = 0x9244
// };
// enum AEBufferMasks {
//	 DEPTH_BUFFER_BIT			   = 0x00000100,
//	 STENCIL_BUFFER_BIT			 = 0x00000400,
//	 COLOR_BUFFER_BIT			   = 0x00004000
// };
// enum AEBufferUsages {
//	 STREAM_DRAW = 0x88E0,
//	 STATIC_DRAW = 0x88E4,
//	 DYNAMIC_DRAW = 0x88E8
// };
// enum AEBufferTypes {
//	 ARRAY_BUFFER = 0x8892,
//	 ELEMENT_ARRAY_BUFFER = 0x8893,
//	 FRAME_BUFFER = 0x8D40,
//	 RENDER_BUFFER = 0x8D41
// };
var AEAttachmentTypes;
(function (AEAttachmentTypes) {
    AEAttachmentTypes[AEAttachmentTypes["COLOR_ATTACHMENT0"] = 0x8CE0] = "COLOR_ATTACHMENT0";
    AEAttachmentTypes[AEAttachmentTypes["DEPTH_ATTACHMENT"] = 0x8D00] = "DEPTH_ATTACHMENT";
    AEAttachmentTypes[AEAttachmentTypes["STENCIL_ATTACHMENT"] = 0x8D20] = "STENCIL_ATTACHMENT";
    AEAttachmentTypes[AEAttachmentTypes["DEPTH_STENCIL_ATTACHMENT"] = 0x821A] = "DEPTH_STENCIL_ATTACHMENT";
})(AEAttachmentTypes || (AEAttachmentTypes = {}));
;
//# sourceMappingURL=AIRenderer.js.map
