import React from "react";

type Variant = "text" | "rect" | "circle" | "avatar" | "button";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  width?: number | string;
  height?: number | string;
  animated?: boolean; // default true
  surface?: boolean;  // add subtle inset border
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  animated = true,
  surface = false,
  className,
  style,
  ...rest
}) => {
  const variantClass =
    variant === "text" ? "skeleton--text" :
    variant === "rect" ? "skeleton--rect" :
    variant === "circle" ? "skeleton--circle" :
    variant === "avatar" ? "skeleton--avatar" :
    variant === "button" ? "skeleton--button" : "";

  const classes = cn(
    "skeleton",
    animated ? undefined : "skeleton--static",
    surface ? "skeleton--surface" : undefined,
    variantClass,
    className
  );

  const sizeStyle: React.CSSProperties = { ...style };
  if (width !== undefined) sizeStyle.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) sizeStyle.height = typeof height === "number" ? `${height}px` : height;

  return <div className={classes} style={sizeStyle} {...rest} />;
};

export default Skeleton;