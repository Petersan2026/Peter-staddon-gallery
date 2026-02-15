type SP = Record<string, string | string[] | undefined>;

async function resolveSearchParams(
  searchParams: SP | Promise<SP> | undefined
): Promise<SP> {
  if (!searchParams) return {};
  // If Next passes a Promise/thenable, await it
  if (typeof (searchParams as any)?.then === "function") {
    return (await searchParams) as SP;
  }
  return searchParams as SP;
}

export default async function UnlockPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await resolveSearchParams(searchParams);

  const next = typeof sp.next === "string" ? sp.next : "/";
  const slug = typeof sp.slug === "string" ? sp.slug : "";

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "60px auto",
        padding: 20,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Unlock</h1>

      <form method="POST" action="/api/unlock">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="slug" value={slug} />

        <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Passkey
        </label>

        <input
          name="passkey"
          type="password"
          autoComplete="off"
          spellCheck={false}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 14,
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Continue
        </button>
      </form>

      <p style={{ fontSize: 12, marginTop: 14, opacity: 0.6 }}>
        (This page is intentionally not linked.)
      </p>
    </main>
  );
}
