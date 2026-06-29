#ifdef GL_ES
precision highp float;
#endif

uniform vec3 iResolution;
uniform float iTime;
uniform float iVariant;

#define TAU 6.28318530718

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

    for (int i = 0; i < 5; i++)
    {
        sum += amp * valueNoise(p);
        p = mat2(1.58, 1.04, -1.04, 1.58) * p + 7.3;
        amp *= 0.52;
    }

    return sum;
}

vec2 sceneUv(vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    return uv;
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

    float sun = exp(-length((uv - vec2(-0.82, 0.46)) / vec2(0.36, 0.16)));
    float moon = exp(-length((uv - vec2(1.10, 0.30)) / vec2(0.24, 0.12)));
    col += vec3(0.90, 1.00, 0.60) * sun * 0.15;
    col += vec3(0.00, 0.65, 0.85) * moon * 0.09;

    return sat(col);
}

float ridgeHeight(float x, float seed, float roughness)
{
    float broad = fbm(vec2(x * 0.62 + seed, seed * 0.31));
    float broken = fbm(vec2(x * 1.85 - seed * 0.4, seed + 11.0));
    float spires = pow(abs(valueNoise(vec2(x * 4.4 + seed, 2.0)) - 0.5) * 2.0, 1.8);
    return 0.45 * broad + roughness * 0.32 * broken + 0.20 * spires;
}

vec4 mountainLayer(vec2 uv, float z, float seed, float baseY, vec3 lowColor, vec3 highColor)
{
    float depth = mix(3.35, 0.46, z);
    float scale = 1.0 / depth;
    vec2 layerUv = uv / scale + vec2(sin(seed * 2.4) * 0.58, 0.0);
    float ridge = baseY + mix(0.42, 0.26, z) - ridgeHeight(layerUv.x, seed, mix(0.70, 1.10, z)) * mix(0.66, 1.04, z);
    float softness = mix(0.014, 0.005, z);
    float mask = 1.0 - smoothstep(ridge - softness, ridge + softness, uv.y);
    float crest = exp(-abs(uv.y - ridge) / mix(0.020, 0.008, z));

    float texture = fbm(layerUv * vec2(2.4, 5.2) + seed);
    float veins = smoothstep(0.62, 0.94, fbm(layerUv * vec2(7.0, 3.2) - seed));
    vec3 terrain = mix(lowColor, highColor, texture * 0.42 + veins * 0.16);
    terrain = mix(terrain, terrain * vec3(0.42, 0.58, 0.54), crest * mix(0.32, 0.62, z));

    float atmospheric = smoothstep(0.0, 1.0, 1.0 - z);
    terrain = mix(terrain, vec3(0.72, 0.96, 0.72), atmospheric * 0.24);

    return vec4(sat(terrain), mask * mix(0.58, 1.0, z));
}

vec4 cloudLayer(vec2 uv, float z, float seed)
{
    float depth = mix(3.20, 0.42, z);
    float scale = 1.0 / depth;
    vec2 layerUv = uv / scale + vec2(sin(seed) * 0.8, cos(seed * 1.7) * 0.22);
    layerUv.y += mix(0.48, 0.18, z);

    float body = fbm(layerUv * vec2(1.4, 2.4) + seed * 1.7);
    float puff = fbm(layerUv * vec2(3.5, 5.2) - seed * 0.9);
    float shape = smoothstep(0.48, 0.92, body * 0.72 + puff * 0.36);
    float verticalWindow = smoothstep(-0.34, 0.06, layerUv.y) * (1.0 - smoothstep(0.38, 0.74, layerUv.y));
    float alpha = shape * verticalWindow * smoothstep(0.0, 0.32, z) * (1.0 - smoothstep(0.86, 1.0, z));

    vec3 shade = mix(vec3(0.78, 0.96, 0.86), vec3(1.0, 1.0, 0.90), puff * 0.45 + z * 0.20);
    shade = mix(shade, vec3(0.58, 0.90, 0.80), smoothstep(0.04, 0.42, layerUv.y) * 0.32);

    return vec4(sat(shade), alpha * 0.42);
}

vec3 mountains(vec2 uv)
{
    vec3 col = sky(uv);
    float travel = iTime * 0.026;
    float banner = iVariant;
    vec2 scene = uv * mix(1.82, 1.0, banner);
    float splashLift = mix(0.42, 0.0, banner);

    for (int i = 0; i < 5; i++)
    {
        float layer = float(i);
        float phase = hash12(vec2(layer * 8.1, layer + 0.6));
        float cycle = floor(phase + travel);
        float z = fract(phase + travel);
        float fade = smoothstep(0.0, 0.28, z) * (1.0 - smoothstep(0.90, 1.0, z));
        float bannerLift = mix(0.0, 0.16, banner);

        vec3 low = mix(vec3(0.18, 0.50, 0.42), vec3(0.04, 0.24, 0.29), z);
        vec3 high = mix(vec3(0.58, 0.83, 0.48), vec3(0.18, 0.56, 0.34), z);
        vec4 ridge = mountainLayer(
            scene,
            z,
            layer + 2.0 + cycle * 5.3,
            mix(0.06, -0.18, z) + bannerLift + splashLift,
            low,
            high
        );

        col = mix(col, ridge.rgb, ridge.a * fade);

        float haze = fade * smoothstep(-0.78, 0.12, scene.y) * (1.0 - z) * mix(0.10, 0.18, banner);
        col = mix(col, vec3(0.80, 0.98, 0.75), haze);
    }

    return col;
}

vec3 flyClouds(vec2 uv, vec3 col)
{
    float travel = iTime * 0.038;
    vec2 scene = uv * mix(1.62, 1.0, iVariant);

    for (int i = 0; i < 4; i++)
    {
        float layer = float(i);
        float phase = hash12(vec2(layer * 11.9, layer + 3.1));
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
