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
    %+  corl  $>(%tell agent:poke)
    =,  dejs:format
    (of ~[['tell' (ot ~[['dap' so] ['live' bo]])]])
  --
--
