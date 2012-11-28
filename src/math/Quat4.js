/**
 * @file
 * @author Igor Karateev
 * @brief файл содержит класс Quat4
 */

Define(X, __[0]);
Define(Y, __[1]);
Define(Z, __[2]);
Define(W, __[3]);

Define(Quaternion, Quat4);

function Quat4 () {
    //'use strict';

    var qQuat;
    if(this === window || this === window.AKRA){
        qQuat = Quat4._pStorage[Quat4._iIndex++];
        if(Quat4._iIndex == Quat4._nStorageSize){
            Quat4._iIndex = 0;
        }

        //clear
        if(arguments.length == 0){
            // var pData = qQuat.pData;
            // pData.X = pData.Y = pData.Z = 0;
            // pData.W = 1;
            return qQuat;
        }
    }
    else{
        this.pData = new Float32Array(4);
        qQuat = this;
    }

    var nArgumentsLength = arguments.length;

    if(nArgumentsLength == 1){
        return qQuat.set(arguments[0]);
    }
    else if(nArgumentsLength == 2){
        return qQuat.set(arguments[0],arguments[1]);
    }
    else if(nArgumentsLength == 4){
        return qQuat.set(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    else{
        qQuat.pData.W = 1;
        return qQuat;
    }
}

PROPERTY(Quat4, 'x',
    function () {
        return this.pData.X;
    },
    function (fValue) {
        this.pData.X = fValue;
    }
);

PROPERTY(Quat4, 'y',
    function () {
        return this.pData.Y;
    },
    function (fValue) {
        this.pData.Y = fValue;
    }
);

PROPERTY(Quat4, 'z',
    function () {
        return this.pData.Z;
    },
    function (fValue) {
        this.pData.Z = fValue;
    }
);

PROPERTY(Quat4, 'w',
    function () {
        return this.pData.W;
    },
    function (fValue) {
        this.pData.W = fValue;
    }
);

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

Quat4.prototype.set = function() {
    'use strict';
    var pData = this.pData;

    var nArgumentsLength = arguments.length;

    if(nArgumentsLength == 0){
        pData.X = pData.Y = pData.Z = 0;
        pData.W = 1;
    }
    if(nArgumentsLength == 1){
        if(arguments[0] instanceof Quat4){
            var pElements = arguments[0].pData;

            pData.X = pElements.X;
            pData.Y = pElements.Y;
            pData.Z = pElements.Z;
            pData.W = pElements.W;
        }
        else{
            //Array
            var pElements = arguments[0];

            pData.X = pElements.X;
            pData.Y = pElements.Y;
            pData.Z = pElements.Z;
            pData.W = pElements.W;
        }
    }
    else if(nArgumentsLength == 2){
        //float float
        //vec3 float
        if(typeof(arguments[0]) == "number"){
            //float float
            var fValue = arguments[0];

            pData.X = fValue;
            pData.Y = fValue;
            pData.Z = fValue;
            pData.W = arguments[1];
        }
        else{
            //vec3 float
            var pElements = arguments[0].pData;
            pData.X = pElements.X;
            pData.Y = pElements.Y;
            pData.Z = pElements.Z;
            pData.W = arguments[1];
        }
    }
    else if(nArgumentsLength == 4){
        pData.X = arguments.X;
        pData.Y = arguments.Y;
        pData.Z = arguments.Z;
        pData.W = arguments.W;
    }

    return this;
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

Quat4.prototype.calculateW = function(q4fDestination) {
    'use strict';

    var pData = this.pData;
    var x = pData.X, y = pData.Y, z = pData.Z;

    if(!q4fDestination){
        q4fDestination.W = Math.sqrt(1. - x*x - y*y - z*z);
        return this;
    }

    var pDataDestination = q4fDestination.pData;

    pDataDestination.X = x;
    pDataDestination.Y = y;
    pDataDestination.Z = z;
    pDataDestination.W = Math.sqrt(1. - x*x - y*y - z*z);

    return q4fDestination;
};

/*
 * Quat4.conjugate 
 * Calculates the conjugate of a Quat4
 *
 * Params:
 * quat - Quat4 to calculate conjugate of
 * dest - Optional, Quat4 receiving conjugate values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */

Quat4.prototype.conjugate  = function(q4fDestination) {
    'use strict';
    var pData = this.pData;

    if(!q4fDestination){
        pData.X = -pData.X;
        pData.Y = -pData.Y;
        pData.Z = -pData.Z;

        return this;
    }

    var pDataDestination = q4fDestination.pData;

    pDataDestination.X = -pData.X;
    pDataDestination.Y = -pData.Y;
    pDataDestination.Z = -pData.Z;
    pDataDestination.W = pData.W;

    return q4fDestination;
};

Quat4.prototype.inverse = function(q4fDestination) {
    'use strict';

    if(!q4fDestination){
        q4fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = q4fDestination.pData;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;
    var fSqLength = x*x + y*y + z*z + w*w;

    if(fSqLength == 0){
        pDataDestination.X = 0;
        pDataDestination.Y = 0;
        pDataDestination.Z = 0;
        pDataDestination.W = 0;
    }
    else{
        var fInv = 1/fSqLength;
        pDataDestination.X = -x*fInv;
        pDataDestination.Y = -y*fInv;
        pDataDestination.Z = -z*fInv;
        pDataDestination.W =  w*fInv;
    }

    return q4fDestination;
};

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

Quat4.prototype.length = function() {
    'use strict';
    var pData = this.pData;
    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    return Math.sqrt(x*x + y*y + z*z + w*w);
};

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

Quat4.prototype.normalize = function(q4fDestination) {
    'use strict';
    if(!q4fDestination){
        q4fDestination = this;
    }

    var pData = this.pData;
    var pDataDestination = q4fDestination.pData;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

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

    return q4fDestination;
};

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

Quat4.prototype.multiply = function(q4fQuat,q4fDestination) {
    'use strict';
    if(!q4fDestination){
        q4fDestination = this;
    }

    var pData1 = this.pData;
    var pData2 = q4fQuat.pData;

    var x1 = pData1.X, y1 = pData1.Y, z1 = pData1.Z, w1 = pData1.W;
    var x2 = pData2.X, y2 = pData2.Y, z2 = pData2.Z, w2 = pData2.W;

    var pDataDestination = q4fDestination.pData;

    pDataDestination.X = x1*w2 + x2*w1 + y1*z2 - z1*y2;
    pDataDestination.Y = y1*w2 + y2*w1 + z1*x2 - x1*z2;
    pDataDestination.Z = z1*w2 + z2*w1 + x1*y2 - y1*x2;
    pDataDestination.W = w1*w2 - x1*x2 - y1*y2 - z1*z2;

    return q4fDestination;
};

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

Quat4.prototype.multiplyVec3 = function(v3fVec,v3fDestination) {
    'use strict';
    if(!v3fDestination){
        v3fDestination = v3fVec;
    }

    var q4fVec = Quat4(v3fVec,0);
    var qInverse = this.inverse(Quat4());

    var qResult = this.multiply(q4fVec.multiply(qInverse),Quat4());

    var pData = qResult.pData;
    var pDataDestination = v3fDestination.pData;

    pDataDestination.X = pData.X;
    pDataDestination.Y = pData.Y;
    pDataDestination.Z = pData.Z;

    return v3fDestination;
};

/**
 * сравнивает два кватениона
 * q4fQuat - кватернион, с которым происходит сравнение
 * fEps - точность сравнения, опционально, по умолцанию false
 * asMatrix - показывает, сравнивать ли кватернионы или сравнивать матрицу, которую они задают, опционально, по умолцанию false
 */
Quat4.prototype.isEqual = function(q4fQuat,fEps,asMatrix) {
    
    fEps = ifndef(fEps,0);
    asMatrix = ifndef(asMatrix,false);

    var pData1 = this.pData;
    var pData2 = q4fQuat.pData;

    var x1 = pData1.X, y1 = pData1.Y, z1 = pData1.Z, w1 = pData1.W;
    var x2 = pData2.X, y2 = pData2.Y, z2 = pData2.Z, w2 = pData2.W;

    var length1 = Math.sqrt(x1*x1 + y1*y1 + z1*z1 + w1*w1);
    var length2 = Math.sqrt(x2*x2 + y2*y2 + z2*z2 + w2*w2);

    if(Math.abs(length1 - length2) > fEps){
        return false;
    }

    var cosHalfTheta = (x1*x2 + y1*y2 + z1*z2 + w1*w2)/length1/length2;

    if(asMatrix){
        cosHalfTheta = Math.abs(cosHalfTheta);
    }

    if(1 - cosHalfTheta > fEps){
        return false;
    }

    return true;
};

Quat4.prototype.toYawPitchRoll = function(v3fDestination) {
    'use strict';

    if(!v3fDestination){
        v3fDestination = new Vec3();
    }

    var pData = this.pData;
    var pDataDestination = v3fDestination.pData;

    var fYaw, fPitch, fRoll;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    var fx2 = x * 2;
    var fy2 = y * 2;
    var fz2 = z * 2;
    var fw2 = w * 2;

    var fSinPitch = Math.clamp(fx2*w - fy2*z,-1,1);//в очень редких случаях из-за ошибок округления получается результат > 1
    fPitch = Math.asin(fSinPitch);  
    //не известен знак косинуса, как следствие это потребует дополнительной проверки.
    //как показала практика - это не на что не влияет, просто один и тот же кватернион можно получить двумя разными вращениями

    if(Math.abs(x) == Math.abs(w)){
        //вырожденный случай обрабатывается отдельно
        //
        var wTemp = w*Math.sqrt(2);
        //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
        //x==-w
        //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
        var yTemp = y*Math.sqrt(2);
        //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
        //x==-w
        //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
        
        fYaw = Math.atan2(yTemp,wTemp)*2;
        fRoll = 0;

        //убираем дополнительный оборот
        var pi = Math.PI;
        if(fYaw > pi){
            fYaw -= pi;
            fRoll = (x == w) ? -pi : pi;
        }
        else if(fYaw < -pi){
            fYaw += pi;
            fRoll = (x == w) ? pi : -pi;
        }
    }
    else{
        //Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
        fYaw = Math.atan2(fx2*z + fy2*w, 1 - (fx2*x + fy2*y));
        //Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
        fRoll = Math.atan2(fx2*y + fz2*w, 1 - (fx2*x + fz2*z));
    }

    pDataDestination.X = fYaw;
    pDataDestination.Y = fPitch;
    pDataDestination.Z = fRoll;

    return v3fDestination;
};


/**
 * return value of yaw angle
 */
Quat4.prototype.getYaw = function() {
    'use strict';

    var pData = this.pData;
    var fYaw;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    var fx2 = x * 2;
    var fy2 = y * 2;

    if(Math.abs(x) == Math.abs(w)){
        //вырожденный случай обрабатывается отдельно
        //
        var wTemp = w*Math.sqrt(2);
        //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
        //x==-w
        //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
        var yTemp = y*Math.sqrt(2);
        //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
        //x==-w
        //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
        
        fYaw = Math.atan2(yTemp,wTemp)*2;
        //fRoll = 0;

        //убираем дополнительный оборот
        var pi = Math.PI;
        if(fYaw > pi){
            fYaw -= pi;
            //fRoll = (x == w) ? -pi : pi;
        }
        else if(fYaw < -pi){
            fYaw += pi;
            //fRoll = (x == w) ? pi : -pi;
        }
    }
    else{
        //Math.atan2(sin(Yaw)*cos(Pitch),cos(Yaw)*cos(Pitch));
        fYaw = Math.atan2(fx2*z + fy2*w, 1 - (fx2*x + fy2*y));
    }

    return fYaw;
};

/**
 * return value of pitch angle
 */
Quat4.prototype.getPitch = function() {
    'use strict';

    var pData = this.pData;
    var fPitch;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    var fx2 = x * 2;
    var fy2 = y * 2;

    var fSinPitch = Math.clamp(fx2*w - fy2*z,-1,1);//в очень редких случаях из-за ошибок округления получается результат > 1
    fPitch = Math.asin(fSinPitch);

    return fPitch;
};

Quat4.prototype.getRoll = function() {
    'use strict';

    var pData = this.pData;
    var fRoll;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    var fx2 = x * 2;
    var fz2 = z * 2;

    if(Math.abs(x) == Math.abs(w)){
        //вырожденный случай обрабатывается отдельно
        //
        var wTemp = w*Math.sqrt(2);
        //cos(Yaw/2)*cos(Roll/2) + sin(Yaw/2)*sin(Roll/2) = cos((Yaw-Roll)/2); Roll = 0;
        //x==-w
        //cos(Yaw/2)*cos(Roll/2) - sin(Yaw/2)*sin(Roll/2) = cos((Yaw+Roll)/2); Roll = 0;
        var yTemp = y*Math.sqrt(2);
        //sin(Yaw/2)*cos(Roll/2) - cos(Yaw/2)*sin(Roll/2) = sin((Yaw-Roll)/2); Roll = 0;
        //x==-w
        //sin(Yaw/2)*cos(Roll/2) + cos(Yaw/2)*sin(Roll/2) = sin((Yaw+Roll)/2); Roll = 0;
        
        var fYaw = Math.atan2(yTemp,wTemp)*2;
        fRoll = 0;

        //убираем дополнительный оборот
        var pi = Math.PI;
        if(fYaw > pi){
            //fYaw -= pi;
            fRoll = (x == w) ? -pi : pi;
        }
        else if(fYaw < -pi){
            //fYaw += pi;
            fRoll = (x == w) ? pi : -pi;
        }
    }
    else{
        //Math.atan2(cos(Pitch) * sin(Roll),cos(Pitch)*cos(Roll));
        fRoll = Math.atan2(fx2*y + fz2*w, 1 - (fx2*x + fz2*z));
    }

    return fRoll;
};


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

Quat4.prototype.toMat3 = function(m3fDestination) {
    'use strict';
    if(!m3fDestination){
        m3fDestination = new Mat3();
    }
    var pDataDestination = m3fDestination.pData;
    var pData = this.pData;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    //потом необходимо ускорить
    
    pDataDestination.a11 = 1 - 2*(y*y + z*z);
    pDataDestination.a12 = 2*(x*y - z*w);
    pDataDestination.a13 = 2*(x*z + y*w);

    pDataDestination.a21 = 2*(x*y + z*w);
    pDataDestination.a22 = 1 - 2*(x*x + z*z);
    pDataDestination.a23 = 2*(y*z - x*w);

    pDataDestination.a31 = 2*(x*z - y*w);
    pDataDestination.a32 = 2*(y*z + x*w);
    pDataDestination.a33 = 1 - 2*(x*x + y*y);

    return m3fDestination;
};

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

Quat4.prototype.toMat4 = function(m4fDestination) {
    'use strict';
    if(!m4fDestination){
        m4fDestination = new Mat4();
    }
    var pDataDestination = m4fDestination.pData;
    var pData = this.pData;

    var x = pData.X, y = pData.Y, z = pData.Z, w = pData.W;

    //потом необходимо ускорить
    
    pDataDestination._11 = 1 - 2*(y*y + z*z);
    pDataDestination._12 = 2*(x*y - z*w);
    pDataDestination._13 = 2*(x*z + y*w);
    pDataDestination._14 = 0;

    pDataDestination._21 = 2*(x*y + z*w);
    pDataDestination._22 = 1 - 2*(x*x + z*z);
    pDataDestination._23 = 2*(y*z - x*w);
    pDataDestination._24 = 0;

    pDataDestination._31 = 2*(x*z - y*w);
    pDataDestination._32 = 2*(y*z + x*w);
    pDataDestination._33 = 1 - 2*(x*x + y*y);
    pDataDestination._34 = 0;

    pDataDestination._41 = 0;
    pDataDestination._42 = 0;
    pDataDestination._43 = 0;
    pDataDestination._44 = 1;

    return m4fDestination;
};

/*
 * Returns a string representation of a quaternion
 */

Quat4.prototype.toString = function() {
    'use strict';
    var pData = this.pData;
    return '[' + pData.X + ', ' + pData.Y + ', ' + pData.Z + ', ' + pData.W + ']';
};

/**
 * делает сферическую линейную интерполяцию между кватернионами
 */

Quat4.prototype.smix = function(q4fQuat,fA,q4fDestination,bShortestPath) {

    'use strict';
    if(!q4fDestination){
        q4fDestination = this;
    }
    bShortestPath = ifndef(bShortestPath,true);

    fA = Math.clamp(fA,0,1);

    var pData1 = this.pData;
    var pData2 = q4fQuat.pData;
    var pDataDestination = q4fDestination.pData;


    var x1 = pData1.X, y1 = pData1.Y, z1 = pData1.Z, w1 = pData1.W;
    var x2 = pData2.X, y2 = pData2.Y, z2 = pData2.Z, w2 = pData2.W;

    var fCos = x1*x2 + y1*y2 + z1*z2 + w1*w2;

    if(fCos < 0 && bShortestPath){
        fCos = -fCos;
        x2 = -x2;
        y2 = -y2;
        z2 = -z2;
        w2 = -w2;

    }

    var fEps = 1e-3;
    if(Math.abs(fCos) < 1. - fEps){
        var fSin = Math.sqrt(1 - fCos*fCos);
        var fInvSin = 1/fSin;

        var fAngle = Math.atan2(fSin,fCos);

        var k1 = Math.sin((1 - fA) * fAngle)*fInvSin;
        var k2 = Math.sin(fA * fAngle)*fInvSin;


        pDataDestination.X = x1*k1 + x2*k2;
        pDataDestination.Y = y1*k1 + y2*k2;
        pDataDestination.Z = z1*k1 + z2*k2;
        pDataDestination.W = w1*k1 + w2*k2;

    }
    else{
        //два кватерниона или очень близки (тогда можно делать линейную интерполяцию) 
        //или два кватениона диаметрально противоположны, тогда можно интерполировать любым способом
        //позже надо будет реализовать какой-нибудь, а пока тоже линейная интерполяция
        
        var k1 = 1 - fA;
        var k2 = fA;


        var x = x1*k1 + x2*k2;
        var y = y1*k1 + y2*k2;
        var z = z1*k1 + z2*k2;
        var w = w1*k1 + w2*k2;


        // и нормализуем так-как мы сошли со сферы
        
        var fLength = Math.sqrt(x*x + y*y + z*z + w*w);

        var fInvLen = fLength ? 1/fLength : 0;


        pDataDestination.X = x * fInvLen;
        pDataDestination.Y = y * fInvLen;
        pDataDestination.Z = z * fInvLen;
        pDataDestination.W = w * fInvLen;
    }

    return q4fDestination;
};


Quat4.prototype.mix = function(q4fQuat,fA,q4fDestination,bShortestPath) {
    'use strict';
    if(!q4fDestination){
        q4fDestination = this;
    }
    bShortestPath = ifndef(bShortestPath,true);

    fA = Math.clamp(fA,0,1);

    var pData1 = this.pData;
    var pData2 = q4fQuat.pData;
    var pDataDestination = q4fDestination.pData;

    var x1 = pData1.X, y1 = pData1.Y, z1 = pData1.Z, w1 = pData1.W;
    var x2 = pData2.X, y2 = pData2.Y, z2 = pData2.Z, w2 = pData2.W;

    var fCos = x1*x2 + y1*y2 + z1*z2 + w1*w2;

    if(fCos < 0 && bShortestPath){
        x2 = -x2;
        y2 = -y2;
        z2 = -z2;
        w2 = -w2;
    }

    var k1 = 1 - fA;
    var k2 = fA;

    pDataDestination.X = x1*k1 + x2*k2;
    pDataDestination.Y = y1*k1 + y2*k2;
    pDataDestination.Z = z1*k1 + z2*k2;
    pDataDestination.W = w1*k1 + w2*k2;

    return q4fDestination;
};

Quat4.fromForwardUp = function(v3fForward,v3fUp,q4fDestination) {
    'use strict';
    if(!q4fDestination){
        q4fDestination = new Quat4();
    }

    var pDataDestination = q4fDestination.pData;
    var pDataForward = v3fForward.pData;
    var pDataUp = v3fUp.pData;

    var fForwardX = pDataForward.X, fForwardY = pDataForward.Y, fForwardZ = pDataForward.Z;
    var fUpX = pDataUp.X, fUpY = pData.Y, fUpZ = pDataUp.Z;

    var m3fTemp = new Mat3();
    var pTempData = m3fTemp.pData;

    pTempData.a11 = fUpY*fForwardZ - fUpZ*fForwardY;
    pTempData.a12 = pDataUp.X;
    pTempData.a13 = pDataForward.X;

    pTempData.a21 = fUpZ*fForwardX - fUpX*fForwardZ;
    pTempData.a22 = pDataUp.Y;
    pTempData.a23 = pDataForward.Y;

    pTempData.a31 = fUpX*fForwardY - fUpY*fForwardX;
    pTempData.a32 = pDataUp.Z;
    pTempData.a33 = pDataForward.Z;

    return pTempData.toQuat4(q4fDestination);
};

Quat4.fromAxisAngle = function(v3fAxis,fAngle,q4fDestination){
    'use strict';
    if(!q4fDestination){
        q4fDestination = new Quat4();
    }

    var pDataDestination = q4fDestination.pData;
    var pDataAxis = v3fAxis.pData;
    var x = pDataAxis.X, y = pDataAxis.Y, z = pDataAxis.Z;

    var fLength = Math.sqrt(x*x + y*y + z*z);

    if(!fLength){
        pDataDestination.X = pDataDestination.Y = pDataDestination.Z = 0;
        pDataDestination.W = 1;
        return q4fDestination;
    }

    x = x/fLength;
    y = y/fLength;
    z = z/fLength;

    //fAngle - вращение по часовой стрелке
    var fSin = Math.sin(fAngle/2);
    var fCos = Math.cos(fAngle/2);

    pDataDestination.X = x * fSin;
    pDataDestination.Y = y * fSin;
    pDataDestination.Z = z * fSin;
    pDataDestination.W = fCos;

    return q4fDestination;
};
/**
 * строит кватернион поворота через углы Эйлера
 * матрица на основе углов эйлера равна
 * resultMatrix = rotateY(fYaw) * rotateX(fPitch) * rotateZ(fRoll)
 */

Quat4.fromYawPitchRoll = function(fYaw,fPitch,fRoll,q4fDestination) {
    'use strict';
    if(arguments.length <= 2){
        //Vec3 + q4fDestination
        var pData = arguments[0].pData;

        fYaw   = pData.X;
        fPitch = pData.Y;
        fRoll  = pData.Z;

        q4fDestination = arguments[1];
    }

    if(!q4fDestination){
        q4fDestination = new Quat4();
    }

    var pDataDestination = q4fDestination.pData;

    var fHalfYaw = fYaw * 0.5;
    var fHalfPitch = fPitch * 0.5;
    var fHalfRoll = fRoll * 0.5;

    var fCos1 = Math.cos(fHalfYaw), fSin1 = Math.sin(fHalfYaw);
    var fCos2 = Math.cos(fHalfPitch), fSin2 = Math.sin(fHalfPitch);
    var fCos3 = Math.cos(fHalfRoll), fSin3 = Math.sin(fHalfRoll);

    pDataDestination.X = fCos1 * fSin2 * fCos3 + fSin1 * fCos2 * fSin3;
    pDataDestination.Y = fSin1 * fCos2 * fCos3 - fCos1 * fSin2 * fSin3;
    pDataDestination.Z = fCos1 * fCos2 * fSin3 - fSin1 * fSin2 * fCos3;
    pDataDestination.W = fCos1 * fCos2 * fCos3 + fSin1 * fSin2 * fSin3;

    return q4fDestination;
};

/**
 * строит кватернион через углы поворота вокруг осей X Y Z
 * аналогичная матрица строится как, для согласования с Yaw Pitch Roll
 * resultMatrix = rotate(fY) * rotate(fX) * rotate(fZ);
 */

Define(Quat4.fromXYZ(fX,fY,fZ),
    function(){
        Quat4.fromYawPitchRoll(fY,fX,fZ);
    }
);

Quat4.prototype.mult = Quat4.prototype.multiply;
Quat4.prototype.slerp = Quat4.prototype.smix;
Quat4.prototype.nlerp = Quat4.prototype.mix;

Quat4.fromYPR = Quat4.fromYawPitchRoll;

a.allocateStorage(Quat4,100);