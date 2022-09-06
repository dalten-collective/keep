import urbitAPI from "./urbitAPI";
import { Scry } from "@urbit/http-api";
import {
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
} from "@/types";

export function siggedShip(ship) {
  if (ship[0] === "~") {
    return ship;
  }
  return `~${ship}`;
}

export function activate(agentName: string) {
  return urbitAPI
    .poke({
      app: agentName,
      mark: "keep",
      json: {
        live: true,
      },
    })
    .then((r) => {
      console.log("res ", r);
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
    });
}

export function deactivate(agentName: string) {
  return urbitAPI
    .poke({
      app: agentName,
      mark: "keep",
      json: {
        live: false,
      },
    })
    .then((r) => {
      console.log("res ", r);
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
    });
}

export function scry(scry: Scry) {
  return urbitAPI
    .scry(scry)
    .then((r) => {
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });
}

export function testOnce(payload: OnceRequest): Promise<any> {
  // gets data: { pending: { status: "invite", ship: "sum" } }
  return urbitAPI
    .poke({
      app: payload.agentName,
      mark: "keep",
      json: { once: siggedShip(payload.ship) },
    })
    .then((r) => {
      console.log("res ", r);
      return r;
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      throw e.response;
    });
}

export function testMany(payload: ManyRequest) {
  // gets data: { pending: { status: "invite", ship: "sum" } }
  return urbitAPI
    .poke({
      app: payload.agentName,
      mark: "keep",
      json: {
        many: {
          to: siggedShip(payload.ship),
          freq: payload.freq,
        },
      },
    })
    .then((r) => {
      console.log("res ", r);
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
    });
}

export function testUnsetMany(payload: UnsetManyRequest) {
  // gets data: { pending: { status: "invite", ship: "sum" } }
  return urbitAPI
    .poke({
      app: payload.agentName,
      mark: "keep",
      json: {
        many: {
          to: siggedShip(payload.ship),
          freq: payload.freq,
        },
      },
    })
    .then((r) => {
      console.log("res ", r);
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
    });
}

export function mendFromShip(payload: RestoreRequest) {
  return urbitAPI
    .poke({
      app: payload.agentName,
      mark: "keep",
      json: {
        mend: {
          ship: siggedShip(payload.ship),
        },
      },
    })
    .then((r) => {
      console.log("res ", r);
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
    });
}

export function testRestore(payload: RestoreRequest) {
  return urbitAPI
    .poke({
      app: payload.agentName,
      mark: "keep",
      json: { mend: siggedShip(payload.ship) },
    })
    .then((r) => {
      console.log("res ", r);
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
    });
}
