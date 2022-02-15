import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Logout() {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/logout", fetcher);
  let loggedOut: boolean = !error && data;

  if (loggedOut) router.push("/");
  if (error) return <Error text={"Error fetching course!"} />;

  return <Loading text={"Logging out..."} />;
}
