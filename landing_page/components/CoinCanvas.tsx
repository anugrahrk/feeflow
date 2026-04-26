'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CoinCanvasProps {
    totalFrames?: number;
    framePrefix?: string;
}

export default function CoinCanvas({
    totalFrames = 240,
    framePrefix = 'ezgif-frame-'
}: CoinCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const currentFrameRef = useRef(0);
    const animationFrameRef = useRef<number>(0);

    // Preload all coin images
    useEffect(() => {
        const loadImages = async () => {
            const imagePromises: Promise<HTMLImageElement>[] = [];

            for (let i = 1; i <= totalFrames; i++) {
                const promise = new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    const frameNumber = String(i).padStart(3, '0');
                    img.src = `/coin-sequence/${framePrefix}${frameNumber}.jpg`;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
                imagePromises.push(promise);
            }

            try {
                const loadedImages = await Promise.all(imagePromises);
                setImages(loadedImages);
                setIsLoaded(true);
            } catch (error) {
                console.error('Error loading coin images:', error);
            }
        };

        loadImages();
    }, [totalFrames, framePrefix]);

    // Draw frame on canvas
    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx || !images.length || frameIndex >= images.length) return;

        const img = images[frameIndex];

        // Set canvas to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Clear canvas with background color matching coin background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit image while maintaining aspect ratio
        const scale = Math.max(
            canvas.width / img.width,
            canvas.height / img.height
        );

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Center the image
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        // Draw the coin image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    }, [images]);

    // Handle scroll-linked animation
    useEffect(() => {
        if (!isLoaded || !images.length) return;

        const handleScroll = () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = window.scrollY / scrollHeight;

                // Map scroll progress to frame index (0 to totalFrames - 1)
                const frameIndex = Math.min(
                    Math.floor(scrollProgress * totalFrames),
                    totalFrames - 1
                );

                if (frameIndex !== currentFrameRef.current) {
                    currentFrameRef.current = frameIndex;
                    drawFrame(frameIndex);
                }
            });
        };

        const handleResize = () => {
            drawFrame(currentFrameRef.current);
        };

        // Initial draw
        drawFrame(0);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isLoaded, images, totalFrames, drawFrame]);

    return (
        <>
            {/* Loading state */}
            {!isLoaded && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-background-primary">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-secondary text-sm">Loading experience...</p>
                    </div>
                </div>
            )}

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full z-0 gpu-accelerated"
                style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                }}
            />
        </>
    );
}
