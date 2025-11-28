# Enterprise readiness review

## Implemented improvements

- Added an opinionated `createDetector` client with presets (`web`, `ssr`, `native`, `test`), privacy modes, and overridable inputs for Client Hints and sanitized platform/framework/capability results.
- Introduced pluggable cache adapters with configurable TTLs plus cross-runtime defaults, ensuring SSR and native deployments can reuse results.
- Added observability hooks (`onDetectStart`, `onDetectSuccess`, `onDetectError`) and correlation IDs, emitting machine-readable audit trails across the detection lifecycle.
- Hardened privacy and determinism: strict mode disables async probes, client hints, and permission prompts while producing an audit log of signals used.
- Defined a plugin contract (name, version, `apply`) and lifecycle-friendly client hooks so teams can extend detection safely.


## Executive summary
- `@kitiumai/detector` already delivers zero-dependency, TypeScript-first detection that spans browsers, Node.js, workers, React Native, Electron, and more, providing cached platform, framework, and capability results out of the box.【F:README.md†L1-L71】【F:src/index.ts†L149-L227】
- The public API exports comprehensive granular helpers for platforms, frameworks, and capabilities, giving teams flexibility but also exposing a broad surface area to learn.【F:src/index.ts†L35-L227】
- Caching and basic logging exist, but platform caching is browser-only and observability hooks are minimal, which limits enterprise-grade monitoring and runtime governance.【F:src/utils/cache.ts†L21-L65】【F:src/index.ts†L310-L323】

## Gaps compared to big-tech product standards
1. **Productized developer experience**
   - The library exposes dozens of functions without a cohesive top-level experience (e.g., a single client with presets for web, SSR, mobile, or testing). This contrasts with big-tech SDKs that ship opinionated entrypoints and minimal configuration for common stacks.【F:src/index.ts†L35-L268】
   - Options such as `custom` callbacks, `useClientHints`, and `capabilities` are powerful but undocumented in guardrails (e.g., when to use privacy mode, how to avoid expensive async feature checks), creating adoption friction.【F:src/index.ts†L149-L227】

2. **Enterprise observability and governance**
   - Caching is bound to `window`, meaning server-side or React Native environments skip reuse, and there is no configurable TTL or cache adapter to align with enterprise telemetry and privacy controls.【F:src/utils/cache.ts†L21-L65】
   - Logging uses a single logger without log-level configuration, correlation IDs, or hooks for emitting metrics/traces, which are standard in big-tech SDKs for fleet-wide quality signals.【F:src/index.ts†L310-L323】

3. **Accuracy, privacy, and compliance maturity**
   - Client Hints and UA parsing are blended implicitly, but there is no explicit consent-aware path, audit trail, or ability to inject pre-fetched headers from edge platforms—features required for privacy reviews and deterministic behavior in zero-PII modes.【F:src/index.ts†L149-L227】
   - Capability detection mixes synchronous and optional async checks without exposing latency budgets or fallbacks; enterprises often need deterministic modes for CI/CD, SSR, and privacy-by-default contexts.【F:src/index.ts†L328-L427】

4. **Extensibility and stability**
   - Custom detection hooks are provided but lack versioning, schema validation, or plugin isolation, making it hard for large organizations to evolve detectors safely across teams.【F:src/index.ts†L149-L262】
   - There is no explicit lifecycle (init → detect → report → shutdown) or typed event stream, which is common in enterprise SDKs to support integrations with analytics, experimentation, and feature-delivery systems.

## Recommendations to reach enterprise readiness
1. **Ship a simplified, opinionated API surface**
   - Introduce a `createDetector({ preset })` factory that returns a minimal client (`detect`, `getSummary`, `reset`) tuned for `web`, `ssr`, `native`, and `test` presets, while keeping granular exports for advanced users.
   - Provide configuration schemas with defaults for privacy (e.g., `privacyMode: 'strict' | 'balanced' | 'off'`), capability probes (`latencyBudgetMs`), and client hints usage (explicit opt-in/out) to give predictable behavior.

2. **Add enterprise-grade observability**
   - Offer pluggable cache adapters (memory, storage, custom) with TTL configuration and support for non-browser runtimes to align with server rendering and React Native deployments.
   - Expose hooks (`onDetectStart`, `onDetectSuccess`, `onDetectError`) that emit structured events for logging/metrics/tracing and allow correlation IDs to flow through detections.

3. **Harden privacy, determinism, and compliance**
   - Make the detection pipeline deterministic when `privacyMode` is enabled: disable async probes, avoid permissions prompts, and surface a machine-readable audit log of signals used.
   - Allow injecting pre-fetched Client Hints / user-agent data and geolocation/capability overrides so edge functions and server renderers can supply sanitized inputs without touching globals.

4. **Strengthen extensibility and lifecycle management**
   - Define a plugin contract with semantic versioning, schema validation, and isolation (e.g., running user hooks with timeouts and error boundaries) to keep custom detectors safe.
   - Document and implement a lifecycle (`initialize`, `detect`, `report`, `reset`) and emit typed events so that analytics, experimentation, and A/B delivery tools can integrate consistently.

5. **Documentation and adoption aids**
   - Publish quick-starts for common stacks (React web/SSR, React Native, Node services, Electron) with recommended presets and privacy defaults.
   - Add architecture diagrams and decision trees showing when to enable client hints, async capabilities, or custom hooks, mirroring the guided setup style seen in major product SDKs.
