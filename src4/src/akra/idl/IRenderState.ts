

module akra {
	interface IRenderState {
		mesh: { isSkinning: boolean; };
		
		lights: {
			omni: int;
			project: int;
			omniShadows: int;
			projectShadows: int;
		};
	
		isAdvancedIndex: boolean;
	}
	
	
	
}
