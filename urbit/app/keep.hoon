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
      kept=(map [dude ship] [data=noun time=@da])
      live=(set dude)
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
      data:(~(got by kept) [dap.cmd src.bowl])
    :~  :*
      %pass   /recoveries/(scot %p src.bowl)/[dap.cmd]
      %agent  [src.bowl dap.cmd]
      %poke   keep+!>([%data data key.cmd])
    ==  ==
  ::  "I exist," said a wrapper on our own ship.
      %tell
    ?>  =(src.bowl our.bowl)
    ?:  (~(has in live) dap.cmd)  `this
    =.  live  (~(put in live) dap.cmd)
    :_  this
    ~[(website-card 'agent' s+dap.cmd)]
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
    =.  kept  (~(put by kept) [&3.wire src.bowl] !<(noun q.cage.sign) now.bowl)
    :_  this
    ~[(website-card 'backup' (json-backup now.bowl &3.wire src.bowl))]
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
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
  ==  ==  ==
::
++  json-backup
  |=  [tyme=@da =dude =@p]
  ^-  json
  =,  enjs:format
  (pairs ~[ship+(ship p) agent+s+dude time+(sect tyme)])
--
