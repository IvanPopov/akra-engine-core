/**
 * @file
 * @author Igor Karateev
 * @brief файл содержит переработанную версию библиотеки glMatrix
 * @email iakarateev@gmail.com
 *
 * Матричные и векторные операции.
 */

/* 
 * glMatrix.js - High performance matrix and vector operations for WebGL
 * version 0.9.6
 */

/*
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */


Define(X, __[0])
Define(Y, __[1])
Define(Z, __[2])
Define(W, __[3])
Define(_11, __[0])
Define(_12, __[1])
Define(_13, __[2])
Define(_14, __[3])
Define(_21, __[4])
Define(_22, __[5])
Define(_23, __[6])
Define(_24, __[7])
Define(_31, __[8])
Define(_32, __[9])
Define(_33, __[10])
Define(_34, __[11])
Define(_41, __[12])
Define(_42, __[13])
Define(_43, __[14])
Define(_44, __[15])

Define(a11, __[0])
Define(a12, __[1])
Define(a13, __[2])
Define(a21, __[3])
Define(a22, __[4])
Define(a23, __[5])
Define(a31, __[6])
Define(a32, __[7])
Define(a33, __[8])

function Vec2(){
    'use strict';
    var pData = this.pData = new Float32Array(2);

    //без аргументов инициализируется нулями, а
    //массив уже заполнен нулями
    
    if(arguments.length == 1){
        if(typeof(arguments[0]) == "number"){
            pData[0] = pData[1] = arguments[0];
        }
        else if(arguments[0] instanceof Vec2){
            var pData2 = arguments[0].pData;
            pData[0] = pData2[0];
            pData[1] = pData2[1];
        }
        else{
            var pElements = arguments[0];
            pData[0] = pElements[0];
            pData[1] = pElements[1];
        }
    }
    else if(arguments.length != 0){
        pData[0] = arguments[0];
        pData[1] = arguments[1];
    }

    return this;
}

Vec2.prototype.set = function() {
    'use strict';
    var pData = this.pData;

    if(arguments.length == 1){
        if(typeof(arguments[0]) == "number"){
            this.pData[0] = this.pData[1] = arguments[0];
        }
        else if(arguments[0] instanceof Vec2){
            var pData2 = arguments[0].pData;
            pData[0] = pData2[0];
            pData[1] = pData2[1];
        }
        else{
            var pElements = arguments[0];
            pData[0] = pElements[0];
            pData[1] = pElements[1];
        }
    }
    else{
        pData[0] = arguments[0];
        pData[1] = arguments[1];
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

    pDataDestination[0] = pData1[0] + pData2[0];
    pDataDestination[1] = pData1[1] + pData2[1];
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

    pDataDestination[0] = pData1[0] - pData2[0];
    pDataDestination[1] = pData1[1] - pData2[1];
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

    pDataDestination[0] = -pData[0];
    pDataDestination[1] = -pData[1];
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

    pDataDestination[0] = pData[0] * fScale;
    pDataDestination[1] = pData[1] * fScale;
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
    x = pData[0];
    y = pData[1];
    var fLength = Math.sqrt(x*x + y*y);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
    }

    pDataDestination[0] = x;
    pDataDestination[1] = y;

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
    var x = pData[0],y = pData[1];
    return Math.sqrt(x*x + y*y);
};

Vec2.prototype.lengthSquare = function() {
    'use strict';
    var pData = this.pData;
    var x = pData[0],y = pData[1];
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

    return pData1[0]*pData2[0] + pData1[1]*pData2[1];
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
    x = pData2[0] - pData1[0];
    y = pData2[1] - pData1[1];

    var flength = Math.sqrt(x*x + y*y);

    if(flength){
        x = x/fLength;
        y = y/fLength;
    }

    pDataDestination[0] = x;
    pDataDestination[1] = y;
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

Vec2.prototype.isEqual = function(v2fVec) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v2fVec.pData;

    if(pData1[0] != pData2[0] || pData1[1] != pData2[1]){
        return false;
    }
    return true;
};

Vec2.prototype.isClear = function() {
    'use strict';
    var pData = this.pData;

    if(pData[0] != 0 || pData[1] != 0){
        return false;
    }
    return true;
};

Vec2.prototype.clear = function() {
    'use strict';
    var pData = this.pData;

    pData[0] = pData[1] = 0;
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
    return '[' + pData[0] + ', ' + pData[1] + ']';
};

/////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////

function Vec3(){
    'use strict';
    var pData = this.pData = new Float32Array(3);

    //без аргументов инициализируется нулями, а
    //массив уже заполнен нулями
    
    if(arguments.length == 1){
        if(typeof(arguments[0]) == "number"){
            pData[0] = pData[1] = pData[2] = arguments[0];
        }
        else if(arguments[0] instanceof Vec3){
            var pData2 = arguments[0].pData;
            pData[0] = pData2[0];
            pData[1] = pData2[1];
            pData[2] = pData2[2];
        }
        else{
            var pElements = arguments[0];
            pData[0] = pElements[0];
            pData[1] = pElements[1];
            pData[2] = pElements[2];
        }
    }
    else if(arguments.length != 0){
        pData[0] = arguments[0];
        pData[1] = arguments[1];
        pData[2] = arguments[2];
    }

    return this;
}

Vec3.prototype.set = function() {
    'use strict';
    var pData = this.pData;
    if(arguments.length == 1){
        if(typeof(arguments[0]) == "number"){
            pData[0] = pData[1] = pData[2] = arguments[0];
        }
        else if(arguments[0] instanceof Vec3){
            var pData2 = arguments[0].pData;
            pData[0] = pData2[0];
            pData[1] = pData2[1];
            pData[2] = pData2[2];
        }
        else{
            var pElements = arguments[0];
            pData[0] = pElements[0];
            pData[1] = pElements[1];
            pData[2] = pElements[2];
        }
    }
    else{
        pData[0] = arguments[0];
        pData[1] = arguments[1];
        pData[2] = arguments[2];
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

    pDataDestination[0] = pData1[0] + pData2[0];
    pDataDestination[1] = pData1[1] + pData2[1];
    pDataDestination[2] = pData1[2] + pData2[2];
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

    pDataDestination[0] = pData1[0] - pData2[0];
    pDataDestination[1] = pData1[1] - pData2[1];
    pDataDestination[2] = pData1[2] - pData2[2];
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

    pDataDestination[0] = -pData[0];
    pDataDestination[1] = -pData[1];
    pDataDestination[2] = -pData[2];
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

    pDataDestination[0] = pData[0] * fScale;
    pDataDestination[1] = pData[1] * fScale;
    pDataDestination[2] = pData[2] * fScale;

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
    x = pData[0];
    y = pData[1];
    z = pData[2];
    var fLength = Math.sqrt(x*x + y*y + z*z);

    if(fLength){
        x = x/fLength;
        y = y/fLength;
        z = z/fLength;
    }

    pDataDestination[0] = x;
    pDataDestination[1] = y;
    pDataDestination[2] = z;

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

Vec3.prototype.isEqual = function(v3fVec) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v3fVec.pData;

    if(    pData1.X != pData2.X 
        || pData1.Y != pData2.Y
        || pData1.Z != pData2.Z){

        return false;
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
};



/////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////

function Vec4(){
    'use strict';
    var pData = this.pData = new Float32Array(4);
    
    //без аргументов инициализируется нулями, а
    //массив уже заполнен нулями

    if(arguments.length == 1){
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
    else if(arguments.length != 0){
        pData.X = arguments.X;
        pData.Y = arguments.Y;
        pData.Z = arguments.Z;
        pData.W = arguments.W;
    }

    return this;
}

Vec4.prototype.set = function() {
    'use strict';
    var pData = this.pData;
    if(arguments.length == 1){
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
    else if(arguments.length != 0){
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

    pData = this.pData;
    pDataDestination = v4fDestination.pData;

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

    pData = this.pData;
    pDataDestination = v4fDestination.pData;

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

    return pData1.X*pData2.X + pData1.Y*pData2.Y + pData1.Z*pData2.Z + pData1.W*pData2.W;
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

Vec4.prototype.isEqual = function(v4fVec) {
    'use strict';
    var pData1 = this.pData;
    var pData2 = v4fVec.pData;

    if(    pData1.X != pData2.X 
        || pData1.Y != pData2.Y
        || pData1.Z != pData2.Z
        || pData1.W != pData2.W){

        return false;
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
};

/////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////

function Mat3(){
    'use strict';
    this.pData = new Float32Array(9);

    var nArgumentsLength = arguments.length;
    if(nArgumentsLength == 1){
        return this.set(arguments[0]);    
    }
    else if(nArgumentsLength == 3){
        return this.set(arguments[0],arguments[1],arguments[2]);    
    }
    else if(nArgumentsLength == 9){
        return this.set(arguments[0],arguments[1],arguments[2],
                        arguments[3],arguments[4],arguments[5],
                        arguments[6],arguments[7],arguments[8]);    
    }
    else{
        return this;
    }
}

/*
 * Mat3.set
 * Copies the values of one Mat3 to another
 *
 * Params:
 * mat - Mat3 containing values to copy
 * dest - Mat3 receiving copied values
 *
 * Returns:
 * dest
 */

Mat3.prototype.set = function() {
    'use strict';
    var pData = this.pData;

    //без аргументов инициализируется нулями, а
    //массив уже заполнен нулями
    
    var nArgumentsLength = arguments.length;
    if(nArgumentsLength == 0){
        pData.a11 = pData.a12 = pData.a13 = 0;
        pData.a21 = pData.a22 = pData.a23 = 0;
        pData.a31 = pData.a32 = pData.a33 = 0;
    }
    if(nArgumentsLength == 1){
        if(typeof(arguments[0]) == "number"){
            var nValue = arguments[0];

            pData.a11 = nValue;
            pData.a12 = 0;
            pData.a13 = 0;

            pData.a21 = 0;
            pData.a22 = nValue;
            pData.a23 = 0;

            pData.a31 = 0;
            pData.a32 = 0;
            pData.a33 = nValue;
        }

        else if(arguments[0] instanceof Mat3){
            var pElements = arguments[0].pData;

            pData.a11 = pElements.a11;
            pData.a12 = pElements.a12;
            pData.a13 = pElements.a13;

            pData.a21 = pElements.a21;
            pData.a22 = pElements.a22;
            pData.a23 = pElements.a23;

            pData.a31 = pElements.a31;
            pData.a32 = pElements.a32;
            pData.a33 = pElements.a33;
        }
        else if(arguments[0] instanceof Vec3){
            var pElements = arguments[0].pData;

            pData.a11 = pElements.X; //диагональ
            pData.a12 = 0;
            pData.a13 = 0;

            pData.a21 = 0;
            pData.a22 = pElements.Y;
            pData.a23 = 0;

            pData.a31 = 0;
            pData.a32 = 0;
            pData.a33 = pElements.Z;
        }
        else{
            var pElements = arguments[0];            

            if(pElements.length == 3){
                //ложим диагональ
                pData.a11 = pElements.X;
                pData.a12 = 0;
                pData.a13 = 0;

                pData.a21 = 0;
                pData.a22 = pElements.Y;
                pData.a23 = 0;

                pData.a31 = 0;
                pData.a32 = 0;
                pData.a33 = pElements.Z;
            }
            else{
                pData.a11 = pElements.a11;
                pData.a12 = pElements.a12;
                pData.a13 = pElements.a13;

                pData.a21 = pElements.a21;
                pData.a22 = pElements.a22;
                pData.a23 = pElements.a23;

                pData.a31 = pElements.a31;
                pData.a32 = pElements.a32;
                pData.a33 = pElements.a33;
            }
        }
    }
    else if(nArgumentsLength == 3){
        if(typeof(arguments[0]) == "number"){
            //выставляем диагональ
            pData.a11 = arguments.X; 
            pData.a12 = 0;
            pData.a13 = 0;

            pData.a21 = 0; 
            pData.a22 = arguments.Y;
            pData.a23 = 0;

            pData.a31 = 0; 
            pData.a32 = 0; 
            pData.a33 = arguments.Z;
        }
        else{
            var pData1,pData2,pData3;
            if(arguments[0] instanceof Vec3){
                pData1 = arguments[0].pData;
                pData2 = arguments[1].pData;
                pData3 = arguments[2].pData;
            }
            else{
                pData1 = arguments[0];
                pData2 = arguments[1];
                pData3 = arguments[2];    
            }

            //ложим по строкам    

            pData.a11 = pData1.X;
            pData.a12 = pData1.Y;
            pData.a13 = pData1.Z;

            pData.a21 = pData2.X;
            pData.a22 = pData2.Y;
            pData.a23 = pData2.Z;

            pData.a31 = pData3.X;
            pData.a32 = pData3.Y;
            pData.a33 = pData3.Z;
        }
    }
    else if(nArgumentsLength == 9){
        //просто числа
        pData.a11 = arguments.a11;
        pData.a12 = arguments.a12;
        pData.a13 = arguments.a13;

        pData.a21 = arguments.a21;
        pData.a22 = arguments.a22;
        pData.a23 = arguments.a23;

        pData.a31 = arguments.a31;
        pData.a32 = arguments.a32;
        pData.a33 = arguments.a33;
    }
    
    return this;
};

/*
 * Mat3.identity
 * Sets a Mat3 to an identity matrix
 *
 * Params:
 * dest - Mat3 to set
 *
 * Returns:
 * yourself
 */

Mat3.prototype.identity = function() {
    'use strict';
    var pData = this.pData;

    pData.a11 = 1;
    pData.a12 = 0;
    pData.a13 = 0;

    pData.a21 = 0;
    pData.a22 = 1;
    pData.a23 = 0;

    pData.a31 = 0;
    pData.a32 = 0;
    pData.a33 = 1;

    return this;
};

/*
 * Mat4.transpose
 * Transposes a Mat3 (flips the values over the diagonal)
 *
 * Params:
 * mat - Mat3 to transpose
 * dest - Optional, Mat3 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */

Mat3.prototype.transpose = function(m3fDestination) {
    'use strict';

    var pData = this.pData;
    if(!m3fDestination){
        //быстрее будет явно обработать оба случая
        var a12 = pData.a12, a13 = pData.a13, a23 = pData.a23;

        pData.a12 = pData.a21;    
        pData.a13 = pData.a31;

        pData.a21 = a12;
        pData.a23 = pData.a32;

        pData.a31 = a13;
        pData.a32 = a23;

        return this;
    }

    var pDataDestination = m3fDestination.pData;

    pDataDestination.a11 = pData.a11;
    pDataDestination.a12 = pData.a21;
    pDataDestination.a13 = pData.a31;

    pDataDestination.a21 = pData.a12;
    pDataDestination.a22 = pData.a22;
    pDataDestination.a23 = pData.a32;

    pDataDestination.a31 = pData.a13;
    pDataDestination.a32 = pData.a23;
    pDataDestination.a33 = pData.a33;

    return m3fDestination;
};

/*
 * Mat3.toMat4
 * Copies the elements of a Mat3 into the upper 3x3 elements of a Mat4
 *
 * Params:
 * mat - Mat3 containing values to copy
 * dest - Optional, Mat4 receiving copied values
 *
 * Returns:
 * dest if specified, a new Mat4 otherwise
 */

Mat3.prototype.toMat4 = function(m4fDestination) {
    'use strict';
    if(!m4fDestination){
        m4fDestination = new Matrix4();
    }

    var pData = this.pData;
    var pDataDestination = m4fDestination.pData;

    pDataDestination._11 = pData.a11;
    pDataDestination._12 = pData.a12;
    pDataDestination._13 = pData.a13;
    pDataDestination._14 = 0;

    pDataDestination._21 = pData.a21;
    pDataDestination._22 = pData.a22;
    pDataDestination._23 = pData.a23;
    pDataDestination._24 = 0;

    pDataDestination._31 = pData.a31;
    pDataDestination._32 = pData.a32;
    pDataDestination._33 = pData.a33;
    pDataDestination._34 = 0;

    pDataDestination._41 = 0;
    pDataDestination._42 = 0;
    pDataDestination._43 = 0;
    pDataDestination._44 = 1;

    return m4fDestination;
};

/**
 * @param Matrix 3x3 or Vec3
 * Если pDestination не определено, то 
 * в случае если подали матрицу результат будет сохранен в текущей матрице, 
 * а если подали вектор, то будет создан новый вектор
 */

Mat3.prototype.multiply = function(pInput, pDestination) {
    'use strict';
    
    var pData1 = this.pData;
    var pData2 = pInput.pData;

    if(pData2.length === 3){
        if(!pDestination){
            pDestination = new Vec3();
        }

        var pDataDestination = pDestination.pData;

        var x = pData2.X, y = pData2.Y, z = pData2.Z;

        pDataDestination.X = pData1.a11 * x + pData1.a12 * y + pData1.a13 * z;
        pDataDestination.Y = pData1.a21 * x + pData1.a22 * y + pData1.a23 * z;
        pDataDestination.Z = pData1.a31 * x + pData1.a32 * y + pData1.a33 * z;
    }
    else{
        if(!pDestination){
            pDestination = this;
        }
        var pDataDestination = pDestination.pData;

        // Cache the matrix values (makes for huge speed increases!)
        var a11 = pData1.a11, a12 = pData1.a12, a13 = pData1.a13;
        var a21 = pData1.a21, a22 = pData1.a22, a23 = pData1.a23;
        var a31 = pData1.a31, a32 = pData1.a32, a33 = pData1.a33;

        var b11 = pData2.a11, b12 = pData2.a12, b13 = pData2.a13;
        var b21 = pData2.a21, b22 = pData2.a22, b23 = pData2.a23;
        var b31 = pData2.a31, b32 = pData2.a32, b33 = pData2.a33;

        pDataDestination.a11 = a11*b11 + a12 * b21 + a13 * b31;
        pDataDestination.a12 = a11*b12 + a12 * b22 + a13 * b32;
        pDataDestination.a13 = a11*b13 + a12 * b23 + a13 * b33;

        pDataDestination.a21 = a21*b11 + a22 * b21 + a23 * b31;
        pDataDestination.a22 = a21*b12 + a22 * b22 + a23 * b32;
        pDataDestination.a23 = a21*b13 + a22 * b23 + a23 * b33;

        pDataDestination.a31 = a31*b11 + a32 * b21 + a33 * b31;
        pDataDestination.a32 = a31*b12 + a32 * b22 + a33 * b32;
        pDataDestination.a33 = a31*b13 + a32 * b23 + a33 * b33;
    }

    return pDestination;
};

/**
 * складывает две матрицы
 */

Mat3.prototype.add = function(m3fMat, m3fDestination) {
    'use strict';
    if(!m3fDestination){
        m3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = m3fMat.pData;
    var pDataDestination = m3fDestination.pData;

    pDataDestination.a11 = pData1.a11 + pData2.a11;
    pDataDestination.a12 = pData1.a12 + pData2.a12;
    pDataDestination.a13 = pData1.a13 + pData2.a13;

    pDataDestination.a21 = pData1.a21 + pData2.a21;
    pDataDestination.a22 = pData1.a22 + pData2.a22;
    pDataDestination.a23 = pData1.a23 + pData2.a23;

    pDataDestination.a31 = pData1.a31 + pData2.a31;
    pDataDestination.a32 = pData1.a32 + pData2.a32;
    pDataDestination.a33 = pData1.a33 + pData2.a33;

    return m3fDestination;
};

/**
 * вычитает две матрицы
 */

Mat3.prototype.subtract = function(m3fMat, m3fDestination) {
    'use strict';
    if(!m3fDestination){
        m3fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = m3fMat.pData;
    var pDataDestination = m3fDestination.pData;

    pDataDestination.a11 = pData1.a11 - pData2.a11;
    pDataDestination.a12 = pData1.a12 - pData2.a12;
    pDataDestination.a13 = pData1.a13 - pData2.a13;

    pDataDestination.a21 = pData1.a21 - pData2.a21;
    pDataDestination.a22 = pData1.a22 - pData2.a22;
    pDataDestination.a23 = pData1.a23 - pData2.a23;

    pDataDestination.a31 = pData1.a31 - pData2.a31;
    pDataDestination.a32 = pData1.a32 - pData2.a32;
    pDataDestination.a33 = pData1.a33 - pData2.a33;

    return m3fDestination;
};

/**
 * вычисляет детерминант матрицы
 * @return {Float} значение детерминанта
 */
Mat3.prototype.determinant = function() {
    'use strict';
    var pData = this.pData;

    var a11 = pData.a11, a12 = pData.a12, a13 = pData.a13;
    var a21 = pData.a21, a22 = pData.a22, a23 = pData.a23;
    var a31 = pData.a31, a32 = pData.a32, a33 = pData.a33;

    return  a11 * (a22 * a33 - a23 * a32) 
            - a12 * (a21 * a33 - a23 * a31) 
            + a13 * (a21 * a32 - a22 * a31);
};

Mat3.prototype.inverse = function(m3fDestination) {
    'use strict';
    if(!m3fDestination){
        m3fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = m3fDestination.pData;

    var a11 = pData.a11, a12 = pData.a12, a13 = pData.a13;
    var a21 = pData.a21, a22 = pData.a22, a23 = pData.a23;
    var a31 = pData.a31, a32 = pData.a32, a33 = pData.a33;

    var A11 = a22 * a33 - a23 * a32;
    var A12 = a21 * a33 - a23 * a31;
    var A13 = a21 * a32 - a22 * a31;

    var A21 = a12 * a33 - a13 * a32;
    var A22 = a11 * a33 - a13 * a31;
    var A23 = a11 * a32 - a12 * a31;

    var A31 = a12 * a23 - a13 * a22;
    var A32 = a11 * a23 - a13 * a21;
    var A33 = a11 * a22 - a12 * a21;

    var fDeterminant = a11*A11 - a12 * A12 + a13 * A13;

    debug_assert(fDeterminant != 0,"обращение матрицы с нулевым детеминантом:\n" 
                                + this.toString());

    var fInverseDeterminant = 1./fDeterminant;

    pDataDestination.a11 = A11 * fInverseDeterminant;
    pDataDestination.a12 = -A21 * fInverseDeterminant;
    pDataDestination.a13 = A31 * fInverseDeterminant;

    pDataDestination.a21 = -A12 * fInverseDeterminant;
    pDataDestination.a22 = A22 * fInverseDeterminant;
    pDataDestination.a23 = -A32 * fInverseDeterminant;

    pDataDestination.a31 = A13 * fInverseDeterminant;
    pDataDestination.a32 = -A23 * fInverseDeterminant;
    pDataDestination.a33 = A33 * fInverseDeterminant;

    return m3fDestination;
};
/*
 * Mat3.toString
 * Returns a string representation of a Mat3
 *
 *
 * Returns:
 * string representation of mat
 */

Mat3.prototype.toString = function() {
    'use strict';
    var pData = this.pData;

    return '[' + pData.a11 + ', ' + pData.a12 + ', ' + pData.a13 + ',\n' +
               + pData.a21 + ', ' + pData.a22 + ', ' + pData.a23 + ',\n' +
               + pData.a31 + ', ' + pData.a32 + ', ' + pData.a33 + ']';
};

Mat3.prototype.isEqual = function(m3fMat,fEps) {
    'use strict';
    
    fEps = ifndef(fEps,0);//позволяет сравнить матрицы с заданой точностью

    var pData1 = this.pData;
    var pData2 = m3fMat.pData;

    if(fEps == 0){
        if(    pData1.a11 != pData2.a11
            || pData1.a12 != pData2.a12
            || pData1.a13 != pData2.a13
            || pData1.a21 != pData2.a21
            || pData1.a22 != pData2.a22
            || pData1.a23 != pData2.a23
            || pData1.a31 != pData2.a31
            || pData1.a32 != pData2.a32
            || pData1.a33 != pData2.a33){

            return false;
        }
    }
    else{
        if(    Math.abs(pData1.a11 - pData2.a11) > fEps
            || Math.abs(pData1.a12 - pData2.a12) > fEps
            || Math.abs(pData1.a13 - pData2.a13) > fEps
            || Math.abs(pData1.a21 - pData2.a21) > fEps
            || Math.abs(pData1.a22 - pData2.a22) > fEps
            || Math.abs(pData1.a23 - pData2.a23) > fEps
            || Math.abs(pData1.a31 - pData2.a31) > fEps
            || Math.abs(pData1.a32 - pData2.a32) > fEps
            || Math.abs(pData1.a33 - pData2.a33) > fEps){

            return false;
        }
    }
    return true;
};

/*
 * Mat4 - 4x4 Matrix
 */

function Mat4(){
    'use strict';
    this.pData = new Float32Array(16);

    var nArgumentsLength = arguments.length;
    if(nArgumentsLength == 1){
        return this.set(arguments[0]);
    }
    else if(nArgumentsLength == 4){
        return this.set(arguments[0],arguments[1],arguments[2],arguments[3]);    
    }
    else if(nArgumentsLength == 16){
        return this.set(arguments[0],arguments[1],arguments[2],arguments[3],
                    arguments[4],arguments[5],arguments[6],arguments[7],
                    arguments[8],arguments[9],arguments[10],arguments[11],
                    arguments[12],arguments[13],arguments[14],arguments[15]);    
    }
    else{
        return this;
    }
}

/*
 * Mat4.set
 * Copies the values of one Mat4 to another
 *
 * Params:
 * mat - Mat4 containing values to copy
 * dest - Mat4 receiving copied values
 *
 * Returns:
 * dest
 */

Mat4.prototype.set = function() {
    //'use strict';//some bugs in chrome
    var pData = this.pData;

    var nArgumentsLength = arguments.length;
    if(nArgumentsLength == 0){
        pData._11 = pData._12 = pData._13 = pData._14 = 0;
        pData._21 = pData._22 = pData._23 = pData._24 = 0;
        pData._31 = pData._32 = pData._33 = pData._34 = 0;
        pData._41 = pData._42 = pData._43 = pData._44 = 0;
    }
    if(nArgumentsLength == 1){
        if(typeof(arguments[0]) == "number"){
            var nValue = arguments[0];
            pData._11 = nValue;
            pData._12 = 0;
            pData._13 = 0;
            pData._14 = 0;

            pData._21 = 0;
            pData._22 = nValue;
            pData._23 = 0;
            pData._24 = 0;

            pData._31 = 0;
            pData._32 = 0;
            pData._33 = nValue;
            pData._34 = 0;

            pData._41 = 0;
            pData._42 = 0;
            pData._43 = 0;
            pData._44 = nValue
        }
        else if(arguments[0] instanceof Mat4){
            var pElements = arguments[0].pData;

            pData._11 = pElements._11;
            pData._12 = pElements._12;
            pData._13 = pElements._13;
            pData._14 = pElements._14;

            pData._21 = pElements._21;
            pData._22 = pElements._22;
            pData._23 = pElements._23;
            pData._24 = pElements._24;

            pData._31 = pElements._31;
            pData._32 = pElements._32;
            pData._33 = pElements._33;
            pData._34 = pElements._34;

            pData._41 = pElements._41;
            pData._42 = pElements._42;
            pData._43 = pElements._43;
            pData._44 = pElements._44;
        }
        else if(arguments[0] instanceof Vec4){
            var pElements = arguments[0].pData;
            //ложим диагональ
            pData._11 = pElements.X;
            pData._12 = 0;
            pData._13 = 0;
            pData._14 = 0;

            pData._21 = 0;
            pData._22 = pElements.Y;
            pData._23 = 0;
            pData._24 = 0;

            pData._31 = 0;
            pData._32 = 0;
            pData._33 = pElements.Z;
            pData._34 = 0;

            pData._41 = 0;
            pData._42 = 0;
            pData._43 = 0;
            pData._44 = pElements.W;    
        }
        else{
            var pElements = arguments[0];

            if(pElements.length == 4){
                //ложим диагональ
                pData._11 = pElements.X;
                pData._12 = 0;
                pData._13 = 0;
                pData._14 = 0;

                pData._21 = 0;
                pData._22 = pElements.Y;
                pData._23 = 0;
                pData._24 = 0;

                pData._31 = 0;
                pData._32 = 0;
                pData._33 = pElements.Z;
                pData._34 = 0;

                pData._41 = 0;
                pData._42 = 0;
                pData._43 = 0;
                pData._44 = pElements.W;
            }
            else{
                pData._11 = pElements._11;
                pData._12 = pElements._12;
                pData._13 = pElements._13;
                pData._14 = pElements._14;

                pData._21 = pElements._21;
                pData._22 = pElements._22;
                pData._23 = pElements._23;
                pData._24 = pElements._24;

                pData._31 = pElements._31;
                pData._32 = pElements._32;
                pData._33 = pElements._33;
                pData._34 = pElements._34;

                pData._41 = pElements._41;
                pData._42 = pElements._42;
                pData._43 = pElements._43;
                pData._44 = pElements._44;
            }
        }
    }
    else if(nArgumentsLength == 4){
        if(typeof(arguments[0]) == "number"){
            //ложим диагональ
            pData._11 = arguments.X;
            pData._12 = 0;
            pData._13 = 0;
            pData._14 = 0;

            pData._21 = 0;
            pData._22 = arguments.Y;
            pData._23 = 0;
            pData._24 = 0;

            pData._31 = 0;
            pData._32 = 0;
            pData._33 = arguments.Z;
            pData._34 = 0;

            pData._41 = 0;
            pData._42 = 0;
            pData._43 = 0;
            pData._44 = arguments.W;
        }
        else{
            var pData1,pData2,pData3,pData4;

            if(arguments[0] instanceof Vec4){
                pData1 = arguments[0].pData;
                pData2 = arguments[1].pData;
                pData3 = arguments[2].pData;
                pData4 = arguments[3].pData;
            }
            else{
                pData1 = arguments[0];
                pData2 = arguments[1];
                pData3 = arguments[2];
                pData4 = arguments[3];
            }

            pData._11 = pData1.X;
            pData._12 = pData1.Y;
            pData._13 = pData1.Z;
            pData._14 = pData1.W;

            pData._21 = pData2.X;
            pData._22 = pData2.Y;
            pData._23 = pData2.Z;
            pData._24 = pData2.W;

            pData._31 = pData3.X;
            pData._32 = pData3.Y;
            pData._33 = pData3.Z;
            pData._34 = pData3.W;

            pData._41 = pData4.X;
            pData._42 = pData4.Y;
            pData._43 = pData4.Z;
            pData._44 = pData4.W;
        }
    }
    else if(nArgumentsLength == 16){
        pData._11 = arguments._11;
        pData._12 = arguments._12;
        pData._13 = arguments._13;
        pData._14 = arguments._14;

        pData._21 = arguments._21;
        pData._22 = arguments._22;
        pData._23 = arguments._23;
        pData._24 = arguments._24;

        pData._31 = arguments._31;
        pData._32 = arguments._32;
        pData._33 = arguments._33;
        pData._34 = arguments._34;

        pData._41 = arguments._41;
        pData._42 = arguments._42;
        pData._43 = arguments._43;
        pData._44 = arguments._44;
    }

    return this;
};

/*
 * Mat4.identity
 * Sets a Mat4 to an identity matrix
 *
 * Params:
 * dest - Mat4 to set
 *
 * Returns:
 * dest
 */

Mat4.prototype.identity = function() {
    'use strict';
    var pData = this.pData;

    pData._11 = 1;
    pData._12 = 0;
    pData._13 = 0;
    pData._14 = 0;

    pData._21 = 0;
    pData._22 = 1;
    pData._23 = 0;
    pData._24 = 0;

    pData._21 = 0;
    pData._22 = 0;
    pData._23 = 1;
    pData._24 = 0;

    pData._21 = 0;
    pData._22 = 0;
    pData._23 = 0;
    pData._24 = 1;

    return this;
};

/*
 * Mat4.transpose
 * Transposes a Mat4 (flips the values over the diagonal)
 *
 * Params:
 * mat - Mat4 to transpose
 * dest - Optional, Mat4 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */

Mat4.prototype.transpose = function(m4fDestination) {
    'use strict';
    
    var pData = this.pData;

    if(!m4fDestination){
        var a12 = pData._12, a13 = pData._13, a14 = pData._14;
        var a23 = pData._23, a24 = pData._24;
        var a34 = pData._34;

        pData._12 = pData._21;
        pData._13 = pData._31;
        pData._14 = pData._41;

        pData._21 = a12;
        pData._23 = pData._32;
        pData._24 = pData._42;

        pData._31 = a13;
        pData._32 = a23;
        pData._34 = pData._43;

        pData._41 = a14;
        pData._42 = a24;
        pData._43 = a34;

        return this;
    }

    var pDataDestination = m4fDestination.pData;

    pDataDestination._11 = pData._11;
    pDataDestination._12 = pData._21;
    pDataDestination._13 = pData._31;
    pDataDestination._14 = pData._41;

    pDataDestination._21 = pData._12;
    pDataDestination._22 = pData._22;
    pDataDestination._23 = pData._32;
    pDataDestination._24 = pData._42;

    pDataDestination._31 = pData._13;
    pDataDestination._32 = pData._23;
    pDataDestination._33 = pData._33;
    pDataDestination._34 = pData._43;

    pDataDestination._41 = pData._14;
    pDataDestination._42 = pData._24;
    pDataDestination._43 = pData._34;
    pDataDestination._44 = pData._44;

    return m4fDestination;
};

/*
 * Mat4.determinant
 * Calculates the determinant of a Mat4
 *
 * Params:
 * mat - Mat4 to calculate determinant of
 *
 * Returns:
 * determinant of mat
 */

Mat4.prototype.determinant = function() {
    'use strict';
    // Cache the matrix values (makes for huge speed increases!)
    // 
    var pData = this.pData; 
    var a11 = pData._11, a12 = pData._12, a13 = pData._13, a14 = pData._14;
    var a21 = pData._21, a22 = pData._22, a23 = pData._23, a24 = pData._24;
    var a31 = pData._31, a32 = pData._32, a33 = pData._33, a34 = pData._34;
    var a41 = pData._41, a42 = pData._42, a43 = pData._43, a44 = pData._44;

    return  a41 * a32 * a23 * a14 - a31 * a42 * a23 * a14 - a41 * a22 * a33 * a14 + a21 * a42 * a33 * a14 +
        a31 * a22 * a43 * a14 - a21 * a32 * a43 * a14 - a41 * a32 * a13 * a24 + a31 * a42 * a13 * a24 +
        a41 * a12 * a33 * a24 - a11 * a42 * a33 * a24 - a31 * a12 * a43 * a24 + a11 * a32 * a43 * a24 +
        a41 * a22 * a13 * a34 - a21 * a42 * a13 * a34 - a41 * a12 * a23 * a34 + a11 * a42 * a23 * a34 +
        a21 * a12 * a43 * a34 - a11 * a22 * a43 * a34 - a31 * a22 * a13 * a44 + a21 * a32 * a13 * a44 +
        a31 * a12 * a23 * a44 - a11 * a32 * a23 * a44 - a21 * a12 * a33 * a44 + a11 * a22 * a33 * a44;
};

/*
 * Mat4.inverse
 * Calculates the inverse matrix of a Mat4
 *
 * Params:
 * mat - Mat4 to calculate inverse of
 * dest - Optional, Mat4 receiving inverse matrix. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */

Mat4.prototype.inverse = function(m4fDestination) {
    'use strict';
    if(!m4fDestination){
        m4fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = m4fDestination.pData;

    // Cache the matrix values (makes for huge speed increases!)
    var a11 = pData._11, a12 = pData._12, a13 = pData._13, a14 = pData._14;
    var a21 = pData._21, a22 = pData._22, a23 = pData._23, a24 = pData._24;
    var a31 = pData._31, a32 = pData._32, a33 = pData._33, a34 = pData._34;
    var a41 = pData._41, a42 = pData._42, a43 = pData._43, a44 = pData._44;

    var b00 = a11 * a22 - a12 * a21;
    var b01 = a11 * a23 - a13 * a21;
    var b02 = a11 * a24 - a14 * a21;
    var b03 = a12 * a23 - a13 * a22;
    var b04 = a12 * a24 - a14 * a22;
    var b05 = a13 * a24 - a14 * a23;
    var b06 = a31 * a42 - a32 * a41;
    var b07 = a31 * a43 - a33 * a41;
    var b08 = a31 * a44 - a34 * a41;
    var b09 = a32 * a43 - a33 * a42;
    var b10 = a32 * a44 - a34 * a42;
    var b11 = a33 * a44 - a34 * a43;

    var fDeterminant = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    debug_assert(fDeterminant != 0,"обращение матрицы с нулевым детеминантом:\n" 
                                + this.toString());

    var fInverseDeterminant = 1/fDeterminant;

    pDataDestination._11 = (a22 * b11 - a23 * b10 + a24 * b09) * fInverseDeterminant;
    pDataDestination._12 = (-a12 * b11 + a13 * b10 - a14 * b09) * fInverseDeterminant;
    pDataDestination._13 = (a42 * b05 - a43 * b04 + a44 * b03) * fInverseDeterminant;
    pDataDestination._14 = (-a32 * b05 + a33 * b04 - a34 * b03) * fInverseDeterminant;

    pDataDestination._21 = (-a21 * b11 + a23 * b08 - a24 * b07) * fInverseDeterminant;
    pDataDestination._22 = (a11 * b11 - a13 * b08 + a14 * b07) * fInverseDeterminant;
    pDataDestination._23 = (-a41 * b05 + a43 * b02 - a44 * b01) * fInverseDeterminant;
    pDataDestination._24 = (a31 * b05 - a33 * b02 + a34 * b01) * fInverseDeterminant;

    pDataDestination._31 = (a21 * b10 - a22 * b08 + a24 * b06) * fInverseDeterminant;
    pDataDestination._32 = (-a11 * b10 + a12 * b08 - a14 * b06) * fInverseDeterminant;
    pDataDestination._33 = (a41 * b04 - a42 * b02 + a44 * b00) * fInverseDeterminant;
    pDataDestination._34 = (-a31 * b04 + a32 * b02 - a34 * b00) * fInverseDeterminant;

    pDataDestination._41 = (-a21 * b09 + a22 * b07 - a23 * b06) * fInverseDeterminant;
    pDataDestination._42 = (a11 * b09 - a12 * b07 + a13 * b06) * fInverseDeterminant;
    pDataDestination._43 = (-a41 * b03 + a42 * b01 - a43 * b00) * fInverseDeterminant;
    pDataDestination._44 = (a31 * b03 - a32 * b01 + a33 * b00) * fInverseDeterminant;

    return m4fDestination;
};

/**
 * pInput - Vec3, Vec4, Mat4
 * pDestination - respectivetly
 * если pDestination не подано, то 
 * если происходит умножение на матрицу, то умножается сама матрица, а
 * для векторов создаются новые
 */

Mat4.prototype.multiply = function(pInput,pDestination) {
    'use strict';
    
    var pData1 = this.pData;
    var pData2 = pInput.pData;

    if(pData2.length == 3){
        //матрица поворота умножается на вектор (блок 3x3)
        if(!pDestination){
            pDestination = new Vec3();
        }
        var pDataDestination = pDestination.pData;

        var x = pData2.X, y = pData2.Y, z = pData2.Z;

        pDataDestination.X = pData1._11 * x + pData1._12 *y + pData1._13 * z;
        pDataDestination.Y = pData1._21 * x + pData1._22 *y + pData1._23 * z;
        pDataDestination.Z = pData1._31 * x + pData1._32 *y + pData1._33 * z;
    }
    else if(pData2.length == 4){
        //матрица умножается на вектор
        if(!pDestination){
            pDestination = new Vec4();
        }
        var pDataDestination = pDestination.pData;

        var x = pData2.X, y = pData2.Y, z = pData2.Z, w = pData2.W;

        pDataDestination.X = pData1._11 * x + pData1._12 * y + pData1._13 * z + pData1._14 * w;
        pDataDestination.Y = pData1._21 * x + pData1._22 * y + pData1._23 * z + pData1._24 * w;
        pDataDestination.Z = pData1._31 * x + pData1._32 * y + pData1._33 * z + pData1._34 * w;
        pDataDestination.W = pData1._41 * x + pData1._42 * y + pData1._43 * z + pData1._44 * w;
    }
    else{
        //перемножаем две матрицы
        if(!pDestination){
            pDestination = this;
        }
        var pDataDestination = pDestination.pData;

        //кешируем значения матриц для ускорения
        
        var a11 = pData1._11, a12 = pData1._12, a13 = pData1._13, a14 = pData1._14;        
        var a21 = pData1._21, a22 = pData1._22, a23 = pData1._23, a24 = pData1._24;
        var a31 = pData1._31, a32 = pData1._32, a33 = pData1._33, a34 = pData1._34;
        var a41 = pData1._41, a42 = pData1._42, a43 = pData1._43, a44 = pData1._44;

        var b11 = pData2._11, b12 = pData2._12, b13 = pData2._13, b14 = pData2._14;        
        var b21 = pData2._21, b22 = pData2._22, b23 = pData2._23, b24 = pData2._24;
        var b31 = pData2._31, b32 = pData2._32, b33 = pData2._33, b34 = pData2._34;
        var b41 = pData2._41, b42 = pData2._42, b43 = pData2._43, b44 = pData2._44;

        pDataDestination._11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        pDataDestination._12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        pDataDestination._13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        pDataDestination._14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        pDataDestination._21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        pDataDestination._22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        pDataDestination._23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        pDataDestination._24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        pDataDestination._31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        pDataDestination._32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        pDataDestination._33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        pDataDestination._34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        pDataDestination._41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        pDataDestination._42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        pDataDestination._43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        pDataDestination._44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    }

    return pDestination;
};

Mat4.prototype.toString = function() {
    'use strict';
    var pData = this.pData;

    return '['  + pData._11 + ", " + pData._12 + ', ' + pData._13 + ', ' + pData._14 + ',\n' 
                + pData._21 + ", " + pData._22 + ', ' + pData._23 + ', ' + pData._24 + ',\n'
                + pData._31 + ", " + pData._32 + ', ' + pData._33 + ', ' + pData._34 + ',\n'
                + pData._41 + ", " + pData._42 + ', ' + pData._43 + ', ' + pData._44 + ']';
};

Mat4.prototype.isEqual = function(m4fMat,fEps) {
    'use strict';

    fEps = ifndef(fEps,0);

    var pData1 = this.pData;
    var pData2 = m4fMat.pData;

    if(fEps == 0){
        if(    pData1._11 != pData2._11 
            || pData1._12 != pData2._12
            || pData1._13 != pData2._13
            || pData1._14 != pData2._14
            || pData1._21 != pData2._21 
            || pData1._22 != pData2._22
            || pData1._23 != pData2._23
            || pData1._24 != pData2._24
            || pData1._31 != pData2._31 
            || pData1._32 != pData2._32
            || pData1._33 != pData2._33
            || pData1._34 != pData2._34
            || pData1._41 != pData2._41 
            || pData1._42 != pData2._42
            || pData1._43 != pData2._43
            || pData1._44 != pData2._44){

            return false;
        }
    }
    else{
        if(    Math.abs(pData1._11 - pData2._11) > fEps
            || Math.abs(pData1._12 - pData2._12) > fEps
            || Math.abs(pData1._13 - pData2._13) > fEps
            || Math.abs(pData1._14 - pData2._14) > fEps
            || Math.abs(pData1._21 - pData2._21) > fEps
            || Math.abs(pData1._22 - pData2._22) > fEps
            || Math.abs(pData1._23 - pData2._23) > fEps
            || Math.abs(pData1._24 - pData2._24) > fEps
            || Math.abs(pData1._31 - pData2._31) > fEps
            || Math.abs(pData1._32 - pData2._32) > fEps
            || Math.abs(pData1._33 - pData2._33) > fEps
            || Math.abs(pData1._34 - pData2._34) > fEps
            || Math.abs(pData1._41 - pData2._41) > fEps
            || Math.abs(pData1._42 - pData2._42) > fEps
            || Math.abs(pData1._43 - pData2._43) > fEps
            || Math.abs(pData1._44 - pData2._44) > fEps){

            return false;
        }
    }
    return true;
};

/*
 * Mat4.toRotationMat
 * Copies the upper 3x3 elements of a Mat4 into another Mat4
 *
 * Params:
 * mat - Mat4 containing values to copy
 * dest - Optional, Mat4 receiving copied values
 *
 * Returns:
 * dest is specified, a new Mat4 otherwise
 */

Mat4.prototype.toRotationMatrix = function(m4fDestination) {
    'use strict';
    if(!m4fDestination){
        m4fDestination = new Mat4();
    }

    var pData = this.pData;
    var pDataDestination = m4fDestination.pData;

    pDataDestination._11 = pData._11;
    pDataDestination._12 = pData._12;
    pDataDestination._13 = pData._13;
    pDataDestination._14 = 0;

    pDataDestination._21 = pData._21;
    pDataDestination._22 = pData._22;
    pDataDestination._23 = pData._23;
    pDataDestination._24 = 0;

    pDataDestination._31 = pData._31;
    pDataDestination._32 = pData._32;
    pDataDestination._33 = pData._33;
    pDataDestination._34 = 0;

    pDataDestination._41 = 0;
    pDataDestination._42 = 0;
    pDataDestination._43 = 0;
    pDataDestination._44 = 1;

    return pDataDestination;
};

/*
 * Mat4.toMat3
 * Copies the upper 3x3 elements of a Mat4 into a Mat3
 *
 * Params:
 * mat - Mat4 containing values to copy
 * dest - Optional, Mat3 receiving copied values
 *
 * Returns:
 * dest is specified, a new Mat3 otherwise
 */

Mat4.prototype.toMat3 = function(m3fDestination) {
    'use strict';
    if(!m3fDestination){
        m3fDestination = new Mat3();
    }

    var pData = this.pData;
    var pDataDestination = m3fDestination.pData;

    pDataDestination.a11 = pData._11;
    pDataDestination.a12 = pData._12;
    pDataDestination.a13 = pData._13;

    pDataDestination.a21 = pData._21;
    pDataDestination.a22 = pData._22;
    pDataDestination.a23 = pData._23;

    pDataDestination.a31 = pData._31;
    pDataDestination.a32 = pData._32;
    pDataDestination.a33 = pData._33;

    return m3fDestination;
};


Mat4._pNxt = [1, 2, 0];
Mat4.toQuat4 = function (m, quat) {
    if (!quat) {
        quat = Quat4.create();
    }

    var  tr, s, q = quat;
    var    i, j, k;

    var nxt = Mat4._pNxt;

    tr = m._11 + m._22 + m._33;

    /* check the diagonal */
    if (tr > 0.0) {
        s = Math.sqrt(tr + 1.0);
        q.W = s / 2.0;
        s = 0.5 / s;
        
        q.X = (m._23 - m._32) * s;
        q.Y = (m._31 - m._13) * s;
        q.Z = (m._12 - m._21) * s;
    } 
    else {                
        /* diagonal is negative */
        i = 0;
        if (m._22 > m._11) i = 1;
        if (m._33 > m[i * 4 + i]) i = 2;
        j = nxt[i];
        k = nxt[j];

        s = Math.sqrt((m[i * 4 + i] - (m[j * 4 + j] + m[k * 4 + k])) + 1.0);
                          
        q[i] = s * 0.5;
                                
        if (s != 0.0) s = 0.5 / s;

        q[3] = (m[k * 4 + j] - m[j * 4 + k]) * s;
        q[j] = (m[j * 4 + i] + m[i * 4 + j]) * s;
        q[k] = (m[k * 4 + i] + m[i * 4 + k]) * s;
    }

    return q;
}

Mat3.toQuat4 = Mat4.toQuat4;

/*
 * Mat4.toInverseMat3
 * Calculates the inverse of the upper 3x3 elements of a Mat4 and copies the result into a Mat3
 * The resulting matrix is useful for calculating transformed normals
 *
 * Params:
 * mat - Mat4 containing values to invert and copy
 * dest - Optional, Mat3 receiving values
 *
 * Returns:
 * dest is specified, a new Mat3 otherwise
 */
Mat4.toInverseMat3 = function (mat, dest) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10];

    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    var d = a00 * b01 + a01 * b11 + a02 * b21;
    if (!d) {return null;}
    var id = 1 / d;

    if (!dest) {dest = Mat3.create();}

    dest[0] = b01 * id;
    dest[1] = (-a22 * a01 + a02 * a21) * id;
    dest[2] = (a12 * a01 - a02 * a11) * id;
    dest[3] = b11 * id;
    dest[4] = (a22 * a00 - a02 * a20) * id;
    dest[5] = (-a12 * a00 + a02 * a10) * id;
    dest[6] = b21 * id;
    dest[7] = (-a21 * a00 + a01 * a20) * id;
    dest[8] = (a11 * a00 - a01 * a10) * id;

    return dest;
};

/*
 * Mat4.translate
 * Translates a matrix by the given vector
 *
 * Params:
 * mat - Mat4 to translate
 * vec - Vec3 specifying the translation
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.translate = function (mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2];

    if (!dest || mat == dest) {
        mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
        mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
        mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
        mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
        return mat;
    }

    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

    dest[0] = a00;
    dest[1] = a01;
    dest[2] = a02;
    dest[3] = a03;
    dest[4] = a10;
    dest[5] = a11;
    dest[6] = a12;
    dest[7] = a13;
    dest[8] = a20;
    dest[9] = a21;
    dest[10] = a22;
    dest[11] = a23;

    dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
    dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
    dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
    dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
    return dest;
};

Mat4.diagonal = function (mat, vec, dest) {
    if (!dest) {
        dest = mat;
    }

    dest._11 = vec.X;
    dest._22 = vec.Y;
    dest._33 = vec.Z;
    dest._44 = vec.W;

    if (mat !== dest) {
        dest._12 = mat._12; dest._13 = mat._13; dest._14 = mat._14;
        dest._21 = mat._21; dest._23 = mat._23; dest._24 = mat._24;
        dest._31 = mat._31; dest._32 = mat._32; dest._34 = mat._34;
        dest._41 = mat._41; dest._42 = mat._42; dest._43 = mat._43;
    }

    return dest;
};



/*
 * Mat4.scale
 * Scales a matrix by the given vector
 *
 * Params:
 * mat - Mat4 to scale
 * vec - Vec3 specifying the scale for each axis
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.scale = function (mat, vec, dest) {
    var x = vec[0], y = vec[1], z = vec[2];

    if (!dest || mat == dest) {
        mat[0] *= x;
        mat[1] *= x;
        mat[2] *= x;
        mat[3] *= x;
        mat[4] *= y;
        mat[5] *= y;
        mat[6] *= y;
        mat[7] *= y;
        mat[8] *= z;
        mat[9] *= z;
        mat[10] *= z;
        mat[11] *= z;
        return mat;
    }

    dest[0] = mat[0] * x;
    dest[1] = mat[1] * x;
    dest[2] = mat[2] * x;
    dest[3] = mat[3] * x;
    dest[4] = mat[4] * y;
    dest[5] = mat[5] * y;
    dest[6] = mat[6] * y;
    dest[7] = mat[7] * y;
    dest[8] = mat[8] * z;
    dest[9] = mat[9] * z;
    dest[10] = mat[10] * z;
    dest[11] = mat[11] * z;
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
};

/*
 * Mat4.rotate
 * Rotates a matrix by the given angle around the specified axis
 * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
 *
 * Params:
 * mat - Mat4 to rotate
 * angle - angle (in radians) to rotate
 * axis - Vec3 representing the axis to rotate around 
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.rotate = function (mat, angle, axis, dest) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.sqrt(x * x + y * y + z * z);
    if (!len) {return null;}
    if (len != 1) {
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
    }

    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1 - c;

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

    // Construct the elements of the rotation matrix
    var b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
    var b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
    var b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

    if (!dest) {
        dest = mat
    } else if (mat != dest) { // If the source and destination differ, copy the unchanged last row
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform rotation-specific matrix multiplication
    dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
    dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
    dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
    dest[3] = a03 * b00 + a13 * b01 + a23 * b02;

    dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
    dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
    dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
    dest[7] = a03 * b10 + a13 * b11 + a23 * b12;

    dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
    dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
    dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
    dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return dest;
};

/*
 * Mat4.rotateX
 * Rotates a matrix by the given angle around the X axis
 *
 * Params:
 * mat - Mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.rotateX = function (mat, angle, dest) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    // Cache the matrix values (makes for huge speed increases!)
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

    if (!dest) {
        dest = mat
    } else if (mat != dest) { // If the source and destination differ, copy the unchanged rows
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];

        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform axis-specific matrix multiplication
    dest[4] = a10 * c + a20 * s;
    dest[5] = a11 * c + a21 * s;
    dest[6] = a12 * c + a22 * s;
    dest[7] = a13 * c + a23 * s;

    dest[8] = a10 * -s + a20 * c;
    dest[9] = a11 * -s + a21 * c;
    dest[10] = a12 * -s + a22 * c;
    dest[11] = a13 * -s + a23 * c;
    return dest;
};

/*
 * Mat4.rotateY
 * Rotates a matrix by the given angle around the Y axis
 *
 * Params:
 * mat - Mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.rotateY = function (mat, angle, dest) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

    if (!dest) {
        dest = mat
    } else if (mat != dest) { // If the source and destination differ, copy the unchanged rows
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];

        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a20 * -s;
    dest[1] = a01 * c + a21 * -s;
    dest[2] = a02 * c + a22 * -s;
    dest[3] = a03 * c + a23 * -s;

    dest[8] = a00 * s + a20 * c;
    dest[9] = a01 * s + a21 * c;
    dest[10] = a02 * s + a22 * c;
    dest[11] = a03 * s + a23 * c;
    return dest;
};

/*
 * Mat4.rotateZ
 * Rotates a matrix by the given angle around the Z axis
 *
 * Params:
 * mat - Mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.rotateZ = function (mat, angle, dest) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];

    if (!dest) {
        dest = mat
    } else if (mat != dest) { // If the source and destination differ, copy the unchanged last row
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];

        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    // Perform axis-specific matrix multiplication
    dest[0] = a00 * c + a10 * s;
    dest[1] = a01 * c + a11 * s;
    dest[2] = a02 * c + a12 * s;
    dest[3] = a03 * c + a13 * s;

    dest[4] = a00 * -s + a10 * c;
    dest[5] = a01 * -s + a11 * c;
    dest[6] = a02 * -s + a12 * c;
    dest[7] = a03 * -s + a13 * c;

    return dest;
};

/*
 * Mat4.frustum
 * Generates a frustum matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, Mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new Mat4 otherwise
 */
Mat4.frustum = function (left, right, bottom, top, near, far, dest) {
    if (!dest) {dest = Mat4.create();}
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    dest[0] = (near * 2) / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = (near * 2) / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = (right + left) / rl;
    dest[9] = (top + bottom) / tb;
    dest[10] = -(far + near) / fn;
    dest[11] = -1;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = -(far * near * 2) / fn;
    dest[15] = 0;
    return dest;
};

/*
 * Mat4.perspective
 * Generates a perspective projection matrix with the given bounds
 *
 * Params:
 * fovy - scalar, vertical field of view
 * aspect - scalar, aspect ratio. typically viewport width/height
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, Mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new Mat4 otherwise
 */
Mat4.perspective = function (fovy, aspect, near, far, dest) {
    var top = near * Math.tan(fovy * Math.PI / 360.0);
    var right = top * aspect;
    return Mat4.frustum(-right, right, -top, top, near, far, dest);
};

/*
 * Mat4.ortho
 * Generates a orthogonal projection matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, Mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new Mat4 otherwise
 */
Mat4.ortho = function (left, right, bottom, top, near, far, dest) {
    if (!dest) {dest = Mat4.create();}
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    dest[0] = 2 / rl;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 2 / tb;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = -2 / fn;
    dest[11] = 0;
    dest[12] = -(left + right) / rl;
    dest[13] = -(top + bottom) / tb;
    dest[14] = -(far + near) / fn;
    dest[15] = 1;
    return dest;
};

/*
 * Mat4.ortho
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * Params:
 * eye - Vec3, position of the viewer
 * center - Vec3, point the viewer is looking at
 * up - Vec3 pointing "up"
 * dest - Optional, Mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new Mat4 otherwise
 */
Mat4.lookAt = function (eye, center, up, dest) {
    if (!dest) {dest = Mat4.create();}

    var eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (eyex == centerx && eyey == centery && eyez == centerz) {
        return Mat4.identity(dest);
    }

    var z0, z1, z2, x0, x1, x2, y0, y1, y2, len;

    //Vec3.direction(eye, center, z);
    z0 = eyex - center[0];
    z1 = eyey - center[1];
    z2 = eyez - center[2];

    // normalize (no check needed for 0 because of early return)
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    //Vec3.normalize(Vec3.cross(up, z, x));
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    }
    else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    ;

    //Vec3.normalize(Vec3.cross(z, x, y));
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    }
    else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    dest[0] = x0;
    dest[1] = y0;
    dest[2] = z0;
    dest[3] = 0;
    dest[4] = x1;
    dest[5] = y1;
    dest[6] = z1;
    dest[7] = 0;
    dest[8] = x2;
    dest[9] = y2;
    dest[10] = z2;
    dest[11] = 0;
    dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    dest[15] = 1;

    return dest;
};

Mat4.row = function (mat, n) {
    switch (n) {
        case 1:
            return Vec4.create([mat._11, mat._12, mat._13, mat._14]);
        case 2:
            return Vec4.create([mat._21, mat._22, mat._23, mat._24]);
        case 3:
            return Vec4.create([mat._31, mat._32, mat._33, mat._34]);
        case 4:
            return Vec4.create([mat._41, mat._42, mat._43, mat._44]);
    }
    ;
}

/*
 * Mat4.str
 * Returns a string representation of a Mat4
 *
 * Params:
 * mat - Mat4 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
Mat4.str = function (mat) {
    return '[\n' + mat[0].toFixed(4) + ', ' + mat[1].toFixed(4) + ', ' + mat[2].toFixed(4) + ', ' + mat[3].toFixed(4) + 
        ', ' + '\n' + mat[4].toFixed(4) + ', ' + mat[5].toFixed(4) + ', ' + mat[6].toFixed(4) + ', ' + mat[7].toFixed(4) + 
        ', ' + '\n' + mat[8].toFixed(4) + ', ' + mat[9].toFixed(4) + ', ' + mat[10].toFixed(4) + ', ' + mat[11].toFixed(4) + 
        ', ' + '\n' + mat[12].toFixed(4) + ', ' + mat[13].toFixed(4) + ', ' + mat[14].toFixed(4) + ', ' + mat[15].toFixed(4) + '\n' +
        ']';
};

Mat4.shaderStr = function (mat) {
    return '[\n' + mat[0].toFixed(4) + ', ' + mat[4].toFixed(4) + ', ' + mat[8].toFixed(4) + ', ' + mat[12].toFixed(4) + 
        ', ' + '\n' + mat[1].toFixed(4) + ', ' + mat[5].toFixed(4) + ', ' + mat[9].toFixed(4) + ', ' + mat[13].toFixed(4) + 
        ', ' + '\n' + mat[2].toFixed(4) + ', ' + mat[6].toFixed(4) + ', ' + mat[10].toFixed(4) + ', ' + mat[14].toFixed(4) + 
        ', ' + '\n' + mat[3].toFixed(4) + ', ' + mat[7].toFixed(4) + ', ' + mat[11].toFixed(4) + ', ' + mat[15].toFixed(4) + '\n' +
        ']';
};


/*
 * Quat4 - Quaternions 
 */
Quat4 = {};

/*
 * Quat4.create
 * Creates a new instance of a Quat4 using the default array type
 * Any javascript array containing at least 4 numeric elements can serve as a Quat4
 *
 * Params:
 * quat - Optional, Quat4 containing values to initialize with
 *
 * Returns:
 * New Quat4
 */
Quat4.create = function (quat) {
    var dest = new glMatrixArrayType(4);

    if (quat) {
        dest[0] = quat[0];
        dest[1] = quat[1];
        dest[2] = quat[2];
        dest[3] = quat[3];
    }

    return dest;
};

/*
 * Quat4.set
 * Copies the values of one Quat4 to another
 *
 * Params:
 * quat - Quat4 containing values to copy
 * dest - Quat4 receiving copied values
 *
 * Returns:
 * dest
 */
Quat4.set = function (quat, dest) {
    dest[0] = quat[0];
    dest[1] = quat[1];
    dest[2] = quat[2];
    dest[3] = quat[3];

    return dest;
};


/*
 * Quat4.calculateW
 * Calculates the W component of a Quat4 from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length. 
 * Any existing W component will be ignored. 
 *
 * Params:
 * quat - Quat4 to calculate W component of
 * dest - Optional, Quat4 receiving calculated values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
Quat4.calculateW = function (quat, dest) {
    var x = quat[0], y = quat[1], z = quat[2];

    if (!dest || quat == dest) {
        quat[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
        return quat;
    }
    dest[0] = x;
    dest[1] = y;
    dest[2] = z;
    dest[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return dest;
}

/*
 * Quat4.inverse
 * Calculates the inverse of a Quat4
 *
 * Params:
 * quat - Quat4 to calculate inverse of
 * dest - Optional, Quat4 receiving inverse values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
Quat4.inverse = function (quat, dest) {
    if (!dest || quat == dest) {
        quat[0] *= -1;
        quat[1] *= -1;
        quat[2] *= -1;
        return quat;
    }
    dest[0] = -quat[0];
    dest[1] = -quat[1];
    dest[2] = -quat[2];
    dest[3] = quat[3];
    return dest;
}



/*
 * Quat4.length
 * Calculates the length of a Quat4
 *
 * Params:
 * quat - Quat4 to calculate length of
 *
 * Returns:
 * Length of quat
 */
Quat4.length = function (quat) {
    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
}

/*
 * Quat4.normalize
 * Generates a unit quaternion of the same direction as the provided Quat4
 * If quaternion length is 0, returns [0, 0, 0, 0]
 *
 * Params:
 * quat - Quat4 to normalize
 * dest - Optional, Quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
Quat4.normalize = function (quat, dest) {
    if (!dest) {dest = quat;}

    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
    var len = Math.sqrt(x * x + y * y + z * z + w * w);
    if (len == 0) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        return dest;
    }
    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    dest[3] = w * len;

    return dest;
}

/*
 * Quat4.multiply
 * Performs a quaternion multiplication
 *
 * Params:
 * quat - Quat4, first operand
 * quat2 - Quat4, second operand
 * dest - Optional, Quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
Quat4.multiply = function (quat, quat2, dest) {
    if (!dest) {dest = quat;}

    var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3];
    var qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];

    dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    return dest;
}

Quat4.mult = Quat4.multiply;

/*
 * Quat4.multiplyVec3
 * Transforms a Vec3 with the given quaternion
 *
 * Params:
 * quat - Quat4 to transform the vector with
 * vec - Vec3 to transform
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
/*Quat4.multiplyVec3 = function (quat, vec, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0], y = vec[1], z = vec[2];
    var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];

    // calculate quat * vec
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return dest;
}*/

Quat4._qTemp1 = new Quaternion();
Quat4._qTemp2 = new Quaternion();
Quat4._qTemp3 = new Quaternion();

Quat4.multiplyVec3 = function (quaternion, vector) {
    var vectorQuaternion = Quat4._qTemp1, 
        inverseQuaternion = Quat4._qTemp2, 
        resultQuaternion = Quat4._qTemp3;
  
    vectorQuaternion.X = vector.X;
    vectorQuaternion.Y = vector.Y;
    vectorQuaternion.Z = vector.Z;
    vectorQuaternion.W = 0.0;

    Quat4.inverse(quaternion, inverseQuaternion);
    
    Quat4.multiply(inverseQuaternion, vectorQuaternion, resultQuaternion);
    Quat4.multiply(resultQuaternion, quaternion, resultQuaternion);

    vector.X = resultQuaternion.X;
    vector.Y = resultQuaternion.Y;
    vector.Z = resultQuaternion.Z;

    return vector;
};

Quat4._v3fTemp = Vec3.create();
Quat4._m3fTemp = Mat3.create();

Quat4.fromForwardUp = function (v3fForwardm, v3fUp, quat) {
    if (!quat) {
        quat = Quat4.create();
    }

    var v3fTemp = Quat4._v3fTemp;
    var m3fTemp = Quat4._m3fTemp;

    Vec3.cross(v3fUp, v3fForward, v3fTemp);

    m3fTemp._11 = v3fTemp.X;
    m3fTemp._21 = v3fTemp.Y;
    m3fTemp._31 = v3fTemp.Z;
    m3fTemp._12 = v3fUp.X;
    m3fTemp._22 = v3fUp.Y;
    m3fTemp._32 = v3fUp.Z;
    m3fTemp._13 = v3fForward.X;
    m3fTemp._23 = v3fForward.Y;
    m3fTemp._33 = v3fForward.Z;

    return Mat3.toQuat4(m3fTemp, quat);
}

Quat4.fromAxisAngle = function (axis, angle, quat) {
    if (!quat) {
        quat = Quat4.create();
    }

    quat.X = axis.X * Math.sin(angle / 2.);
    quat.Y = axis.Y * Math.sin(angle / 2.);
    quat.Z = axis.Z * Math.sin(angle / 2.);
    quat.W = Math.cos(angle / 2.);

    return quat;
};

Quat4._qX= new Quaternion();
Quat4._qY = new Quaternion();
Quat4._qZ = new Quaternion();

Quat4.fromYPR = function (fYaw, fPitch, fRoll, quat) {
    if (!quat) {
        quat = Quat4.create();
    }

    var fX = fPitch;
    var fY = fYaw;
    var fZ = fRoll;

    var Qx = Quat4._qX, 
        Qy = Quat4._qY, 
        Qz = Quat4._qZ;

    Quaternion(Qx, Math.cos(fX/2), Math.sin(fX/2), 0, 0);
    Quaternion(Qy, Math.cos(fY/2), 0, Math.sin(fY/2), 0);
    Quaternion(Qz, Math.cos(fZ/2), 0, 0, Math.sin(fZ/2));

    return Quat4.multiply(Qy, Quat4.multiply(Qx, Qz), quat);


    // var fPhi = -fPitch,//fRoll,
    //     fTheta = -fYaw, //fPitch,
    //     fPsi = -fRoll;

    // with (Math) {
    //     quat.X = sin(fPhi/2) * cos(fTheta/2) * cos(fPsi/2) - cos(fPhi/2) * sin(fTheta/2) * sin(fPsi/2);
    //     quat.Y = cos(fPhi/2) * sin(fTheta/2) * cos(fPsi/2) + sin(fPhi/2) * cos(fTheta/2) * sin(fPsi/2);
    //     quat.Z = cos(fPhi/2) * cos(fTheta/2) * sin(fPsi/2) - sin(fPhi/2) * sin(fTheta/2) * cos(fPsi/2);

    //     quat.W = cos(fPhi/2) * cos(fTheta/2) * cos(fPsi/2) + sin(fPhi/2) * sin(fTheta/2) * sin(fPsi/2);
    // }

    // return quat;
};

Quat4.fromXYZ = function (fX, fY, fZ, quat) {
    if (!quat) {
        quat = Quat4.create();
    }

//    var fX = fPitch;
//    var fY = fYaw;
//    var fZ = fRoll;

    var Qx = Quat4._qX,
        Qy = Quat4._qY,
        Qz = Quat4._qZ;
    Quaternion(quat, 1, 0, 0, 0);
    Quaternion(Qx, Math.cos(fX/2), -Math.sin(fX/2), 0, 0);
    Quaternion(Qy, Math.cos(fY/2), 0, -Math.sin(fY/2), 0);
    Quaternion(Qz, Math.cos(fZ/2), 0, 0, -Math.sin(fZ/2));

    Quat4.multiply(quat, Qx);
    Quat4.multiply(quat, Qy);
    Quat4.multiply(quat, Qz);

    return quat;


    // var fPhi = -fPitch,//fRoll,
    //     fTheta = -fYaw, //fPitch,
    //     fPsi = -fRoll;

    // with (Math) {
    //     quat.X = sin(fPhi/2) * cos(fTheta/2) * cos(fPsi/2) - cos(fPhi/2) * sin(fTheta/2) * sin(fPsi/2);
    //     quat.Y = cos(fPhi/2) * sin(fTheta/2) * cos(fPsi/2) + sin(fPhi/2) * cos(fTheta/2) * sin(fPsi/2);
    //     quat.Z = cos(fPhi/2) * cos(fTheta/2) * sin(fPsi/2) - sin(fPhi/2) * sin(fTheta/2) * cos(fPsi/2);

    //     quat.W = cos(fPhi/2) * cos(fTheta/2) * cos(fPsi/2) + sin(fPhi/2) * sin(fTheta/2) * sin(fPsi/2);
    // }

    // return quat;
};

Quat4.toAxisAngle = function (q1, axisAngle) {
    if (!axisAngle) {
        axisAngle = new Vector4;
    }

    if (q1.W > 1) 
        Quat4.normalize(q1); 
        // if w>1 acos and sqrt will produce errors, this cant happen if quaternion is normalised
    
    axisAngle.W = 2 * Math.acos(q1.W);
    
    var s = Math.sqrt(1 - q1.W * q1.W); 
    // assuming quaternion normalised then w is less than 1, so term always positive.

    if (s < 0.0005) { 

        // test to avoid divide by zero, s is always positive due to sqrt
        // if s close to zero then direction of axis not important
        
        axisAngle.X = q1.X; // if it is important that axis is normalised then replace with x=1; y=z=0;
        axisAngle.Y = q1.Y;
        axisAngle.Z = q1.Z;
    } 
    else {
        axisAngle.X = q1.X / s; // normalise axis
        axisAngle.Y = q1.Y / s;
        axisAngle.Z = q1.Z / s;
    }

   return axisAngle;
}

/*
 * Quat4.toMat3
 * Calculates a 3x3 matrix from the given Quat4
 *
 * Params:
 * quat - Quat4 to create matrix from
 * dest - Optional, Mat3 receiving operation result
 *
 * Returns:
 * dest if specified, a new Mat3 otherwise
 */
Quat4.toMat3 = function (quat, dest) {
    if (!dest) {dest = Mat3.create();}

    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;

    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;

    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;

    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;

    dest[0] = 1 - (yy + zz);
    dest[1] = xy - wz;
    dest[2] = xz + wy;

    dest[3] = xy + wz;
    dest[4] = 1 - (xx + zz);
    dest[5] = yz - wx;

    dest[6] = xz - wy;
    dest[7] = yz + wx;
    dest[8] = 1 - (xx + yy);

    return dest;
}

/*
 * Quat4.toMat4
 * Calculates a 4x4 matrix from the given Quat4
 *
 * Params:
 * quat - Quat4 to create matrix from
 * dest - Optional, Mat4 receiving operation result
 *
 * Returns:
 * dest if specified, a new Mat4 otherwise
 */
Quat4.toMat4 = function (quat, dest) {
    if (!dest) {dest = Mat4.create();}

    var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;

    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;

    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;

    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;

    dest[0] = 1 - (yy + zz);
    dest[1] = xy - wz;
    dest[2] = xz + wy;
    dest[3] = 0;

    dest[4] = xy + wz;
    dest[5] = 1 - (xx + zz);
    dest[6] = yz - wx;
    dest[7] = 0;

    dest[8] = xz - wy;
    dest[9] = yz + wx;
    dest[10] = 1 - (xx + yy);
    dest[11] = 0;

    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;

    return dest;
}

/*
 * Quat4.slerp
 * Performs a spherical linear interpolation between two Quat4
 *
 * Params:
 * quat - Quat4, first quaternion
 * quat2 - Quat4, second quaternion
 * slerp - interpolation amount between the two inputs
 * dest - Optional, Quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
Quat4.slerp = function (quat, quat2, slerp, dest) {
    if (!dest) {dest = quat;}

    var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3];

    if (Math.abs(cosHalfTheta) >= 1.0) {
        if (dest != quat) {
            dest[0] = quat[0];
            dest[1] = quat[1];
            dest[2] = quat[2];
            dest[3] = quat[3];
        }
        return dest;
    }

    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
        dest[0] = (quat[0] * 0.5 + quat2[0] * 0.5);
        dest[1] = (quat[1] * 0.5 + quat2[1] * 0.5);
        dest[2] = (quat[2] * 0.5 + quat2[2] * 0.5);
        dest[3] = (quat[3] * 0.5 + quat2[3] * 0.5);
        return dest;
    }

    var ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;

    dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
    dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
    dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
    dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);

    return dest;
}


/*
 * Quat4.str
 * Returns a string representation of a quaternion
 *
 * Params:
 * quat - Quat4 to represent as a string
 *
 * Returns:
 * string representation of quat
 */
Quat4.str = function (quat) {
    return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
}

//D3D functions

/**
 * D3DVec3TransformCoord
 * @tparam Float32Array v3fOut Out Vector
 * @tparam Float32Array v3fIn In Vector
 * @tparam Float32Array m4fM Matrix
 * @treturn Float32Array Out vector
 */
function vec3TransformCoord (v3fIn, m4fM, v3fOut) {
    if (!v3fOut) {
        v3fOut = Vec3.create();
    }

    var x, y, z, w;
    x = v3fIn.X * m4fM._11 + v3fIn.Y * m4fM._12 + v3fIn.Z * m4fM._13 + m4fM._14;
    y = v3fIn.X * m4fM._21 + v3fIn.Y * m4fM._22 + v3fIn.Z * m4fM._23 + m4fM._24;
    z = v3fIn.X * m4fM._31 + v3fIn.Y * m4fM._32 + v3fIn.Z * m4fM._33 + m4fM._34;
    w = v3fIn.X * m4fM._41 + v3fIn.Y * m4fM._42 + v3fIn.Z * m4fM._43 + m4fM._44;

    v3fOut.X = x / w;
    v3fOut.Y = y / w;
    v3fOut.Z = z / w;

    return v3fOut;
}
;
Vec3.vec3TransformCoord = vec3TransformCoord;
/**
 * D3DXMatrixPerspectiveFovLH
 * @tparam Float fFovy Field of view in the y direction, in radians.
 * @tparam Float fAspect Aspect ratio, defined as view space width divided by height.
 * @tparam Float fZn Z-value of the near view-plane.
 * @tparam Float fZf Z-value of the far view-plane.
 * @tparam Float32Array m4fOut Out Matrix
 * @treturn Float32Array Out matrix
 */
function matrixPerspectiveFovRH (fFovy, fAspect, fZn, fZf, m4fOut) {
    if (!m4fOut) {
        m4fOut = Mat4.create();
    }

    var fYScale = 1 / Math.tan(fFovy / 2);
    var fXScale = fYScale / fAspect;

    m4fOut._11 = fXScale;
    m4fOut._12 = 0;
    m4fOut._13 = 0;
    m4fOut._14 = 0;
    m4fOut._21 = 0;
    m4fOut._22 = fYScale;
    m4fOut._23 = 0;
    m4fOut._24 = 0;
    m4fOut._31 = 0;
    m4fOut._32 = 0;
    m4fOut._33 = (fZf + fZn) / (fZn - fZf);//(fZf+fZn)/(fZn-fZf);
    m4fOut._34 = fZn * fZf * 2 / (fZn - fZf);//fZn*fZf*2/(fZn-fZf);
    m4fOut._41 = 0;
    m4fOut._42 = 0;
    m4fOut._43 = -1.0;
    m4fOut._44 = 0;

    return m4fOut;
}
;
Mat4.matrixPerspectiveFovRH = matrixPerspectiveFovRH;
/**
 * D3DXMatrixOrthoLH
 * @tparam Float fW Width of the view volume.
 * @tparam Float fH Height of the view volume.
 * @tparam Float fZn Minimum z-value of the view volume which is referred to as z-near.
 * @tparam Float fZf Maximum z-value of the view volume which is referred to as z-far.
 * @tparam Float32Array m4fOut Out Matrix
 * @treturn Float32Array Out matrix
 */
function matrixOrthoRH (fW, fH, fZn, fZf, m4fOut) {
    if (!m4fOut) {
        m4fOut = Mat4.create();
    }

    m4fOut._11 = 2 / fW;
    m4fOut._12 = 0;
    m4fOut._13 = 0;
    m4fOut._14 = 0;
    m4fOut._21 = 0;
    m4fOut._22 = 2 / fH;
    m4fOut._23 = 0;
    m4fOut._24 = 0;
    m4fOut._31 = 0;
    m4fOut._32 = 0;
    m4fOut._33 = 1 / (fZn - fZf);
    m4fOut._34 = 0;
    m4fOut._41 = 0;
    m4fOut._42 = 0;
    m4fOut._43 = fZn / (fZn - fZf);
    m4fOut._44 = 1;

    return m4fOut;
}
;
Mat4.matrixOrthoRH = matrixOrthoRH;
/**
 * D3DXMatrixOrthoOffCenterLH
 * @tparam Float Minimum x-value of view volume.
 * @tparam Float Maximum x-value of view volume.
 * @tparam Float fB Minimum y-value of view volume.
 * @tparam Float fT Maximum y-value of view volume.
 * @tparam Float fZn Minimum z-value of the view volume.
 * @tparam Float fZf Maximum z-value of the view volume.
 * @tparam Float32Array m4fOut Out Matrix
 * @treturn Float32Array Out matrix
 */
function matrixOrthoOffCenterRH (fL, fR, fB, fT, fZn, fZf, m4fOut) {
    if (!m4fOut) {
        m4fOut = Mat4.create();
    }
    var fRL = fR - fL;
    var fTB = fT - FB;
    var fFN = fZf - fZn;
    m4fOut._11 = 2 / fRL;
    m4fOut._12 = 0;
    m4fOut._13 = 0;
    m4fOut._14 = -(fL + fR) / fRL;
    m4fOut._21 = 0;
    m4fOut._22 = 2 / fTB;
    m4fOut._23 = 0;
    m4fOut._24 = -(fT + fB) / FTB;
    m4fOut._31 = 0;
    m4fOut._32 = 0;
    m4fOut._33 = -2 / fFN;
    m4fOut._34 = -(fZf + fZn) / fFN;
    m4fOut._41 = 0;
    m4fOut._42 = 0;
    m4fOut._43 = 0;
    m4fOut._44 = 1;

    return m4fOut;
}
;
Mat4.matrixOrthoOffCenterRH = matrixOrthoOffCenterRH;


