import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { fetcher } from "../src/Helpers";

export default function Logout() {
  const router = useRouter();
  const { data, error } = useSWR("/api/logout", fetcher);
  const loggedOut: boolean = !error && data;

  if (loggedOut) {
    router.push("/").then(() => {
      router.reload();
    });
  }
  if (error) return <Error text="Error in logging out!" />;

  return <Loading text={"Logging out..."} />;
}
