# keep
Back up your Urbit agents

## Architecture

Keep consists of two parts:

- An agent transformer in `keep/lib.hoon`, i.e. a function from an `agent:gall` to an `agent:gall`. It transforms a regular agent into one that can be backed up.
- An agent `%keep`, which stores backups passed to it, as well as controls the transformer on other agents, and stores settings/logs related to this, such as repeating backups, last time an agent was backed up and so on. Architecturally, many of these options would be much simpler to store in the transformer, but due to issues with middleware and agent transformers, we need to keep the transformer stateless. We hope that this can be changed in the future.

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

