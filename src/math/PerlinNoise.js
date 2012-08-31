/**
 * @file
 * @brief functions and classes
 * @author sss
 *
 * Classes reload:
 * PerlinNoise
 */
/**
 * Perlin noise class
 * @ctor
 * Constructor
 */
function PerlinNoise () {
    Enum([
             k_tableSize = 256,
             k_tableMask = 255
         ], eTable, a.PerlinNoise);

    /**
     * Array
     * @type Array<Float32Array>
     * @private
     */
    this.m_pv2fTable = new Array(a.PerlinNoise.k_tableSize);
    /**
     * Array
     * @type UInt8Array
     * @private
     */
    this.m_piLut = new Uint8Array(a.PerlinNoise.k_tableSize);

    this.setup();
}
;
/**
 * Setup
 * @private
 */
PerlinNoise.prototype.setup = function () {
    var fStep = Math.PI * 2 / a.PerlinNoise.k_tableSize;
    var fVal = 0.0;
    for (var i = 0; i < a.PerlinNoise.k_tableSize; ++i) {
        this.m_pv2fTable[i] = new Vec2();
        this.m_pv2fTable[i].x = Math.sin(fVal);
        this.m_pv2fTable[i].y = Math.cos(fVal);
        fVal += fStep;

        this.m_piLut[i] = Math.random() * a.PerlinNoise.k_tableMask;
    }
};
/**
 * Get vec by x,y
 * @private
 * @tparam Int iX
 * @tparam Int iY
 * @treturn Float32Array vector
 */
PerlinNoise.prototype.getVec = function (iX, iY) {
    var iA = this.m_piLut[iX & a.PerlinNoise.k_tableMask];
    var iB = this.m_piLut[iY & a.PerlinNoise.k_tableMask];
    var iVal = this.m_piLut[(iA + iB) & a.PerlinNoise.k_tableMask];
    return this.m_pv2fTable[iVal];
};
/**
 * Noise
 * @tparam Float fX
 * @tparam Float fY
 * @tparam Float fScale
 * @treturn Float
 */
PerlinNoise.prototype.noise = function (fX, fY, fScale) {
    var v2fPos = Vec2();
	v2fPos.set(fX * fScale, fY * fScale);

    var fX0 = Math.floor(v2fPos.x);
    var fX1 = fX0 + 1;
    var fY0 = Math.floor(v2fPos.y);
    var fY1 = fY0 + 1;

    var v0 = this.getVec(fX0, fY0);
    var v1 = this.getVec(fX0, fY1);
    var v2 = this.getVec(fX1, fY0);
    var v3 = this.getVec(fX1, fY1);

    var d0 = Vec2();
	d0.set(v2fPos.x - fX0, v2fPos.y - fY0);

    var d1 = Vec2();
	d1.set(v2fPos.x - fX0, v2fPos.y - fY1);

    var d2 = Vec2();
	d2.set(v2fPos.x - fX1, v2fPos.y - fY0);

    var d3 = Vec2();
	d3.set(v2fPos.x - fX1, v2fPos.y - fY1);

    var fH0 = (d0.x * v0.x) + (d0.y * v0.y);
    var fH1 = (d1.x * v1.x) + (d1.y * v1.y);
    var fH2 = (d2.x * v2.x) + (d2.y * v2.y);
    var fH3 = (d3.x * v3.x) + (d3.y * v3.y);

    var fSx, fSy;
    /*
     Perlin's original equation was faster,
     but produced artifacts in some situations
     Sx = (3*powf(d0.x,2.0f))
     -(2*powf(d0.x,3.0f));

     Sy = (3*powf(d0.y,2.0f))
     -(2*powf(d0.y,3.0f));
     */

    // the revised blend equation is 
    // considered more ideal, but is
    // slower to compute
    fSx = (6 * Math.pow(d0.x, 5.0))
        - (15 * Math.pow(d0.x, 4.0))
        + (10 * Math.pow(d0.x, 3.0));

    fSy = (6 * Math.pow(d0.y, 5.0))
        - (15 * Math.pow(d0.y, 4.0))
        + (10 * Math.pow(d0.y, 3.0));

    var fAvgX0 = fH0 + (fSx * (fH2 - fH0));
    var fAvgX1 = fH1 + (fSx * (fH3 - fH1));
    var fResult = fAvgX0 + (fSy * (fAvgX1 - fAvgX0));

    return fResult;
};

a.PerlinNoise = PerlinNoise;