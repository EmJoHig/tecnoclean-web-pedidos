import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DiscountsBanner = ({ familias = null, variant = "default", onViewProducts }) => {
  const isLoading = familias === null;
  const isOverlay = variant === "overlay";
  const isInline = variant === "inline";
  const wrapperClass = isOverlay
    ? "relative z-30 mx-auto w-[92%] max-w-6xl"
    : isInline
      ? "relative z-20 mx-auto w-[92%] max-w-6xl"
      : "relative z-20 mx-auto w-[92%] max-w-6xl -mt-24 md:-mt-28";
  const narrowWrapperClass = isOverlay
    ? "relative z-30 mx-auto w-[92%] max-w-5xl"
    : isInline
      ? "relative z-20 mx-auto w-[92%] max-w-5xl"
      : "relative z-20 mx-auto w-[92%] max-w-5xl -mt-24 md:-mt-28";

  const activos = useMemo(() => {
    if (isLoading) return [];
    return (familias || []).filter(
      (f) => f?.descuento?.activo && Number(f?.descuento?.porcentaje) > 0
    );
  }, [familias, isLoading]);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (activos.length <= 1 || paused) return;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activos.length);
    }, 4500);

    return () => clearInterval(intervalRef.current);
  }, [activos.length, paused]);

  useEffect(() => {
    if (current >= activos.length) {
      setCurrent(0);
    }
  }, [activos.length, current]);

  if (isLoading) {
    return (
      <section className={wrapperClass}>
        <div className="rounded-2xl border border-rose-100 bg-white/90 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:p-6">
          <div className="h-4 w-40 animate-pulse rounded-full bg-rose-100" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded-lg bg-rose-50" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-rose-50" />
        </div>
      </section>
    );
  }

  if (activos.length === 0) {
    return (
      <section className={narrowWrapperClass}>
        <div className="rounded-2xl border border-rose-100 bg-white/95 px-6 py-6 text-center shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Promociones
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-gray-800">
            Sin descuentos activos
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Cuando cargues promociones, se mostraran aqui.
          </p>
        </div>
      </section>
    );
  }

  const principal = activos[current] || activos[0];

  return (
    <section className={wrapperClass}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={principal?._id || current}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-rose-100 bg-[linear-gradient(120deg,#ffffff_0%,#fff1f2_55%,#ffe4e6_100%)] px-5 py-5 font-['Poppins'] shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:px-7 md:py-6"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(248,113,113,0.18),transparent_45%)]" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_rgba(248,113,113,0.25)]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-8 w-8 text-red-600"
                  fill="currentColor"
                >
                  <path d="M21.41 11.58 12.42 2.59A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l8.99 8.99a2 2 0 0 0 2.83 0l6.99-6.99a2 2 0 0 0 .01-2.83ZM7.5 7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
                  Descuentos en
                </p>
                <h3 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
                  {principal?.descripcion}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-base">
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Promocion unica
                  </span>
                  <span className="text-base font-semibold text-gray-700">
                    Vigente ahora
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden h-12 w-px rounded-full bg-rose-200 md:block" />

            <div className="flex flex-1 flex-col items-start gap-4 md:items-end">
              <div className="flex items-center gap-4 md:justify-end">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-rose-200 bg-white text-red-600 shadow-[0_14px_30px_rgba(248,113,113,0.28)] md:h-28 md:w-28">
                  <div className="text-center">
                    <div className="text-3xl font-black leading-none md:text-4xl">
                      {principal?.descuento?.porcentaje}%
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-gray-700">
                      Off
                    </div>
                  </div>
                </div>

                {/* <div className="hidden md:block">
                  <p className="text-base font-semibold text-red-600">
                    en todos
                  </p>
                  <p className="text-base font-semibold text-red-600">
                    los {principal?.descripcion?.toLowerCase?.() || "productos"}
                  </p>
                </div> */}
              </div>

              <button
                type="button"
                onClick={() => onViewProducts?.(principal)}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-base font-semibold text-white shadow-[0_10px_22px_rgba(239,68,68,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Ver productos
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>
    </section>
  );
};

export default DiscountsBanner;