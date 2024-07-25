## 0. Setup

Clone this repo:

```sh
$ git clone https://gist.github.com/5565c22255ae87a3c8e9948b467ee894.git helia-b2l-buggy
$ cd helia-b2l-buggy/
```

Generate `npm-browser.js` npm package bundle:

```sh
$ npm i
$ npm run build
```

## 1. Run successful case

```sh
$ node case-success.mjs

[middle info URL] http://localhost:59352/
[peerId on nodejs] 12D3KooWN3yQuxxh2dzroLGEveT87RC6HXF9f5Gfh3gvvPaHoq5M
[page server url] http://localhost:59358/index.html
(node:61832) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
(Use `node --trace-deprecation ...` to show where the warning was created)
{
  url: 'http://localhost:59358/browser.js',
  lineNumber: 54,
  columnNumber: 12
} [peer:connect] 12D3KooWFhTo9QtMDziFLV655qoKxGsYDwoVDDMAhYwhimMJNt78
{
  url: 'http://localhost:59358/browser.js',
  lineNumber: 54,
  columnNumber: 12
} [peer:connect] 12D3KooWN3yQuxxh2dzroLGEveT87RC6HXF9f5Gfh3gvvPaHoq5M
{ url: '', lineNumber: 4, columnNumber: 10 } [peerId on browser] 12D3KooWH6rEdHDSDcbGyz11u4Mk5aLBHjAT8MWgYMW4W8mQqf7K
{
  url: 'http://localhost:59358/browser.js',
  lineNumber: 58,
  columnNumber: 42
} [/ipfs/bitswap/1.2.0] onConnect 12D3KooWN3yQuxxh2dzroLGEveT87RC6HXF9f5Gfh3gvvPaHoq5M
[stat of cid from browser] {
  cid: CID(bafkreif5viehisdkgsxmfrmu5crzazgqhtg7xaifnjzyrcypsddkfnecaa),
  mode: undefined,
  mtime: undefined,
  fileSize: 18n,
  dagSize: 18n,
  localFileSize: 18n,
  localDagSize: 18n,
  blocks: 1,
  type: 'raw',
  unixfs: undefined
}
[text of cid from browser] Hello from browser
{ url: '', lineNumber: 4, columnNumber: 12 } [peer.id] 12D3KooWN3yQuxxh2dzroLGEveT87RC6HXF9f5Gfh3gvvPaHoq5M
{ url: '', lineNumber: 5, columnNumber: 12 } [peer.multiaddrs.length] 6
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59350/p2p/12D3KooWFhTo9QtMDziFLV655qoKxGsYDwoVDDMAhYwhimMJNt78/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59351/ws/p2p/12D3KooWFhTo9QtMDziFLV655qoKxGsYDwoVDDMAhYwhimMJNt78/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59355
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59350/p2p/12D3KooWFhTo9QtMDziFLV655qoKxGsYDwoVDDMAhYwhimMJNt78/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59351/ws/p2p/12D3KooWFhTo9QtMDziFLV655qoKxGsYDwoVDDMAhYwhimMJNt78/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59355
{ url: '', lineNumber: 7, columnNumber: 12 } [peer.protocolss.length] 0
{ url: '', lineNumber: 13, columnNumber: 10 } [stat of cid from nodejs] {cid: _CID, mode: undefined, mtime: undefined, fileSize: 17n, dagSize: 17n}
{ url: '', lineNumber: 19, columnNumber: 10 } [text of cid from nodejs] Hello from nodejs
[closing...]
{
  url: 'http://localhost:59358/browser.js',
  lineNumber: 59,
  columnNumber: 37
} [/ipfs/bitswap/1.2.0] onDisconnect 12D3KooWN3yQuxxh2dzroLGEveT87RC6HXF9f5Gfh3gvvPaHoq5M
```

Accessed from nodejs helia to content on browser helia at first, the browser helia can access content on the nodejs helia.

## 2. Run halt case

```sh
$ node case-halt.mjs

[middle info URL] http://localhost:59635/
[peerId on nodejs] 12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
[page server url] http://localhost:59642/index.html
(node:70713) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
(Use `node --trace-deprecation ...` to show where the warning was created)
{
  url: 'http://localhost:59642/browser.js',
  lineNumber: 54,
  columnNumber: 12
} [peer:connect] 12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ
{ url: '', lineNumber: 4, columnNumber: 10 } [peerId on browser] 12D3KooWNHdkwEtkuDqSfZeVjc8Lam217LCkfewMX3UFwAhR1WYk
{ url: '', lineNumber: 4, columnNumber: 12 } [peer.id] 12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 5, columnNumber: 12 } [peer.multiaddrs.length] 12
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59633/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59633/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit/p2p/12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59634/ws/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59634/ws/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit/p2p/12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59639
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/127.0.0.1/tcp/59639/p2p/12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59633/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59633/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit/p2p/12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59634/ws/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59634/ws/p2p/12D3KooWSrsvuX3s8LmcGbaSXKpC6M5kQ7GeA8naBfx42QcALuBZ/p2p-circuit/p2p/12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59639
{ url: '', lineNumber: 6, columnNumber: 46 } [peer.multiaddrs] /ip4/192.168.10.6/tcp/59639/p2p/12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
{ url: '', lineNumber: 7, columnNumber: 12 } [peer.protocolss.length] 0
{
  url: 'http://localhost:59642/browser.js',
  lineNumber: 54,
  columnNumber: 12
} [peer:connect] 12D3KooWK2RXGcEacMu2mgR3cW4TFCKbEgxXBNeiBSryo6qWALJy
^C
```

The browser helia halt to access content on the nodejs helia at first.
