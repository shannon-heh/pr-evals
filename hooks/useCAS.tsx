import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

// hook to manage Princeton CAS authentication
// example usage: const { isLoading, netID } = useCAS();
export default function useCAS() {
  const router = useRouter();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const [ticket, setTicket] = useState("");
  // call /api/auth endpoint to verify ticket, exchange for a netID,
  // save that netID, and create a user if necessary
  const { data, error } = useSWR(
    ticket ? `/api/auth?ticket=${ticket}` : "/api/auth",
    fetcher
  );

  const isLoggedIn =
    !error && data && "netid" in data && "isInstructor" in data;

  // extract ticket from URL (passed by CAS server)
  useEffect(() => {
    const { ticket } = router.query;
    setTicket(ticket as string);
    if (data && !isLoggedIn && router.pathname != "/") router.push("/");
  });

  return {
    isLoggedIn: isLoggedIn,
    isLoading: !data,
    netID: isLoggedIn ? data["netid"] : "",
    isInstructor: isLoggedIn ? data["isInstructor"] : false,
  };
}
