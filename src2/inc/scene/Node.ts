#ifndef NODE_TS
#define NODE_TS

#include "INode.ts"
#include "util/Entity.ts"
#include "math/math.ts"

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
     };

	export class Node extends util.Entity implements INode {
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

		create(): bool {
			return true;
		}


		inline get localOrientation(): IQuat4 { 
			return this._qRotation; 
		}
		
		inline set localOrientation(qOrient: IQuat4) { 
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation); 
			this._qRotation.set(qOrient); 
		}
		
		inline get localPosition(): IVec3 { 
			return this._v3fTranslation; 
		}
		
		inline set localPosition(v3fPosition: IVec3) { 
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation); 
			this._v3fTranslation.set(v3fPosition); 
		}
		
		inline get localScale(): IVec3 { 
			return this._v3fScale; 
		}

		inline set localScale(v3fScale: IVec3) { 
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation); 
			this._v3fScale.set(v3fScale); 
		}

		inline get localMatrix(): IMat4 { 
			return this._m4fLocalMatrix; 
		}

		inline set localMatrix(m4fLocalMatrix: IMat4) { 
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix); 
			this._m4fLocalMatrix.set(m4fLocalMatrix); 
		}

		
		inline get worldMatrix(): IMat4 {
			return this._m4fWorldMatrix;
		}

		inline get worldPosition(): IVec3 {
			return this._v3fWorldPosition;
		}

		get inverseWorldMatrix(): IMat4 {
			if (TEST_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildInverseWorldMatrix)) {
		        this._m4fWorldMatrix.inverse(this._m4fInverseWorldMatrix);
		        CLEAR_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildInverseWorldMatrix);
		    }

			return this._m4fInverseWorldMatrix;
		}

		get normalMatrix(): IMat3 {
			if (TEST_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildNormalMatrix)) {

		        this._m4fWorldMatrix.toMat3(this._m3fNormalMatrix).inverse().transpose();
		        
		        CLEAR_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildNormalMatrix);
		    }

			return this._m3fNormalMatrix;
		}
		

		update(): bool {
			// derived classes update the local matrix
		    // then call this base function to complete
		    // the update
		    return this.recalcWorldMatrix();
		}


		prepareForUpdate(): void {
			super.prepareForUpdate();
			// clear the temporary flags
			CLEAR_ALL(this._iUpdateFlags, FLAG(ENodeUpdateFlags.k_NewLocalMatrix) | 
        		FLAG(ENodeUpdateFlags.k_NewOrientation) | FLAG(ENodeUpdateFlags.k_NewWorldMatrix));
		}


		inline setInheritance(eInheritance: ENodeInheritance) {
			this._eInheritance = eInheritance;
		}

		inline getInheritance(): ENodeInheritance {
			return this._eInheritance;
		}

		inline isWorldMatrixNew(): bool {
			return TEST_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewWorldMatrix);
		}

		inline isLocalMatrixNew(): bool {
			return TEST_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix);
		}

		private recalcWorldMatrix(): bool {
			var isParentMoved: bool = this._pParent && (<Node>this._pParent).isWorldMatrixNew();
		    var isOrientModified: bool = TEST_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		    var isLocalModified: bool = TEST_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewLocalMatrix);

		    if (isOrientModified || isParentMoved || isLocalModified) {
		        var m4fLocal: IMat4 = this._m4fLocalMatrix;
		        var m4fWorld: IMat4 = this._m4fWorldMatrix;
		        
		        var m4fOrient: IMat4 = Node._m4fTemp;
		        var v3fTemp: IVec3 = Node._v3fTemp;
		        
		        var pWorldData: Float32Array = m4fWorld.data;
		        var pOrientData: Float32Array = m4fOrient.data;

		        this._qRotation.toMat4(m4fOrient);

		        m4fOrient.setTranslation(this._v3fTranslation);
		        m4fOrient.scaleLeft(this._v3fScale);
		        m4fOrient.multiply(m4fLocal); 

		        //console.error(m4fOrient.toString());

		        if (this._pParent) {
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
		            else if (this._eInheritance === ENodeInheritance.ROTSCALE) {
		                var p11 = pParentData[__11], p12 = pParentData[__12],
		                    p13 = pParentData[__13];
		                var p21 = pParentData[__21], p22 = pParentData[__22],
		                    p23 = pParentData[__23];
		                var p31 = pParentData[__31], p32 = pParentData[__32],
		                    p33 = pParentData[__33];

		                var l11 = pOrientData[__11], l12 = pOrientData[__12],
		                    l13 = pOrientData[__13];
		                var l21 = pOrientData[__21], l22 = pOrientData[__22],
		                    l23 = pOrientData[__23];
		                var l31 = pOrientData[__31], l32 = pOrientData[__32],
		                    l33 = pOrientData[__33];
		                
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
		        TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewWorldMatrix);
		        // and it's inverse & vectors are out of date
		        TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildInverseWorldMatrix);
		        TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_RebuildNormalMatrix);

		        return true;
		    }

		    return false;
		}

		setPosition(v3fPosition: IVec3): void;
		setPosition(fX: float, fY: float, fZ: float): void;
		setPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;

		    v3fTranslation.set(pPos);

		    TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRelPosition(v3fPosition: IVec3): void;
		setRelPosition(fX: float, fY: float, fZ: float): void;
		setRelPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;
		    
		    this._qRotation.multiplyVec3(pPos);
    		v3fTranslation.set(pPos);

		    TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addPosition(v3fPosition: IVec3): void;
		addPosition(fX: float, fY: float, fZ: float): void;
		addPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;
		    
		    v3fTranslation.add(pPos);

		    TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addRelPosition(v3fPosition: IVec3): void;
		addRelPosition(fX: float, fY: float, fZ: float): void;
		addRelPosition(fX?: any, fY?: any, fZ?: any): void {
			var pPos: IVec3 = arguments.length === 1? arguments[0]: vec3(fX, fY, fZ);
		    var v3fTranslation: IVec3 = this._v3fTranslation;
		    
		    this._qRotation.multiplyVec3(pPos);
    		v3fTranslation.add(pPos);

		    TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByMatrix(m3fRotation: IMat3): void;
		setRotationByMatrix(m4fRotation: IMat4): void;
		setRotationByMatrix(matrix: any): void {
			matrix.toQuat4(this._qRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			Quat4.fromAxisAngle(v3fAxis, fAngle, this._qRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			Quat4.fromForwardUp(v3fForward, v3fUp, this._qRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, this._qRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			Quat4.fromYawPitchRoll(fY, fX, fZ, this._qRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		setRotation(q4fRotation: IQuat4): void {
			this._qRotation.set(q4fRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		addRelRotationByMatrix(m3fRotation: IMat3): void;
		addRelRotationByMatrix(m4fRotation: IMat4): void;
		addRelRotationByMatrix(matrix: any): void {
			this.addRelRotation(arguments[0].toQuat4(Node._q4fTemp));
		}

		inline addRelRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			this.addRelRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp));	
		}

		inline addRelRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			this.addRelRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp));
		}

		inline addRelRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			this.addRelRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp));
		}

		inline addRelRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			this.addRelRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp));
		}

		addRelRotation(q4fRotation: IQuat4): void {
			this._qRotation.multiply(q4fRotation);
			TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		inline addRotationByMatrix(m3fRotation: IMat3): void;
		inline addRotationByMatrix(m4fRotation: IMat4): void;
		inline addRotationByMatrix(matrix: any): void {
			this.addRotation(arguments[0].toQuat4(Node._q4fTemp));
		}

		inline addRotationByAxisAngle(v3fAxis: IVec3, fAngle: float): void {
			this.addRotation(Quat4.fromAxisAngle(v3fAxis, fAngle, Node._q4fTemp));	
		}

		inline addRotationByForwardUp(v3fForward: IVec3, v3fUp: IVec3): void {
			this.addRotation(Quat4.fromForwardUp(v3fForward, v3fUp, Node._q4fTemp));
		}

		inline addRotationByEulerAngles(fYaw: float, fPitch: float, fRoll: float): void {
			this.addRotation(Quat4.fromYawPitchRoll(fYaw, fPitch, fRoll, Node._q4fTemp));
		}

		inline addRotationByXYZAxis(fX: float, fY: float, fZ: float): void {
			this.addRotation(Quat4.fromYawPitchRoll(fY, fX, fZ, Node._q4fTemp));
		}

		addRotation(q4fRotation: IQuat4): void {
			q4fRotation.multiplyVec3(this._v3fTranslation);
    		q4fRotation.multiply(this._qRotation, this._qRotation);
    		TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}


		scale(fScale: float): void;
		scale(v3fScale: IVec3): void;
		scale(fX: float, fY: float, fZ: float): void;
		scale(fX: any, fY?: any, fZ?: any): void {
			var pScale: IVec3 = arguments.length === 1? (isNumber(arguments[0])? vec3(fX): arguments[0]): vec3(fX, fY, fZ);
		    var v3fScale: IVec3 = this._v3fScale;

		    v3fScale.scale(pScale);
		    
		    TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewOrientation);
		}

		

		attachToParent(pParent: IEntity): bool {
			if (super.attachToParent(pParent)) {
				// adjust my local matrix to be relative to this new parent
	            var m4fInvertedParentMatrix: IMat4 = mat4();
	            (<Node>this._pParent)._m4fWorldMatrix.inverse(m4fInvertedParentMatrix);
	            TRUE_BIT(this._iUpdateFlags, ENodeUpdateFlags.k_NewWorldMatrix);
	            
	            return true;
			}

			return false;
		}

		detachFromParent(): bool {
			if (super.detachFromParent()) {
				this._m4fWorldMatrix.identity();
				return true;
			}

			return false;
		}

		toString(isRecursive: bool = false, iDepth: int = 0): string {
#ifdef DEBUG

		    if (!isRecursive) {
		        return '<node' + (this.name? " " + this.name: "") + '>';
		    }

		    var pSibling: IEntity = this.sibling;
		    var pChild: IEntity = this.child;
		    var s = "";

		    for (var i = 0; i < iDepth; ++ i) {
		        s += ':  ';
		    }

		    s += '+----[depth: ' + this.depth + ']' + this.toString() +  '\n';
/*"[updated: " + this.isUpdated() + ", childs updated: " + this.hasUpdatedSubNodes() + ", new wm: " + this.isWorldMatrixNew() + "]" +*/
		    if (pChild) {
		        s += pChild.toString(true, iDepth + 1);
		    }

		    if (pSibling) {
		        s += pSibling.toString(true, iDepth);
		    }

		    return s;
#else
			return null;
#endif
		};

		private static _v3fTemp: IVec3 = new Vec3();
		private static _v4fTemp: IVec4 = new Vec4();
		private static _m3fTemp: IMat3 = new Mat3();
		private static _m4fTemp: IMat4 = new Mat4();
		private static _q4fTemp: IQuat4 = new Quat4();
	}
}

#endif