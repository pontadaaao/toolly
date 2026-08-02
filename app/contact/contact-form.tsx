"use client";

import { useId, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/error-message";

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot field: real visitors never fill this in; bots often do. */
  website: string;
}

const initialValues: ContactFormValues = { name: "", email: "", subject: "", message: "", website: "" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RequiredBadge() {
  return (
    <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-white">
      必須
    </span>
  );
}

/** Contact form. Submits directly to Formspree (no backend of our own required). */
export function ContactForm({ formEndpoint }: { formEndpoint: string }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const formId = useId();

  function update<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (values.website.trim()) return; // honeypot triggered — silently ignore

    const nextErrors: typeof errors = {};
    if (!values.name.trim()) nextErrors.name = "お名前を入力してください。";
    if (!values.email.trim()) nextErrors.email = "メールアドレスを入力してください。";
    else if (!emailPattern.test(values.email)) nextErrors.email = "メールアドレスの形式が正しくありません。";
    if (!values.subject.trim()) nextErrors.subject = "件名を入力してください。";
    if (!values.message.trim()) nextErrors.message = "お問い合わせ内容を入力してください。";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setValues(initialValues);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
          <CheckCircle2 className="size-6" />
        </span>
        <p className="font-medium">お問い合わせを送信しました</p>
        <p className="text-sm text-muted-foreground">ご連絡ありがとうございます。内容を確認のうえ、必要に応じてご返信いたします。</p>
        <Button type="button" variant="outline" onClick={() => setStatus("idle")}>
          もう一度送信する
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
      {/* Honeypot — visually hidden from sighted users, skipped by keyboard tab order */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${formId}-website`}>ウェブサイト</label>
        <input
          id={`${formId}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-name`} className="w-full justify-between">
          <span>お名前</span>
          <RequiredBadge />
        </Label>
        <Input
          id={`${formId}-name`}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          placeholder="山田 太郎"
        />
        {errors.name && <ErrorMessage id={`${formId}-name-error`}>{errors.name}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-email`} className="w-full justify-between">
          <span>メールアドレス</span>
          <RequiredBadge />
        </Label>
        <Input
          id={`${formId}-email`}
          type="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          placeholder="you@example.com"
        />
        {errors.email && <ErrorMessage id={`${formId}-email-error`}>{errors.email}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-subject`} className="w-full justify-between">
          <span>件名</span>
          <RequiredBadge />
        </Label>
        <Input
          id={`${formId}-subject`}
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? `${formId}-subject-error` : undefined}
          placeholder="お問い合わせの件名"
        />
        {errors.subject && <ErrorMessage id={`${formId}-subject-error`}>{errors.subject}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${formId}-message`} className="w-full justify-between">
          <span>お問い合わせ内容</span>
          <RequiredBadge />
        </Label>
        <Textarea
          id={`${formId}-message`}
          rows={6}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          placeholder="お問い合わせ内容をご記入ください"
        />
        {errors.message && <ErrorMessage id={`${formId}-message-error`}>{errors.message}</ErrorMessage>}
      </div>

      {status === "error" && (
        <ErrorMessage>送信に失敗しました。時間をおいて再度お試しください。</ErrorMessage>
      )}

      <Button type="submit" disabled={status === "submitting"} className="gap-1.5">
        <Send className="size-4" />
        {status === "submitting" ? "送信中…" : "送信する"}
      </Button>
    </form>
  );
}
