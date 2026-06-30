#ifdef GL_ES
precision highp float;
#endif

uniform vec3 iResolution;
uniform float iTime;
uniform float iVariant;
uniform float iSceneYOffset;

float sat(float x) { return clamp(x, 0.0, 1.0); }
vec3 sat(vec3 x) { return clamp(x, 0.0, 1.0); }

float hash12(vec2 p)
{
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.11369, 0.13787));
    q += dot(q, q.yzx + 19.19);
    return fract((q.x + q.y) * q.z);
}

float valueNoise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p)
{
    float sum = 0.0;
    float amp = 0.56;

    for (int i = 0; i < 4; i++)
    {
        sum += amp * valueNoise(p);
        p = mat2(1.58, 1.04, -1.04, 1.58) * p + 7.3;
        amp *= 0.52;
    }

    return sum;
}

float fbmFast(vec2 p)
{
    float sum = 0.0;
    float amp = 0.58;

    for (int i = 0; i < 3; i++)
    {
        sum += amp * valueNoise(p);
        p = mat2(1.58, 1.04, -1.04, 1.58) * p + 7.3;
        amp *= 0.52;
    }

    return sum;
}

float ridgeNoise(float n)
{
    n = abs(n * 2.0 - 1.0);
    return 1.0 - n * n;
}

float ridgedFbm(vec2 p)
{
    float sum = 0.0;
    float amp = 0.54;
    float weight = 0.86;

    for (int i = 0; i < 4; i++)
    {
        float r = ridgeNoise(valueNoise(p));
        r *= weight;
        sum += r * amp;
        weight = mix(0.48, 1.0, r);
        p = mat2(1.70, 0.92, -0.92, 1.70) * p + 5.8;
        amp *= 0.50;
    }

    return sum;
}

float mountainTexture(vec2 p)
{
    float s = 0.72;
    float h = 0.0;
    float contrast = 1.0;

    for (int i = 0; i < 6; i++)
    {
        float n = valueNoise(0.3 + p * s);
        h += mix(n, ridgeNoise(n), 0.18) * contrast / s;
        s *= 2.0;
        contrast *= 1.08;
    }

    return h * 0.43;
}

vec2 sceneUv(vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.y += iSceneYOffset;
    return uv;
}

float ellipseGlow(vec2 uv, vec2 center, vec2 radius, float strength)
{
    vec2 d = (uv - center) / radius;
    return 1.0 / (1.0 + dot(d, d) * strength);
}

vec3 sky(vec2 uv)
{
    float y = sat(uv.y * 0.5 + 0.5);
    vec3 top = vec3(0.84, 1.00, 0.63);
    vec3 mid = vec3(0.43, 0.94, 0.76);
    vec3 low = vec3(0.91, 0.95, 0.88);

    vec3 col = mix(low, mid, smoothstep(0.05, 0.62, y));
    col = mix(col, top, smoothstep(0.52, 1.0, y));

    float haze = 0.12 * sin(uv.x * 2.0 + 0.7) + 0.08 * sin(uv.x * 5.6 - 1.6);
    col = mix(col, vec3(0.03, 0.73, 0.89), 0.10 * smoothstep(0.20, 0.82, 1.0 - y));
    col = mix(col, vec3(0.71, 1.00, 0.27), 0.10 * smoothstep(0.18, 0.86, y + haze));
    col = mix(col, vec3(1.00, 0.24, 0.60), 0.07 * smoothstep(0.35, 1.0, uv.x));

    float sun = ellipseGlow(uv, vec2(-0.82, 0.46), vec2(0.36, 0.16), 2.2);
    float moon = ellipseGlow(uv, vec2(1.10, 0.30), vec2(0.24, 0.12), 2.6);
    col += vec3(0.90, 1.00, 0.60) * sun * 0.12;
    col += vec3(0.00, 0.65, 0.85) * moon * 0.07;

    return sat(col);
}

float ridgeHeight(float x, float seed, float roughness)
{
    vec2 p = vec2(x, seed * 0.19);
    float warp = fbmFast(p * vec2(0.34, 0.82) + seed) - 0.5;
    p.x += warp * mix(0.55, 1.05, roughness);

    float terrain = mountainTexture(p * vec2(0.62, 1.0) + vec2(seed * 0.07, 0.0));
    float ridges = ridgedFbm(p * vec2(0.96, 1.25) + vec2(-seed * 0.11, seed * 0.05));
    float shoulders = fbm(p * vec2(0.22, 0.45) + vec2(seed * 0.21, 4.7));
    float cuts = smoothstep(0.28, 0.78, ridgedFbm(p * vec2(2.25, 0.95) + seed * 0.37));
    float crags = pow(ridgeNoise(valueNoise(p * vec2(4.8, 1.4) + seed * 0.61)), 1.7);

    terrain = mix(terrain, terrain * terrain * 1.32, 0.46);
    return shoulders * 0.28
        + terrain * mix(0.54, 0.76, roughness)
        + ridges * mix(0.18, 0.32, roughness)
        + crags * mix(0.035, 0.095, roughness)
        - cuts * 0.105;
}

float ridgeY(float x, float z, float seed, float baseY)
{
    return baseY
        + mix(0.42, 0.26, z)
        - ridgeHeight(x, seed, mix(0.70, 1.10, z)) * mix(0.78, 1.22, z);
}

float mountainEdgeWidth(float z)
{
    float pixel = 2.0 / max(iResolution.y, 1.0);
    return pixel * mix(1.85, 1.10, z);
}

vec4 mountainLayer(vec2 uv, float z, float seed, float baseY, vec3 lowColor, vec3 highColor)
{
    float depth = mix(4.25, 0.66, z);
    float scale = 1.0 / depth;
    vec2 layerUv = uv / scale + vec2(sin(seed * 2.4) * 0.58, seed * 0.035);
    float ridge = ridgeY(layerUv.x, z, seed, baseY);
    float edgeDistance = uv.y - ridge;
    float edgeWidth = mountainEdgeWidth(z);
    float mask = 1.0 - smoothstep(-edgeWidth, edgeWidth, edgeDistance);
    float bodyShade = smoothstep(-0.12, 0.92, -layerUv.y + mix(0.36, 0.12, z));

    vec3 ridgeColor = mix(highColor, lowColor, 0.42 + z * 0.20);
    vec3 terrain = mix(ridgeColor, lowColor, bodyShade * 0.46);
    terrain = mix(terrain, terrain * vec3(0.40, 0.56, 0.51), bodyShade * mix(0.08, 0.22, z));

    float atmospheric = smoothstep(0.0, 1.0, 1.0 - z);
    terrain = mix(terrain, vec3(0.58, 0.78, 0.62), atmospheric * 0.16);

    return vec4(sat(terrain), mask);
}

vec4 cloudLayer(vec2 uv, float z, float seed)
{
    float depth = mix(3.20, 0.42, z);
    float scale = 1.0 / depth;
    vec2 layerUv = uv / scale + vec2(sin(seed) * 0.8, cos(seed * 1.7) * 0.22);
    layerUv.y += mix(0.70, 0.34, z);

    float body = fbmFast(layerUv * vec2(1.4, 2.4) + seed * 1.7);
    float puff = valueNoise(layerUv * vec2(3.5, 5.2) - seed * 0.9);
    float shape = smoothstep(0.46, 0.88, body * 0.76 + puff * 0.30);
    float verticalWindow = smoothstep(-0.34, 0.06, layerUv.y) * (1.0 - smoothstep(0.38, 0.74, layerUv.y));
    float alpha = shape * verticalWindow * smoothstep(0.0, 0.32, z) * (1.0 - smoothstep(0.86, 1.0, z));

    vec3 shade = mix(vec3(0.78, 0.96, 0.86), vec3(1.0, 1.0, 0.90), puff * 0.45 + z * 0.20);
    shade = mix(shade, vec3(0.58, 0.90, 0.80), smoothstep(0.04, 0.42, layerUv.y) * 0.32);

    return vec4(sat(shade), alpha * 0.34);
}

vec3 mountains(vec2 uv)
{
    vec3 col = sky(uv);
    float travel = iTime * 0.026;
    float banner = iVariant;
    vec2 scene = uv * mix(1.82, 1.0, banner);
    float splashLift = mix(0.42, 0.0, banner);

    for (int pass = 0; pass < 6; pass++)
    {
        float zMin = float(pass) / 6.0;
        float zMax = float(pass + 1) / 6.0;

        for (int i = 0; i < 6; i++)
        {
            float layer = float(i);
            float phase = fract((layer + 0.5) / 6.0 + 0.04);
            float cycle = floor(phase + travel);
            float z = fract(phase + travel);

            if (z >= zMin && z < zMax)
            {
                float fade = smoothstep(0.0, 0.18, z) * (1.0 - smoothstep(0.985, 1.0, z));
                float bannerLift = mix(0.0, 0.16, banner);
                float palette = smoothstep(0.0, 1.0, z);

                vec3 low = mix(vec3(0.37, 0.62, 0.54), vec3(0.035, 0.21, 0.25), palette);
                vec3 high = mix(vec3(0.64, 0.82, 0.58), vec3(0.15, 0.48, 0.30), palette);
                vec4 ridge = mountainLayer(
                    scene,
                    z,
                    layer + 2.0 + cycle * 5.3,
                    mix(0.06, -0.18, z) + bannerLift + splashLift,
                    low,
                    high
                );

                float farFog = 1.0 - smoothstep(0.04, 0.30, z);
                vec3 ridgeColor = mix(vec3(0.74, 0.94, 0.70), ridge.rgb, 1.0 - farFog * 0.55);
                col = mix(col, ridgeColor, ridge.a * fade);

                float haze = fade * smoothstep(-0.78, 0.12, scene.y) * (1.0 - z) * mix(0.055, 0.08, banner);
                col = mix(col, vec3(0.80, 0.98, 0.75), haze);
            }
        }
    }

    return col;
}

vec3 flyClouds(vec2 uv, vec3 col)
{
    float travel = iTime * 0.038;
    vec2 scene = uv * mix(1.62, 1.0, iVariant);

    for (int i = 0; i < 3; i++)
    {
        float layer = float(i);
        float phase = fract(layer * 0.271 + 0.43);
        float z = fract(phase + travel);
        vec4 cloud = cloudLayer(scene, z, layer + 1.0 + floor(phase + travel) * 6.1);
        col = mix(col, cloud.rgb, cloud.a);
    }

    return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = sceneUv(fragCoord);
    vec3 col = mountains(uv);
    col = flyClouds(uv, col);

    float lowerHaze = smoothstep(-0.92, 0.02, uv.y) * 0.20;
    col = mix(col, vec3(0.84, 0.98, 0.78), lowerHaze);

    float vignette = smoothstep(1.32, 0.18, length(uv * vec2(0.76, 1.08)));
    col *= mix(1.0, mix(0.91, 1.06, vignette), iVariant);

    fragColor = vec4(sat(col), 1.0);
}
