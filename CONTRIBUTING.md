# Contributing to @kitium/detector

Thank you for your interest in contributing to @kitium/detector! We welcome contributions from the community and are grateful for any help you can provide.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots or code samples** if applicable
- **Specify your environment:**
  - OS (Windows, macOS, Linux, etc.)
  - Browser (Chrome, Firefox, Safari, etc.) and version
  - Node.js version
  - Framework (React, Vue, Angular, etc.) and version
  - @kitium/detector version

**Example Bug Report:**

```markdown
**Title:** Platform detection fails in Electron on macOS

**Description:**
When using @kitium/detector in an Electron application on macOS, `detectPlatform()` incorrectly returns 'web' instead of 'electron'.

**Steps to Reproduce:**
1. Create an Electron app
2. Import and call `detectPlatform()`
3. Observe the result

**Expected Behavior:**
Should return `{ platform: 'electron', ... }`

**Actual Behavior:**
Returns `{ platform: 'web', ... }`

**Environment:**
- OS: macOS 14.0
- Electron: 27.0.0
- @kitium/detector: 1.0.0
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Include code examples** showing how the enhancement would be used
- **List any alternatives** you've considered

**Example Enhancement:**

```markdown
**Title:** Add detection for Astro framework

**Description:**
Add support for detecting the Astro framework in web applications.

**Motivation:**
Astro is growing in popularity and users would benefit from automatic detection.

**Proposed API:**
```typescript
import { isAstro, detectFramework } from '@kitium/detector';

if (isAstro()) {
  console.log('Running in Astro');
}
```

**Alternatives:**
Users can currently detect Astro manually, but built-in support would be more convenient.
```

### Pull Requests

We actively welcome your pull requests! Here's how to contribute code:

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for any new functionality
4. **Ensure all tests pass** (`npm test`)
5. **Update documentation** if needed
6. **Run linting** (`npm run lint:fix`)
7. **Commit your changes** with clear commit messages
8. **Push to your fork** and submit a pull request

**Pull Request Process:**

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md following the existing format
3. The PR will be merged once you have sign-off from maintainers
4. Ensure your PR description clearly describes the problem and solution

**Pull Request Template:**

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests you ran and how to reproduce them

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

## Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm, yarn, or pnpm
- Git

### Setup Steps

1. **Fork the repository** on GitHub at https://github.com/kitium-ai/detector

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/detector.git
   cd detector
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Start development:**
   ```bash
   npm run build:watch
   ```

### Project Structure

```
kitium-detector/
├── src/
│   ├── detectors/         # Detection modules
│   │   ├── platform.ts    # Platform detection
│   │   ├── framework.ts   # Framework detection
│   │   └── capabilities.ts # Capability detection
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── index.ts           # Main entry point
├── tests/                 # Test files (co-located with source)
├── dist/                  # Build output (generated)
└── docs/                  # Documentation
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Provide proper type annotations
- Avoid `any` types unless absolutely necessary
- Use `unknown` instead of `any` when type is uncertain

**Good Example:**
```typescript
export function detectBrowser(): BrowserType {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome')) {
    return 'chrome';
  }
  return 'unknown';
}
```

**Bad Example:**
```typescript
export function detectBrowser(): any { // Don't use 'any'
  let ua = navigator.userAgent; // Should be const
  // Missing type safety
}
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use camelCase for variables and functions
- Use PascalCase for classes and types
- Use UPPER_SNAKE_CASE for constants
- Maximum line length: 100 characters

**Example:**
```typescript
// Constants
const MAX_CACHE_AGE = 5000;

// Types
export interface DetectionResult {
  platform: PlatformType;
  framework: FrameworkType;
}

// Functions
export function detectPlatform(): PlatformDetectionResult {
  const platform = getCurrentPlatform();
  return platform;
}
```

### Testing

- Write tests for all new features
- Write tests for bug fixes
- Aim for 80%+ code coverage
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `it` or `test` for individual test cases

**Example:**
```typescript
describe('Platform Detection', () => {
  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      expect(isBrowser()).toBe(true);
    });

    it('should return false in Node.js environment', () => {
      // Mock Node.js environment
      expect(isBrowser()).toBe(false);
    });
  });
});
```

### Documentation

- Add JSDoc comments for all public APIs
- Include examples in documentation
- Keep README.md up to date
- Document breaking changes in CHANGELOG.md

**Example:**
```typescript
/**
 * Detect the current platform
 *
 * @returns {PlatformDetectionResult} Complete platform information
 *
 * @example
 * ```typescript
 * const platform = detectPlatform();
 * console.log(platform.platform); // 'web'
 * console.log(platform.browser.name); // 'chrome'
 * ```
 */
export function detectPlatform(): PlatformDetectionResult {
  // Implementation
}
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add detection for Remix framework
fix: correct Electron detection on Windows
docs: update API reference for detectPlatform
test: add tests for Vue.js detection
refactor: simplify browser detection logic
chore: update dependencies
```

### Performance Considerations

- Minimize DOM queries
- Cache detection results when possible
- Avoid blocking operations
- Use lazy loading for heavy computations
- Profile performance-critical code

**Example:**
```typescript
// Good: Cached detection
let cachedResult: DetectionResult | null = null;

export function detect(): DetectionResult {
  if (!cachedResult) {
    cachedResult = performDetection();
  }
  return cachedResult;
}

// Bad: Repeated detection
export function detect(): DetectionResult {
  return performDetection(); // Called every time
}
```

### Browser Compatibility

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Handle IE11 gracefully (feature detection, not browser sniffing)
- Test in multiple environments
- Use feature detection over user agent parsing
- Provide fallbacks for unsupported features

## Adding New Detectors

When adding support for a new platform, framework, or capability:

1. **Add the type** to `src/types/index.ts`
2. **Implement detection function** in the appropriate detector module
3. **Add tests** for the new detection
4. **Update documentation** in README.md
5. **Add example usage** in comments
6. **Update CHANGELOG.md**

**Example - Adding Bun Runtime Detection:**

1. Add type:
```typescript
// src/types/index.ts
export type RuntimeType =
  | 'browser'
  | 'node'
  | 'bun'  // ← New
  | 'deno'
  | 'worker';
```

2. Implement detection:
```typescript
// src/detectors/platform.ts
export function isBun(): boolean {
  return typeof (globalThis as any).Bun !== 'undefined';
}
```

3. Add tests:
```typescript
// src/detectors/platform.test.ts
describe('isBun', () => {
  it('should detect Bun runtime', () => {
    (globalThis as any).Bun = {};
    expect(isBun()).toBe(true);
    delete (globalThis as any).Bun;
  });
});
```

4. Update docs and export in index.ts

## Release Process

Only maintainers can publish releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Commit changes: `git commit -m "chore: release v1.x.x"`
4. Create git tag: `git tag v1.x.x`
5. Push changes: `git push && git push --tags`
6. Build: `npm run build`
7. Publish: `npm publish`
8. Create GitHub release with changelog

## Community

- **GitHub Discussions:** For questions and general discussion
- **GitHub Issues:** For bug reports and feature requests
- **Pull Requests:** For code contributions

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- CHANGELOG.md for significant contributions
- README.md for major features

## Questions?

If you have questions about contributing, please:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Open a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to @kitium/detector! 🎉
