import Charts from "./Charts";

export default function Students(props: { courseID?: string }) {
  return (
    <Charts
      courseID={props.courseID}
      isStandard={false}
      isDemographics={true}
    />
  );
}
