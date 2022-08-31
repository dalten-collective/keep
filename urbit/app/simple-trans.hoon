/+  default-agent, verb, dbug, twice, trans
::
%+  trans:trans  twice/twice
%+  verb  &
%-  agent:dbug
::
=|  count=@ud
::
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this |) bowl)
::
++  on-init  ~&  >  counter=count  on-init:def
++  on-save  !>(count)
::
++  on-load
  |=  old=vase
  =.  count  !<(@ud old)
  ~&  >  counter=count
  `this
::
++  on-poke
  |=  [=mark =vase]
  ?>  ?=(%inc mark)   
  =.  count  +(count)
  ~&  >  counter=count
  `this
::
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-peek   on-peek:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
