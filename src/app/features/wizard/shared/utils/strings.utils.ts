/** Convert a string to a url safe slug */
export const stringToSlug = (str: string) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/ /gi, '-')
    .replace(/[^a-z0-9] /gi, '');

    /**
     * 
     * @param currentUrl 
     * @param params 
     */
export const baseUrlWithoutParams = (currentUrl: string, params: { sectionId?: string; routeId?: string }) => {
  return currentUrl.split('/').filter(str => (str !== params.sectionId && str !== params.routeId ? true : false)).join('/');
};
