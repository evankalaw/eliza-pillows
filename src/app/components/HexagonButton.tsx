import React, { useState } from "react";
import { HexagonBorder } from "@/app/components/borders/HexagonBorder";

interface HexagonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  // Add other specific props if needed, e.g., custom hover colors
  baseBgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
}

export default function HexagonButton({
  children,
  className,
  style,
  baseBgColor = "transparent",
  hoverBgColor = "#FFFFFF", // Default white
  textColor = "white",
  hoverTextColor = "black",
  onClick, // Pass onClick directly
  ...rest // Pass remaining button attributes
}: HexagonButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  const dynamicStyle = {
    clipPath:
      "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)",
    backgroundColor: isHovering ? hoverBgColor : baseBgColor,
    color: isHovering ? hoverTextColor : textColor,
    transition: "background-color 0.3s ease, color 0.3s ease",
    ...style, // Merge with any additional styles passed via props
  };

  return (
    // Use a button element for accessibility and semantic correctness
    <button
      className={`relative cursor-pointer ${className}`} // Combine base classes with passed className
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ padding: 0, border: "none", background: "none" }} // Reset default button styles
      {...rest} // Spread remaining props like disabled, type, etc.
    >
      <HexagonBorder
        className="py-3 uppercase text-xl px-6" // Keep original classes that define size/text style
        noOffset={true}
        style={dynamicStyle}
        size="small"
        // Remove hover handlers from HexagonBorder as they are now on the parent button
      >
        {/* Ensure children are rendered correctly */}
        <span className="relative z-10 font-ptserif tracking-[.2em]">
          {children}
        </span>
      </HexagonBorder>
    </button>
  );
}
