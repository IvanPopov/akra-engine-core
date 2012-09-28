/**
 * @file
 * @author Igor Karateev
 * @brief файл содержит класс Vec2
 */

Define(X, __[0]);
Define(Y, __[1]);

Define(Vector2, Vec2);

function Vec2(){
    //'use strict';

    var v2fVec;
    if(this === window || this === window.AKRA){
        v2fVec = Vec2._pStorage[Vec2._iIndex++];
        if(Vec2._iIndex == Vec2._nStorageSize){
            Vec2._iIndex = 0;
        }
        //clear
        if(arguments.length == 0){
            // var pData = v2fVec.pData;
            // pData.X = pData.Y = 0;
            return v2fVec;
        }
    }
    else{
        this.pData = new Float32Array(2);
        v2fVec = this;
    }

    var nArgumentsLength = arguments.length;

    if(nArgumentsLength == 1){
        return v2fVec.set(arguments[0]);
    }
    else if(nArgumentsLength == 2){
        return v2fVec.set(arguments[0],arguments[1]);
    }
    else{
        return v2fVec;
    }
};

PROPERTY(Vec2, 'x',
    function () {
        return this.pData.X;
    },
    function (fValue) {
        this.pData.X = fValue;
    }
);

PROPERTY(Vec2, 'y',
    function () {
        return this.pData.Y;
    },
    function (fValue) {
        this.pData.Y = fValue;
    }
);

Vec2.prototype.set = function() {
    'use strict';
    var pData = this.pData;

    if(arguments.length == 1){
        if(typeof(arguments[0]) == "number"){
            this.pData.X = this.pData.Y = arguments[0];
        }
        else if(arguments[0] instanceof Vec2){
            var pData2 = arguments[0].pData;
            pData.X = pData2.X;
            pData.Y = pData2.Y;
        }
        else{
            var pElements = arguments[0];
            pData.X = pElements.X;
            pData.Y = pElements.Y;
        }
    }
    else{
        pData.X = arguments.X;
        pData.Y = arguments.Y;
    }
    return this;
};

/*
 * Vec2.add
 * Performs a vector addition
 *
 * Params:
 * vec2 - Vec2, second operand
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec2.prototype.add = function (v2fVec, v2fDestination) {
    'use strict';
    
    if (!v2fDestination) {
        v2fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v2fVec.pData;
    var pDataDestination = v2fDestination.pData;

    pDataDestination.X = pData1.X + pData2.X;
    pDataDestination.Y = pData1.Y + pData2.Y;
    return v2fDestination;
};

/*
 * Vec2.subtract
 * Performs a vector subtraction
 *
 * Params:
 * vec - Vec2, first operand
 * vec2_ - Vec2, second operand
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec2.prototype.subtract = function (v2fVec, v2fDestination) {
    'use strict';
    if (!v2fDestination) {
        v2fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v2fVec.pData;
    var pDataDestination = v2fDestination.pData;

    pDataDestination.X = pData1.X - pData2.X;
    pDataDestination.Y = pData1.Y - pData2.Y;
    return v2fDestination;
};

/*
 * Vec2.negate
 * Negates the components of a Vec2
 *
 * Params:
 * vec - Vec2 to negate
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec2.prototype.negate = function(v2fDestination) {
    'use strict';
    if(!v2fDestination){
        v2fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v2fDestination.pData;

    pDataDestination.X = -pData.X;
    pDataDestination.Y = -pData.Y;
    return v2fDestination;
};

/*
 * Vec2.scale
 * Multiplies the components of a Vec2 by a scalar value
 *
 * Params:
 * vec - Vec2 to scale
 * val - Numeric value to scale by
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec2.prototype.scale = function(fScale,v2fDestination) {
    'use strict';
    if(!v2fDestination){
        v2fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = v2fDestination.pData;

    pDataDestination.X = pData.X * fScale;
    pDataDestination.Y = pData.Y * fScale;
    return v2fDestination;
};

/*
 * Vec2.normalize
 * Generates a unit vector of the same direction as the provided Vec2
 * If vector length is 0, returns [0, 0, 0]
 *
 * Params:
 * vec - Vec2 to normalize
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec2.prototype.normalize = function(v2fDestination) {
    'use strict';
    if(!v2fDestination){
        v2fDestination = this;
    }
    var pData = this.pData;
    var pDataDestination = v2fDestination.pData;

    var x,y;
    x = pData.X;
    y = pData.Y;
    var fLength = Math.sqrt(x*x + y*y);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
    }

    pDataDestination.X = x;
    pDataDestination.Y = y;

    return v2fDestination;
};

/*
 * Vec2.length
 * Caclulates the length of a Vec2
 *
 * Params:
 * vec - Vec2 to calculate length of
 *
 * Returns:
 * Length of vec
 */

Vec2.prototype.length = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y;
    return Math.sqrt(x*x + y*y);
};

Vec2.prototype.lengthSquare = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y;
    return x*x + y*y;
};
/*
 * Vec2.dot
 * Caclulates the dot product of two vec2s
 *
 * Params:
 * vec - Vec2, first operand
 * vec2_ - Vec2, second operand
 *
 * Returns:
 * Dot product of vec and vec2_
 */

Vec2.prototype.dot = function(v2fVec) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v2fVec.pData;

    return pData1.X*pData2.X + pData1.Y*pData2.Y;
};

/*
 * Vec2.direction
 * Generates a unit vector pointing from one vector to another
 *
 * Params:
 * vec - origin Vec2
 * vec2_ - Vec2 to point to
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec2.prototype.direction = function(v2fVec,v2fDestination) {
    'use strict';
    if(!v2fDestination){
        v2fDestination = this;
    }
    
    var pData1 = this.pData;
    var pData2 = v2fVec.pData;
    var pDataDestination = v2fDestination.pData;

    var x,y;
    x = pData2.X - pData1.X;
    y = pData2.X - pData1.X;

    var flength = Math.sqrt(x*x + y*y);

    if(flength){
        x = x/fLength;
        y = y/fLength;
    }

    pDataDestination.X = x;
    pDataDestination.Y = y;
    return v2fDestination;
};

/*
 * Vec2.mix
 * Performs a linear interpolation between two Vec2
 *
 * Params:
 * vec - Vec2, first vector
 * vec2_ - Vec2, second vector
 * lerp - interpolation amount between the two inputs
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */

Vec2.prototype.mix = function(v2fVec,fA,v2fDestination) {
    'use strict';
    if(!v2fDestination){
        v2fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = v2fVec.pData;
    var pDataDestination = v2fDestination.pData;

    fA = Math.clamp(fA,0,1);

    var fA1 = 1. - fA;
    var fA2 = fA;

    pDataDestination.X = fA1 * pData1.X + fA2 * pData2.X;
    pDataDestination.Y = fA1 * pData1.Y + fA2 * pData2.Y;

    return v2fDestination;
};

Vec2.prototype.isEqual = function(v2fVec, fEps) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v2fVec.pData;

    fEps = ifndef(fEps,0);

    if(fEps == 0){
        if(     pData1.X != pData2.X
             || pData1.Y != pData2.Y){
            return false;
        }
    }
    else{
        if(    Math.abs(pData1.X - pData2.X) > fEps
            || Math.abs(pData1.Y - pData2.Y) > fEps){

            return false;
        }
    }
    return true;
};

Vec2.prototype.isClear = function() {
    'use strict';
    var pData = this.pData;

    if(pData.X != 0 || pData.Y != 0){
        return false;
    }
    return true;
};

Vec2.prototype.clear = function() {
    'use strict';
    var pData = this.pData;

    pData.X = pData.Y = 0;

    return this;
};

/*
 * Vec2.str
 * Returns a string representation of a vector
 *
 * Params:
 * vec - Vec2 to represent as a string
 *
 * Returns:
 * string representation of vec
 */

Vec2.prototype.toString = function() {
    'use strict';
    var pData = this.pData;
    return '[' + pData.X + ', ' + pData.Y + ']';
};

a.allocateStorage(Vec2,100);