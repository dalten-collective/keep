import urbitAPI from "./urbitAPI";
import { Scry } from "@urbit/http-api";

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

  testBackup(payload: { agentName: string; ship: string }) {
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

  testRestore(payload: { agentName: string; ship: string }) {
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
