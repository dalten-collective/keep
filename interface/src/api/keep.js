import urbitAPI from "./urbitAPI"

export default {
  test() {
    urbitAPI.poke({
      app: "keep",
      mark: "keep",
      json: {
        "once": {
          "to": "~sum"
        }
      }
    });
  }
}
