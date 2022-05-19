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
++  bindfall
  |*  [a=(unit) b=* f=gate]
  ^+  (f)
  (fall (bind a f) b)
::
++  putunit
  |*  [=(map) key=* =(unit)]
  ^+  map
  ?~  unit
    (~(del by map) key)
  (~(put by map) key +.unit)
::
++  contains
  |*  [a=* =(list)]
  ^-  ?
  !(isnull (find [a ~] list))
::
++  delete
  |*  [a=* =(list)]
  ^+  list
  (skip list (cury test a))
::
++  leadif
  |*  [cond=? a=*]
  ?.  cond  same
  (lead a)
::
++  isnull  |=  *  ^-  ?  =(~ +<)
::
++  unzip
  |*  a=(list (pair))
  %+  reel  a
  |*  [i=(pair) b=(list _?>(?=(^ a) p.i.a)) c=(list _?>(?=(^ a) q.i.a))]
  [[p.i b] [q.i c]]
::
++  diff
  |*  [xs=(list) ys=(list)]
  ^+  xs
  (skip xs (curr contains ys))
::
++  uncurry
  |*  f=$-(* $-(* *))
  |*  [a=_+<:f b=_+<:(f)]
  ^+  ((f))
  ((f a) b)
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
:: ++  roll-write
::   |*  [=(list) f=(arg-writer)]
::   ^+  (f)
::   %+  roll  list
::   |:  [arg=+<-:f prev=`_(f)``+<+:f]
::   (write prev (cury f arg))
::
:: ++  moll
::   |*  a=$-([* $-()])
::   |*  [adapter=$ xs=(list) f=_=>(~ |=([* *] +<+))]
::   ^+  ,.+<+.b
::
::
::   |*  [a=(list) b=_=>(~ |=([* *] +<+))]
::   |-  ^+  ,.+<+.b
::   ?~  a
::     +<+.b
::   $(a t.a, b b(+<+ (b i.a +<+.b)))
::
++  testwrite
  =/  w  (writing ,@t ,@ud)
  ;<  =@ud  bind:w  get:w
  ;<  ~     bind:w  (tell:w (gulf ud (add ud 5)))
  (pure:w +(ud))
::
++  writing
  |*  [w=mold s=mold]
  |%
  ++  writer
    |$  [a]
    ::$_  ^|
    ::|=  s  [*a *(list w) s]
    $-  s  [a (quip w s)]
  ::
  ++  pure
    |*  a=*
    ^-  (writer _a)
    |=  =s
    [a `s]
  ::
  ++  bind
    |*  a=mold
    |*  [m=(writer a) f=$-(a (writer))]
    ^-  (writer)
    |=  =s
    =+  `[=a w=(list w) =_s]`(m s)
    =+  `[b=* w=(list ^w) =_s]`((f a) s)
    [b (weld ^w w) s]
  ::
  ++  get
    ^-  (writer s)
    |=  =s
    [s `s]
  ::
  ++  put
    |=  =s
    ^-  (writer ~)
    |=  ^s
    ``s
  ::
  :: ++  write
  ::   |=  =(quip w s)
  ::   ^-  (writer s)
  ::   ;<  ~  bind  (tell -.quip)
  ::   ;<  ~  bind  (put +.quip)
  ::   (pure +.quip)
  ::
  ++  tell
    |=  =(list w)
    ^-  (writer ~)
    |=  =s
    `[list s]
  ::
  :: ++  all
  ::   |=  =(quip w s)
  ::   ^-  (writer ~)
  ::   %+  foobar  (tell -.quip)
  ::   (put +.quip)
  :: ::
  :: ++  throw
  ::   |=  m=(writer)
  ::   ^-  (writer ~)
  ::   ((bind *) m |=(* (pure ~)))
  ::
  :: ++  foobar
  ::   |*  [m=(writer ~) n=(writer)]
  ::   ^+  n
  ::   %+  ^|((bind *))  m
  ::   |=  *  n
  --
::
++  arg-writer
  |$  [a s w]
  $-  [a s]  (quip w s)
::
:: ++  writeput
::   |*  [a=(quip) f=$-(*)]

::
++  write
  |*  a=mold
  |*  [[=a =(quip)] f=$-(a [* (quip)])]
  ^+  (f)
  =+  (f a)
  [-< (weld -.quip ->-) ->+]
::
++  discard
  |*  [a=(quip) f=$-(* (list))]
  ^+  a
  [(weld -.a (f)) +.a]
::
++  tell2
  |*  xs=(list)
  |*  s=*
  ^-  (quip _?>(?=(^ xs) i.xs) _s)
  [xs s]
  ::^-  (writer)
  ::(lead list)
::
++  tells  lead
::
++  putter
  |*  =(quip)
  |*  _+.quip
  quip
::
++  curry
  |*  f=$-(^ *)
  |*  a=_+<-:f
  (cury f a)
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
--
