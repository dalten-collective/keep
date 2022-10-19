::  keep: backup manager
::
/+  dbug, *mip, default-agent, parse-agent
/=  agentio        /keep/lib/agentio
/=  sane           /keep/lib/sane
/=  keep-sur       /keep/sur/keep
=,  keep-sur
=,  sane
::
=>
  |%
  +$  state
    $:  kept=(map [dude ship] [data=noun time=@da])
        live=(set dude)
        able=(each (set ship) (set ship))
        into=(jug desk dude)
        auto=(mip dude (unit ship) @dr)
        last=(mip dude (unit ship) @da)
    ==
  ++  path-of
    |=  to=(unit ship)  ^-  path
    ?~  to  /put
    /ship/(scot %p u.to)
  ::
  ++  of-wire
    |=  =path  ^-  (unit ship)
    ?+  path  !!
      [%put ~]        ~
      [%ship term ~]  `(slav %p &2.path)
    ==
  --
::
%-  agent:dbug
::
=<
=|  current:state-type
=*  state  -
^-  agent:gall
::
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
    disk  ~(. ^disk bowl)
    whitelisted  |(?=(%| -.able) (~(has in p.able) src.bowl))
    emit  ~(website json state)
    send
      |=  [dap=dude to=(unit ship)]
      %+  ~(poke-our pass:io send/dap^(path-of to))  dap
      keep/!>(`wrap:poke`send/to)
::
++  on-save  !>(state)
++  on-init  [~[mult-deps next-deps]:disk this]
::
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  ?-  ole=!<(versioned:state-type old)
    [%1 *]  `this(state ole)
    [%0 *]  on-init:this(state (upgrade:state-type ole))
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  ?=(%keep-agent mark)
  =/  cmd  !<(agent:poke vase)
  ?-  -.cmd
  ::
  ::  "Subscribe to my stuff," said someone else's wrapper.
      %init
    ~|  %not-whitelisted
    ?>  whitelisted
    :_  this
    :_  ~
    %+  ~(watch pass:io /backups/(scot %p src.bowl)/[dap.cmd])
      [src.bowl dap.cmd]
    /keep/data/[key.cmd]
  ::
  ::  "Give me my stuff," said someone else's wrapper.
      %grab
    ~|  %not-whitelisted
    ?>  whitelisted
    :_  this
    :_  ~
    ~|  [%has-no dap.cmd from=src.bowl]
    %+  ~(poke pass:io /recoveries/(scot %p src.bowl)/[dap.cmd])
      [src.bowl dap.cmd]
    keep+!>(`wrap:poke`[%data data:(~(got by kept) [dap.cmd src.bowl]) key.cmd])
  ::
  ::  "I exist," said a wrapper on our own ship.
      %tell
    ?>  =(src.bowl our.bowl)
    ?:  (~(has in live) dap.cmd)  `this
    =.  live  (~(put in live) dap.cmd)
    :_  this
    ~[(emit agent/s+dap.cmd)]
  ::
  ::  Back up once
      %once
    ?>  =(src.bowl our.bowl)
    =/  freq  (~(get bi auto) dap.cmd to.cmd)
    =/  prev  (~(get bi last) dap.cmd to.cmd)
    =/  behn  ~(. pass:io behn/dap.cmd^(path-of to.cmd))
    :_  this
    %-  catunits
    :~  (bind (both `now.bowl freq) (cork add wait:behn))  :: set next
        (bind (both prev freq) (cork add rest:behn))       :: unset old next
        `(send [dap to]:cmd)
    ==
  ::
  ::  Set/unset repeating backups
      %many
    ?>  =(src.bowl our.bowl)
    =/  freq  (~(get bi auto) dap.cmd to.cmd)
    =/  prev  (~(get bi last) dap.cmd to.cmd)
    =.  auto
      ?~  freq.cmd
        (~(del bi auto) dap.cmd to.cmd)
      (~(put bi auto) dap.cmd to.cmd u.freq.cmd)
    :_  this
    %-  catunits
    =/  behn  ~(. pass:io behn/dap.cmd^(path-of to.cmd))
    :~  (bind (both prev freq) (cork add rest:behn))  :: unset old next
        `(emit auto/(dr:event:json dap.cmd to.cmd freq.cmd))
        ?^  new=(bind (both prev freq.cmd) (cork add wait:behn))
          new  ::  set next later
        (bind freq.cmd |=(* (wait:behn now.bowl)))  :: set next now
    ==
  ::
  ::  Successful backup
      %okay
    :_  this
    :_  ~
    %+  emit  %success
    %:  ok:event:json
      dap.cmd
      src.bowl
      (~(got bi last) dap.cmd `src.bowl)
      time.cmd
    ==
  ::
  ::  "(De)whitelist this ship," said our operator.
      %able
    ?>  =(src.bowl our.bowl)
    ?-  +<.cmd
      %&  `this(p.able (~(put in p.able) p.cmd))
      %|  `this(p.able (~(del in p.able) p.cmd))
    ==
  ::
  ::  "(De)activate the whitelist," said our operator.
      %wyte
    ?>  =(src.bowl our.bowl)
    =*  res  `this(able [on.cmd p.able])
    ?:(on.cmd res res)
  ::
  ::  "Copy the wrapper to a desk," said our operator.
      %copy
    ?>  =(src.bowl our.bowl)
    =;  caz=(list card)
      =.  into  (~(put ju into) desk.cmd dude.cmd)
      :_  this
      (snoc caz (emit transformed/a/~[s/desk.cmd s/dude.cmd]))
    %+  weld
      ?:  (~(has by into) desk.cmd)  ~
      :~  (info-deps:disk deps:disk desk.cmd)
          mult-deps:disk
      ==
    ?:  (~(has ju into) desk.cmd dude.cmd)  ~
    %^  info-dude:disk  desk.cmd  dude.cmd
    .^(@t cx/(scry:io desk.cmd /app/[dude.cmd]/hoon))
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+    wire  (on-agent:def wire sign)
      [%clay *]
    `this
  ::
      [%send term ^]
    ?.  ?=(%poke-ack -.sign)  (on-agent:def wire sign)
    ?^  p.sign
      :_  this
      ~[(emit no-save/(da:event:json &2.wire (of-wire |2.wire) now.bowl))]  
    =.  last  (~(put bi last) &2.wire (of-wire |2.wire) now.bowl)
    :_  this
    ~[(emit saved/(da:event:json &2.wire (of-wire |2.wire) now.bowl))]
  ::
      [%backups term term ~]
    ~|  %not-whitelisted
    ?>  whitelisted
    ?.  ?=(%fact -.sign)       (on-agent:def wire sign)
    ?.  ?=(%noun p.cage.sign)  (on-agent:def wire sign)
    ~&  >  :*  %store-backup  of=,.&3.wire  from=src.bowl
           since-last=`@dr`(sub now.bowl +:(~(gut by kept) [&3.wire src.bowl] *[* @da]))
        ==
    =*  dap  &3.wire
    =.  kept  (~(put by kept) [dap src.bowl] !<(noun q.cage.sign) now.bowl)
    :_  this
    :~  (emit backup/(da:event:json dap `src.bowl now.bowl))
        %+  ~(poke pass:io /okay/(scot %p src.bowl)/[dap])  [src.bowl %keep]
        keep-agent/!>(`agent:poke`[%okay dap now.bowl])
    ==
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  =(src.bowl our.bowl)
  ?.  ?=([%website ~] path)  (on-watch:def path)
  :_  this
  ~[(emit initial/~)]
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?.  ?=([%x %agents *] path)  ~
  :^  ~  ~  %json  !>  ^-  ^json
  ::
  :-  %a
  %+  turn  ~(tap in .^((set desk) cd/(scry:io %base /)))
  |=  =desk
  %+  frond:enjs:format  desk
  :-  %a
  %+  turn  ~(tap in .^((set [dude ?]) ge/(scry:io desk /)))
  |=  [=dude on=?]  (pairs:enjs:format ~[agent+s/dude on+b/on])
::
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?+    wire  (on-arvo:def wire sign-arvo)
      [%behn term ^]
    (on-poke keep-agent/!>(`agent:poke`[%once &2.wire (of-wire |2.wire)]))
  ::
      [%clay %deps %mult ~]
    ?>  ?=([%clay %wris *] sign-arvo)
    :_  this
    :-  mult-deps:disk
    %+  turn  ~(tap in ~(key by into))
    (cury info-deps:disk (turn ~(tap in q.sign-arvo) tail))
  ::
      [%clay %deps %next ~]
    ?>  ?=([%clay %writ *] sign-arvo)
    :_  this
    :-  next-deps:disk
    ::
    ?~  p.sign-arvo
      ~&  >>>  "-keep-no-rant deps"  ~
    ?.  =(q.byk.bowl r.p.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-desk {<r.p.u.p.sign-arvo>}"  ~
    ?.  =(/keep q.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-path {<q.u.p.sign-arvo>}"  ~
    ?.  ?=(%t p.p.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-care {<p.p.u.p.sign-arvo>}"  ~
    ?.  ?=(%file-list p.r.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-mark {<p.r.u.p.sign-arvo>}"  ~
    ::
    :-  mult-deps:disk
    %+  turn  ~(tap in ~(key by into))
    %+  cury  info-deps:disk
    %+  diff  !<((list path) q.r.u.p.sign-arvo)
    .^((list path) ct+/(scot %p our.bowl)/[q.byk.bowl]/(scot %ud (dec our-rev:disk))/keep)
  ::
      [%clay %dude @ @ ~]
    ?>  ?=([%clay %writ *] sign-arvo)
    :_  this
    =*  desk  &3.wire
    =*  dude  &4.wire
    =*  file  /app/[dude]/hoon
    ::
    ?~  p.sign-arvo
      ~&  >>>  "-keep-no-rant {<desk>} {<dude>}"  ~
    ?.  =(desk r.p.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-desk {<r.p.u.p.sign-arvo>}"  ~
    ?.  =(file q.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-path {<q.u.p.sign-arvo>}"  ~
    ?.  ?=(%x p.p.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-care {<p.p.u.p.sign-arvo>}"  ~
    ?.  ?=(%hoon p.r.u.p.sign-arvo)
      ~&  >>>  "-keep-wrong-mark {<p.r.u.p.sign-arvo>}"  ~
    ::
    (info-dude:disk desk dude !<(@t q.r.u.p.sign-arvo))
  ==
::
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
::
|%
++  disk
  |_  =bowl:agent:gall
  +*  io  ~(. agentio bowl)
  ::
  ++  our-rev
    ^-  @ud
    ud:.^(cass:clay cw/(scry:io q.byk.bowl /))
  ::
  ++  deps
    ^-  (list path)
    :+  /mar/json/hoon  /mar/keep/hoon
    .^((list path) ct/(scry:io q.byk.bowl /keep))
  ::
  ++  mult-deps
    ^-  card
    %-  ~(warp-our pass:io /clay/deps/mult)
    [q.byk.bowl `[%mult da/now.bowl (sy (turn deps (lead %x)))]]
  ::
  ++  next-deps
    ^-  card
    %-  ~(warp-our pass:io /clay/deps/next)
    [q.byk.bowl `[%next %t da/now.bowl /keep]]
  ::
  ++  info-deps
    |=  [deps=(list path) =desk]
    ^-  card
    %-  ~(arvo pass:io /clay/info/[desk])
    :*  %c  %info  desk  %&
        %+  turn  (skim deps |=(=path =((rear path) %hoon)))
        |=  =path
        [path `miso:clay`[%ins txt/!>(~[.^(@t cx/(scry:io q.byk.bowl path))])]]
    ==
  ::
  ++  info-dude
    |=  [=desk =dude code=cord]
    ^-  (list card)
    :-  %-  ~(warp-our pass:io /clay/dude/[desk]/[dude])
        [desk `[%next %x da/now.bowl /app/[dude]/hoon]]
    ::
    %-  drop
    %+  bind  (rush code parse-agent)
    |=  wrapped=_code
    %-  ~(arvo pass:io /clay/info/[desk]/[dude])
    :*  %c  %info  desk  %&
        ~|  [%rash-crash desk=desk dude=dude code=code]
        [/app/[dude]/hoon %mut txt/!>(~[wrapped])]~
    ==
  --
::
++  state-type
  |%
  +$  current  [%1 state]
  +$  versioned
    $%  $:  %0
            kept=(map [dude ship] [data=noun time=@da])
            live=(set dude)
            able=(each (set ship) (set ship))
            into=(set desk)
            auto=(mip dude (unit ship) @dr)
            last=(mip dude (unit ship) @da)
        ==
        current
    ==
  +$  upgrade
    $&  versioned
    |=  old=versioned
    ^-  current
    ?-  -.old
      %0  [%1 +.old(into ~)]
      %1  old
    ==
  --
::
++  json
  =,  enjs:format
  |_  state=current:state-type
  ++  website
    |=  [type=cord diff=^json]
    ^-  card
    %-  fact:agentio  :_  ~[/website]
    :-  %json  !>  ^-  ^json
    %-  pairs 
    :~  [%type s+type]
        [%diff diff]
        :-  %state
        %-  pairs
        :~  [%saved a/(turn ~(tap bi last.state) da:event)]
            [%agents a/(turn ~(tap in live.state) (lead %s))]
        ::
            :+  %desks
              %a
            %+  turn  ~(tap by into.state)
            |=([=desk =(set dude)] (frond desk a/(turn ~(tap in set) (lead %s))))
        ::
            :+  %auto
              %a
            %+  turn  ~(tap bi auto.state)
            |=([=dude =(unit @p) =@dr] (dr:event dude unit `dr))
        ::
            :+  %backups
              %a
            %+  turn  ~(tap by kept.state)
            |=([[=dude =@p] [* =@da]] (da:event dude `p da))
        ::
            :-  %whitelist
            %-  pairs
            :~  [%on b/-.able.state]
                [%in a/(turn ~(tap in p.able.state) ship)]
    ==  ==  ==
  ::
  ++  event
    |%
    ++  da
      |=  [dap=dude place=(unit @p) time=@da]
      ^-  ^json
      (pairs ~[agent/s/dap ship/(bindcast place ship) time/(sect time)])
    ::
    ++  dr
      |=  [dap=dude place=(unit @p) freq=(unit @dr)]
      ^-  ^json
      %-  pairs
      :~  [%agent s/dap]
          [%ship (bindcast place ship)]
          [%freq (bindcast freq (corl numb (curr div ~s1)))]
      ==
    ::
    ++  ok
      |=  [dap=dude =@p sent=@da kept=@da]
      ^-  ^json
      (pairs ~[agent/s/dap ship/(ship p) sent/(sect sent) kept/(sect kept)])
    --
  --
--
