#!/bin/bash
set -e

echo "Make sure your desk is mounted!"

echo "(('export AGENT_PATH=your/path/here' to avoid this prompt))"

if [[ ${AGENT_PATH} && ${AGENT_PATH-x} ]]; then
  DESK_PATH=$AGENT_PATH
else
  while true; do    # TODO
    printf "\nEnter the path to your agent (like ~/urbit/keep-zod/gora): "
    read USER_PATH
    printf "\nYou entered: $USER_PATH. Okay? (y/n)"
    read -n 1 decision
    case $decision in
      [yY])
        printf "\nOkay."
        break
      ;; # contiue
      [nN]) # try again
    esac
  done
  DESK_PATH=$USER_PATH
fi

echo "copying mar files..."
cp ./urbit/mar/keep.hoon $DESK_PATH/mar/
cp ./urbit/mar/js.hoon $DESK_PATH/mar/
cp ./urbit/mar/json.hoon $DESK_PATH/mar/
echo "copying lib files..."
cp ./urbit/lib/keep.hoon $DESK_PATH/lib/
cp ./urbit/lib/sane.hoon $DESK_PATH/lib/
echo "copying sur file..."
cp ./urbit/sur/keep.hoon $DESK_PATH/sur/
echo "All files in place."

echo "Now add keep to /+ import and wrap with %-  agent:keep"
echo "And then |commit it, dummy."
