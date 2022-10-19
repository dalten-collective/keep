^?
|%
+$  dude  dude:gall
+$  card  card:agent:gall
::
++  poke
  |%                                                      :: To the agent.
  ++  agent                                               ::
    |%                                                    ::
    +$  user                                              :: From the user:
      $%  [%able (each ship ship)]                        :: De/whitelist
          [%wyte on=?]                                    :: Toggle whitelist
          [%wrap =desk =dude]                             :: Wrap agent
          [%once dap=dude to=(unit ship)]                 :: Back up once
          [%many dap=dude to=(unit ship) freq=(unit @dr)] :: Repeat backup
      ==                                                  ::
    +$  internal                                          :: Internal cmds:
      $%  [%init dap=dude key=term]                       :: Initiate as keeper
          [%grab dap=dude key=term]                       :: Request old backup
          [%tell dap=dude]                                :: Register wrapped agent
          [%okay dap=dude time=@da]                       :: Ack backup
      ==
    --
  +$  wrap                                                :: To the wrapper
    $%  [%send to=(unit ship)]                            :: Send backup (internal)
        [%mend from=ship]                                 :: Initiate recovery
        [%data data=noun key=term]                        :: Old state and secret (internal only)
    ==
  --
--
