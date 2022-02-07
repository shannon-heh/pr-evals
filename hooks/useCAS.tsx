import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function useCAS() {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const [ticket, setTicket] = useState("");
  const { data, error } = useSWR(
    ticket ? `/api/auth?ticket=${ticket}` : "/api/auth",
    fetcher
  );
  const isLoggedIn = !error && data && "netid" in data;

  useEffect(() => {
    const { ticket } = router.query;
    setTicket(ticket as string);
    if (data && !isLoggedIn && router.pathname != "/") router.push("/");
  });

  return {
    isLoggedIn: isLoggedIn,
    isLoading: !data,
    netID: isLoggedIn ? data["netid"] : "",
  };
}
