## Context
- This is a github action meant to make installing the Kargo CLI easy. Kargo is a continuous promotion orchestration layer, that complements Argo CD for Kubernetes. Built and maintained by the creators of Argo, Kargo is designed to streamline multi-stage application promotion by applying GitOps principles—eliminating the need for custom automation or reliance on CI pipelines. With seamless integration into existing systems like Argo CD, Kargo automates progressive rollouts across the entire application lifecycle, enhancing efficiency, safety, and visibility at every stage of deployment.

## Development
- Using eslint for linting
- Using prettier for formatting

## Testing
- Use the act open source project to run GitHub Actions locally. The command to use is `act pull_request --container-architecture linux/amd64 -W ci.yml
`. If the action changes make sure to modify this command as necessary.
