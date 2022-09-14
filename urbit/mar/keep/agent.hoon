::
::  keep agent pokes
::
/-  *keep
|_  =agent:poke
++  grad  %noun
++  grow
  |%
  ++  noun  agent
  --
++  grab
  |%
  ++  noun  agent:poke
  ++  json
    %+  corl  $<(?(%init %grab) agent:poke)
    =,  dejs:format
    %-  of
    :~  [%tell (ot ~[['dap' so] ['live' bo]])]
        [%able (ot ~[able+bo ship+(se %p)])]
        [%wyte bo]
        [%copy so]
    ==
  --
--
