::
::  keep wrapper pokes
::
/=  sur  /keep/sur/keep
=,  sur
::
|_  =wrap:poke
++  grad  %noun
++  grow
  |%
  ++  noun  wrap
  --
++  grab
  |%
  ++  noun  wrap:poke
  ++  json
    %+  corl  $<(%data wrap:poke)
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
