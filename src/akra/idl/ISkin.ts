/// <reference path="ISkeleton.ts" />
/// <reference path="INode.ts" />
/// <reference path="IMesh.ts" />
/// <reference path="IEngine.ts" />
/// <reference path="INode.ts" />
/// <reference path="IMat4.ts" />
/// <reference path="IVertexData.ts" />

module akra {
	
	export interface ISkin extends IEventProvider {
		/**
		 * Event is sent when the skin transformed.
		 */
		transformed: ISignal<{ (pSkin: ISkin): void; }>;

		getData(): IRenderDataCollection;
		getSkeleton(): ISkeleton;
		getTotalBones(): uint;

		/**
		 * @copydoc Skin::getAffectedNode()
		 */
		getAffectedNode(iNode: uint): ISceneNode;
		/**
		 * Set binding matrix. 
		 * @see <bind_shape_matrix> in Collada.
		 */
		setBindMatrix(m4fMatrix: IMat4): void;
	
		/**
		 * @see <bind_shape_matrix> in Collada.
		 */
		getBindMatrix(): IMat4;
	
		getBoneName(iBone: uint): string;
		getBoneIndex(sBone: string): uint;

		/**
		 * Bone offset matrices.
		 * @see Bone offset matrices in Collada.
		 */
		getBoneOffsetMatrix(iBone: uint): IMat4;
		getBoneOffsetMatrix(sBoneName: string): IMat4;
		setBoneOffsetMatrices(pMatrices: IMat4[]): void;
	
		/** Set skeleton. */
		setSkeleton(pSkeleton: ISkeleton): boolean;
		
		/**
		 * Make a skin dependent on scene node whose names match the
		 * names of the bones that affect the skin.
		 */
		attachToScene(pRootNode: ISceneNode): boolean;
		
		/**
		 * Set names of bones, that affect to skin.
		 */
		setBoneNames(pNames: string[]): boolean;
	
		

		/**
		 * Weights.
		 */
		setWeights(pWeights: Float32Array): boolean;
	
		/**
		 * разметка влияний на вершины
		 * пары: {число влияний, адресс индексов влияний}
		 */
		getInfluenceMetaData(): IVertexData;
		/**
		 * инф. о вляиниях на вершины
		 * пары: {индекс матрицы кости, индекс веса}
		 */
		getInfluences(): IVertexData;
		setInfluences(pInfluencesCount: uint[], pInfluences: Float32Array): boolean;
	
		/**
		 * Short way to call setWeights() && setIfluences();
		 */
		setVertexWeights(pInfluencesCount: uint[], pInfluences: Float32Array, pWeights: Float32Array): boolean;
		
		/**
		 * Recalculate skin matrices and fill it to video memory.
		 * @return Status showing if changed bone matrix with the last update.
		 */
		applyBoneMatrices(bForce?: boolean): boolean;
	
		/**
		 * Is skin ready to use?
		 */
		isReady(): boolean;
	
		/**
		 * Data with result matrices.
		 */
		getBoneTransforms(): IVertexData;
	
		/**
		 * Check, is this skin affect to data?
		 */
		isAffect(pData: IVertexData): boolean;
	
		/**
		 * Add skin info to data with vertices.
		 */
		_attach(pData: IVertexData): void;
	}
	
}
