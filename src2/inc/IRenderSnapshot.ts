#ifndef IRENDERSNAPSHOT_TS
#define IRENDERSNAPSHOT_TS

module akra {
	export interface IRenderEntry {
		totalPasses: uint;
		pass: uint;

		effect: IRenderMethod;
		renderMethod: IRenderMethod;
		surfaceMaterial: ISurfaceMaterial;
		material: IMaterial;

		activatePass(iPass: uint): bool;
		deactivatePass(): bool;
		renderPass(iPass: uint): bool;

		begin(): bool;
		end(): bool;
		updated(bValue: bool): void;

		isMethodLoaded(): bool;
		isReady(): bool;
		isUpdated(): bool;

		setParameter(sName: string, pData: any, isSemantic?: string): bool;
		setParameterBySemantics(sName: string, pData: any): bool;
		setComplexParameter(sName: string, pData: any, isSemantic?: bool): bool;
		setComplexParameterBySemantics(sName: string, pData: any): bool;
		setParameterInArray(sName: string, pData: any, iElement: uint): bool;
		setPassStates(pPasses: IAFXPass[], pTextures: ITexture[], pForeigns: IAFXForeign[]): void;

		setVertexBuffer(sName: string, pVertexBuffer: IVertexBuffer, isSemantic?: bool): bool;
		setVideoBufferBySemantics(sName: string, pVertexBuffer: IVertexBuffer): bool;

		setSamplerStates(sName: string, eParam: ETextureParameters, eValue: any, isSemantic?: bool): bool;
		setSamplerStatesBySemantics(sName: string, pState: IAFXSamplerState): bool;
		setSamplerStates(sName: string, pState: IAFXSamplerState, isSemantic?: bool): bool;
		setSamplerStatesBySemantics(sName: string, eParam: ETextureParameters, eValue: any): bool;

		setTexture(sName: string, pTexture: ITexture, isSemantic?: bool): bool
		setTextureBySemantics(sName: string, pTexture: ITexture, isSemantic?: bool): bool

		setForeignVariable(sName: string, pData: ant): void;
		
		applyVertexData(pData: IVertexData): void;
		applyBufferMap(pBufferMap: IBufferMap): void;
		applyRenderData(pData: IRenderData): void;

	}
}

#endif
