#ifndef IAFXPASSINPUTBLEND_TS
#define IAFXPASSINPUTBLEND_TS

module akra {
	export interface IAFXPassInputBlend {
		uniforms: any;
		foreigns: any;
		textures: any;

		uniformKeys: string[];
		foreignKeys: string[];
		textureKeys: string[];

		uniformsDefault: any;

		setUniform(sName: string, pValue: any): void;
		setForeign(sName: string, pValue: any): void;
		setTexture(sName: string, pValue: any): void;

		setSamplerTexture(sName: string, pTexture: any): void;

		_init(): void;
		_release(): void;

		_isNeedToCalcBlend(): bool;
		_isNeedToCalcShader(): bool;

		_getLastPassBlendId(): uint;
		_getLastShaderId(): uint;

		_setPassBlendId(id: uint): void;
		_setShaderId(id: uint): void;
	}
}

#endif