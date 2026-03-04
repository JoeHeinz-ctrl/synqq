import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NeuralBackgroundProps {
  className?: string;
  /**
   * If true the canvas will take up the entire viewport and sit fixed
   * behind other content.  This is convenient when you want the animation
   * to be a full‑screen background without needing an outer container.
   */
  fullScreen?: boolean;
  /**
   * Color of the particles. 
   * Defaults to a cyan/indigo mix if not specified.
   */
  color?: string;
  /**
   * The opacity of the trails (0.0 to 1.0).
   * Lower = longer trails. Higher = shorter trails.
   * Default: 0.1
   */
  trailOpacity?: number;
  /**
   * Number of particles. Default: 800
   */
  particleCount?: number;
  /**
   * Speed multiplier. Default: 1
   */
  speed?: number;
}

export default function NeuralBackground({
  className,
  fullScreen = false,
  color = "#6366f1", // Default Indigo
  trailOpacity = 0.15,
  particleCount = 600,
  speed = 1,
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- CONFIGURATION ---
    let width = container.clientWidth;
    let height = container.clientHeight;
    let particles: Particle[] = [];
    let animationFrameId: number;
    // mouse now also tracks velocity so the field can "carry" particles
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 }; // Start off-screen

    // --- PARTICLE CLASS ---
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        // Random lifespan to create natural recycling
        this.life = Math.random() * 200 + 100; 
      }

      update() {
        // 1. Flow Field Math (Simplex-ish noise)
        // We calculate an angle based on position to create the "flow"
        const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
        
        // 2. Add force from flow field
        this.vx += Math.cos(angle) * 0.2 * speed;
        this.vy += Math.sin(angle) * 0.2 * speed;

        // 3. Mouse interaction (repel + follow movement)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 150;

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          // existing repulsion
          this.vx -= dx * force * 0.05;
          this.vy -= dy * force * 0.05;
          // add a bit of the cursor's velocity so particles are "dragged"
          this.vx += mouse.vx * 0.0005;
          this.vy += mouse.vy * 0.0005;
        }

        // 4. Apply Velocity & Friction
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95; // Friction to stop infinite acceleration
        this.vy *= 0.95;

        // 5. Aging
        this.age++;
        if (this.age > this.life) {
          this.reset();
        }

        // 6. Wrap around screen
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = 0;
        this.vy = 0;
        this.age = 0;
        this.life = Math.random() * 200 + 100;
      }

      draw(context: CanvasRenderingContext2D) {
        // Draw with local alpha without affecting global state
        context.save();
        context.fillStyle = color;
        const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
        context.globalAlpha = alpha;
        context.fillRect(this.x, this.y, 1.6, 1.6);
        context.restore();
      }
    }

    // --- INITIALIZATION ---
    const init = () => {
      // Defensive width/height: if container is unexpectedly small, fall back to window
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      // Handle High-DPI screens (Retina)
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      // set the internal pixel size
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      // ensure CSS size matches layout size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Reset transform then set to device pixel ratio to avoid cumulative scaling
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // --- ANIMATION LOOP ---
    const animate = () => {
      // Trail overlay uses the container's background color so the effect blends
      // nicely with light or dark themes.
      let overlay = `rgba(0,0,0,${trailOpacity})`;
      try {
        let bg = window.getComputedStyle(container).backgroundColor || "rgba(250,250,248,1)";
        // if transparent, fall back to body background
        if (/rgba\([\d\s,]+,\s*0\s*\)/.test(bg) || bg === "transparent") {
          bg = window.getComputedStyle(document.body).backgroundColor || "rgb(250,250,248)";
        }
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if (m) {
          overlay = `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${trailOpacity})`;
        }
      } catch {
        // fallback left as default
      }

      ctx.save();
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // --- EVENT LISTENERS ---
    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      // compute velocity (simple difference, could be smoothed)
      mouse.vx = newX - mouse.x;
      mouse.vy = newY - mouse.y;
      mouse.x = newX;
      mouse.y = newY;
    };

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
        mouse.vx = 0;
        mouse.vy = 0;
    }

    // Start
    init();
    animate();

    window.addEventListener("resize", handleResize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, trailOpacity, particleCount, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        className,
        fullScreen && "fixed inset-0 w-screen h-screen -z-10"
      )}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
