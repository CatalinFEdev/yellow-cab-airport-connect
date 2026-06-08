// AWS SES SendEmail via SigV4-signed HTTPS POST.
// Pure Web Crypto — works on the Cloudflare Workers SSR runtime.
// Reads AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION from process.env
// at call time (NOT at module scope).

const enc = new TextEncoder();

async function sha256Hex(data: string | Uint8Array): Promise<string> {
  const buf = typeof data === "string" ? enc.encode(data) : data;
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
}

async function signingKey(secret: string, dateStamp: string, region: string, service: string) {
  const kDate    = await hmac(enc.encode("AWS4" + secret), dateStamp);
  const kRegion  = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, "aws4_request");
  return kSigning;
}

function toAmzDate(d: Date) {
  // YYYYMMDDTHHMMSSZ
  return d.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

export type SendEmailInput = {
  from: string;
  to: string;
  subject: string;
  bodyText: string;
  replyTo?: string;
};

export async function sendEmailViaSES(input: SendEmailInput): Promise<{ messageId: string }> {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region    = process.env.AWS_REGION;

  if (!accessKey || !secretKey || !region) {
    throw new Error("Missing AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION");
  }

  const service = "email";
  const host    = `email.${region}.amazonaws.com`;
  const endpoint = `https://${host}/`;
  const method  = "POST";
  const contentType = "application/x-www-form-urlencoded";

  // SES Classic SendEmail (Query API)
  const params = new URLSearchParams({
    Action: "SendEmail",
    Version: "2010-12-01",
    Source: input.from,
    "Destination.ToAddresses.member.1": input.to,
    "Message.Subject.Data": input.subject,
    "Message.Subject.Charset": "UTF-8",
    "Message.Body.Text.Data": input.bodyText,
    "Message.Body.Text.Charset": "UTF-8",
  });
  if (input.replyTo) params.set("ReplyToAddresses.member.1", input.replyTo);
  const body = params.toString();

  const now = new Date();
  const amzDate    = toAmzDate(now);             // 20260608T120000Z
  const dateStamp  = amzDate.slice(0, 8);        // 20260608
  const payloadHash = await sha256Hex(body);

  // Canonical request
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  const canonicalRequest =
    `${method}\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  // String to sign
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign =
    `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;

  // Signature
  const kSigning = await signingKey(secretKey, dateStamp, region, service);
  const sigBuf = await hmac(kSigning, stringToSign);
  const signature = [...new Uint8Array(sigBuf)]
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const authorization =
    `${algorithm} Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": contentType,
      "X-Amz-Date": amzDate,
      Authorization: authorization,
    },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`SES SendEmail failed (${res.status}): ${text}`);
  }
  const m = text.match(/<MessageId>([^<]+)<\/MessageId>/);
  return { messageId: m?.[1] ?? "unknown" };
}
