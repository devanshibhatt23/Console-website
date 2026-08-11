import './ConsoleTerminal.css';

export default function Hero() {
  return (
    <section
      id="hero"
      className="console-terminal-hero"
    >
      <div className="console-terminal-shell">
        <div className="console-terminal-titlebar">
          <div className="console-terminal-title">
            <span className="console-terminal-prompt" aria-hidden="true">&gt;</span>
            <span>console &gt; {'{ ! }'}</span>
          </div>
          <div className="console-terminal-controls" aria-hidden="true">
            <span>−</span>
            <span>□</span>
            <span>×</span>
          </div>
        </div>

        <div className="console-terminal-content">
          <h1>Welcome to CONSOLE</h1>
          <p>Technical Community of MNIT</p>
        </div>
      </div>
    </section>
  );
}
