/**
 * @file
 * @author Igor Karateev
 * @brief файл содержит класс Mat3
 * Матрицы хранятся по столбцам, как в openGL
 */

/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */

// Define(a11, __[0]);
// Define(a12, __[1]);
// Define(a13, __[2]);
// Define(a21, __[3]);
// Define(a22, __[4]);
// Define(a23, __[5]);
// Define(a31, __[6]);
// Define(a32, __[7]);
// Define(a33, __[8]);

Define(a11, __[0]);
Define(a12, __[3]);
Define(a13, __[6]);
Define(a21, __[1]);
Define(a22, __[4]);
Define(a23, __[7]);
Define(a31, __[2]);
Define(a32, __[5]);
Define(a33, __[8]);

Define(Matrix3, Mat3);

function Mat3(){
    //'use strict';

    var m3fMat;

    if(this === window  || this === window.AKRA){
        m3fMat = Mat3._pStorage[Mat3._iIndex++];
        if(Mat3._iIndex == Mat3._nStorageSize){
            Mat3._iIndex = 0;
        }        

        //clear
        if(arguments.length == 0){
            // var pData = m3fMat.pData;
            // pData.a11 = pData.a12 = pData.a13 = 
            // pData.a21 = pData.a22 = pData.a23 = 
            // pData.a31 = pData.a32 = pData.a33 = 0;
            return m3fMat;
        }
    }
    else{
        this.pData = new Float32Array(9);
        m3fMat = this;
    }

    var nArgumentsLength = arguments.length;
    if(nArgumentsLength == 1){
        return m3fMat.set(arguments[0]);    
    }
    else if(nArgumentsLength == 3){
        return m3fMat.set(arguments[0],arguments[1],arguments[2]);    
    }
    else if(nArgumentsLength == 9){
        return m3fMat.set(arguments[0],arguments[1],arguments[2],
                        arguments[3],arguments[4],arguments[5],
                        arguments[6],arguments[7],arguments[8]);    
    }
    else{
        return m3fMat;
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

            //ложим по столбцам

            pData.a11 = pData1.X;
            pData.a12 = pData2.X;
            pData.a13 = pData3.X;

            pData.a21 = pData1.Y;
            pData.a22 = pData2.Y;
            pData.a23 = pData3.Y;

            pData.a31 = pData1.Z;
            pData.a32 = pData2.Z;
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

    if(fDeterminant == 0){
        debug_assert(0,"обращение матрицы с нулевым детеминантом:\n" 
                    + this.toString());

        return m3fDestination.set(1);//чтоб все не навернулось
    }

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

Mat3.prototype.toQuat4 = function(q4fDestination) {
    'use strict';
    
    if(!q4fDestination){
        q4fDestination = new Quat4();
    }

    var pData = this.pData;
    var pDataDestination = q4fDestination.pData;

    var a11 = pData.a11, a12 = pData.a12, a13 = pData.a13;
    var a21 = pData.a21, a22 = pData.a22, a23 = pData.a23;
    var a31 = pData.a31, a32 = pData.a32, a33 = pData.a33;

    var x2 = ((a11 - a22 - a33) + 1)/4; //x^2
    var y2 = ((a22 - a11 - a33) + 1)/4; //y^2
    var z2 = ((a33 - a11 - a22) + 1)/4; //z^2
    var w2 = ((a11 + a22 + a33) + 1)/4; //w^2

    var fMax = Math.max(x2,Math.max(y2,Math.max(z2,w2)));

    if(fMax == x2){
        var x = Math.sqrt(x2); //максимальная компонента берется положительной

        pDataDestination.X = x;
        pDataDestination.Y = (a21 + a12)/4/x;
        pDataDestination.Z = (a31 + a13)/4/x;
        pDataDestination.W = (a32 - a23)/4/x;
    }
    else if(fMax == y2){
        var y = Math.sqrt(y2); //максимальная компонента берется положительной

        pDataDestination.X = (a21 + a12)/4/y;
        pDataDestination.Y = y;
        pDataDestination.Z = (a32 + a23)/4/y;
        pDataDestination.W = (a13 - a31)/4/y;
    }
    else if(fMax == z2){
        var z = Math.sqrt(z2); //максимальная компонента берется положительной

        pDataDestination.X = (a31 + a13)/4/z;
        pDataDestination.Y = (a32 + a23)/4/z;
        pDataDestination.Z = z;
        pDataDestination.W = (a21 - a12)/4/z;
    }
    else{
        var w = Math.sqrt(w2); //максимальная компонента берется положительной

        pDataDestination.X = (a32 - a23)/4/w;
        pDataDestination.Y = (a13 - a31)/4/w;
        pDataDestination.Z = (a21 - a12)/4/w;
        pDataDestination.W = w;
    }

    return q4fDestination;
};

/**
 * строит матрицу поворота через углы Эйлера
 * матрица строится из последовательных вращений по осям и равносильна следующему
 * resultMatrix = rotateY(fYaw) * rotateX(fPitch) * rotateZ(fRoll)
 */

Mat3.fromYawPitchRoll = function(fYaw,fPitch,fRoll,m3fDestination) {
    'use strict';
    if(!m3fDestination){
        m3fDestination = new Mat3();
    }

    var pDataDestination = m3fDestination.pData;

    var fSin1 = Math.sin(fYaw);
    var fSin2 = Math.sin(fPitch);
    var fSin3 = Math.sin(fRoll);

    var fCos1 = Math.cos(fYaw);
    var fCos2 = Math.cos(fPitch);
    var fCos3 = Math.cos(fRoll);

    pDataDestination.a11 = fCos1 * fCos3 + fSin1 * fSin2 * fSin3;
    pDataDestination.a12 = fCos3 * fSin1 * fSin2 - fCos1 * fSin3;
    pDataDestination.a13 = fCos2 * fSin1;

    pDataDestination.a21 = fCos2 * fSin3;
    pDataDestination.a22 = fCos2 * fCos3;
    pDataDestination.a23 = -fSin2;

    pDataDestination.a31 = fCos1 * fSin2 * fSin3 - fCos3 * fSin1;
    pDataDestination.a32 = fSin1 * fSin3 + fCos1 * fCos3 * fSin2;
    pDataDestination.a33 = fCos1 * fCos2;

    return m3fDestination;
};

/**
 * строит матрицу поворота через углы поворота вокруг осей X Y Z
 * resultMatrix = rotateY(fY) * rotateX(fX) * rotateZ(fZ);
 * порядок именно такой для согласования с yaw pitch roll
 */
Define(Mat3.fromXYZ(fX,fY,fZ), 
	function () {
    	Mat3.fromYawPitchRoll(fY,fX,fZ);
	}
);

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

/**
 * проверяет диагональная ли матрица с определенной точностью
 */
Mat3.prototype.isDiagonal = function(fEps) {
    'use strict';   
    fEps = ifndef(fEps,0);
    var pData = this.pData;

    if(fEps == 0){
        if(    pData.a12 != 0 || pData.a13 != 0
            || pData.a21 != 0 || pData.a23 != 0
            || pData.a31 != 0 || pData.a32 != 0){

            return false;
        }
    }
    else{
        if(    Math.abs(pData.a12) > fEps || Math.abs(pData.a13) > fEps
            || Math.abs(pData.a21) > fEps || Math.abs(pData.a23) > fEps
            || Math.abs(pData.a31) > fEps || Math.abs(pData.a32) > fEps){

            return false;
        }
    }

    return true;
};

Mat3.prototype.mult = Mat3.prototype.multiply;

a.allocateStorage(Mat3,100);