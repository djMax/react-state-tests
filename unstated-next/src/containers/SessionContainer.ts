import * as React from "react";
import { createContainer } from "unstated-next";
import { createSession } from "../asnycThings";
import { TinyEmitter } from "tiny-emitter";
import { ThingContainer } from "./ThingContainer";
import { UuidContainer } from "./UuidContainer";
import { LocationContainer } from "./LocationContainer";
import { LoadStatus, ThingType } from "./types";

// This container needs to wait for the other two to be ready
function useSession() {
  const thingContainer = ThingContainer.useContainer();
  const uuidContainer = UuidContainer.useContainer();
  const locationContainer = LocationContainer.useContainer();
  const [status, setStatus] = React.useState(LoadStatus.None);
  const [session, setSession] = React.useState(false);
  const loader = React.useRef<Promise<boolean>>();
  const [eventSink, setEventSink] = React.useState<TinyEmitter>();

  React.useEffect(() => {
    if (uuidContainer.status === LoadStatus.Loaded && locationContainer.status === LoadStatus.Loaded && status === LoadStatus.None) {
      // Let's get going
      if (!loader.current) {
        const newEmitter = new TinyEmitter();
        setEventSink(newEmitter);
        loader.current = createSession(newEmitter, uuidContainer.uuid, locationContainer.location);
      }
      setStatus(LoadStatus.Loading);
    } else if (status === LoadStatus.Loading) {
      let iamTheOne = true;
      loader.current?.then(newSession => {
        if (iamTheOne) {
          setSession(newSession);
          setEventSink(undefined);
          setStatus(LoadStatus.Loaded);
        }
      });
      return () => {
        iamTheOne = false;
      };
    }
  }, [uuidContainer, locationContainer, thingContainer, status]);

  React.useEffect(() => {
    if (eventSink) {
      const handler = (k: ThingType, v: any) => {
        thingContainer.setThing(k, v);
      };
      eventSink.on('data', handler);
      return () => { eventSink.off('data', handler); };
    }
  }, [status, eventSink, thingContainer])
  return { session, status };
}

export const SessionContainer = createContainer(useSession);
