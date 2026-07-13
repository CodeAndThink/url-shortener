"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { useHistoryDB } from "@/hooks/useHistoryDB";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const shortenUrl = process.env.NEXT_PUBLIC_SHORTEN_URL || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const schema = z.object({
  url: z
    .string()
    .trim()
    .nonempty("URL không được để trống")
    .url("URL không hợp lệ"),
});

type FormData = z.infer<typeof schema>;

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { entries, count, addEntry, deleteEntry, clearAll } = useHistoryDB();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    const { data: shortCode, error } = await supabase.rpc(
      "generate_short_url",
      {
        p_long_url: data.url,
        p_code_length: 6,
      }
    );

    if (error) {
      console.error("Error creating link:", error.message);
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    const newShortUrl = `${shortenUrl}${shortCode}`;

    // Save to IndexedDB
    await addEntry({
      shortUrl: newShortUrl,
      originalUrl: data.url,
      createdAt: new Date().toISOString(),
    });

    setIsLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-cream)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        className="page-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 32px",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            shrt.io
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 400,
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            URL Shortener
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            background: "#1a1a1a",
            color: "#FAF5EF",
            padding: "8px 16px",
          }}
        >
          Không quảng cáo · Không theo dõi
        </div>
      </header>

      {/* Main Content */}
      <main
        className="page-main"
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "16px 32px 64px",
          flex: 1,
        }}
      >
        {/* Hero Section — 2 columns */}
        <section className="hero-grid" style={{ marginBottom: "48px" }}>
          {/* Left — Form */}
          <div
            style={{
              border: "1px solid #d4cdc4",
              padding: "40px",
              background: "#FAF5EF",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#6b6560",
                marginBottom: "12px",
              }}
            >
              Dán URL cần rút gọn
            </p>

            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#1a1a1a",
                marginBottom: "28px",
                letterSpacing: "-0.02em",
              }}
            >
              Nhập một đường link,
              <br />
              nhận về một mã ngắn.
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="https://vidu.com/duong-link-rat-dai-cua-ban"
                {...register("url")}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  padding: "14px 16px",
                  border: "1px solid #d4cdc4",
                  background: "transparent",
                  color: "#1a1a1a",
                  marginBottom: "8px",
                }}
              />
              {errors.url && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "#E8542C",
                    marginBottom: "8px",
                  }}
                >
                  {errors.url.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn"
                style={{
                  width: "100%",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  padding: "16px",
                  background: isLoading ? "#d4cdc4" : "#E8542C",
                  color: "#fff",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background 0.2s ease",
                  marginTop: "4px",
                }}
              >
                {isLoading ? "Đang tạo…" : "Rút gọn →"}
              </button>
            </form>
          </div>

          {/* Right — Info Box */}
          <div
            style={{
              background: "#1a1a1a",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#E8542C",
                marginBottom: "16px",
              }}
            >
              Cách hoạt động
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "#e8e0d8",
              }}
            >
              Link được rút gọn ngay trong trình duyệt của bạn. Mọi mã ngắn
              được lưu cục bộ — xoá bất cứ lúc nào ở phần lịch sử bên dưới.
            </p>
          </div>
        </section>

        {/* Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #d4cdc4",
            marginBottom: "32px",
          }}
        />

        {/* History Section */}
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "12px" }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}
              >
                Lịch sử
              </h2>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: "#6b6560",
                }}
              >
                {count} link
              </span>
            </div>

            {count > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="clear-all-btn"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "8px 16px",
                  background: "transparent",
                  color: "#1a1a1a",
                  border: "1px solid #d4cdc4",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Xoá tất cả
              </button>
            )}
          </div>

          {/* History List */}
          {count === 0 ? (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "#6b6560",
                padding: "40px 0",
                textAlign: "center",
              }}
            >
              Chưa có link nào được rút gọn.
            </div>
          ) : (
            <div>
              {entries.map((entry) => (
                <div key={entry.id} className="history-row">
                  {/* Short URL */}
                  <a
                    href={entry.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-url-link"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.shortUrl
                      .replace("https://", "")
                      .replace("http://", "")}
                  </a>

                  {/* Original URL */}
                  <span
                    className="original-url"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "#6b6560",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {entry.originalUrl}
                  </span>

                  {/* Date */}
                  <span
                    className="history-date"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      color: "#6b6560",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(entry.createdAt)}
                  </span>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => entry.id && deleteEntry(entry.id)}
                    className="delete-btn"
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      background: "transparent",
                      color: "#6b6560",
                      border: "1px solid #d4cdc4",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      lineHeight: 1,
                    }}
                    title="Xoá"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Error Modal */}
      {errorMsg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#FAF5EF",
              border: "1px solid #d4cdc4",
              padding: "32px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "8px",
                color: "#1a1a1a",
              }}
            >
              Lỗi tạo link
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "#6b6560",
                marginBottom: "24px",
                lineHeight: 1.5,
              }}
            >
              {errorMsg}
            </p>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "10px 24px",
                background: "#1a1a1a",
                color: "#FAF5EF",
                border: "none",
                cursor: "pointer",
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
