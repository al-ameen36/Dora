import { cn } from "@/lib/utils";
import { SearchArea } from "./search";
import { Breadcrumbs } from "./breadcrumbs";
import { useEffect, useState } from "react";
import ActionsBar from "./actions-bar";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 px-4",
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b shadow-xs py-4 rounded-xs"
          : "bg-transparent border-b-transparent py-4",
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
        <div className="w-100">
          <SearchArea />
        </div>
      </div>

      <nav className="flex items-center justify-between mt-4 h-[20px]">
        <Breadcrumbs />
      </nav>

      <ActionsBar />
    </header>
  );
}
