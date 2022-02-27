import removePunctuation from "remove-punctuation";
import sw from "stopword";
import stopwords from "stopwords-iso";
import { EvalsData } from "./Types";

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function getFullTitle(
  catalogTitle: string,
  crosslistingCatalogTitles: string[]
): string {
  const titles = [catalogTitle, ...crosslistingCatalogTitles];
  return titles.join(" / ");
}

// Functions used for preparing data in charts on course pages
export const prepText = (evalText: string): string[] => {
  let rawLowercaseText = evalText.split(" ").map((word) => word.toLowerCase());
  const noPunctuationText: string[] = rawLowercaseText.map((word) =>
    removePunctuation(word)
  );
  const noStopwordsText: string[] = sw.removeStopwords(
    noPunctuationText,
    stopwords.en
  );
  return noStopwordsText;
};

export const generateWordCounts = (evalsData: EvalsData[]): Object => {
  let wordCounts = {};
  evalsData.forEach((evalDoc: EvalsData) => {
    prepText(evalDoc.text).forEach((word: string) => {
      wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
    });
  });
  return wordCounts;
};
