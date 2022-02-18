import Skeleton from "@mui/material/Skeleton";
import useSWR from "swr";
import { evalsData } from "../../pages/api/textual-evaluations";
import Evaluation from "./Evaluation";

export default function TextualEvaluations(props: { courseID: string }) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/textual-evaluations", fetcher);
  const evalsData = data as evalsData[];

  const processEvals = (evalsData: evalsData[]) => {
    const evals = Array();
    evalsData.forEach((evalDoc: evalsData) => {
      evals.push(<Evaluation evalDoc={evalDoc} />);
    });
    return evals;
  };

  if (!data || error)
    return (
      <>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="50%" />
        <br />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="50%" />
      </>
    );

  return <>{processEvals(evalsData)}</>;
}
