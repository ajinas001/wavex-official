"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Button from "./Button";

interface FieldState {
  value: string;
  touched: boolean;
}

interface FieldDef {
  id: string;
  label: string;
  type: "text" | "email";
  required?: boolean;
  min?: number;
  placeholder?: string;
}

const FIELDS: FieldDef[] = [
  { id: "full_name", label: "Full Name", type: "text", required: true, min: 2, placeholder: "Nick Harrison" },
  { id: "email_address", label: "Email Address", type: "email", required: true, placeholder: "nick-h@gmail.com" },
  { id: "country", label: "Country", type: "text", placeholder: "Switzerland" },
  { id: "city", label: "City", type: "text", placeholder: "Basel" },
];

const CONTEXT_ID = "context_for_admission";

/**
 * AdmissionForm — full-screen yellow-underlay form. Port of obsidian's
 * `.full-screen-form`; opened via the `wavex:open-admission` event.
 */
export default function AdmissionForm() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Record<string, FieldState>>({});
  const [context, setContext] = useState("");
  const [contextTouched, setContextTouched] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onOpen = () => {
      setSubmitted(false);
      setError(null);
      setOpen(true);
    };
    window.addEventListener("wavex:open-admission", onOpen);
    return () => window.removeEventListener("wavex:open-admission", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const set = (id: string) => (value: string) =>
    setFields((f) => ({ ...f, [id]: { value, touched: f[id]?.touched ?? false } }));

  const touch = (id: string) =>
    setFields((f) => ({ ...f, [id]: { value: f[id]?.value ?? "", touched: true } }));

  const validate = () => {
    for (const f of FIELDS) {
      const v = fields[f.id]?.value?.trim() ?? "";
      if (f.required && !v) return `${f.label} is required.`;
      if (f.min && v.length < f.min) return `${f.label} must be at least ${f.min} characters.`;
      if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return "Email address looks off.";
    }
    if (context.trim().length < 10) return "Tell us a bit more (min 10 characters).";
    if (!agreed) return "Please accept the policy to continue.";
    return null;
  };

  const submit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  const F = reduce ? "linear" : [0.5, 0, 0.3, 1];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] overflow-y-auto bg-yellow text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: F }}
        >
          <div className="min-h-full px-gap py-gap">
            <div className="mx-auto flex max-w-[900px] flex-col">
              {/* Top bar */}
              <div className="flex items-start justify-between">
                <span className="font-display text-[1.5rem] font-light leading-none">
                  The WaveX Assembly
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  data-cursor="link"
                  className="grid h-10 w-10 place-items-center rounded-obs bg-black/10 hover:bg-black/20 transition-colors duration-900"
                >
                  <span className="relative block h-4 w-4">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-black" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-black" />
                  </span>
                </button>
              </div>

              {submitted ? (
                <div className="flex flex-1 flex-col items-start justify-center py-24">
                  <h2 className="font-display text-[var(--h1)] font-light leading-[1.02]">
                    Received.
                  </h2>
                  <p className="mt-6 max-w-md text-[var(--p)] text-black/60">
                    Your request is in. We consider every admission
                    personally and reply within a day.
                  </p>
                  <Button label="Return to site" variant="solid" onClick={() => setOpen(false)} className="mt-12" />
                </div>
              ) : (
                <>
                  <h2 className="mt-10 font-display text-[var(--h2)] md:text-[var(--h1)] font-light leading-[1.02]">
                    Admission
                  </h2>

                  <form
                    className="mt-12 flex flex-col gap-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submit();
                    }}
                  >
                    {FIELDS.map((f, i) => {
                      const state = fields[f.id];
                      const showError =
                        state?.touched &&
                        f.required &&
                        !state.value.trim();
                      return (
                        <label
                          key={f.id}
                          className="group flex flex-col gap-2 border-b border-black/20 pb-3"
                          style={{
                            transitionDelay: `${i * 0.05}s`,
                          }}
                        >
                          <span className="font-display text-[var(--h5)] font-light text-black/60">
                            {f.label}
                          </span>
                          <div className="relative">
                            {!state?.value && (
                              <span className="pointer-events-none absolute left-0 top-0 font-display text-[var(--h2)] font-light leading-none text-black/10">
                                {f.placeholder}
                              </span>
                            )}
                            <input
                              id={f.id}
                              type={f.type}
                              value={state?.value ?? ""}
                              onChange={(e) => set(f.id)(e.target.value)}
                              onBlur={() => touch(f.id)}
                              className={`relative w-full bg-transparent font-display text-[var(--h2)] font-light leading-none outline-none transition-colors duration-900 focus:text-black ${
                                showError ? "text-red" : "text-black"
                              }`}
                            />
                          </div>
                          {showError && (
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-red">
                              Required
                            </span>
                          )}
                        </label>
                      );
                    })}

                    <label className="flex flex-col gap-2 border-t border-black/20 pt-6">
                      <span className="font-display text-[var(--h5)] font-light text-black/60">
                        Context for Admission
                      </span>
                      <textarea
                        id={CONTEXT_ID}
                        rows={3}
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        onBlur={() => setContextTouched(true)}
                        className="w-full resize-none bg-transparent font-body text-[var(--p)] leading-relaxed text-black outline-none"
                        placeholder="I am an Artist, leaving in…"
                      />
                      {contextTouched && context.trim().length > 0 && context.trim().length < 10 && (
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-red">
                          Min 10 characters
                        </span>
                      )}
                    </label>

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-black"
                      />
                      <span className="text-[var(--mm)] text-black/70">
                        I accept the{" "}
                        <a href="#" className="text-brown underline hover:no-underline">
                          ImaginePossible Policy
                        </a>
                        .
                      </span>
                    </label>

                    {error && (
                      <p className="font-body text-[var(--mm)] text-red">{error}</p>
                    )}

                    <div className="pb-24 pt-4">
                      <Button label="Submit Admission" variant="solid" onClick={submit} className="w-full" />
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
