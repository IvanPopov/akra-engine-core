/**
 * векторы и матрицы
 */
Include('Vec2.js');
Include('Vec3.js');
Include('Vec4.js');
Include('Mat3.js');
Include('Mat4.js');
Include('Quat4.js');

window['Vec2'] = Vec2;
window['Vec3'] = Vec3;
window['Vec4'] = Vec4;
window['Mat3'] = Mat3;
window['Mat4'] = Mat4;
window['Quat4'] = Quat4;

Include("NumericTools.js");
Include("Bitflags.js");
Include("DataTypes.js");
Include("Geometry.js");
Include("PerlinNoise.js");