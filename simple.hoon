/+  default-agent, verb, dbug, keep
::
|%  +$  card  card:agent:gall  --
::
%-  agent:keep
%+  verb  &
%-  agent:dbug
^-  agent:gall
::
=/  count  *@ud
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
  :-  ~
  %=  this
    count  =-  ~&  >  counter=-  -  !<(@ud old)
  ==
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  ?=(%inc mark)   
  :-  ~
  %=  this
    count  =-  ~&  >  counter=-  -  +(count)
  ==
::
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-peek   on-peek:def
++  on-watch  on-watch:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
