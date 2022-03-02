import Head from "next/head";
import NavBar from "./NavBar";

export default function CustomHead(props: { pageTitle?: string }) {
  return (
    <>
      <Head>
        <title>
          Course Evals IW {props.pageTitle ? "| " + props.pageTitle : ""}
        </title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <NavBar />
    </>
  );
}
