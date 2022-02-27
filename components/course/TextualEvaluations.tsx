import Evaluation from "./Evaluation";
import { EvalsData } from "../../src/Types";
import { Skeleton } from "@mui/material";

export default function TextualEvaluations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const processEvals = (evalsData: EvalsData[]) => {
    const evals = Array();
    let i = 0;
    evalsData.forEach((evalDoc: EvalsData) => {
      evals.push(<Evaluation key={i++} evalDoc={evalDoc} />);
    });
    return evals;
  };

  if (props.isLoading)
    return (
      <>
        <Skeleton animation="wave" />
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
