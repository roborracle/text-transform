'use client';

import { type SVGAttributes } from 'react';

export interface LogoProps extends SVGAttributes<SVGSVGElement> {
  size?: number;
}

/**
 * Text Transform logo - Two T's with transformation arrow
 * Clean, modern design representing text transformation
 */
export function Logo({ size = 32, className = '', ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Background rounded square */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="6"
        className="fill-blue-600 dark:fill-blue-500"
      />

      {/* First T - left side, slightly faded */}
      <path
        d="M8 9H15V11.5H12.75V22H10.25V11.5H8V9Z"
        className="fill-white/40"
      />

      {/* Transformation arrow - curved */}
      <path
        d="M14.5 15.5C15.5 14 17 13 19 13"
        className="stroke-white/60"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17.5 11.5L19.5 13L17.5 14.5"
        className="stroke-white/60"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Second T - right side, prominent */}
      <path
        d="M17 9H24V11.5H21.75V22H19.25V11.5H17V9Z"
        className="fill-white"
      />
    </svg>
  );
}

/**
 * Compact logo mark for favicon/small sizes
 */
export function LogoMark({ size = 32, className = '', ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Background rounded square */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="6"
        className="fill-blue-600 dark:fill-blue-500"
      />

      {/* Centered T */}
      <path
        d="M10 9H22V12H17.5V23H14.5V12H10V9Z"
        className="fill-white"
      />

      {/* Small transformation indicator - two small arrows */}
      <circle cx="24" cy="8" r="3" className="fill-blue-400 dark:fill-blue-300" />
      <path
        d="M22.5 8H25.5M24.5 6.5L25.5 8L24.5 9.5"
        className="stroke-white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Logo;
