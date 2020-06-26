import * as React from "react";
import {
  UuidContainer,
  LoadStatus,
  LocationContainer,
  SessionContainer,
  ThingContainer
} from "./containers";
import "./styles.css";

function App() {
  const uuidContainer = UuidContainer.useContainer();
  const locationContainer = LocationContainer.useContainer();
  const sessionContainer = SessionContainer.useContainer();
  const thingContainer = ThingContainer.useContainer();

  return (
    <div className="App">
      <h1>React State Management</h1>
      <p>
        State management in React(-native) is hard. Maybe it's just me. But I
        don't think it is. The standard ToDo List example is deceptively simple.
        I want a more realistic example, based on a problem I encountered
        building an app. The setup is we have a flow:
      </p>

      <ol>
        <li>A UUID must be generated (this is an async operation)</li>
        <li>User location must be obtained (this is an async operation)</li>
        <li>
          A network call to "create a session" must be made, and it requires the
          UUID and the location
        </li>
        <li>
          That network call STREAMS results back, and the individual messages
          must update other state items as they arrive.
        </li>
      </ol>
      <hr />
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
