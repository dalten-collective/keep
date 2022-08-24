import urbitAPI from "./urbitAPI";
import { Scry } from "@urbit/http-api";
import {
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
} from "@/types";

function siggedShip(ship) {
  if (ship[0] === '~') {
    return ship
  }
  return `~${ ship }`
}

export default {
  activate(agentName: string) {
    urbitAPI
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
  },

  deactivate(agentName: string) {
    urbitAPI
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
  },

  scry(scry: Scry) {
    urbitAPI
      .scry(scry)
      .then((r) => {
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
  },

  testOnce(payload: OnceRequest) {
    // gets data: { pending: { status: "invite", ship: "sum" } }

    urbitAPI
      .poke({
        app: payload.agentName,
        mark: "keep",
        json: { once: siggedShip(payload.ship) },
      })
      .then((r) => {
        console.log("res ", r);
      })
      .catch((e) => {
        // TODO: 'e' is undefined
        console.log("err ", e);
      });
  },

  testMany(payload: ManyRequest) {
    // gets data: { pending: { status: "invite", ship: "sum" } }
    urbitAPI
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
  },

  testUnsetMany(payload: UnsetManyRequest) {
    // gets data: { pending: { status: "invite", ship: "sum" } }
    urbitAPI
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
  },

  mendFromShip(payload: RestoreRequest) {
    urbitAPI
      .poke({
        app: payload.agentName,
        mark: "keep",
        json: {
          mend: {
            ship: siggedShip(payload.ship)
          }
        },
      })
      .then((r) => {
        console.log("res ", r);
      })
      .catch((e) => {
        // TODO: 'e' is undefined
        console.log("err ", e);
      });
  },

  testRestore(payload: RestoreRequest) {
    urbitAPI
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
  },
};
