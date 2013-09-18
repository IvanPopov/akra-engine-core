///<reference path="../../../bin/DEBUG/akra.ts"/>
///<reference path="../../../bin/DEBUG/Progress.ts"/>

declare var jQuery: JQueryStatic;
declare var $: JQueryStatic;

#define int number
#define uint number
#define float number
#define double number
#define long number
#define const var

#define vec2(...) Vec2.stackCeil.set(__VA_ARGS__)
#define vec3(...) Vec3.stackCeil.set(__VA_ARGS__)
#define vec4(...) Vec4.stackCeil.set(__VA_ARGS__)
#define quat4(...) Quat4.stackCeil.set(__VA_ARGS__)
#define mat3(...) Mat3.stackCeil.set(__VA_ARGS__)
#define mat4(...) Mat4.stackCeil.set(__VA_ARGS__)

#define SLOT(call) #call
#define SIGNAL(call) #call

#define LOG(...)            logger.log(__VA_ARGS__);
#define TRACE(...)          logger.log(__VA_ARGS__);
#define INFO(...)           logger.info(__VA_ARGS__);
#define WARNING(...)        logger.warning(__VA_ARGS__);
#define ERROR(...)          logger.error(__VA_ARGS__);
#define CRITICAL(...)       logger.criticalError(__VA_ARGS__);
#define CRITICAL_ERROR(...) logger.criticalError(__VA_ARGS__);
#define ASSERT(...)         logger.assert(__VA_ARGS__);