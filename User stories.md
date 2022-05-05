# Keep user stories

As a backup provider, I would like to:

- Manually whitelist ships that can send me backups.
- Automatically whitelist ships that can send me backups, using an integration with gora and/or the bitcoin wallet.
- Rate limit how often each whitelisted ship can send new backups, manually or automatically through gora/bitcoin integration.
- Remove ships from the whitelist.
- See which pairs of ships and agents that I currently have stored backups for.
- Remove existing backups.

As an end user, I would like to:

- Back up an agent to a remote ship where I am whitelisted.
- Un/set automatic repeating backups for any combination of agent and remote ship.
- Restore my agent's state from a backup on a remote ship.
  - All of the above scenarios should also attempt to back up and restore any subscriptions, though restoration cannot be guaranteed to succeed. In case of failure, I should be alerted of this, so that I can try to figure out how to initiate subscription by other means.
- Back up an agent to a file in the host OS.
- Restore an agent from a file in the host OS (requires working get directory).