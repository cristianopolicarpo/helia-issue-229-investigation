import { CID } from "multiformats/cid";
import { unixfs } from "@helia/unixfs";
import { chromium } from "playwright";
import { createServer } from "http-server";
import { createMiddle, createNode } from "./nodejs.js";

async function main() {
  try {
    // [1. middle helia node] to connect from helia on browser and helia on nodejs
    const middle = await createMiddle();
    console.log("[middle info URL]", middle.url);
    console.log("[peerId of middle]", `${middle.node.libp2p.peerId}`);

    // [2. nodejs helia node]
    const node = await createNode(middle.node);
    console.log("[peerId on nodejs]", `${node.libp2p.peerId}`);

    // [3. http server for url to playwright]
    const httpServer = createServer();
    await new Promise((f) => httpServer.server.listen(f));
    const pageUrl = `http://localhost:${httpServer.server.address().port}/index.html`; // importmap only html
    console.log("[page server url]", pageUrl);

    // [4. helia node on playwright]
    const browser = await chromium.launch();
    const page1 = await browser.newPage();
    await page1.goto(pageUrl);
    page1.on("console", (msg) => {
      if (msg.type() === "log") console.log(msg.location(), msg.text());
      //if (msg.type() === "error") console.log(msg.location(), msg.text());
    });
    const cidStr = await page1.evaluate(
      ({ middleUrl }) =>
        (async () => {
          const { createHeliaFromUrl } = await import("./browser.js");

          globalThis.ctx = await createHeliaFromUrl(middleUrl);
          console.log("[peerId on browser]", `${ctx.node.libp2p.peerId}`);

          // [5. serve content on browser helia node]
          const cid = await ctx.nodefs.addBytes(new TextEncoder().encode("Hello from browser"));
          try {
            ctx.node.pins.add(cid);
          } catch (error) {}
          return `${cid}`;
        })(),
      { middleUrl: middle.url }
    );
    console.log("[serving cid on browser]", cidStr);

    // [6. resolve cid from nodejs to browser]
    const nodefs = unixfs(node);
    if (0) {
      // Uncomment this block if needed for testing
      const cid = CID.parse(cidStr);
      console.log("==================\n[attempting to resolve cid from nodejs to browser]\n==================");
      try {
        const stat = await nodefs.stat(cid);
        console.log("[stat of cid from browser]", stat);
        const decoder = new TextDecoder();
        const texts = [];
        for await (const chunk of nodefs.cat(cid)) {
          texts.push(decoder.decode(chunk, { stream: true }));
        }
        console.log("[text of cid from browser]", texts.join(""));
        for await (const peer of node.libp2p.contentRouting.findProviders(cid)) {
          console.log("[peer.id]", `${peer.id}`);
          console.log("[peer.multiaddrs.length]", peer.multiaddrs.length);
          for (const ma of peer.multiaddrs) console.log("[peer.multiaddrs]", `${ma}`);
          console.log("[peer.protocolss.length]", peer.protocols.length);
          for (const proto of peer.protocols) console.log("[peer.protocols]", `${proto}`);
          break;
        }
      } catch (error) {
        console.error("[error during nodejs to browser resolve]", error);
      }
    }

    // [7. serve content on nodejs helia node]
    const cid = await nodefs.addBytes(new TextEncoder().encode("Hello from nodejs"));
    try {
      node.pins.add(cid);
    } catch (error) {}
    console.log("[served from browser]");

    // [8. access cid from browser to nodejs]
    await page1.evaluate(
      ({ cidStr }) =>
        (async () => {
          const cid = ctx.CID.parse(cidStr);
          console.log("==================\n[attempting to access cid from browser to nodejs]\n==================");
          try {
            for await (const peer of ctx.node.libp2p.contentRouting.findProviders(cid)) {
              console.log("[peer.id]", `${peer.id}`);
              console.log("[peer.multiaddrs.length]", peer.multiaddrs.length);
              for (const ma of peer.multiaddrs) console.log("[peer.multiaddrs]", `${ma}`);
              console.log("[peer.protocolss.length]", peer.protocols.length);
              for (const proto of peer.protocols) console.log("[peer.protocols]", `${proto}`);
              break;
            }

            const stat = await ctx.nodefs.stat(cid); // halt
            console.log("[stat of cid from nodejs]", stat);
            const decoder = new TextDecoder();
            const texts = [];
            for await (const chunk of ctx.nodefs.cat(cid)) {
              texts.push(decoder.decode(chunk, { stream: true }));
            }
            console.log("[text of cid from nodejs]", texts.join(""));

            for await (const peer of ctx.node.libp2p.contentRouting.findProviders(cid)) {
              console.log("[peer.id]", `${peer.id}`);
              console.log("[peer.multiaddrs.length]", peer.multiaddrs.length);
              for (const ma of peer.multiaddrs) console.log("[peer.multiaddrs]", `${ma}`);
              console.log("[peer.protocolss.length]", peer.protocols.length);
              for (const proto of peer.protocols) console.log("[peer.protocols]", `${proto}`);
              break;
            }
          } catch (error) {
            console.error("[error during browser to nodejs access]", error);
          }
        })(),
      { cidStr: `${cid}` }
    );

    // [9. closing]
    console.log("[closing...]");
    await page1.evaluate(() => ctx.node.stop());
    await browser.close();
    await new Promise((f) => httpServer.server.close(f));
    await node.stop();
    await middle.stop();
    console.log("[resources cleaned up, exiting...]");
    process.exit(0); // Ensure the process exits
  } catch (error) {
    console.error("[main function error]", error);
    process.exit(1); // Ensure the process exits on error
  }
}

main();
