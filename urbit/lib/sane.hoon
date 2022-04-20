::  Missing utilities to keep me from screaming into the void too often.
::
^?
|%
++  catunits
  |*  xs=(list (unit))
  =>  .(xs (homo xs))
  ^-  (list _?>(?=(^ xs) (need i.xs)))
  (murn xs same)
::
++  bindcast
  |*  [a=(unit) b=gate]
  ^+  (b)
  ?~  a  ~
  (b u.a)
::
++  putunit
  |*  [=(map) key=* =(unit)]
  ^+  map
  ?~  unit
    (~(del by map) key)
  (~(put by map) key +.unit)
::
++  isnull  |=  *  ^-  ?  =(~ +<)
::
++  update
  |*  [=(map) key=* f=$-((unit) (unit))]
  ^+  map
  (putunit map key (f (~(get by map) key)))
::
++  first
  |*  [a=(unit) b=(unit)]
  ^-  %-  unit
      $?  _?>(?=(^ a) u.a)
          _?>(?=(^ b) u.b)
      ==
  ?~  a  b  a
::
++  writer
  |*  [a=(quip) f=$-(* (quip))]
  =/  b  (f +.a)
  ^+  b
  [(weld -.b -.a) +.b]
::
++  tell
  |*  tale=*
  |*  a=*
  ^-  (quip _tale _a)
  [~[tale] a]
::
::++  testupdate
::|^
::=/  =(map cord atom)  (my ~[['foo' 4] ['bar' 5]])
::%^  update  map  'foo'
::|=  x=(unit @)
::^-  (unit @)
::~
::::
::++  update
::  |*  [=(map) key=* f=$-((unit) (unit))]
::  ^+  map
::
::  ?~  val=`(unit)`(f (~(get by map) key))
::    (~(del by map) key)
::  (~(put by map) key u.val)
::--
:: ++  when
::   |=  [cond=? =_tell]
::   ^+  tell
::   ?:  cond  tell
::
::
++  testwrite
  %.  %foo
  ;~  writer
    (tell 'bar')
    (tell 'baz')
  ==
--
