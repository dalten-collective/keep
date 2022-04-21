::  keep: backup manager
::
/-  *keep
/+  default-agent, dbug, *sane
::
|%
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  $:  %0
      kept=(map [dude ship] noun)
      enabled=(list dude)
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
  ?>  ?=(%keep-agent mark)
  =/  cmd  !<(agent:poke vase)
  ?-  -.cmd
  ::  "Subscribe to my stuff," said someone else's wrapper.
      %init
    ?>  (team:title [src our]:bowl) :: Only backup to moons for now.
    :_  this
    :~  :*
      %pass   /backups/(scot %p src.bowl)/[dap.cmd]
      %agent  [src.bowl dap.cmd]
      %watch  /keep/data/[key.cmd]
    ==  ==
  ::  "Give me my stuff," said someone else's wrapper.
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
  ::  "I exist," said a wrapper on our own ship.
      %join
    ?>  =(src.bowl our.bowl)
    ?:  (contains enabled dap.cmd)  `this
    :_  this(enabled [dap.cmd enabled])
    ~[[%give %fact ~[/website] json+!>((frond:enjs:format 'join' s+dap.cmd))]]
  ::  "I quit," said a wrapper on our own ship.
      %quit
    ?>  =(src.bowl our.bowl)
    :_  this(enabled (delete dap.cmd enabled))
    ~[[%give %fact ~[/website] json+!>((frond:enjs:format 'quit' s+dap.cmd))]]
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?.  ?=([%backups term term ~] wire)  (on-agent:def wire sign)
  ?+  -.sign  (on-agent:def wire sign)
  ::
      %fact
    ~&  >  [%store-backup of=,.&3.wire from=src.bowl]
    ?.  ?=(%noun p.cage.sign)  `this
    `this(kept (~(put by kept) [&3.wire src.bowl] !<(noun q.cage.sign)))
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?.  ?=([%website ~] path)  (on-watch:def path)
  :_  this
  :~  :*
    %give  %fact  ~[/website]  %json
    !>((frond:enjs:format 'agents' a+(turn enabled (lead %s))))
  ==  ==
::
++  on-init   on-init:def
++  on-peek   on-peek:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
