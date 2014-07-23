module akra {
	﻿export enum EPlaneClassifications {
	    /**
	     * ax+by+cz+d=0
	     * PLANE_FRONT - объект находится перед плоскостью, то есть по направлению нормали
	     * PLANE_BACK - объект находится за плостостью, то есть против направления нормали
	     */
	    PLANE_FRONT = 0,
	    PLANE_BACK,
	    PLANE_INTERSECT
	}
}
