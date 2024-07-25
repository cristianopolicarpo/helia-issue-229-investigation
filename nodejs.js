import * as http from "node:http";

import {createHelia} from "helia";
import {createTopology} from "@libp2p/topology";
import {tcp} from "@libp2p/tcp";
import {webSockets} from "@libp2p/websockets";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {circuitRelayTransport, circuitRelayServer} from "libp2p/circuit-relay";
import {mdns} from "@libp2p/mdns";
import {bootstrap} from "@libp2p/bootstrap";
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {ipniContentRouting} from "@libp2p/ipni-content-routing";
import {identifyService} from "libp2p/identify";
import {autoNATService} from "libp2p/autonat";
import {uPnPNATService} from "libp2p/upnp-nat";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {kadDHT} from "@libp2p/kad-dht";
import {ipnsSelector} from "ipns/selector";
import {ipnsValidator} from "ipns/validator";

export const createMiddle = async () => {
  // localhost helia node for libp2p.dial() target from helia on browser
  const node = await createHelia({
    libp2p: {
      addresses: {
        listen: [
          "/ip4/0.0.0.0/tcp/0",
          "/ip4/0.0.0.0/tcp/0/ws",
          "/webrtc",
        ]
      },
      transports: [
        tcp(),
        webSockets({websocket: {rejectUnauthorized: false}}),
        circuitRelayTransport({discoverRelays: 5}),
        webRTC(),
        webRTCDirect(),
      ],
      services: {
        identify: identifyService(),
        autoNAT: autoNATService(),
        upnp: uPnPNATService(),
        pubsub: gossipsub({allowPublishToZeroPeers: true, emitSelf: true, canRelayMessage: true}),
        dht: kadDHT({
          validators: {ipns: ipnsValidator},
          selectors: {ipns: ipnsSelector},
        }),
        relay: circuitRelayServer({advertise: true}),
      },
    },
  });

  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    });
    res.end(JSON.stringify({
      id: `${node.libp2p.peerId}`,
      multiaddrs: node.libp2p.getMultiaddrs().map(ma => `${ma}`),
      protocols: node.libp2p.getProtocols(),
    }));
  });
  await new Promise(f => server.listen(f));

  const url = `http://localhost:${server.address().port}/`;
  const stop = async () => Promise.all([node.stop(), new Promise(f => server.close(f))]);
  
  return {node, server, url, stop};
};

export const createNode = async (middle) => {
  const node = await createHelia();
  node.libp2p.addEventListener("peer:connect", ev => {
    //console.log("[peer:connect]", ev.detail);
  });
  node.libp2p.addEventListener("peer:discovery", ev => {
    //console.log("[peer:discovery]", ev.detail);
  });
  await node.libp2p.register("/ipfs/bitswap/1.2.0", createTopology({
    onConnect: (peerId, conn) => {
      //console.log("[/ipfs/bitswap/1.2.0] onConnect", peerId);
    },
    onDisonnect: peerId => {
      //console.log("[/ipfs/bitswap/1.2.0] onDisonnect", peerId);
    },
  }));
  await node.libp2p.dialProtocol(middle.libp2p.getMultiaddrs()[0], node.libp2p.getProtocols());
  return node;
};
