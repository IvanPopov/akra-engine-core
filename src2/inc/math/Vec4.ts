module akra.math {
    export class Vec4 {
        x: float;
        y: float;
        z: float;
        w: float;

        constructor ();
        constructor (f: float);
        constructor (v4f: Vec4);
        constructor (v3f: Vec3, w?: float);
        constructor (x: float, v3f: Vec3);
        constructor (v2f1: Vec2, v2f2: Vec2);
        constructor (x: float, y: float, z: float, w: float);
        constructor (x? , y? , z? , w? ) {
            switch (arguments.length) {
                case 0:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
                case 1:
                    this.set(x);
                    break;
                case 2:
                    this.set(x, y);
                    break;
                case 4:
                    this.set(x, y, z, w);
                    break;
            }

        }


        set(): Vec4;
        set(f: float): Vec4;
        set(v4f: Vec4): Vec4;
        set(v3f: Vec3, w?: float): Vec4;
        set(x: float, v3f: Vec3): Vec4;
        set(v2f1: Vec2, v2f2: Vec2): Vec4;
        set(x: float, y: float, z: float, w: float): Vec4;
        set(x? , y? , z? , w? ): Vec4 {
            switch (arguments.length) {
                case 0:
                    this.x = this.y = this.z = this.w = 0.;
                    break;
                case 1:
                    //float
                    if (isFloat(x)) {       
                        this.x = this.y = this.z = this.w = x;
                    }
                    //vec4
                    else {                  
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                        this.w = x.w;
                    }
                    break;
                case 2:
                    //float and vec3
                    if (isFloat(x)) {       
                        this.x = x;
                        this.y = y.x;
                        this.z = y.y;
                        this.w = y.z;
                    }
                    //vec3 and float
                    else if (isFloat(y)) {  
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                        this.w = y;
                    }
                    //vec2 and vec2
                    else {                  
                        this.x = x.x;
                        this.y = x.y;
                        this.z = y.x;
                        this.w = y.y;
                    }
                    break;
                case 4:
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.w = w;
            }
            return this;
        }
    }
}