import { SearchArea } from "./search";
import { Breadcrumbs } from "./breadcrumbs";
import ActionsBar from "./actions-bar";

export default function Header() {
  return (
    <header>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
      </div>

      <nav className="flex items-center justify-between mt-4 h-[20px]">
        <Breadcrumbs />
        <div className="w-80">
          <SearchArea />
        </div>
      </nav>

      <ActionsBar />
    </header>
  );
}
