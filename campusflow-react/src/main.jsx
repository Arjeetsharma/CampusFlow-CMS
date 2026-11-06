import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import legacyMarkup from "./legacy.html?raw";
import initCampusFlow from "./legacy.js";
import "./style.css";
import "./auth.css";

const USERS_KEY = "campusflow_users";
const SESSION_KEY = "campusflow_session";
const ADMIN = { name: "CampusFlow Admin", email: "admin@campusflow.com", password: "admin123", role: "admin" };

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault(); setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (mode === "signup") {
      if (password.length < 6) return setError("Password must contain at least 6 characters.");
      if (cleanEmail === ADMIN.email || readUsers().some(u => u.email === cleanEmail)) return setError("An account with this email already exists.");
      const user = { name: name.trim(), email: cleanEmail, password, role: "user" };
      localStorage.setItem(USERS_KEY, JSON.stringify([...readUsers(), user]));
      onLogin(user);
    } else {
      const user = cleanEmail === ADMIN.email && password === ADMIN.password
        ? ADMIN : readUsers().find(u => u.email === cleanEmail && u.password === password);
      if (!user) return setError("Invalid email or password.");
      onLogin(user);
    }
  }

  return <main className="auth-screen">
    <section className="auth-card">
      <div className="auth-brand"><span>▦</span><div><b>CampusFlow</b><small>CONTENT MANAGEMENT SYSTEM</small></div></div>
      <p className="auth-eyebrow">CAMPUS CONTENT, SIMPLIFIED</p>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="auth-subtitle">{mode === "login" ? "Sign in to continue to your workspace." : "Join CampusFlow to view campus updates."}</p>
      <form onSubmit={submit}>
        {mode === "signup" && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required /></label>}
        <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" minLength="6" required /></label>
        {error && <p className="auth-error">{error}</p>}
        <button className="auth-submit">{mode === "login" ? "Sign in" : "Create account"} <span>→</span></button>
      </form>
      <p className="auth-switch">{mode === "login" ? "New to CampusFlow?" : "Already have an account?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");}}>{mode==="login"?"Create an account":"Sign in"}</button></p>
      <div className="auth-demo"><b>Review demo admin</b><span>admin@campusflow.com</span><span>Password: admin123</span></div>
    </section>
    <aside className="auth-side"><div className="auth-side-content"><span className="auth-pill">CAMPUSFLOW CMS</span><h2>Everything happening on campus, in one place.</h2><p>Manage announcements, events, academic updates and campus content with a simple workspace.</p><div className="auth-side-stats"><div><b>01</b><span>Manage content</span></div><div><b>02</b><span>Share updates</span></div><div><b>03</b><span>Stay connected</span></div></div></div></aside>
  </main>;
}

function UserPortal({ user, onLogout }) {
  const [items] = useState(() => {
    try { return JSON.parse(localStorage.getItem("campusflow_content") || "[]").filter(x=>x.status==="Published"); }
    catch { return []; }
  });
  return <div className="user-portal">
    <header><div className="auth-brand"><span>▦</span><div><b>CampusFlow</b><small>STUDENT PORTAL</small></div></div><div className="portal-profile"><span>{user.name}</span><button onClick={onLogout}>Log out</button></div></header>
    <main><p className="auth-eyebrow">YOUR CAMPUS, YOUR UPDATES</p><h1>Hello, {user.name.split(" ")[0]} 👋</h1><p className="auth-subtitle">Here are the latest published campus announcements.</p>
      <div className="portal-summary"><div><b>{items.length}</b><span>Published updates</span></div><div><b>Campus</b><span>News & announcements</span></div></div>
      <h2>Latest announcements</h2><div className="portal-grid">{items.length ? items.map(item=><article key={item.id}><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><small>By {item.author} · {item.updated}</small></article>) : <article><h3>Welcome to CampusFlow</h3><p>There are no published announcements yet. Please check again later.</p></article>}</div>
    </main>
  </div>;
}

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  });
  const isAdmin = user?.role === "admin";
  const markup = useMemo(() => {
    const match = legacyMarkup.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return match ? match[1].replace(/<script[\s\S]*?<\/script>/gi, "") : legacyMarkup;
  }, []);
  useEffect(() => {
    if (isAdmin) {
      const timer = setTimeout(() => initCampusFlow(), 0);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);
  function login(nextUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }
  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }
  if (!user) return <Auth onLogin={login} />;
  if (!isAdmin) return <UserPortal user={user} onLogout={logout} />;
  return <><div dangerouslySetInnerHTML={{ __html: markup }} /><button className="react-logout" onClick={logout}>Log out</button></>;
}

createRoot(document.getElementById("root")).render(<App />);
