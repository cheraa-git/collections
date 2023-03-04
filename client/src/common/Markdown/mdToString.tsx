export const mdToString = (source: string) => {
  source = source
    .replaceAll('#', '')
    .replaceAll('*', '')
    .replaceAll('~', '')
    .replaceAll('>', '')
    .replaceAll('`', '')
  return source

}
