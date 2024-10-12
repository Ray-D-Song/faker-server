function formatPath(path: string): string {
  if (path.startsWith('/')) {
    path = path.substring(1)
  }

  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  return path
}

export { formatPath }
