@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
@import "./tokens.css";

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: var(--font-family-base);
  background: var(--ecobus-bg);
  color: var(--ecobus-text);
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

.ecobus-app {
  width: 100%;
  max-width: var(--container-width);
  min-height: 100vh;
  margin: 0 auto;
  background: var(--ecobus-bg);
  position: relative;
}

.ecobus-page {
  padding: var(--space-6) var(--space-4) calc(var(--space-8) + 88px);
}

.ecobus-page--auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
}

.ecobus-card {
  background: var(--ecobus-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(217, 226, 236, 0.8);
}

.ecobus-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ecobus-text);
}

.ecobus-subtitle {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--ecobus-text-soft);
}

.ecobus-section-title {
  margin: 0 0 var(--space-3);
  font-size: 18px;
  font-weight: 700;
  color: var(--ecobus-text);
}

.ecobus-muted {
  color: var(--ecobus-text-muted);
}
