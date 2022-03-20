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
      kept=(map source vase)
      pending=(map @uv source)
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
  =+  !<(keep=poke vase)
  =,  keep
  ?+  -.keep  (on-poke:def mark vase)
  ::
      %keep
    =/  seed  (sham eny.bowl)
    =.  pending  (~(put by pending) seed source)
    :_  this
    :~  :*
      %pass   /keep/init/(scot %p ship.source)/[app.source]
      %agent  source
      %poke   keep-wrapper+!>((poke %init seed))
    ==  ==
  ::
      %init
    =+  ;;([my-seed=@uv *] (cue seed))
    =/  source  (~(got by pending) my-seed)
    ?>  =(ship.source src.bowl)
    :_  this(pending.state (~(del by pending) my-seed))
    :~  :*
      %pass   /backups/[app.source]
      %agent  source
      %watch  /keep/(scot %ux seed)
    ==  ==
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?.  ?=([%backups term ~] wire)  (on-agent:def wire sign)
  ?+  -.sign  `this
  ::
      %fact
    ?.  ?=(%noun p.cage.sign)  `this
    `this(kept.state (~(put by kept) [src.bowl &2.wire] q.cage.sign))
  ==
::
++  on-init  on-init:def
++  on-watch  on-watch:def
++  on-arvo   on-arvo:def
++  on-peek   on-peek:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
