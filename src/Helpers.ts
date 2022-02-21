
  export const fetcher = (url: string) => fetch(url).then((r) => r.json());

  export function getFullTitle(catalogTitle: string, crosslistingCatalogTitles: string[]): string {
    const titles = [catalogTitle, ...crosslistingCatalogTitles];
    return titles.join(" / ");
  }