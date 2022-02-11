import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import CustomHead from "../components/CustomHead";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../components/Loading";

export default function Logout() {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/logout", fetcher);
  let loggedOut: boolean = !error && data;

  if (loggedOut) router.push("/");

  return <Loading text={"Logging out..."} />;
}
