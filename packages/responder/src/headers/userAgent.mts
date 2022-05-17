export function getBrowserIdentifier(request: Request): string {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()

  if (userAgent.includes('chrome')) {
    return 'chrome'
  } else if (userAgent.includes('safari')) {
    return 'safari'
  }

  return 'unknown'
}
