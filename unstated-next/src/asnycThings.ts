import { v4 as uuid } from "uuid";
import { TinyEmitter } from "tiny-emitter";

export async function getUuid(): Promise<string> {
  return new Promise(accept => {
    setTimeout(() => accept(uuid()), Math.random() * 4000 + 1000);
  });
}

export async function getLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise(accept => {
    setTimeout(() => accept({ lat: 12, lng: 34 }), Math.random() * 4000 + 1000);
  });
}

export async function createSession(
  eventSink: TinyEmitter,
  uuid: string,
  location: any
): Promise<boolean> {
  if (!uuid || !location) {
    throw new Error("Missing data for session!");
  }
  setTimeout(() => eventSink.emit("data", "thing1", "value1"), 600);
  setTimeout(() => eventSink.emit("data", "thing2", "value2"), 1200);
  setTimeout(() => eventSink.emit("data", "thing3", "value3"), 1800);
  return new Promise(accept => {
    setTimeout(() => accept(true), Math.random() * 4000 + 3000);
  });
}
