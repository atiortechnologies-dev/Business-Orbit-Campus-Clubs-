import React from "react";

const FALLBACK_IMAGE = "/fallback.png"; // Optional

const Image = React.forwardRef(
  ({ src, alt = "", className = "", onError, ...props }, ref) => {
    const handleError = (e) => {
      if (FALLBACK_IMAGE) {
        e.currentTarget.src = FALLBACK_IMAGE;
      }

      if (onError) {
        onError(e);
      }
    };

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };