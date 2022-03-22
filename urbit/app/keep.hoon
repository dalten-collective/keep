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
      kept=(map [ship dude] noun)
  ==
::
+$  card  card:agent:gall
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
  ?>  ?=(%keep-agent mark)
  =/  cmd  !<(agent:poke vase)
  ?-  -.cmd
  ::
      %init
    :_  this
    :~  :*
      %pass   /backups/(scot %p src.bowl)/[dap.cmd]
      %agent  [src.bowl dap.cmd]
      %watch  /keep/[key.cmd]
    ==  ==
  ::
      %grab
    :_  this
    ~&  [ship=src.bowl %grabs app=dap.cmd]
    =/  data=noun
      ~|([%has-no dap.cmd src.bowl] (~(got by kept) [src.bowl dap.cmd]))
    :~  :*
      %pass   =-  ~&  -  -  /recoveries/(scot %p src.bowl)/[dap.cmd]
      %agent  =-  ~&  -  -  [src.bowl dap.cmd]
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
    ~&  %store-vase
    ?.  ?=(%noun p.cage.sign)  `this
    `this(kept (~(put by kept) [src.bowl &3.wire] !<(noun q.cage.sign)))
  ==
::
++  on-init   on-init:def
++  on-watch  on-watch:def
++  on-arvo   on-arvo:def
++  on-peek   on-peek:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
