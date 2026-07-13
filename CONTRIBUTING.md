# Contributing to QuantumShield

## Commit Message Convention

We enforce the **Conventional Commits** specification. This leads to more readable messages that are easy to follow when looking through the project history, and allows for automated changelog generation.

### Format

```text
type(scope): subject
```

### Allowed Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
- `ci`: Changes to our CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

### Examples

- `feat(auth): add JWT generation for users`
- `fix(postgres): handle connection timeout gracefully`
- `chore: setup project scaffold and docker compose`
- `ci: add github actions for linting and testing`

Commitlint and Husky will automatically check your commit messages when you commit locally.
