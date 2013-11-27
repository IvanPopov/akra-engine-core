// AISkin interface
// [write description here...]


/// <reference path="AISkeleton.ts" />
/// <reference path="AINode.ts" />
/// <reference path="AIMesh.ts" />
/// <reference path="AIEngine.ts" />
/// <reference path="AINode.ts" />
/// <reference path="AIMat4.ts" />
/// <reference path="AIVertexData.ts" />

// interface AINodeMap {
// 	[index: string]: AINode;
// }

interface AISkin {
	/** readonly */ data: AIRenderDataCollection;
	/** readonly */ skeleton: AISkeleton;
	/** readonly */ totalBones: uint;

	/**
	 * Set binding matrix. 
	 * @see <bind_shape_matrix> in Collada.
	 */
	setBindMatrix(m4fMatrix: AIMat4): void;

	/**
	 * @see <bind_shape_matrix> in Collada.
	 */
	getBindMatrix(): AIMat4;

	/**
	 * Bone offset matrices.
	 * @see Bone offset matrices in Collada.
	 */
	getBoneOffsetMatrices(): AIMat4[];
	getBoneOffsetMatrix(sBoneName: string): AIMat4;
	setBoneOffsetMatrices(pMatrices: AIMat4[]): void;

	setSkeleton(pSkeleton: AISkeleton): boolean;
	
	/**
	 * Make a skin dependent on scene node whose names match the
	 * names of the bones that affect the skin.
	 */
	attachToScene(pRootNode: AISceneNode): boolean;
	
	// /**
	//  * Bind skin to skeleton or scene.
	//  */
	// bind(pSkeleton: AISkeleton): boolean;
	// bind(pNode: AISceneNode): boolean;

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
	getInfluenceMetaData(): AIVertexData;
	/**
	 * инф. о вляиниях на вершины
	 * пары: {индекс матрицы кости, индекс веса}
	 */
	getInfluences(): AIVertexData;
	setInfluences(pInfluencesCount: uint[], pInfluences: Float32Array): boolean;

	/**
	 * Short way to call setWeights() && setIfluences();
	 */
	setVertexWeights(pInfluencesCount: uint[], pInfluences: Float32Array, pWeights: Float32Array): boolean;
	
	/**
	 * Recalculate skin matrices and fill it to video memory.
	 */
	applyBoneMatrices(bForce?: boolean): boolean;

	/**
	 * Is skin ready to use?
	 */
	isReady(): boolean;

	/**
	 * Data with result matrices.
	 */
	getBoneTransforms(): AIVertexData;

	/**
	 * Check, is this skin affect to data?
	 */
	isAffect(pData: AIVertexData): boolean;

	/**
	 * Add skin info to data with vertices.
	 */
	attach(pData: AIVertexData): void;
}
