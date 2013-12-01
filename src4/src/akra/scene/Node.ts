/// <reference path="../idl/INode.ts" />
/// <reference path="../util/Entity.ts" />
/// <reference path="../math/math.ts" />
/// <reference path="../bf/bf.ts" />

module akra.scene {

	export enum ENodeUpdateFlags {
		k_SetForDestruction = 0,
		//if changed scale, otation or position
		k_NewOrientation,
		// k_NewTranslation,
		// k_NewScale,
		k_NewWorldMatrix,
		k_NewLocalMatrix,
		k_RebuildInverseWorldMatrix,
		k_RebuildNormalMatrix,
	}

	import __11 = math.__11;
	import __12 = math.__12;
	import __13 = math.__13;
	import __14 = math.__14;

	import __21 = math.__21;
	import __22 = math.__22;
	import __23 = math.__23;
	import __24 = math.__24;

	import __31 = math.__31;
	import __32 = math.__32;
	import __33 = math.__33;
	import __34 = math.__34;

	import __41 = math.__41;
	import __42 = math.__42;
	import __43 = math.__43;
	import __44 = math.__44;

	import Mat4 = math.Mat4;
	import Vec3 = math.Vec3;
	import Quat4 = math.Quat4;
	import Mat3 = math.Mat3;
	import Vec4 = math.Vec4;

	export class Node<T extends Node<T>> extends util.Entity<T> implements INode<T> {
		protected _m4fLocalMatrix: IMat4 = null;
		protected _m4fWorldMatrix: IMat4 = null;
		protected _m4fInverseWorldMatrix: IMat4 = null;
		protected _m3fNormalMatrix: IMat3 = null;

		protected _v3fWorldPosition: IVec3 = null;

		protected _qRotation: IQuat4 = null;
		protected _v3fTranslation: IVec3 = null;
		protected _v3fScale: IVec3 = null;

		protected _iUpdateFlags: int = 0;
		protected _eInheritance: ENodeInheritance = ENodeInheritance.POSITION;

		create(): boolean {
			return true;
		}

		get localOrientation(): IQuat4 {
			return this._qRotation;
		}

		set localOrientation(qOrient: IQuat4) {
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
			this._qRotation.set(qOrient);
		}

		get localPosition(): IVec3 {
			return this._v3fTranslation;
		}

		set localPosition(v3fPosition: IVec3) {
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
			this._v3fTranslation.set(v3fPosition);
		}

		get localScale(): IVec3 {
			return this._v3fScale;
		}

		set localScale(v3fScale: IVec3) {
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
			this._v3fScale.set(v3fScale);
		}

		get localMatrix(): IMat4 {
			return this._m4fLocalMatrix;
		}

		set localMatrix(m4fLocalMatrix: IMat4) {
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix);
			this._m4fLocalMatrix.set(m4fLocalMatrix);
		}


		get worldMatrix(): IMat4 {
			return this._m4fWorldMatrix;
		}

		get worldPosition(): IVec3 {
			return this._v3fWorldPosition;
		}

		get worldOrientation(): IQuat4 {
			//TODO: calc right world orient.
			return null;
		}

		get worldScale(): IVec3 {
			//TODO: calc right world scale.
			return this.localScale;
		}

		//  get worldRotation(): IQuat4 {
		// 	logger.assert((<Node>this._pParent).worldMatrix.toMat3(Node._m3fTemp1).decompose(Node._q4fTemp1, Node._v3fTemp1), 
		//             		"could not decompose.");
		// 	//FIXME: use correct way to get world rotation
		// 	return Node._q4fTemp1;
		// }

		get inverseWorldMatrix(): IMat4 {
			if (bf.testBit(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildInverseWorldMatrix)) {
				this._m4fWorldMatrix.inverse(this._m4fInverseWorldMatrix);
				bf.clearBit(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildInverseWorldMatrix);
			}

			return this._m4fInverseWorldMatrix;
		}

		get normalMatrix(): IMat3 {
			if (bf.testBit(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildNormalMatrix)) {

				this._m4fWorldMatrix.toMat3(this._m3fNormalMatrix).inverse().transpose();

				bf.clearBit(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildNormalMatrix);
			}

			return this._m3fNormalMatrix;
		}


		update(): boolean {
			// derived classes update the local matrix
			// then call this base function to complete
			// the update
			return this.recalcWorldMatrix();
		}


		prepareForUpdate(): void {
			super.prepareForUpdate();
			// clear the temporary flags
			bf.clearAll(this._iUpdateFlags, bf.flag(ENodeUpdateFlags.k_NewLocalMatrix) |
				bf.flag(ENodeUpdateFlags.k_NewOrientation) | bf.flag(ENodeUpdateFlags.k_NewWorldMatrix));
		}


		setInheritance(eInheritance: ENodeInheritance) {
			this._eInheritance = eInheritance;
		}

		getInheritance(): ENodeInheritance {
			return this._eInheritance;
		}

		isWorldMatrixNew(): boolean {
			return bf.testBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewWorldMatrix);
		}

		isLocalMatrixNew(): boolean {
			return bf.testBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix);
		}

		private recalcWorldMatrix(): boolean {
			var isParentMoved: boolean = this._pParent && (<Node>this._pParent).isWorldMatrixNew();
			var isOrientModified: boolean = bf.testBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
			var isLocalModified: boolean = bf.testBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix);

			if (isOrientModified || isParentMoved || isLocalModified) {
				var m4fLocal: IMat4 = this._m4fLocalMatrix;
				var m4fWorld: IMat4 = this._m4fWorldMatrix;

				var m4fOrient: IMat4 = Node._m4fTemp1;
				var v3fTemp: IVec3 = Node._v3fTemp1;

				var pWorldData: Float32Array = m4fWorld.data;
				var pOrientData: Float32Array = m4fOrient.data;

				this._qRotation.toMat4(m4fOrient);

				m4fOrient.setTranslation(this._v3fTranslation);
				m4fOrient.scaleRight(this._v3fScale);
				m4fOrient.multiply(m4fLocal);

				//console.error(m4fOrient.toString());

				if (this._pParent && this._eInheritance !== ENodeInheritance.NONE) {
					var m4fParent: IMat4 = (<Node>this._pParent).worldMatrix;
					var pParentData: Float32Array = m4fParent.data;

					if (this._eInheritance === ENodeInheritance.ALL) {
						m4fParent.multiply(m4fOrient, m4fWorld);
					}
					else if (this._eInheritance === ENodeInheritance.POSITION) {
						m4fWorld.set(m4fOrient);

						pWorldData[__14] = pParentData[__14] + pOrientData[__14];
						pWorldData[__24] = pParentData[__24] + pOrientData[__24];
						pWorldData[__34] = pParentData[__34] + pOrientData[__34];
					}
					else if (this._eInheritance === ENodeInheritance.ROTPOSITION) {
						//FIXME: add faster way to compute this inheritance...
						logger.assert(m4fParent.toMat3(Node._m3fTemp1).decompose(Node._q4fTemp1, Node._v3fTemp1),
							"could not decompose.");

						var m4fParentNoScale: IMat4 = Node._q4fTemp1.toMat4(Node._m4fTemp2);

						m4fParentNoScale.data[__14] = pParentData[__14];
						m4fParentNoScale.data[__24] = pParentData[__24];
						m4fParentNoScale.data[__34] = pParentData[__34];

						m4fParentNoScale.multiply(m4fOrient, m4fWorld);
					}
					else if (this._eInheritance === ENodeInheritance.ROTSCALE) {
						//3x3 parent world matrix
						var p11 = pParentData[__11], p12 = pParentData[__12],
							p13 = pParentData[__13];
						var p21 = pParentData[__21], p22 = pParentData[__22],
							p23 = pParentData[__23];
						var p31 = pParentData[__31], p32 = pParentData[__32],
							p33 = pParentData[__33];

						//3x3 local matrix
						var l11 = pOrientData[__11], l12 = pOrientData[__12],
							l13 = pOrientData[__13];
						var l21 = pOrientData[__21], l22 = pOrientData[__22],
							l23 = pOrientData[__23];
						var l31 = pOrientData[__31], l32 = pOrientData[__32],
							l33 = pOrientData[__33];

						//parent x local with local world pos.
						pWorldData[__11] = p11 * l11 + p12 * l21 + p13 * l31;
						pWorldData[__12] = p11 * l12 + p12 * l22 + p13 * l32;
						pWorldData[__13] = p11 * l13 + p12 * l23 + p13 * l33;
						pWorldData[__14] = pOrientData[__14];
						pWorldData[__21] = p21 * l11 + p22 * l21 + p23 * l31;
						pWorldData[__22] = p21 * l12 + p22 * l22 + p23 * l32;
						pWorldData[__23] = p21 * l13 + p22 * l23 + p23 * l33;
						pWorldData[__24] = pOrientData[__24];
						pWorldData[__31] = p31 * l11 + p32 * l21 + p33 * l31;
						pWorldData[__32] = p31 * l12 + p32 * l22 + p33 * l32;
						pWorldData[__33] = p31 * l13 + p32 * l23 + p33 * l33;
						pWorldData[__34] = pOrientData[__34];

						pWorldData[__41] = pOrientData[__41];
						pWorldData[__42] = pOrientData[__42];
						pWorldData[__43] = pOrientData[__43];
						pWorldData[__44] = pOrientData[__44];
					}
				}
				else {
					m4fWorld.set(m4fOrient);
				}

				this._v3fWorldPosition.x = pWorldData[__14];
				this._v3fWorldPosition.y = pWorldData[__24];
				this._v3fWorldPosition.z = pWorldData[__34];

				// set the flag that our world matrix has changed
				bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewWorldMatrix);
				// and it's inverse & vectors are out of date
				bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildInverseWorldMatrix);
				bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildNormalMatrix);

				return true;
			}

			return false;
		}


		setWorldPosition(v3fPosition: IVec3): void;
		setWorldPosition(fX: float, fY: float, fZ: float): void;
		setWorldPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);

			//target world matrix
			var Au: IMat4 = Mat4.temp(1.);
			Au.setTranslation(pPos);

			//original translation matrices of this node
			var A0: IMat4 = Mat4.temp(1.);
			A0.setTranslation(this.worldPosition);

			//inversed A0
			var A0inv: IMat4 = A0.inverse(Mat4.temp());
			//transformation matrix A0 to Au
			var C: IMat4 = Au.multiply(A0inv, Mat4.temp());

			//parent world matrix
			var Mp: IMat4 = isNull(this.parent) ? Mat4.temp(1.) : Mat4.temp(this.parent.worldMatrix);
			//this orientation matrix (orientation + sclae + translation)
			var Mo: IMat4 = Mat4.temp();

			//assemble local orientaion matrix
			this.localOrientation.toMat4(Mo);
			Mo.setTranslation(this.localPosition);
			Mo.scaleRight(this.localScale);

			//this local matrix
			var Ml: IMat4 = Mat4.temp(this.localMatrix);

			//inversed parent world matrix
			var Mpinv: IMat4 = Mp.inverse(Mat4.temp());
			//inversed this orientation matrix
			var Moinv: IMat4 = Mo.inverse(Mat4.temp());

			//transformation matrix Ml to Mlc
			var Cc: IMat4 = Moinv.multiply(Mpinv, Mat4.temp()).multiply(C).multiply(Mp).multiply(Mo);
			//modified local matrix, that translate node to pPos world position
			var Mlc: IMat4 = Cc.multiply(Ml, Mat4.temp());

			this._m4fLocalMatrix.setTranslation(Mlc.getTranslation());

			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix);
		}


		setPosition(v3fPosition: IVec3): void;
		setPosition(fX: float, fY: float, fZ: float): void;
		setPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
			var v3fTranslation: IVec3 = this._v3fTranslation;

			v3fTranslation.set(pPos);

			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRelPosition(v3fPosition: IVec3): void;
		setRelPosition(fX: float, fY: float, fZ: float): void;
		setRelPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
			var v3fTranslation: IVec3 = this._v3fTranslation;

			this._qRotation.multiplyVec3(pPos);
			v3fTranslation.set(pPos);

			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addPosition(v3fPosition: IVec3): void;
		addPosition(fX: float, fY: float, fZ: float): void;
		addPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
			var v3fTranslation: IVec3 = this._v3fTranslation;

			v3fTranslation.add(pPos);

			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addRelPosition(v3fPosition: IVec3): void;
		addRelPosition(fX: float, fY: float, fZ: float): void;
		addRelPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1 ? arguments[0] : Vec3.temp(fX, fY, fZ);
			var v3fTranslation: IVec3 = this._v3fTranslation;

			this._qRotation.multiplyVec3(pPos);
			v3fTranslation.add(pPos);

			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByMatrix(m3fRotation: IMat3): void;
		setRotationByMatrix(m4fRotation: IMat4): void;
		setRotationByMatrix(matrix: any): void {
			matrix.toQuat4(this._qRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			Quat4.fromAxisAngle(v3fAxis, fAngle, this._qRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			Quat4.fromForwardUp(v3fForward, v3fUp, this._qRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, this._qRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			Quat4.fromYawPitchRoll(fY, fX, fZ, this._qRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotation(q4fRotation: IQuat4): void {
			this._qRotation.set(q4fRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addRelRotationByMatrix(m3fRotation: IMat3): void;
		addRelRotationByMatrix(m4fRotation: IMat4): void;
		addRelRotationByMatrix(matrix: any): void {
			this.addRelRotation(arguments[0].toQuat4(Node._q4fTemp1));
		}

		addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			this.addRelRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp1));
		}

		addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			this.addRelRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp1));
		}

		addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			this.addRelRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp1));
		}

		addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			this.addRelRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp1));
		}

		addRelRotation(q4fRotation: IQuat4): void {
			this._qRotation.multiply(q4fRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addRotationByMatrix(m3fRotation: IMat3): void;
		addRotationByMatrix(m4fRotation: IMat4): void;
		addRotationByMatrix(matrix: any): void {
			this.addRotation(arguments[0].toQuat4(Node._q4fTemp1));
		}

		addRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			this.addRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp1));
		}

		addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			this.addRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp1));
		}

		addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			this.addRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp1));
		}

		addRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			this.addRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp1));
		}

		addRotation(q4fRotation: IQuat4): void {
			q4fRotation.multiplyVec3(this._v3fTranslation);
			q4fRotation.multiply(this._qRotation, this._qRotation);
			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}


		scale(fScale: float): void;
		scale(v3fScale: IVec3): void;
		scale(fX: float, fY: float, fZ: float): void;
		scale(fX: any, fY?: any, fZ?: any): void {
			var pScale: IVec3 = arguments.length === 1 ? (isNumber(arguments[0]) ? Vec3.temp(fX) : arguments[0]) : Vec3.temp(fX, fY, fZ);
			var v3fScale: IVec3 = this._v3fScale;

			v3fScale.scale(pScale);

			bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		lookAt(v3fFrom: IVec3, v3fCenter: IVec3, v3fUp?: IVec3): void;
		lookAt(v3fCenter: IVec3, v3fUp?: IVec3): void;
		lookAt(v3f?): void {
			var v3fFrom: IVec3, v3fCenter: IVec3, v3fUp: IVec3;

			this.update();

			if (arguments.length < 3) {
				v3fFrom = this.worldPosition;
				v3fCenter = <IVec3>arguments[0];
				v3fUp = <IVec3>arguments[1];
			}
			else {
				v3fFrom = <IVec3>arguments[0];
				v3fCenter = <IVec3>arguments[1];
				v3fUp = <IVec3>arguments[2];
			}

			v3fUp = v3fUp || Vec3.temp(0., 1., 0.);

			var v3fParentPos: IVec3 = (<Node>this.parent).worldPosition;
			var m4fTemp: IMat4 = Mat4.lookAt(v3fFrom, v3fCenter, v3fUp, Mat4.temp()).inverse();
			var pData: Float32Array = m4fTemp.data;

			switch (this._eInheritance) {
				case ENodeInheritance.ALL:
					(<Node>this._pParent).inverseWorldMatrix.multiply(m4fTemp, m4fTemp);
					m4fTemp.toQuat4(this._qRotation);
					this.setPosition(pData[__14], pData[__24], pData[__34]);
					break;
				case ENodeInheritance.ROTSCALE:
					var m3fTemp = m4fTemp.toMat3();
					m3fTemp = (<Node>this._pParent).inverseWorldMatrix.toMat3().multiply(m3fTemp, Mat3.temp());
					m3fTemp.toQuat4(this._qRotation);
					this.setPosition(pData[__14], pData[__24], pData[__34]);
					break;
				default:
					m4fTemp.toQuat4(this._qRotation);
					this.setPosition(
						pData[__14] - v3fParentPos.x,
						pData[__24] - v3fParentPos.y,
						pData[__34] - v3fParentPos.z);
			}

			this.update();
		}



		attachToParent(pParent: T): boolean {
			if (super.attachToParent(pParent)) {
				// adjust my local matrix to be relative to this new parent
				var m4fInvertedParentMatrix: IMat4 = Mat4.temp();
				(<Node>this._pParent)._m4fWorldMatrix.inverse(m4fInvertedParentMatrix);
				bf.setBit(this._iUpdateFlags, ENodeUpdateFlags.k_NewWorldMatrix);

				return true;
			}

			return false;
		}

		detachFromParent(): boolean {
			if (super.detachFromParent()) {
				this._m4fWorldMatrix.identity();
				return true;
			}

			return false;
		}

		toString(isRecursive: boolean = false, iDepth: int = 0): string {
			if (config.DEBUG) {

				if (!isRecursive) {
					return '<node' + (this.name ? " " + this.name : "") + '>';
				}

				// var pSibling: IEntity = this.sibling;
				var pChild: T = this.child;
				var s = "";

				for (var i = 0; i < iDepth; ++i) {
					s += ':  ';
				}

				s += '+----[depth: ' + this.depth + ']' + this.toString() + '\n';
				/*"[updated: " + this.isUpdated() + ", childs updated: " + this.hasUpdatedSubNodes() + ", new wm: " + this.isWorldMatrixNew() + "]" +*/
				while (pChild) {
					s += pChild.toString(true, iDepth + 1);
					pChild = pChild.sibling;
				}

				// if (pSibling) {
				// s += pSibling.toString(true, iDepth);
				// }
				// 
				return s;
			}
			return null;

		}

		static private _v3fTemp1: IVec3 = new Vec3();
		static private _v4fTemp1: IVec4 = new Vec4();
		static private _m3fTemp1: IMat3 = new Mat3();
		static private _m4fTemp1: IMat4 = new Mat4();
		static private _m4fTemp2: IMat4 = new Mat4();
		static private _q4fTemp1: IQuat4 = new Quat4();
	}
}
