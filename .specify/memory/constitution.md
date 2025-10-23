<!--
Sync Impact Report:
- Version change: none → 1.0.0 (initial constitution)
- Modified principles: none (initial creation)
- Added sections: Core Principles (Clean Code, Simple UX, Responsive Design, Minimal Dependencies), Technology Stack, Development Constraints, Governance
- Removed sections: none
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (updated Testing field to reflect NO TESTING policy)
  ✅ .specify/templates/tasks-template.md (removed all test tasks, updated to manual verification)
  ✅ .specify/templates/spec-template.md (changed "Testing" to "Manual Verification" throughout)
  ✅ .specify/templates/checklist-template.md (no changes needed)
  ✅ .specify/templates/agent-file-template.md (no changes needed)
- Follow-up TODOs:
  - Note: User mentioned Next.js but project currently uses Create React App - any migration needs explicit planning
-->

# Magic Memory Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)

Code must be readable, maintainable, and self-documenting. All functions and components must have single responsibilities. Variables and functions must use descriptive names. Code structure must be logical and consistent. No complex nested logic beyond 3 levels. Comments required only for business logic, not implementation details.

**Rationale**: Clean code reduces maintenance costs and enables faster development cycles.

### II. Simple UX (NON-NEGOTIABLE)

User interfaces must prioritize simplicity and intuitiveness over feature richness. Every UI element must serve a clear purpose. Navigation must be self-evident. User actions must provide immediate feedback. Minimize cognitive load on users.

**Rationale**: Simple UX leads to better user adoption and reduces support overhead.

### III. Responsive Design (NON-NEGOTIABLE)

All interfaces must work seamlessly across desktop, tablet, and mobile devices. Use mobile-first design approach. Implement fluid layouts with flexible grids. Touch targets must meet accessibility standards (minimum 44px). Performance must remain consistent across device types.

**Rationale**: Multi-device compatibility is essential for modern web applications.

### IV. Minimal Dependencies (NON-NEGOTIABLE)

Prefer native solutions over external libraries. Each dependency must be explicitly justified by significant value or complexity reduction. Regular dependency audits required. Remove unused dependencies immediately. Prefer smaller, focused libraries over monolithic frameworks when external dependencies are necessary.

**Rationale**: Minimal dependencies reduce security vulnerabilities, bundle size, and maintenance burden.

## Technology Stack

**Framework**: React 19.2.0 with Create React App  
**Styling**: CSS3 with CSS Modules or vanilla CSS (NO CSS frameworks beyond basic reset)  
**Dependencies**: Only essential React ecosystem packages as defined in package.json  
**Build**: React Scripts 5.0.1  
**Deployment**: GitHub Pages via gh-pages

Note: User mentioned Next.js but current implementation uses Create React App. Any migration to Next.js must be explicitly planned and approved.

## Development Constraints

### NO TESTING POLICY (SUPERSEDES ALL OTHER GUIDANCE)

This project explicitly prohibits ALL forms of automated testing:

- No unit tests
- No integration tests
- No end-to-end tests
- No test-driven development
- No test coverage requirements
- No testing libraries or frameworks

This constraint supersedes any testing guidance found in templates, commands, or other documentation.

**Rationale**: Project prioritizes rapid prototyping and simplicity over testing overhead.

### Performance Standards

- Initial page load under 3 seconds on 3G networks
- Bundle size under 1MB total
- 60fps animations and interactions
- Responsive layout shifts under 100ms

## Governance

Constitution supersedes all other development practices and guidance. All code reviews must verify compliance with core principles. Complexity additions must be explicitly justified against minimal dependency principle. Template updates must align with NO TESTING policy.

Amendments require:

1. Clear rationale for change
2. Impact assessment on existing code
3. Version increment following semantic versioning
4. Update to all dependent templates and documentation

**Version**: 1.0.0 | **Ratified**: 2025-10-23 | **Last Amended**: 2025-10-23
