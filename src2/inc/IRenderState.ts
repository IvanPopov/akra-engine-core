#ifndef IRENDERSTATE_TS
#define IRENDERSTATE_TS

module akra {
	export interface IRenderState {
		mesh: { isSkinning: bool; };
		
		lights: {
			omni: int;
			project: int;
			omniShadows: int;
			projectShadows: int;
		};

		isAdvancedIndex: bool;
	}
}

#endif