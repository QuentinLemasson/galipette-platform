import pkg from "../../../package.json" with { type: "json" };
import { kebabToTitle } from "./string.util";

type PackageContributorsManifest = {
  author?: string | { name?: string };
  contributors?: Array<string | { name?: string }>;
};

export function getContributors(): string[] {
  const manifest = pkg as PackageContributorsManifest;
  if (Array.isArray(manifest.contributors)) {
    return manifest.contributors
      .map((contributor) =>
        typeof contributor === "string" ? contributor : contributor?.name
      )
      .filter(Boolean) as string[];
  }
  if (typeof manifest.author === "string") {
    return [manifest.author];
  }
  if (
    manifest.author &&
    typeof manifest.author === "object" &&
    manifest.author.name
  ) {
    return [manifest.author.name];
  }
  return [];
}

export function getAppDisplayName(): string {
  const name =
    (pkg as { displayName?: string; name?: string }).displayName ??
    (pkg as { name?: string }).name ??
    "App";
  return name.includes("-") ? kebabToTitle(name) : name;
}

export function getAppVersion(): string {
  return (pkg as { version?: string }).version ?? "0.0.0";
}
