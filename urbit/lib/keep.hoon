::  keep: agent wrapper for backups
::
::  usage: %-(agent:keep your-agent)
::
/-  *keep
/+  default-agent, *sane
::
|%
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  $:  %0
      live=_|
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
  |_  bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) +<)
      sup   =-  [our=(my p.-) their=(my q.-)]
            %+  skid  ~(tap by ^sup)
            |=  [* * =path]
            ?~  path  |
            =(-.path %keep)
      bowl  +<(sup our.sup)
      dish  +<(sup their.sup)  ::TODO change eny too?
      ag    ~(. agent dish)
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
    ::  Back up your state once
        %once
      ?>  live
      ?>  =(src.bowl our.bowl)
      =/  paths
        ::  Already backing up to there?
        %+  murn  ~(val by sup.bowl)
        |=  [=ship =path]
        ?.  =(ship to.cmd)  ~
        `path
      ?~  paths
        ::  No. Initiate new connection.
        =/  key  (scot %uv (sham eny.bowl))
        =.  pending  (~(put by pending) to.cmd %invite key)
        :_  this
        :-  (~(try-invite json state) to.cmd)
        :~  :*
          %pass   /keep/init/(scot %p to.cmd)
          %agent  [to.cmd %keep]
          %poke   keep-agent+!>([%init dap.bowl key])
        ==  ==
      ::  Yes. Just give the fact.
      =/  freq  (~(get by auto) to.cmd)
      =/  prev  (~(get by last) to.cmd)
      =.  last  (~(put by last) to.cmd now.bowl)
      :_  this
      %-  catunits
      :~  (bind (both `now.bowl freq) (cork add (wait to.cmd))) :: set next
          (bind (both prev freq) (cork add (rest to.cmd))) :: unset old next
          `[%give %fact paths noun+!>([wex.dish sup.dish +:on-save:ag])]
          `(~(saved json state) to.cmd now.bowl)
      ==
    ::  Set/unset repeating backups
        %many
      ?>  live
      ?>  =(src.bowl our.bowl)
      =/  freq  (~(get by auto) to.cmd)
      =/  prev  (~(get by last) to.cmd)
      =.  auto  (putunit auto to.cmd freq.cmd)
      :_  this
      %-  catunits
      :~  (bind (both prev freq) (cork add (rest to.cmd))) :: unset old next
          `(~(auto json state) to.cmd freq.cmd)
          ?^  new=(bind (both prev freq.cmd) (cork add (wait to.cmd)))
            new :: set next later
          (bind freq.cmd |=(* ((wait to.cmd) now.bowl))) :: set next now
      ==
    ::  Start repairing your state
        %mend
      ?>  live
      ?>  =(src.bowl our.bowl)
      =/  key  (scot %uv (sham eny.bowl))
      ~&  cmd
      =.  pending  (~(put by pending) from.cmd %restore key)
      :_  this
      :-  (~(try-restore json state) from.cmd)
      :~  :*
        %pass   /keep/mend/(scot %p from.cmd)
        %agent  [from.cmd %keep]
        %poke   keep-agent+!>([%grab dap.bowl key])
      ==  ==
    ::  Load this back
        %data
      ?>  live
      ~|  %do-not-want
      ?>  =([%restore key.cmd] (~(got by pending) src.bowl))
      =.  pending  (~(del by pending) src.bowl)
      =+  old=~|(%bad-shape ;;([wex=boat:gall sup=bitt:gall state=*] data.cmd))
      =^  cards  agent
        ;<  =_ag  write  (on-load:ag [-:on-save:ag state.old])
        ;<  =_ag  write
          %+  roll-write  (diff ~(tap by wex.old) ~(tap by wex.dish))
          |:  [*[[=wire =ship *] *] ag=ag]
          (on-agent:ag(src.+< ship) wire %kick ~)
        ;<  ~  _foobar
          %+  roll-write  (diff ~(tap by sup.old) ~(tap by sup.dish))
          |:  [*[* =ship =path] ag=ag]  (on-leave:ag(src.+< ship) path)
        %+  weld
          %+  turn  (diff ~(tap by sup.bowl) ~(tap by sup.old))
          |=  [duct =ship =path]  `card`[%give %kick ~[path] `ship]
        %+  turn  (diff ~(tap by wex.bowl) ~(tap by wex.old))
        |=  [[=wire =ship =dude] *]
        `card`[%pass wire %agent [ship dude] %leave ~]
      :_  this
      [(~(restored json state) src.bowl now.bowl) cards]
    ::  Turn wrapper on or off
        %live
      ?>  =(our.bowl src.bowl)
      ?:  =(live live.cmd)  `this
      =.  live  live.cmd
      :_  this
      ~[~(live json state)]
    ==
  ::
  ++  on-peek
    |=  =path
    ^-  (unit (unit cage))
    ~&  [%keep peek=path]
    ?.  ?=([%x %keep %live ~] path)  (on-peek:ag path)
    ``loob+!>(live)
  ::
  ++  on-init
    ^-  (quip card agent:gall)
    =^  cards  agent  on-init:ag
    :_  this
    [(tell our.bowl dap.bowl) cards]
  ::
  ++  on-save
    ?.  live  on-save:ag
    !>([on-save:ag state])
  ::
  ++  on-load
    |=  old=vase
    ^-  (quip card agent:gall)
    =/  tell-card  (tell our.bowl dap.bowl)
    ?^  our=(mole |.(!<([vase _state] old)))
      =^  their  state  u.our
      =^  cards  agent  (on-load:ag their)
      [[tell-card cards] this]
    =^  cards  agent  (on-load:ag old)
    [[tell-card cards] this]
  ::
  ++  on-leave
    |=  =path
    ^-  (quip card agent:gall)
    ?:  ?=(%keep -.path)  `this
    =^  cards  agent  (on-leave:ag path)
    [cards this]
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card agent:gall)
    ?.  ?=(%keep -.path)
      =^  cards  agent  (on-watch:ag path)
      [cards this]
    ?+  +.path  (on-watch:def path)
    ::
        [%website ~]
      :_  this
      ~[~(initial json state)]
    ::
        [%data term ~]
      ~|  %didnt-ask
      ?>  =([%invite &3.path] (~(got by pending) src.bowl))
      =.  pending  (~(del by pending) src.bowl)
      (on-poke(src.+< our.bowl) %keep !>([%once src.bowl]))
    ==
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card agent:gall)
    ?:  ?=(%keep -.wire)  `this
    =^  cards  agent  (on-agent:ag wire sign)
    [cards this]
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card agent:gall)
    ?.  ?=(%keep -.wire)
      =^  cards  agent  (on-arvo:ag wire sign-arvo)
      [cards this]
    ?.  ?=([%timer @ *] +.wire)        (on-arvo:def wire sign-arvo)
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
  ^-  card
  [%pass /keep/cancel/(scot %p ship) %arvo %b %rest da]
::
++  wait
  |=  =ship
  |=  =@da
  ^-  card
  [%pass /keep/timer/(scot %p ship) %arvo %b %wait da]
::
++  tell
  |=  [our=ship dap=dude]
  ^-  card
  [%pass /keep/tell %agent [our %keep] %poke keep-agent+!>([%tell dap])]
::
++  json
  =,  enjs:format
  |_  state=state-0
  ++  initial  (website-card 'initial' ~)
  ::
  ++  saved
    |=  new=[@p @da]  (website-card 'saved' (json-da new))
  ::
  ++  auto
    |=  new=[@p (unit @dr)]  (website-card 'auto' (json-dr new))
  ::
  ++  try-invite
    |=  =@p  (website-card 'pending' (json-pending [p %invite]))
  ::
  ++  try-restore
    |=  =@p  (website-card 'pending' (json-pending [p %restore]))
  ::
  ++  restored
    |=  new=[@p @da]  (website-card 'restored' (json-da new))
  ::
  ++  live  (website-card 'active' b+live.state)
  ::
  ++  website-card
    |=  [event=@t diff=^json]
    ^-  card
    =;  json-state=^json
      :*  %give  %fact  ~[/keep/website]  %json
          !>((pairs ~[[%type s+event] [%diff diff] [%state json-state]]))
      ==
    %-  pairs
    :~  [%live b+live.state]
        [%saved a+(turn ~(tap by last.state) json-da)]
        [%auto a+(turn ~(tap by auto.state) |=([=@p =@dr] (json-dr p `dr)))]
        :+  %pending
          %a
        %+  turn  ~(tap by pending.state)
        |=  [=@p status=?(%invite %restore) *]
        (json-pending p status)
    ==
  ::
  ++  json-da
    |=  [=@p prev=@da]
    ^-  ^json
    (pairs ~[['ship' (ship p)] ['time' (sect prev)]])
  ::
  ++  json-dr
    |=  [=@p freq=(unit @dr)]
    ^-  ^json
    %-  pairs
    :~  ['ship' (ship p)]
        ['freq' (bindcast freq (corl numb (curr div ~s1)))]
    ==
  ::
  ++  json-pending
    |=  [=@p status=?(%invite %restore)]
    ^-  ^json
    (pairs ~[['ship' (ship p)] ['status' s+status]])
  --
--
