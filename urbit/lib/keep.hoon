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
      last=(map ship @da)
      auto=(map ship @dr)
      pending=(map ship [?(%invite %restore) term])
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
    ::  Backup your state once
        %once
      ?>  =(src.bowl our.bowl)
      =/  paths
        ::  Already backing up to there?
        %+  murn  ~(val by sup.bowl)
        |=  [=ship =path]
        ?.  =(ship to.cmd)   ~
        `path
      ?~  paths
        ::  No. Initiate new connection.
        =/  key  (scot %uv (sham eny.bowl))
        :_  this(pending (~(put by pending) to.cmd %invite key))
        :~  :*
          %pass   /keep/init/(scot %p to.cmd)
          %agent  [to.cmd %keep]
          %poke   keep+!>([%init dap.bowl key])
        ==  ==
      ::  Yes. Just give the fact.
      :_  this(last (~(put by last) to.cmd now.bowl))
      =/  freq  (~(get by auto) to.cmd)
      =/  prev  (~(get by last) to.cmd)
      %-  catunits
      :~  (some [%give %fact paths noun+!>(+:on-save:ag)])
          (bind (both prev freq) (cork add (rest to.cmd)))
          (bind (both `now.bowl freq) (cork add (wait to.cmd)))
          :: (clef prev freq |=(* `((rest to.cmd)))) :: (cork add (rest to.cmd)))
      ::    `(unit card)`~ ::(clef `now.bowl freq |=(* ((wait to.cmd)))) :: )
      ==
    ::  Set/unset repeating backups
        %many
      ?>  =(src.bowl our.bowl)
      :_  this(auto (putunit auto to.cmd freq.cmd))
      =/  freq  (~(get by auto) to.cmd)
      =/  prev  (~(get by last) to.cmd)
      %-  catunits
      :~  (bind (both prev freq) (cork add (rest to.cmd)))
          ?^  new=(bind (both prev freq.cmd) (cork add (wait to.cmd)))
            new
          (bind freq.cmd |=(* ((wait to.cmd) now.bowl)))
      ==
    ::  Start repairing your state
        %mend
      ?>  =(src.bowl our.bowl)
      =/  key  (scot %uv (sham eny.bowl))
      ~&  cmd
      :_  this(pending (~(put by pending) from.cmd %restore key))
      :~  :*
        %pass   /keep/mend/(scot %p from.cmd)
        %agent  [from.cmd %keep]
        %poke   keep+!>([%grab dap.bowl key])
      ==  ==
    ::  Load this back
        %data
      ~&  %receiving-backup
      ~|  %do-not-want
      ?>  =([%restore key.cmd] (~(got by pending) src.bowl))
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
  ++  on-leave
   |=  =path
   ^-  (quip card agent:gall)
   =^  cards  agent  (on-leave:ag path)
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
    ?>  =([%invite &2.path] (~(got by pending) src.bowl))
    =.  pending  (~(del by pending) src.bowl)
    (on-poke %keep !>([%once src.bowl]))
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
   ?.  ?=(%keep -.wire)
     =^  cards  agent  (on-arvo:ag wire sign-arvo)
     [cards this]
   ?.  ?=([%timer @ *] +.wire)          (on-arvo:def wire sign-arvo)
   ?.  ?=([%behn %wake *] sign-arvo)  (on-arvo:def wire sign-arvo)
   ?^  error.sign-arvo                (on-arvo:def wire sign-arvo)
   (on-poke %keep !>([%once (slav %p &3.wire)]))
  ::
  ++  on-fail
   |=  [=term =tang]
   ^-  (quip card agent:gall)
   =^  cards  agent  (on-fail:ag term tang)
   [cards this]
  --
::
++  rest
  |=  =ship
  |=  =@da
::  ^-  $<(%slip card)
  [%pass /keep/cancel/(scot %p ship) %arvo %b %rest da]
::
++  wait
  |=  =ship
  |=  =@da
::  ^-  $<(%slip card)
  [%pass /keep/cancel/(scot %p ship) %arvo %b %wait da]
::
++  catunits
  |=  xs=(list (unit card))
  ^-  (list card)
  (murn xs same)
::
++  putunit
  |*  [=(map) key=* =(unit)]
  ^+  map
  ?~  unit
    (~(del by map) key)
  (~(put by map) key +.unit)
--
