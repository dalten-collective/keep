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
        [%tell dap=dude]                :: Register wrapped agent
    ==
  ::                                    :: To the wrapper.
  +$  wrapper                           ::
    $%  [%once to=ship]                 :: Backup
        [%many to=ship freq=(unit @dr)] :: Repeat backup
        [%mend from=(each path ship)]   :: Initiate recovery
        [%data data=noun key=term]      :: Old state and secret (internal only)
        [%live live=?]                  :: (De)activate. Deact before uninstall!
    ==
  --
--
