module akra {
    var x: uint = 0;
    export function guid(): uint {
        return ++ x;
    }
}