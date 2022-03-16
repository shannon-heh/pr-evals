import Head from "next/head";
import NavBar from "./NavBar";

export default function CustomHead(props: { pageTitle?: string }) {
  return (
    <Head>
      <title>
        Course Evals IW {props.pageTitle ? "| " + props.pageTitle : ""}
      </title>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
  );
}
