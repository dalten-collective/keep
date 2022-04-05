^?
|%
+$  dude  dude:gall
+$  card  card:agent:gall
::
++  poke
  |%                                    :: To the agent.
  +$  agent                             ::
    $%  [%init dap=dude key=term]       :: Initiate agent as keeper
        [%grab dap=dude key=term]       :: Request old backup
    ==
  ::                                    :: To the wrapper.
  +$  wrapper                           ::
    $%  [%once to=ship]                 :: Backup
        [%many to=ship freq=(unit @dr)] :: Repeat backup
        [%mend from=ship]               :: Initiate recovery
        [%data data=noun key=term]      :: Recovered state and secret
    ==
  --
--
