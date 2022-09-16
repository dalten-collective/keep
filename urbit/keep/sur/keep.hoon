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
        [%able (each ship ship)]
        [%wyte on=?]
        [%copy to=desk]
    ==
  ::                                           :: To the wrapper.
  +$  wrap                                     ::
    $%  [%once to=(unit ship)]                 :: Backup to a ship or the put dir
        [%many to=(unit ship) freq=(unit @dr)] :: Repeat backup
        [%mend from=ship]                      :: Initiate recovery
        [%data data=noun key=term]             :: Old state and secret (internal only)
        [%live live=?]                         :: (De)activate. Deact before uninstall!
    ==
  --
--
