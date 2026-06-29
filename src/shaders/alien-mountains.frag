#ifdef GL_ES
precision highp float;
#endif

uniform vec3 iResolution;
uniform float iTime;
uniform float iVariant;

#define SVG_W 1600.0
#define SVG_H 360.0
#define TAU 6.28318530718

float sat(float x) { return clamp(x, 0.0, 1.0); }
vec3 sat(vec3 x) { return clamp(x, 0.0, 1.0); }

float hash12(vec2 p)
{
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.11369, 0.13787));
    q += dot(q, q.yzx + 19.19);
    return fract((q.x + q.y) * q.z);
}

vec2 hash22(vec2 p)
{
    return vec2(hash12(p), hash12(p + 17.37));
}

vec2 grad2(vec2 cell)
{
    float a = TAU * hash12(cell);
    return vec2(cos(a), sin(a));
}

float perlin2(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float n00 = dot(grad2(i), f);
    float n10 = dot(grad2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float n01 = dot(grad2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float n11 = dot(grad2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

    return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y);
}

float fbm(vec2 p)
{
    float sum = 0.0;
    float amp = 0.5;

    for (int i = 0; i < 6; i++)
    {
        sum += amp * perlin2(p);
        p = mat2(1.62, 1.12, -1.12, 1.62) * p;
        amp *= 0.5;
    }

    return 0.5 + 0.5 * sum;
}

vec2 svgCoords(vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.y = 1.0 - uv.y;

    float viewAspect = SVG_W / SVG_H;
    float screenAspect = iResolution.x / iResolution.y;
    vec2 p;

    if (screenAspect < viewAspect)
    {
        float visibleW = SVG_H * screenAspect;
        p.x = SVG_W * 0.5 + (uv.x - 0.5) * visibleW;
        p.y = uv.y * SVG_H;
    }
    else
    {
        float visibleH = SVG_W / screenAspect;
        p.x = uv.x * SVG_W;
        p.y = SVG_H * 0.5 + (uv.y - 0.5) * visibleH;
    }

    return p;
}

float ridge(vec2 p, float scale, float amp, float base, float seed)
{
    float broad = fbm(vec2(p.x * scale + seed, seed * 0.37));
    float broken = fbm(vec2(p.x * scale * 3.1 - seed * 0.4, 12.0 + seed));
    float spires = pow(abs(perlin2(vec2(p.x * scale * 5.2 + seed, 4.0))), 1.55);
    return base - amp * (0.62 * broad + 0.28 * broken + 0.20 * spires);
}

float terrainMask(vec2 p, float height, float softness)
{
    return smoothstep(height - softness, height + softness, p.y);
}

vec3 drawTerrain(vec3 col, vec2 p, float height, float softness, vec3 color, vec3 highlight, float density)
{
    float mask = terrainMask(p, height, softness);
    float texture = fbm(vec2(p.x * 0.012 + density, p.y * 0.032 - density));
    float veins = smoothstep(0.54, 0.86, fbm(vec2(p.x * 0.026 - density * 2.0, p.y * 0.020)));
    vec3 terrain = mix(color, highlight, texture * 0.34 + veins * 0.16);
    return mix(col, terrain, mask);
}

vec3 skyColor(vec2 p)
{
    float y = sat(p.y / SVG_H);
    vec3 top = vec3(0.84, 1.00, 0.65);
    vec3 mid = vec3(0.45, 0.94, 0.78);
    vec3 low = vec3(0.91, 0.95, 0.88);

    vec3 sky = mix(top, mid, smoothstep(0.00, 0.52, y));
    sky = mix(sky, low, smoothstep(0.48, 1.00, y));

    float haze = 0.12 * sin(p.x * 0.004 + 0.7) + 0.08 * sin(p.x * 0.011 - 1.6);
    vec3 cyanGlow = vec3(0.03, 0.73, 0.89);
    vec3 limeGlow = vec3(0.71, 1.00, 0.27);
    vec3 roseGlow = vec3(1.00, 0.24, 0.60);

    sky = mix(sky, cyanGlow, 0.11 * smoothstep(0.08, 0.78, 1.0 - y));
    sky = mix(sky, limeGlow, 0.12 * smoothstep(0.18, 0.82, y + haze));
    sky = mix(sky, roseGlow, 0.08 * smoothstep(0.52, 0.98, p.x / SVG_W));

    float sun = exp(-length((p - vec2(SVG_W * 0.22, SVG_H * 0.18)) / vec2(220.0, 72.0)));
    float moon = exp(-length((p - vec2(SVG_W * 0.78, SVG_H * 0.28)) / vec2(125.0, 52.0)));
    sky += vec3(0.90, 1.00, 0.60) * sun * 0.16;
    sky += vec3(0.00, 0.65, 0.85) * moon * 0.10;

    float fine = fbm(p * 0.012 + vec2(1.2, 4.1));
    sky *= 0.96 + 0.08 * fine;

    return sat(sky);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = svgCoords(fragCoord);
    vec3 col = skyColor(p);

    float cloud = fbm(vec2(p.x * 0.006, p.y * 0.018 + 11.0));
    float mist = smoothstep(0.35, 0.82, cloud) * smoothstep(0.88, 0.32, p.y / SVG_H);
    col = mix(col, vec3(0.94, 1.00, 0.86), mist * 0.22);

    float farHeight = ridge(p + vec2(40.0, 0.0), 0.0032, 110.0, 310.0, 2.0);
    float midHeight = ridge(p + vec2(-90.0, 0.0), 0.0048, 126.0, 338.0, 9.0);
    float nearHeight = ridge(p + vec2(120.0, 0.0), 0.0068, 142.0, 374.0, 15.0);

    col = drawTerrain(col, p, farHeight, 4.0, vec3(0.17, 0.49, 0.42), vec3(0.58, 0.83, 0.48), 2.3);

    float fogBand = smoothstep(farHeight - 42.0, farHeight + 18.0, p.y) * smoothstep(farHeight + 110.0, farHeight + 22.0, p.y);
    col = mix(col, vec3(0.77, 0.98, 0.76), fogBand * 0.24);

    col = drawTerrain(col, p, midHeight, 3.0, vec3(0.09, 0.38, 0.37), vec3(0.40, 0.75, 0.38), 7.7);
    col = drawTerrain(col, p, nearHeight, 2.4, vec3(0.04, 0.25, 0.30), vec3(0.18, 0.55, 0.35), 13.1);

    float groundGlow = smoothstep(nearHeight - 16.0, nearHeight + 20.0, p.y);
    col = mix(col, vec3(0.03, 0.18, 0.22), groundGlow * 0.18);

    float vignette = smoothstep(0.78, 0.18, length((p / vec2(SVG_W, SVG_H)) - vec2(0.5, 0.50)));
    col *= mix(0.90, 1.07, vignette);

    fragColor = vec4(sat(col), 1.0);
}
