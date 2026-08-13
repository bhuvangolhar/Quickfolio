import { useEffect, useState } from "react";
import Home from "./Home";

export default function Admin() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("adminToken") || localStorage.getItem("token"));
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (!token) {
      setIsAuthorized(false);
    }
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center text-cyan-400 font-mono text-sm">
        Access Denied: Authentication required.
      </div>
    );
  }

  return <Home adminMode={true} />;
}