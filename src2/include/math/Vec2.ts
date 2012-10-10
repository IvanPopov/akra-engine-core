///<reference path="../akra.ts" />

module akra {
    export class Vec2 {
        x: float;
        y: float;

        constructor ();
        constructor (v2f: Vec2);
        constructor (x: float, y: float);
        constructor (x?, y?) {
            switch (arguments.length) {
                case 0:
                    this.x = this.y =  0.;
                break;
                case 1:
                    this.set(x);
                break;
                case 2:
                    this.set(x, y);
            }
            
        }


        set(): Vec2;
        set (v2f: Vec2): Vec2;
        set (x: float, y: float): Vec2;
        set (x?, y?): Vec2 {
            switch(arguments.length) {
                case 0:
                    this.x = this.y = 0.;
                    break;
                case 1:
                    if (isFloat(x)) {
                        this.x = x;
                        this.y = x;
                    }
                    else {
                        this.x = x.x;
                        this.y = x.y;
                    }
                    break;
                case 2:
                    this.x = x;
                    this.y = y;
            }

            return this;
        }

    }
}