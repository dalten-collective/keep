import urbitAPI from "./urbitAPI";

export default {
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
