import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function PrivatePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

            if (!decodedToken || !decodedToken.id) {
                throw new Error("Invalid token");
            }

            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Private Page</h1>
            <p>This page can only be accessed by authenticated users.</p>
        </div>
    );
}
