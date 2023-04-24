import { useEffect } from "react";
import { useRouter } from "next/router";
import cookies from "js-cookie";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        cookies.remove("token");
        router.push("/login");
    }, []);

    return null;
}
