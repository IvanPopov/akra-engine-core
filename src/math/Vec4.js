/**
 * @file
 * @author Igor Karateev
 * @brief файл содержит класс Vec4
 */

Define(X, __[0]);
Define(Y, __[1]);
Define(Z, __[2]);
Define(W, __[3]);

Define(Vector4, Vec4);

function Vec4(){
    //'use strict';

    var v4fVec;

    if(this === window || this === window.AKRA){
        v4fVec = Vec4._pStorage[Vec4._iIndex++];
        if(Vec4._iIndex == Vec4._nStorageSize){
            Vec4._iIndex = 0;
        }
        //clear
        if(arguments.length == 0){
            // var pData = v4fVec.pData;
            // pData.X = pData.Y = pData.Z = pData.W = 0;
            return v4fVec;
        }
    }
    else{
        this.pData = new Float32Array(4);
        v4fVec = this;
    }

    var nArgumentsLength = arguments.length;

    if(nArgumentsLength == 1){
        return v4fVec.set(arguments[0]);
    }
    else if(nArgumentsLength == 2){
        return v4fVec.set(arguments[0],arguments[1]);    
    }
    else if(nArgumentsLength == 3){
        return v4fVec.set(arguments[0],arguments[1],arguments[2]);
    }
    else if(nArgumentsLength == 4){
        return v4fVec.set(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    else{
        return v4fVec;
    }
}

PROPERTY(Vec4, 'x',
    function () {
        return this.pData.X;
    },
    function (fValue) {
        this.pData.X = fValue;
    }
);

PROPERTY(Vec4, 'y',
    function () {
        return this.pData.Y;
    },
    function (fValue) {
        this.pData.Y = fValue;
    }
);

PROPERTY(Vec4, 'z',
    function () {
        return this.pData.Z;
    },
    function (fValue) {
        this.pData.Z = fValue;
    }
);

PROPERTY(Vec4, 'w',
    function () {
        return this.pData.W;
    },
    function (fValue) {
        this.pData.W = fValue;
    }
);

Vec4.prototype.set = function() {
    'use strict';
    var pData = this.pData;
    if(arguments.length == 0){
        pData.X = pData.Y = pData.Z = pData.W = 0;
    }
    else if(arguments.length == 1){
        if(typeof(arguments[0]) == "number"){
            pData.X = pData.Y = pData.Z = pData.W = arguments[0];
        }
        else if(arguments[0] instanceof Vec4){
            var pData2 = arguments[0].pData;
            pData.X = pData2.X;
            pData.Y = pData2.Y;
            pData.Z = pData2.Z;
            pData.W = pData2.W;
        }
        else{
            var pElements = arguments[0];
            pData.X = pElements.X;
            pData.Y = pElements.Y;
            pData.Z = pElements.Z;
            pData.W = pElements.W;
        }
    }
    else if(arguments.length == 2){
        //float vec3
        //vec2 vec2
        //vec3 float
        if(typeof(arguments[0]) == "number"){
            //float vec3
            var pData2 = arguments[1].pData;

            pData.X = arguments[0];
            pData.Y = pData2.X;
            pData.Z = pData2.Y;
            pData.W = pData2.Z;
        }
        else{
            if(arguments[0].pData.length == 2){
                //vec2 vec2
                var pData1 = arguments[0].pData;
                var pData2 = arguments[1].pData;

                pData.X = pData1.X;
                pData.Y = pData1.Y;
                pData.Z = pData2.X;
                pData.W = pData2.Y;
            }
            else{
                //vec3 float
                var pData2 = arguments[0].pData;

                pData.X = pData2.X;
                pData.Y = pData2.Y;
                pData.Z = pData2.Z;
                pData.W = arguments[1];
            }
        }
    }
    else if(arguments.length == 3){
        //float float vec2
        //float vec2 float
        //vec2 float float
        if(typeof(arguments[0]) == "number"){
            if(typeof(arguments[1]) == "number"){
                //float float vec2
                var pData2 = arguments[2].pData;

                pData.X = arguments[0];
                pData.Y = arguments[1];
                pData.Z = pData2.X;
                pData.W = pData2.Y;
            }
            else{
                //float vec2 float
                var pData2 = arguments[1].pData;

                pData.X = arguments[0];
                pData.Y = pData2.X;
                pData.Z = pData2.Y;
                pData.W = arguments[2];   
            }
        }
        else{
            //vec2 float float
            var pData2 = arguments[0].pData;

            pData.X = pData2.X;
            pData.Y = pData2.Y;
            pData.Z = arguments[1];
            pData.W = arguments[2];   
        }
    }
    else{
        pData.X = arguments.X;
        pData.Y = arguments.Y;
        pData.Z = arguments.Z;
        pData.W = arguments.W;
    }

    return this;
};

/*
 * Vec4.add
 * Performs a vector addition
 *
 * Params:
 * vec - Vec4, first operand
 * Vec2 - Vec4, second operand
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.add = function(v4fVec,v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v4fVec.pData;
    var pDataDestination = v4fDestination.pData;

    pDataDestination.X = pData1.X + pData2.X;
    pDataDestination.Y = pData1.Y + pData2.Y;
    pDataDestination.Z = pData1.Z + pData2.Z;
    pDataDestination.W = pData1.W + pData2.W;

    return v4fDestination;
};

/*
 * Vec4.subtract
 * Performs a vector subtraction
 *
 * Params:
 * vec - Vec4, first operand
 * Vec2 - Vec4, second operand
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.subtract = function(v4fVec,v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v4fVec.pData;
    var pDataDestination = v4fDestination.pData;

    pDataDestination.X = pData1.X - pData2.X;
    pDataDestination.Y = pData1.Y - pData2.Y;
    pDataDestination.Z = pData1.Z - pData2.Z;
    pDataDestination.W = pData1.W - pData2.W;

    return v4fDestination;
};

/*
 * Vec4.negate
 * Negates the components of a Vec4
 *
 * Params:
 * vec - Vec4 to negate
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.negate = function(v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v4fDestination.pData;

    pDataDestination.X = -pData.X;
    pDataDestination.Y = -pData.Y;
    pDataDestination.Z = -pData.Z;
    pDataDestination.W = -pData.W;

    return v4fDestination;
};

/*
 * Vec4.scale
 * Multiplies the components of a Vec4 by a scalar value
 *
 * Params:
 * vec - Vec4 to scale
 * val - Numeric value to scale by
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.scale = function(fScale,v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v4fDestination.pData;

    pDataDestination.X = pData.X * fScale;
    pDataDestination.Y = pData.Y * fScale;
    pDataDestination.Z = pData.Z * fScale;
    pDataDestination.W = pData.W * fScale;

    return v4fDestination;
};

/*
 * Vec4.normalize
 * Generates a unit vector of the same direction as the provided Vec4
 * If vector length is 0, returns [0, 0, 0]
 *
 * Params:
 * vec - Vec4 to normalize
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.normalize = function(v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v4fDestination.pData;

    var x = pData.X;
    var y = pData.Y;
    var z = pData.Z;
    var w = pData.W;

    var fLength = Math.sqrt(x*x + y*y +z*z + w*w);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
        z = z/fLength;
        w = w/fLength;
    }

    pDataDestination.X = x;
    pDataDestination.Y = y;
    pDataDestination.Z = z;
    pDataDestination.W = w;

    return v4fDestination;
};

/*
 * Vec4.length
 * Caclulates the length of a Vec4
 *
 * Params:
 * vec - Vec4 to calculate length of
 *
 * Returns:
 * Length of vec
 */

Vec4.prototype.length = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    return Math.sqrt(x*x + y*y + z*z + w*w);
};
Vec4.prototype.lengthSquare = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    return x*x + y*y + z*z + w*w;
};
/*
 * Vec4.dot
 * Caclulates the dot product of two vec4s
 *
 * Params:
 * vec - Vec4, first operand
 * Vec2 - Vec4, second operand
 *
 * Returns:
 * Dot product of vec and Vec2
 */

Vec4.prototype.dot = function(v4fVec) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v4fVec.pData;

    return pData1.X * pData2.X + pData1.Y * pData2.Y + pData1.Z * pData2.Z + pData1.W * pData2.W;
};

/*
 * Vec4.direction
 * Generates a unit vector pointing from one vector to another
 *
 * Params:
 * vec - origin Vec4
 * vec2 - Vec4 to point to
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.direction = function(v4fVec,v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v4fVec.pData;
    var pDataDestination = v4fDestination.pData;

    var x = pData2.X - pData1.X;
    var y = pData2.Y - pData1.Y;
    var z = pData2.Z - pData1.Z;
    var w = pData2.W - pData1.W;

    var fLength = Math.sqrt(x*x + y*y + z*z + w*w);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
        z = z/fLength;
        w = w/fLength;
    }

    pDataDestination.X = x;
    pDataDestination.Y = y;
    pDataDestination.Z = z;
    pDataDestination.W = w;

    return v4fDestination;
};

/*
 * Vec4.lerp
 * Performs a linear interpolation between two Vec4
 *
 * Params:
 * vec - Vec4, first vector
 * vec2 - Vec4, second vector
 * lerp - interpolation amount between the two inputs
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec4.prototype.mix = function(v4fVec,fA,v4fDestination) {
    'use strict';
    if(!v4fDestination){
        v4fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v4fVec.pData;
    var pDataDestination = v4fDestination.pData;

    var fA1 = 1 - fA;
    var fA2 = fA;

    pDataDestination.X = fA1 * pData1.X + fA2 * pData2.X;
    pDataDestination.Y = fA1 * pData1.Y + fA2 * pData2.Y;
    pDataDestination.Z = fA1 * pData1.Z + fA2 * pData2.Z;
    pDataDestination.W = fA1 * pData1.W + fA2 * pData2.W;

    return v4fDestination;
};

/*
 * Vec4.str
 * Returns a string representation of a vector
 *
 * Params:
 * vec - Vec4 to represent as a string
 *
 * Returns:
 * string representation of vec
 */

Vec4.prototype.toString = function() {
    'use strict';
    var pData = this.pData;
    return '[' + pData.X + ', ' + pData.Y + ', ' + pData.Z + ', ' + pData.W + ']';
};

Vec4.prototype.isEqual = function(v4fVec,fEps) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v4fVec.pData;

    fEps = ifndef(fEps,0);

    if(fEps == 0){
        if(    pData1.X != pData2.X 
            || pData1.Y != pData2.Y
            || pData1.Z != pData2.Z
            || pData1.W != pData2.W){

            return false;
        }
    }
    else{
        if(    Math.abs(pData1.X - pData2.X) > fEps
            || Math.abs(pData1.Y - pData2.Y) > fEps
            || Math.abs(pData1.Z - pData2.Z) > fEps
            || Math.abs(pData1.W - pData2.W) > fEps){

            return false;
        }
    }
    return true;
};

Vec4.prototype.isClear = function() {
    'use strict';
    var pData = this.pData;

    if(    pData.X != 0 
        || pData.Y != 0
        || pData.Z != 0
        || pData.W != 0){

        return false;
    }
    return true;
};

Vec4.prototype.clear = function() {
    'use strict';
    var pData = this.pData;

    pData.X = pData.Y = pData.Z = pData.W = 0;

    return this;
};

a.allocateStorage(Vec4,100);