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
      [%once (mu (se %p))]
      [%mend (se %p)]
      [%live bo]
      :-  %many
      (ot ~[[%to (mu (se %p))] [%freq (cu (lift (cury mul ~s1)) (mu ni))]])
    ==
  --
--
