get xx(): IVec2{
	return vec2(this.x, this.x);
};
set xx(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.x = v2fVec.y;
};

get xy(): IVec2{
	return vec2(this.x, this.y);
};
set xy(v2fVec: IVec2){
	this.x = v2fVec.x; 	this.y = v2fVec.y;
};

get yx(): IVec2{
	return vec2(this.y, this.x);
};
set yx(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.x = v2fVec.y;
};

get yy(): IVec2{
	return vec2(this.y, this.y);
};
set yy(v2fVec: IVec2){
	this.y = v2fVec.x; 	this.y = v2fVec.y;
};