///<reference path="../akra.ts" />

module akra.util {
	export class DeviceInfo extends Singleton implements IDeviceInfo {
		private nMaxTextureSize: uint = 0;
		private nMaxCubeMapTextureSize: uint = 0;
		private nMaxViewPortSize: uint = 0;

		private nMaxTextureImageUnits: uint = 0;
		private nMaxVertexAttributes: uint = 0;
		private nMaxVertexTextureImageUnits: uint = 0;
		private nMaxCombinedTextureImageUnits: uint = 0;

		private nMaxColorAttachments: uint = 1;

		private nStencilBits: uint = 0;
		private pColorBits: uint[] = [0, 0, 0];
		private nAlphaBits: uint = 0;
		private fMultisampleType: float = 0.;

		private fShaderVersion: float = 0;

		get maxTextureSize(): uint { return this.nMaxTextureSize; }
		get maxCubeMapTextureSize(): uint { return this.nMaxCubeMapTextureSize; }
		get maxViewPortSize(): uint { return this.nMaxViewPortSize; }
 
 		get maxTextureImageUnits(): uint { return this.nMaxTextureImageUnits; }
		get maxVertexAttributes(): uint { return this.nMaxVertexAttributes; }
		get maxVertexTextureImageUnits(): uint { return this.nMaxVertexTextureImageUnits; }
		get maxCombinedTextureImageUnits(): uint { return this.nMaxCombinedTextureImageUnits; }

		get maxColorAttachments(): uint { return this.nMaxColorAttachments; }		

		get stencilBits(): uint { return this.nStencilBits; }
		get colorBits(): uint[] { return this.pColorBits; }
		get alphaBits(): uint { return this.nAlphaBits; }
		get multisampleType(): float { return this.fMultisampleType; }

		get shaderVersion(): float { return this.fShaderVersion; }

		constructor () {
			super();

			var pDevice = createDevice();

			if (!pDevice) {
				return;
			}

			this.nMaxTextureSize = pDevice.getParameter(pDevice.MAX_TEXTURE_SIZE);
			this.nMaxCubeMapTextureSize = pDevice.getParameter(pDevice.MAX_CUBE_MAP_TEXTURE_SIZE);
			this.nMaxViewPortSize = pDevice.getParameter(pDevice.MAX_VIEWPORT_DIMS);

			this.nMaxTextureImageUnits = pDevice.getParameter(pDevice.MAX_TEXTURE_IMAGE_UNITS);
			this.nMaxVertexAttributes = pDevice.getParameter(pDevice.MAX_VERTEX_ATTRIBS);
			this.nMaxVertexTextureImageUnits = pDevice.getParameter(pDevice.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
			this.nMaxCombinedTextureImageUnits = pDevice.getParameter(pDevice.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

			this.nStencilBits = pDevice.getParameter(pDevice.STENCIL_BITS);
			this.pColorBits = [
                pDevice.getParameter(pDevice.RED_BITS),
                pDevice.getParameter(pDevice.GREEN_BITS),
                pDevice.getParameter(pDevice.BLUE_BITS)
            ];

            this.nAlphaBits = pDevice.getParameter(pDevice.ALPHA_BITS);
            this.fMultisampleType = pDevice.getParameter(pDevice.SAMPLE_COVERAGE_VALUE);
		}
	

		getExtention(pDevice: WebGLRenderingContext, csExtension: string): any {
			var pExtentions: string[];
			var sExtention: string;
			var pExtention: any = null;

	        pExtentions = pDevice.getSupportedExtensions();

	        for (var i in pExtentions) {
	            sExtention = pExtentions[i];
	            if (sExtention.search(csExtension) != -1) {
	                pExtention = pDevice.getExtension(sExtention);
	                
	                trace('extension successfuly loaded: ' + sExtention);
	            }
	        }

	        return pExtention;
		}

		checkFormat(pDevice: WebGLRenderingContext, eFormat: EImageFormats) {
	        switch (eFormat) {
	            case EImageFormats.RGB_DXT1:
	            case EImageFormats.RGBA_DXT1:
	            case EImageFormats.RGBA_DXT2:
	            case EImageFormats.RGBA_DXT3:
	            case EImageFormats.RGBA_DXT4:
	            case EImageFormats.RGBA_DXT5:
	                for (var i in pDevice) {
	                    if (isNumber(pDevice[i]) && pDevice[i] == eFormat) {
	                        return true;
	                    }
	                }
	                return false;
	            case EImageFormats.RGB8:
	            case EImageFormats.RGBA8:
	            case EImageFormats.RGBA4:
	            case EImageFormats.RGB5_A1:
	            case EImageFormats.RGB565:
	                return true;
	            default:
	                return false;
	        }
	    }
    }
}