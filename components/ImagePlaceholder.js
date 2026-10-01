export default function ImagePlaceholder({ label = 'Photo coming soon', imageUrl, alt, className = '' }) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={alt || ''} className={`object-cover w-full h-full ${className}`} />;
  }
  return <div className={`placeholder-block w-full h-full ${className}`} data-label={label} aria-hidden="true" />;
}
