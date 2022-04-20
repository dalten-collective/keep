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
    %+  corl  $<(%data wrapper)
    =,  dejs:format
    %-  of
    :~
      [%once (ot ~[['to' (se %p)]])]
      [%many (ot ~[['to' (se %p)] ['freq' (cu (lift (cury mul ~s1)) (mu ni))]])]
      [%mend (ot ~[['from' (se %p)]])]
    ==
  --
--
