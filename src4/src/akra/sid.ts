interface F {
    /** Serail unique identifier. */
    (): uint;
    total: uint;
}

var f: F = <F>(() => f.total);
f.total = 0;

export = f;