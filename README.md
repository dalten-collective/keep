# keep
Back up your Urbit

## Architecture

Keep consists of two parts:

- a wrapper, which is a function from an `agent:gall` to an `agent:gall`. It turns a regular agent into a keep-enriched agent, specifically it adds a few additional pokes, one subscription path and one scry.
- an agent `%keep`, which stores backups passed to it from keep-enriched agents on other ships, as well as keeps track of which agents on the same ship that are keep-enriched.

## Pokes

All actions are initiated by poking keep-enriched agents (i.e. **not** the `%keep` agent). To find out which agents that are keep-enriched, see the *Subscriptions* and *Scries* sections further down.

All keep-enriched agents can be poked with the mark `%keep` and support the following pokes:

```hoon
[%once to=(unit ship)]                 :: Backup
[%many to=(unit ship) freq=(unit @dr)] :: Repeat backup
[%mend from=ship]                      :: Initiate recovery
[%live live=?]                         :: (De)activate. Deact before uninstall!
```

These can also come in the form of JSON:

```json
{"once": "~sampel-palnet"}
{"once": null}
{"many": {"to": "~sampel", "freq": 500}}
{"many": {"to": "~palnet", "freq": null}}
{"many": {"to": null, "freq": 500}}
{"mend": "~sampel-palnet"}
{"live": true}
{"live": false}
```

- `%once`
  Trigger a single backup to the specified ship.
  If repeating backups are set for this ship, this resets the timer. If the ship is null, the backup will be written to the directory `pier/.urb/put/keep/[agent-name]`.
- `%many`
  Set or unset repeating backups to the specified ship (or to the `put` directory).

  The frequency is either null for unsetting, or the desired frequency in seconds for setting.

  If setting repeating backups and this agent **hasn't** been backed up to the specified ship before, this will trigger an immediate backup.

  If setting repeating backups and this agent **has** been backed up to the specified ship at time `t`, this will trigger a backup immediately or at time `t+freq`, whichever comes last.
- `%mend`
  Load a backup from the specified ship.
- `%live`
  Activate/deactivate the keep wrapper. Always initialized to false/deactivated.

  This *needs* to be set to false before the wrapper is removed from the source code of any keep-enriched agent. Otherwise the previously enriched agent will most likely crash, or worse exhibit unexpected behaviour, possibly corrupting its own state.

  When the wrapper is deactivated, the only available poke is to activate it again. However, subscribers will not be kicked, and new subscriptions will still be accepted.

## Browser upload

Whenever a wrapper has been activated with `%live`, it will serve a web page on `/apps/keep/[agent-name]/upload` through which it is possible to upload files which were backed up to the `put` directory.

## Subscriptions

All JSON objects sent from both the agent and wrappers will be on the form:

```json
{
  "type": <string>,
  "diff": <object>,
  "state": <object>
}
```

### The `%keep` agent

Subscribe to `/website` to get JSON objects specifying which keep-enriched agents that exist.

After initial subscription, you will receive:

```json
{
  "type": "initial",
  "diff": null,
  "state": {"agents": ["agent0", "agent1", "agent2"]}
}
```

Whenever a new agent becomes keep-enriched, you will receive:

```json
{
  "type": "agent",
  "diff": "agent3",
  "state": {"agents": ["agent0", "agent1", "agent2", "agent3"]}
}
```

**Note** that these agents are not guaranteed to stay keep-enriched. Because of the way Gall works, the agent `%keep` has no way of knowing when the wrapper is removed from an agent. You'll have to try subscribing/scrying and be prepared to handle failures.

### Keep-enriched agents

Subscribe to `/keep/website` to get JSON objects specifying new backups as well as the current settings. As a subscriber, you will receive:

#### After initial subscription

```json
{
  "type": "initial",
  "diff": null,
  "state":
    {
      "live": true,
      "saved": [
        {"ship": "~sampel", "time": 100},
        {"ship": "~palnet", "time": 1000}
      ],
      "auto": [
        {"ship": "~sampel", "freq": 500},
        {"ship": "~palnet", "freq": 5000}
      ],
      "pending": [
        {"ship": "~sampel", "status": "invite"},
        {"ship": "~palnet", "status": "restore"}
      ]
    }
}
```

- `saved` is an array of objects, each containing a ship and a unix timestamp, specifying when this agent was last backed up to each ship.
- `auto` is an array of objects, each containing a ship and a frequency in seconds, specifying how often we automatically back up to each ship, if at all.
- `pending` is an array of objects, each containing a ship and a status `"invite"` or `"restore"`. These are ships from which we currently await a response to a request to either keep our state or hand us an old state, respectively.

Note that if the wrapper is deactivated, its state **may disappear without notice** and no automatic backups will be performed, so if the second object contains any information, treat it as a historical record rather than current fact. We still provide it, and frontends may choose to simply discard it, or display parts of it to the user. Obviously any entries in `saved` will still be correct.

#### After state updates

```json
{
  "type": <one of "active" "saved" "auto" "pending" "restored">,
  "diff": <a new state row or a new value, depending on the type>,
  "state": <the new state>
}
```

A few examples:
```json
{
  "type": "saved",
  "diff": {"ship": null, "time": 555},
  "state": <...>
}
```

```json
{
  "type": "active",
  "diff": true,
  "state": <...>
}
```

```json
{
  "type": "restored",
  "diff": {"ship": "~sampel-palnet", "time": 600},
  "state": <...>
}
```

## Scries

Keep-enriched agents can be scried at `/keep/live/loob`. It will return a boolean, signifying whether the wrapper is active or not.

# Development Setup

You will need to create a fakezod and install the agent.  
Run `bin/setup.sh` in a separate process and follow the instructions there. No changes will be made on your behalf.

Once the agent is installed, proceed to setting up the interface (below).

# Interface

- Vue 3
- Typescript
- Vite (for proxying to the urbit web interface)
- NPM (for package management, handled by `bin` scripts)

## Setup

npm-wrapping scripts are provided in the `bin/` directory. Follow the steps below to set up your local development environment:

- `bin/install-js-dependencies.sh`
- Have your fakeship from above running. Note the web interface port (ie. `dojo> http: web interface live on http://localhost:8080`)
- Get your login code from the fakeship (`dojo> +code`)
- Copy `interface/.env.example` to `interface/.env` (not checked into git) and edit the port there to reflect the web interface on your fakeship.
- `bin/serve-interface.sh`
- (For running multiple ships in multiple vite instances, you can bypass the bin script and run npm directly from the repo root, passing the ENV variable for the ship's interface a-la: `KEEP_URBIT_TARGET='http://localhost:8081' npm run serve --prefix interface`)

The fakeship web interface should now be accessible at `http://localhost:3000` (provided by Vite). When you first visit the URL you should be prompted for your `+code` from above.

The Vue interface for this application will be served from `http://localhost:3000/apps/keep/` (**note the trailing slash!**)

