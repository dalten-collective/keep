::
::  keep wrapper pokes
::
/-  *keep
|_  =wrapper:poke
++  grad  %noun
++  grow
  |%
  ++  noun  wrapper
  --
++  grab
  |%
  ++  noun  wrapper:poke
  ++  json
    %+  corl  $<(%data wrapper:poke)
    =,  dejs:format
    %-  of
    :~
      [%once (se %p)]
      [%many (ot ~[['to' (se %p)] ['freq' (cu (lift (cury mul ~s1)) (mu ni))]])]
      [%mend (se %p)]
      [%live bo]
    ==
  --
--
