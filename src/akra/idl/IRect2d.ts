
/// <reference path="IVec2.ts" />
/// <reference path="ICircle.ts" />

module akra {
	export interface IRect2d {
		x0: float;
		x1: float;
		y0: float;
		y1: float;
	
		getLeft(): float;
		getTop(): float;
	
		getWidth(): float;
		getHeight(): float;
	
		set(): IRect2d;
		set(pRect: IRect2d): IRect2d;
		set(v2fVec: IVec2): IRect2d;
		set(fSizeX: float, fSizeY: float): IRect2d;
		set(v2fMinPoint: IVec2, v2fMaxPoint: IVec2): IRect2d;
		set(fX0: float, fX1: float, fY0: float, fY1: float): IRect2d;
	
		setFloor(pRect: IRect2d): IRect2d;
		setCeil(pRect: IRect2d): IRect2d;
	
		clear(): IRect2d;
	
		addSelf(fValue: float): IRect2d;
		addSelf(v2fVec: IVec2): IRect2d;
	
		subSelf(fValue: float): IRect2d;
		subSelf(v2fVec: IVec2): IRect2d;
	
		multSelf(fValue: float): IRect2d;
		multSelf(v2fVec: IVec2): IRect2d;
	
		divSelf(fValue: float): IRect2d;
		divSelf(v2fVec: IVec2): IRect2d;
	
		offset(v2fOffset: IVec2): IRect2d;
		offset(fOffsetX: float, fOffsetY: float): IRect2d;
		
		expand(fValue: float): IRect2d;
		expand(v2fValue: IVec2): IRect2d;
		expand(fValueX: float, fValueY: float): IRect2d;
	
		expandX(fValue: float): IRect2d;
		expandY(fValue: float): IRect2d;
	
		resize(v2fSize: IVec2): IRect2d;
		resize(fSizeX: float, fSizeY: float): IRect2d;
	
		resizeX(fSize: float): IRect2d;
		resizeY(fSize: float): IRect2d;
	
		resizeMax(v2fSpan: IVec2): IRect2d;
		resizeMax(fSpanX: float, fSpanY: float): IRect2d;
	
		resizeMaxX(fSpan: float): IRect2d;
		resizeMaxY(fSpan: float): IRect2d;
	
		resizeMin(v2fSpan: IVec2): IRect2d;
		resizeMin(fSpanX: float, fSpanY: float): IRect2d;
	
		resizeMinX(fSpan: float): IRect2d;
		resizeMinY(fSpan: float): IRect2d;
	
		unionPoint(v2fPoint: IVec2): IRect2d;
		unionPoint(fX: float, fY: float): IRect2d;
		unionRect(pRect: IRect2d): IRect2d;
	
		negate(pDestination?: IRect2d): IRect2d;
		normalize(): IRect2d;
	
		isEqual(pRect: IRect2d): boolean;
		isClear(): boolean;
		isValid(): boolean;
		isPointInRect(v2fPoint: IVec2): boolean;
	
		midPoint(v2fDestination?: IVec2): IVec2;
		midX(): float;
		midY(): float;
	
		size(v2fDestination?: IVec2): IVec2;
		sizeX(): float;
		sizeY(): float;
	
		minPoint(v2fDestination?: IVec2): IVec2;
		maxPoint(v2fDestination?: IVec2): IVec2;
	
		area(): float;
	
		corner(iIndex: uint, v2fDestination?: IVec2): IVec2;
	
		createBoundingCircle(pCircle?: ICircle): ICircle;
	
		distanceToPoint(v2fPoint: IVec2): float;
	
		toString(): string;
	}
	
	
	
}
