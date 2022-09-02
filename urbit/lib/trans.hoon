/-  trans
::
|%
++  card   card:agent:gall
++  zoom
  |=  [caz=(list card) f=$-(path path)]
  ^-  (list card)
  %+  turn  caz
  |=  =card
  ?+  -.card  card
      %pass
    card(p (f p.card))
  ::
      %give  
    ?.  ?=(?(%fact %kick) -.p.card)  card
    card(paths.p (turn paths.p.card f))
  ==
::
++  strip
  |=  =knot  |=  =path  ^-  ^path
  ?.  &(?=(^ path) =(knot -.path))  path  +.path
::
++  open
  |=  [door=vase arg=*]  ^-  vase
  door(+6.q arg)
--
::
^?
|%
+$  state  [%tools agent=vase tolds=(map term [path (unit vase)])]
::
++  tool
  =|  tools=(map term [path =vase])
  ::
  |=  =agent:gall
  ^-  agent:gall
  |_  =bowl:gall
  +*  this   . 
      ag     ~(. agent bowl)
      dish   |=(=mark bowl) ::TODO dish
    ::  trans  ~(. core on-save:ag bowl)
  ::
  ++  on-init
    ^-  (quip card agent:gall)
    !@  on-init:core
      =/  [=(unit vase) caz=(list card) filt=$-(card ?)]  on-init:trans
      =?  agent  ?=(~ unit)  u.unit
      =^  cards  agent  on-init:ag  
      :_  this
      (weld (zoom caz (lead id)) (skip cards filt))
    =^  cards  agent  on-init:ag
    [cards this]
  ::
  ++  on-save
    !>  :+  %tools
      on-save:ag
    %-  ~(rut by tools)
    |=  [=term =path door=vase]
    ^-  [^path (unit vase)]
    :-  path
    ?.  (slab %read %on-save p.door)  ~
    %-  some
    !<  vase
    (slap door(+6.q [on-save:ag (dish term)]) limb/%on-save)
  ::
  ++  on-load
    |=  old=vase
    ^-  (quip card agent:gall)
    ?~  res=(mole |.(!<(state old)))
      =^  cards  agent  (on-load:ag old)
      [cards this]
    =^  cards  agent  (on-load:ag agent.u.res)
    =^  calls  tools
      =-  [-.- (~(run by +.-) |=([p=path u=(unit vase)] p^(need u)))]
      %+  ~(rib by tolds.u.res)  *(list call:trans)
      |=  [[=term =path ole=(unit vase)] calls=(list call:trans)]
      ^-  (quip call:trans [^term ^path (unit vase)])
      =.  path  path(&3 (scot %da now.bowl))
      =-  [(weld calls !<((list call:trans) (slot 2 -))) term path `(slot 3 -)]
      ~&  >  recompiling=path
      =/  door  (slap !>([trans ..zuse]) (ream .^(@t cx+path)))
      ?.  &(?=(^ ole) (slab %read %on-load p.door))
        (slop !>(*(list call:trans)) door)
      =.  door  door(+6.q [on-save:ag (dish term)])
      (slam (slap door limb/%on-load) u.ole)
    [cards this]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card agent:gall)
    ?:  ?=(%transformer mark)
      ~&  >>  [%transformer-poke vase=vase]
      :-  ~
      =/  cmd  !<($%([%add =term =path] [%del =term]) vase)
      %=  this  tools
        ?-  -.cmd
            %del
          (~(del by tools) term.cmd)
        ::
            %add
          %+  ~(put by tools)  term.cmd
          :-  path.cmd
          (slap !>([trans ..zuse]) (ream .^(@t cx+path.cmd)))
        ==
      ==
    =*  call-inner  
      ~&  >>  [%simple-poke vase=vase]
      =^  cards  agent  (on-poke:ag mark vase)
      [cards this]
    ?~  entry=(~(get by tools) mark)
      call-inner
    =/  door=^vase  vase.u.entry
    ?.  (slab %read %on-poke p.door)
      call-inner
    ~&  >>  [%trans-poke vase=vase]
    =.  door  door(+6.q [on-save:ag (dish mark)])
    ~&  >>  door-vase-type=p.door
    =^  calls  door
      =-  ~|  %bad-return  [!<((list call:trans) (slot 2 -)) (slot 3 -)]
      ~|  %bad-inner
      %+  slam  
        ::  =-  ~&  >>  door-type=p.-  -  
        (slap door limb/%on-poke)
      ::  =-  ~&  >>  arg-vase=-  -
      !>([!<(term (slot 2 vase)) (slot 3 vase)])
    =^  cards  agent
      %+  roll  calls
      |:  *[=call:trans caz=(list card:agent:gall) ag=_agent]
      =-  [(weld -.- caz) +.-]
      ?:  ?=(%card -.call)  [~[card.call] ag]
      =.  ag  ag(src.+< +<.call)
      ?:  ?=(%on-init -.call)  on-init:ag
      !<  (quip card _ag)
    ::  ?:  ?=(%on-poke -.call)
    ::    (slam (slap !>(ag) limb/-.call) !>(+>.call))
      =-  ~&  >>  slammed/-:!>(-)  -
      %+  slam
        =-  ~&  >>  arm/!<($-([^mark ^vase] (quip card agent:gall)) -)  -
        (slap !>(ag) limb/-.call)
      =-  ~&  >>  [arg-type=-:!>(-) arg=+>.call]  -
      !>(+>.call)
    :-  cards
    this(tools (~(jab by tools) mark |=([=path *] [path door])))
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card agent:gall)
    !@  on-watch:core
      !!
    =^  cards  agent  (on-watch:ag path)
    [cards this]
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card agent:gall)
    !@  on-agent:core
      !!
    =^  cards  agent  (on-agent:ag wire sign)
    [cards this]
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card agent:gall)
    !@  on-arvo:core
      !!
    =^  cards  agent  (on-arvo:ag wire sign-arvo)
    [cards this]
  ::
  ++  on-peek
    |=  =path
    ^-  (unit (unit cage))
    ?.  ?=([%x term *] path)  (on-peek:ag path)
    =*  mark  &2.path
    =*  inner  path(+ +>.path)
    ?:  ?=(%transformer mark)  ``path+!>(~(tap in ~(key by tools)))
    ?~  res=(~(get by tools) mark)  (on-peek:ag path)
    !<  (unit (unit cage))
    %+  slam
      (slap vase.u.res(+6.q [on-save:ag (dish mark)]) limb/%on-peek)
    !>(inner)
  ::
  ++  on-leave
    |=  =path
    ^-  (quip card agent:gall)
    !@  on-leave:core
      !!
    =^  cards  agent  (on-leave:ag path)
    [cards this]
  ::
  ++  on-fail
    |=  [=term =tang]
    ^-  (quip card agent:gall)
    !@  on-fail:core
      !!
    =^  cards  agent  (on-fail:ag term tang)
    [cards this]
  --
--
