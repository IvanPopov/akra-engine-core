provide akra.system;

float3 vEye;
float3 vSunPos;
float3 vInvWavelength;

int nSamples;
float fSamples;
float fScaleDepth;
float fOuterRadius;
float fInnerRadius;
float fKr4PI;
float fKm4PI;
float fScale;
float fScaleOverScaleDepth;
float fCameraHeight;
float fCameraHeight2;

float3 vHG;
float2 Tex;
float fKrESun;
float fKmESun;

float4x4 worldViewProj : WorldViewProjection;

float Exposure = -2.0;
float c = 0.002f; // height falloff
float b = 0.002f; // global density

float3 Groundc0;
float3 Groundc1;

Texture tSkyBuffer;

sampler SkyBuffer = sampler_state 
{
    Texture = <tSkyBuffer>;
    AddressU  = WRAP;        
    AddressV  = CLAMP;
    MIPFILTER = NONE;
    MINFILTER = POINT;
    MAGFILTER = POINT;
};

// Vertex Shader
struct vertexInput {
    float3 pos      : POSITION;
    float2 t0       : TEXCOORD0;
};

struct vertexOutput {
	float4 pos : POSITION;
	float2 t0 : TEXCOORD0;
    float3 t1 : TEXCOORD1;
};

vertexOutput SkyFromGround_VS(vertexInput In ) 
{
	vertexOutput Out;
	Out.t0 = In.t0;
	Out.t1 = vEye - In.pos; // vEye - In.pos
	//Out.t1 = - ( In.pos.xyz ); // vEye - In.pos
	Out.pos = mul( float4(In.pos.xyz, 1.0), worldViewProj);
	return Out;
} 

float3 HDR( float3 LDR)
{
	return 1.0f - exp( Exposure * LDR );
}

float3 ToneMap( float3 HDR)
{
	return (HDR / (HDR + 1.0f));
}

// Calculates the Mie phase function
float getMiePhase(float fCos, float fCos2)
{
	//return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0*g*fCos, 1.5);
	return vHG.x * (1.0 + fCos2) / pow(vHG.y - vHG.z * fCos, 1.5);
}

// Calculates the Rayleigh phase function
float getRayleighPhase(float fCos2)
{
	return 0.75 + 0.75 * fCos2;
}

//Pixel Shader
struct pixelOutput {
    float4 color  : COLOR0;
};  

pixelOutput SkyFromGround_PS( vertexOutput In)
{
pixelOutput  Out;

float2 interp = frac( In.t0 * Tex.x );

float4 S00 = tex2D( SkyBuffer, In.t0 ).rgba;
float4 S10 = tex2D( SkyBuffer, In.t0 + float2(Tex.y, 0.0f) ).rgba;
float4 S01 = tex2D( SkyBuffer, In.t0 + float2(0.0f, Tex.y) ).rgba;
float4 S11 = tex2D( SkyBuffer, In.t0 + float2(Tex.y, Tex.y) ).rgba;

float4 Dx1 = lerp(S00, S10, interp.x);
float4 Dx2 = lerp(S01, S11, interp.x);

float4 vSamples = lerp(Dx1, Dx2, interp.y);
//float4 vSamples = tex2D( SkyBuffer, In.t0 ).rgba;

float3 c0 = vSamples.rgb * (vInvWavelength * fKrESun);
float3 c1 = vSamples.rgb * fKmESun;

//float fCos = vSamples.a;
float fCos = dot(vSunPos, In.t1) /length(In.t1);
float fCos2 = fCos * fCos;

float3 Mie = getMiePhase(fCos, fCos2) * c1;
Out.color.a = log2( length( Mie ) * 2500.0f);
//Out.color.a = length( Mie ) ;
Out.color.rgb = getRayleighPhase(fCos2) * c0 + Mie;
//Out.color.rgb = HDR(Out.color.rgb);

//Out.color.rgba = vSamples;
//Out.color.rgba =0;
//Out.color.rgba = In.t0.x;

return Out;
}

float ComputeVolumetricFog( float3 cameraToWorldPos )
{ 
float f = b * exp( -c * vEye.y );
float l = length( cameraToWorldPos );

float fogInt = exp( -(f * l) );

const float cSlopeThreshold = 0.01;
if( abs( cameraToWorldPos.y ) > cSlopeThreshold )
{
  float t = c * cameraToWorldPos.y;
  fogInt *= ( 1.0 - exp( -t ) ) / t;
}

return fogInt;
}

pixelOutput GroundFromGround_PS( vertexOutput In )
{
pixelOutput  Out;

float fCos = dot(vSunPos, In.t1) / length(In.t1);
float fCos2 = fCos * fCos;

float3 Mie = getMiePhase(fCos, fCos2) * Groundc1;
//Out.color.a = log2( length( Mie ) * 2500.0f );
Out.color.a = 0;

Out.color.rgb = getRayleighPhase(fCos2) * Groundc0 + Mie;
Out.color.rgb = HDR(Out.color.rgb);

//Out.color.rgb = lerp( Out.color.rgb, In.c0, ComputeVolumetricFog( In.t1 ) );
return Out;
}

//***********************************************************************
// UpdateTexture
//***********************************************************************
struct pixel_IN {
	float4 pos : POSITION;
	float2 t0 : TEXCOORD0;
};

float scale(float fCos)
{
	float x = 1.0 - fCos;
	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));
}

half4 UpdateTexture_PS( pixel_IN In ) : COLOR
{
    const float2 MPI = float2( cos( 1.0f ), 3.141592 * 2.0);
    float2 fxzy = MPI * In.t0;

    float3 v3Pos;
	v3Pos.x = sin( fxzy.x ) * cos( fxzy.y  );
	v3Pos.y = cos( fxzy.x );
	v3Pos.z = sin( fxzy.x ) * sin( fxzy.y  );
	v3Pos *= fOuterRadius;	 
	 
	// Get the ray from the camera to the vertex, and its length (which is the far point of the ray passing through the atmosphere)
	float3 v3Ray = v3Pos - vEye;
	float fFar = length(v3Ray);
	v3Ray /= fFar;

	// Calculate the ray's starting position, then calculate its scattering offset
	float3 v3Start = vEye;
	float fHeight = length(v3Start);
	float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fCameraHeight));
	float fStartAngle = dot(v3Ray, v3Start) / fHeight;
	float fStartOffset = fDepth*scale(fStartAngle);

	// Initialize the scattering loop variables
	float fSampleLength = fFar / fSamples;
	float fScaledLength = fSampleLength * fScale;
	float3 v3SampleRay = v3Ray * fSampleLength;
	float3 v3SamplePoint = v3Start + v3SampleRay * 0.5;

	// Now loop through the sample rays
	float3 v3FrontColor = float3(0.0, 0.0, 0.0);
	for(int i=0; i<nSamples; i++)
	{
		float fHeight = length(v3SamplePoint);
		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));
		float fLightAngle = dot(vSunPos, v3SamplePoint) / fHeight;
		float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;
		float fScatter = (fStartOffset + fDepth*(scale(fLightAngle) - scale(fCameraAngle)));
		float3 v3Attenuate = exp(-fScatter * (vInvWavelength * fKr4PI + fKm4PI));
		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);
		v3SamplePoint += v3SampleRay;
	}
	
	// FP16 precision correction
	v3FrontColor.xyz = min( v3FrontColor.xyz, 6.5519996e4f);

    return float4( v3FrontColor, 1);
}


technique sky {
	pass
	{	 
		ZEnable = true;
		ZWriteEnable = false;
		AlphaBlendEnable = false;
    
    	VertexShader = compile SkyFromGround_VS( );
    	PixelShader = compile SkyFromGround_PS( );
	}
}

/*
technique Sky_dx9 
{
	
	
	pass pRenderGround
	{	 
		ZEnable = true;
		ZWriteEnable = true;
		AlphaBlendEnable = false;
    	FVF = XYZ | TEX1 | DIFFUSE;
    
    	VertexShader = compile vs_3_0 SkyFromGround_VS( );
    	PixelShader = compile ps_3_0 GroundFromGround_PS( );
	}
	
	pass pUpdateTexture
	{	 
		ZEnable = false;
		ZWriteEnable = false;
		AlphaBlendEnable = false;
    	FVF = XYZRHW | TEX1;

    	PixelShader = compile ps_3_0 UpdateTexture_PS( );
	}		
}*/