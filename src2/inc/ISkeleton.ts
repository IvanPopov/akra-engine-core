#ifndef ISKELETON_TS
#define ISKELETON_TS

module akra {
	IFACE(INode);
	export interface ISkeleton {
		findJoint(sJoint: string): INode;
	}
}

#endif