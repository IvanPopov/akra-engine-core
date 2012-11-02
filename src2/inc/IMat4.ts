#ifndef IMAT4_TS
#define IMAT4_TS

/**
 * @important Если внезапно задумаем перейти обратно на 
 * хранение данных в матрицах по строкам, как собственно и было в начале,
 * то необходимо раскомментить definы и переписать метод set, 
 * так как он ложит по столбцам
 */

// #define __11 0
// #define __12 1
// #define __13 2
// #define __14 3
// #define __21 4
// #define __22 5
// #define __23 6
// #define __24 7
// #define __31 8
// #define __32 9
// #define __33 10
// #define __34 11
// #define __41 12
// #define __42 13
// #define __43 14
// #define __44 15

#define __11 0
#define __12 4
#define __13 8
#define __14 12
#define __21 1
#define __22 5
#define __23 9
#define __24 13
#define __31 2
#define __32 6
#define __33 10
#define __34 14
#define __41 3
#define __42 7
#define __43 11
#define __44 15

module akra.math {
	export interface IMat4 {
		data: Float32Array;
	};
};

#endif