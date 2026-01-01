# Setup Kargo CLI GitHub Action

This repository provides a GitHub Action that downloads and adds the [Kargo CLI](https://kargo.io/) to the `PATH` for later steps in your workflow. The action pulls prebuilt binaries from the official [`akuity/kargo` releases](https://github.com/akuity/kargo/releases) based on the operating system and CPU architecture of the runner.

## Usage

Add the action to any job that needs the Kargo CLI. Provide the CLI version you want to install, then invoke Kargo commands in subsequent steps.

```yaml
name: Use Kargo CLI

on:
  workflow_dispatch:

jobs:
  kargo-cli:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Kargo CLI
        uses: aiell0/setup-kargo@v1
        with:
          version: "1.0.0"
          # use-cache: "true" # optional

      - name: Show version
        run: kargo version
```

## Inputs

- `version` (required): Semantic version of the CLI to install. The action accepts values with or without the leading `v` (e.g. `1.0.0` or `v1.0.0`).
- `use-cache` (optional, default `"true"`): When `true`, the downloaded binary is stored using the GitHub Actions tool cache for reuse across workflow runs. Set to `"false"` to force a fresh download into a temporary directory each run.

## How it works

1. Normalizes the requested version to ensure it is prefixed with `v`.
2. Detects the runner platform and architecture to select the correct release asset.
3. Downloads the Kargo CLI binary from the GitHub release.
4. Either caches the binary with the Actions tool cache or stores it in a temporary directory.
5. Prepends the resulting directory to the `PATH` so that `kargo` is available to later steps.

## Local development

- Install dependencies with `npm install`.
- Build a fresh bundle with `npx rollup -c` to update `dist/index.js`.
- Keep `dist/index.js` committed so the action runs without a build step in GitHub Actions.

## Testing the action
- `act pull_request --container-architecture linux/amd64 -W ci.yml`
