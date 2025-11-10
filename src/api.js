const API_BASE = "https://localhost:44341/api/";

//
// 🧠 Unified fetch wrapper (handles auth + guest mode)
//
async function request(path, method = "GET", body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };

  // 🔐 Attach token if available
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials: "include", // ✅ ensures guest_id cookie is sent
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }

  try {
    return await res.json();
  } catch {
    return {}; // handle empty JSON
  }
}

//
// ==================== AUTH ====================
//

// 🔐 Register new user
export async function registerUser({ first, last, email }) {
  return await request("User/register", "POST", {
    name: { first, last },
    email,
  });
}

// 🔑 Login user
export async function loginUser({ username, password }) {
  return await request("auth/login", "POST", { username, password });
}

// 🔁 Change password
export async function changePassword({ email, newPassword }) {
  return await request(
    "User/change-password?isNewPassword=true",
    "POST",
    { email, newPassword },
    true
  );
}

// 📧 Reset password
export async function resetPassword(email) {
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(`${API_BASE}User/reset-password`, {
    method: "POST",
    headers,
    body: JSON.stringify(email),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json().catch(() => ({}));
}

// 🧩 Verify reset token
export async function verifyResetToken({ email, token }) {
  return await request("User/verify-reset-token", "POST", { email, token });
}

// ✅ Complete password reset
export async function completePasswordReset({ email, newPassword }) {
  return await request(
    "User/change-password?isNewPassword=true",
    "POST",
    { email, newPassword }
  );
}

// 👤 Get current logged-in user
export async function getCurrentUser() {
  return await request("User/getLoggedInUser", "GET", null, true);
}

//
// ==================== USERS ====================
//

// 👥 Get all users
export async function getAllUsers() {
  return await request("user/users", "GET", null, true);
}

// 🗑️ Delete user
export async function deleteUser(id) {
  return await request(`user/${id}`, "DELETE", null, true);
}
export async function updateUser(data) {
  return await request("User/update", "PUT", data, true);
}


//
// ==================== NOTES (Authenticated) ====================
//

// 🧠 Get all notes (auto-handles user vs guest)
export async function getNotes(userId) {
  const isAuth = !!userId; // logged-in users have an id
  const path = isAuth ? `Notes/${userId}` : "Notes";
  return await request(path, "GET", null, isAuth);
}

// ➕ Add new note
export async function addNote(note) {
  return await request("Notes", "POST", note, true);
}

// 🗑️ Delete note
export async function deleteNote(id) {
  return await request(`Notes/${id}`, "DELETE", null, true);
}

// ✏️ Update full note
export async function updateNote(
  id,
  { title, description, priority, reminder, pinned, date, imageBase64, imageType }
) {
  const body = {
    title,
    description,
    priority,
    reminder,
    pinned,
    date,
    imageBase64,
    imageType,
  };
  return await request(`Notes/${id}`, "PUT", body, true);
}

// 🗓️ Update date only
export async function updateNoteDate(id, date) {
  return await request(`Notes/${id}/date`, "PUT", { date }, true);
}

// 📌 Update pin
export async function updateNotePin(id, pinned) {
  return await request(`Notes/${id}/pin`, "PUT", { pinned }, true);
}

// ⚠️ Update priority
export async function updateNotePriority(id, priority) {
  return await request(`Notes/${id}/priority`, "PUT", { priority }, true);
}

// 🔔 Update reminder
export async function updateNoteReminder(id, reminder) {
  return await request(`Notes/${id}/reminder`, "PUT", { reminder }, true);
}

// 🖼️ Upload image
export async function uploadImage(file, noteId) {
  const formData = new FormData();
  formData.append("file", file);
  if (noteId) formData.append("noteId", noteId);

  const res = await fetch(`${API_BASE}Notes/upload`, {
    method: "POST",
    body: formData,
    credentials: "include", // send guest cookie too
  });

  if (!res.ok) throw new Error("Upload failed");
  return await res.json(); // { imageBase64, imageType }
}

//
// ==================== GUEST NOTES ====================
//

// 🧾 Get guest notes (no login required)
export async function getGuestNotes() {
  return await request("Notes", "GET"); // auth=false → cookie guest_id
}

// ➕ Add guest note
export async function addGuestNote(note) {
  return await request("Notes", "POST", note); // no token
}

// 🗑️ Delete guest note
export async function deleteGuestNote(id) {
  return await request(`Notes/${id}`, "DELETE");
}

// ✏️ Update guest note
export async function updateGuestNote(
  id,
  { title, description, priority, reminder, pinned, date, imageBase64, imageType }
) {
  const body = {
    title,
    description,
    priority,
    reminder,
    pinned,
    date,
    imageBase64,
    imageType,
  };
  return await request(`Notes/${id}`, "PUT", body);
}

//
// ==================== NOTE MIGRATION ====================
//

// 🔄 Migrate guest notes to logged-in user
export async function migrateGuestNotes(userId) {
  return await request(`Notes/migrate/${userId}`, "PUT");
}

//
// ==================== HELPERS ====================
//

// 👀 Check if user is authenticated
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

//
// ==================== CONTACT ====================
//

// ✉️ Send contact form message
export async function sendContactMessage({ name, email, subject, message }) {
  return await request("email/contact-email", "POST", { name, email, subject, message });
}
