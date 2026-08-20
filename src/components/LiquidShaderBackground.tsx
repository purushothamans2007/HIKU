import React, { useEffect, useRef } from 'react';

interface LiquidShaderBackgroundProps {
  opacity?: number;
  className?: string;
}

export const LiquidShaderBackground: React.FC<LiquidShaderBackgroundProps> = ({
  opacity = 1,
  className = 'fixed inset-0 w-full h-full pointer-events-none'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
    if (resizeObserver) {
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) {
      // Fallback simple background if WebGL is unsupported
      return;
    }

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Liquid Glass Background Shader
// Smooth, flowing dark navy/midnight blue noise with a glass-like sheen

vec3 hash(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash(i + vec3(0, 0, 0)), f - vec3(0, 0, 0)),
                       dot(hash(i + vec3(1, 0, 0)), f - vec3(1, 0, 0)), u.x),
                   mix(dot(hash(i + vec3(0, 1, 0)), f - vec3(0, 1, 0)),
                       dot(hash(i + vec3(1, 1, 0)), f - vec3(1, 1, 0)), u.x), u.y),
               mix(mix(dot(hash(i + vec3(0, 0, 1)), f - vec3(0, 0, 1)),
                       dot(hash(i + vec3(1, 0, 1)), f - vec3(1, 0, 1)), u.x),
                   mix(dot(hash(i + vec3(0, 1, 1)), f - vec3(0, 1, 1)),
                       dot(hash(i + vec3(1, 1, 1)), f - vec3(1, 1, 1)), u.x), u.y), u.z);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    
    // Distort UVs based on noise and mouse
    float n = noise(vec3(uv * 3.0, u_time * 0.2));
    uv += n * 0.05;
    
    // Base colors
    vec3 darkNavy = vec3(0.039, 0.047, 0.063); // #0A0C10
    vec3 midnightBlue = vec3(0.11, 0.11, 0.117); // #1C1C1E
    vec3 accent = vec3(0.0, 0.478, 1.0); // #007AFF
    
    float f = 0.5 + 0.5 * noise(vec3(uv * 2.0, u_time * 0.1));
    vec3 color = mix(darkNavy, midnightBlue, f);
    
    // Add a soft glow near the mouse
    float d = distance(v_texCoord, m);
    color += accent * (1.0 - smoothstep(0.0, 0.8, d)) * 0.15;
    
    // Shimmer highlight
    float shimmer = smoothstep(0.4, 0.41, noise(vec3(uv * 10.0, u_time * 0.5)));
    color += vec3(1.0) * shimmer * 0.03;
    
    gl_FragColor = vec4(color, 1.0);
}`;

    function createShader(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (t: number) => {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={className} style={{ opacity }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
