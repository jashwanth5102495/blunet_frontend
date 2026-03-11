import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

const defaultColors = ['#5227FF', '#FF9FFC', '#B19EEF'];

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous: _iterationsViscous = 32,
  iterationsPoisson: _iterationsPoisson = 32,
  dt: _dt = 0.014,
  BFECC: _BFECC = true,
  resolution: _resolution = 0.5,
  isBounce: _isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration: _autoRampDuration = 0.6,
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const autoActiveUntilRef = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Palette texture
    const makePaletteTexture = (stops: string[]): THREE.DataTexture => {
      const arr = Array.isArray(stops) && stops.length > 0 ? (stops.length === 1 ? [stops[0], stops[0]] : stops) : ['#ffffff', '#ffffff'];
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    };

    const paletteTex = makePaletteTexture(colors);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.autoClear = false;
    renderer.setClearColor(new THREE.Color(0x000000), 0);
    mount.appendChild(renderer.domElement);

    // Scene / camera / mesh
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const fragment = `
      precision highp float;

      uniform vec2  uResolution;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uMouseForce;
      uniform float uCursorSize;
      uniform float uViscous;
      uniform bool  uIsViscous;
      uniform sampler2D uPalette;
      uniform float uAutoIntensity;

      // Hash and noise for fluid-like motion
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        for(int i=0;i<5;i++){
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / uResolution.xy;

        // Centering and aspect correction for nicer flow
        vec2 p = uv - 0.5;
        p.x *= uResolution.x / uResolution.y;

        // Base flow via fbm noise
        float t = uTime * 0.5;
        float flow = fbm(p * 2.0 + vec2(t*0.7, -t*0.9));

        // Mouse influence: soft ripple/additive highlight
        vec2 m = uMouse - uv;
        float d = length(m);
        float cursor = smoothstep(uCursorSize / uResolution.y, 0.0, d);
        float influence = uMouseForce * (1.0 - cursor);
        flow += influence * 0.02;

        // Optional viscous smoothing
        if(uIsViscous){
          flow = mix(flow, 0.5, clamp(uViscous * 0.01, 0.0, 1.0));
        }

        // Color lookup in palette
        float idx = clamp(flow * uAutoIntensity, 0.0, 0.999);
        vec4 col = texture2D(uPalette, vec2(idx, 0.0));

        // Subtle alpha for blending over black
        float alpha = 0.8;
        gl_FragColor = vec4(col.rgb, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uResolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseForce: { value: mouseForce },
        uCursorSize: { value: cursorSize },
        uViscous: { value: viscous },
        uIsViscous: { value: isViscous },
        uPalette: { value: paletteTex },
        uAutoIntensity: { value: autoIntensity },
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize handling
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      (material.uniforms.uResolution.value as THREE.Vector2).set(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Pointer tracking on window to avoid pointer-events constraints
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      (material.uniforms.uMouse.value as THREE.Vector2).set(x, y);
      lastPointerRef.current = { x, y, t: performance.now() };
      autoActiveUntilRef.current = performance.now() + takeoverDuration * 1000 + (autoResumeDelay || 1000);
    };
    window.addEventListener('pointermove', onPointerMove);

    // Auto demo driver
    let autoTheta = Math.random() * Math.PI * 2;
    const autoUpdate = (dtLocal: number) => {
      if (!autoDemo) return;
      const now = performance.now();
      if (now < autoActiveUntilRef.current) return; // respect takeover period
      autoTheta += dtLocal * autoSpeed * 0.5;
      const r = 0.25;
      const cx = 0.5 + Math.cos(autoTheta) * r;
      const cy = 0.5 + Math.sin(autoTheta * 0.87) * r;
      (material.uniforms.uMouse.value as THREE.Vector2).set(cx, cy);
    };

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const dtLocal = clock.getDelta();
      material.uniforms.uTime.value += dtLocal;
      autoUpdate(dtLocal);
      renderer.clear();
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    uniformsRef.current = material.uniforms;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [mouseForce, cursorSize, isViscous, viscous, colors, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay]);

  return <div ref={mountRef} className={`liquid-ether-container ${className}`} style={style} />;
}
