# Release Process

This project uses automatic versioning with setuptools-scm and tag-based releases.

## How to Release

### 1. Create a Git Tag
```bash
# For a new release, create and push a tag
git tag v0.1.2
git push origin v0.1.2
```

### 2. Automatic Publishing
- The GitHub workflow will automatically:
  - Run tests
  - Build the package with version `0.1.2`
  - Publish to PyPI

## Version Numbering

- **Release versions**: Created from git tags like `v0.1.2` → version `0.1.2`
- **Development versions**: Commits without tags get versions like `0.1.2.dev4+g1234567`

## Tag Format

Use semantic versioning with a `v` prefix:
- `v1.0.0` - Major release
- `v1.1.0` - Minor release  
- `v1.1.1` - Patch release
- `v1.0.0a1` - Alpha release
- `v1.0.0b1` - Beta release
- `v1.0.0rc1` - Release candidate

## Examples

```bash
# Patch release
git tag v0.1.2
git push origin v0.1.2

# Minor release
git tag v0.2.0
git push origin v0.2.0

# Major release
git tag v1.0.0
git push origin v1.0.0

# Pre-release
git tag v1.0.0a1
git push origin v1.0.0a1
```

## Checking Version

You can check what version will be generated:

```bash
cd python
python -m setuptools_scm
``` 