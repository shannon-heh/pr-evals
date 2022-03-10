import Evaluation from "./Evaluation";
import { EvalsData } from "../../src/Types";
import { Skeleton } from "@mui/material";

export default function TextualEvaluations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const processEvals = (evalsData: EvalsData[]) => {
    return evalsData.map((evalDoc: EvalsData, i) => (
      <Evaluation key={i} evalDoc={evalDoc} />
    ));
  };

  if (props.isLoading)
    return (
      <>
        <Skeleton sx={{ mt: 2 }} animation="wave" />
        <Skeleton animation="wave" width="50%" />
        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="50%" />
        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="50%" />
      </>
    );

  return <>{processEvals(props.evalsData)}</>;
}
