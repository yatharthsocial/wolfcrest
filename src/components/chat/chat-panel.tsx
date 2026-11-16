"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import logo from "@/assets/logowolf.png";
import {
  greeting,
  replyFor,
  replyForBudget,
  replyForText,
  type Option,
  type Reply,
  type Topic,
} from "./bot";

type Message = { id: number; from: "bot" | "user"; text: string; options?: Option[] };

let nextId = 0;
const bot = (r: Reply): Message => ({ id: nextId++, from: "bot", ...r });
const user = (text: string): Message => ({ id: nextId++, from: "user", text });

/** How long the assistant "types" before a reply, scaled to its length */
const typingTime = (text: string) => Math.min(1400, 450 + text.length * 6);

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => [bot(greeting)]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const topic = useRef<Topic>("menu");
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef(0);

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer.current);
    };
  }, [onClose]);

  // Keep the newest message in view
  useEffect(() => {
    const el = list.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const respond = (said: string, reply: Reply) => {
    window.clearTimeout(timer.current);
    // Options on older messages are spent once the visitor moves on
    setMessages((m) => [...m.map((x) => ({ ...x, options: undefined })), user(said)]);
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, bot(reply)]);
    }, typingTime(reply.text));
  };

  const choose = (option: Option) => {
    if ("topic" in option) {
      topic.current = option.topic;
      respond(option.label, replyFor(option.topic));
    } else if ("budget" in option) {
      respond(option.label, replyForBudget(topic.current, option.budget));
    }
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const { topic: matched, reply } = replyForText(text);
    if (matched) topic.current = matched;
    respond(text, reply);
  };

  const chip =
    "chat-msg inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-left text-[0.72rem] tracking-wide text-white/85 transition-colors duration-300 hover:border-white hover:bg-white hover:text-background";

  return (
    <div
      role="dialog"
      aria-label="Chat with The Wolf Crest"
      data-chat-panel
      className="chat-open fixed z-[36] flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#1c1a18]/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl max-lg:inset-x-3 max-lg:bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:h-[min(36rem,calc(100svh-1.5rem))] lg:right-[calc((max(4vw,3.5rem)-2.5rem)/2+3.5rem)] lg:top-1/2 lg:h-[min(36rem,80svh)] lg:w-[23.5rem] lg:[translate:0_-50%]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
          <Image src={logo} alt="" sizes="40px" className="h-auto w-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm tracking-wide">The Wolf Crest</span>
          <span className="flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-white/50">
            <span className="size-1.5 rounded-full bg-[#c9a96b]" />
            Property assistant
          </span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors duration-300 hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={list}
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]"
      >
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg flex flex-col gap-2 ${m.from === "user" ? "items-end" : "items-start"}`}>
            <p
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.86rem] leading-relaxed ${
                m.from === "user"
                  ? "rounded-br-md bg-white text-background"
                  : "rounded-bl-md bg-white/[0.07] text-white/90"
              }`}
            >
              {m.text}
            </p>
            {m.options && (
              <div className="flex max-w-full flex-wrap gap-1.5">
                {m.options.map((o, i) =>
                  "href" in o ? (
                    <a
                      key={o.label}
                      href={o.href}
                      {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      style={{ animationDelay: `${120 + i * 50}ms` }}
                      className={`${chip} ${o.label.includes("WhatsApp") ? "border-[#25D366]/60 text-[#7ee2a4] hover:border-[#25D366] hover:bg-[#25D366] hover:text-white" : ""}`}
                    >
                      {o.label}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3" aria-hidden>
                        <path d="M4 12L12 4M6 4h6v6" />
                      </svg>
                    </a>
                  ) : (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => choose(o)}
                      style={{ animationDelay: `${120 + i * 50}ms` }}
                      className={chip}
                    >
                      {o.label}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="chat-msg chat-typing flex w-fit gap-1 rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-3.5" aria-label="Typing">
            <span className="size-1.5 rounded-full bg-white" />
            <span className="size-1.5 rounded-full bg-white" />
            <span className="size-1.5 rounded-full bg-white" />
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-3">
        <input
          ref={input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type your question…"
          aria-label="Your message"
          maxLength={500}
          className="min-w-0 flex-1 rounded-full bg-white/[0.06] px-4 py-2.5 text-base text-white placeholder:text-white/35 focus:bg-white/[0.09] focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-background transition-opacity duration-300 disabled:cursor-default disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
