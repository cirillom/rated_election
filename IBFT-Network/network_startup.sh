#!/bin/bash

# Start Node-1 in a new terminal and output to console as well as to a log file
gnome-terminal --title="Node-1" -- bash -c "cd Node-1 && besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,WEB3,DEBUG,IBFT --host-allowlist='*' --rpc-http-cors-origins='all' --profile=ENTERPRISE | tee node1_output.log"

# Initialize attempt counter
attempt=1
max_attempts=5
ENODE_URL=""

# Loop to check for the Enode URL up to 5 times
while [ $attempt -le $max_attempts ]; do
  # Wait a few seconds before each attempt to give Besu time to log the URL
  sleep 10

  # Try to extract the Enode URL
  ENODE_URL=$(grep -oP 'Enode URL \K(enode://[a-fA-F0-9]+@[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+)' Node-1/node1_output.log)

  if [ -n "$ENODE_URL" ]; then
    echo -e "\e[32mNode-1 Enode URL found: $ENODE_URL\e[0m"
    break
  else
    echo -e "\e[31mAttempt $attempt: Enode URL not found yet, retrying...\e[0m"
  fi

  # Increment attempt counter
  ((attempt++))
done

# Check if Enode URL was found after max attempts
if [ -z "$ENODE_URL" ]; then
  echo -e "\e[31mEnode URL not found after $max_attempts attempts. Stopping all commands.\e[0m"
  
  # Kill all besu processes
  pkill -f besu
  
  exit 1
fi

# Use the Enode URL to start the other nodes in new terminals with custom titles, logging, and colored output
gnome-terminal --title="Node-2" -- bash -c "cd Node-2 && besu --data-path=data --genesis-file=../genesis.json --bootnodes=$ENODE_URL --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,WEB3,DEBUG,IBFT --host-allowlist='*' --rpc-http-cors-origins='all' --rpc-http-port=8546 --profile=ENTERPRISE | tee node2_output.log; exec bash"
gnome-terminal --title="Node-3" -- bash -c "cd Node-3 && besu --data-path=data --genesis-file=../genesis.json --bootnodes=$ENODE_URL --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist='*' --rpc-http-cors-origins='all' --rpc-http-port=8547 --profile=ENTERPRISE | tee node3_output.log; exec bash"
gnome-terminal --title="Node-4" -- bash -c "cd Node-4 && besu --data-path=data --genesis-file=../genesis.json --bootnodes=$ENODE_URL --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist='*' --rpc-http-cors-origins='all' --rpc-http-port=8548 --profile=ENTERPRISE | tee node4_output.log; exec bash"
