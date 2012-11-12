#ifndef SKELETON_TS
#define SKELETON_TS

#include "ISkeleton.ts"
#include "INode.ts"

module akra.model {
	export class Skeleton implements ISkeleton{
		findJoint(sJoint: string): INode {
			return null;
		}
	}
}

#endif