/**
 * @file
 * @author Igor Karateev
 * @brief файл содержит класс Vec3
 */

Define(X, __[0]);
Define(Y, __[1]);
Define(Z, __[2]);

Define(Vector3, Vec3);

function Vec3(){
    //'use strict';

    var v3fVec;

    if(this === window || this === window.AKRA){
        v3fVec = Vec3._pStorage[Vec3._iIndex++];
        if(Vec3._iIndex == Vec3._nStorageSize){
            Vec3._iIndex = 0;
        }

        //clear
        if(arguments.length == 0){
            // var pData = v3fVec.pData;
            // pData.X = pData.Y = pData.Z = 0;
            return v3fVec;
        }
    }
    else{
        this.pData = new Float32Array(3);
        v3fVec = this;
    }
    
    var nArgumentsLength = arguments.length;

    if(nArgumentsLength == 1){
        return v3fVec.set(arguments[0]);
    }
    else if(nArgumentsLength == 2){
        return v3fVec.set(arguments[0],arguments[1]);
    }
    else if(nArgumentsLength == 3){
        return v3fVec.set(arguments[0],arguments[1],arguments[2]);
    }
    else{
        return v3fVec;
    }
}

PROPERTY(Vec3, 'x',
    function () {
        return this.pData.X;
    },
    function (fValue) {
        this.pData.X = fValue;
    }
);

PROPERTY(Vec3, 'y',
    function () {
        return this.pData.Y;
    },
    function (fValue) {
        this.pData.Y = fValue;
    }
);

PROPERTY(Vec3, 'z',
    function () {
        return this.pData.Z;
    },
    function (fValue) {
        this.pData.Z = fValue;
    }
);

Vec3.prototype.set = function() {
    'use strict';
    var pData = this.pData;
    var nArgumentsLength = arguments.length;
    if(nArgumentsLength == 1){
        if(typeof(arguments[0]) == "number"){
            pData.X = pData.Y = pData.Z = arguments[0];
        }
        else if(arguments[0].pData){
            var pData2 = arguments[0].pData;
            pData.X = pData2.X;
            pData.Y = pData2.Y;
            pData.Z = pData2.Z;
        }
        else{
            var pElements = arguments[0];
            pData.X = pElements.X;
            pData.Y = pElements.Y;
            pData.Z = pElements.Z;
        }
    }
    else if(nArgumentsLength == 2){
        //Vec2 и float или float и Vec2
        if(typeof(arguments[0]) == "number"){
            //number and Vec2
            var pData2 = arguments[1].pData;

            pData.X = arguments[0];
            pData.Y = pData2.X;
            pData.Z = pData2.Y;
        }
        else{
            //Vec2 and number
            var pData2 = arguments[0].pData;

            pData.X = pData2.X;
            pData.Y = pData2.Y;
            pData.Z = arguments[1];
        }
    }
    else{
        pData.X = arguments.X;
        pData.Y = arguments.Y;
        pData.Z = arguments.Z;
    }

    return this;
};

/*
 * Vec3.add
 * Performs a vector addition
 *
 * Params:
 * vec - Vec3, first operand
 * Vec2 - Vec3, second operand
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec3.prototype.add = function (v3fVec, v3fDestination) {
    'use strict';
    if (!v3fDestination) {
        v3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v3fVec.pData;
    var pDataDestination = v3fDestination.pData;

    pDataDestination.X = pData1.X + pData2.X;
    pDataDestination.Y = pData1.Y + pData2.Y;
    pDataDestination.Z = pData1.Z + pData2.Z;
    return v3fDestination;
};

/*
 * Vec3.subtract
 * Performs a vector subtraction
 *
 * Params:
 * vec - Vec3, first operand
 * Vec2 - Vec3, second operand
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec3.prototype.subtract = function (v3fVec, v3fDestination) {
    'use strict';
    if (!v3fDestination) {
        v3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v3fVec.pData;
    var pDataDestination = v3fDestination.pData;

    pDataDestination.X = pData1.X - pData2.X;
    pDataDestination.Y = pData1.Y - pData2.Y;
    pDataDestination.Z = pData1.Z - pData2.Z;
    return v3fDestination;
};



/*
 * Vec3.negate
 * Negates the components of a Vec3
 *
 * Params:
 * vec - Vec3 to negate
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec3.prototype.negate = function(v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v3fDestination.pData;

    pDataDestination.X = -pData.X;
    pDataDestination.Y = -pData.Y;
    pDataDestination.Z = -pData.Z;
    return v3fDestination;
};

/*
 * Vec3.scale
 * Multiplies the components of a Vec3 by a scalar value
 *
 * Params:
 * vec - Vec3 to scale
 * val - Numeric value to scale by
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec3.prototype.scale = function(fScale,v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v3fDestination.pData;

    pDataDestination.X = pData.X * fScale;
    pDataDestination.Y = pData.Y * fScale;
    pDataDestination.Z = pData.Z * fScale;

    return v3fDestination;
};

/*
 * Vec3.normalize
 * Generates a unit vector of the same direction as the provided Vec3
 * If vector length is 0, returns [0, 0, 0]
 *
 * Params:
 * vec - Vec3 to normalize
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec3.prototype.normalize = function(v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v3fDestination.pData;

    var x,y,z;
    x = pData.X;
    y = pData.Y;
    z = pData.Z;
    var fLength = Math.sqrt(x*x + y*y + z*z);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
        z = z/fLength;
    }

    pDataDestination.X = x;
    pDataDestination.Y = y;
    pDataDestination.Z = z;

    return v3fDestination;
};

/*
 * Vec3.cross
 * Generates the cross product of two vec3s
 *
 * Params:
 * vec - Vec3, first operand
 * Vec2 - Vec3, second operand
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec3.prototype.cross = function(v3fVec,v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v3fVec.pData;
    var pDataDestination = v3fDestination.pData;

    var x1 = pData1.X, y1 = pData1.Y, z1 = pData1.Z;
    var x2 = pData2.X, y2 = pData2.Y, z2 = pData2.Z;

    pDataDestination.X = y1*z2 - z1*y2;
    pDataDestination.Y = z1*x2 - x1*z2;
    pDataDestination.Z = x1*y2 - y1*x2;

    return v3fDestination;
};

/*
 * Vec3.length
 * Caclulates the length of a Vec3
 *
 * Params:
 * vec - Vec3 to calculate length of
 *
 * Returns:
 * Length of vec
 */
Vec3.prototype.length = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y, z = pData.Z;
    return Math.sqrt(x*x + y*y + z*z);
};

Vec3.prototype.lengthSquare = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y, z = pData.Z;
    return x*x + y*y + z*z;
};
/*
 * Vec3.dot
 * Caclulates the dot product of two vec3s
 *
 * Params:
 * vec - Vec3, first operand
 * Vec2 - Vec3, second operand
 *
 * Returns:
 * Dot product of vec and Vec2
 */

Vec3.prototype.dot = function(v3fVec) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v3fVec.pData;
    return pData1.X*pData2.X + pData1.Y*pData2.Y + pData1.Z*pData2.Z;
};

/*
 * Vec3.direction
 * Generates a unit vector pointing from one vector to another
 *
 * Params:
 * vec - origin Vec3
 * Vec2 - Vec3 to point to
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec3.prototype.direction = function(v3fVec,v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v3fVec.pData;
    var pDataDestination = v3fDestination.pData;

    var x = pData2.X - pData1.X;
    var y = pData2.Y - pData1.Y;
    var z = pData2.Z - pData1.Z;

    var fLength = Math.sqrt(x*x + y*y + z*z);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
        z = z/fLength;
    }

    pDataDestination.X = x;
    pDataDestination.Y = y;
    pDataDestination.Z = z;

    return v3fDestination;
};

/*
 * Vec3.lerp
 * Performs a linear interpolation between two Vec3
 *
 * Params:
 * vec - Vec3, first vector
 * Vec2 - Vec3, second vector
 * lerp - interpolation amount between the two inputs
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec3.prototype.mix = function(v3fVec,fA,v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v3fVec.pData;
    var pDataDestination = v3fDestination.pData;

    fA = Math.clamp(fA,0,1);

    var fA1 = 1. - fA;
    var fA2 = fA;

    pDataDestination.X = fA1 * pData1.X + fA2 * pData2.X;
    pDataDestination.Y = fA1 * pData1.Y + fA2 * pData2.Y;
    pDataDestination.Z = fA1 * pData1.Z + fA2 * pData2.Z;

    return v3fDestination;
};

Vec3.prototype.toTranslationMatrix = function(m4fDestination) {
    'use strict';
    if(!m4fDestination){
        m4fDestination = new Matrix4(1);
    }
    else{
        m4fDestination.identity();
    }

    var pData = this.pData;
    var pDataDestination = m4fDestination.pData;

    pDataDestination._14 = pData.X;
    pDataDestination._24 = pData.Y;
    pDataDestination._34 = pData.Z;

    return m4fDestination;
};

/*
 * Vec3.str
 * Returns a string representation of a vector
 *
 * Params:
 * vec - Vec3 to represent as a string
 *
 * Returns:
 * string representation of vec
 */

Vec3.prototype.toString = function() {
    'use strict';
    var pData = this.pData;
    return '[' + pData.X + ', ' + pData.Y + ', ' + pData.Z + ']';
};

Vec3.prototype.isEqual = function(v3fVec, fEps) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v3fVec.pData;

    fEps = ifndef(fEps,0);

    if(fEps == 0){
        if(    pData1.X != pData2.X 
            || pData1.Y != pData2.Y
            || pData1.Z != pData2.Z){

            return false;
        }
    }
    else{
        if(    Math.abs(pData1.X - pData2.X) > fEps
            || Math.abs(pData1.Y - pData2.Y) > fEps
            || Math.abs(pData1.Z - pData2.Z) > fEps){

            return false;
        }
    }
    return true;
};

Vec3.prototype.isClear = function() {
    'use strict';
    var pData = this.pData;

    if(    pData.X != 0 
        || pData.Y != 0
        || pData.Z != 0){

        return false;
    }
    return true;
};

Vec3.prototype.clear = function() {
    'use strict';
    var pData = this.pData;

    pData.X = pData.Y = pData.Z = 0;

    return this;
};

Vec3.prototype.vec3TransformCoord = function(m4fTransformMatrix,v3fDestination){
    'use strict';
    if(!v3fDestination){
        v3fDestination = new Vec3();
    }

    var pData1 = this.pData;
    var pData2 = m4fTransformMatrix.pData;
    var pDataDestination = v3fDestination.pData;

    var x,y,z,w;

    x = pData2._11 * pData1.X + pData2._12 * pData1.Y + pData2._13 * pData1.Z + pData2._14;
    y = pData2._21 * pData1.X + pData2._22 * pData1.Y + pData2._23 * pData1.Z + pData2._24;
    z = pData2._31 * pData1.X + pData2._32 * pData1.Y + pData2._33 * pData1.Z + pData2._34;
    w = pData2._41 * pData1.X + pData2._42 * pData1.Y + pData2._43 * pData1.Z + pData2._44;

    pDataDestination.X = x/w;
    pDataDestination.Y = y/w;
    pDataDestination.Z = z/w;

    return v3fDestination;
};

Vec3.prototype.mult = Vec3.prototype.multiply;

a.allocateStorage(Vec3,100);