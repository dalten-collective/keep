::  keep: agent wrapper for backups
::
::  usage: %-(agent:keep your-agent)
::
/-  *keep
/+  default-agent
::
|%
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  $:  %0
      keepers=(map ship term)
  ==
::
++  agent
  |=  =agent:gall
  ::
  =|  state-0
  =*  state  -
  ::
  ^-  agent:gall
  |_  =bowl:gall
  +*  this  .
      ag    ~(. agent bowl)
      def   ~(. (default-agent this %|) bowl)
      backup
        |=  to=ship
        ^-  (list card:agent:gall)
        =/  secret  (~(got by keepers) to)
        ~[[%give %fact ~[/keep/[secret]] noun+on-save:ag]] :: probably change to vase+!>(on-save:ag)
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card:agent:gall agent:gall)
    ?.  ?=(%keep-wrapper mark)
      =^  cards  agent  (on-poke:ag mark vase)
      [cards this]
    ::
    =+  !<(keep=poke vase)
    ?+  -.keep  (on-poke:def mark vase)
    ::
        %init
      =/  new-seed=@uv  (jam seed.keep (sham eny.bowl))
      :_  this(keepers (~(put by keepers) src.bowl (scot %ux new-seed)))
      :~  :*
        %pass   /keep/init/(scot %p src.bowl)
        %agent  [src.bowl %keep]
        %poke   keep-agent+!>((poke %init new-seed))
      ==  ==
    ::
        %save
      [(backup to.keep) this]
    ==
  ::
  ++  on-peek
    |=  =path
    ^-  (unit (unit cage))
    ?:  ?=([%keep *] path)  `~
    (on-peek:ag path)
  ::
  ++  on-init
    ^-  (quip card:agent:gall agent:gall)
    =^  cards  agent  on-init:ag
    [cards this]
  ::
  ++  on-save  on-save:ag
  ::
  ++  on-load
    |=  =vase
    ^-  (quip card:agent:gall agent:gall)
    =^  cards  agent  (on-load:ag vase)
    [cards this]
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card:agent:gall agent:gall)
    ?.  ?=(%keep -.path)
      =^  cards  agent  (on-watch:ag path)
      [cards this]
    ?>  (team:title [our src]:bowl) :: Only backup to moons for now.
    ?>  ?=([term ~] +.path)
    ?>  =(&2.path (~(got by keepers) src.bowl))
    [(backup src.bowl) this]
  ::
  ++  on-leave
    |=  =path
    ^-  (quip card:agent:gall agent:gall)
    =^  cards  agent  (on-leave:ag path)
    [cards this]
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card:agent:gall agent:gall)
    =^  cards  agent  (on-agent:ag wire sign)
    [cards this]
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card:agent:gall agent:gall)
    =^  cards  agent  (on-arvo:ag wire sign-arvo)
    [cards this]
  ::
  ++  on-fail
    |=  [=term =tang]
    ^-  (quip card:agent:gall agent:gall)
    =^  cards  agent  (on-fail:ag term tang)
    [cards this]
  --
--
