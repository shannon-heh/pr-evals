import Skeleton from "@mui/material/Skeleton";
import Evaluation from "./Evaluation";
import { EvalsData } from "../../src/Types";

export default function TextualEvaluations(props: {
  evalsData: EvalsData[];
  isLoading: boolean;
}) {
  const processEvals = (evalsData: EvalsData[]) => {
    const evals = Array();
    evalsData.forEach((evalDoc: EvalsData) => {
      evals.push(<Evaluation evalDoc={evalDoc} />);
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
      </>
    );

  return <>{processEvals(props.evalsData)}</>;
}
