///<reference path="../akra.ts" />

module akra {
    export class Vec3 {
        x: number;
        y: number;
        z: number;

        
        constructor (f?);
        constructor (v3f: Vec3);
        constructor (v2f: Vec2, z: number);
        constructor (x: number, v2f: Vec2);
        constructor (x: number, y: number, z: number);


        get xy(): Vec2 {
            return new Vec2(this.x, this.y);
        }

        get xz(): Vec2 {
            return new Vec2(this.x, this.z);
        }

        get yx(): Vec2 {
            return new Vec2(this.y, this.x);
        }

        get yz(): Vec2 {
            return new Vec2(this.y, this.z);
        }

        get zx(): Vec2 {
            return new Vec2(this.z, this.x);
        }

        get zy(): Vec2 {
            return new Vec2(this.z, this.y);
        }

        get xyz(): Vec3 {
            return new Vec3(this.x, this.y, this.z);
        }

        constructor (x?, y?, z?) {
            //TODO: may be use only simple constructor(x, y, z)?
            switch (arguments.length) {
                case 0:
                    this.x = this.y = this.z = 0.;
                break;
                case 1:
                    this.set(x);
                break;
                case 2:
                    this.set(x, y);
                break;
                case 3:
                    this.set(x, y, z);
            }
        }


        set (v3f: Vec3);
        set (v2f: Vec2, z: number);
        set (x: number, v2f: Vec2);
        set (x: number, y: number, z: number);

        /**
         * @inline
         */
        set(x? ,y?, z?): Vec3 {

            switch (arguments.length) {
                case 0:
                case 1:
                    //number
                    if (typeof x === "number") {
                        this.x = this.y = this.z = x || 0.;
                    }
                    else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = x.z;
                    }
                    break;
                case 2:
                    //number and vec2
                    if (typeof x === "number") {
                        this.x = x;
                        this.y = y.x;
                        this.z = y.y;
                    }
                    //number and vec3
                    else {
                        this.x = x.x;
                        this.y = x.y;
                        this.z = y;
                    }
                    break;
                case 3:
                    this.x = x;
                    this.y = y;
                    this.z = z;
            }

            return this;
        }  

        /*
         * Performs a vector addition
         * @inline
         */
        add(v3fVec: Vec3, v3fDest?: Vec3): Vec3 {
            if (!v3fDest) {
                v3fDest = this;
            }

            v3fDest.x = this.x + v3fVec.x; 
            v3fDest.y = this.y + v3fVec.y;
            v3fDest.z = this.z + v3fVec.z;

            return this;
        }
        

        /**
         * @inline
         */
        toString(): string {
            return "[x: " + this.x + ", y: " + this.y + ", z: " + this.z + "]";
        }

        static v3f: Vec3 = new Vec3;
    }


}