import "../styles/global.css";
import { prEvalsTheme } from "../src/Helpers";
import { ThemeProvider } from "@mui/material";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={prEvalsTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
