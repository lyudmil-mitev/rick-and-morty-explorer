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
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
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
    const buffer = renderGl.createBuffer();

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

    const startedAt = performance.now();
    let animationFrame = 0;

    function render(now: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = renderCanvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (renderCanvas.width !== width || renderCanvas.height !== height) {
        renderCanvas.width = width;
        renderCanvas.height = height;
        renderGl.viewport(0, 0, width, height);
      }

      renderGl.useProgram(program);
      renderGl.uniform3f(resolutionLocation, width, height, dpr);
      renderGl.uniform1f(timeLocation, (now - startedAt) / 1000);
      renderGl.uniform1f(variantLocation, variant === "banner" ? 1 : 0);
      renderGl.drawArrays(renderGl.TRIANGLES, 0, 6);

      animationFrame = requestAnimationFrame(render);
    }

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
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
