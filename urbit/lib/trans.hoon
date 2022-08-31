/+  *trans-call
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
++  plos
  |=  =vase
  ^-  (unit [^vase ^vase])
  ?.  &(?=(^ -.vase) ?=(%cell -<.vase))  ~
  =/  types  ->.vase
  =/  valus  +.vase
  :+  ~
    [-.types -.valus]
  [+.types +.valus]
--
::
^?
|%
++  trans
  |=  [[id=term core=*] =agent:gall]
  ^-  agent:gall
  |_  =bowl:gall
  +*  this   . 
      ag     ~(. agent bowl)
      trans  ~(. core on-save:ag bowl)
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
    !@  on-save:core
      ^-  vase
      !!
    on-save:ag
  ::
  ++  on-load
    |=  old=vase
    ^-  (quip card agent:gall)
    !@  on-load:core
      !!
    =^  cards  agent  (on-load:ag old)
    [cards this]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card agent:gall)
    ~&  >>  =-  [type=- arms=(sloe -)]  -:!>(trans)
    =^  cards  agent
      !@  on-poke.core
        ~&  >>  [%trans-poke vase=vase]
        ?.  =(id mark)  (on-poke:ag mark vase)
        ?~  inner=(plos vase)  ~|  expected-cell=vase  !!
        =^  calls  core  (on-poke:trans !<(term -.u.inner) +.u.inner)
        %+  roll  calls
        |:  *[=call caz=(list card) ag=_agent]
        =-  [(weld -.- caz) +.-]
        ?:  ?=(%card -.call)  [card.call ag]
        =.  ag  ag(src.+< src.call)
        ?:  ?=(%on-init -.call)  on-init:ag
        !<  (quip card _ag)
        (slam (slap !>(ag) limb/-.call) !>(+>.call))
          ::  ?+  -.call  `ag
          ::    %on-init  on-init:ag
          ::    %on-poke  (on-poke:ag +>.call)
          ::  ==
      ~&  >>  [%simple-poke vase=vase]
      (on-poke:ag mark vase)
    [cards this]
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
    !@  on-peek:core
      !!
    (on-peek:ag path)
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
