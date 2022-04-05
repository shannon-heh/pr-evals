import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// hook to manage Princeton CAS authentication
// example usage: const { isLoading, netID } = useCAS();
export default function useCAS() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [netID, setNetID] = useState("");
  const [isInstructor, setIsInstructor] = useState(false);

  useEffect(() => {
    const { ticket } = router.query;
    if (ticket === "" || ticket === null || ticket === undefined)
      setIsLoggedIn(false);
    (async function () {
      const res = await fetch(`/api/auth?ticket=${ticket}`);
      const data = await res.json();
      console.log(data);
      if (!("netid" in data && "isInstructor" in data)) {
        router.push("/");
        return;
      }
      setIsLoggedIn(true);
      setNetID(data["netid"]);
      setIsInstructor(data["isInstructor"]);
      if (router.pathname === "/") router.push("/dashboard");
    })();
  }, [router.query.ticket]);

  return {
    isLoggedIn: isLoggedIn,
    isLoading: isLoggedIn === null,
    netID: netID,
    isInstructor: isInstructor,
  };
}
