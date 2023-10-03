

FuseJS
------

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**This software is early alpha release cycles**

This means that there will be an effort to keep breaking changes in the 0.x version bumps, but
there _could_ be breaking changes in any release.

## 0.6.0 (UNRELEASED)

### Breaking Changes

- `FuseContext` will now construction parameters.
- Is is no longer recommended to extend `FuseContext`. All overridable construction hooks have been removed.
- `FuseContextBuilder` is now provided to build and configure a `FuseContext`. This is an asynchronous action as it requires calls to native now. The minimum needed to get your context is to do:

```typescript
let builder: FuseContextBuilder = new FuseContextBuilder();
let context: FuseContext = await builder.build();
```

Which will build your fuse context with the default options, which should be sufficient for most apps.

- Fuse Plugin APIs endpoints now requires a leading slash (`/`). This is to create recognizable consistency.

```diff
- this._exec("myAPICall", ...)
+ this._exec("/myAPICall", ...)
```

### Features

#### FuseLogger

A new `FuseLogger` API has been created. Use `FuseContext.getLogger()` to use it.

Benefits of using FuseLogger:
1. LogSeverity control
2. Logs processed via `FuseLogger` will also be sent to the native environment to be logged in the native's syslog.

This is especially useful for iOS since Safari doesnt actually capture log events that occurs prior to the inspector being attached to the Webview.

To save on processing, bridging logs to the native environment by default is only done while the application is running in debug mode (e.g. an iOS/Android `Debug` build variant). This can be overridded by calling on `FuseLogger.enableNativeBridge(true)`:

```typescript
let context: FuseContext = getContext();
context.getLogger().enableNativeBridge(true);
```
