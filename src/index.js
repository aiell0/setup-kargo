import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { chmod, mkdtemp, rename } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

const OWNER = "akuity";
const REPO = "kargo";

function normalizeVersion(rawVersion) {
	if (!rawVersion) {
		throw new Error("Input `version` is required");
	}
	return rawVersion.startsWith("v") ? rawVersion : `v${rawVersion}`;
}

function resolvePlatform(nodePlatform) {
	switch (nodePlatform) {
		case "linux":
			return "linux";
		case "darwin":
			return "darwin";
		case "win32":
			return "windows";
		default:
			throw new Error(`Unsupported platform: ${nodePlatform}`);
	}
}

function resolveArchitecture(nodeArch) {
	switch (nodeArch) {
		case "x64":
			return "amd64";
		case "arm64":
			return "arm64";
		default:
			throw new Error(`Unsupported architecture: ${nodeArch}`);
	}
}

function getDownloadURL(versionTag) {
	const platform = resolvePlatform(process.platform);
	const architecture = resolveArchitecture(process.arch);
	const extension = platform === "windows" ? ".exe" : "";
	const assetName = `kargo-${platform}-${architecture}${extension}`;
	return `https://github.com/${OWNER}/${REPO}/releases/download/${versionTag}/${assetName}`;
}

function getCacheFileName(platform) {
	return platform === "windows" ? "kargo.exe" : "kargo";
}

async function run() {
	try {
		const versionTag = normalizeVersion(core.getInput("version", { required: true }));
		const useCache = core.getBooleanInput("use-cache");

		core.info(`Preparing to install Kargo CLI ${versionTag}`);
		core.info(`Detected platform: ${process.platform}`);
		core.info(`Detected architecture: ${process.arch}`);

		const downloadURL = getDownloadURL(versionTag);
		core.info(`Downloading Kargo CLI from ${downloadURL}`);

		const downloadedPath = await tc.downloadTool(downloadURL);

		const platform = resolvePlatform(process.platform);
		const cacheFileName = getCacheFileName(platform);

		let toolDirectory;

		if (useCache) {
			await chmod(downloadedPath, 0o755);
			core.info("Caching enabled; storing binary in tool cache");
			toolDirectory = await tc.cacheFile(downloadedPath, cacheFileName, "kargo", versionTag);
		} else {
			core.info("Caching disabled; using temporary directory for binary");
			const tempDirectory = await mkdtemp(join(tmpdir(), "kargo-"));
			const binaryPath = join(tempDirectory, cacheFileName);
			await rename(downloadedPath, binaryPath);
			await chmod(binaryPath, 0o755);
			toolDirectory = tempDirectory;
		}

		core.addPath(toolDirectory);
		core.info(`Kargo CLI ${versionTag} added to PATH`);
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		} else {
			core.setFailed(String(error));
		}
	}
}

run();

