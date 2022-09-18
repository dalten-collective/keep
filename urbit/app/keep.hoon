::  keep: backup manager
::
/+  dbug
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
    io    ~(. agentio bowl)
    whitelisted  |(?=(%| -.able) (~(has in p.able) src.bowl))
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
        =/  keep-now  /(scot %p src.bowl)/keep/(scot %da now.bowl)
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
        %+  ~(poke pass:io /okay/(scot %p src.bowl)/[dap])  [src.bowl dap]
        keep/!>(`wrap:poke`okay/now.bowl)
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
  :-  ~  :-  ~  :-  %json  !>  ^-  json
  :-  %a
  %+  turn
    ~(tap in .^((set desk) cd+/(scot %p our.bowl)/base/(scot %da now.bowl)))
  (lead %s)
::
++  on-init   on-init:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
::
|%
++  website-card
  |=  [event=@t diff=json]
  ^-  card
  %-  fact:agentio  :_  ~[/website]
  :-  %json  !>
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
  ^-  json
  =,  enjs:format
  (pairs ~[ship+(ship p) agent+s+dude time+(sect da)])
--
