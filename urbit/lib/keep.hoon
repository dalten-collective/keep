::  keep: agent wrapper for backups
::
::  usage: %-(agent:keep your-agent)
::
/-  *keep
/+  default-agent, *sane, agentio, multipart, verb
::
|%
::  This is the meat of the logic. The rest is bookkeeping and logistics.
::  The agent is the agent to be restored from the backup. The bowl is the
::  bowl that the agent will see, i.e. it should be stripped of keep's subs.
::
++  restore
  |=  [=agent:gall =bowl:gall]  |=  old=backup
  ^-  (quip card _agent)
  =.  agent  ~(. agent bowl)
  =^  cards0  agent  (on-load:agent [-:on-save:agent state.old])
  ::
  =^  cards1=(list card)  agent
    %+  roll  (diff ~(tap by wex.old) ~(tap by wex.bowl))
    |:  *[[[=wire =ship *] *] caz=(list card) ag=_agent]
    =-  [(weld caz -.-) +.-]
    ?-  res0=(mule |.((on-agent:ag(src.+< ship) wire %kick ~)))
        [%& *]  p.res0
        [%| *]
      %+  fall  (mole |.((on-fail:ag %kick leaf/"closing subsciption" p.res0)))
      `ag
    ==
  ::
  =^  cards2=(list card)  agent
    %+  roll  (diff ~(tap by sup.old) ~(tap by sup.bowl))
    |:  *[[* =ship =path] caz=(list card) ag=_agent]
    =-  [(weld caz -.-) +.-]
    ?-  res0=(mule |.((on-leave:ag(src.+< ship) path)))
        [%& *]  p.res0
        [%| *]
      %+  fall  (mole |.((on-fail:ag %leave p.res0)))
      `ag
    ==
  ::
  =/  cards3=(list card)
    %+  turn  (diff ~(tap by sup.bowl) ~(tap by sup.old))
    |=  [* =ship =path]  [%give %kick ~[path] `ship]
  ::
  =/  cards4=(list card)
    %+  turn  (diff ~(tap by wex.bowl) ~(tap by wex.old))
    |=  [[=wire =ship =dude] *]  [%pass wire %agent [ship dude] %leave ~]
  ::
  :_  agent
  :(weld cards0 cards1 cards2 cards3 cards4)
::
+$  backup  [wex=boat:gall sup=bitt:gall state=*]
+$  versioned-state
  $%  state-0
  ==
::
+$  state-0
  $:  %0
      live=_|
      last=(map (unit ship) @da)
      auto=(map (unit ship) @dr)
      pending=(map ship [?(%invite %restore) term])
  ==
::
++  agent
  |=  =agent:gall
  ::
  =|  state-0
  =*  state  -
  %+  verb  &
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
      io    ~(. agentio bowl)
      rest  |=  u=(unit ship)
            ~(rest pass:io keep/rest/?~(u /put /ship/(scot %p u.u)))
      wait  |=  u=(unit ship)
            ~(wait pass:io keep/wait/?~(u /put /ship/(scot %p u.u)))
      tell  (~(poke-our pass:io /keep/tell) %keep keep-agent+!>(tell+dap.bowl))
      upload-path
        /apps/keep/[dap.bowl]/upload
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card agent:gall)
    =*  call-inner
      =^  cards  agent  (on-poke:ag mark vase)
      [cards this]
    ::
    ?.  ?=(?(%keep %handle-http-request) mark)  call-inner
    ?:  ?=(%handle-http-request mark)
      ?>  =(src.bowl our.bowl)
      ?>  live
      =/  req  !<([@ta inbound-request:eyre] vase)
      ?.  =([~ 0] (find upload-path (rash url.request.+.req stap)))
        call-inner
      =/  [res=(unit agent:gall) cards=(list card)]
        (handle-http-request req (restore agent dish))
      ?~  res
        :_  this
        :_  cards
        (~(malformed json state) ~ now.bowl)
      :_  this(agent u.res)
      :_  cards
      (~(restored json state) ~ now.bowl)
    ::
    =/  cmd  !<(wrapper:poke vase)
    ?-  -.cmd
    ::  Back up your state once
        %once
      ?>  live
      ?>  =(src.bowl our.bowl)
      ::
      =/  paths
        ?~  to.cmd  ~
        %+  murn  ~(val by sup.bowl)
        |=  [=ship =path]
        ?.  =(ship u.to.cmd)  ~
        `path
      ::  Possible to back up now?
      ?:  ?&(?=(^ to.cmd) ?=(~ paths))
        ::  No. Initiate new connection.
        =/  key  (scot %uv (sham eny.bowl))
        =.  pending  (~(put by pending) u.to.cmd %invite key)
        :_  this
        :~  (~(try-invite json state) u.to.cmd)
            %+  ~(poke pass:io /keep/init/(scot %p u.to.cmd))  u.to.cmd^%keep
            keep-agent+!>([%init dap.bowl key])
        ==
      ::  Yes. Give the fact or write to put and set new timers.
      =/  backup  [wex.dish sup.dish +:on-save:ag]
      =/  freq  (~(get by auto) to.cmd)
      =/  prev  (~(get by last) to.cmd)
      =.  last  (~(put by last) to.cmd now.bowl)
      ::
      :_  this
      %-  catunits
      :~  (bind (both `now.bowl freq) (cork add (wait to.cmd))) :: set next
          (bind (both prev freq) (cork add (rest to.cmd))) :: unset old next
          `(~(saved json state) to.cmd now.bowl)
          ?~  to.cmd
            `(drop our.bowl now.bowl dap.bowl backup)
          `(fact:io noun+!>(backup) paths)
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
    ::  Ask another ship for your state
        %mend
      ?>  live
      ?>  =(src.bowl our.bowl)
      =/  key  (scot %uv (sham eny.bowl))
      :_  this(pending (~(put by pending) from.cmd %restore key))
      :~  (~(try-restore json state) from.cmd)
          %+  ~(poke pass:io /keep/grab/(scot %p from.cmd))  [from.cmd %keep]
          keep-agent+!>(`agent:poke`grab+dap.bowl^key)
      ==
    ::  Load this back
        %data
      ?>  live
      ~|  %do-not-want
      ?>  =([%restore key.cmd] (~(got by pending) src.bowl))
      =.  pending  (~(del by pending) src.bowl)
      ?~  res=(mole |.(((restore agent dish) ;;(backup data.cmd))))
        :_  this
        ~[(~(malformed json state) `src.bowl now.bowl)]
      =^  cards  agent  u.res
      :_  this
      [(~(restored json state) `src.bowl now.bowl) cards]
    ::  Turn wrapper on or off
        %live
      ?>  =(our.bowl src.bowl)
      ?:  =(live live.cmd)  `this
      =.  live  live.cmd
      :_  this
      :-  ~(live json state)
      ?:  live
        ~[(~(connect pass:io /keep/eyre) `upload-path dap.bowl)]
      ~[(~(arvo pass:io /keep/eyre) %e %disconnect `upload-path)]
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
    [tell cards]
  ::
  ++  on-save
    ?.  live  on-save:ag
    !>([on-save:ag state])
  ::
  ++  on-load
    |=  old=vase
    ^-  (quip card agent:gall)
    ?^  our=(mole |.(!<([vase _state] old)))
      =^  their  state  u.our
      =^  cards  agent  (on-load:ag their)
      [[tell cards] this]
    =^  cards  agent  (on-load:ag old)
    [[tell cards] this]
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
    ?.  ?=(?(%keep %http-response) -.path)
      =^  cards  agent  (on-watch:ag path)
      [cards this]
    ::
    ?:  ?=([%http-response ^] path)  `this
    ?+  +.path  (on-watch:def path)
        [%website ~]
      ?>  =(src.bowl our.bowl)
      :_  this
      ~[~(initial json state)]
    ::
        [%data term ~]
      ~|  %didnt-ask
      ?>  =([%invite &3.path] (~(got by pending) src.bowl))
      =.  pending  (~(del by pending) src.bowl)
      (on-poke(src.+< our.bowl) %keep !>(`wrapper:poke`once+`src.bowl))
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
    ?+  +.wire  (on-arvo:def wire sign-arvo)
        [%eyre ~]
      ?>  ?=([%eyre %bound *] sign-arvo)
      %.  `this
      ?:  accepted.sign-arvo  same
      (slog leaf+"keep-wrapper-fail -binding-eyre-for-import" ~)
    ::
        [%wait ^]
      ?>  ?=([%behn %wake *] sign-arvo)
      ?^  error.sign-arvo  (on-arvo:def wire sign-arvo)
      %+  on-poke  %keep
      !>  ^-  wrapper:poke
      :-  %once
      ?+  +>.wire  (on-arvo:def wire sign-arvo)
        [%put *]        ~
        [%ship term *]  `(slav %p &4.wire)
      ==
    ==
  ::
  ++  on-fail
    |=  [=term =tang]
    ^-  (quip card agent:gall)
    =^  cards  agent  (on-fail:ag term tang)
    [cards this]
  --
::
++  drop
  |=  [our=ship now=@da dap=dude non=noun]
  :*  %pass   /keep/drop/(scot %da now)
      %agent  [our %hood]
      %poke   %drum-put
      !>  ^-  [path jam]
      :_  (jam non)
      ;:  welp
        /(scot %tas dap)
        /(scot %tas (crip "{(trip dap)}_bak_{(scow %da now)}"))
        /jam
      ==
  ==
::
++  handle-http-request
  |=  $:  [eyre-id=@ta auth=? secure=? =address:eyre =request:http]
          load=$-(backup (quip card agent:gall))
      ==
  |^  ^-  [(unit agent:gall) (list card)]
      ?+  method.request  `(reply)
          %'GET'  `(reply 200 "")
      ::
          %'POST'
        ?~  parts=(de-request:multipart [header-list body]:request)
          `(reply 400 "Missing data in POST. Complete the form!")
        =/  jams=(list jam)
          %+  murn  u.parts
          |=  [n=@t =part:multipart]
          ?.  =(n 'file')  ~
          [~ `jam`body.part]
        ?.  ?=([jam ~] jams)
          `(reply 400 "Bad amount of jam. Need exactly one. Try again!")
        ?~  res=(mole |.((load ;;(backup (cue i.jams)))))
          `(reply 400 "Corrupted backup file!")
        :-  `+.u.res
        (weld (reply 200 "Upload completed successfully!") -.u.res)
      ==
  ++  reply
    |=  [code=$~(405 @) err=tape]
    ^-  (list card)
    =/  paths  ~[/http-response/[eyre-id]]
    =/  load=simple-payload:http  [code^~ `(make-upload-page err)]
    =,  agentio
    :~  (fact http-response-header+!>(response-header.load) paths)
        (fact http-response-data+!>(data.load) paths)
        (kick paths)
    ==
  --
::
++  make-upload-page  
  |=  err=tape
  ^-  octs
  %-  as-octt:mimes:html
  %-  en-xml:html
  ^-  manx
  ;html
    ;head
      ;title:"%keep importer"
      ;meta(charset "utf-8");
      ;style:'''
             * { font-family: monospace; margin-top: 1em; }
             '''
    ==
    ::
    ;body
      ;h2:"%keep importer"
      ;+  ?^  err
            ;p: {err}
          ;p:"""
             Please make sure that the file you upload is a backup
             of the correct agent. We try our best to not load any
             malformed backups, but we cannot make guarantees. It
             is possible (but improbable) to make the agent unusable
             by restoring from a malformed backup. But then again,
             you were already restoring, so you probably didn't have
             anything to lose, did you?
             """
      ;form(method "post", enctype "multipart/form-data")
        ;label
          ;+  :/"Import file: "
          ;input
            =type             "file"
            =name             "file"
            =required         "";
        ==
        ;br;
        ;button(type "submit"):"Restore"
      ==
    ==
  ==
::
++  json
  =,  enjs:format
  |_  state=state-0
  ++  initial  (website-card 'initial' ~)
  ::
  ++  saved
    |=  new=[(unit @p) @da]  (website-card 'saved' (json-da new))
  ::
  ++  auto
    |=  new=[(unit @p) (unit @dr)]  (website-card 'auto' (json-dr new))
  ::
  ++  try-invite
    |=  =@p  (website-card 'pending' (json-pending [p %invite]))
  ::
  ++  try-restore
    |=  =@p  (website-card 'pending' (json-pending [p %restore]))
  ::
  ++  restored
    |=  new=[(unit @p) @da]  (website-card 'restored' (json-da new))
  ::
  ++  live  (website-card 'active' b+live.state)
  ::
  ++  malformed
    |=  [(unit @p) @da]  (website-card 'fail-restore' (json-da +<))
  ::
  ++  no-store
    |=  [(unit @p) @da]  (website-card 'fail-store' (json-da +<))
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
    ::
        :-  %auto
        a+(turn ~(tap by auto.state) |=([=(unit @p) =@dr] (json-dr unit `dr)))
    ::
        :+  %pending
          %a
        %+  turn  ~(tap by pending.state)
        |=  [=@p status=?(%invite %restore) *]
        (json-pending p status)
    ==
  ::
  ++  json-da
    |=  [place=(unit @p) prev=@da]
    ^-  ^json
    (pairs ~[['ship' (bindcast place ship)] ['time' (sect prev)]])
  ::
  ++  json-dr
    |=  [place=(unit @p) freq=(unit @dr)]
    ^-  ^json
    %-  pairs
    :~  ['ship' (bindcast place ship)]
        ['freq' (bindcast freq (corl numb (curr div ~s1)))]
    ==
  ::
  ++  json-pending
    |=  [=@p status=?(%invite %restore)]
    ^-  ^json
    (pairs ~[['ship' (ship p)] ['status' s+status]])
  --
--
