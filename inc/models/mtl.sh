#!/bin/sh 
# Sequential rename - rename screen shot images sequentially
 
if [ $# -ne 1 ] ; then
   echo "Usage: $(basename $0) replacement-pattern-"
   exit 1
fi

count="1"
model="$1.mtl"

for filename in $(ls -tr "$1"/*_*mtl | sed 's/ /__/g')
do
   newname="$1_`printf "%06d" $count`.mtl"
   echo "cp \"$model\" to $newname"
   cp -f "$1/$model" "$1/$newname"
   count=$(( $count + 1 ))
done
 
exit 0
