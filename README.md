# Helia Issue #229

This repository aims to replicate the issue described in [helia issue #229](https://github.com/ipfs/helia/issues/229).

```sh
$ git clone https://github.com/cristianopolicarpo/helia-issue-229-investigation.git
$ cd helia-issue-229-investigation
```

Generate `npm-browser.js` npm package bundle:

```sh
$ npm i
$ npm run build
$ npm run halt-updated
```

## Problem 1: Peer Discovery Halt

The original code experienced a halt when it failed to find the required peers. This is evident from the error log:

```plaintext
node:internal/process/esm_loader:40
      internalBinding('errors').triggerUncaughtException(
                                ^

page.evaluate: CodeError: more peers required, seen: 0  min: 1
    at requirePeers (http://localhost:53232/npm-browser.js:52853:11)
    at async CompoundContentRouting.findProviders (http://localhost:53232/npm-browser.js:52883:5)
    at async eval (eval at evaluate (:226:30), <anonymous>:5:24)
    at async <anonymous>:252:30
    at /home/cristiano/pl-dev-guild/helia-b2l-buggy/case-halt.mjs:83:13
```

This error indicates that the script could not find enough peers, causing an uncaught exception that halted the execution.

## Problem 2: Incomplete Resource Cleanup

The original script did not ensure proper cleanup of resources. If an error occurred, resources like the HTTP server, browser, and Helia nodes might not be closed properly, leading to potential memory leaks or other issues.

## Problem 3: No Proper Process Termination

The script lacked a mechanism to ensure the process terminated correctly after execution. Without explicit termination, the script could continue running indefinitely, especially if it encountered an error.

## Changes Made to Fix the Issues

1. **Script Structure**: Wrapped the main logic inside a `main()` function for better flow control and error handling.
2. **Detailed Logging**: Added detailed logs at each critical step of the script to facilitate debugging and ensure each part of the code was executed correctly.
3. **Error Handling**: Included `try-catch` blocks around the main operations to capture and log specific errors, allowing the execution to continue and clean up resources even in case of failures.
4. **Resource Cleanup**: Ensured that all resources (nodes, browser, and HTTP server) are closed correctly, even in case of errors. Added specific logs to monitor each step of the resource cleanup process.
5. **Process Termination**: Used `process.exit(0)` and `process.exit(1)` to ensure the process terminates correctly after execution, preventing it from running indefinitely.

These changes addressed the issues in the original code, preventing the script from halting due to peer discovery failures and ensuring proper cleanup and termination of the process.
