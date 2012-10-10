///<reference path="../akra.ts" />

module akra {
    export class Mat2 {
        private pData: Float32Array = new Float32Array(4);

        constructor ();
        constructor (m2f: Mat2);
        constructor (f11: float, f12: float, f21: float, f22: float);
        constructor (f11? , f12? , f21? , f22? ) {
            switch (arguments.length) {
                case 1:
                    this.set(f11);
                    break;
                case 4:
                    this.set(f11, f12, f21, f22);
                    break;
            }
        }

        set(): Mat2;
        set(m2f: Mat2): Mat2;
        set(f11: float, f12: float, f21: float, f22: float): Mat2;
        set(f11? , f12? , f21? , f22? ): Mat2 {

            var pData: Float32Array = this.pData;
            
            switch (arguments.length) {
                case 1:
                    if (isFloat(f11)) {
                        pData[0] = pData[1] = pData[2] = pData[3] = f11;
                    }
                    else {
                        pData.set(f11.pData);
                    }
                    break;
                case 4:
                    pData[0] = f11;
                    pData[1] = f21;
                    pData[2] = f12;
                    pData[3] = f22;
                    break;
            }

            return this;
        }
    }
}