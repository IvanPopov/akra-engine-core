/**
 * @file
 * @brief functions and classes to work with geometry primitives
 * @author sss
 *
 * Details
 */

//-------------------Start Ray2d---------------------\\

/**
 * Ray2d Class
 * @ctor
 * Constructor of Ray2d class
 */
function Ray2d () {
    /**
     * Start point of ray
     * @type Float32Array
     */
    this.v2fPoint = new Vec2;
    /**
     * Direction of ray
     * @type Float32Array
     */
    this.v2fNormal = new Vec2;
}
;

//-------------------End Ray2d---------------------\\

//-------------------Start Ray3d---------------------\\

/**
 * Ray3d Class
 * @ctor
 * Constructor of Ray2d class
 */
function Ray3d () {
    /**
     * Start point of ray
     * @type Float32Array
     */
    this.v3fPoint = new Vec3;
    /**
     * Direction of ray
     * @type Float32Array
     */
    this.v3fNormal = new Vec3;
}
;

//-------------------End Ray3d---------------------\\

//-------------------Start Segment2d---------------------\\

/**
 * Segment2d Class
 * @ctor
 * Constructor of Segment2d class
 */
function Segment2d () {
    /**
     * Ray of segment
     * @type Ray2d
     */
    this.pRay = new Ray2d();
    /**
     * Distance
     * @type Float
     */
    this.fDistance = 0.0;
}
;

PROPERTY(Segment2d, "point",
        /**
         * @property Float32Array point()
         * Getter for point
         * @memberof Segment2d
         * @return Value of point
         */
        function () {
            return this.pRay.v2fPoint;
        },
        /**
          * @property void point(Float32Array v2fPoint)
          * Setter for point
          * @memberof Segment2d
          * @param v2fPoint New point to set
          */
        function (v2fPoint) {
           this.pRay.v2fPoint.set(v2fPoint);
        });

Object.defineProperty(Segment2d.prototype, "normal", {
         /**
          * @property void normal(Float32Array v2fNormal)
          * Setter for normal
          * @memberof Segment2d
          * @param v2fNormal New normal to set
          */
         set: function (v2fNormal) {
             this.pRray.v2fNormal.set(v2fNormal);
         },
              /**
               * @property Float32Array normal()
               * Getter for normal
               * @memberof Segment2d
               * @return Value of normal
               */
              get: function () {
                  return this.pRay.v2fNormal;
              }
});

//-------------------End Segment2d---------------------\\

//-------------------Start Segment3d---------------------\\

/**
 * Segment3d Class
 * @ctor
 * Constructor of Segment3d class
 */
function Segment3d () {
    /**
     * Ray of segment
     * @type Ray3d
     */
    this.pRay = new Ray3d();
    /**
     * Distance
     * @type Float
     */
    this.fDistance = 0.0;
}
;

Object.defineProperty(Segment3d.prototype, "point", {
         /**
          * @property void point(Float32Array v3fPoint)
          * Setter for point
          * @memberof Segment3d
          * @param v3fPoint New point to set
          */
         set: function (v3fPoint) {
             this.pRay.v3fPoint.set(v3fPoint);
         },
              /**
               * @property Float32Array point()
               * Getter for point
               * @memberof Segment3d
               * @return Value of point
               */
              get: function () {
                  return this.pRay.v3fPoint;
              }
});

Object.defineProperty(Segment3d.prototype, "normal", {
         /**
          * @property void normal(Float32Array v3fNormal)
          * Setter for normal
          * @memberof Segment3d
          * @param v3fNormal New normal to set
          */
         set: function (v3fNormal) {
             this.pRay.v3fNormal.set(v3fNormal);
         },
              /**
               * @property Float32Array normal()
               * Getter for normal
               * @memberof Segment3d
               * @return Value of normal
               */
              get: function () {
                  return this.pRay.v3fNormal;
              }
});

//-------------------End Segment3d---------------------\\

//-------------------Start Circle---------------------\\

/**
 * @property Circle(Circle pCircle)
 * Constructor
 * @memberof Circle
 * @param pCircle New circle
 */
/**
 * @property Circle(Float32Array v2fCenter, Float fRadius)
 * Constructor
 * @memberof Circle
 * @param v2fCenter New center
 * @param fRadius New radius
 */
/**
 * @property Circle(Float fX, Float fY, float fRadius)
 * Constructor
 * @memberof Circle
 * @param fX center.x
 * @param fY center.y
 * @param fRadius New radius
 */
/**
 * Class for represent circle
 * @ctor
 * Constructor of Circle class
 */
function Circle () {
    /**
     * Radius of circle
     * @type Ray3d
     */
    this.fRadius = 0.0;
    /**
     * Point of center
     * @type Float32Array
     */
    this.v2fCenter = null;

    switch (arguments.length) {
        case 0:
            this.v2fCenter = new Vec2;
            break;
        case 1:
            this.v2fCenter = new Vec2(arguments[0].v2fCenter);
            this.fRadius = arguments[0].fRadius;
            break;
        case 2:
            this.v2fCenter = new Vec2(arguments[0]);
            this.fRadius = arguments[1];
            break;
        case 3:
            this.v2fCenter = new Vec2(arguments[0], arguments[1]);
            this.fRadius = arguments[2];
            break;
    }
    ;
}
;

/**
 * Operator ==
 * @tparam Circle pCircle Circle to compare with
 * @treturn Boolean True if equal, otherwise false
 */
Circle.prototype.isEqual = function (pCircle) {
    INLINE();
    return (this.v2fCenter.isEqual(pCircle.v2fCenter) && this.fRadius == pCircle.fRadius);
};
/**
 * Operator =
 * @tparam Circle pCircle Circle to equal
 */
Circle.prototype.eq = function (pCircle) {
    INLINE();
    this.v2fCenter.set(pCircle.v2fCenter);
    this.fRadius = pCircle.fRadius;
};
/**
 * Clear Circle
 */
Circle.prototype.clear = function () {
    INLINE();
    this.v2fCenter.clear();
    this.fRadius = 0.0;
};
/**
 * Chech for == 0
 * @treturn Boolean True if object == 0
 */
Circle.prototype.isClear = function () {
    INLINE();
    return ((this.v2fCenter.isClear()) && (0.0 == this.fRadius));
};
/**
 * @property void set(Circle pCircle)
 * Set circle
 * @memberof Circle
 * @param pCircle New circle
 */
/**
 * @property void set(Float32Array v2fCenter, Float fRadiaus)
 * Set circle
 * @memberof Circle
 * @param v2fCenter new center
 * @param fRadiaus new radius
 */
/**
 * @property void set(Float fX, Float fY, Float fRadiaus)
 * Set circle
 * @memberof Circle
 * @param fX new center x coord
 * @param fY new center y coord
 * @param fRadiaus new radius
 */
Circle.prototype.set = function () {
    INLINE();
    switch (arguments.length) {
        case 1:
            this.v2fCenter.set(arguments[0].v2fCenter);
            this.fRadius = arguments[0].fRadius;
            break;
        case 2:
            this.v2fCenter.set(arguments[0]);
            this.fRadius = arguments[1];
            break;
        case 3:
            this.v2fCenter.set(arguments[0], arguments[1]);
            this.fRadius = arguments[2];
            break;
    }
};
/**
 * Is circle valid
 * @treturn Boolean valid
 */
Circle.prototype.isValid = function () {
    INLINE();
    return (this.fRadius >= 0);
};
/**
 * debug message about valid of circle
 */
Circle.prototype.assertValid = function () {
    INLINE();
    debug_assert(this.fRadius >= 0.0, "sphere inverted");
};
/**
 * Add offset to circle
 * @tparam Float32Array v2fOffset offset of center of circle
 */
Circle.prototype.offset = function (v2fOffset) {
    INLINE();
    this.v2fCenter.add(v2fOffset);
};
/**
 * Incrase radius of circle
 * @tparam Float fInc value of increment
 */
Circle.prototype.expand = function (fInc) {
    INLINE();
    this.fRadius += fInc;
};
/**
 * Normalize value of circle radius
 */
Circle.prototype.normalize = function () {
    INLINE();
    this.fRadius = Math.abs(this.fRadius);
};

//-------------------End Circle---------------------\\

//-------------------Start Sphere---------------------\\

/**
 * @property Sphere(Sphere pSphere)
 * Constructor
 * @memberof Sphere
 * @param pSphere New Sphere
 */
/**
 * @property Sphere(Float32Array v3fCenter, Float fRadius)
 * Constructor
 * @memberof Sphere
 * @param v3fCenter New center
 * @param fRadius New radius
 */
/**
 * @property Sphere(Float fX, Float fY, Float fZ, Float fRadius)
 * Constructor
 * @memberof Sphere
 * @param fX center.x
 * @param fY center.y
 * @param fZ center.z
 * @param fRadius New radius
 */
/**
 * Class for represent Sphere
 * @ctor
 * Constructor of Sphere class
 */
function Sphere () {
    /**
     * Radius of Sphere
     * @type Float
     */
    this.fRadius = 0.0;
    /**
     * Center of Sphere
     * @type Float32Array
     */
    this.v3fCenter = null;

    switch (arguments.length) {
        case 0:
            this.v3fCenter = new Vec3;
            break;
        case 1:
            this.v3fCenter = new Vec3(arguments[0].v3fCenter);
            this.fRadius = arguments[0].fRadius;
            break;
        case 2:
            this.v3fCenter = new Vec3(arguments[0]);
            this.fRadius = arguments[1];
            break;
        case 4:
            this.v3fCenter = new Vec3(arguments[0], arguments[1], arguments[2]);
            this.fRadius = arguments[3];
            break;
    }
    ;
}
;

Object.defineProperty(Sphere.prototype, "circle", {
         /**
          * @property void circle(Circle pCircle)
          * Setter for circle
          * @memberof Sphere
          * @param pCircle Circle
          */
         set: function (pCircle) {
             this.v3fCenter.pData.X = pCircle.v2fCenter.pData.X;
             this.v3fCenter.pData.Y = pCircle.v2fCenter.pData.Y;
             this.fRadius = pCircle.fRadius;
         },
              /**
               * @property Circle circle()
               * Getter for circle
               * @memberof Sphere
               * @return Circle
               */
              get: function () {
                  return new Circle(this.v3fCenter.pData.X, this.v3fCenter.pData.Y, this.fRadius);
              }
});
Object.defineProperty(Sphere.prototype, "z", {
         /**
          * @property void z(Float fZ)
          * Setter for z coord
          * @memberof Sphere
          * @param fZ New Z coord
          */
         set: function (fZ) {
             this.v3fCenter.pData.Z = fZ;
         },
              /**
               * @property Float z()
               * Getter for z coord
               * @memberof Sphere
               * @return Z coord
               */
              get: function () {
                  return this.v3fCenter.pData.Z;
              }
});
/**
 * Operator ==
 * @tparam Sphere pSphere Sphere to compare with
 * @treturn Boolean true if equal
 */
Sphere.prototype.isEqual = function (pSphere) {
    INLINE();
    return (pSphere.v3fCenter.isEqual(this.v3fCenter) && this.fRadius == pSphere.fRadius);
};
/**
 * Operator =
 * @tparam Sphere pSphere Sphere to eq with
 */
Sphere.prototype.eq = function (pSphere) {
    INLINE();
    this.v3fCenter.set(pSphere.v3fCenter);
    this.fRadius = pSphere.fRadius;
};
/**
 * Set to 0
 */
Sphere.prototype.clear = function () {
    INLINE();
    this.v3fCenter.clear();
    this.fRadius = 0.0;
};
/**
 * Is set to 0
 * @treturn Boolean Clear or not
 */
Sphere.prototype.isClear = function () {
    INLINE();
    return (this.v3fCenter.isClear() && (0.0 == this.fRadius));
};
/**
 * @property void set(Sphere pSphere)
 * Set Sphere
 * @memberof Sphere
 * @param pSphere New sphere
 */
/**
 * @property void set(Float32Array v3fCenter, Float fRadiaus)
 * Set Sphere
 * @memberof Sphere
 * @param v3fCenter new center
 * @param fRadiaus new radius
 */
/**
 * @property void set(Float fX, Float fY, Float fZ, Float fRadiaus)
 * Set Sphere
 * @memberof Sphere
 * @param fX new center x coord
 * @param fY new center y coord
 * @param fZ new center y coord
 * @param fRadiaus new radius
 */
Sphere.prototype.set = function () {
    INLINE();
    switch (arguments.length) {
        case 1:
            this.v3fCenter.set(arguments[0].v3fCenter);
            this.fRadius = arguments[0].fRadius;
            break;
        case 2:
            this.v3fCenter.set(arguments[0]);
            this.fRadius = arguments[1];
            break;
        case 4:
            this.v3fCenter.set(arguments)
            this.fRadius = arguments[3];
            break;
    }

};
/**
 * Is sphere valid
 * @treturn Boolean
 */
Sphere.prototype.isValid = function () {
    INLINE();
    return (this.fRadius >= 0.0);
};
/**
 * Trace valid or not
 */
Sphere.prototype.assertValid = function () {
    INLINE();
    debug_assert(this.fRadius >= 0.0, "sphere inverted");
};
/**
 * Add offset to sphere
 * @tparam Float32Array v3fOffset offset
 */
Sphere.prototype.offset = function (v3fOffset) {
    INLINE();
    this.v3fCenter.add(v3fOffset);
};
/**
 * Incrase radius
 * @tparam Float fInc Increment
 */
Sphere.prototype.expand = function (fInc) {
    INLINE();
    this.fRadius += fInc;
};
/**
 * Normalize Sphere
 */
Sphere.prototype.normalize = function () {
    INLINE();
    this.fRadius = Math.abs(this.fRadius);
};

//-------------------End Sphere---------------------\\

//-------------------Start Plane2D---------------------\\

/**
 * @property Plane2d(Plane2d pPlane2d)
 * Constructor
 * @memberof Plane2d
 * @param pPlane2d New Plane2d
 */
/**
 * @property Plane2d(Float32Array v2fNormal, Float fDistance)
 * Constructor
 * @memberof Plane2d
 * @param v2fNormal New normal
 * @param fDistance New distane
 */
/**
 * @property Plane2d(Float32Array v2fPoint0, Float32Array v2fPoint1)
 * Constructor
 * @memberof Plane2d
 * @param v2fPoint0 Point 0
 * @param v2fPoint1 Point 1
 */
/**
 * Class for represent Plane2d
 * A Plane2d in 2D Space represented in point-normal form (Ax + By + D = 0).
 * @ctor
 * Constructor of Sphere class
 */
function Plane2d () {
    /**
     * Distance - (D)
     * @type Float
     */
    this.fDistance = 0.0;
    /**
     * Normal - (A,B)
     * @type Float32Array
     */
    this.v2fNormal = null;
    switch (arguments.length) {
        case 0:
            this.v2fNormal = new Vec2;
            break;
        case 1:
            this.v2fNormal = new Vec2(arguments[0].v2fNormal);
            this.fDistance = (arguments[0].fDistance);
            break;
        case 2:
            if (typeof(arguments[1]) == "number") {
                this.v2fNormal = new Vec2(arguments[0]);
                this.fDistance = arguments[1];
            }
            else {
                this.v2fNormal = new Vec2;
                var vec0 = Vec2(arguments[1]).subtract(Vec2(arguments[0]), this.v2fNormal);
                var x = vec0.pData.X;
                var y = vec0.pData.Y;
                vec0.pData.X = -y;
                vec0.pData.Y = x;
                this.fDistance = -vec0.dot(Vec2(arguments[0]));
            }
            break;
    }
    ;
}
;
/**
 * Operator =
 * @tparam Plane2d pPlane Plane to equate
 */
Plane2d.prototype.eq = function (pPlane) {
    INLINE();
    this.v2fNormal.set(pPlane);
    this.fDistance = pPlane.fDistance;
};
/**
 * Operator ==
 * @tparam Plane2d pPlane Plane to compare
 * @treturn Boolean Result of compare
 */
Plane2d.prototype.isEqual = function (pPlane) {
    INLINE();
    return (this.v2fNormal.isEqual(pPlane.v2fNormal) && this.fDistance == pPlane.fDistance);
};
/**
 * Given Z and Y, solve for X on the plane
 * @tparam Float fY y-coord
 * @treturn Float x-coord or 0
 */
Plane2d.prototype.solveForX = function (fY) {
    INLINE();
    //Ax + By + Cz + D = 0
    // Ax = -(By + Cz + D)
    // x = -(By + Cz + D)/A
    if (this.v2fNormal.pData.X) {
        return ( -(this.v2fNormal.pData.Y * fY + this.fDistance) / this.v2fNormal.pData.X);
    }
    return (0.0);
};
/**
 * Given Z and X, solve for Y on the plane
 * @tparam Float fX x-coord
 * @treturn Float y-coord or 0
 */
Plane2d.prototype.solveForY = function (fX) {
    INLINE();
    //Ax + By + Cz + D = 0
    // By = -(Ax + Cz + D)
    // y = -(Ax + Cz + D)/B
    if (this.v2fNormal.pData.Y) {
        return ( -(this.v2fNormal.pData.X * fX + this.fDistance) / this.v2fNormal.pData.Y );
    }
    return (0.0);
};
/**
 * Given a 2D point in space, project the point onto this plane along the plane normal
 * @tparam Float32Array v2fPoint Point in 2d space
 * @treturn Float32Array Point in 2D space
 */
Plane2d.prototype.projectPointToPlane = function (v2fPoint) {
    INLINE();
    var distance = (this.v2fNormal.dot(v2fPoint) + this.fDistance);
    var v2fRes = new Vec2;
    v2fRes.pData.X = this.v2fNormal.pData.X * (-distance) + v2fPoint.pData.X;
    v2fRes.pData.Y = this.v2fNormal.pData.Y * (-distance) + v2fPoint.pData.Y;
    return v2fRes;
};
/**
 * @property void set(Float32Array v2fPoint0, Float32Array v2fPoint1)
 * Setup plane2d object given a clockwise ordering of 2D points
 * @memberof Plane2d
 * @param v2fPoint0 Point 0
 * @param v2fPoint1 Point 1
 */
/**
 * @property void set(Float32Array v2fNormal, Float fDistance)
 * Setup plane2d object given a [A, B] - normal, D - distance
 * @memberof Plane2d
 * @param v2fNormal Point 0
 * @param fDistance Distance
 */
Plane2d.prototype.set = function (arg1, arg2) {
    INLINE();
    if (typeof(arg2) == "number") {
        this.v2fNormal.set(arg1);
        this.fDistance = arg2;
    }
    else {
        var line = arg2.subtract(arg1, this.v2fNormal);
        var x = line.pData.X;
        var y = line.pData.Y;
        line.pData.X = -y;
        line.pData.Y = x;
        this.fDistance = -line.dot(Vec2(arg1));
    }
};
/**
 * Returns the signed distance between the plane and the provided 2D point. Negative
 * distances are "behind" the plane, i.e. in the opposite direction of the plane normal.
 * @tparam Float32Array v2fPoint point in 2d
 * @treturn Float distance
 */
Plane2d.prototype.signedDistance = function (v2fPoint) {
    return (this.v2fNormal.dot(v2fPoint) + this.fDistance);
};

//-------------------End Plane2D---------------------\\

//-------------------Start Plane3D---------------------\\

/**
 * @property Plane3d(Plane3d pPlane3d)
 * Constructor
 * @memberof Plane3d
 * @param pPlane3d New Plane3d
 */
/**
 * @property Plane3d(Float32Array v3fNormal, Float fDistance)
 * Constructor
 * @memberof Plane3d
 * @param v3fNormal New normal
 * @param fDistance New distane
 */
/**
 * @property Plane3d(Float32Array v3fPoint, Float32Array v3fNormal)
 * Constructor
 * @memberof Plane3d
 * @param v3fPoint Point
 * @param v3fNormal Normal
 */
/**
 * @property Plane3d(Float32Array v3fPoint0, Float32Array v3fPoint1, Float32Array v3fPoint2)
 * Constructor
 * @memberof Plane3d
 * @param v3fPoint0 Point 0
 * @param v3fPoint1 Point 1
 * @param v3fPoint2 Point 2
 */
/**
 * Plane3d Class
 * A Plane3d in 3D Space represented in point-normal form (Ax + By + Cz + D = 0).
 * The convention for the distance constant D is:
 * D = -(A, B, C) dot (X, Y, Z)
 * @ctor
 * Constructor of Plane3d class
 */
function Plane3d () {
    /**
     * Distance - (D)
     * @type Float
     */
    this.fDistance = 0.0;
    /**
     * Normal - (A,B,C)
     * @type Float32Array
     */
    this.v3fNormal = null;

    switch (arguments.length) {
        case 0:
            this.v3fNormal = new Vec3;
            break;
        case 1:
            this.v3fNormal.set(arguments[0].v3fNormal);
            this.fDistance = arguments[0].fDistance;
            break;
        case 2:
            if (typeof(arguments[1]) == "number") {
                this.v3fNormal = new Vec3(arguments[0]);
                this.fDistance = arguments[1];
            }
            else {
                this.v3fNormal = new Vec3(arguments[1]);
                this.fDistance = -arguments[0].dot(arguments[1]);
            }
            break;
        case 3:
            var sideA = new Vec3;
            var sideB = new Vec3;
            arguments[1].subtract(arguments[0], sideA);
            arguments[2].subtract(arguments[0], sideB);
            sideB.cross(sideA);
            sideB.normalize();
            this.v3fNormal = new Vec3(sideB);
            this.fDistance = -this.v3fNormal.dot(Vec3(arguments[0]));
            break;
    }
    ;
}
;
/**
 * Operator =
 * @tparam Plane3d pPlane Plane to equate
 */
Plane3d.prototype.eq = function (pPlane) {
    INLINE();
    this.v3fNormal.set(pPlane.v3fNormal);
    this.fDistance = pPlane.fDistance;
};
/**
 * Operator ==
 * @tparam Plane3d pPlane Plane to compare
 * @treturn Boolean Result of compare
 */
Plane3d.prototype.isEqual = function (pPlane) {
    INLINE();
    return (this.v3fNormal.isEqual(pPlane.v3fNormal) && this.fDistance == pPlane.fDistance);
};
/**
 * Normalize Plane
 */
Plane3d.prototype.normalize = function () {
    INLINE();
    var len = 1 / this.v3fNormal.length();
    this.v3fNormal.scale(len);
    this.fDistance *= len;
};
/**
 * Given Z and Y, solve for X on the plane
 * @tparam Float fY y-coord
 * @tparam Float fZ z-coord
 * @treturn Float x-coord
 */
Plane3d.prototype.solveForX = function (fY, fZ) {
    INLINE();
    //Ax + By + Cz + D = 0
    // Ax = -(By + Cz + D)
    // x = -(By + Cz + D)/A
    if (this.v3fNormal.pData.X) {
        return ( -(this.v3fNormal.pData.Y * fY + this.v3fNormal.pData.Z * fZ + this.fDistance) / this.v3fNormal.pData.X );
    }
    return (0.0);
};
/**
 * Given Z and X, solve for Y on the plane
 * @tparam Float fX x-coord
 * @tparam Float fZ z-coord
 * @treturn Float y-coord
 */
Plane3d.prototype.solveForY = function (fX, fZ) {
    INLINE();
    //Ax + By + Cz + D = 0
    // By = -(Ax + Cz + D)
    // y = -(Ax + Cz + D)/B
    if (this.v3fNormal.pData.Y) {
        return ( -(this.v3fNormal.pData.X * fX + this.v3fNormal.pData.Z * fZ + this.fDistance) / this.v3fNormal.pData.Y );
    }
    return (0.0);
};
/**
 * Given X and Y, solve for Z on the plane
 * @tparam Float fX x-coord
 * @tparam Float fY y-coord
 * @treturn Float z-coord
 */
Plane3d.prototype.solveForZ = function (fX, fY) {
    INLINE();
    //Ax + By + Cz + D = 0
    // Cz = -(Ax + By + D)
    // z = -(Ax + By + D)/C
    if (this.v3fNormal.pData.Z) {
        return ( -(this.v3fNormal.pData.Y * fY + this.v3fNormal.pData.X * fX + this.fDistance) / this.v3fNormal.pData.Z );
    }
    return (0.0);
};
/**
 * Given a 3D point in space, project the point onto this plane along the plane normal
 * @tparam Float32Array v3fPoint point in 3d space
 * @treturn Float32Array Point in 3d space on our plane
 */
Plane3d.prototype.projectPointToPlane = function (v3fPoint) {
    INLINE();
    var distance = (this.v3fNormal.dot(v3fPoint) + this.fDistance);
    var v3fRes = new Vec3;
    v3fRes.pData.X = this.v3fNormal.pData.X * (-distance) + v3fPoint.pData.X;
    v3fRes.pData.Y = this.v3fNormal.pData.Y * (-distance) + v3fPoint.pData.Y;
    v3fRes.pData.Z = this.v3fNormal.pData.Z * (-distance) + v3fPoint.pData.Z;
    return v3fRes;
};
/**
 * @property void set(Float32Array v3fNormal, Float fDistance)
 * Setup Plane3d object given a clockwise ordering of 3D points
 * @memberof Plane3d
 * @param v3fNormal New normal
 * @param fDistance New distane
 */
/**
 * @property void set(Float32Array v3fPoint, Float32Array v3fNormal)
 * Setup Plane3d object given a clockwise ordering of 3D points
 * @memberof Plane3d
 * @param v3fPoint Point
 * @param v3fNormal Normal
 */
/**
 * @property void set(Float32Array v3fPoint0, Float32Array v3fPoint1, Float32Array v3fPoint2)
 * Setup Plane3d object given a clockwise ordering of 3D points
 * @memberof Plane3d
 * @param v3fPoint0 Point 0
 * @param v3fPoint1 Point 1
 * @param v3fPoint2 Point 2
 */
Plane3d.prototype.set = function () {
    INLINE();
    switch (arguments.length) {
        case 2:
            if (typeof(arguments[1]) == "number") {
                this.v3fNormal.set(arguments[0]);
                this.fDistance = arguments[1];
            }
            else {
                this.v3fNormal.set(arguments[1]);
                this.fDistance = -this.v3fNormal.dot(Vec3(arguments[0]));
            }
            break;
        case 3:
            var sideA = new Vec3;
            var sideB = this.v3fNormal;
            Vec3(arguments[1]).subtract(arguments[0], sideA);
            Vec3(arguments[2]).subtract(arguments[0], sideB);
            sideB.cross(sideA);
            sideB.normalize();
            this.fDistance = -this.v3fNormal.dot(arguments[0]);
            break;
    }
    ;
};
/**
 * Unknown function
 * @tparam Float32Array m4fMatrix m4fMatrix
 * @warning Unknown!!!!
 */
Plane3d.prototype.xForm = function (m4fMatrix) {
    INLINE();
    this.v3fNormal.vec3TransformCoord(m4fMatrix, this.v3fNormal);
    this.v3fNormal.normalize();
    var point = new Vec3;
    this.v3fNormal.scale(this.fDistance, point);
    point.vec3TransformCoord(m4fMatrix, point);
    this.fDistance = -point.dot(this.v3fNormal);
};
/**    signedDistance
 * Returns the signed distance between
 * the plane and the provided 3D point.
 * Negative distances are "behind" the
 * plane, i.e. in the opposite direction
 * of the plane normal.
 * @tparam Float32Array v3fPoint point in 3d space
 * @treturn Float distance
 */
Plane3d.prototype.signedDistance = function (v3fPoint) {
    INLINE();
    return (v3fPoint.dot(this.v3fNormal) + this.fDistance);
};

//-------------------End Plane3D---------------------\\

//-------------------Start Rect2D---------------------\\

/**
 * @property Rect2d(Rect2d pRect2d)
 * Constructor
 * @memberof Rect2d
 * @param pRect2d New Rect2d
 */
/**
 * @property Rect2d(Float x0, Float x1,Float y0, Float y1)
 * Constructor
 * @memberof Rect2d
 */
/**
 * @property Rect2d(Float xSize, Float ySize);
 * Constructor
 * @memberof Rect2d
 * @param xSize
 * @param ySize
 */
/**
 * @property Rect2d(Float32Array v2fSize)
 * Constructor
 * @memberof Rect2d
 * @param v2fSize Size
 */
/**
 * Rect2d Class
 * @ctor
 * Constructor of Rect2d class
 */
function Rect2d () {
    /**
     * x0
     * @type Float
     */
    this.fX0 = 0;
    /**
     * x1
     * @type Float
     */
    this.fX1 = 0;
    /**
     * y0
     * @type Float
     */
    this.fY0 = 0;
    /**
     * y1
     * @type Float
     */
    this.fY1 = 0;
    switch (arguments.length) {
        case 1:
            if (arguments[0] instanceof Rect2d) {
                this.fX0 = arguments[0].fX0;
                this.fX1 = arguments[0].fX1;
                this.fX0 = arguments[0].fY0;
                this.fX1 = arguments[0].fY1;
            }
            else {
                this.fX1 = arguments[0].pData.X * 0.5;
                this.fX0 = -this.fX1;
                this.fY1 = arguments[0].pData.Y * 0.5;
                this.fY0 = -this.fY1;
            }
            break;
        case 2:
            this.fX1 = arguments[0] * 0.5;
            this.fX0 = -this.fX1;
            this.fY1 = arguments[1] * 0.5;
            this.fY0 = -this.fY1;
            break;
        case 4:
            this.fX0 = arguments[0];
            this.fX1 = arguments[1];
            this.fY0 = arguments[2];
            this.fY1 = arguments[3];
            break;
    }
    ;
}
;
/**
 * Operator ==
 * @tparam Float32Array pRect
 * @treturn Boolean
 */
Rect2d.prototype.isEqual = function (pRect) {
    return (this.fX0 == pRect.fX0 && this.fX1 == pRect.fX1 && this.fY0 == pRect.fY0 && this.fY1 == pRect.fY1);
};
/**
 * Operator =
 * @tparam Float32Array pRect
 */
Rect2d.prototype.eq = function (pRect) {
    this.fX0 = pRect.fX0;
    this.fX1 = pRect.fX1;
    this.fY0 = pRect.fY0;
    this.fY1 = pRect.fY1;
};
/**
 * @property void Rect2d::addSelf(Float32Array v2fVec)
 * Operator +=
 * @memberof Rect2d
 * @param v2fVec vec.x Add to x0,x1; vec.y add to y0,y1
 */
/**
 * Operator +=
 * @tparam Float value add value to xpRecty0,y1
 */
Rect2d.prototype.addSelf = function (value) {
    if (typeof(value) == "number") {
        this.fX0 += value;
        this.fX1 += value;
        this.fY0 += value;
        this.fY1 += value;
    }
    else {
        this.fX0 += value.pData.X;
        this.fX1 += value.pData.X;
        this.fY0 += value.pData.Y;
        this.fY1 += value.pData.Y;
    }
};
/**
 * Negate
 * @treturn Rect2d Negate this rect2d
 */
Rect2d.prototype.neg = function () {
    return new Rect2d(-this.fX0, -this.fX1, -this.fY0, -this.fY1);
};
/**
 * @property void Rect2d::subSelf(Float32Array v2fVec)
 * Operator -=
 * @memberof Rect2d
 * @param v2fVec vec.x Sub to x0,x1; vec.y sub to y0,y1
 */
/**
 * Operator -=
 * @tparam Float value sub value to x0,x1,y0,y1
 */
Rect2d.prototype.subSelf = function (value) {
    if (typeof(value) == "number") {
        this.fX0 -= value;
        this.fX1 -= value;
        this.fY0 -= value;
        this.fY1 -= value;
    }
    else {
        this.fX0 -= value.pData.X;
        this.fX1 -= value.pData.X;
        this.fY0 -= value.pData.Y;
        this.fY1 -= value.pData.Y;
    }
};
/**
 * @property void Rect2d::divSelf(Float32Array v2fVec)
 * Operator /=
 * @memberof Rect2d
 * @param v2fVec vec.x Div to x0,x1; vec.y div to y0,y1
 */
/**
 * Operator /=
 * @tparam Float value Div value to x0,x1,y0,y1
 */
Rect2d.prototype.divSelf = function (value) {
    if (typeof(value) == "number") {
        debug_assert(value != 0.0, "divide by zero error");
        this.fX0 /= value;
        this.fX1 /= value;
        this.fY0 /= value;
        this.fY1 /= value;
    }
    else {
        debug_assert(value.pData.X != 0.0, "divide by zero error");
        debug_assert(value.pData.Y != 0.0, "divide by zero error");
        this.fX0 /= value.pData.X;
        this.fX1 /= value.pData.X;
        this.fY0 /= value.pData.Y;
        this.fY1 /= value.pData.Y;
    }
};
/**
 * @property void Rect2d::multSelf(Float32Array v2fVec)
 * Operator *=
 * @memberof Rect2d
 * @param v2fVec vec.x Mult to x0,x1; vec.y div to y0,y1
 */
/**
 * Operator *=
 * @tparam Float value Mult value to x0,x1,y0,y1
 */
Rect2d.prototype.multSelf = function (value) {
    if (typeof(value) == "number") {
        this.fX0 *= value;
        this.fX1 *= value;
        this.fY0 *= value;
        this.fY1 *= value;
    }
    else {
        this.fX0 *= value.pData.X;
        this.fX1 *= value.pData.X;
        this.fY0 *= value.pData.Y;
        this.fY1 *= value.pData.Y;
    }
};
/**
 * Set to 0 x0,x1,y0,y1
 */
Rect2d.prototype.clear = function () {
    this.fX0 = 0.0;
    this.fX1 = 0.0;
    this.fY0 = 0.0;
    this.fY1 = 0.0;
};
/**
 * Is x0,x1,y0,y1 set in 0
 * @treturn Boolean
 */
Rect2d.prototype.isClear = function () {
    return ((0.0 == this.fX0) && (0.0 == this.fX1) && (0.0 == this.fY0) && (0.0 == this.fY1));
};
/**
 * @property set(Rect2d pRect2d)
 * Setup rect
 * @memberof Rect2d
 * @param pRect2d New Rect2d
 */
/**
 * @property set(Float x0, Float x1,Float y0, Float y1)
 * Setup rect
 * @memberof Rect2d
 */
/**
 * @property set(Float xSize, Float ySize);
 * Setup rect
 * @memberof Rect2d
 * @param xSize
 * @param ySize
 */
/**
 * @property set(Float32Array v2fSize)
 * Setup rect
 * @memberof Rect2d
 * @param v2fSize Size
 */
Rect2d.prototype.set = function () {
    switch (arguments.length) {
        case 1:
            if (arguments[0] instanceof Rect2d) {
                this.fX0 = arguments[0].fX0;
                this.fX1 = arguments[0].fX1;
                this.fY0 = arguments[0].fY0;
                this.fY1 = arguments[0].fY1;
            }
            else {
                this.fX1 = arguments[0].pData.X * 0.5;
                this.fX0 = -this.fX1;
                this.fY1 = arguments[0].pData.Y * 0.5;
                this.fY0 = -this.fY1;
            }
            break;
        case 2:
            this.fX1 = arguments[0] * 0.5;
            this.fX0 = -this.fX1;
            this.fY1 = arguments[1] * 0.5;
            this.fY0 = -this.fY1;
            break;
        case 4:
            this.fX0 = arguments[0];
            this.fX1 = arguments[1];
            this.fY0 = arguments[2];
            this.fY1 = arguments[3];
            break;
    }
    ;
};
/**
 * Floor x0,x1,y0,y1
 * Floor returns the largest integral value that is not greater than x (2.3->2.0, -3.2->-4.0)
 * @tparam Rect2d pRect Base rect to floor
 */
Rect2d.prototype.setFloor = function (pRect) {
    this.fX0 = Math.floor(pRect.fX0);
    this.fX1 = Math.floor(pRect.fX1);
    this.fY0 = Math.floor(pRect.fY0);
    this.fY1 = Math.floor(pRect.fY1);
};
/**
 * Floor x0,x1,y0,y1
 * Ceil returns the smallest integral value that is not less than x (2.3->3.0, -3.2->-3.0)
 * @tparam Rect2d pRect Base rect to ceil
 */
Rect2d.prototype.setCeiling = function (pRect) {
    this.fX0 = Math.ceil(pRect.fX0);
    this.fX1 = Math.ceil(pRect.fX1);
    this.fY0 = Math.ceil(pRect.fY0);
    this.fY1 = Math.ceil(pRect.fY1);
};
/**
 * Is rect valid(x0<x1, y0<y1)
 * @treturn Boolean
 */
Rect2d.prototype.isValid = function () {
    return (this.fX0 <= this.fX1 && this.fY0 <= this.fY1);
};
/**
 * Assert validation of rect
 */
Rect2d.prototype.assertValid = function () {
    debug_assert((this.fX0 <= this.fX1), "rectangle inverted on X axis");
    debug_assert((this.fY0 <= this.fY1), "rectangle inverted on Y axis");
};
/**
 * Resize rect x
 * x1 = (x1+x0+size)*0.5
 * x0 = x1 - size
 * @tparam Float fSize
 */
Rect2d.prototype.resizeX = function (fSize) {
    this.fX1 = (this.fX1 + this.fX0 + fSize) * 0.5;
    this.fX0 = this.fX1 - fSize;
};
/**
 * Resize rect y
 * y1 = (y1+y0+size)*0.5
 * y0 = y1 - size
 * @tparam Float fSize
 */
Rect2d.prototype.resizeY = function (fSize) {
    this.fY1 = (this.fY1 + this.fY0 + fSize) * 0.5;
    this.fY0 = this.fY1 - fSize;
};
/**
 * Resize rect
 * @tparam Float32Array v2fSize vec.x to resizeX, vec.y to resizeY
 */
Rect2d.prototype.resize = function (v2fSize) {
    this.fX1 = (this.fX1 + this.fX0 + v2fSize.X) * 0.5;
    this.fX0 = this.fX1 - v2fSize.pData.X;
    this.fY1 = (this.fY1 + this.fY0 + v2fSize.Y) * 0.5;
    this.fY0 = this.fY1 - v2fSize.pData.Y;
};
/**
 * Resize rect
 * x1 = x0+span
 * @tparam Float fSpan
 */
Rect2d.prototype.resizeMaxX = function (fSpan) {
    this.fX1 = this.fX0 + fSpan;
};
/**
 * Resize rect
 * y1 = y0+span
 * @tparam Float fSpan
 */
Rect2d.prototype.resizeMaxY = function (fSpan) {
    this.fY1 = this.fY0 + fSpan;
};
/**
 * Resize rect
 * @tparam Float32Array v2fSize vec.x to resizeMaxX, vec.y to resizeMaxY
 */
Rect2d.prototype.resizeMax = function (v2fSize) {
    this.fX1 = this.fX0 + v2fSize.pData.X;
    this.fY1 = this.fY0 + v2fSize.pData.Y;
};
/**
 * Resize rect
 * x0 = x1-span
 * @tparam Float fSpan
 */
Rect2d.prototype.resizeMinX = function (fSpan) {
    this.fX0 = this.fX1 - fSpan;
};
/**
 * Resize rect
 * y0 = y1-span
 * @tparam Float fSpan
 */
Rect2d.prototype.resizeMinY = function (fSpan) {
    this.fY0 = this.fY1 - fSpan;
};
/**
 * Resize rect
 * @tparam Float32Array v2fSize vec.x to resizeMinX, vec.y to resizeMinY
 */
Rect2d.prototype.resizeMin = function (v2fSize) {
    this.fX0 = this.fX1 - v2fSize.pData.X;
    this.fY0 = this.fY1 - v2fSize.pData.Y;
};
/**
 * Mid between x0 and x1
 * Return (x0+x1)*0.5
 * @treturn Float
 */
Rect2d.prototype.midX = function () {
    return (this.fX0 + this.fX1) * 0.5;
};
/**
 * Mid between y0 and y1
 * Return (y0+y1)*0.5
 * @treturn Float
 */
Rect2d.prototype.midY = function () {
    return (this.fY0 + this.fY1) * 0.5;
};
/**
 * Mid between x and y
 * @treturn Float32Array point.X = midX; point.Y = midY
 */
Rect2d.prototype.midpoint = function () {
    var v2fPoint = new Vec2;
    v2fPoint.pData.X = (this.fX0 + this.fX1) * 0.5;
    v2fPoint.pData.Y = (this.fY0 + this.fY1) * 0.5;
    return v2fPoint;
};
/**
 * Size x
 * Return (x1-x0)
 * @treturn Float
 */
Rect2d.prototype.sizeX = function () {
    return (this.fX1 - this.fX0);
};
/**
 * Size y
 * Return (y1-y0)
 * @treturn Float
 */
Rect2d.prototype.sizeY = function () {
    return (this.fY1 - this.fY0);
};
/**
 * Size
 * @treturn Float32Array size.X = sizeX; size.Y = sizeY
 */
Rect2d.prototype.size = function () {
    var v2fSize = new Vec2;
    v2fSize.pData.X = (this.fX1 - this.fX0);
    v2fSize.pData.Y = (this.fY1 - this.fY0);
    return v2fSize;
};
/**
 * Min point - (x0,y0)
 * @treturn Float32Array point.X = x0; point.Y = y0
 */
Rect2d.prototype.minPoint = function () {
    var v2fPoint = new Vec2;
    v2fPoint.pData.X = this.fX0;
    v2fPoint.pData.Y = this.fY0;
    return v2fPoint;
};
/**
 * Max point - (x1,y1)
 * @treturn Float32Array point.X = x1; point.Y = y1
 */
Rect2d.prototype.maxPoint = function () {
    var v2fPoint = new Vec2;
    v2fPoint.pData.X = this.fX1;
    v2fPoint.pData.Y = this.fY1;
    return v2fPoint;
};
/**
 * Area of rect2d
 * sizeX * sizeY
 * @treturn Float
 */
Rect2d.prototype.area = function () {
    return ((this.fX1 - this.fX0) * (this.fY1 - this.fY0));
};
/**
 * Union rect with point
 * x0 = minimum(x0, point.x);
 * y0 = minimum(y0, point.y);
 * x1 = maximum(x1, point.x);
 * y1 = maximum(y1, point.y);
 * @tparam Float32Array v2fPoint
 */
Rect2d.prototype.unionPoint = function (v2fPoint) {
    this.fX0 = Math.min(this.fX0, point.pData.X);
    this.fY0 = Math.min(this.fY0, point.pData.Y);
    this.fX1 = Math.max(this.fX1, point.pData.X);
    this.fY1 = Math.max(this.fY1, point.pData.Y);
};
/**
 * Union rect with another rect2d
 * x0 = minimum(x0, rect.x0);
 * y0 = minimum(y0, rect.y0);
 * x1 = maximum(x1, rect.x1);
 * y1 = maximum(y1, rect.y1);
 * @tparam Rect2d pRect
 */
Rect2d.prototype.unionRect = function (pRect) {
    this.assertValid();
    pRect.assertValid();
    this.fX0 = Math.min(this.fX0, pRect.fX0);
    this.fY0 = Math.min(this.fY0, pRect.fY0);
    this.fX1 = Math.max(this.fX1, pRect.fX1);
    this.fY1 = Math.max(this.fY1, pRect.fY1);
};
/**
 * Change position of rect by offset
 * x0,x1 += offset.X
 * y0,y1 += offset.Y
 * @tparam Float32Array v2fOffset
 */
Rect2d.prototype.offset = function (v2fOffset) {
    this.fX0 += v2fOffset.pData.X;
    this.fX1 += v2fOffset.pData.X;
    this.fY0 += v2fOffset.pData.Y;
    this.fY1 += v2fOffset.pData.Y;
};
/**
 * @property expand(Float32Array v2fSize)
 * Expand rect
 * x0,y0 -= v2fSize.X
 * x1,y1 += v2fSize.Y
 * @memberof Rect2d
 * @param v2fSize Expand
 */
/**
 * Expand rect
 * x0,y0 -= value
 * x1,y1 += value
 * @tparam Float value
 */
Rect2d.prototype.expand = function (value) {
    if (typeof(value) == "number") {
        this.fX0 -= value;
        this.fX1 += value;
        this.fY0 -= value;
        this.fY1 += value;
    }
    else {
        this.fX0 -= value.pData.X;
        this.fX1 += value.pData.X;
        this.fY0 -= value.pData.Y;
        this.fY1 += value.pData.Y;
    }
};
/**
 * Expand x
 * x0 -= fN
 * x1 += fN
 * @tparam Float fN
 */
Rect2d.prototype.expandX = function (fN) {
    this.fX0 -= fN;
    this.fX1 += fN;
};
/**
 * Expand y
 * y0 -= fN
 * y1 += fN
 * @tparam Float fN
 */
Rect2d.prototype.expandY = function (fN) {
    this.fY0 -= fN;
    this.fY1 += fN;
};
/**
 * Normalize rect
 * if x0>x1 swap(x0,x1)
 * if y0>y1 swap(y0,y1)
 */
Rect2d.prototype.normalize = function () {
    var temp;
    if (this.fX0 > this.fX1) {
        temp = this.fX0;
        this.fX0 = this.fX1;
        this.fX1 = temp;
    }
    if (this.fY0 > this.fY1) {
        temp = this.fY0;
        this.fY0 = this.fY1;
        this.fY1 = temp;
    }
};
/**
 * Corner of rect
 * If index==0 return (x1,y1)
 * If index==1 return (x0,y1)
 * If index==2 return (x1,y0)
 * If index==3 return (x0,y0)
 * @tparam Int index
 * @treturn Float32Array corner-point
 */
Rect2d.prototype.corner = function (index) {
    debug_assert(index >= 0 && index < 4, "invalid index");
    var v2fPoint = new Vec2;
    v2fPoint.pData.X = (index & 1) ? this.fX0 : this.fX1;
    v2fPoint.pData.Y = (index & 2) ? this.fY0 : this.fY1;
    return v2fPoint;
};
/**
 * Is point in rect?
 * @tparam Float32Array v2fPoint test point
 * @treturn Boolean is point in rect
 */
Rect2d.prototype.isPointInRect = function (v2fPoint) {
    return (v2fPoint.pData.X >= this.fX0 && v2fPoint.pData.Y >= this.fY0 && v2fPoint.X <= Rect3d.fX1 && v2fPoint.Y <= this.fY1);
};
/**
 * Create bounding circle for rect
 * @treturn Circle Centre = midpoint, radius = (sizeX+sizeY)*0.5
 */
Rect2d.prototype.createBoundingCircle = function () {
    return new Circle((this.fX0 + this.fX1) * 0.5, (this.fY0 + this.fY1) * 0.5,
                      (this.fX1 - this.fX0 + this.fY1 - this.fY0) * 0.5);
};

//-------------------End Rect2D---------------------\\

//-------------------Start Rect3D---------------------\\

/**
 * @property Rect3d(Rect3d pRect3d)
 * Constructor
 * @memberof Rect3d
 * @param pRect3d New Rect3d
 */
/**
 * @property Rect3d(Float x0, Float x1,Float y0, Float y1, Float z0, Float z1)
 * Constructor
 * @memberof Rect3d
 */
/**
 * @property Rect3d(Float xSize, Float ySize, Float zSize);
 * Constructor
 * @memberof Rect3d
 * @param xSize
 * @param ySize
 * @param zSize
 */
/**
 * @property Rect3d(Float32Array v3fSize)
 * Constructor
 * @memberof Rect3d
 * @tparam Float32Array v3fSize
 */
/**
 * Rect3d Class
 * @ctor
 * Constructor of Rect3d class
 */
function Rect3d () {
    A_CHECK_STORAGE();
    /**
     * x0
     * @type Float
     */
    this.fX0 = 0;
    /**
     * x1
     * @type Float
     */
    this.fX1 = 0;
    /**
     * y0
     * @type Float
     */
    this.fY0 = 0;
    /**
     * y1
     * @type Float
     */
    this.fY1 = 0;
    /**
     * z0
     * @type Float
     */
    this.fZ0 = 0;
    /**
     * z1
     * @type Float
     */
    this.fZ1 = 0;
    switch (arguments.length) {
        case 1:
            if (arguments[0] instanceof Rect3d) {
                this.fX0 = arguments[0].fX0;
                this.fX1 = arguments[0].fX1;
                this.fY0 = arguments[0].fY0;
                this.fY1 = arguments[0].fY1;
                this.fZ0 = arguments[0].fZ0;
                this.fZ1 = arguments[0].fZ1;
            }
            else {
                this.fX1 = arguments[0].pData.X * 0.5;
                this.fX0 = -this.fX1;
                this.fY1 = arguments[0].pData.Y * 0.5;
                this.fY0 = -this.fY1;
                this.fZ1 = arguments[0].pData.Z * 0.5;
                this.fZ0 = -this.fZ1;
            }
            break;
        case 3:
            this.fX1 = arguments[0] * 0.5;
            this.fX0 = -this.fX1;
            this.fY1 = arguments[1] * 0.5;
            this.fY0 = -this.fY1;
            this.fZ1 = arguments[2] * 0.5;
            this.fZ0 = -this.fZ1;
            break;
        case 6:
            this.fX0 = arguments[0];
            this.fX1 = arguments[1];
            this.fY0 = arguments[2];
            this.fY1 = arguments[3];
            this.fZ0 = arguments[4];
            this.fZ1 = arguments[5];
            break;
    }
    ;
}

A_ALLOCATE_STORAGE(Rect3d);

Object.defineProperty(Rect3d.prototype, "pRect2d", {
         /**
          * @property void pRect2d(Rect2d pRect2d)
          * Setter for rect2d
          * @memberof Rect3d
          */
         set: function (pRect2d) {
             this.fX0 = pRect2d.fX0;
             this.fX1 = pRect2d.fX1;
             this.fY0 = pRect2d.fY0;
             this.fY1 = pRect2d.fY1;
         },
              /**
               * @property Float32Array pRect2d()
               * Getter for rect2d
               * @memberof Rect3d
               * @return Rect2d object
               */
              get: function () {
                  return new Rect2d(this.fX0, this.fX1, this.fY0, this.fY1);
              }
});
/**
 * Operator ==
 * @tparam Float32Array pRect
 * @treturn Boolean
 */
Rect3d.prototype.isEqual = function (pRect) {
    return (this.fX0 == pRect.fX0
        && this.fX1 == pRect.fX1
        && this.fY0 == pRect.fY0
        && this.fY1 == pRect.fY1
        && this.fZ0 == pRect.fZ0
        && this.fZ1 == pRect.fZ1);
};
/**
 * OperpRect=
 * @tparam Float32Array pRect
 */
Rect3d.prototype.eq = function (pRect) {
    this.fX0 = pRect.fX0;
    this.fX1 = pRect.fX1;
    this.fY0 = pRect.fY0;
    this.fY1 = pRect.fY1;
    this.fZ0 = pRect.fZ0;
    this.fZ1 = pRect.fZ1;
};
/**
 * Negate
 * @treturn Rect3d Negate this rect2d
 */
Rect3d.prototype.neg = function () {
    return new Rect3d(-this.fX0, -this.fX1, -this.fY0, -this.fY1, -this.fZ0, -this.fZ1);
};
/**
 * @property void Rect2d::addSelf(Float32Array v3fVec)
 * Operator +=
 * @memberof Rect3d
 * @param v3fVec vec.x Add to x0,x1; vec.y add to y0,y1; vec.z add to z0,z1;
 */
/**
 * Operator +=
 * @tparam Float value add value to x0,x1,y0,y1,z0,z1
 */
Rect3d.prototype.addSelf = function (value) {
    if (typeof(value) == "number") {
        this.fX0 += value;
        this.fX1 += value;
        this.fY0 += value;
        this.fY1 += value;
        this.fZ0 += value;
        this.fZ1 += value;
    }
    else {
        this.fX0 += value.pData.X;
        this.fX1 += value.pData.X;
        this.fY0 += value.pData.Y;
        this.fY1 += value.pData.Y;
        this.fZ0 += value.pData.Z;
        this.fZ1 += value.pData.Z;
    }
};
/**
 * @property void Rect2d::subSelf(Float32Array v3fVec)
 * Operator -=
 * @memberof Rect3d
 * @param v3fVec vec.x sub to x0,x1; vec.y sub to y0,y1; vec.z sub to z0,z1;
 */
/**
 * Operator -=
 * @tparam Float value sub value to x0,x1,y0,y1,z0,z1
 */
Rect3d.prototype.subSelf = function (value) {
    if (typeof(value) == "number") {
        this.fX0 -= value;
        this.fX1 -= value;
        this.fY0 -= value;
        this.fY1 -= value;
        this.fZ0 -= value;
        this.fZ1 -= value;
    }
    else {
        value = value.pData;
        this.fX0 -= value.X;
        this.fX1 -= value.X;
        this.fY0 -= value.Y;
        this.fY1 -= value.Y;
        this.fZ0 -= value.Z;
        this.fZ1 -= value.Z;
    }
};
/**
 * @property void Rect2d::divSelf(Float32Array v3fVec)
 * Operator /=
 * @memberof Rect3d
 * @param v3fVec vec.x div to x0,x1; vec.y div to y0,y1; vec.z div to z0,z1;
 */
/**
 * Operator /=
 * @tparam Float value div value to x0,x1,y0,y1,z0,z1
 */
Rect3d.prototype.divSelf = function (value) {
    if (typeof(value) == "number") {
        debug_assert(value != 0.0, "divide by zero error");
        this.fX0 /= value;
        this.fX1 /= value;
        this.fY0 /= value;
        this.fY1 /= value;
        this.fZ0 /= value;
        this.fZ1 /= value;
    }
    else {
        debug_assert(value.pData.X != 0.0, "divide by zero error");
        debug_assert(value.pData.Y != 0.0, "divide by zero error");
        debug_assert(value.pData.Z != 0.0, "divide by zero error");
        this.fX0 /= value.pData.X;
        this.fX1 /= value.pData.X;
        this.fY0 /= value.pData.Y;
        this.fY1 /= value.pData.Y;
        this.fZ0 /= value.pData.Z;
        this.fZ1 /= value.pData.Z;
    }
};
/**
 * @property void Rect2d::multSelf(Float32Array v3fVec)
 * Operator *=
 * @memberof Rect3d
 * @param v3fVec vec.x mult to x0,x1; vec.y mult to y0,y1; vec.z mult to z0,z1;
 */
/**
 * Operator *=
 * @tparam Float value mult value to x0,x1,y0,y1,z0,z1
 */
Rect3d.prototype.multSelf = function (value) {
    if (typeof(value) == "number") {
        this.fX0 *= value;
        this.fX1 *= value;
        this.fY0 *= value;
        this.fY1 *= value;
        this.fZ0 *= value;
        this.fZ1 *= value;
    }
    else {
        this.fX0 *= value.pData.X;
        this.fX1 *= value.pData.X;
        this.fY0 *= value.pData.Y;
        this.fY1 *= value.pData.Y;
        this.fZ0 *= value.pData.Z;
        this.fZ1 *= value.pData.Z;
    }
};
/**
 * Set x0,x1,y0,y1,z0,z1 to 0
 */
Rect3d.prototype.clear = function () {
    this.fX0 = 0.0;
    this.fX1 = 0.0;
    this.fY0 = 0.0;
    this.fY1 = 0.0;
    this.fZ0 = 0.0;
    this.fZ1 = 0.0;
};
/**
 * Is x0,x1,y0,y1,z0,z1 set in 0
 * @treturn Boolean
 */
Rect3d.prototype.isClear = function () {
    return ((0.0 == this.fX0)
        && (0.0 == this.fX1)
        && (0.0 == this.fY0)
        && (0.0 == this.fY1)
        && (0.0 == this.fZ0)
        && (0.0 == this.fZ1));
};

/**
 * @property set(Rect3d pRect3d)
 * Setup rect
 * @memberof Rect3d
 * @param pRect3d New Rect3d
 */
/**
 * @property set(Float x0, Float x1,Float y0, Float y1, Float z0, Float z1)
 * Setup rect
 * @memberof Rect3d
 */
/**
 * @property set(Float xSize, Float ySize, Float zSize);
 * Setup rect
 * @memberof Rect3d
 * @param xSize
 * @param ySize
 * @param zSize
 */
/**
 * @property set(Float32Array v3fSize)
 * Setup rect
 * @memberof Rect3d
 * @param v3fSize Size
 */
Rect3d.prototype.set = function () {
    switch (arguments.length) {
        case 1:
            if (arguments[0] instanceof Rect3d) {
                this.fX0 = arguments[0].fX0;
                this.fX1 = arguments[0].fX1;
                this.fY0 = arguments[0].fY0;
                this.fY1 = arguments[0].fY1;
                this.fZ0 = arguments[0].fZ0;
                this.fZ1 = arguments[0].fZ1;
            }
            else {
                this.fX1 = arguments[0].pData.X * 0.5;
                this.fX0 = -this.fX1;
                this.fY1 = arguments[0].pData.Y * 0.5;
                this.fY0 = -this.fY1;
                this.fZ1 = arguments[0].pData.Z * 0.5;
                this.fZ0 = -this.fZ1;
            }
            break;
        case 3:
            this.fX1 = arguments[0] * 0.5;
            this.fX0 = -this.fX1;
            this.fY1 = arguments[1] * 0.5;
            this.fY0 = -this.fY1;
            this.fZ1 = arguments[2] * 0.5;
            this.fZ0 = -this.fZ1;
            break;
        case 6:
            this.fX0 = arguments[0];
            this.fX1 = arguments[1];
            this.fY0 = arguments[2];
            this.fY1 = arguments[3];
            this.fZ0 = arguments[4];
            this.fZ1 = arguments[5];
            break;
    }
    ;
};
/**
 * Floor x0,x1,y0,y1,z0,z1
 * Floor returns the largest integral value that is not greater than x (2.3->2.0, -3.2->-4.0)
 * @tparam Rect3d pRect Base rect to floor
 */
Rect3d.prototype.setFloor = function (pRect) {
    this.fX0 = Math.floor(pRect.fX0);
    this.fX1 = Math.floor(pRect.fX1);
    this.fY0 = Math.floor(pRect.fY0);
    this.fY1 = Math.floor(pRect.fY1);
    this.fZ0 = Math.floor(pRect.fZ0);
    this.fZ1 = Math.floor(pRect.fZ1);
};
/**
 * Floor x0,x1,y0,y1,z0,z1
 * Ceil returns the smallest integral value that is not less than x (2.3->3.0, -3.2->-3.0)
 * @tparam Rect3d pRect Base rect to ceil
 */
Rect3d.prototype.setCeiling = function (pRect) {
    this.fX0 = Math.ceil(pRect.fX0);
    this.fX1 = Math.ceil(pRect.fX1);
    this.fY0 = Math.ceil(pRect.fY0);
    this.fY1 = Math.ceil(pRect.fY1);
    this.fZ0 = Math.ceil(pRect.fZ0);
    this.fZ1 = Math.ceil(pRect.fZ1);
};
/**
 * Is rect valid(x0<x1, y0<y1, z0<z1)
 * @treturn Boolean
 */
Rect3d.prototype.isValid = function () {
    return (this.fX0 <= x1 && this.fY0 <= y1 && this.fZ0 <= z1);
};
/**
 * Assert validation of rect
 */
Rect3d.prototype.assertValid = function () {
    debug_assert((this.fX0 <= this.fX1), "rectangle inverted on X axis");
    debug_assert((this.fY0 <= this.fY1), "rectangle inverted on Y axis");
    debug_assert((this.fZ0 <= this.fZ1), "rectangle inverted on Z axis");
};
/**
 * Rezize X
 * x1 = (x1+x0+size)*0.5
 * x0 = x1 - size
 * @tparam Float fSize new size
 */
Rect3d.prototype.resizeX = function (fSize) {
    this.fX1 = (this.fX0 + this.fX1 + fSize) * 0.5;
    this.fX0 = this.fX1 - fSize;
};
/**
 * Rezize Y
 * y1 = (y1+y0+size)*0.5
 * y0 = y1 - size
 * @tparam Float fSize new size
 */
Rect3d.prototype.resizeY = function (fSize) {
    this.fY1 = (this.fY0 + this.fY1 + fSize) * 0.5;
    this.fY0 = this.fY1 - fSize;
};
/**
 * Rezize Z
 * z1 = (z1+z0+size)*0.5
 * z0 = z1 - size
 * @tparam Float fSize new size
 */
Rect3d.prototype.resizeZ = function (fSize) {
    this.fZ1 = (this.fZ0 + this.fZ1 + fSize) * 0.5;
    this.fZ0 = this.fZ1 - fSize;
};
/**
 * Rezize
 * x - resizeX(), y - resizeY(), z - rezizeZ()
 * @tparam Float32Array v3fSize new size
 */
Rect3d.prototype.resize = function (v3fSize) {
    this.fX1 = (this.fX0 + this.fX1 + v3fSize.pData.X) * 0.5;
    this.fX0 = this.fX1 - v2fSize.X;
    this.fY1 = (this.fY0 + this.fY1 + v3fSize.pData.Y) * 0.5;
    this.fY0 = this.fY1 - v2fSize.Y;
    this.fZ1 = (this.fZ0 + this.fZ1 + v3fSize.pData.Z) * 0.5;
    this.fZ0 = this.fZ1 - fSize;
};
/**
 * x1 = x0 +fSpan
 * @tparam Float fSpan span
 */
Rect3d.prototype.resizeMaxX = function (fSpan) {
    this.fX1 = this.fX0 + fSpan;
};
/**
 * y1 = y0 +fSpan
 * @tparam Float fSpan span
 */
Rect3d.prototype.resizeMaxY = function (fSpan) {
    this.fY1 = this.fY0 + fSpan;
};
/**
 * z1 = z0 +fSpan
 * @tparam Float fSpan span
 */
Rect3d.prototype.resizeMaxZ = function (fSpan) {
    this.fZ1 = this.fZ0 + fSpan;
};
/**
 * ResizeMax
 * x - resizeMaxX(), y - resizeMaxY(), z - rezizeMaxZ()
 * @tparam Float32Array v3fSize new size
 */
Rect3d.prototype.resizeMax = function (v3fSize) {
    this.fX1 = this.fX0 + v3fSize.pData.X;
    this.fY1 = this.fY0 + v3fSize.pData.Y;
    this.fZ1 = this.fZ0 + v3fSize.pData.Z;
};
/**
 * x0 = x1 - fSpan
 * @tparam Float fSpan span
 */
Rect3d.prototype.resizeMinX = function (fSpan) {
    this.fX0 = this.fX1 - fSpan;
};
/**
 * y0 = y1 - fSpan
 * @tparam Float fSpan span
 */
Rect3d.prototype.resizeMinY = function (fSpan) {
    this.fY0 = this.fY1 - fSpan;
};
/**
 * z0 = z1 - fSpan
 * @tparam Float fSpan span
 */
Rect3d.prototype.resizeMinZ = function (fSpan) {
    this.fZ0 = this.fZ1 - fSpan;
};
/**
 * ResizeMax
 * x - resizeMinX(), y - resizeMinY(), z - rezizeMinZ()
 * @tparam Float32Array v3fSize new size
 */
Rect3d.prototype.resizeMin = function (v3fSize) {
    this.fX0 = this.fX1 - v3fSize.pData.X;
    this.fY0 = this.fY1 - v3fSize.pData.Y;
    this.fZ0 = this.fZ1 - v3fSize.pData.Z;
};
/**
 * Return middle point
 * (x0+x1)*0.5
 * @treturn Float x-coord of middle point
 */
Rect3d.prototype.midX = function () {
    return (this.fX0 + this.fX1) * 0.5;
};
/**
 * Return middle point
 * (y0+y1)*0.5
 * @treturn Float y-coord of middle point
 */
Rect3d.prototype.midY = function () {
    return (this.fY0 + this.fY1) * 0.5;
};
/**
 * Return middle point
 * (z0+z1)*0.5
 * @treturn Float z-coord of middle point
 */
Rect3d.prototype.midZ = function () {
    return (this.fZ0 + this.fZ1) * 0.5;
};
/**
 * Return middle point
 * @treturn Float32Array Return 3d vector
 */
Rect3d.prototype.midPoint = function () {
    return new Vec3((this.fX0 + this.fX1) * 0.5, (this.fY0 + this.fY1) * 0.5, (this.fZ0 + this.fZ1) * 0.5);
};
/**
 * Return size
 * (x1 - x0)
 * @treturn Float
 */
Rect3d.prototype.sizeX = function () {
    return (this.fX1 - this.fX0);
};
/**
 * Return size
 * (y1 - y0)
 * @treturn Float
 */
Rect3d.prototype.sizeY = function () {
    return (this.fY1 - this.fY0);
};
/**
 * Return size
 * (z1 - z0)
 * @treturn Float
 */
Rect3d.prototype.sizeZ = function () {
    return (this.fZ1 - this.fZ0);
};
/**
 * Return size
 * @treturn Float32Array Return 3d vector
 */
Rect3d.prototype.size = function () {
    return new Vec3(this.fX1 - this.fX0, this.fY1 - this.fY0, this.fZ1 - this.fZ0);
};
/**
 * Return minpoint
 * (x0,y0,z0)
 * @treturn Float32Array Return 3d vector
 */
Rect3d.prototype.minPoint = function () {
    return new Vec3(this.fX0, this.fY0, this.fZ0);
};
/**
 * Return maxpoint
 * (x1,y1,z1)
 * @treturn Float32Array Return 3d vector
 */
Rect3d.prototype.maxPoint = function () {
    return new Vec3(this.fX1, this.fY1, this.fZ1);
};
/**
 * Return area(volume) of rect3d
 * sizeX*sizeY*sizeZ
 * @treturn Float Volume of rect
 */
Rect3d.prototype.area = function () {
    return (this.fX1 - this.fX0) * (this.fY1 - this.fY0) * (this.fZ1 - this.fZ0);
};
/**
 * Union with point
 * x0 = minimum(x0, point.x);
 * y0 = minimum(y0, point.y);
 * z0 = minimum(z0, point.z);
 * x1 = maximum(x1, point.x);
 * y1 = maximum(y1, point.y);
 * z1 = maximum(z1, point.z);
 * @tparam Float32Array v3fPoint point
 */
Rect3d.prototype.unionPoint = function (v3fPoint) {
    this.fX0 = Math.min(this.fX0, v3fPoint.pData.X);
    this.fY0 = Math.min(this.fY0, v3fPoint.pData.Y);
    this.fZ0 = Math.min(this.fZ0, v3fPoint.pData.Z);
    this.fX1 = Math.max(this.fX1, v3fPoint.pData.X);
    this.fY1 = Math.max(this.fY1, v3fPoint.pData.Y);
    this.fZ1 = Math.max(this.fZ1, v3fPoint.pData.Z);
};
/**
 * Union with rect
 * x0 = minimum(x0, rect.x0);
 * y0 = minimum(y0, rect.y0);
 * z0 = minimum(z0, rect.z0);
 * x1 = maximum(x1, rect.x1);
 * y1 = maximum(y1, rect.y1);
 * z1 = maximum(z1, rect.z1);
 * @tparam Rect3d pRect rect
 */
Rect3d.prototype.unionRect = function (pRect) {
    this.assertValid();
    pRect.assertValid();
    this.fX0 = Math.min(this.fX0, pRect.fX0);
    this.fY0 = Math.min(this.fY0, pRect.fY0);
    this.fZ0 = Math.min(this.fZ0, pRect.fZ0);
    this.fX1 = Math.max(this.fX1, pRect.fX1);
    this.fY1 = Math.max(this.fY1, pRect.fY1);
    this.fZ1 = Math.max(this.fZ1, pRect.fZ1);
};
/**
 * Offset rect
 * x0,x1 += offset.X
 * y0,y1 += offset.Y
 * z0,z1 += offset.Z
 * @tparam Float32Array v3fOffset offset vector
 */
Rect3d.prototype.offset = function (v3fOffset) {
    this.fX0 += v3fOffset.pData.X;
    this.fX1 += v3fOffset.pData.X;
    this.fY0 += v3fOffset.pData.Y;
    this.fY1 += v3fOffset.pData.Y;
    this.fZ0 += v3fOffset.pData.Z;
    this.fZ1 += v3fOffset.pData.Z;
};
/**
 * @property expand(Float32Array v3fSize)
 * Expand our rect
 * x -> expandX(v3fSize.X)
 * y -> expandY(v3fSize.Y)
 * z -> expandZ(v3fSize.Z)
 * @memberof Rect3d
 */
/**
 * Expand our rect
 * x -> expandX(value)
 * y -> expandY(value)
 * z -> expandZ(value)
 * @tparam Float value Expand value
 */
Rect3d.prototype.expand = function (value) {
    if (typeof(value) == "number") {
        this.fX0 -= value;
        this.fX1 += value;
        this.fY0 -= value;
        this.fY1 += value;
        this.fZ0 -= value;
        this.fZ1 += value;
    }
    else {
        this.fX0 -= value.pData.X;
        this.fX1 += value.pData.X;
        this.fY0 -= value.pData.Y;
        this.fY1 += value.pData.Y;
        this.fZ0 -= value.pData.Z;
        this.fZ1 += value.pData.Z;
    }
};
/**
 * Expand x-coord of our rect
 * x0 -= fN
 * x1 += fN
 * @tparam Flaot fN Expand value
 */
Rect3d.prototype.expandX = function (fN) {
    this.fX0 -= fN;
    this.fX1 += fN;
};
/**
 * Expand y-coord of our rect
 * y0 -= fN
 * y1 += fN
 * @tparam Flaot fN Expand value
 */
Rect3d.prototype.expandY = function (fN) {
    this.fY0 -= fN;
    this.fY1 += fN;
};
/**
 * Expand z-coord of our rect
 * z0 -= fN
 * z1 += fN
 * @tparam Flaot fN Expand value
 */
Rect3d.prototype.expandZ = function (fN) {
    this.fZ0 -= fN;
    this.fZ1 += fN;
};
/**
 * Normalize rect
 * if x0>x1 swap(x0,x1)
 * if y0>y1 swap(y0,y1)
 * if z0>z1 swap(z0,z1)
 */
Rect3d.prototype.normalize = function () {
    var temp;
    if (this.fX0 > this.fX1) {
        temp = this.fX0;
        this.fX0 = this.fX1;
        this.fX1 = temp;
    }
    if (this.fY0 > this.fY1) {
        temp = this.fY0;
        this.fY0 = this.fY1;
        this.fY1 = temp;
    }
    if (this.fZ0 > this.fZ1) {
        temp = this.fZ0;
        this.fZ0 = this.fZ1;
        this.fZ1 = temp;
    }
};
/**
 * Corner of rect
 * If index==0 return (x1,y1,z1)
 * If index==1 return (x0,y1,z1)
 * If index==2 return (x1,y0,z1)
 * If index==3 return (x0,y0,z1)
 * If index==4 return (x1,y1,z0)
 * If index==5 return (x0,y1,z0)
 * If index==6 return (x1,y0,z0)
 * If index==7 return (x0,y0,z0)
 * @tparam Int index
 * @treturn Float32Array corner-point
 */
Rect3d.prototype.corner = function (index) {
    debug_assert(index >= 0 && index < 8, "invalid index");
    return new Vec3(
                             (index & 1) ? this.fX0 : this.fX1,
                             (index & 2) ? this.fY0 : this.fY1,
                             (index & 4) ? this.fZ0 : this.fZ1
                         );
};
/**
 * Union point
 * @tparam Float fX x-coord
 * @tparam Float fY y-coord
 * @tparam Float fZ z-coord
 */
Rect3d.prototype.unionPointCoord = function (fX, fY, fZ) {
    this.fX0 = Math.min(this.fX0, fX);
    this.fY0 = Math.min(this.fY0, fY);
    this.fZ0 = Math.min(this.fZ0, fZ);
    this.fX1 = Math.max(this.fX1, fX);
    this.fY1 = Math.max(this.fY1, fY);
    this.fZ1 = Math.max(this.fZ1, fZ);
};
Define(Rect3d.unionPointCoord(fX, fY, fZ, rect), function () {
    rect.fX0 = Math.min(this.fX0, fX);
    rect.fY0 = Math.min(this.fY0, fY);
    rect.fZ0 = Math.min(this.fZ0, fZ);
    rect.fX1 = Math.max(this.fX1, fX);
    rect.fY1 = Math.max(this.fY1, fY);
    rect.fZ1 = Math.max(this.fZ1, fZ);
});

/**
 * Transform rect - coords by matrix
 * @tparam Float32Array m4fMatrix
 */
Rect3d.prototype.transform = function (m4fMatrix) {
	var pData = m4fMatrix.pData;
	var a11 = pData._11, a12 = pData._12, a13 = pData._13, a14 = pData._14;
	var a21 = pData._21, a22 = pData._22, a23 = pData._23, a24 = pData._24;
	var a31 = pData._31, a32 = pData._32, a33 = pData._33, a34 = pData._34;

	var fX0 = this.fX0, fX1 = this.fX1;
	var fY0 = this.fY0, fY1 = this.fY1;
	var fZ0 = this.fZ0, fZ1 = this.fZ1;

	//base point

	var fBaseX = a11 * fX0 + a12 * fY0 + a13 * fZ0;
	var fBaseY = a21 * fX0 + a22 * fY0 + a23 * fZ0;
	var fBaseZ = a31 * fX0 + a32 * fY0 + a33 * fZ0;

	var fXNewX = a11 * (fX1 - fX0);
	var fXNewY = a21 * (fX1 - fX0);
	var fXNewZ = a31 * (fX1 - fX0);

	var fYNewX = a12 * (fY1 - fY0);
	var fYNewY = a22 * (fY1 - fY0);
	var fYNewZ = a32 * (fY1 - fY0);

	var fZNewX = a13 * (fZ1 - fZ0);
	var fZNewY = a23 * (fZ1 - fZ0);
	var fZNewZ = a33 * (fZ1 - fZ0);

	var fXMultX = (fXNewX > 0) ? 1 : 0;
	var fYMultX = (fYNewX > 0) ? 1 : 0;
	var fZMultX = (fZNewX > 0) ? 1 : 0;

	var fXMultY = (fXNewY > 0) ? 1 : 0;
	var fYMultY = (fYNewY > 0) ? 1 : 0;
	var fZMultY = (fZNewY > 0) ? 1 : 0;

	var fXMultZ = (fXNewZ > 0) ? 1 : 0;
	var fYMultZ = (fYNewZ > 0) ? 1 : 0;
	var fZMultZ = (fZNewZ > 0) ? 1 : 0;

	this.fX1 = fBaseX + fXMultX * fXNewX + fYMultX * fYNewX + fZMultX * fZNewX;
	this.fY1 = fBaseY + fXMultY * fXNewY + fYMultY * fYNewY + fZMultY * fZNewY;
	this.fZ1 = fBaseZ + fXMultZ * fXNewZ + fYMultZ * fYNewZ + fZMultZ * fZNewZ;

	// !0 = true преобразуется в 1, !1 = false преобразуется в 0
	this.fX0 = fBaseX + (!fXMultX) * fXNewX + (!fYMultX) * fYNewX + (!fZMultX) * fZNewX;
	this.fY0 = fBaseY + (!fXMultY) * fXNewY + (!fYMultY) * fYNewY + (!fZMultY) * fZNewY;
	this.fZ0 = fBaseZ + (!fXMultZ) * fXNewZ + (!fYMultZ) * fYNewZ + (!fZMultZ) * fZNewZ;
}

/**
 * Test is point in our rect
 * @tparam Float32Array v3fPoint Test point
 * @treturn Boolean
 */
Rect3d.prototype.isPointInRect = function (v3fPoint) {
    return v3fPoint.x >= this.fX0
        && v3fPoint.y >= this.fY0
        && v3fPoint.z >= this.fZ0
        && v3fPoint.x <= this.fX1
        && v3fPoint.y <= this.fY1
        && v3fPoint.z <= this.fZ1;
};
/**
 * Return bounding sphere for rect
 * center = midPoint
 * radius = (sizeX+sizeY+sizeZ)*0.5
 * @treturn Sphere Bounding Sphere
 */
Rect3d.prototype.createBoundingSphere = function () {
    return new Sphere((this.fX0 + this.fX1) * 0.5, (this.fY0 + this.fY1) * 0.5, (this.fZ0 + this.fZ1) * 0.5,
                      (this.fX1 - this.fX0 + this.fY1 - this.fY0 + this.fZ1 - this.fZ0) * 0.5);
};


Rect3d.prototype.toString = function () {
    'use strict';
    
  return '(' + this.fX0.toFixed(3) + ', ' + this.fY0.toFixed(3) + ', ' + this.fZ0.toFixed(3) + ') --> ' +
    '(' + this.fX1.toFixed(3) + ', ' + this.fY1.toFixed(3) + ', ' + this.fZ1.toFixed(3) + ')';
};

//-------------------End Rect3D---------------------\\

//-------------------Start Frustrum---------------------\\
Enum([
         NO_RELATION = 0,
         EQUAL,
         A_CONTAINS_B,
         B_CONTAINS_A,
         INTERSECTING
     ], eVolumeClassifications, a.Geometry);
Enum([
         k_plane_front = 0,
         k_plane_back,
         k_plane_intersect
     ], ePlaneClassifications, a.Geometry);
/**
 * @property Frustum(Frustum pSrc)
 * @memberof Frustum
 * Constructor fo Frustum
 */
/**
 * Frustum
 * A Frustum is a set of six Plane3d objects representing
 * camera space. These planes are extracted from a camera
 * m4fMatrix directly.
 *
 * NOTE: The planes of a Frustum object are not normalized!
 * This means they are only sutable for half-space testing.
 * No distance values calcualted using these planes will be
 * accurate other than to show whether positions lie in the
 * positive or negative half-space of the plane.
 * @ctor
 * Constructor for Frustum
 */
function Frustum () {
    switch (arguments.length) {
        case 1:
            this.leftPlane = new a.Plane3d(arguments[0].leftPlane);
            this.rightPlane = new a.Plane3d(arguments[0].rightPlane);
            this.topPlane = new a.Plane3d(arguments[0].topPlane);
            this.bottomPlane = new a.Plane3d(arguments[0].bottomPlane);
            this.nearPlane = new a.Plane3d(arguments[0].nearPlane);
            this.farPlane = new a.Plane3d(arguments[0].farPlane);
            break;
        default:
            this.leftPlane = new a.Plane3d();
            this.rightPlane = new a.Plane3d();
            this.topPlane = new a.Plane3d();
            this.bottomPlane = new a.Plane3d();
            this.nearPlane = new a.Plane3d();
            this.farPlane = new a.Plane3d();
    }
}
;
/**
 * Operator =
 * @tparam Frustum pSrc
 */
Frustum.prototype.eq = function (pSrc) {
    this.leftPlane.eq(pSrc.leftPlane);
    this.rightPlane.eq(pSrc.rightPlane);
    this.topPlane.eq(pSrc.topPlane);
    this.bottomPlane.eq(pSrc.bottomPlane);
    this.nearPlane.eq(pSrc.nearPlane);
    this.farPlane.eq(pSrc.farPlane);
};
/**
 * Operator ==
 * @tparam Frustum pSrc
 * @treturn Boolean
 */
Frustum.prototype.isEqual = function (pSrc) {
    return (this.leftPlane.isEqual(pSrc.leftPlane))
        && (this.rightPlane.isEqual(pSrc.rightPlane))
        && (this.topPlane.isEqual(pSrc.topPlane))
        && (this.bottomPlane.isEqual(pSrc.bottomPlane))
        && (this.nearPlane.isEqual(pSrc.nearPlane))
        && (this.farPlane.isEqual(pSrc.farPlane));
};
/**
 * Extract A,B,C,D for planes from Matrix4x4
 * @tparam Float32Array m4fMatrix Sorce matrix
 * @tparam Boolean isNormalizePlanes Do normalize operation for planes or not
 */
Frustum.prototype.extractFromMatrix = function (m4fMatrix, isNormalizePlanes) {
    var pNormData;
    var pMatData = m4fMatrix.pData;
    // Left clipping plane 
    pNormData = this.leftPlane.v3fNormal.pData;
    pNormData.X = pMatData._41 + pMatData._11;
    pNormData.Y = pMatData._42 + pMatData._12;
    pNormData.Z = pMatData._43 + pMatData._13;
    this.leftPlane.fDistance = pMatData._44 + pMatData._14;

    // Right clipping plane 
    pNormData = this.rightPlane.v3fNormal.pData;
    pNormData.X = pMatData._41 - pMatData._11;
    pNormData.Y = pMatData._42 - pMatData._12;
    pNormData.Z = pMatData._43 - pMatData._13;
    this.rightPlane.fDistance = pMatData._44 - pMatData._14;

    // Top clipping plane
    pNormData = this.topPlane.v3fNormal.pData; 
    pNormData.X = pMatData._41 - pMatData._21;
    pNormData.Y = pMatData._42 - pMatData._22;
    pNormData.Z = pMatData._43 - pMatData._23;
    this.topPlane.fDistance = pMatData._44 - pMatData._24;

    // Bottom clipping plane 
    pNormData = this.bottomPlane.v3fNormal.pData; 
    pNormData.X = pMatData._41 + pMatData._21;
    pNormData.Y = pMatData._42 + pMatData._22;
    pNormData.Z = pMatData._43 + pMatData._23;
    this.bottomPlane.fDistance = pMatData._44 + pMatData._24;

    // Near clipping plane
    pNormData = this.nearPlane.v3fNormal.pData; 
    pNormData.X = pMatData._31;
    pNormData.Y = pMatData._32;
    pNormData.Z = pMatData._33;
    this.nearPlane.fDistance = pMatData._34;

    // Far clipping plane
    pNormData = this.farPlane.v3fNormal.pData;
    pNormData.X = pMatData._41 - pMatData._31;
    pNormData.Y = pMatData._42 - pMatData._32;
    pNormData.Z = pMatData._43 - pMatData._33;
    this.farPlane.fDistance = pMatData._44 - pMatData._34;


    // it is not always nessesary to normalize
    // the planes of the frustum. Non-normalized
    // planes can still be used for basic
    // intersection tests.
    if (isNormalizePlanes) {
        this.leftPlane.normalize();
        this.rightPlane.normalize();
        this.topPlane.normalize();
        this.bottomPlane.normalize();
        this.nearPlane.normalize();
        this.farPlane.normalize();
    }
};

//TODO: Test this method(Frustrum.extractPlane())
Frustum.prototype.extractPlane = function(pPlane, m4fMat, iRow){
    var iScale = (iRow < 0) ? -1 : 1;
    iRow = Math.abs(iRow) - 1;

    var pNormData = pPlane.v3fNormal.pData;
    pNormData.X = m4fMat.pData._41 + iScale * m4fMat.pData[iRow];
    pNormData.Y = m4fMat.pData._42 + iScale * m4fMat.pData[iRow + 4];
    pNormData.Z = m4fMat.pData._43 + iScale * m4fMat.pData[iRow + 8];
    pPlane.fDistance = m4fMat.pData._44 + iScale * m4fMat.pData[iRow + 12];

    var fLength = pPlane.v3fNormal.length();

    pPlane.v3fNormal.scale(1.0 / fLength);
    pPlane.fDistance /= fLength;
};
/**
 * Extract A,B,C,D for planes from Matrix4x4
 * @tparam Float32Array m4fMatrix Sorce matrix
 * @tparam Boolean isNormalizePlanes Do normalize operation for planes or not
 */
Frustum.prototype.extractFromMatrixGL = function (m4fMatrix, isNormalizePlanes) {

    this.extractPlane(this.leftPlane, m4fMatrix, 1);
    this.extractPlane(this.rightPlane, m4fMatrix, -1);
    this.extractPlane(this.bottomPlane, m4fMatrix, 2);
    this.extractPlane(this.topPlane, m4fMatrix, -2);
    this.extractPlane(this.nearPlane, m4fMatrix, 3);
    this.extractPlane(this.farPlane, m4fMatrix, -3);

    // it is not always nessesary to normalize
    // the planes of the frustum. Non-normalized
    // planes can still be used for basic
    // intersection tests.
    if (isNormalizePlanes) {
        this.leftPlane.normalize();
        this.rightPlane.normalize();
        this.topPlane.normalize();
        this.bottomPlane.normalize();
        this.nearPlane.normalize();
        this.farPlane.normalize();
    }
};
/**
 * Test point in frustum
 * @tparam Float32Array v3fPoint Test point
 * @treturn Boolean
 */
Frustum.prototype.testPoint = function (v3fPoint) {
    if ((this.leftPlane.signedDistance(v3fPoint) < 0.0)
        || (this.rightPlane.signedDistance(v3fPoint) < 0.0)
        || (this.topPlane.signedDistance(v3fPoint) < 0.0)
        || (this.bottomPlane.signedDistance(v3fPoint) < 0.0)
        || (this.nearPlane.signedDistance(v3fPoint) < 0.0)
        || (this.farPlane.signedDistance(v3fPoint) < 0.0)) {
        return false;
    }
    return true;
};
/**
 * Test rect3d in frustum
 * @tparam Rect3d pRect Test rect
 * @treturn Boolean
 */

Frustum.prototype.testRect = function (pRect) {
    if ((planeClassify_Rect3d_Plane(pRect, this.leftPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Rect3d_Plane(pRect, this.rightPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Rect3d_Plane(pRect, this.topPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Rect3d_Plane(pRect, this.bottomPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Rect3d_Plane(pRect, this.nearPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Rect3d_Plane(pRect, this.farPlane) == a.Geometry.k_plane_back)) {
		
        return false;
    }
    return true;
};
/**
 * Test Sphere in frustum
 * @tparam Sphere pSphere Test sphere
 * @treturn Boolean
 */
Frustum.prototype.testSphere = function (pSphere) {
    if ((planeClassify_Sphere_Plane(pSphere, this.leftPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Sphere_Plane(pSphere, this.rightPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Sphere_Plane(pSphere, this.topPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Sphere_Plane(pSphere, this.bottomPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Sphere_Plane(pSphere, this.nearPlane) == a.Geometry.k_plane_back)
        || (planeClassify_Sphere_Plane(pSphere, this.farPlane) == a.Geometry.k_plane_back)) {
        return false;
    }
    return true;
};

/*	Intersection Tests
 -----------------------------------------------------------------

 The functions provide all possible intersection tests
 between lines, planes and volumetric shapes in 2D and 3D

 -----------------------------------------------------------------
 */


/**
 * Testing for intersection between:
 * 3D plane and a 3D ray
 * @tparam Plane3d pPlane
 * @tparam Ray3d pRay
 * @treturn Float -1.0 - false
 */
function intersect_Plane3d_Ray3d (pPlane, pRay) {
    var fResult;
    var NdotV = pPlane.v3fnormal.dot(ray.v3fNormal);
    if (NdotV != 0.0) {
        fResult = pPlane.v3fnormal.dot(ray.v3fPoint) + pPlane.fDistance;
        fResult /= NdotV;
        if (fResult >= 0.0) {
            return fResult;
        }
    }
    return -1.0;
}
;
/**
 * Testing for intersection between:
 * 2D plane and a 2D ray
 * @tparam Plane2d pPlane
 * @tparam Ray2d pRay
 * @treturn Float -1.0 - false
 */
function intersect_Plane2d_Ray2d (pPlane, pRay) {
    var fResult;
    var NdotV = pPlane.v2fnormal.dot(ray.v2fNormal);
    if (NdotV != 0.0) {
        fResult = pPlane.v2fnormal.dot(ray.v2fPoint) + pPlane.fDistance;
        fResult /= NdotV;
        if (fResult >= 0.0) {
            return fResult;
        }
    }
    return -1.0;
}
;
/**
 * Testing for intersection between:
 * 3D Sphere and a 3D ray
 * @tparam Sphere pSphere
 * @tparam Ray3d pRay
 * @treturn Float -1.0 - false
 */
function intersect_Sphere_Ray3d (pSphere, pRay) {
    var vecQ = new Vec3;
    vecQ.pData.X = pRay.v3fPoint.pData.X - pSphere.v3fCenter.pData.X;
    vecQ.pData.Y = pRay.v3fPoint.pData.Y - pSphere.v3fCenter.pData.Y;
    vecQ.pData.Z = pRay.v3fPoint.pData.Z - pSphere.v3fCenter.pData.Z;
    var c = vecQ.lengthSquare() - pSphere.fRadius * pSphere.fRadius;
    if (c < 0.0) {
        return 0.0;
    }
    var b = vecQ.dot(pRay.v3fNormal);
    if (b > 0.0) {
        return -1.0;
    }
    // rays are assumed to be normalized
    // so we do not need to calc n
    var n = 1.0;
    var d = b * b - 4.0 * n * c;
    if (d < 0.0) {
        return -1.0;
    }
    var fResult = (-b - Math.sqrt(d)) / n;
    if (fResult < 0.0) {
        fResult = -1.0
    }
    return fResult;
}
;
/**
 * Testing for intersection between:
 * 2D Circle and a 2D ray
 * @tparam Circle pCircle
 * @tparam Ray2d pRay
 * @treturn Float -1.0 - false
 */
function intersect_Circle_Ray2d (pCircle, pRay) {
    var vecQ = new Vec2;
    vecQ.pData.X = pRay.v2fPoint.pData.X - pCircle.v2fCenter.pData.X;
    vecQ.pData.Y = pRay.v2fPoint.pData.Y - pCircle.v2fCenter.pData.Y;
    var c = vecQ.lengthSquare() - pCircle.fRadius * pCircle.fRadius;
    if (c < 0.0) {
        return 0.0;
    }
    var b = vecQ.dot(pRay.v2fNormal);
    if (b > 0.0) {
        return -1.0;
    }
    // rays are assumed to be normalized
    // so we do not need to calc n
    var n = 1.0;
    var d = b * b - 4.0 * n * c;
    if (d < 0.0) {
        return -1.0;
    }
    var fResult = (-b - Math.sqrt(d)) / n;
    if (fResult < 0.0) {
        fResult = -1.0
    }
    return fResult;
}
;
/**
 * Testing for intersection between:
 * 3D Rect and a 3D ray
 * @tparam Rect3d pRect
 * @tparam Ray3d pRay
 * @treturn Float -1.0 - false
 */
function intersect_Rect3d_Ray3d (pRect, pRay) {
    // determine if the pRay begins in the box
    if (pRay.v3fpoint.pData.X >= pRect.fX0 &&
        pRay.v3fpoint.pData.X <= pRect.fX1 &&
        pRay.v3fpoint.pData.Y >= pRect.fY0 &&
        pRay.v3fpoint.pData.Y <= pRect.fY1 &&
        pRay.v3fpoint.pData.Z >= pRect.fZ0 &&
        pRay.v3fpoint.pData.Z <= pRect.fZ1) {
        return 0.0;
    }
    // test the proper sides of the rectangle
    var maxT = Number.NEGATIVE_INFINITY;
    var t = 0;
    if (pRay.v3fnormal.pData.X > 0.0) {
        t = (pRect.fX0 - pRay.v3fpoint.pData.X) / pRay.v3fnormal.pData.X;
        maxT = Math.max(maxT, t);
    }
    else if (pRay.v3fnormal.pData.X < 0.0) {
        t = (pRect.fX1 - pRay.v3fpoint.pData.X) / pRay.v3fnormal.pData.X;
        maxT = Math.max(maxT, t);
    }
    if (pRay.v3fnormal.pData.Y > 0.0) {
        t = (pRect.fY0 - pRay.v3fpoint.pData.Y) / pRay.v3fnormal.pData.Y;
        maxT = Math.max(maxT, t);
    }
    else if (pRay.v3fnormal.pData.Y < 0.0) {
        t = (pRect.fY1 - pRay.v3fpoint.pData.Y) / pRay.v3fnormal.pData.Y;
        maxT = Math.max(maxT, t);
    }
    if (pRay.v3fnormal.pData.Z > 0.0) {
        t = (pRect.fZ0 - pRay.v3fpoint.pData.Z) / pRay.v3fnormal.pData.Z;
        maxT = Math.max(maxT, t);
    }
    else if (pRay.v3fnormal.pData.Z < 0.0) {
        t = (pRect.fZ1 - pRay.v3fpoint.pData.Z) / pRay.v3fnormal.pData.Z;
        maxT = Math.max(maxT, t);
    }

    if (maxT < 0) {
        maxT = -1.0;
    }
    return maxT;
}
;
/**
 * Testing for intersection between:
 * 2D Rect and a 2D ray
 * @tparam Rect2d pRect
 * @tparam Ray2d pRay
 * @treturn Float -1.0 - false
 */
function intersect_Rect2d_Ray2d (pRect, pRay) {
    // determine if the pRay begins in the box
    if (pRay.v3fpoint.pData.X >= pRect.fX0 &&
        pRay.v3fpoint.pData.X <= pRect.fX1 &&
        pRay.v3fpoint.pData.Y >= pRect.fY0 &&
        pRay.v3fpoint.pData.Y <= pRect.fY1) {
        return 0.0;
    }
    // test the proper sides of the rectangle
    var maxT = Number.NEGATIVE_INFINITY;
    var t = 0;
    if (pRay.v3fnormal.pData.X > 0.0) {
        t = (pRect.fX0 - pRay.v3fpoint.pData.X) / pRay.v3fnormal.pData.X;
        maxT = Math.max(maxT, t);
    }
    else if (pRay.v3fnormal.pData.X < 0.0) {
        t = (pRect.fX1 - pRay.v3fpoint.pData.X) / pRay.v3fnormal.pData.X;
        maxT = Math.max(maxT, t);
    }
    if (pRay.v3fnormal.pData.Y > 0.0) {
        t = (pRect.fY0 - pRay.v3fpoint.pData.Y) / pRay.v3fnormal.pData.Y;
        maxT = Math.max(maxT, t);
    }
    else if (pRay.v3fnormal.pData.Y < 0.0) {
        t = (pRect.fY1 - pRay.v3fpoint.pDataY) / pRay.v3fnormal.pData.Y;
        maxT = Math.max(maxT, t);
    }

    if (maxT < 0) {
        maxT = -1.0;
    }
    return maxT;
}
;
/**
 * Testing for intersection between:
 * 2D circle and 2D circle
 * @tparam Circle pSphereA
 * @tparam Circle pSphereB
 * @treturn Boolean
 */
function intersect_Circle_Circle (pSphereA, pSphereB) {
    var rx = pSphereA.v2fCenter.pData.X - pSphereB.v2fCenter.pData.X;
    var ry = pSphereA.v2fCenter.pData.Y - pSphereB.v2fCente.pDatar.Y;
    return (rx * rx + ry * ry) < (pSphereA.fRadius + pSphereB.fRadius);
}
;
/**
 * Testing for intersection between:
 * 3D Sphere and 3D Sphere
 * @tparam Sphere pSphereA
 * @tparam Sphere pSphereB
 * @treturn Boolean
 */
function intersect_Sphere_Sphere (pSphereA, pSphereB) {
    var rx = pSphereA.v3fCenter.pData.X - pSphereB.v3fCenter.pData.X;
    var ry = pSphereA.v3fCenter.pData.Y - pSphereB.v3fCenter.pData.Y;
    var rz = pSphereA.v3fCenter.pData.Z - pSphereB.v3fCenter.pData.Z;
    return (rx * rx + ry * ry + rz * rz) < (pSphereA.fRadius + pSphereB.fRadius);
}
;
/**
 * Testing for intersection between:
 * 2D Rect and 2D Sphere
 * @tparam Rect2d pRect
 * @tparam Circle pSphere
 * @treturn Boolean
 */
function intersect_Rect2d_Circle (pRect, pSphere) {
    var offset = new Vec2;
    var interior_count = 0;
    if (pSphere.v2fCenter.X < pRect.fX0) {
        offset.pData.X = pRect.fX0 - pSphere.v2fCenter.pData.X;
    }
    else if (pSphere.v2fCenter.pData.X >= pRect.fX1) {
        offset.pData.X = pSphere.v2fCenter.pData.X - pRect.fX1;
    }
    else {
        ++interior_count;
    }
    if (pSphere.v2fCenter.pData.Y < pRect.fY0) {
        offset.pData.Y = pRect.fY0 - pSphere.v2fCenter.pData.Y;
    }
    else if (pSphere.v2fCenter.pData.Y >= pRect.fY1) {
        offset.pData.Y = pSphere.v2fCenter.pData.Y - pRect.fY1;
    }
    else {
        ++interior_count;
    }
    // test if the v2fCenter of the 
    // pSphere is inside the rectangle
    if (interior_count == 2) {
        return true;
    }
    var distance_squared = offset.lengthSquare();
    var radius_squared = pSphere.radius * pSphere.radius;
    return (distance_squared < radius_squared);
}
;
/**
 * Testing for intersection between:
 * 3D Rect and 3D Sphere
 * @tparam Rect3d pRect
 * @tparam Sphere pSphere
 * @treturn Boolean
 */
function intersect_Rect3d_Sphere (pRect, pSphere) {
    var offset = new Vec3;
    var interior_count = 0;
    if (pSphere.v3fCenter.X < pRect.fX0) {
        offset.pData.X = pRect.fX0 - pSphere.v3fCenter.pData.X;
    }
    else if (pSphere.v3fCenter.X >= pRect.fX1) {
        offset.pData.X = pSphere.v3fCenter.pData.X - pRect.fX1;
    }
    else {
        ++interior_count;
    }
    if (pSphere.v3fCenter.pData.Y < pRect.fY0) {
        offset.pData.Y = pRect.fY0 - pSphere.v3fCenter.pData.Y;
    }
    else if (pSphere.v3fCenter.pData.Y >= pRect.fY1) {
        offset.pData.Y = pSphere.v3fCenter.pData.Y - pRect.fY1;
    }
    else {
        ++interior_count;
    }
    if (pSphere.v3fCenter.pData.Z < pRect.fZ0) {
        offset.pData.Z = pRect.fZ0 - pSphere.v3fCenter.pData.Z;
    }
    else if (pSphere.v3fCenter.pData.Z >= pRect.fZ1) {
        offset.pData.Z = pSphere.v3fCenter.pData.Z - pRect.fZ1;
    }
    else {
        ++interior_count;
    }
    // test if the v3fCenter of the 
    // pSphere is inside the rectangle
    if (interior_count == 3) {
        return true;
    }
    var distance_squared = offset.lengthSquare();
    var radius_squared = pSphere.radius * pSphere.radius;
    return (distance_squared < radius_squared);
}
;
/**
 * Testing for intersection between:
 * 2D Rect and a 2D rect
 * @tparam Rect2d pRectA
 * @tparam Rect2d pRectB
 * @tparam Rect2d pResult
 * @treturn Boolean
 */
function intersect_Rect2d_Rect2d (pRectA, pRectB, pResult) {
    debug_assert(pResult, "a result address must be provided");
    pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
    pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
    if (pResult.fX0 < pResult.fX1) {
        pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
        pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);
        if (pResult.fY0 < pResult.fY1) {
            return true;
        }
    }
    return false;
}
;
/**
 * Testing for intersection between:
 * 3D Rect and a 3D rect
 * @tparam Rect3d pRectA
 * @tparam Rect3d pRectB
 * @tparam Rect3d pResult
 * @treturn Boolean
 */
function intersect_Rect3d_Rect3d (pRectA, pRectB, pResult) {
    debug_assert(pResult, "a result address must be provided");
    pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
    pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
    if (pResult.fX0 < pResult.fX1) {
        pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
        pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);
        if (pResult.fY0 < pResult.fY1) {
            pResult.fZ0 = Math.max(pRectA.fZ0, pRectB.fZ0);
            pResult.fZ1 = Math.min(pRectA.fZ1, pRectB.fZ1);
            if (pResult.fZ0 < pResult.fZ1) {
                return true;
            }
        }
    }
    return false;
}
;
/** Testing for intersection between:
 * a) intersect(value, ray)
 *          3D plane and a 3D ray
 *          2D plane and a 2D ray
 *          3D sphere and a 3D ray
 *         2D circle and a 2D ray
 *          3D rectangle and a 3D ray
 *          2D rectangle and a 2D ray
 *     return value is Float -1.0 - no intersection
 *
 * b) instersect(value1, value2)
 *       2D sphere and 2D sphere
 *       3D sphere and 3D sphere
 *         2D rectangle and 2D sphere
 *      3D rectangle and 3D sphere
 *  return value is bool
 *
 * c) intersect(rect1, rect2, pResult)
 *      2D rectangle and 2D rectangle
 *      3D rectangle and 3D rectangle
 *     pResult is Rect2(3)d;
 *  return value is bool
 */
function intersect () {
    var arg1 = arguments[0];
    var arg2 = arguments[1];
    if (arguments.length == 3) {
        var arg3 = arguments[2];
        if (arg3 instanceof Rect2d) {
            return intersect_Rect2d_Rect2d(arg1, arg2, arg3);
        }
        else if (arg3 instanceof Rect3d) {
            return intersect_Rect3d_Rect3d(arg1, arg2, arg3)
        }
    }
    else if (arguments.length == 2) {
        if (arg2 instanceof Ray3d) {
            if (arg1 instanceof Plane3d) {
                return intersect_Plane3d_Ray3d(arg1, arg2);
            }
            else if (arg1 instanceof Sphere) {
                return intersect_Sphere_Ray3d(arg1, arg2);
            }
            else if (arg1 instanceof Rect3d) {
                return intersect_Rect3d_Ray3d(arg1, arg2);
            }
        }
        else if (arg2 instanceof Ray2d) {
            if (arg1 instanceof Plane2d) {
                return intersect_Plane2d_Ray2d(arg1, arg2);
            }
            else if (arg1 instanceof Circle) {
                return intersect_Circle_Ray2d(arg1, arg2);
            }
            else if (arg1 instanceof Rect2d) {
                return intersect_Rect2d_Ray2d(arg1, arg2);
            }
        }
        else if (arg1 instanceof Circle && arg2 instanceof Circle) {
            return intersect_Circle_Circle(arg1, arg2);
        }
        else if (arg1 instanceof Sphere && arg2 instanceof Sphere) {
            return intersect_Sphere_Sphere(arg1, arg2);
        }
        else if (arg1 instanceof Rect2d && arg2 instanceof Circle) {
            return intersect_Rect2d_Circle(arg1, arg2);
        }
        else if (arg1 instanceof Rect3d && arg2 instanceof Sphere) {
            return intersect_Rect3d_Sphere(arg1, arg2);
        }
    }
    else {
        debug_assert(false, "Incorrect number of arguments")
    }
}
;

/**
 * Testing for intersection between a
 * 2D circle and a 2D plane
 * @tparam Circle pCircle
 * @tparam Plane2d pPlane
 * @treturn Int From enum ePlaneClassifications
 */
function planeClassify_Circle_Plane (pCircle, pPlane) {
    var d = pPlane.signedDistance(pCircle.v2fCenter);
    if (Math.abs(d) < pCircle.fRadius) {
        return a.Geometry.k_plane_intersect;
    }
    else if (d) {
        return a.Geometry.k_plane_front;
    }
    return a.Geometry.k_plane_back;
}
;
/**
 * Testing for intersection between a
 * 3D Sphere and a 3D plane
 * @tparam Sphere pSphere
 * @tparam Plane3d pPlane
 * @treturn Int From enum ePlaneClassifications
 */
function planeClassify_Sphere_Plane (pSphere, pPlane) {
    var d = pPlane.signedDistance(pCircle.v3fCenter);
    if (Math.abs(d) < pCircle.fRadius) {
        return a.Geometry.k_plane_intersect;
    }
    else if (d) {
        return a.Geometry.k_plane_front;
    }
    return a.Geometry.k_plane_back;
}
;
/**
 * Testing for intersection between a
 * 2D Rect and a 2D plane
 * @tparam Rect2d pRect
 * @tparam Plane2d pPlane
 * @treturn Int From enum ePlaneClassifications
 */
function planeClassify_Rect2d_Plane (pRect, pPlane) {
    var minPoint = new Vec2;
    var maxPoint = new Vec2;
    // build two points based on the direction
    // of the plane vector. minPoint 
    // and maxPoint are the two points
    // on the rectangle furthest away from
    // each other along the pPlane v2fNormal
    if (pPlane.v2fNormal.pData.X > 0.0) {
        minPoint.pData.X = pRect.fX0;
        maxPoint.pData.X = pRect.fX1;
    }
    else {
        minPoint.pData.X = pRect.fX1;
        maxPoint.pData.X = pRect.fX0;
    }
    if (pPlane.v2fNormal.pData.Y > 0.0) {
        minPoint.pData.Y = pRect.fY0;
        maxPoint.pData.Y = pRect.fY1;
    }
    else {
        minPoint.pData.Y = pRect.fY1;
        maxPoint.pData.Y = pRect.fY0;
    }
    // compute the signed distance from 
    // the pPlane to both points
    var dmin = pPlane.signedDistance(minPoint);
    var dmax = pPlane.signedDistance(maxPoint);
    // the rectangle intersects the pPlane if
    // one value is positive and the other is negative
    if (dmin * dmax < 0.0) {
        return a.Geometry.k_plane_intersect;
    }
    else if (dmin) {
        return a.Geometry.k_plane_front;
    }
    return a.Geometry.k_plane_back;
}
;
/**
 * Testing for intersection between a
 * 3D Rect and a 3D plane
 * @tparam Rect3d pRect
 * @tparam Plane3d pPlane
 * @treturn Int From enum ePlaneClassifications
 */
function planeClassify_Rect3d_Plane (pRect, pPlane) {
    var minPoint = Vec3();
    var maxPoint = Vec3();
    var pNormData = pPlane.v3fNormal.pData;

    // build two points based on the direction
    // of the plane vector. minPoint 
    // and maxPoint are the two points
    // on the rectangle furthest away from
    // each other along the pPlane v3fNormal
    if (pNormData.X > 0.0) {
        minPoint.pData.X = pRect.fX0;
        maxPoint.pData.X = pRect.fX1;
    }
    else {
        minPoint.pData.X = pRect.fX1;
        maxPoint.pData.X = pRect.fX0;
    }
    if (pNormData.Y > 0.0) {
        minPoint.pData.Y = pRect.fY0;
        maxPoint.pData.Y = pRect.fY1;
    }
    else {
        minPoint.pData.Y = pRect.fY1;
        maxPoint.pData.Y = pRect.fY0;
    }
    if (pNormData.Z > 0.0) {
        minPoint.pData.Z = pRect.fZ0;
        maxPoint.pData.Z = pRect.fZ1;
    }
    else {
        minPoint.pData.Z = pRect.fZ1;
        maxPoint.pData.Z = pRect.fZ0;
    }
    // compute the signed distance from 
    // the pPlane to both points
    var dmin = pPlane.signedDistance(minPoint);
    var dmax = pPlane.signedDistance(maxPoint);
    // the rectangle intersects the pPlane if
    // one value is positive and the other is negative

    if (dmin * dmax < 0.0) {
        return a.Geometry.k_plane_intersect;
    }
    else if (dmin < 0) {
      return a.Geometry.k_plane_front;
    }

    return a.Geometry.k_plane_back;
}
;
/**
 * Testing for intersection between a:
 * 2D circle and a 2D plane
 * 3D sphere and a 3D plane
 * 3D rectangle and a 3D plane
 * 2D rectangle and a 2D plane
 */
function planeClassify (value, plane) {
    if (plane instanceof Plane2d) {
        if (value instanceof Circle) {
            return planeClassify_Circle_Plane(value, plane);
        }
        else if (value instanceof Rect2d) {
            return planeClassify_Rect2d_Plane(value, plane);
        }
    }
    else if (plane instanceof Plane3d) {
        if (value instanceof Sphere) {
            return planeClassify_Sphere_Rect(value, plane);
        }
        else if (value instanceof Rect3d) {
            return planeClassify_Rect3d_Plane(value, plane);
        }
    }
}
;
/**
 * Analog intersect_Rect2d_Rect2d();
 * @tparam Rect2d pRectA
 * @tparam Rect2d pRectB
 * @tparam Rect2d pResult
 * @treturn Boolean
 */
function intersectRect2d (pRectA, pRectB, pResult) {
    pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
    pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);

    pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);
    pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);

    return ((pResult.fX0 <= pResult.fX1)
        && (pResult.fY0 <= pResult.fY1));
}
;
/**
 * Analog intersect_Rect3d_Rect3d();
 * @tparam Rect3d pRectA
 * @tparam Rect3d pRectB
 * @tparam Rect3d pResult
 * @treturn Boolean
 */
function intersectRect3d (pRectA, pRectB, pResult) {
    pResult.fX0 = Math.max(pRectA.fX0, pRectB.fX0);
    pResult.fX1 = Math.min(pRectA.fX1, pRectB.fX1);

    pResult.fY0 = Math.max(pRectA.fY0, pRectB.fY0);
    pResult.fY1 = Math.min(pRectA.fY1, pRectB.fY1);

    pResult.fZ0 = Math.max(pRectA.fZ0, pRectB.fZ0);
    pResult.fZ1 = Math.min(pRectA.fZ1, pRectB.fZ1);

    return (pResult.fX0 <= pResult.fX1)
        && (pResult.fY0 <= pResult.fY1)
        && (pResult.fZ0 <= pResult.fZ1);
}
;
/**
 * Classify 2 Rects
 * @tparam Rect2d pRectA
 * @tparam Rect2d pRectB
 * @tparam Rect2d pResult
 * @treturn Int From enum eVolumeClassifications
 */
function classifyRect2d (pRectA, pRectB, pResult) {
    if (pRectA.isEqual(pRectB)) {
        return (a.Geometry.EQUAL);
    }
    if (intersectRect2d(pRectA, pRectB, pResult)) {
        if (pRectB.isEqual(pResult)) {
            // b is equal to the result, so it is surrounded by a
            return (a.Geometry.A_CONTAINS_B);
        }
        if (pRectA.isEqual(pResult)) {
            // a is equal to the result, so it is surrounded by b
            return (a.Geometry.B_CONTAINS_A);
        }
        // if none of the above is true, the result is a discreet intersection
        return (a.Geometry.INTERSECTING);
    }
    // no itersection takes place
    return (a.Geometry.NO_RELATION);
}
;

function classifyRect3d (pRectA, pRectB, pResult) {
    if (pRectA.isEqual(pRectB)) {
        return (a.Geometry.EQUAL);
    }
    if (intersectRect3d(pRectA, pRectB, pResult)) {
        if (pRectB.isEqual(pResult)) {
            // b is equal to the result, so it is surrounded by a
            return (a.Geometry.A_CONTAINS_B);
        }
        if (pRectA.isEqual(pResult)) {
            // a is equal to the result, so it is surrounded by b
            return (a.Geometry.B_CONTAINS_A);
        }
        // if none of the above is true, the result is a discreet intersection
        return (a.Geometry.INTERSECTING);
    }
    // no itersection takes place
    return (a.Geometry.NO_RELATION);
}

// Add classes to akra namespace
a.Ray2d = Ray2d;
a.Ray2d = Ray2d;
a.Segment2d = Segment2d;
a.Segment3d = Segment3d;
a.Circle = Circle;
a.Sphere = Sphere;
a.Plane2d = Plane2d;
a.Plane3d = Plane3d;
a.Rect2d = Rect2d;
a.Rect3d = Rect3d;
a.Frustum = Frustum;
a.intersect = intersect;
a.planeClassify = planeClassify;
a.intersectRect3d = intersectRect3d;
a.classifyRect3d = classifyRect3d;
a.intersectRect2d = intersectRect2d;
a.classifyRect2d = classifyRect2d;
