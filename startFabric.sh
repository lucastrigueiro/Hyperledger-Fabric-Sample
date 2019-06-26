#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

# chaincode runtime language is node.js
CC_RUNTIME_LANGUAGE=node
# chaincode runtime language is javascript
CC_SRC_PATH=/opt/gopath/src/github.com/fabcar/javascript

# clean the keystore
rm -rf ./hfc-key-store

# clean the wallet
# rm -rf ./server/wallet/*

# launch network; create channel and join peer to channel
cd ./network

./stop.sh
./teardown.sh
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
docker-compose -f ./docker-compose.yml up -d cli
docker ps -a

 
CORE_PEER_MSPCONFIGPATH="CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"

CORE_PEER_LOCALMSPID="CORE_PEER_LOCALMSPID=Org1MSP"

ENVIRONMENT_VARIABLES="-e $CORE_PEER_LOCALMSPID -e $CORE_PEER_MSPCONFIGPATH"



docker exec $ENVIRONMENT_VARIABLES cli peer chaincode install -n fabcar -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

docker exec $ENVIRONMENT_VARIABLES cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabcar -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

sleep 2

docker exec $ENVIRONMENT_VARIABLES cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabcar -c '{"function":"initLedger","Args":[]}'
