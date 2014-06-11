
module akra.sort {

    export function minMax(a: number, b: number): number { return a - b };
    export function maxMin(a: number, b: number): number { return b - a };

    /**
     * Search In Sort Array
     */
    export function binary<T>(array: T[], value: T): number {
        if (value < array[0] || value > array[array.length - 1]) {
            return -1;
        }

        if (value === array[0]) {
            return 0;
        }

        if (value === array[array.length - 1]) {
            return array.length - 1;
        }

        var p: number = 0;
        var q: number = array.length - 1;

        while (p < q) {
            var s: number = (p + q) >> 1;

            if (value === array[s]) {
                return s;
            }
            else if (value > array[s]) {
                p = s + 1;
            }
            else {
                q = s;
            }
        }

        return -1;
    }

}