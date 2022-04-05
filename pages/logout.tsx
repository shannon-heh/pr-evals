import { useRouter } from "next/router";
import Loading from "../components/Loading";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    (async function () {
      await fetch(`/api/logout`);
      await router.push("/");
    })();
  }, []);

  return <Loading text={"Logging out..."} />;
}
