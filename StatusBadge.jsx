.ecobus-brand-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.ecobus-logo-badge {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(180deg, var(--ecobus-primary), var(--ecobus-primary-strong));
  color: white;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 800;
  box-shadow: var(--shadow-md);
}

.ecobus-auth-card {
  width: 100%;
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  background: var(--ecobus-surface);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(217, 226, 236, 0.9);
}

.ecobus-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ecobus-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ecobus-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ecobus-text);
}

.ecobus-input {
  width: 100%;
  height: 54px;
  border-radius: 16px;
  border: 1px solid var(--ecobus-border);
  background: #fff;
  padding: 0 16px;
  font-size: 16px;
  color: var(--ecobus-text);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ecobus-input:focus {
  border-color: var(--ecobus-primary);
  box-shadow: 0 0 0 4px rgba(15, 61, 117, 0.12);
}

.ecobus-button {
  width: 100%;
  min-height: 54px;
  border: 0;
  border-radius: 18px;
  background: var(--ecobus-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  padding: 0 18px;
  transition: transform 0.12s ease, background 0.2s ease;
}

.ecobus-button:hover {
  background: var(--ecobus-primary-strong);
}

.ecobus-button:active {
  transform: scale(0.99);
}

.ecobus-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ecobus-helper-text {
  font-size: 13px;
  line-height: 1.5;
  color: var(--ecobus-text-muted);
}

.ecobus-error-box {
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--ecobus-danger-soft);
  color: var(--ecobus-danger);
  font-size: 14px;
  line-height: 1.5;
}

.ecobus-success-box {
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--ecobus-success-soft);
  color: var(--ecobus-success);
  font-size: 14px;
  line-height: 1.5;
}

.ecobus-topbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.ecobus-topbar__eyebrow {
  font-size: 13px;
  font-weight: 700;
  color: var(--ecobus-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ecobus-grid {
  display: grid;
  gap: var(--space-4);
}

.ecobus-hero-card {
  padding: var(--space-5);
  background: linear-gradient(180deg, var(--ecobus-primary), var(--ecobus-primary-strong));
  color: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.ecobus-hero-card__label {
  font-size: 14px;
  opacity: 0.86;
  margin-bottom: var(--space-2);
}

.ecobus-hero-card__value {
  font-size: 44px;
  line-height: 1;
  font-weight: 800;
  margin-bottom: var(--space-2);
  letter-spacing: -0.04em;
}

.ecobus-hero-card__meta {
  font-size: 14px;
  opacity: 0.92;
}

.ecobus-info-card {
  padding: var(--space-5);
}

.ecobus-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.ecobus-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.ecobus-status-badge--success {
  background: var(--ecobus-success-soft);
  color: var(--ecobus-success);
}

.ecobus-status-badge--warning {
  background: var(--ecobus-warning-soft);
  color: var(--ecobus-warning);
}

.ecobus-status-badge--danger {
  background: var(--ecobus-danger-soft);
  color: var(--ecobus-danger);
}

.ecobus-quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.ecobus-quick-card {
  background: var(--ecobus-surface);
  border: 1px solid rgba(217, 226, 236, 0.8);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ecobus-quick-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--ecobus-primary-soft);
  color: var(--ecobus-primary);
  font-size: 18px;
  font-weight: 700;
}

.ecobus-quick-card__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ecobus-text);
}

.ecobus-quick-card__text {
  font-size: 12px;
  color: var(--ecobus-text-soft);
  line-height: 1.4;
}

.ecobus-loading {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.ecobus-loading__card {
  width: 100%;
  max-width: 360px;
  background: var(--ecobus-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: 32px 24px;
  text-align: center;
}

.ecobus-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid var(--ecobus-primary-soft);
  border-top-color: var(--ecobus-primary);
  border-radius: 999px;
  margin: 0 auto 16px;
  animation: ecobus-spin 0.8s linear infinite;
}

@keyframes ecobus-spin {
  to {
    transform: rotate(360deg);
  }
}

.ecobus-page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.ecobus-page-header__back {
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 14px;
  background: var(--ecobus-surface);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  color: var(--ecobus-text);
}

.ecobus-page-header__content {
  flex: 1;
}

.ecobus-bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  width: calc(100% - 24px);
  max-width: calc(var(--container-width) - 24px);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(217, 226, 236, 0.9);
  box-shadow: var(--shadow-md);
  border-radius: 22px;
  padding: 10px 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  backdrop-filter: blur(10px);
}

.ecobus-bottom-nav__item {
  min-height: 58px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--ecobus-text-soft);
  font-size: 11px;
  font-weight: 700;
}

.ecobus-bottom-nav__item--active {
  background: var(--ecobus-primary-soft);
  color: var(--ecobus-primary);
}

.ecobus-list {
  display: grid;
  gap: 12px;
}

.ecobus-list-card {
  padding: 16px;
  border-radius: 18px;
  background: var(--ecobus-surface);
  border: 1px solid rgba(217, 226, 236, 0.8);
  box-shadow: var(--shadow-sm);
}

.ecobus-list-card__top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.ecobus-list-card__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ecobus-text);
}

.ecobus-list-card__text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--ecobus-text-soft);
}

.ecobus-qr-card {
  padding: 20px;
  border-radius: 24px;
  background: var(--ecobus-surface);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(217, 226, 236, 0.9);
  text-align: center;
}

.ecobus-qr-image {
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  margin: 0 auto 16px;
  background: #fff;
  border-radius: 18px;
  padding: 12px;
  border: 1px solid var(--ecobus-border);
}

.ecobus-legal-box {
  white-space: pre-wrap;
  line-height: 1.7;
  font-size: 14px;
  color: var(--ecobus-text-soft);
}

@media (max-width: 360px) {
  .ecobus-quick-actions {
    grid-template-columns: 1fr;
  }

  .ecobus-hero-card__value {
    font-size: 36px;
  }

  .ecobus-bottom-nav {
    grid-template-columns: repeat(4, 1fr);
  }
}
