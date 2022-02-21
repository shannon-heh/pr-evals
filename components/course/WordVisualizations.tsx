import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ReactWordcloud, { Word } from "react-wordcloud";
import removePunctuation from "remove-punctuation";
import sw from "stopword";
import { EvalsData } from "../../src/Types";

export default function WordVisualizations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const generateWordCounts = (evalsData: EvalsData[]): Word[] => {
    let wordCounts = {};
    // const wordCounts: Word[] = Array();
    evalsData.forEach((evalsDoc: EvalsData) => {
      let rawLowercaseText = evalsDoc.text
        .split(" ")
        .map((word) => word.toLowerCase());
      const noPunctuationText: string[] = rawLowercaseText.map((word) =>
        removePunctuation(word)
      );
      const noStopwordsText: string[] = sw.removeStopwords(noPunctuationText);
      noStopwordsText.forEach((word: string) => {
        wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
      });
    });

    let res: Word[] = Array();
    for (const [text, value] of Object.entries(wordCounts)) {
      res.push({ text: text as string, value: value as number });
    }

    return res;
  };

  if (props.isLoading)
    return <Skeleton variant="rectangular" animation="wave" height="193px" />;

  return (
    <Box>
      <ReactWordcloud words={generateWordCounts(props.evalsData)} />
    </Box>
  );
}
