#ifndef ISKIN_TS
#define ISKIN_TS

module akra {
	IFACE(ISkeleton);
	IFACE(INode);
	IFACE(IMesh);
	IFACE(IEngine);
	IFACE(INodeMap);
	IFACE(IMat4);
	IFACE(IVertexData);

	// export interface INodeMap {
	// 	[index: string]: INode;
	// }

	export interface ISkin {
		readonly data: IRenderDataCollection;
		readonly skeleton: ISkeleton;
		readonly totalBones: uint;

		/**
		 * Set binding matrix. 
		 * @see <bind_shape_matrix> in Collada.
		 */
		setBindMatrix(m4fMatrix: IMat4): void;

		/**
		 * @see <bind_shape_matrix> in Collada.
		 */
		getBindMatrix(): IMat4;

		/**
		 * Bone offset matrices.
		 * @see Bone offset matrices in Collada.
		 */
		getBoneOffsetMatrices(): IMat4[];
		getBoneOffsetMatrix(sBoneName: string): IMat4;
		setBoneOffsetMatrices(pMatrices: IMat4[]): void;

		setSkeleton(pSkeleton: ISkeleton): bool;
		
		/**
		 * Make a skin dependent on scene node whose names match the
		 * names of the bones that affect the skin.
		 */
		attachToScene(pRootNode: ISceneNode): bool;
		
		// /**
		//  * Bind skin to skeleton or scene.
		//  */
		// bind(pSkeleton: ISkeleton): bool;
		// bind(pNode: ISceneNode): bool;

		/**
		 * Set names of bones, that affect to skin.
		 */
		setBoneNames(pNames: string[]): bool;


		/**
		 * Weights.
		 */
		setWeights(pWeights: Float32Array): bool;

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
		setInfluences(pInfluencesCount: uint[], pInfluences: Float32Array): bool;

		/**
		 * Short way to call setWeights() && setIfluences();
		 */
		setVertexWeights(pInfluencesCount: uint[], pInfluences: Float32Array, pWeights: Float32Array): bool;
		
		/**
		 * Recalculate skin matrices and fill it to video memory.
		 */
		applyBoneMatrices(bForce?: bool): bool;

		/**
		 * Is skin ready to use?
		 */
		isReady(): bool;

		/**
		 * Data with result matrices.
		 */
		getBoneTransforms(): IVertexData;

		/**
		 * Check, is this skin affect to data?
		 */
		isAffect(pData: IVertexData): bool;

		/**
		 * Add skin info to data with vertices.
		 */
		attach(pData: IVertexData): void;
	}
}

#endif