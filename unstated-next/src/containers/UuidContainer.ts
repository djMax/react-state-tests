import * as React from "react";
import { createContainer } from "unstated-next";
import { getUuid } from "../asnycThings";
import { LoadStatus } from "./types";

function useGuid() {
  const [status, setStatus] = React.useState(LoadStatus.None);
  const [uuid, setUuid] = React.useState<string>('');
  const loader = React.useRef<Promise<string>>();

  React.useEffect(() => {
    if (status === LoadStatus.None) {
      if (!loader.current) {
        loader.current = getUuid();
      }
      setStatus(LoadStatus.Loading);
    } else if (status === LoadStatus.Loading) {
      let iamTheOne = true;
      loader.current?.then(newUuid => {
        if (iamTheOne) {
          setUuid(newUuid);
          setStatus(LoadStatus.Loaded);
        }
      });
      return () => {
        iamTheOne = false;
      };
    }
  }, [status]);

  return {
    status,
    uuid,
  };
}

export const UuidContainer = createContainer(useGuid);
