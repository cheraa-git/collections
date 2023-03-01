import dayjs from "dayjs"

export const dateFormat = (timestamp?: string) => {
  if (!timestamp) return ''
  return dayjs(+timestamp).format('DD-MM-YYYY')
}

export const dateTimeFormat = (timestamp?: string) => {
  if (!timestamp) return ''
  return dayjs(+timestamp).format('HH:mm DD-MM-YY')
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
