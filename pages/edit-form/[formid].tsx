import { fetcher, isStudent } from "../../src/Helpers";
import { NextRouter, useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import InstructorForm from "../../components/forms/InstructorForm";
import BlockAction from "../../components/BlockAction";
import Link from "next/link";

// Page for instructor to edit a form
export default function EditForm() {
  // stores list of questions & their metadata
  const [questions, setQuestions] = useState([]);
  // keep track of question ID
  const [qid, setQid] = useState(0);

  // get existing form metadata
  const router: NextRouter = useRouter();
  const formid: string = router.query.formid as string;
  const url: string = formid ? `/api/get-form-metadata?formid=${formid}` : null;
  const { data: formData, error: formError } = useSWR(url, fetcher);

  // set state to existing questions
  useEffect(() => {
    setQuestions(formData?.questions ?? []);
    setQid(formData?.questions.length ?? 0);
  }, [formData]);

  if (formData?.released) {
    return (
      <BlockAction pageTitle="Edit Form">
        You have already released this form. You can no longer edit its
        questions.
      </BlockAction>
    );
  } else if (!formData?.published) {
    const newForm = `/new-form/${formid}`;
    return (
      <BlockAction pageTitle="Edit Form" error={true}>
        You must publish this form first to enter Edit mode. You can publish
        your form <Link href={newForm}>here</Link>.
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
      editMode={true}
    />
  );
}
