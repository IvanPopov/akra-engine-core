struct VS_OUT_0_15{
vec4 POSITION;
vec2 TEXTURE_POSITION;
} ;

float calc_length_15(in sampler2D, in vec2, in vec3, in vec2, in vec2);

vec4 floatToFloat4_15(in float);
uniform sampler2D A_s_0;
uniform ivec2 CELL_COUNT;
uniform vec2 START_UV;
uniform vec2 INV_TEXTURE_SIZES;
uniform vec3 TERRAIN_SCALE;
uniform int IS_X;
varying vec2 TEXTURE_POSITION_VAR;

float calc_length_15(in sampler2D height_sampler_69_15, in vec2 invTextureSizes_69_15, in vec3 mapScale_69_15, in vec2 startPoint_69_15, in vec2 direction_69_15)
{

    vec2 pointNumber_70_15 = abs(floor((direction_69_15 / invTextureSizes_69_15.xy)));
    float maxLoopIndex_70_15 = max(pointNumber_70_15.x, pointNumber_70_15.y);

    if ((maxLoopIndex_70_15 == 0.0))
    {
        return 0.0;
    }

    vec2 textureStep_70_15 = (direction_69_15 / maxLoopIndex_70_15);
    vec2 currentTexturePosition_70_15 = startPoint_69_15;
    float height_70_15;
    float heightOld_70_15;
    float totalLength_70_15 = 0.0;
    (heightOld_70_15 = texture2D(height_sampler_69_15, currentTexturePosition_70_15).x);

    for (int i_72_15 = 0; (i_72_15 > -1); (i_72_15++))
    {
        if ((float(i_72_15) >= maxLoopIndex_70_15))
        {
            break;
        }
        (currentTexturePosition_70_15 += textureStep_70_15);
        (height_70_15 = texture2D(height_sampler_69_15, currentTexturePosition_70_15).x);
        (totalLength_70_15 += length((vec3(textureStep_70_15, (height_70_15 - heightOld_70_15)) * mapScale_69_15)));
        (heightOld_70_15 = height_70_15);
    }
    return totalLength_70_15;

}

void fragment_main_3_15(){
{
    vec2 texturePosition_58_15 = TEXTURE_POSITION_VAR;
    vec2 cellStep_58_15 = (1.0 / vec2(CELL_COUNT));
    vec2 relativeCenter_58_15 = ((floor((texturePosition_58_15 / cellStep_58_15)) * cellStep_58_15)
        + (START_UV / vec2(CELL_COUNT)));

    float totalLength_58_15 = 0.0;
    vec2 direction_58_15 = (texturePosition_58_15 - relativeCenter_58_15);
    int iAverNew_58_15 = (int(((4.0 * length(direction_58_15)) / length(((INV_TEXTURE_SIZES * 4.0) * vec2(CELL_COUNT))))) + 1);
    int nCount_58_15 = 0;

    for (int y_59_15 = -4; (y_59_15 < 5); (y_59_15++))
    {
        if ((y_59_15 < (-iAverNew_58_15)))
        {
            continue;
        }
        else if ((y_59_15 > iAverNew_58_15))
        {
            break;
        }

        for (int x_63_15 = -4; (x_63_15 < 5); (x_63_15++))
        {
            if ((x_63_15 < (-iAverNew_58_15)))
            {
                continue;
            }
            else if ((x_63_15 > iAverNew_58_15))
            {
                break;
            }

            (totalLength_58_15 += calc_length_15(A_s_0, INV_TEXTURE_SIZES, TERRAIN_SCALE, relativeCenter_58_15,
            (direction_58_15 + (((vec2(0.5, 0.5) + vec2(float(x_63_15), float(y_59_15))) * INV_TEXTURE_SIZES) / 2.0))));

            (nCount_58_15++);
        }
    }

    (totalLength_58_15 /= float(nCount_58_15));

    if ((IS_X == 1))
    {
        (totalLength_58_15 *= (direction_58_15.x / length(direction_58_15)));
    }
    else
    {
        (totalLength_58_15 *= (direction_58_15.y / length(direction_58_15)));
    }

    vec4 decompose_58_15 = floatToFloat4_15(totalLength_58_15);

    (gl_FragColor = vec4(decompose_58_15.w, decompose_58_15.z, decompose_58_15.y, decompose_58_15.x));
    return ;
    }
}
void main(){
fragment_main_3_15();
}
