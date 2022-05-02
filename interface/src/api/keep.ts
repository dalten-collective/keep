import urbitAPI from "./urbitAPI";
import { Scry } from "@urbit/http-api";
import { OnceRequest, ManyRequest, UnsetManyRequest, RestoreRequest } from "@/types";

export default {
  activate(agentName: string) {
    urbitAPI.poke({
      app: agentName,
      mark: "keep",
      json: {
        live: true,
      },
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
        json: { once: payload.ship },
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
            to: payload.ship,
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
            to: payload.ship,
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


  testRestore(payload: RestoreRequest) {
    urbitAPI
      .poke({
        app: payload.agentName,
        mark: "keep",
        json: { mend: payload.ship },
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
