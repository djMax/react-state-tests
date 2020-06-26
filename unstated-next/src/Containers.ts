import * as React from "react";
import { createContainer } from "unstated-next";
import { getUuid, getLocation, createSession } from "./asnycThings";
import { TinyEmitter } from "tiny-emitter";

export enum LoadStatus {
  None,
  Loading,
  Loaded
}

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

interface GeoLocation {
  lat: number,
  lng: number,
} 

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

function useThings() {
  const [thing1, setThing1] = React.useState('');
  const [thing2, setThing2] = React.useState('');
  const [thing3, setThing3] = React.useState('');
  const setters = { thing1: setThing1, thing2: setThing2, thing3: setThing3 };
  return { 
    thing1, 
    thing2, 
    thing3, 
    setValue(field: 'thing1' | 'thing2' | 'thing3', value: string) {
      setters[field](value);
    }}
}

export const ThingContainer = createContainer(useThings);

// This container needs to wait for the other two to be ready
function useSession() {
  const thingContainer = ThingContainer.useContainer();
  const uuidContainer = UuidContainer.useContainer();
  const locationContainer = LocationContainer.useContainer();
  const [status, setStatus] = React.useState(LoadStatus.None);
  const [session, setSession] = React.useState(false);
  const loader = React.useRef<Promise<boolean>>();
  const eventSink = React.useRef(new TinyEmitter());

  const updater = React.useMemo(() => (field: 'thing1' | 'thing2' | 'thing3', value: string) => {
    thingContainer.setValue(field, value);
  }, [thingContainer])

  React.useEffect(() => {
    if (uuidContainer.status === LoadStatus.Loaded && locationContainer.status === LoadStatus.Loaded && status === LoadStatus.None) {
      // Let's get going
      if (!loader.current) {
        loader.current = createSession(eventSink.current, uuidContainer.uuid, locationContainer.location);
      }
      setStatus(LoadStatus.Loading);
    } else if (status === LoadStatus.Loading) {
      let iamTheOne = true;
      const sink = eventSink.current;
      sink.on('data', updater);
      loader.current?.then(newSession => {
        if (iamTheOne) {
          setSession(newSession);
          setStatus(LoadStatus.Loaded);
        }
      });
      return () => {
        iamTheOne = false;
        sink.off('data', updater);
      };
    }
  }, [uuidContainer, locationContainer, thingContainer, updater, status]);

  return { session, status };
}

export const SessionContainer = createContainer(useSession);
