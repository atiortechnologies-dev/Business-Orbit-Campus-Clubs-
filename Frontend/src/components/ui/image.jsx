import * as React from "react";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE_URL =
  "https://via.placeholder.com/600x400?text=No+Image";

const Image = React.forwardRef(
  (
    {
      src,
      className,
      style,
      alt = "",
      fittingType = "fill",
      originWidth,
      originHeight,
      onError,
      ...props
    },
    ref
  ) => {
    const [imageSrc, setImageSrc] = React.useState(src || FALLBACK_IMAGE_URL);

    React.useEffect(() => {
      setImageSrc(src || FALLBACK_IMAGE_URL);
    }, [src]);

    const aspectRatio =
      originWidth && originHeight
        ? `${originWidth} / ${originHeight}`
        : undefined;

    return (
      <img
        ref={ref}
        src={imageSrc}
        alt={alt}
        className={cn(
          fittingType === "fit" ? "object-contain" : "object-cover",
          className
        )}
        style={{
          aspectRatio,
          ...style,
        }}
        loading="lazy"
        onError={(e) => {
          if (imageSrc !== FALLBACK_IMAGE_URL) {
            setImageSrc(FALLBACK_IMAGE_URL);
          }

          if (onError) {
            onError(e);
          }
        }}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };