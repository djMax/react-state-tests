import * as React from "react";
import {
  UuidContainer,
  LoadStatus,
  LocationContainer,
  SessionContainer,
  ThingContainer
} from "./Containers";
import "./styles.css";

function App() {
  const uuidContainer = UuidContainer.useContainer();
  const locationContainer = LocationContainer.useContainer();
  const sessionContainer = SessionContainer.useContainer();
  const thingContainer = ThingContainer.useContainer();

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <p>
        UUID Status: {LoadStatus[uuidContainer.status]} - {uuidContainer.uuid}
      </p>
      <p>
        Location Status: {LoadStatus[locationContainer.status]} -{" "}
        {locationContainer.location &&
          JSON.stringify(locationContainer.location)}
      </p>
      <p>
        Session Status: {LoadStatus[sessionContainer.status]} -{" "}
        {sessionContainer.session ? "Created" : "Empty"}
      </p>
      <p>Thing 1: {thingContainer.thing1}</p>
      <p>Thing 2: {thingContainer.thing2}</p>
      <p>Thing 3: {thingContainer.thing3}</p>
    </div>
  );
}

export default () => (
  <UuidContainer.Provider>
    <LocationContainer.Provider>
      <ThingContainer.Provider>
        <SessionContainer.Provider>
          <App />
        </SessionContainer.Provider>
      </ThingContainer.Provider>
    </LocationContainer.Provider>
  </UuidContainer.Provider>
);
