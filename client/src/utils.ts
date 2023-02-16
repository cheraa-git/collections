
export const formatDate = (timestamp: string) => {
  const date = new Date(+timestamp)
  return date.toLocaleString()
}

export const formatFileSize = (bytes: number) => {
  let postfix = "B"
  if (bytes > 1024) {
    bytes = bytes / 1024
    postfix = "KB"
  }
  if (bytes > 1024) {
    bytes = bytes / 1024
    postfix = "MB"
  }
  return `${Math.round(bytes)}${postfix}`
}
