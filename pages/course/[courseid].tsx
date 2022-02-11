import { useRouter } from "next/router";
import useSWR from "swr";
import CustomHead from "../../components/CustomHead";
import Loading from "../../components/Loading";
import useCAS from "../../hooks/useCAS";

export default function Course() {
  const { isLoading, netID } = useCAS();

  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { courseid } = router.query;
  const { data, error } = useSWR(
    courseid ? `/api/course-page-data?courseid=${courseid}` : null,
    fetcher
  );

  if (isLoading || !data || error)
    return <Loading text={"Loading course..."} />;

  return (
    <>
      <CustomHead pageTitle={courseid as string} />
      <div>{JSON.stringify(data)}</div>
    </>
  );
}
