<template>
  <v-card
    class="tw-grow tw-p-4 tw-bg-white tw-border tw-border-secondary tw-rounded"
  >
    <div class="tw-flex tw-flex-row tw-my-8">
      <v-card-text class="tw-w-1/2">
        <div class="tw-flex tw-flex-row tw-items-center tw-justify-center">


          <div class="tw-flex tw-flex-col tw-w-full sm:tw-w-3/5">

            <div class="mt-4">
              <h1 class="tw-text-3xl tw-mb-6">About</h1>
              <p>
                %keep is a tool for backing up and restoring the data in your gall agents/apps. This is particularly useful across breaches: restore your %pals, %gora and anything else you loved on your ship before it sunk.
              </p>
              <p class="tw-mt-2 tw-border-l-2 tw-pl-2 tw-border-info">
                For now, there is a small, manual change required in agent hoon source code which might make %keep difficult to get going for the average user. We hope to automate this last bit soon.<br/>
                Get in touch if you have questions.
              </p>

              <h2 class="tw-text-2xl tw-my-4">Preparing Agents</h2>

              <p>
                Before backing up agents, they'll need to be prepared for %keep. The technical explanation of this is farther below.
              </p>
              <p class="tw-my-2">
                In the <span class="tw-text-info tw-font-bold">INACTIVE AGENTS</span> tab you'll find desks you have installed on your ship and agents that are ready to be activated for backup.<br/>
                Clicking the <span class="tw-text-info tw-font-bold">PREPARE</span> button for a desk will copy the relevant dependencies and keep them up-to-date.
              </p>
              <p class="tw-my-2">
                Once prepared, an agent's app file needs to be modified (see below). When this is done, the agent will appear under "Inactive Agents" with an <span class="tw-text-info tw-font-bold">ACTIVATE</span> button. Click this to send it to the <span class="tw-text-info tw-font-bold">ACTIVE AGENTS</span> tab.
              </p>


              <h2 class="tw-text-2xl tw-my-4">Backup</h2>

              <p class="tw-my-2">
                The <span class="tw-text-info tw-font-bold">ACTIVE AGENTS</span> tab lists all agents that are ready for backup. Backups can be done one time or on a schedule.
              </p>

              <h3 class="tw-text-xl tw-my-4">Local Disk</h3>

              <p class="tw-my-2">
                On the 
                <v-chip
                  variant="outlined"
                  label
                  color="info"
                  class="mr-2"
                >
                  <span class="mr-2 tw-font-mono">Local Disk</span>
                </v-chip>
                line click <span class="tw-text-info tw-font-bold">BACKUP</span> to view the details for this agent. In this window the <span class="tw-text-info tw-font-bold">BACKUP TO DISK</span> button will initiate a single backup to the filesystem of your pier.<br/>
                You'll find a <span class="tw-font-mono">.jam</span> file, named by date, in your pier's <span class="tw-font-mono">.urb/put/keep/{{ agentName }}</span> folder.
              </p>
              <p>
                You can enter a frequency and click <span class="tw-text-info tw-font-bold">SET RECURRING DISK BACKUP</span> to have %keep save your agent state on a schedule. (Note: upon setting this frequency, a single backup will first happen immediately.)
              </p>

              <h3 class="tw-text-lg tw-my-4">Restore from File</h3>

              <p class="tw-my-2">
                When you click <span class="tw-text-info tw-font-bold">RESTORE</span> a browser tab will be opened to a new page. Here you can choose a <span class="tw-font-mono">.jam</span> file and upload it to restore the agent state to the contents of that file.
              </p>
              <p class="tw-my-2">
                <span class="tw-font-bold">Careful!</span> The agent's state will be entirely replaced with the backed-up version.
              </p>

              <h3 class="tw-text-xl tw-my-4">Backing Up to a Remote Provider</h3>

              <p>
                Other ships on the network can hold backups for you. Similarly, you can be a backup provider for others. Providers will find these details in the <span class="tw-text-info tw-font-bold">HOLDING BACKUPS</span> tab.
              </p>

              <h2 class="tw-text-lg tw-my-4">Whitelist</h2>

              <p>
                The whitelist controls which ships you'll allow to store backups with you. It is ON by default. If you turn the whitelist OFF completely, <span class="tw-font-bold">anyone with %keep installed will be able to send backups to your ship!</span>.
              </p>
              <p>
                If you wish to be a backup provider, add ships to the whitelist to allow them to send you backups.
              </p>

              <p class="tw-my-2">
                Once remote ships have begun sending you backups, you'll see them below the whitelist. Included will be which agents they are storing with you and when the last backups occurred.
              </p>

              <h2 class="tw-text-lg tw-my-4">Sending Backups to a Remote Provider</h2>

              <p class="tw-my-2">
                In the <span class="tw-text-info tw-font-bold">ACTIVE AGENTS</span> tab, use the <span class="tw-text-info tw-font-bold">ADD BACKUP TARGET</span> button to declare which ship you'd like to backup with. Assuming they have whitelisted you, an initial backup will be sent and you'll find them listed under "Live backup targets".
              </p>
              <p class="tw-my-2">
                The single/recurring backup process works the same as with Local Disk. <span class="tw-text-info tw-font-bold">RESTORE</span> will fetch the most recent backup from them and the agent's state will be restored to it.
              </p>

              <h2 class="tw-text-3xl tw-my-4">Help</h2>

              <p>
                You can find us at <span class="tw-font-mono">~mister-hilper-dozzod-dalten/quartus</span>
              </p>

              <v-divider class="tw-my-4"/>

              <h3 class="tw-text-xl tw-mt-6 tw-mb-4">The Technical Bits</h3>
              <p class="tw-my-2">
                Most users can ignore this section.
              </p>
              <p>
                %keep works by "wrapping" gall agents, similar to how <span class="tw-font-mono">dbug</span> works. The wrapper steps in front of some pokes and other agent activities and possibly modifies them before passing them along.
              </p>
              <p>The upshot of this is that it mostly doesn't matter how the original app developer built their product: as a pilot armed with %keep, you can dictate that their app shall be one that can be backed up the way you desire. It is your computer and they are your apps, after all...
              </p>
              <p class="tw-my-2">
                In order for an agent to be considered "keep-wrapped", its desk must include a handful of %keep dependencies. Once those dependencies are in place (the "Prepare" bit, above), they must be imported in the agent's app file:
<pre class="tw-my-2">
::  Any other /- or /+ runes above the following line
/=  keep  /keep/lib
</pre>

                And then the wrapper must be applied:

<pre class="tw-my-2">
%-  agent:keep
:: Any other wrappers below, like:
:: %-  agent:dbug
</pre>

                Once these two changes are made and the desk is <span class="tw-font-mono">|commit</span>ed, the agent is <span class="tw-font-bold">wrapped</span> and ready to be activated.


              </p>
            </div>

          </div>

        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {};
</script>
