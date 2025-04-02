// Border.jsx - React Component
import React from "react";

interface NotchedBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  noOffset?: boolean;
}

export const NotchedBorder: React.FC<NotchedBorderProps> = ({
  children,
  className = "",
  size = "medium",
  noOffset = false,
  ...rest
}) => {
  const sizeClass = `border-${size}`;
  const offsetClass = noOffset ? "notched-border-no-offset" : "";

  return (
    <div className={`border-container ${className}`} {...rest}>
      {children}
      <div className={`notched-border ${sizeClass} ${offsetClass}`}>
        {/* Top Left Corner */}
        <span className="corner corner-tl">
          <svg
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              vectorEffect="non-scaling-stroke"
              d="M0 29.5H13L29.5 13V0"
              stroke="currentColor"
            />
          </svg>
        </span>

        {/* Top Right Corner */}
        <span className="corner corner-tr">
          <svg
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              vectorEffect="non-scaling-stroke"
              d="M30 29.5H17L0.5 13V0"
              stroke="currentColor"
            />
          </svg>
        </span>

        {/* Bottom Right Corner */}
        <span className="corner corner-br">
          <svg
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              vectorEffect="non-scaling-stroke"
              d="M30 0.5H17L0.5 17V30"
              stroke="currentColor"
            />
          </svg>
        </span>

        {/* Bottom Left Corner */}
        <span className="corner corner-bl">
          <svg
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              vectorEffect="non-scaling-stroke"
              d="M0 0.5H13L29.5 17V30"
              stroke="currentColor"
            />
          </svg>
        </span>

        <span className="border-line border-line-top"></span>
        <span className="border-line border-line-right"></span>
        <span className="border-line border-line-bottom"></span>
        <span className="border-line border-line-left"></span>
      </div>
    </div>
  );
};
