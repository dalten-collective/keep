::  keep: backup manager
::
/-  *keep
/+  default-agent, dbug
::
|%
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  $:  %0
      kept=(map [dude ship] noun)
  ==
--
::
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
::
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
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
  ?>  (team:title [src our]:bowl) :: Only backup to moons for now.
  ?>  ?=(%keep mark)
  =/  cmd  !<(agent:poke vase)
  ?-  -.cmd
  ::  "Save my stuff," said the wrapper.
      %init
    :_  this
    :~  :*
      %pass   /backups/(scot %p src.bowl)/[dap.cmd]
      %agent  [src.bowl dap.cmd]
      %watch  /keep/[key.cmd]
    ==  ==
  ::  "Give me my stuff," said the wrapper.
      %grab
    :_  this
    ~|  [%has-no dap.cmd from=src.bowl]
    =/  data=noun
      (~(got by kept) [dap.cmd src.bowl])
    :~  :*
      %pass   /recoveries/(scot %p src.bowl)/[dap.cmd]
      %agent  [src.bowl dap.cmd]
      %poke   keep+!>([%data data key.cmd])
    ==  ==
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?.  ?=([%backups term term ~] wire)  (on-agent:def wire sign)
  ?+  -.sign  (on-agent:def wire sign)
  ::
      %fact
    ~&  %store-backup
    ?.  ?=(%noun p.cage.sign)  `this
    `this(kept (~(put by kept) [&3.wire src.bowl] !<(noun q.cage.sign)))
  ==
::
++  on-peek   on-peek:def
++  on-init   on-init:def
++  on-watch  on-watch:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
