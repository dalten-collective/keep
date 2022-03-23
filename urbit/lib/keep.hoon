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
      pending=(map ship [term ?(%invite %restore)])
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
        |=  paths=(lest path)
        ^-  (lest card)
        ~&  [%backup to=paths]
        ~[[%give %fact paths noun+!>(+:on-save:ag)]]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card agent:gall)
    ?.  ?=(%keep mark)
      =^  cards  agent  (on-poke:ag mark vase)
      [cards this]
    ::
    =/  cmd  !<(wrapper:poke vase)
    ?-  -.cmd
    ::  Save your state
        %save
      ?>  =(src.bowl our.bowl)
      =/  paths
        ::  Already backing up to there?
        %+  murn  ~(val by sup.bowl)
        |=  [=ship =path]
        ?.  =(ship to.cmd)   ~
        `path
      ?^  paths
        ::  Yes. Just give the fact.
        [(backup paths) this]
      ::  No. Initiate new connection.
      =/  key  (scot %uv (sham eny.bowl))
      :_  this(pending (~(put by pending) to.cmd key %invite))
      :~  :*
        %pass   /keep/init/(scot %p to.cmd)
        %agent  [to.cmd %keep]
        %poke   keep-agent+!>([%init dap.bowl key])
      ==  ==
    ::  Repair your state
        %mend
      ?>  =(src.bowl our.bowl)
      =/  key  (scot %uv (sham eny.bowl))
      ~&  cmd
      :_  this(pending (~(put by pending) from.cmd key %restore))
      :~  :*
        %pass   /keep/mend/(scot %p from.cmd)
        %agent  [from.cmd %keep]
        %poke   keep-agent+!>([%grab dap.bowl key])
      ==  ==
    ::  Load this back
        %data
      ~&  %receiving-backup
      ~|  %do-not-want
      ?>  =([key.cmd %restore] (~(got by pending) src.bowl))
      =.  pending  (~(del by pending) src.bowl)
      (on-load [-:on-save:ag data.cmd]) :: yolo
    ==
  ::
  ++  on-peek  on-peek:ag
  ::
  ++  on-init
    ^-  (quip card agent:gall)
    =^  cards  agent  on-init:ag
    [cards this]
  ::
  ++  on-save  on-save:ag
  ::
  ++  on-load
    |=  =vase
    ^-  (quip card agent:gall)
    =^  cards  agent  (on-load:ag vase)
    [cards this]
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card agent:gall)
    ?.  ?=(%keep -.path)
      =^  cards  agent  (on-watch:ag path)
      [cards this]
    ~|  %dont-care
    ?>  (team:title [our src]:bowl) :: Only backup to moons for now.
    ?>  ?=([term ~] +.path)
    ::  Requested?
    ~|  %didnt-ask
    ?>  =([&2.path %invite] (~(got by pending) src.bowl))
    :-  (backup ~[path])
    this(pending (~(del by pending) src.bowl))
  ::
  ++  on-leave
    |=  =path
    ^-  (quip card agent:gall)
    =^  cards  agent  (on-leave:ag path)
    [cards this]
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card agent:gall)
    =^  cards  agent  (on-agent:ag wire sign)
    [cards this]
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card agent:gall)
    =^  cards  agent  (on-arvo:ag wire sign-arvo)
    [cards this]
  ::
  ++  on-fail
    |=  [=term =tang]
    ^-  (quip card agent:gall)
    =^  cards  agent  (on-fail:ag term tang)
    [cards this]
  --
--
