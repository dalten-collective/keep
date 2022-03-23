|%
+$  dude  dude:gall
+$  card  card:agent:gall
::
++  poke
  |%
  +$  agent
    $%  [%init dap=dude key=term]   :: Initiate new keeper
        [%grab dap=dude key=term]   :: Request old backup
    ==
  ::
  +$  wrapper
    $%  [%save to=ship]             :: Make backup
        [%mend from=ship]           :: Initiate recovery
        [%data data=noun key=term]  :: Recovered state
    ==
  --
--
