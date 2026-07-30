import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function BootError({ error }) {
  return (
    <div style={{
      minHeight: "100vh",
      padding: 24,
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Frontend failed to render</h1>
      <p style={{ marginTop: 8, color: "#475569" }}>Open the terminal/browser console for the full stack trace.</p>
      <pre style={{
        marginTop: 16,
        maxWidth: 960,
        overflow: "auto",
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        padding: 16,
        whiteSpace: "pre-wrap",
      }}>{error?.stack || error?.message || String(error)}</pre>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.error) return <BootError error={this.state.error} />;
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

import("./CelloPressureHeatmapUI.jsx")
  .then(({ default: CelloPressureHeatmapUI }) => {
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <CelloPressureHeatmapUI />
        </ErrorBoundary>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error(error);
    root.render(<BootError error={error} />);
  });
