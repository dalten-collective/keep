import urbitAPI from "./urbitAPI";

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

  testBackup(agentName: string) {
    urbitAPI.poke({
      app: agentName,
      mark: "keep",
      json: {
        once: {
          to: "~sum",
        },
      },
    });
  },
  testRestore(agentName: string) {
    urbitAPI.poke({
      app: agentName,
      mark: "keep",
      json: {
        mend: {
          from: "~sum",
        },
      },
    });
  },
};
