import { useState } from 'react'

interface MediaImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackText?: string
  decorative?: boolean
}

export function MediaImage({
  src,
  alt,
  className,
  fallbackText = 'No image',
  decorative = false,
}: MediaImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = !src || failedSrc === src

  if (failed) {
    return (
      <div className={`media-fallback ${className ?? ''}`} aria-hidden={decorative || undefined}>
        {!decorative ? <span>{fallbackText}</span> : null}
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src ?? undefined}
      alt={decorative ? '' : alt}
      loading="lazy"
      onError={() => setFailedSrc(src ?? '')}
    />
  )
}
