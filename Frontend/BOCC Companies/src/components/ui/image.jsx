import React from "react";

const Image = React.forwardRef(({ src, alt = "", className = "", ...props }, ref) => {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  );
});

Image.displayName = "Image";

export { Image };