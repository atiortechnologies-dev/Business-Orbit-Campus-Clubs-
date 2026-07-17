import React from "react";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE = "/black_logo.png"; // Change if you want another fallback

const Image = React.forwardRef(
  ({ src, alt = "", className, onError, ...props }, ref) => {
    const [imageSrc, setImageSrc] = React.useState(src || FALLBACK_IMAGE);

    React.useEffect(() => {
      setImageSrc(src || FALLBACK_IMAGE);
    }, [src]);

    return (
      <img
        ref={ref}
        src={imageSrc}
        alt={alt}
        className={cn(className)}
        loading="lazy"
        onError={(e) => {
          setImageSrc(FALLBACK_IMAGE);
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };