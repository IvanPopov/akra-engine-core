#ifndef IVIDEODRIVER_TS
#ifndef IVIDEODRIVER_TS

module akra {
	export interface IVideoDriver {
		createTexture(): IHardwareTexture;
		createVertexBuffer(): IHardwareBuffer;
		createIndexBuffer(): IHardwareBuffer;
		createShaderProgram(): IHardwareShaderProgram;
		createShader(): IHardwareShader;

		
	}
}

#endif 
