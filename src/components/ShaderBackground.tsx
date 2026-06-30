import { useEffect, useRef } from "react";
import alienMountainsShader from "../shaders/alien-mountains.frag?raw";
import spaceShader from "../shaders/space.frag?raw";
import { cx } from "../styles/ui";

type Theme = "light" | "dark";
type ShaderVariant = "banner" | "splash";

const shaders: Record<Theme, string> = {
  dark: spaceShader,
  light: alienMountainsShader,
};

const maxDprByTheme: Record<Theme, number> = {
  dark: 2,
  light: 1.25,
};

const targetFrameIntervalByTheme: Record<Theme, number> = {
  dark: 0,
  light: 1000 / 30,
};

const mobileRenderScale = 0.55;
const mobileMediaQuery = "(max-width: 760px)";

export default function ShaderBackground({
  theme,
  variant,
}: {
  theme: Theme;
  variant: ShaderVariant;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
      stencil: false,
    });

    if (gl === null) {
      return;
    }

    const renderCanvas = canvas;
    const renderGl = gl;
    const program = createProgram(renderGl, shaders[theme]);
    const positionLocation = renderGl.getAttribLocation(program, "aPosition");
    const resolutionLocation = renderGl.getUniformLocation(program, "iResolution");
    const timeLocation = renderGl.getUniformLocation(program, "iTime");
    const variantLocation = renderGl.getUniformLocation(program, "iVariant");
    const sceneYOffsetLocation = renderGl.getUniformLocation(program, "iSceneYOffset");
    const buffer = renderGl.createBuffer();

    if (buffer === null) {
      renderGl.deleteProgram(program);
      return;
    }

    renderGl.useProgram(program);
    renderGl.bindBuffer(renderGl.ARRAY_BUFFER, buffer);
    renderGl.bufferData(
      renderGl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      renderGl.STATIC_DRAW,
    );
    renderGl.enableVertexAttribArray(positionLocation);
    renderGl.vertexAttribPointer(positionLocation, 2, renderGl.FLOAT, false, 0, 0);
    renderGl.uniform1f(variantLocation, variant === "banner" ? 1 : 0);

    const maxDpr = maxDprByTheme[theme];
    const targetFrameInterval = targetFrameIntervalByTheme[theme];
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia(mobileMediaQuery);
    const startedAt = performance.now();
    let animationFrame = 0;
    let frameTimer: number | undefined;
    let lastRenderedAt = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastDpr = 0;
    let isDocumentVisible = document.visibilityState === "visible";
    let isCanvasVisible = true;
    let needsDraw = true;

    function cancelScheduledRender() {
      if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }

      if (frameTimer !== undefined) {
        clearTimeout(frameTimer);
        frameTimer = undefined;
      }
    }

    function scheduleRender(delay = 0) {
      if (animationFrame !== 0 || frameTimer !== undefined) {
        return;
      }

      if (delay > 0) {
        frameTimer = window.setTimeout(() => {
          frameTimer = undefined;
          animationFrame = requestAnimationFrame(render);
        }, delay);
        return;
      }

      animationFrame = requestAnimationFrame(render);
    }

    function resizeCanvas() {
      const renderScale = theme === "light" && mobileQuery.matches ? mobileRenderScale : 1;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr) * renderScale;
      const rect = renderCanvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      const changed = width !== lastWidth || height !== lastHeight || dpr !== lastDpr;

      if (changed) {
        lastWidth = width;
        lastHeight = height;
        lastDpr = dpr;

        if (renderCanvas.width !== width || renderCanvas.height !== height) {
          renderCanvas.width = width;
          renderCanvas.height = height;
          renderGl.viewport(0, 0, width, height);
        }

        renderGl.uniform3f(resolutionLocation, width, height, dpr);
      }

      return changed;
    }

    function syncSceneOffset() {
      if (sceneYOffsetLocation !== null) {
        const sceneYOffset = theme === "light" && variant === "splash" && mobileQuery.matches ? -0.78 : 0;
        renderGl.uniform1f(sceneYOffsetLocation, sceneYOffset);
      }
    }

    function render(now: number) {
      animationFrame = 0;

      if (!isDocumentVisible || !isCanvasVisible) {
        return;
      }

      const frameAge = now - lastRenderedAt;

      if (targetFrameInterval > 0 && !needsDraw && frameAge < targetFrameInterval) {
        scheduleRender(targetFrameInterval - frameAge);
        return;
      }

      needsDraw = resizeCanvas() || needsDraw;
      syncSceneOffset();

      renderGl.uniform1f(timeLocation, (now - startedAt) / 1000);
      renderGl.drawArrays(renderGl.TRIANGLES, 0, 6);

      needsDraw = false;
      lastRenderedAt = now;

      if (!reducedMotionQuery.matches) {
        scheduleRender();
      }
    }

    function handleVisibilityChange() {
      isDocumentVisible = document.visibilityState === "visible";

      if (isDocumentVisible) {
        needsDraw = true;
        scheduleRender();
      } else {
        cancelScheduledRender();
      }
    }

    function handleMotionPreferenceChange() {
      needsDraw = true;
      scheduleRender();
    }

    function handleMobileChange() {
      needsDraw = true;
      scheduleRender();
    }

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => {
          needsDraw = true;
          scheduleRender();
        });
    const intersectionObserver = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entries) => {
          isCanvasVisible = entries[0]?.isIntersecting ?? true;

          if (isCanvasVisible) {
            needsDraw = true;
            scheduleRender();
          } else {
            cancelScheduledRender();
          }
        });

    resizeObserver?.observe(renderCanvas);
    intersectionObserver?.observe(renderCanvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    reducedMotionQuery.addEventListener?.("change", handleMotionPreferenceChange);
    mobileQuery.addEventListener?.("change", handleMobileChange);

    scheduleRender();

    return () => {
      cancelScheduledRender();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      reducedMotionQuery.removeEventListener?.("change", handleMotionPreferenceChange);
      mobileQuery.removeEventListener?.("change", handleMobileChange);

      renderGl.deleteBuffer(buffer);
      renderGl.deleteProgram(program);
    };
  }, [theme, variant]);

  return (
    <div className={cx("shader-background", `shader-background--${variant}`)} aria-hidden="true">
      <canvas ref={canvasRef} className="shader-background__canvas" />
      <div className="shader-background__overlay" />
    </div>
  );
}

function createProgram(gl: WebGLRenderingContext, fragmentShaderSource: string) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 aPosition;

    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, `
    ${fragmentShaderSource}

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `);
  const program = gl.createProgram();

  if (program === null) {
    throw new Error("Could not create shader program");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown shader program link error";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (shader === null) {
    throw new Error("Could not create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}
