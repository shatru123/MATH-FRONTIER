import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface KaTeXMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const KaTeXMath: React.FC<KaTeXMathProps> = ({ math, block = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    try {
      katex.render(math, containerRef.current, {
        displayMode: block,
        throwOnError: false,
        strict: false
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      containerRef.current.textContent = math;
    }
  }, [math, block]);

  return (
    <span
      ref={containerRef}
      className={`${block ? 'block my-3 overflow-x-auto text-center py-2' : 'inline-block px-1'} ${className}`}
    />
  );
};
