import { describe, it, expect } from "vitest";

/**
 * Smoke test the Web Crypto primitives the SES signer relies on.
 * The real signer reads process.env at call time so we don't invoke it here;
 * instead we verify the same low-level operations produce stable SigV4-shaped
 * output (deterministic SHA-256 + HMAC chain).
 */

const enc = new TextEncoder();

async function sha256Hex(data: string) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(data));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(key: ArrayBuffer | Uint8Array, data: string) {
  const k = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(data)));
}

describe("SES SigV4 primitives", () => {
  it("computes a known SHA-256 hash", async () => {
    expect(await sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it("HMAC chain produces a 32-byte signing key", async () => {
    const k1 = await hmac(enc.encode("AWS4secret"), "20260608");
    const k2 = await hmac(k1, "eu-west-1");
    const k3 = await hmac(k2, "email");
    const k4 = await hmac(k3, "aws4_request");
    expect(k4.length).toBe(32);
  });
});
