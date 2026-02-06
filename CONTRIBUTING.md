# Contributing to BitRoute

Thank you for considering contributing to BitRoute! We welcome contributions from the community.

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/bitroute/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, wallet, network)

### Suggesting Enhancements

1. Open an issue with tag `enhancement`
2. Describe the feature and its benefits
3. Provide use cases and examples

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests if applicable
5. Ensure all tests pass (`clarinet test` for contracts, `npm test` for frontend)
6. Commit using conventional commits format
7. Push to your fork
8. Open a Pull Request

## Development Setup

See [README.md](README.md#quick-start) for setup instructions.

## Coding Standards

### Clarity (Smart Contracts)

- Use kebab-case for function and variable names
- Add comments for complex logic
- Include error handling for all public functions
- Write comprehensive tests

### TypeScript/React

- Use TypeScript strict mode
- Follow existing code style
- Use functional components with hooks
- Add JSDoc comments for exported functions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
style(scope): formatting changes
refactor(scope): code restructuring
test(scope): add tests
chore(scope): maintenance tasks
```

Examples:
```
feat(swap): add multi-hop routing
fix(wallet): resolve connection timeout
docs(readme): update installation steps
```

## Testing

### Smart Contracts
```bash
cd contracts
clarinet test
```

### Frontend
```bash
cd frontend
npm run lint
npm test  # (when implemented)
```

## Questions?

Open an issue with the `question` tag or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
