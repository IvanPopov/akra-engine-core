// AIRenderState interface
// [write description here...]


interface AIRenderState {
	mesh: { isSkinning: boolean; };
	
	lights: {
		omni: int;
		project: int;
		omniShadows: int;
		projectShadows: int;
	};

	isAdvancedIndex: boolean;
}


