/**
 * @file
 * @brief Препроцессорные определения для написания файлов эффектов в
 * удобном синтаксисе.
 *
 * @author Ivan Popov
 * @email vantuziast@odserve.org
 */

Define(mat4(NAME), function () {
    this.mat4(NAME).val;
});
Define(mat4(NAME, N), function () {
    this.mat4(NAME, N).val;
});

Define(mat3(NAME), function () {
    this.mat3(NAME).val;
});
Define(mat3(NAME, N), function () {
    this.mat3(NAME, N).val;
});

Define(vec2(NAME), function () {
    this.vec2(NAME).val;
});
Define(vec2(NAME, N), function () {
    this.vec2(NAME, N).val;
});

Define(vec3(NAME), function () {
    this.vec3(NAME).val;
});
Define(vec3(NAME, N), function () {
    this.vec3(NAME, N).val;
});

Define(vec4(NAME), function () {
    this.vec4(NAME).val;
});
Define(vec4(NAME, N), function () {
    this.vec4(NAME, N).val;
});

Define(float32(NAME), function () {
    this.float32(NAME).val;
});
Define(float32(NAME, N), function () {
    this.float32(NAME, N).val;
});

Define(int32(NAME), function () {
    this.int32(NAME).val;
});
Define(int32(NAME, N), function () {
    this.int32(NAME, N).val;
});

Define(sampler(NAME), function () {
    this.sampler(NAME).val;
});
Define(texture(NAME), function () {
    this.texture(NAME);
});

Define(begin_passes(), function () {
    var passes = [];
});
Define(end_passes(), function () {
    return passes;
});

Define(pixel(NAME), function () {
    this.pixel(NAME).val;
});
Define(vertex(NAME), function () {
    this.vertex(NAME).val;
});
Define(shader(NAME), function () {
    this.shader(NAME).val;
});

Define(technique(NAME), function () {
    this.technique(NAME).val;
});
Define(pass(NAME), function () {
    (passes[passes.length] = new a.EffectPass(NAME, fx)).val;
});

Define(compile(VERTEX, PIXEL), function () {
    Object({
               vertex: VERTEX,
               pixel:  PIXEL
           });
});