import { SearchArea } from "./search";
import { Breadcrumbs } from "./breadcrumbs";
import ActionsBar from "./actions-bar";

export default function Header() {
  return (
    <header className={"duration-300 px-4"}>
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
