/** Convert a string to a url safe slug */
export const stringToSlug = (str: string) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/ /gi, '-')
    .replace(/[^a-z0-9] /gi, '');
    