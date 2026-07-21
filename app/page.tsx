"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { useHistoryDB } from "@/hooks/useHistoryDB";
import Divider from "@/components/Divider";
import { formatDate } from "@/utils/date";
import styles from "./page.module.css";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const shortenUrl = process.env.NEXT_PUBLIC_SHORTEN_URL || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const schema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL không được để trống")
    .pipe(z.url("URL không hợp lệ")),
});

type FormData = z.infer<typeof schema>;


export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
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
      },
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
    reset();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={`page-header ${styles.header}`}>
        <div className={styles.brandContainer}>
          <span className={styles.brandTitle}>shrt.io</span>
          <span className={styles.brandSubtitle}>URL Shortener</span>
        </div>

        <div className={styles.badge}>Không quảng cáo · Không theo dõi</div>
      </header>

      {/* Divider */}
      <Divider />

      {/* Main Content */}
      <main className={`page-main ${styles.main}`}>
        {/* Hero Section — 2 columns */}
        <section className="hero-grid" style={{ marginBottom: "48px" }}>
          {/* Left — Form */}
          <div
            className="hero-form-box"
            style={{ border: "3px solid #141210", background: "#FFFDF7" }}
          >
            <p className={styles.formLabel}>Dán URL cần rút gọn</p>

            <h1 className={styles.heroTitle}>
              Nhập một đường link, nhận về
              <br />
              một mã ngắn.
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="https://vidu.com/duong-link-rat-dai-cua-ban"
                {...register("url")}
                className={styles.input}
              />
              {errors.url && (
                <p className={styles.errorText}>{errors.url.message}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`submit-btn ${styles.submitBtn} ${
                  isLoading ? styles.submitBtnLoading : styles.submitBtnActive
                }`}
              >
                {isLoading ? "Đang tạo…" : "Rút gọn →"}
              </button>
            </form>
          </div>

          {/* Right — Info Box */}
          <div className={styles.infoBox}>
            <p className={styles.infoTitle}>Cách hoạt động</p>
            <p className={styles.infoDesc}>
              Link được rút gọn ngay trong trình duyệt của bạn. Mọi mã ngắn được
              lưu cục bộ — xoá bất cứ lúc nào ở phần lịch sử bên dưới.
            </p>
          </div>
        </section>

        {/* Divider */}
        <Divider />

        {/* History Section */}
        <section>
          <div className={styles.historyHeader}>
            <div className={styles.historyTitleContainer}>
              <h2 className={styles.historyTitle}>Lịch sử</h2>
              <span className={styles.historyCount}>{count} link</span>
            </div>

            {count > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className={`clear-all-btn ${styles.clearBtn}`}
              >
                Xoá tất cả
              </button>
            )}
          </div>

          {/* History List */}
          {count === 0 ? (
            <div className={styles.emptyState}>
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
                    className={`short-url-link ${styles.shortUrlLink}`}
                  >
                    {entry.shortUrl
                      .replace("https://", "")
                      .replace("http://", "")}
                  </a>

                  {/* Original URL */}
                  <span className="original-url">{entry.originalUrl}</span>

                  {/* Date */}
                  <span className={`history-date ${styles.historyDate}`}>
                    {formatDate(entry.createdAt)}
                  </span>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => entry.id && deleteEntry(entry.id)}
                    className={`delete-btn ${styles.deleteBtn}`}
                    title="Xoá"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Error Modal */}
      {errorMsg && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Lỗi tạo link</h3>
            <p className={styles.modalDesc}>{errorMsg}</p>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className={styles.modalCloseBtn}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
