import { fetcher } from "../../src/Helpers";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../../components/Loading";
import Error from "../../components/Error";

export default function Form() {
  const router = useRouter();
  const formid = router.query.formid as string;

  // get form metadata
  const url = formid ? `/api/get-form-metadata?formid=${formid}` : null;
  const { data: formData, error: formError } = useSWR(url, fetcher);

  if (formError) return <Error />;
  if (!formData) return <Loading />;

  return (
    <div>
      <div>Title: {formData.title}</div>
      <div>Description: {formData.description}</div>
      <div>ID: {formData.form_id}</div>
    </div>
  );
}
