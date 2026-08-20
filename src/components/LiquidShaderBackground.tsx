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
    if (!gl) return;

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

// Pure Crystal Liquid Water Glassmorphism Shader
// Realistic transparent water caustics, diamond specular highlights, mint-emerald refraction

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

// Pure water wave caustics generator
float waterCaustics(vec2 uv, float t) {
    vec2 p = uv * 4.2;
    float c = 0.0;
    for(int i = 1; i <= 3; i++) {
        float fi = float(i);
        p += vec2(
            sin(p.y * 1.6 + t * 0.75 * fi + fi) * 0.45,
            cos(p.x * 1.6 + t * 0.65 * fi + fi) * 0.45
        );
        c += 1.0 / length(vec2(
            sin(p.x + t * 0.45),
            cos(p.y + t * 0.55)
        ) * 1.9);
    }
    return clamp(c * 0.13, 0.0, 1.0);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    
    // Wave distortion & mouse ripple interaction
    float dMouse = distance(uv, m);
    float mouseWave = sin(dMouse * 24.0 - u_time * 3.8) * exp(-dMouse * 4.0);
    uv += vec2(mouseWave * 0.022);
    
    float fluidNoise = noise(vec3(uv * 2.2, u_time * 0.12));
    uv += fluidNoise * 0.035;
    
    // Crystal Liquid Water Palette: Obsidian Glass, Platinum, Mint & Jade Emerald
    vec3 obsidianGlass = vec3(0.024, 0.043, 0.063); // #060b10 Deep Crystal Base
    vec3 smokyGlass    = vec3(0.051, 0.082, 0.110); // #0d151c Smoky Translucent Glass
    vec3 liquidDiamond = vec3(0.950, 0.980, 1.000); // #f2faff Diamond Specular Caustics
    vec3 seaMint       = vec3(0.200, 0.830, 0.650); // #34d3a6 Sea Mint Liquid
    vec3 liquidJade    = vec3(0.063, 0.725, 0.506); // #10b981 Jade Emerald
    vec3 silverPrism   = vec3(0.820, 0.880, 0.940); // #d1e0f0 Prismatic Silver
    
    // Base crystal gradient
    float f1 = 0.5 + 0.5 * noise(vec3(uv * 1.1, u_time * 0.05));
    vec3 color = mix(obsidianGlass, smokyGlass, f1);
    
    // Water Caustic light reflections with diamond shine
    float caustics = waterCaustics(uv, u_time * 0.35);
    color += liquidDiamond * caustics * 0.24;
    color += seaMint * caustics * 0.16;
    
    // Flowing mint fluid streams
    float stream1 = smoothstep(0.35, 0.85, noise(vec3(uv * 1.8 + vec2(0.2, -0.3), u_time * 0.09)));
    color += seaMint * stream1 * 0.14;
    
    float stream2 = smoothstep(0.4, 0.9, noise(vec3(uv * 2.4 - vec2(0.4, 0.5), u_time * 0.12)));
    color += liquidJade * stream2 * 0.12;
    
    // Silver Prismatic volume lighting
    float volumeLight = smoothstep(0.38, 0.95, noise(vec3((uv - vec2(0.65, 0.25)) * 1.6, u_time * 0.07)));
    color += silverPrism * volumeLight * 0.18;
    
    // Cursor Bioluminescent Water Ripples
    color += liquidDiamond * (1.0 - smoothstep(0.0, 0.6, dMouse)) * 0.22;
    color += seaMint * (1.0 - smoothstep(0.0, 0.32, dMouse)) * 0.20;
    
    // Crystal glass specular glimmer
    float glimmer = smoothstep(0.48, 0.52, noise(vec3(uv * 22.0, u_time * 0.45)));
    color += liquidDiamond * glimmer * 0.045;
    
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
