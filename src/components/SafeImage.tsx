import React, { useState } from 'react';

interface SafeImageProps {
  srcs: string[];
  alt?: string;
  className?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ srcs = [], alt = '', className = '' }) => {
  const [idx, setIdx] = useState(0);
  const current = srcs[idx] || '';

  const handleError = () => {
    setIdx((i) => i + 1);
  };

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};

export default SafeImage;