import React, { useEffect, useRef } from 'react';

export const Crypto3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Nodes
    interface Node3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      label: string;
      color: string;
    }

    const labels = ['ETH', 'BTC', 'SOL', 'USDT', '0x82A7...', '0x71C7...', 'MIXER', 'VASP', 'OFAC'];
    const colors = ['#3B82F6', '#F59E0B', '#8B5CF6', '#10B981', '#6366F1', '#EC4899', '#EF4444'];

    const nodesCount = 45;
    const nodes: Node3D[] = [];

    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 3 + 2,
        label: labels[i % labels.length],
        color: colors[i % colors.length]
      });
    }

    // 3D Rotating Blocks (Crypto Blocks)
    interface Block3D {
      x: number;
      y: number;
      z: number;
      size: number;
      rx: number;
      ry: number;
      rz: number;
      vrx: number;
      vry: number;
      color: string;
    }

    const blocks: Block3D[] = [
      { x: -width * 0.3, y: -height * 0.1, z: 400, size: 70, rx: 0.2, ry: 0.4, rz: 0, vrx: 0.005, vry: 0.008, color: '#3B82F6' },
      { x: width * 0.32, y: height * 0.15, z: 350, size: 90, rx: 0.5, ry: 0.1, rz: 0.2, vrx: -0.006, vry: 0.007, color: '#8B5CF6' },
      { x: width * 0.05, y: -height * 0.25, z: 500, size: 60, rx: 0.1, ry: 0.7, rz: 0.4, vrx: 0.008, vry: -0.005, color: '#06B6D4' }
    ];

    // Projection constants
    const fov = 400;

    // Helper to project 3D point to 2D screen
    const project = (x: number, y: number, z: number) => {
      const scale = fov / (fov + z);
      return {
        x: width / 2 + (x + (mouseX - width / 2) * 0.08) * scale,
        y: height / 2 + (y + (mouseY - height / 2) * 0.08) * scale,
        scale
      };
    };

    // Draw rotating 3D Cube outline
    const drawCube = (block: Block3D) => {
      block.rx += block.vrx;
      block.ry += block.vry;

      const s = block.size / 2;
      const vertices = [
        { x: -s, y: -s, z: -s },
        { x: s, y: -s, z: -s },
        { x: s, y: s, z: -s },
        { x: -s, y: s, z: -s },
        { x: -s, y: -s, z: s },
        { x: s, y: -s, z: s },
        { x: s, y: s, z: s },
        { x: -s, y: s, z: s }
      ];

      // Rotate vertices around 3D axes
      const rotated = vertices.map((v) => {
        // Rotate X
        let y1 = v.y * Math.cos(block.rx) - v.z * Math.sin(block.rx);
        let z1 = v.y * Math.sin(block.rx) + v.z * Math.cos(block.rx);
        let x1 = v.x;

        // Rotate Y
        let x2 = x1 * Math.cos(block.ry) + z1 * Math.sin(block.ry);
        let z2 = -x1 * Math.sin(block.ry) + z1 * Math.cos(block.ry);
        let y2 = y1;

        return project(block.x + x2, block.y + y2, block.z + z2);
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      ctx.strokeStyle = block.color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.35;

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(rotated[i].x, rotated[i].y);
        ctx.lineTo(rotated[j].x, rotated[j].y);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw 3D Blocks
      blocks.forEach(drawCube);

      // Project & update nodes
      const projectedNodes = nodes.map((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        if (Math.abs(node.x) > width * 0.7) node.vx *= -1;
        if (Math.abs(node.y) > height * 0.7) node.vy *= -1;
        if (node.z < 50 || node.z > 900) node.vz *= -1;

        const p = project(node.x, node.y, node.z);
        return { ...p, node };
      });

      // Draw connections between close 3D nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.strokeStyle = p1.node.color;
            ctx.globalAlpha = (1 - dist / 130) * 0.25 * p1.scale;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Nodes
      projectedNodes.forEach(({ x, y, scale, node }) => {
        const r = Math.max(1.5, node.radius * scale * 1.5);
        ctx.globalAlpha = Math.min(1, scale * 1.2);

        // Node Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node Core
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        if (scale > 0.7) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
          ctx.font = `${Math.floor(9 * scale)}px "JetBrains Mono", monospace`;
          ctx.fillText(node.label, x + r + 4, y + 3);
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
