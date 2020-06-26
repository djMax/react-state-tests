import * as React from "react";
import { createContainer } from "unstated-next";
import { ThingType } from "./types";

function useThings() {
  const [thing1, setThing1] = React.useState("");
  const [thing2, setThing2] = React.useState("");
  const [thing3, setThing3] = React.useState("");
  const setters = { thing1: setThing1, thing2: setThing2, thing3: setThing3 };
  return {
    thing1,
    thing2,
    thing3,
    setThing(field: ThingType, value: string) {
      setters[field](value);
    }
  };
}

export const ThingContainer = createContainer(useThings);
