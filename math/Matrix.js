/**
 * @file
 * @author Sergey Semenov
 * @email <sss@odserve.org>
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

// Fallback for systems that don't support WebGL
if (typeof Float32Array != 'undefined') {
    glMatrixArrayType = Float32Array;
} else if (typeof WebGLFloatArray != 'undefined') {
    glMatrixArrayType = WebGLFloatArray; // This is officially deprecated and should dissapear in future revisions.
}
else {
    glMatrixArrayType = Array;
}
/*
 Define(Math.min(x,y), function(){
 x>y?y:x;
 });
 Define(Math.max(x,y), function(){
 x>y?x:y;
 });*/

Define(X, __[0])
Define(Y, __[1])
Define(Z, __[2])
Define(W, __[3])
Define(_11, __[0])
Define(_12, __[4])
Define(_13, __[8])
Define(_14, __[12])
Define(_21, __[1])
Define(_22, __[5])
Define(_23, __[9])
Define(_24, __[13])
Define(_31, __[2])
Define(_32, __[6])
Define(_33, __[10])
Define(_34, __[14])
Define(_41, __[3])
Define(_42, __[7])
Define(_43, __[11])
Define(_44, __[15])

Define(a11, __[0])
Define(a12, __[3])
Define(a13, __[6])
Define(a21, __[1])
Define(a22, __[4])
Define(a23, __[7])
Define(a31, __[2])
Define(a32, __[5])
Define(a33, __[8])

Define(Vec2.set(v1, v2), function () {
    v2.X = v1.X;
    v2.Y = v1.Y;
});
Define(Vec3.set(v1, v2), function () {
    v2.X = v1.X;
    v2.Y = v1.Y;
    v2.Z = v1.Z;
});
Define(Vec4.set(v1, v2), function () {
    v2.X = v1.X;
    v2.Y = v1.Y;
    v2.Z = v1.Z;
    v2.W = v1.W;
});
Define(Vec2.set(_x, _y, v), function () {
    v.X = _x;
    v.Y = _y;
});
Define(Vec3.set(_x, _y, _z, v), function () {
    v.X = _x;
    v.Y = _y;
    v.Z = _z;
});
Define(Vec4.set(_x, _y, _z, _w, v), function () {
    v.X = _x;
    v.Y = _y;
    v.Z = _z;
    v.W = _w;
});

Define(Vector2(), function () {
    glMatrixArrayType(2);
});
Define(Vector3(x, y, z), function () {
    glMatrixArrayType([x, y, z]);
});
Define(Vector3(c), function () {
    glMatrixArrayType([c]);
});
Define(Vector4(x, y, z, w), function () {
    glMatrixArrayType([x, y, z, w]);
});

Define(Vector4(c, w), function () {
    glMatrixArrayType([c, c, c, w]);
});

Define(Vector4(c), function () {
    glMatrixArrayType([c, c, c, c]);
});

//Define(Vec2.create(), function(){new glMatrixArrayType(2);});
Define(Vector3(), function () {
    glMatrixArrayType(3);
});
//Define(Vec3.create(), function(){new glMatrixArrayType(3);});
Define(Vector4(), function () {
    glMatrixArrayType(4);
});
//Define(Vec4.create(), function(){new glMatrixArrayType(4);});
Define(Matrix3(), function () {
    glMatrixArrayType(9);
});
//Define(Mat3.create(), function(){new glMatrixArrayType(9);});
Define(Matrix4(), function () {
    glMatrixArrayType(16);
});
//Define(Mat4.create(), function(){new glMatrixArrayType(16);});

Define(Mat4.set(mat, dest), function () {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
});
Define(Mat4.set3x3(mat, dest), function () {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];

    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];

    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];

    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
});
Define(Mat3.set(mat, dest), function () {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
});
/*
 * Vec2 - 2 Dimensional Vector
 */
var Vec2 = {};

/*
 * Vec2.create
 * Creates a new instance of a Vec2 using the default array type
 * Any javascript array containing at least 2 numeric elements can serve as a Vec2
 *
 * Params:
 * vec - Optional, Vec2 containing values to initialize with
 *
 * Returns:
 * New Vec2
 */
Vec2.create = function () {
    var dest = new glMatrixArrayType(2);

    switch (arguments.length) {
        case 1:
            dest[0] = arguments[0][0];
            dest[1] = arguments[0][1];
            break;
        case 2:
            dest[0] = arguments[0];
            dest[1] = arguments[1];
            break;
    }

    return dest;
};

/*
 * Vec2.set
 * Copies the values of one Vec2 to another
 *
 * Params:
 * vec - Vec2 containing values to copy
 * dest - Vec2 receiving copied values
 *
 * Returns:
 * dest
 */
Vec2.set = function (vec, dest) {
    dest[0] = vec[0];
    dest[1] = vec[1];

    return dest;
};

/*
 * Vec2.add
 * Performs a vector addition
 *
 * Params:
 * vec - Vec2, first operand
 * vec2_ - Vec2, second operand
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec2.add = function (vec, vec2_, dest) {
    if (!dest || vec == dest) {
        vec[0] += vec2_[0];
        vec[1] += vec2_[1];
        return vec;
    }

    dest[0] = vec[0] + vec2_[0];
    dest[1] = vec[1] + vec2_[1];
    return dest;
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
Vec2.subtract = function (vec, vec2_, dest) {
    if (!dest || vec == dest) {
        vec[0] -= vec2_[0];
        vec[1] -= vec2_[1];
        return vec;
    }

    dest[0] = vec[0] - vec2_[0];
    dest[1] = vec[1] - vec2_[1];
    return dest;
};
Vec2.sub = Vec2.subtract;

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
Vec2.negate = function (vec, dest) {
    if (!dest) {dest = vec;}

    dest[0] = -vec[0];
    dest[1] = -vec[1];
    return dest;
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
Vec2.scale = function (vec, val, dest) {
    if (!dest || vec == dest) {
        vec[0] *= val;
        vec[1] *= val;
        return vec;
    }

    dest[0] = vec[0] * val;
    dest[1] = vec[1] * val;
    return dest;
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
Vec2.normalize = function (vec, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0], y = vec[1];
    var len = Math.sqrt(x * x + y * y);

    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        return dest;
    } else if (len == 1) {
        dest[0] = x;
        dest[1] = y;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    return dest;
};

/*
 * Vec2.cross
 * Generates the cross product of two vec2s
 *
 * Params:
 * vec - Vec2, first operand
 * Vec2 - Vec2, second operand
 * dest - Optional, Vec2 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Vec2.cross = function (vec, vec2_, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0], y = vec[1];
    var x2 = vec2_[0], y2 = vec2_[1];

    dest[0] = y * z2 - z * y2;
    dest[1] = z * x2 - x * z2;
    return dest;
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
Vec2.length = function (vec) {
    var x = vec[0], y = vec[1];
    return Math.sqrt(x * x + y * y);
};

Vec2.lengthSquare = function (vec) {
    var x = vec[0], y = vec[1];
    return x * x + y * y;
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
Vec2.dot = function (vec, vec2_) {
    return vec[0] * vec2_[0] + vec[1] * vec2_[1];
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
Vec2.direction = function (vec, vec2_, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0] - vec2_[0];
    var y = vec[1] - vec2_[1];

    var len = Math.sqrt(x * x + y * y);
    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    return dest;
};

/*
 * Vec2.lerp
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
Vec2.lerp = function (vec, vec2_, lerp, dest) {
    if (!dest) {dest = vec;}

    dest[0] = vec[0] + lerp * (vec2_[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2_[1] - vec[1]);

    return dest;
}

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
Vec2.str = function (vec) {
    return '[' + vec[0] + ', ' + vec[1] + ']';
};

Vec2.isEqual = function (vec0, vec1) {
    if (vec0[0] != vec1[0]) {
        return false;
    }
    if (vec0[1] != vec1[1]) {
        return false;
    }
    return true;
}

Vec2.isClear = function (vec) {
    if (vec[0] != 0) {
        return false;
    }
    if (vec[1] != 0) {
        return false;
    }
    return true;
}

Vec2.clear = function (vec) {
    vec[0] = 0;
    vec[1] = 0;
}

/*
 * Vec3 - 3 Dimensional Vector
 */
var Vec3 = {};

/*
 * Vec3.create
 * Creates a new instance of a Vec3 using the default array type
 * Any javascript array containing at least 3 numeric elements can serve as a Vec3
 *
 * Params:
 * vec - Optional, Vec3 containing values to initialize with
 *
 * Returns:
 * New Vec3
 */
Vec3.create = function () {
    var dest = new glMatrixArrayType(3);

    switch (arguments.length) {
        case 1:
            dest[0] = arguments[0][0];
            dest[1] = arguments[0][1];
            dest[2] = arguments[0][2];
            break;
        case 3:
            dest[0] = arguments[0];
            dest[1] = arguments[1];
            dest[2] = arguments[2];
            break;
    }

    return dest;
};

/*
 * Vec3.set
 * Copies the values of one Vec3 to another
 *
 * Params:
 * vec - Vec3 containing values to copy
 * dest - Vec3 receiving copied values
 *
 * Returns:
 * dest
 */
Vec3.set = function (vec, dest) {
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];

    return dest;
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
Vec3.add = function (vec, vec2_, dest) {
    if (!dest || vec == dest) {
        vec[0] += vec2_[0];
        vec[1] += vec2_[1];
        vec[2] += vec2_[2];
        return vec;
    }

    dest[0] = vec[0] + vec2_[0];
    dest[1] = vec[1] + vec2_[1];
    dest[2] = vec[2] + vec2_[2];
    return dest;
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
Vec3.subtract = function (vec, vec2_, dest) {
    if (!dest || vec == dest) {
        vec[0] -= vec2_[0];
        vec[1] -= vec2_[1];
        vec[2] -= vec2_[2];
        return vec;
    }

    dest[0] = vec[0] - vec2_[0];
    dest[1] = vec[1] - vec2_[1];
    dest[2] = vec[2] - vec2_[2];
    return dest;
};

Vec3.toTranslationMatrix = function (vec, dest) {
    if (!dest) {
        dest = new Matrix4;
    }

    Mat4.identity(dest);

    dest._14 = vec.X;
    dest._24 = vec.Y;
    dest._34 = vec.Z;

    return dest;
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
Vec3.negate = function (vec, dest) {
    if (!dest) {dest = vec;}

    dest[0] = -vec[0];
    dest[1] = -vec[1];
    dest[2] = -vec[2];
    return dest;
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
Vec3.scale = function (vec, val, dest) {
    if (!dest || vec == dest) {
        vec[0] *= val;
        vec[1] *= val;
        vec[2] *= val;
        return vec;
    }

    dest[0] = vec[0] * val;
    dest[1] = vec[1] * val;
    dest[2] = vec[2] * val;
    return dest;
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
Vec3.normalize = function (vec, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0], y = vec[1], z = vec[2];
    var len = Math.sqrt(x * x + y * y + z * z);

    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        return dest;
    } else if (len == 1) {
        dest[0] = x;
        dest[1] = y;
        dest[2] = z;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
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
Vec3.cross = function (vec, vec2_, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0], y = vec[1], z = vec[2];
    var x2 = vec2_[0], y2 = vec2_[1], z2 = vec2_[2];

    dest[0] = y * z2 - z * y2;
    dest[1] = z * x2 - x * z2;
    dest[2] = x * y2 - y * x2;
    return dest;
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
Vec3.length = function (vec) {
    var x = vec[0], y = vec[1], z = vec[2];
    return Math.sqrt(x * x + y * y + z * z);
};
Vec3.lengthSquare = function (vec) {
    var x = vec[0], y = vec[1], z = vec[2];
    return x * x + y * y + z * z;
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
Vec3.dot = function (vec, vec2_) {
    return vec[0] * vec2_[0] + vec[1] * vec2_[1] + vec[2] * vec2_[2];
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
Vec3.direction = function (vec, vec2_, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0] - vec2_[0];
    var y = vec[1] - vec2_[1];
    var z = vec[2] - vec2_[2];

    var len = Math.sqrt(x * x + y * y + z * z);
    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    return dest;
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
Vec3.lerp = function (vec, vec2_, lerp, dest) {
    if (!dest) {dest = vec;}

    dest[0] = vec[0] + lerp * (vec2_[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2_[1] - vec[1]);
    dest[2] = vec[2] + lerp * (vec2_[2] - vec[2]);

    return dest;
}

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
Vec3.str = function (vec) {
    return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
};

Vec3.isEqual = function (vec0, vec1) {
    if (vec0[0] != vec1[0]) {
        return false;
    }
    if (vec0[1] != vec1[1]) {
        return false;
    }
    if (vec0[2] != vec1[2]) {
        return false;
    }
    return true;
}

Vec3.isClear = function (vec) {
    if (vec[0] != 0) {
        return false;
    }
    if (vec[1] != 0) {
        return false;
    }
    if (vec[2] != 0) {
        return false;
    }
    return true;
}

Vec3.clear = function (vec) {
    vec[0] = 0;
    vec[1] = 0;
    vec[2] = 0;
}

/*
 * Vec4 - 3 Dimensional Vector
 */
var Vec4 = {};

/*
 * Vec4.create
 * Creates a new instance of a Vec4 using the default array type
 * Any javascript array containing at least 3 numeric elements can serve as a Vec4
 *
 * Params:
 * vec - Optional, Vec4 containing values to initialize with
 *
 * Returns:
 * New Vec4
 */
Vec4.create = function () {
    var dest = new glMatrixArrayType(4);

    switch (arguments.length) {
        case 1:
            dest[0] = arguments[0][0];
            dest[1] = arguments[0][1];
            dest[2] = arguments[0][2];
            dest[3] = arguments[0][3];
            break;
        case 4:
            dest[0] = arguments[0];
            dest[1] = arguments[1];
            dest[2] = arguments[2];
            dest[3] = arguments[3];
            break;
    }

    return dest;
};

/*
 * Vec4.set
 * Copies the values of one Vec4 to another
 *
 * Params:
 * vec - Vec4 containing values to copy
 * dest - Vec4 receiving copied values
 *
 * Returns:
 * dest
 */
Vec4.set = function (vec, dest) {
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
    dest[3] = vec[3];

    return dest;
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
Vec4.add = function (vec, vec2_, dest) {
    if (!dest || vec == dest) {
        vec[0] += vec2_[0];
        vec[1] += vec2_[1];
        vec[2] += vec2_[2];
        vec[3] += vec2_[3];
        return vec;
    }

    dest[0] = vec[0] + vec2_[0];
    dest[1] = vec[1] + vec2_[1];
    dest[2] = vec[2] + vec2_[2];
    dest[3] = vec[3] + vec2_[3];
    return dest;
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
Vec4.subtract = function (vec, vec2_, dest) {
    if (!dest || vec == dest) {
        vec[0] -= vec2_[0];
        vec[1] -= vec2_[1];
        vec[2] -= vec2_[2];
        vec[3] -= vec2_[3];
        return vec;
    }

    dest[0] = vec[0] - vec2_[0];
    dest[1] = vec[1] - vec2_[1];
    dest[2] = vec[2] - vec2_[2];
    dest[3] = vec[3] - vec2_[3];
    return dest;
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
Vec4.negate = function (vec, dest) {
    if (!dest) {dest = vec;}

    dest[0] = -vec[0];
    dest[1] = -vec[1];
    dest[2] = -vec[2];
    dest[3] = -vec[3];
    return dest;
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
Vec4.scale = function (vec, val, dest) {
    if (!dest || vec == dest) {
        vec[0] *= val;
        vec[1] *= val;
        vec[2] *= val;
        vec[3] *= val;
        return vec;
    }

    dest[0] = vec[0] * val;
    dest[1] = vec[1] * val;
    dest[2] = vec[2] * val;
    dest[3] = vec[3] * val;
    return dest;
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
Vec4.normalize = function (vec, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    var len = Math.sqrt(x * x + y * y + z * z + w * w);

    if (!len) {
        dest[0] = 0;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        return dest;
    } else if (len == 1) {
        dest[0] = x;
        dest[1] = y;
        dest[2] = z;
        dest[3] = w;
        return dest;
    }

    len = 1 / len;
    dest[0] = x * len;
    dest[1] = y * len;
    dest[2] = z * len;
    dest[3] = w * len;
    return dest;
};

/*
 * Vec4.cross
 * Generates the cross product of two vec4s
 *
 * Params:
 * vec - Vec4, first operand
 * Vec2 - Vec4, second operand
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
/*
 Vec4.cross = function(vec, Vec2, dest){
 if(!dest) { dest = vec; }

 var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
 var x2 = Vec2[0], y2 = Vec2[1], z2 = Vec2[2], w2 = vec[3];

 dest[0] = y*z2 - z*y2;
 dest[1] = z*x2 - x*z2;
 dest[2] = x*y2 - y*x2;
 dest[3] = x*y2 - y*x2;
 return dest;
 };
 */

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
Vec4.length = function (vec) {
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
};
Vec4.lengthSquare = function (vec) {
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    return x * x + y * y + z * z + w * w;
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
Vec4.dot = function (vec, vec2_) {
    return vec[0] * vec2_[0] + vec[1] * vec2_[1] + vec[2] * vec2_[2] + vec[3] * vec2_[3];
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
Vec4.direction = function (vec, vec2_, dest) {
    if (!dest) {dest = vec;}

    var x = vec[0] - vec2_[0];
    var y = vec[1] - vec2_[1];
    var z = vec[2] - vec2_[2];
    var w = vec[3] - vec2_[3];

    var len = Math.sqrt(x * x + y * y + z * z + w * w);
    if (!len) {
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
Vec4.lerp = function (vec, vec2_, lerp, dest) {
    if (!dest) {dest = vec;}

    dest[0] = vec[0] + lerp * (vec2_[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2_[1] - vec[1]);
    dest[2] = vec[2] + lerp * (vec2_[2] - vec[2]);
    dest[3] = vec[3] + lerp * (vec2_[3] - vec[3]);

    return dest;
}

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
Vec4.str = function (vec) {
    return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ', ' + vec[3] + ']';
};

Vec4.isEqual = function (vec0, vec1) {
    if (vec0[0] != vec1[0]) {
        return false;
    }
    if (vec0[1] != vec1[1]) {
        return false;
    }
    if (vec0[2] != vec1[2]) {
        return false;
    }
    if (vec0[3] != vec1[3]) {
        return false;
    }
    return true;
}

Vec4.isClear = function (vec) {
    if (vec[0] != 0) {
        return false;
    }
    if (vec[1] != 0) {
        return false;
    }
    if (vec[2] != 0) {
        return false;
    }
    if (vec[3] != 0) {
        return false;
    }
    return true;
}

Vec4.clear = function (vec) {
    vec[0] = 0;
    vec[1] = 0;
    vec[2] = 0;
    vec[3] = 0;
}

/*
 * Mat3 - 3x3 Matrix
 */
var Mat3 = {};

/*
 * Mat3.create
 * Creates a new instance of a Mat3 using the default array type
 * Any javascript array containing at least 9 numeric elements can serve as a Mat3
 *
 * Params:
 * mat - Optional, Mat3 containing values to initialize with
 *
 * Returns:
 * New Mat3
 */
Mat3.create = function (mat) {
    var dest = new glMatrixArrayType(9);

    if (mat) {
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
    }

    return dest;
};

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
Mat3.set = function (mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    return dest;
};

/*
 * Mat3.identity
 * Sets a Mat3 to an identity matrix
 *
 * Params:
 * dest - Mat3 to set
 *
 * Returns:
 * dest
 */
Mat3.identity = function (dest) {
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 1;
    dest[5] = 0;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 1;
    return dest;
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
Mat3.transpose = function (mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat == dest) {
        var a01 = mat[1], a02 = mat[2];
        var a12 = mat[5];

        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
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
Mat3.toMat4 = function (mat, dest) {
    if (!dest) {dest = Mat4.create();}

    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = 0;

    dest[4] = mat[3];
    dest[5] = mat[4];
    dest[6] = mat[5];
    dest[7] = 0;

    dest[8] = mat[6];
    dest[9] = mat[7];
    dest[10] = mat[8];
    dest[11] = 0;

    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;

    return dest;
}

/*
 * Mat3.str
 * Returns a string representation of a Mat3
 *
 * Params:
 * mat - Mat3 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
Mat3.str = function (mat) {
    return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
        ', ' + mat[3] + ', ' + mat[4] + ', ' + mat[5] +
        ', ' + mat[6] + ', ' + mat[7] + ', ' + mat[8] + ']';
};

/*
 * Mat4 - 4x4 Matrix
 */
var Mat4 = {};

/*
 * Mat4.create
 * Creates a new instance of a Mat4 using the default array type
 * Any javascript array containing at least 16 numeric elements can serve as a Mat4
 *
 * Params:
 * mat - Optional, Mat4 containing values to initialize with
 *
 * Returns:
 * New Mat4
 */
Mat4.create = function (mat) {
    var dest = new glMatrixArrayType(16);

    if (mat) {
        dest[0] = mat[0];
        dest[1] = mat[1];
        dest[2] = mat[2];
        dest[3] = mat[3];
        dest[4] = mat[4];
        dest[5] = mat[5];
        dest[6] = mat[6];
        dest[7] = mat[7];
        dest[8] = mat[8];
        dest[9] = mat[9];
        dest[10] = mat[10];
        dest[11] = mat[11];
        dest[12] = mat[12];
        dest[13] = mat[13];
        dest[14] = mat[14];
        dest[15] = mat[15];
    }

    return dest;
};

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
Mat4.set = function (mat, dest) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
    return dest;
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
Mat4.identity = function (dest) {
    dest[0] = 1;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    dest[4] = 0;
    dest[5] = 1;
    dest[6] = 0;
    dest[7] = 0;
    dest[8] = 0;
    dest[9] = 0;
    dest[10] = 1;
    dest[11] = 0;
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;
    return dest;
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
Mat4.transpose = function (mat, dest) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat == dest) {
        var a01 = mat[1], a02 = mat[2], a03 = mat[3];
        var a12 = mat[6], a13 = mat[7];
        var a23 = mat[11];

        mat[1] = mat[4];
        mat[2] = mat[8];
        mat[3] = mat[12];
        mat[4] = a01;
        mat[6] = mat[9];
        mat[7] = mat[13];
        mat[8] = a02;
        mat[9] = a12;
        mat[11] = mat[14];
        mat[12] = a03;
        mat[13] = a13;
        mat[14] = a23;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[4];
    dest[2] = mat[8];
    dest[3] = mat[12];
    dest[4] = mat[1];
    dest[5] = mat[5];
    dest[6] = mat[9];
    dest[7] = mat[13];
    dest[8] = mat[2];
    dest[9] = mat[6];
    dest[10] = mat[10];
    dest[11] = mat[14];
    dest[12] = mat[3];
    dest[13] = mat[7];
    dest[14] = mat[11];
    dest[15] = mat[15];
    return dest;
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
Mat4.determinant = function (mat) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

    return  a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
        a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
        a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
        a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
        a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
        a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
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
Mat4.inverse = function (mat, dest) {
    if (!dest) {dest = mat;}

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant (inlined to avoid double-caching)
    var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return dest;
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
Mat4.toRotationMat = function (mat, dest) {
    if (!dest) {dest = Mat4.create();}

    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = 0;
    dest[13] = 0;
    dest[14] = 0;
    dest[15] = 1;

    return dest;
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
Mat4.toMat3 = function (mat, dest) {
    if (!dest) {dest = Mat3.create();}

    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[4];
    dest[4] = mat[5];
    dest[5] = mat[6];
    dest[6] = mat[8];
    dest[7] = mat[9];
    dest[8] = mat[10];

    return dest;
};

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
 * Mat4.multiply
 * Performs a matrix multiplication
 *
 * Params:
 * mat - Mat4, first operand
 * mat2 - Mat4, second operand
 * dest - Optional, Mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
Mat4.multiply = function (mat, mat2, dest) {
    if (!dest) {dest = mat}

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

    var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
    var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
    var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
    var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];

    dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

    return dest;
};
Mat4.mult = Mat4.multiply;
/*
 * Mat4.multiplyVec3
 * Transforms a vec with the given matrix
 * 4th vector component is implicitly '1'
 *
 * Params:
 * mat - Mat4 to transform the vector with
 * vec - Vec3 to transform
 * dest - Optional, Vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Mat4.multiplyVec3 = function (mat, vec, dest) {
    if (!dest) {dest = vec}

    var x = vec[0], y = vec[1], z = vec[2];

    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];

    return dest;
};

/*
 * Mat4.multiplyVec4
 * Transforms a Vec4 with the given matrix
 *
 * Params:
 * mat - Mat4 to transform the vector with
 * vec - Vec4 to transform
 * dest - Optional, Vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
Mat4.multiplyVec4 = function (mat, vec, dest) {
    if (!dest) {dest = vec}

    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];

    dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
    dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
    dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
    dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;

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
    return '[\n' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] + '\n' +
        ', ' + mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] + '\n' +
        ', ' + mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] + '\n' +
        ', ' + mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + '\n' +
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
Quat4.multiplyVec3 = function (quat, vec, dest) {
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


