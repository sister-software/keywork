export function isETagMatch(request: Request, etag: string | null | undefined): etag is string {
  const headerContent = request.headers.get('If-None-Match')

  return etag === headerContent || `W/${etag}` === headerContent
}
