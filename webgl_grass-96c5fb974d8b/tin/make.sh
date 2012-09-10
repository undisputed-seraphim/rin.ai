#!/usr/bin/env sh

#    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
#    :license: GNU AGPL3, see LICENSE for more details.

here=`dirname $0`
name="interpolate"
rm -f $here/_$name.o $here/$name.so
gcc -c -fPIC $here/$name.c -o $here/_$name.o -I$here
gcc -shared -Wl,-soname,$name.so -o $here/$name.so $here/_$name.o
rm -f _$name.o
