import { fetcher } from "../../src/Helpers";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import InstructorForm from "../../components/forms/InstructorForm";
import BlockAction from "../../components/BlockAction";
import Link from "next/link";

// Page for instructor to create a new form
export default function NewForm() {
  // stores list of questions & their metadata
  const [questions, setQuestions] = useState([]);
  // keep track of question ID
  const [qid, setQid] = useState(0);

  // get existing form metadata
  const router: NextRouter = useRouter();
  const formid: string = router.query.formid as string;
  const url: string = formid ? `/api/get-form-metadata?formid=${formid}` : null;
  const { data: formData, error: formError } = useSWR(url, fetcher);

  if (formData?.released) {
    return (
      <BlockAction pageTitle="Publish Form">
        You have already released this form. You can no longer edit its
        questions.
      </BlockAction>
    );
  } else if (formData?.published) {
    const editForm = `/edit-form/${formid}`;
    return (
      <BlockAction pageTitle="Publish Form">
        You have already published this form. You can edit your form{" "}
        <Link href={editForm}>here</Link>.
      </BlockAction>
    );
  }

  return (
    <InstructorForm
      router={router}
      formid={formid}
      questions={questions}
      setQuestions={setQuestions}
      qid={qid}
      setQid={setQid}
      formData={formData}
      formError={formError}
      editMode={false}
    />
  );
}
