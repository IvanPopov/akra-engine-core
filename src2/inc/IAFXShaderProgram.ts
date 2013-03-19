#ifndef IAFXSHADERPROGRAM_TS
#define IAFXSHADERPROGRAM_TS

module akra {
	export interface IAFXShaderProgramMap {
		[index: string]: IAFXShaderProgram;
		[index: int]: IAFXShaderProgram;
	}

	export interface IAFXShaderProgram {
		
	}
}

#endif