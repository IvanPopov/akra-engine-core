#ifndef ISKIN_TS
#define ISKIN_TS

module akra {
	IFACE(INode);
	IFACE(IMesh);

	export interface INodeMap{
		[index: string]: INode;
	}

	export interface ISkeleton {
		readonly buffer: int;
		readonly data: int;
		readonly skeleton: ISkeleton;
		readonly totalBones: int;

		setBindMatrix(m4fMatrix): IEngine;
		getBindMatrix(): INode;
		getBoneOffsetMatrices(): INode[];
		getBoneOffsetMatrix(): INodeMap;
		hasSkeleton(): bool;
		getSkeleton(): bool;
		setSkeleton(pSkeleton: ISkeleton): bool;
		attachToSceneTree(pRootNode): bool;
		bind(sName: string): bool;
		setBoneNames(pMesh: IMesh): bool;
		setBoneOffsetMatrices(pMatrices): void;
		setWeights(pWeights): bool;
		getWeights();
		getInfluenceMetaData();
		getInfluences();
		setIfluences(pInfluencesCount, pInfluences);
		setVertexWeights(pInfluencesCount, pInfluences, pWeights);
		apply(bForce: bool): bool;
		isReady(): bool;
		getBoneTransforms();
		isAffect(pData): bool;
		attach(pData)

	}
}

#endif