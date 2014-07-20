declare module Ammo {
	export class btDefaultCollisionConfiguration {
		//
	}

	export class btCollisionDispatcher {
		//
	}

	export class btDbvtBroadphase {
		//
	}

	export class btSequentialImpulseConstraintSolver {
		//
	}

	export class btDiscreteDynamicsWorld {
		setGravity(value: btVector3): any;
		addRigidBody(value: btRigidBody): any;
		stepSimulation(value: float): any;
	}

	export class btVector3 {
		//
	}
	
	export class btBoxShape {
		calculateLocalInertia(mass: float, inertia: btVector3): any;
	}

	export class btConvexHullShape {
		addPoint(btVector3): any;
	}

	export class btCompoundShape {
		addChildShape(pos: btTransform, shape: any);
	}

	export class btTransform {
		setIdentity(): void;
		setOrigin(value: btVector3): any;
		getOrigin(): any;
		getRotation(): any;
	}
	
	export class btDefaultMotionState {
		//
	}
	
	export class btRigidBodyConstructionInfo {
		//
	}

	export class btRigidBody {
		mesh: any;
		getMotionState(): any;
	}
}

