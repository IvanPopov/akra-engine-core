/**
 * @file
 * @author Ivan Popov
 * @brief Texture class.
 * @email vantuziast@odserve.org
 */

/**
 * @typedef
 */
Define(a.PaletteEntry(), function () {
    Uint8Array(4);
});

/**
 * @def
 */
Define(peRed, __[0]);
Define(peGreen, __[1]);
Define(peBlue, __[2]);
Define(peFlags, __[3]);

/**
 * @def
 */
Define(R, __[0]);
Define(G, __[1]);
Define(B, __[2]);
Define(A, __[3]);


/**
 * ImageInfo Class
 * @ctor
 * Constructor of ImageInfo class
 */
function ImageInfo () {
    this.iWidth = 0;
    this.iHeight = 0;
    this.iDepth = 0;
    this.iMipLevel = 0;
    this.eFormat = 0;
    this.eType = 0;
    this.eResourceType = 0;
    this.eImageFileFormat = 0;
}

a.ImageInfo = ImageInfo;


Define(Float32(v), function () {
    Float32Array([v])
});
Define(a.Float32, Float32);

/**
 * Color constructors
 */
/**
 * @typedef
 */
Define(a.Color4i(), function () {
    Uint8Array(4);
});
/**
 * @typedef
 */
Define(a.Color3i(), function () {
    Uint8Array(3);
});
/**
 * @typedef
 */
Define(a.Color4f(), function () {
    Float32Array(4);
});
/**
 * @typedef
 */
Define(a.Color3f(), function () {
    Float32Array(3);
});
/**
 * @typedef
 */
Define(a.Color, a.Color4i);
/**
 * @typedef
 */
Define(a.ColorValue, a.Color4f);
/**
 * @typedef
 */
Define(a.Color4f(r, g, b, a), function () {
    Float32Array([r, g, b, a]);
});
/**
 * @typedef
 */
Define(a.Color4f(c, a), function () {
    Float32Array([c, c, c, a]);
});
/**
 * @typedef
 */
Define(a.Color4f(r, g, b), function () {
    Float32Array([r, g, b, 1.0]);
});
/**
 * @typedef
 */
Define(a.Color4f(c), function () {
    Float32Array([c, c, c, c]);
});
/**
 * @typedef
 */
Define(a.Color4i(r, g, b, a), function () {
    Uint8Array([r, g, b, a]);
});
/**
 * @typedef
 */
Define(a.Color4i(c, a), function () {
    Uint8Array([c, c, c, a]);
});
/**
 * @typedef
 */
Define(a.Color4i(r, g, b), function () {
    Uint8Array([r, g, b, 1.0]);
});
/**
 * @typedef
 */
Define(a.Color4i(c), function () {
    Uint8Array([c, c, c, c]);
});

/**
 * @typedef
 */
Define(a.Color3f(r, g, b), function () {
    Float32Array([r, g, b]);
});
/**
 * @typedef
 */
Define(a.Color3f(c), function () {
    Float32Array([c, c, c]);
});
/**
 * @typedef
 */
Define(a.Color3i(r, g, b), function () {
    Uint8Array([r, g, b]);
});
/**
 * @typedef
 */
Define(a.Color3i(c), function () {
    Uint8Array([c, c, c]);
});

/**
 * 4 component color class methods.
 */
Define(a.Color4.set(c2, c1), function () {
    c1.R = c2.R;
    c1.G = c2.G;
    c1.B = c2.B;
    c1.A = c2.A;
});

Define(a.Color4.val(v, c), function () {
    c.R = c.G = c.B = c.A = v;
});

Define(a.Color4.val(r, g, b, c), function () {
    c.R = r;
    c.G = g;
    c.B = b;
});

Define(a.Color4.val(r, g, b, a, c), function () {
    c.R = r;
    c.G = g;
    c.B = b;
    c.A = a;
});


/**
 * 3 components color class methods.
 */

Define(a.Color3.set(c2, c1), function () {
    c1.R = c2.R;
    c1.G = c2.G;
    c1.B = c2.B;
});

Define(a.Color3.val(v, c), function () {
    c.R = c.G = c.B = v;
});

Define(a.Color3.val(r, g, b, c), function () {
    c.R = r;
    c.G = g;
    c.B = b;
});



