import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

type Floater = {
  left: string;
  size: string;
  delay: string;
  duration: string;
  opacity: string;
};

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const openTimer = useRef<number | null>(null);

  // Respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();

    if (mq.addEventListener) mq.addEventListener("change", sync);
    else mq.addListener(sync);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", sync);
      else mq.removeListener(sync);
    };
  }, []);

  const closeAll = () => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    setIsModalOpen(false);
    setIsEnvelopeOpen(false);
  };

  const openAll = () => {
    setIsEnvelopeOpen(true);

    // Let the heart burst be visible before the overlay covers it
    const delay = reduceMotion ? 0 : 520;
    openTimer.current = window.setTimeout(() => {
      setIsModalOpen(true);
      openTimer.current = null;
    }, delay);
  };

  const onToggle = () => {
    if (isEnvelopeOpen || isModalOpen) closeAll();
    else openAll();
  };

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Prevent page scroll while modal open
  useEffect(() => {
    if (!isModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isModalOpen]);

  const floaters = useMemo<Floater[]>(
    () => [
      {
        left: "8%",
        size: "10px",
        delay: "0s",
        duration: "8s",
        opacity: "0.25",
      },
      {
        left: "16%",
        size: "14px",
        delay: "1.5s",
        duration: "10s",
        opacity: "0.2",
      },
      {
        left: "28%",
        size: "9px",
        delay: "0.6s",
        duration: "9s",
        opacity: "0.18",
      },
      {
        left: "37%",
        size: "12px",
        delay: "2.2s",
        duration: "11s",
        opacity: "0.22",
      },
      {
        left: "46%",
        size: "8px",
        delay: "0.2s",
        duration: "7.5s",
        opacity: "0.2",
      },
      {
        left: "54%",
        size: "15px",
        delay: "1.1s",
        duration: "10.5s",
        opacity: "0.22",
      },
      {
        left: "62%",
        size: "10px",
        delay: "2.8s",
        duration: "9.5s",
        opacity: "0.18",
      },
      {
        left: "71%",
        size: "13px",
        delay: "0.9s",
        duration: "12s",
        opacity: "0.2",
      },
      {
        left: "80%",
        size: "9px",
        delay: "1.9s",
        duration: "8.8s",
        opacity: "0.18",
      },
      {
        left: "90%",
        size: "12px",
        delay: "0.4s",
        duration: "11.5s",
        opacity: "0.2",
      },
      {
        left: "22%",
        size: "16px",
        delay: "3.1s",
        duration: "13s",
        opacity: "0.18",
      },
      {
        left: "66%",
        size: "7px",
        delay: "2.4s",
        duration: "7.8s",
        opacity: "0.18",
      },
    ],
    [],
  );

  return (
    <div className="page">
      {!reduceMotion && (
        <div className="floaters" aria-hidden="true">
          {floaters.map((f, i) => (
            <span
              key={i}
              className="floater"
              style={{
                left: f.left,
                width: f.size,
                height: f.size,
                animationDelay: f.delay,
                animationDuration: f.duration,
                opacity: f.opacity,
              }}
            />
          ))}
        </div>
      )}

      <main className="center">
        <header className="top">
          <div className="badge">
            An apology to my favorite person in Edinburgh...
          </div>
          <h1 className="title">For Mathu 💙</h1>
          <p className="subtitle">Click the envelope to open your letter.</p>
        </header>

        <section className="stage">
          <button
            type="button"
            className={`envelope ${isEnvelopeOpen ? "open" : ""}`}
            onClick={onToggle}
            aria-label={
              isEnvelopeOpen || isModalOpen
                ? "Close the letter"
                : "Open the letter"
            }
          >
            <span className="stamp" aria-hidden="true">
              ★
            </span>

            <span className="env-shadow" aria-hidden="true" />
            <span className="env-back" aria-hidden="true" />
            <span className="env-body" aria-hidden="true" />
            <span className="env-flap" aria-hidden="true" />

            <span className="letter" aria-hidden="true">
              <span className="letter-top">
                <span className="mini-heart" />
                <span className="mini-heart" />
                <span className="mini-heart" />
              </span>
              <span className="letter-lines" />
              <span className="letter-lines short" />
              <span className="letter-lines" />
            </span>

            {!reduceMotion && (
              <span className="burst" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="burst-heart" />
                ))}
              </span>
            )}

            <span className="hint" aria-hidden="true">
              {isEnvelopeOpen || isModalOpen ? "tap to close" : "tap to open"}
            </span>
          </button>

          {/* FULLSCREEN modal (fixed). Outside click closes */}
          <div
            className={`modal ${isModalOpen ? "show" : ""}`}
            role="dialog"
            aria-modal="true"
            onClick={closeAll}
          >
            <div className="paper" onClick={(e) => e.stopPropagation()}>
              <div className="paper-header">
                <div className="paper-title">
                  <div className="paper-kicker">To my cutie patootie</div>
                  <div className="paper-heading">I’m so fucking sorry T_T</div>
                </div>

                <button className="close" type="button" onClick={closeAll}>
                  Close
                </button>
              </div>

              <div className="paper-body">
                <p>
                  Mathu, I’ve been thinking about how much of a dumb fuck I’ve
                  been. I want to tell you one thing clearly, I’m very sorry. I
                  hate what I did today and I hate the fact that my actions made
                  you feel hurt.
                </p>

                <p>
                  You matter to me sooooooo much and its killing me to see you
                  sick and on top of that being hurt because of me during such a
                  time. I should have been more empathetic and should have
                  understood that you needed me and for not doing that I’m truly
                  sorry Mathu.
                </p>

                <p>
                  You do deserve better, before all this I usually thought of
                  someone else being that “better version” but now I want to be
                  that “better version” for you. One of the reasons I took up
                  bouldering was to strengthen myself. You always mentioned you
                  wanted someone strong and someone who can protect you. But
                  that does not justify me going to boulder right when you’re
                  sick rather than any other blessed fucking day.
                </p>

                <p>
                  I know I can sometimes be very hard to deal with but I promise
                  you, I’m indeed trying my best to understand you more. I’m not
                  asking you to “get over it”, I just want a chance to do
                  better, after all I’m a work in progress T_T
                </p>

                <div className="signature">
                  <div className="sig-line">To the girl I fell harder for,</div>
                  <div className="sig-name">Ajay</div>
                </div>

                <div className="ps">
                  <div className="ps-title">P.S.</div>
                  <div className="ps-text">
                    You look the cutestttt when you smile…... gon earn that
                    smile back very soon. Cant wait for you to get better and
                    I'm always here for you no matter what ^_^
                  </div>
                </div>
              </div>

              {!reduceMotion && <div className="sparkle" aria-hidden="true" />}
            </div>
          </div>
        </section>

        <footer className="footer">
          <span className="footer-chip">
            made with too much love and care by this loosu ku
          </span>
        </footer>
      </main>
    </div>
  );
}
