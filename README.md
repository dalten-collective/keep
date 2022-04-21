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
[%once to=ship]                 :: Backup
[%many to=ship freq=(unit @dr)] :: Repeat backup
[%mend from=ship]               :: Initiate recovery
[%live live=?]                  :: (De)activate. Deact before uninstall!
```

These can also come in the form of JSON:

```json
{"once": "~sampel-palnet"}
{"many": {"to": "~sampel", "freq": 500}}
{"many": {"to": "~palnet", "freq": null}}
{"mend": "~sampel-palnet"}
{"live": true}
{"live": false}
```

- `%once`
  Trigger a single backup to the specified ship.
  If repeating backups are set for this ship, this resets the timer.
- `%many`
  Set or unset repeating backups to the specified ship.

  The frequency is either null for unsetting, or the desired frequency in seconds for setting.

  If setting repeating backups and this agent **hasn't** been backed up to the specified ship before, this will trigger an immediate backup.

  If setting repeating backups and this agent **has** been backed up to the specified ship at time `t`, this will trigger a backup immediately or at time `t+freq`, whichever comes last.
- `%mend`
  Load a backup from the specified ship.
- `%live`
  Activate/deactivate the keep wrapper. Always initialized to false/deactivated.

  This *needs* to be set to false before the wrapper is removed from the source code of any keep-enriched agent. Otherwise the previously enriched agent will most likely crash, or worse exhibit unexpected behaviour, possibly corrupting its own state.

  When the wrapper is deactivated, the only available poke is to activate it again. However, subscribers will not be kicked, and new subscriptions will still be accepted.

## Subscriptions

### The `%keep` agent

Subscribe to `/website` to get JSON objects specifying which keep-enriched agents that exist.

After initial subscription, you will receive:

```json
{"agents": ["agent0", "agent1", "agent2"]}
```

Whenever a new keep-enriched agent is activated, you will receive:

```json
{"join": "agent3"}
```

Whenever a keep-enriched agent is deactivated, you will receive:

```json
{"quit": "agent1"}
```

### Keep-enriched agents

Subscribe to `/keep/website` to get JSON objects specifying new backups as well as the current settings. As a subscriber, you will receive:

#### After initial subscription

You will receive two objects. One tells you whether the wrapper is active or not:

```json
{"active": false}
```

The other contains the current state:

```json
{
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
```

- `saved` is an array of objects, each containing a ship and a unix timestamp, specifying when this agent was last backed up to each ship.
- `auto` is an array of objects, each containing a ship and a frequency in seconds, specifying how often we automatically back up to each ship, if at all.
- `pending` is an array of objects, each containing a ship and a status `"invite"` or `"restore"`. These are ships from which we currently await a response to a request to either keep our state or hand us an old state, respectively.

Note that if the wrapper is deactivated, its state **may disappear without notice** and no automatic backups will be performed, so if the second object contains any information, treat it as a historical record rather than current fact. We still provide it, and frontends may choose to simply discard it, or display parts of it to the user. Obviously any entries in `saved` will still be correct.

#### After a successful backup

```json
{"saved": {"ship": "~sampel-palnet", "time": 555}}
```

This has exactly the same format as the `"saved"` entry in the initial json object, except that it will not be an array but only a single object.

#### After successfully (un)setting automatic backups

```json
{"auto": {"ship": "~sampel-palnet", "freq": 1000}}
```

Again, this has the same format as the `"auto"` entry in the initial json object, except that it's a single entry. Additionally, the frequency may be `null`, meaning that automatic backups were turned off.

#### After initialized backup/restoration

```json
{"pending": {"ship": "~sampel-palnet", "status": "invite"}}
```

This has the same format as the `"pending"` entry in the initial json object, except that it's a single entry.

#### After successful restoration

```json
{"restored": {"ship": "~sampel-palnet", "time": 600}}
```

This means that at unix time `600`, the state was restored using the backup kept by `~sampel-palnet`.

#### After successful (de)activation

You will receive the same two objects as when initially subscribing, with the exception that if the wrapper was deactivated, you will not receive the object containing the current state.

## Scries

Keep-enriched agents can be scried at `/keep/live/loob`. It will return a boolean, signifying whether the wrapper is active or not.
