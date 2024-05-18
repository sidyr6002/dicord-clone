import { useEffect, useState } from "react";

const useOrigin = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const origin = typeof window !== "undefined" &&
                    window.location.origin ? window.location.origin : null;

    if (!mounted) {
        return null;
    }

    return origin;
};

export default useOrigin;
