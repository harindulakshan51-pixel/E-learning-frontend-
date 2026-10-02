import "./AuthFormPanel.css";

export default function AuthFormPanel({ children }) {
  return (
    <div className="auth-form-panel">
      <div className="auth-form-panel__art" aria-hidden="true">
        <span className="auth-form-panel__orbit auth-form-panel__orbit--top" />
        <span className="auth-form-panel__orbit auth-form-panel__orbit--bottom" />
        <span className="auth-form-panel__orb" />
        <span className="auth-form-panel__spark auth-form-panel__spark--top" />
        <span className="auth-form-panel__spark auth-form-panel__spark--bottom" />
      </div>
      <div className="auth-form-panel__card">{children}</div>
    </div>
  );
}
