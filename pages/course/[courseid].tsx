import { useRouter } from "next/router";
import CustomHead from "../../components/CustomHead";
import Loading from "../../components/Loading";
import useCAS from "../../hooks/useCAS";

export default function Course() {
  const { isLoading, netID } = useCAS();

  if (isLoading) return <Loading text={"Loading course..."} />;

  const router = useRouter();
  const { courseid } = router.query;
  return (
    <>
      <CustomHead pageTitle={courseid as string} />
    </>
  );
}
