import urbitAPI from "./urbitAPI";

export default {
  testBackup() {
    urbitAPI.poke({
      app: "gora",
      mark: "keep",
      json: {
        once: {
          to: "~sum",
        },
      },
    });
  },
  testRestore() {
    urbitAPI.poke({
      app: "gora",
      mark: "keep",
      json: {
        mend: {
          from: "~sum",
        },
      },
    });
  },
};
