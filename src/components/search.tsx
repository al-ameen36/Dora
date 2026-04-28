import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchArea() {
  return (
    <Field>
      <ButtonGroup>
        <Input
          id="input-button-group"
          placeholder="Type to search..."
          style={{ borderRadius: "3px 0 0 3px !important" }}
        />
        <Button
          variant="outline"
          style={{ borderRadius: "0 3px 3px 0px !important" }}
        >
          <Search />
        </Button>
      </ButtonGroup>
    </Field>
  );
}
