# Keep user stories

## Backup providers

As a backup provider, I would like to:

- Manually whitelist ships that can send me backups.
- Automatically whitelist ships that can send me backups, using an integration with gora and/or the bitcoin wallet.
- Rate limit how often each whitelisted ship can send me new backups, manually or automatically through gora/bitcoin integration.
- Toggle sending automatic instructions to any breached ships that I store backups on behalf of, to assist them in reinstalling and restoring their agents from my backups.
- Remove ships from the whitelist.
- See which pairs of ships and agents that I currently have stored backups for, ideally accompanied by their sizes.
- Remove existing backups.

## End users

As an end user, I would like to:

- Back up an agent to a remote ship where I am whitelisted.
- Back up an agent to a file in the host OS.
- Un/set automatic repeating backups for any combination of agent and remote ship/host OS.
- Request from a backup provider that should I ever breach in the future, they will automatically send me a DM with instructions on how to restore the agents whose states they store for me.
- Restore my agent's state from a backup on a remote ship.
- Restore an agent from a file in the host OS (requires working get directory).

Where applicable, all of these end user scenarios should also attempt to back up and restore any subscriptions that the agent has, though it should be noted that restoration cannot be guaranteed to succeed. In case of failure, I should be alerted of this, so that I can try to figure out how to initiate subscription by other means.
