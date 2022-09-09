::  keep: backup manager
::
/-  *keep
/+  default-agent, dbug, *sane, agentio
::
|%
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  $:  %0
      kept=(map [dude ship] [data=noun time=@da])
      live=(set dude)
      able=(each (set ship) (set ship))
  ==
--
::
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
::
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
    whitelisted  |(?=(%| -.able) (~(has in p.able) src.bowl))
::
++  on-save  !>(state)
::
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  `this(state !<(state-0 old))
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  ?=(%keep-agent mark)
  =/  cmd  !<(agent:poke vase)
  ?-  -.cmd
  ::
  ::  "Subscribe to my stuff," said someone else's wrapper.
      %init
    ~|  %not-whitelisted
    ?>  whitelisted
    :_  this
    :_  ~
    %+  ~(watch pass:io /backups/(scot %p src.bowl)/[dap.cmd])
      [src.bowl dap.cmd]
    /keep/data/[key.cmd]
  ::
  ::  "Give me my stuff," said someone else's wrapper.
      %grab
    ~|  %not-whitelisted
    ?>  whitelisted
    :_  this
    :_  ~
    ~|  [%has-no dap.cmd from=src.bowl]
    %+  ~(poke pass:io /recoveries/(scot %p src.bowl)/[dap.cmd])
      [src.bowl dap.cmd]
    keep+!>([%data data:(~(got by kept) [dap.cmd src.bowl]) key.cmd])
  ::
  ::  "I exist," said a wrapper on our own ship.
      %tell
    ?>  =(src.bowl our.bowl)
    ?:  (~(has in live) dap.cmd)  `this
    =.  live  (~(put in live) dap.cmd)
    :_  this
    ~[(website-card 'agent' s+dap.cmd)]
  ::
  ::  "(De)whitelist this ship," said our operator.
      %able
    ?>  =(src.bowl our.bowl)
    ?-  +<.cmd
      %&  `this(p.able (~(put in p.able) p.cmd))
      %|  `this(p.able (~(del in p.able) p.cmd))
    ==
  ::
  ::  "(De)activate the whitelist," said our operator.
      %wyte
    ?>  =(src.bowl our.bowl)
    =*  res  `this(able [on.cmd p.able])
    ?:(on.cmd res res)
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ~|  %not-whitelisted
  ?>  whitelisted
  ?.  ?=([%backups term term ~] wire)  (on-agent:def wire sign)
  ?+  -.sign  (on-agent:def wire sign)
  ::
      %fact
    ~&  >  [%store-backup of=,.&3.wire from=src.bowl]
    ?.  ?=(%noun p.cage.sign)  `this
    =.  kept  (~(put by kept) [&3.wire src.bowl] !<(noun q.cage.sign) now.bowl)
    :_  this
    ~[(website-card 'backup' (json-backup now.bowl &3.wire src.bowl))]
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(src.bowl our.bowl)
  ?.  ?=([%website ~] path)  (on-watch:def path)
  :_  this
  ~[(website-card 'initial' ~)]
::
++  on-init   on-init:def
++  on-peek   on-peek:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
::
|%
++  website-card
  |=  [event=@t diff=json]
  ^-  card
  =,  enjs:format
    :*  %give  %fact  ~[/website]  %json
      !>  %-  pairs
      :~  [%type s+event]
          [%diff diff]
          :-  %state
          %-  pairs
          :~
            ['agents' a+(turn ~(tap in live) (lead %s))]
            :-  'backups'
            a+(turn ~(tap by kept) |=([to=[@ @p] [* =@da]] (json-backup da to)))
            :-  'whitelist'
            (pairs ~[['on' b/-.able] ['in' a/(turn ~(tap in p.able) ship)]])
  ==  ==  ==
::
++  json-backup
  |=  [=@da =dude =@p]
  ^-  json
  =,  enjs:format
  (pairs ~[ship+(ship p) agent+s+dude time+(sect da)])
--
