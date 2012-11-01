//interface float extends Number {
//}

//declare var float: {
//    new (value?: any): Number;
//    (value?: any): Number;
//    prototype: Number;
    
//}

//interface int extends Number {
//}

//declare var int: {
//    new (value?: any): Number;
//    (value?: any): int;
//    prototype: int;
//}

//interface uint extends Number {
//}

////declare var uint: {
////    new (value?: any): Number;
////    (value?: any): uint;
////    prototype: uint;
////}

//interface long extends Number {
//}

//declare var long: {
//    new (value?: any): Number;
//    (value?: any): long;
//    prototype: long;
//}

//interface double extends Number {
//}

//declare var double: {
//    new (value?: any): Number;
//    (value?: any): double;
//    prototype: double;
//}

interface NavigatorID {
	vendor: string;
}

interface Window {
	opera: string;
}
declare function requestAnimationFrame(callback: FrameRequestCallback, element: HTMLElement): number;
