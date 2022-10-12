import urbitAPI from "./urbitAPI";
import { Scry } from "@urbit/http-api";
import {
  OnceRequest,
  MendPoke,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
  LocalBackupRequest,
  LocalManyRequest,
  WytePokePayload,
  WytePoke,
  CopyDepsPoke,
  WyteAblePoke,
  BackupPayload,
  Ship,
  BackupPoke,
  ManyPayload,
  ManyPoke,
  MendPayload,
  AgentName,
} from "@/types";

export function siggedShip(ship: string) {
  if (ship[0] === "~") {
    return ship;
  }
  return `~${ship}`;
}

export function pokeWyteOn() {
  const poke: WytePoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: {
      wyte: true
    },
  }
  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r;
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      return e
    });
}

export function pokeWyteOff() {
  const poke: WytePoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: {
      wyte: false
    }
  }

  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r;
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      return e
    });
}

export function pokeWyteAble(ship: Ship) {
  const poke: WyteAblePoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: {
      able: {
        able: true,
        ship: siggedShip(ship)
      }
    }
  }

  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r;
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      throw e
      // return 'error'
    });
}

export function pokeWyteDisable(ship: Ship) {
  const poke: WyteAblePoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: {
      able: {
        able: false,
        ship: siggedShip(ship)
      }
    }
  }

  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r;
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      throw e
      // return 'error'
    });
}

export function pokeCopyDeps(payload: CopyDepsPayload) {
  const poke: CopyDepsPoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: payload,
  }
  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r;
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      return e
    });
}


export function pokeOnce(payload: BackupPayload): Promise<any> {
  // gets data: { pending: { status: "invite", ship: "sum" } }
  const poke: BackupPoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: payload
  }

  return urbitAPI
    .poke(poke)
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

export function pokeMany(payload: ManyPayload) {
  const poke: ManyPoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: payload,
  }

  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      return e
    });
}

export function pokeUnsetMany(payload: UnsetManyRequest) {
  // gets data: { pending: { status: "invite", ship: "sum" } }
  const poke: ManyPoke = {
    app: 'keep',
    mark: 'keep-agent',
    json: payload,
  }

  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      return e
    });
}

export function mendFromShip(request: { payload: MendPayload, agentName: AgentName }) {
  const poke: MendPoke = {
    app: request.agentName,
    mark: "keep",
    json: request.payload,
  }
  return urbitAPI
    .poke(poke)
    .then((r) => {
      console.log("res ", r);
      return r
    })
    .catch((e) => {
      // TODO: 'e' is undefined
      console.log("err ", e);
      return e
    });
}

export function scry(scry: Scry) {
  return urbitAPI
    .scry(scry)
    .then((r) => {
      console.log(r);
      return r
    })
    .catch((e) => {
      console.log(e);
      throw e
    });
}
