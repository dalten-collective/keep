::  keep: backup manager
::
/+  dbug, *mip, verb
/=  default-agent  /keep/lib/default-agent
/=  agentio        /keep/lib/agentio
/=  sane           /keep/lib/sane
/=  keep-sur       /keep/sur/keep
=,  keep-sur
=,  sane
::
=>
  |%
  +$  versioned-state
    $%  state-0
    ==
  ::
  +$  state-0
    $:  %0
        kept=(map [dude ship] [data=noun time=@da])
        live=(set dude)
        able=(each (set ship) (set ship))
        into=(set desk)
        auto=(mip dude (unit ship) @dr)
        last=(mip dude (unit ship) @da)
    ==
  ::
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
%+  verb  &
=|  state-0
=*  state  -
^-  agent:gall
::
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
    whitelisted  |(?=(%| -.able) (~(has in p.able) src.bowl))
    send
      |=  [dap=dude to=(unit ship)]
      %.  [dap keep/!>(`wrap:poke`send/to)]
      %~  poke-our  pass:io
      send/dap^(path-of to)
::
++  on-save  !>(state)
::
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  =.  state  !<(state-0 old)
  :_  this
  %+  turn  ~(tap in into)
  |=  =desk
  (~(poke-self pass:io /trigger/[desk]) keep-agent/!>(`agent:poke`copy/desk))
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
    ~[(website-card 'agent' s+dap.cmd)]
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
        ::TODO emit json  `(~(auto json state) dap.cmd to.cmd freq.cmd)
        ?^  new=(bind (both prev freq.cmd) (cork add wait:behn))
          new  ::  set next later
        (bind freq.cmd |=(* (wait:behn now.bowl)))  :: set next now
    ==
  ::
  ::  Successful backup
      %okay
    `this  ::TODO emit JSON (~(success json state) src.bowl (~(got bi last) dap.cmd `src.bowl time.cmd))
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
    =.  into  (~(put in into) to.cmd)
    :_  this
    :~  (website-card 'copied-deps' s/to.cmd)
    ::
        =/  base-now  /(scot %p src.bowl)/base/(scot %da now.bowl)
        =/  keep-now  /(scot %p src.bowl)/[q.byk.bowl]/(scot %da now.bowl)
        %-  ~(arvo pass:io /copy/[to.cmd])
        :*  %c  %info  to.cmd  %&
            :-  =/  =path  /lib/skeleton/hoon  ::  Dependency management lol
                [keep/path %ins txt+!>(~[.^(@t cx/(weld base-now path))])]
            %+  turn
              ^-  (list path)
              :+  /mar/keep/hoon  /mar/json/hoon
              .^((list path) ct/(weld keep-now /keep))
            |=  =path
            [path %ins txt+!>(~[.^(@t cx/(weld keep-now path))])]
    ==  ==
  ==
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+    wire  (on-agent:def wire sign)
      [?(%copy %trigger) *]
    `this
  ::
      [%send term ^]
    ?.  ?=(%poke-ack -.sign)  (on-agent:def wire sign)
    ?^  p.sign                (on-agent:def wire sign)
    `this(last (~(put bi last) &2.wire (of-wire |2.wire) now.bowl))
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
    :~  (website-card 'backup' (json-backup now.bowl dap src.bowl))
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
  ~[(website-card 'initial' ~)]
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?.  ?=([%x %desks *] path)  ~
  :^  ~  ~  %json  !>  ^-  ^json
  :-  %a
  %+  turn
    ~(tap in .^((set desk) cd+/(scot %p our.bowl)/base/(scot %da now.bowl)))
  (lead %s)
::
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%behn term ^] wire)  (on-arvo:def wire sign-arvo)
  (on-poke keep-agent/!>(`agent:poke`[%once &2.wire (of-wire |2.wire)]))
::
++  on-init   on-init:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
::
|%
++  website-card
  |=  [event=@t diff=^json]
  ^-  card
  %-  fact:agentio  :_  ~[/website]
  :-  %json  !>  ^-  ^json
  =,  enjs:format
  %-  pairs
  :~  [%type s+event]
      [%diff diff]
      :-  %state
      %-  pairs
      :~  ['agents' a/(turn ~(tap in live) (lead %s))]
          ['desks' a/(turn ~(tap in into) (lead %s))]
      ::
          :-  'backups'
          a/(turn ~(tap by kept) |=([to=[@ @p] [* =@da]] (json-backup da to)))
      ::
          :-  'whitelist'
          (pairs ~[['on' b/-.able] ['in' a/(turn ~(tap in p.able) ship)]])
  ==  ==
::
++  json-backup
  |=  [=@da =dude =@p]
  ^-  ^json
  =,  enjs:format
  (pairs ~[ship+(ship p) agent+s+dude time+(sect da)])
::
++  json
  =,  enjs:format
  |_  state=state-0
  ++  initial  (website-card 'initial' ~)
  ::
  ++  saved
    |=  new=[dude (unit @p) @da]  (website-card 'saved' (json-da new))
  ::
  ++  auto
    |=  new=[dude (unit @p) (unit @dr)]  (website-card 'auto' (json-dr new))
  ::
  ++  restored
    |=  new=[dude (unit @p) @da]  (website-card 'restored' (json-da new))
  ::
  ++  malformed
    |=  [dude (unit @p) @da]  (website-card 'fail-restore' (json-da +<))
  ::
  ++  success
    |=  [=@p sent=@da kept=@da]
    %+  website-card  'success'
    (pairs ~[ship/(ship p) sent/(sect sent) kept/(sect kept)])
  ::
  ++  website-card
    |=  [event=@t diff=^json]
    ^-  card
    =;  json-state=^json
      :*  %give  %fact  ~[/keep/website]  %json
          !>((pairs ~[[%type s+event] [%diff diff] [%state json-state]]))
      ==
    %-  pairs
    :~  [%saved a+(turn ~(tap bi last.state) json-da)]
    ::
        :+  %auto
          %a
        %+  turn  ~(tap bi auto.state)
        |=([=dude =(unit @p) =@dr] (json-dr dude unit `dr))
    ==
  ::
  ++  json-da
    |=  [dap=dude place=(unit @p) prev=@da]
    ^-  ^json
    (pairs ~[['app' s/dap] ['ship' (bindcast place ship)] ['time' (sect prev)]])
  ::
  ++  json-dr
    |=  [dap=dude place=(unit @p) freq=(unit @dr)]
    ^-  ^json
    %-  pairs
    :~  ['app' s/dap]
        ['ship' (bindcast place ship)]
        ['freq' (bindcast freq (corl numb (curr div ~s1)))]
    ==
  --
--
