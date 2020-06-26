import * as React from "react";
import { createContainer } from "unstated-next";
import { getLocation } from "../asnycThings";
import { LoadStatus, GeoLocation } from "./types";

function useLocation() {
  const [status, setStatus] = React.useState(LoadStatus.None);
  const [location, setLocation] = React.useState<GeoLocation>();
  const loader = React.useRef<Promise<GeoLocation>>();

  React.useEffect(() => {
    if (status === LoadStatus.None) {
      if (!loader.current) {
        loader.current = getLocation();
      }
      setStatus(LoadStatus.Loading);
    } else if (status === LoadStatus.Loading) {
      let iamTheOne = true;
      loader.current?.then(newLocation => {
        if (iamTheOne) {
          setLocation(newLocation);
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
    location,
  };
}

export const LocationContainer = createContainer(useLocation);
