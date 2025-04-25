# 🚀 AOTC

Stay Ahead of the Curve with this modern Next.js + Chakra UI template. Built for developers who want to ship web apps faster without sacrificing code quality or features.

## Why AOTC?

Skip the boilerplate and get straight to building features. AOTC combines the best tools in the modern web development stack, pre-configured and ready to help you stay ahead of the curve.

## Features

### Ready to Use

- [x] Automated versioning and release management
- [x] Changelog generation through conventional commits
- [x] GitHub Actions CI/CD pipeline
- [x] Code formatting with Prettier and ESLint
- [x] Pre-commit hooks with Husky and lint-staged
- [x] Automated PR validation checks
- [x] Chakra UI base integration
- [x] Static metadata configuration with SEO best practices
- [x] Robots.txt generation
- [x] Sitemap.xml generation

### Coming Soon

#### Developer Experience

- [ ] Comprehensive PR checks
- [ ] TypeScript strict mode configuration
- [ ] Robust state management with Redux Toolkit/Zustand
- [ ] Data fetching patterns and caching strategies
- [ ] API integration examples and best practices

#### SEO

- [ ] Dynamic metadata generation
- [ ] Schema.org JSON-LD integration
- [ ] SEO performance monitoring
- [ ] Analytics integration
- [ ] Google Analytics and Tag Manager

#### UI Components

- [ ] Theme generator for easy customization
- [ ] Dark/Light mode toggle
- [ ] Responsive layouts and components
- [ ] Storybook integration
- [ ] Ready-to-use page templates

#### Business & Conversion

- [ ] High-conversion landing page templates
- [ ] A/B testing setup
- [ ] Customer feedback and feature request system
- [ ] Account management dashboard templates
- [ ] User preference management
- [ ] Stripe payment integration
- [ ] Subscription management workflows

#### Productivity Boosters

- [ ] Authentication templates
- [ ] Firebase/Supabase quick start
- [ ] API route examples
- [ ] Environment setup guide

## Quick Start

```bash
# Clone the template
git clone [repository-url]

# Install dependencies
yarn install

# Fire it up
yarn dev
```

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required - Used for sitemap.xml, robots.txt, and metadata
NEXT_PUBLIC_DOMAIN=https://yourdomain.com

# Development - Create .env.development.local
NEXT_PUBLIC_DOMAIN=http://localhost:3000

```

## Release Workflow

AOTC uses a fully automated release workflow:

1. Commits following [Conventional Commits](https://www.conventionalcommits.org/) spec are pushed to main
2. GitHub Actions automatically:
   - Determines the version bump (major/minor/patch) based on commit messages
   - Updates the version in package.json
   - Generates/updates the CHANGELOG.md
   - Creates a new git tag
   - Creates a GitHub Release with the changelog

Breaking changes trigger a major version bump:

```bash
feat!: breaking change
# or
feat: major change

BREAKING CHANGE: description
```

New features trigger a minor version bump:

```bash
feat: add new feature
```

Bug fixes and maintenance trigger a patch version bump:

```bash
fix: bug fix
chore: routine maintenance
```

## Code Style

AOTC uses Next.js's default ESLint configuration extended with Prettier for consistent code formatting. The setup includes:

- Next.js default ESLint rules
- Prettier for code formatting
- VSCode configurations
- Format on save enabled
- ESLint auto-fix on save

### VSCode Setup

1. Install recommended extensions:

   - Prettier - Code formatter
   - ESLint

2. The project includes:
   - `.vscode/settings.json` for consistent editor settings
   - `.prettierrc` for code formatting rules
   - `.eslintrc.json` extending Next.js defaults

All formatting and linting will work automatically on save once the extensions are installed.

### Available Scripts

```bash
# Lint code
yarn lint

# Lint and fix
yarn lint:fix

# Format code
yarn format

# Check formatting
yarn format:check
```

### Pre-commit Hooks

The template uses Husky with lint-staged to ensure code quality before commits:

- All staged `.ts`, `.tsx`, `.js`, `.jsx` files will be:
  - Linted with ESLint
  - Formatted with Prettier
- All staged `.md` and `.json` files will be:
  - Formatted with Prettier

These checks run automatically when you commit changes.

### PR Validation

Pull Requests to the main branch automatically trigger validation checks:

- Code formatting validation
- ESLint checks
- Test suite execution (when tests are added)

These checks must pass before the PR can be merged.

## Contributing

Got ideas? We'd love to improve AOTC! Here's how:

1. Fork it
2. Create your feature branch
3. Make your changes (don't forget to use conventional commits!)
4. Open a PR with a clear description

## License

MIT - See LICENSE file for details

## Keeping Up to Date

To receive updates from this template after you've created your project:

```bash
# Add the template as a remote
git remote add template https://github.com/[template-repo-url]

# Get updates
git fetch template
git merge template/main --allow-unrelated-histories
```

This allows you to:

- Pull in new features and improvements
- Stay current with best practices
- Choose which updates to incorporate
- Resolve conflicts to maintain your customizations

---
