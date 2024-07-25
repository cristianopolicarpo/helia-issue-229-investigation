import {createHelia} from "helia";
import {unixfs} from "@helia/unixfs";
import {CID} from "multiformats/cid";
import {multiaddr} from "@multiformats/multiaddr";
import {peerIdFromString} from "@libp2p/peer-id";
import {createTopology} from "@libp2p/topology";
import {bootstrap} from "@libp2p/bootstrap";
import {pubsubPeerDiscovery} from "@libp2p/pubsub-peer-discovery";
import {circuitRelayTransport, circuitRelayServer} from "libp2p/circuit-relay";
import {webRTC, webRTCDirect} from "@libp2p/webrtc";
import {webTransport} from "@libp2p/webtransport";
import {webSockets} from "@libp2p/websockets";
import {all} from "@libp2p/websockets/filters";
import {identifyService} from "libp2p/identify";
import {autoNATService} from "libp2p/autonat";
import {gossipsub} from "@chainsafe/libp2p-gossipsub";
import {kadDHT} from "@libp2p/kad-dht";
import {ipnsSelector} from "ipns/selector";
import {ipnsValidator} from "ipns/validator";

export const createHeliaFromUrl = async url => {
  const info = await (await fetch(url)).json();
  const bootstrapConfig = {list: info.multiaddrs};
  const node = await createHelia({
    libp2p: {
      // https://github.com/ipfs/helia/blob/main/packages/helia/src/utils/libp2p-defaults.browser.ts#L27
      addresses: {
        listen: [
          "/webrtc", "/wss", "/ws",
        ],
      },
      transports: [
        webSockets({filter: all}),
        webRTC(), webRTCDirect(),
        webTransport(),
        // https://github.com/libp2p/js-libp2p-websockets#libp2p-usage-example
        circuitRelayTransport({discoverRelays: 5}),
      ],
      peerDiscovery: [bootstrap(bootstrapConfig), pubsubPeerDiscovery()],
      services: {
        identify: identifyService(),
        autoNAT: autoNATService(),
        //pubsub: gossipsub({allowPublishToZeroPeers: true, emitSelf: false, canRelayMessage: true}),
        pubsub: gossipsub({allowPublishToZeroPeers: true, emitSelf: true, canRelayMessage: true}),
        dht: kadDHT({
          clientMode: true,
          validators: {ipns: ipnsValidator},
          selectors: {ipns: ipnsSelector},
        }),
      },
      // https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md#configuring-connection-gater
      connectionGater: {denyDialMultiaddr: async (...args) => false},
    },
  });
  node.libp2p.addEventListener("peer:connect", ev => {
    console.log("[peer:connect]", ev.detail.toString());
  });
  // js-ipfs-bitswap/src/network.ts
  await node.libp2p.register("/ipfs/bitswap/1.2.0", createTopology({
    onConnect: (peerId, conn) => {console.log("[/ipfs/bitswap/1.2.0] onConnect", `${peerId}`);},
    onDisconnect: peerId => {console.log("[/ipfs/bitswap/1.2.0] onDisconnect", `${peerId}`);},
  }));
  // wait to connect
  while (node.libp2p.getMultiaddrs().length === 0) await new Promise(f => setTimeout(f, 500));
  const nodefs = unixfs(node);
  return {node, nodefs, CID, peerIdFromString, multiaddr};
};
