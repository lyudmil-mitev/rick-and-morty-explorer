#ifdef GL_ES
precision highp float;
#endif

uniform vec3 iResolution;
uniform float iTime;
uniform float iVariant;

#define TAU 6.28318530718

// Main performance knobs.
#define FBM_OCTAVES 3
#define NEBULA_LAYERS 4
#define STAR_LAYERS 5

float hash12(vec2 p)
{
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.11369, 0.13787));
    q += dot(q, q.yzx + 19.19);
    return fract((q.x + q.y) * q.z);
}

vec2 hash22(vec2 p)
{
    return vec2(hash12(p), hash12(p + 37.17));
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
    mat2 m = mat2(1.58, 1.06, -1.06, 1.58);

    for (int i = 0; i < FBM_OCTAVES; i++)
    {
        sum += amp * valueNoise(p);
        p = m * p + 8.7;
        amp *= 0.52;
    }

    return sum;
}

vec2 spaceUv(vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    return uv;
}

vec4 nebulaLayer(vec2 uv, float seed)
{
    vec2 p = uv * 1.85 + vec2(seed * 1.71, seed * -1.13);

    float broad = fbm(p * 0.82 + vec2(-1.7, 0.4));
    float detail = fbm(p * 2.15 + vec2(4.1, -2.6));

    float folds = fbm(vec2(
        p.x * 1.1 + broad * 1.7,
        p.y * 1.35 - detail * 1.2
    ));

    float clusters = fbm(
        p * 1.18 + vec2(folds * 1.8 - 3.2, broad * 1.4 + 2.6)
    );

    float structure = broad * 0.62 + folds * 0.56;
    float voids = smoothstep(0.28, 0.62, 1.0 - structure + (1.0 - detail) * 0.24);

    float cloud = smoothstep(0.38, 0.94, structure) * (1.0 - voids * 0.82);

    float core = smoothstep(
        0.50,
        0.96,
        broad * 0.58 + detail * 0.22 + folds * 0.52
    ) * (1.0 - voids * 0.55);

    float activeCloud = cloud * (1.0 - voids * 0.62);

    float coolRegion = 1.0 - smoothstep(0.34, 0.58, clusters);

    float roseRegion = smoothstep(0.28, 0.50, clusters)
        * (1.0 - smoothstep(0.62, 0.82, clusters));

    float warmRegion = smoothstep(0.58, 0.86, clusters);

    float tealMask = activeCloud * coolRegion
        * smoothstep(0.42, 0.84, detail + (1.0 - broad) * 0.24)
        * (1.0 - warmRegion * 0.55);

    float blueMask = activeCloud * coolRegion
        * smoothstep(0.30, 0.74, 1.0 - broad + folds * 0.16);

    float roseMask = activeCloud * roseRegion
        * smoothstep(0.36, 0.78, broad + folds * 0.25);

    float magentaMask = core * roseRegion
        * smoothstep(0.56, 0.98, folds + detail * 0.28);

    float warmMask = activeCloud * warmRegion
        * smoothstep(0.34, 0.82, broad + detail * 0.22);

    float tealBridge = activeCloud
        * smoothstep(0.24, 0.56, detail)
        * smoothstep(0.24, 0.62, 1.0 - abs(clusters - 0.46) * 2.0);

    vec3 deep = vec3(0.006, 0.010, 0.060);
    vec3 shadow = vec3(0.018, 0.026, 0.105);
    vec3 rose = vec3(0.66, 0.035, 0.26);
    vec3 magenta = vec3(0.86, 0.070, 0.34);
    vec3 cyan = vec3(0.04, 0.38, 0.44);
    vec3 aquaSmoke = vec3(0.10, 0.28, 0.36);
    vec3 blue = vec3(0.025, 0.15, 0.44);
    vec3 amber = vec3(0.92, 0.54, 0.25);
    vec3 sand = vec3(0.92, 0.75, 0.47);

    vec3 col = mix(deep, shadow, cloud * 0.58);
    col = mix(col, blue, blueMask * 0.66);
    col = mix(col, aquaSmoke, tealBridge * 0.28);
    col = mix(col, cyan, tealMask * 0.52);
    col = mix(col, rose, roseMask * 0.70);
    col = mix(col, magenta, magentaMask * 0.54);
    col = mix(col, amber, warmMask * 0.62);
    col = mix(col, sand, warmMask * core * 0.22);
    col = mix(col, deep, voids * 0.78);

    float edge = smoothstep(1.70, 0.24, length(uv * vec2(0.78, 1.18)));

    col *= 0.62 + 0.58 * edge;
    col *= 0.84 + 0.18 * detail + 0.12 * clusters;

    return vec4(clamp(col, 0.0, 1.0), activeCloud * edge * 0.50);
}

vec3 nebula(vec2 uv)
{
    vec3 col = vec3(0.006, 0.010, 0.060);
    float travel = iTime * 0.018;
    vec2 viewUv = uv;

    for (int i = 0; i < NEBULA_LAYERS; i++)
    {
        float layer = float(i);
        float phase = hash12(vec2(layer * 9.7, layer + 1.4));
        float cycle = floor(phase + travel);
        float z = fract(phase + travel);

        float fadeIn = smoothstep(0.00, 0.34, z);
        float fadeOut = 1.0 - smoothstep(0.88, 1.0, z);
        float alpha = fadeIn * fadeOut;

        // Skip layers that are nearly invisible.
        if (alpha < 0.006)
        {
            continue;
        }

        float depth = mix(
            mix(3.20, 2.35, iVariant),
            mix(0.46, 0.34, iVariant),
            z
        );

        float scale = 1.0 / depth;

        vec2 layerOffset = vec2(
            sin(layer * 2.31) * 0.18,
            cos(layer * 1.77) * 0.12
        );

        vec2 parallax = layerOffset * (1.0 - z) + vec2(
            sin((cycle + layer) * 1.83),
            cos((cycle - layer) * 1.41)
        ) * 0.10;

        float bannerZoom = mix(1.0, 0.42, iVariant);
        vec2 layerUv = viewUv * bannerZoom / scale + parallax;

        vec4 cloud = nebulaLayer(layerUv, layer + 1.0 + cycle * 6.7);

        // Side clouds are expensive, so only compute them when needed.
        // This version removes the far-left/far-right clouds completely.
        if (iVariant > 0.001)
        {
            float sideBlend = iVariant * smoothstep(0.02, 0.92, abs(uv.x));

            if (sideBlend > 0.001)
            {
                vec4 leftCloud = nebulaLayer(
                    layerUv + vec2(-0.74, 0.14),
                    layer + 17.0 + cycle * 6.7
                );

                vec4 rightCloud = nebulaLayer(
                    layerUv + vec2(0.74, -0.12),
                    layer + 31.0 + cycle * 6.7
                );

                vec4 sideCloud = max(leftCloud, rightCloud);
                cloud = mix(cloud, sideCloud, sideBlend * 0.86);
            }
        }

        col = mix(col, cloud.rgb, cloud.a * alpha * mix(0.92, 1.42, iVariant));
    }

    float vignette = smoothstep(
        mix(1.90, 2.35, iVariant),
        0.18,
        length(viewUv * vec2(0.78, mix(1.12, 0.92, iVariant)))
    );

    col *= 0.72 + 0.42 * vignette;

    return clamp(col, 0.0, 1.0);
}

vec3 starLayer(vec2 fragCoord, vec2 uv, float z, float seed)
{
    vec3 col = vec3(0.0);

    float fadeIn = smoothstep(0.0, 0.42, z);
    float fadeOut = 1.0 - smoothstep(0.985, 1.0, z);
    float layerFade = fadeIn * fadeOut;

    if (layerFade < 0.01)
    {
        return col;
    }

    float depth = mix(4.60, 0.38, z);
    float scale = 1.0 / depth;

    vec2 center = iResolution.xy * 0.5;
    vec2 layerOffset = vec2(sin(seed * 5.17), cos(seed * 4.31)) * 180.0;

    float cellSize = mix(24.0, 39.0, hash12(vec2(seed, 3.7)));

    vec2 seedOffset = vec2(seed * 19.13, seed * -27.41);

    vec2 projected = (fragCoord - center) / scale + center + layerOffset * (1.0 - z);
    vec2 p = projected / cellSize + seedOffset;
    vec2 baseCell = floor(p);

    float by = uv.y / 0.72;
    float band = exp(-(by * by));
    float density = (0.007 + 0.019 * band) * mix(0.80, 1.28, hash12(vec2(seed, 9.2)));

    for (int y = -1; y <= 1; y++)
    {
        for (int x = -1; x <= 1; x++)
        {
            vec2 cell = baseCell + vec2(float(x), float(y));

            // Check whether this cell has a star before doing expensive work.
            if (hash12(cell + 11.3) >= density)
            {
                continue;
            }

            vec2 rnd = hash22(cell);

            vec2 starWorld = (cell + rnd - seedOffset) * cellSize;
            vec2 starPos = (starWorld - center - layerOffset * (1.0 - z)) * scale + center;

            vec2 d = fragCoord - starPos;
            float dist2 = dot(d, d);

            float r = hash12(cell + 23.7);
            float r2 = r * r;
            float mag = r2 * r2 * r2;

            float nearBoost = mix(0.70, 1.55, z);

            float magSqrt = sqrt(max(mag, 0.00001));
            float radius = mix(0.30, 1.18, magSqrt) * nearBoost;

            float core = exp(-dist2 / (radius * radius));

            float spikes = 0.0;

            // Only bright stars get spike calculations.
            if (mag > 0.015)
            {
                float spikeLength = mix(2.0, 11.5, sqrt(magSqrt)) * nearBoost;
                float spikeWidth = mix(0.055, 0.34, magSqrt) * nearBoost;

                float h = exp(-abs(d.x) / spikeLength) * exp(-(d.y * d.y) / spikeWidth);
                float v = exp(-abs(d.y) / spikeLength) * exp(-(d.x * d.x) / spikeWidth);

                spikes = (h + v) * mix(0.08, 0.38, mag);
            }

            float phase = hash12(cell + 41.0) * TAU;
            float twinkle = 0.88 + 0.24 * sin(iTime * mix(0.8, 3.8, mag) + phase);

            float temp = hash12(cell + 59.0);
            vec3 starColor = mix(vec3(1.0, 0.80, 0.58), vec3(0.70, 0.82, 1.0), temp);
            starColor = mix(starColor, vec3(1.0, 0.96, 0.90), 0.64);

            col += starColor
                * twinkle
                * mix(0.12, 2.25, mag)
                * layerFade
                * (core * 1.55 + spikes);
        }
    }

    return col;
}

vec3 stars(vec2 fragCoord, vec2 uv)
{
    vec3 col = vec3(0.0);
    float travel = iTime * 0.018;

    for (int i = 0; i < STAR_LAYERS; i++)
    {
        float layer = float(i);
        float phase = hash12(vec2(layer * 13.7, layer + 4.2));
        float z = fract(phase + travel);

        col += starLayer(fragCoord, uv, z, layer + 2.0);
    }

    return col * 0.92;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = spaceUv(fragCoord);

    vec3 col = nebula(uv);
    col += stars(fragCoord, uv);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
