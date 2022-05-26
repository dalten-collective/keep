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
  =/  w  (writing ,@t ,@tas)

  %+  run:w  %a
::  ^-  (writer:w term)
  ;<  =@tas  bind:w  get:w
  ;<  ~      bind:w  (tell:w (gulf tas (add tas 5)))
::  %+  (bind:w ,~)  (put:w %bar)  |=  ~
  ;<  ~      bind:w  (put:w %bar)
  (pure:w %foo)
::
:: ++  roll-write
::   |*  [bind=$-([* gate] *) xs=(list) f=$-([* *] *)]
::   ^+  (f)
::   %+  roll  xs
::   |:  [arg=_+<-:f ]
::
:: ++  turn-monad
::   |*  [a=mold m=monad]
::   |*  [xs=(list) f=$-(* (m:m a))]
::   =>  .(xs (turn xs f))
::   |-  ^-  (m:m (list a))
::   ?~  xs  (pure:m ~)
::   ;<  =a  bind:m  i.xs
::   ;<  as=(list ^a)  bind:m  ^$(xs t.xs)
::   (pure:m [a as])
:: ::
:: ++  test
::   |%
::   ++  unit-m  ~
::   ::   =/  m  unit-monad
::   ::   =/  =(map @ud @ud)  (my ~[[1 3] [2 2] [3 420]])
::   ::   ;<  a=@  bind:m  (~(get by map) 1)
::   ::   ;<  *  bind:m  (~(get by map) a)
::   ::   a
::   :: ::
::   ++  list-m  ~
::   ::   =/  m  list-monad
::   ::   =/  =(map @t tape)  (my ~[[%a "foo"] [%f "bar"] [%o "baz"]])
::   ::   ;<  a=@t  bind:m  (~(got by map) %a)
::   ::   ;<  b=@t  bind:m  (~(got by map) a)
::   ::   (pure:m b)
::   ::
::   ++  turn-m
::     ::^-  (^unit (^list @p))
::     %+  (turn-monad @p unit-monad)  `(list @ud)`~[1 2 3 4 5]
::     |=  =@ud
::     ^-  (unit @p)
::     =-  ~&  >  [in=ud out=-]  -
::     ?:  =(ud 4)  `~wicrum
::     ``@p`ud
::   --
::
:: ++  unit-monad
::   %-  ~(make monad unit)
::   |%
::   ++  pure  some
::   ++  fmap  ^bind
::   ++  bind  _biff
::   --
::
++  list-monad
  %-  ~(make monad list)
  |%
  ++  pure  |*(a=* `(list _a)`~[a])
  ++  fmap  turn
  ++  bind
    |*  a=mold
    |*  [xs=(list a) f=$-(a (list))]
    ^+  (f)
    (zing (turn xs f))
  --
::
++  monad  ::  Look at monoid on L276 when you return to this!
  =<  ,[m=$-(mold mold) form]
  =|  type=$-(mold mold)
  |@
  ++  make
    |*  item=form
    [m=type item]
  ::
  +$  form
    $_  ^?
    |%
    ++  pure
      |*  a=*
      *(type _a)
    ::
    ++  fmap
      |*  [ma=(type) f=gate]
      *(type _(f))
    ::
    ++  bind
      |~  a=mold
      |~  [ma=(type a) f=$-(a (type))]
      (f)
    --
  --
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
    :: ^+  (f)
    |=  =s
    =+  `[=a w=(list w) =_s]`(m s)
    =+  `[b=* w=(list ^w) =_s]`((f a) s)
    [b (weld ^w w) s]
  ::
::   ++  bindwrite
::     |*  a=mold
::     |*  make=$-(* (writer a))
::     |*  [input=_+<:make f=$-(a (writer))]
::     ^-  (writer)
::     |=  =s
::     =+  `[=a w=(list w) =_s]`((make input) s)
::     =+  `[b=* w=(list ^w) =_s]`((f a) s)
::     [b (weld ^w w) s]
:: ::    ;<  =s  bind  (write quip)
:: ::    (f s)
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
  ++  tell
    |=  =(list w)
    ^-  (writer ~)
    |=  =s
    `[list s]
  ::
  ++  write
    |=  =(quip w s)
    ^-  (writer s)
    |=  s
    [+.quip -.quip +.quip]
  ::
  ++  seq
    |*  [m=(writer) n=(writer)]
    ^+  n
    |=  =s
    =+  `[* w=(list w) =_s]`(m s)
    =+  `[b=* w=(list ^w) =_s]`(n s)
    [b (weld ^w w) s]
  ::
  ++  run
    |*  [=s =(writer)]
    ^-  (quip w ^s)
    +:(writer s)
  ::
  ++  rundef
    |*  =writer
    ^-  (quip w s)
    (run *s writer)
  ::
  :: ++  all
  ::   |=  =(quip w s)
  ::   ^-  (writer ~)
  ::   %+  foobar  (tell -.quip)
  ::   (put +.quip)
  --
::
++  curry
  |*  f=$-(^ *)
  |*  a=_+<-:f
  (cury f a)
::
++  testmonoid
  |*  mon=(type:monoid)
  |*  a=m:mon
  (plus:mon a a)
::
++  example
  ^-  (type:monoid @)
  %-  (make:monoid @)
  |%
  ++  plus  add
  --
::
++  monoid
  |%
  ++  type
    |$  [a]
    [m=mold (form a)]
  ::
  ++  make
    |*  a=mold
    |=  item=(form a)
    [m=a item]
  ::
  ++  form
    |*  a=mold
    $_  ^?
    |%
    ++  plus  *$-([a a] a)
    --
  --
--
