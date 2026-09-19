import { KeyRound, Save, UserRound } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../services/authService';
import { updateUserProfile } from '../../services/userService';

const emptyPasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

function UserProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [changingPassword, setChangingPassword] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updatePassword = (event) => setPasswordForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = await updateUserProfile(user.id, form);
      setUser(data.user);
      toast.success('Your profile has been updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const submitPasswordChange = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must contain at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password updated successfully.');
      setPasswordForm(emptyPasswordForm);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update your password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal focus:ring-3 focus:ring-teal/10';

  return (
    <main className="min-h-screen bg-cream py-10">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal">Account settings</p>
        <h1 className="mt-2 text-4xl font-black text-charcoal">My profile</h1>
        <p className="mt-3 text-slate-600">Keep your contact details current so shelters can reach you.</p>

        <form onSubmit={save} className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal/10 text-teal">
              <UserRound size={27} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-charcoal">{user.name}</p>
              <p className="text-sm text-slate-500">{user.role === 'admin' ? 'Shelter administrator' : 'Pet adopter'}</p>
            </div>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="form-label">
              Full name
              <input required className={inputClass} name="name" value={form.name} onChange={update} />
            </label>
            <label className="form-label">
              Email address
              <input required type="email" className={inputClass} name="email" value={form.email} onChange={update} />
            </label>
            <label className="form-label sm:col-span-2">
              Phone number
              <input className={inputClass} name="phone" value={form.phone} onChange={update} placeholder="Add a phone number" />
            </label>
            <label className="form-label sm:col-span-2">
              Address
              <textarea className={inputClass} rows="3" name="address" value={form.address} onChange={update} placeholder="Add your address" />
            </label>
          </div>
          <button disabled={saving} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 font-bold text-white hover:bg-[#348a7a] disabled:opacity-60">
            <Save size={17} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>

        <form onSubmit={submitPasswordChange} className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal/10 text-teal">
              <KeyRound size={27} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-charcoal">Change password</p>
              <p className="text-sm text-slate-500">Update the password used to log in to this account.</p>
            </div>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <label className="form-label sm:col-span-2">
              Current password
              <input required type="password" className={inputClass} name="currentPassword" value={passwordForm.currentPassword} onChange={updatePassword} placeholder="Enter your current password" />
            </label>
            <label className="form-label">
              New password
              <input required minLength="6" type="password" className={inputClass} name="newPassword" value={passwordForm.newPassword} onChange={updatePassword} placeholder="At least 6 characters" />
            </label>
            <label className="form-label">
              Confirm new password
              <input required minLength="6" type="password" className={inputClass} name="confirmPassword" value={passwordForm.confirmPassword} onChange={updatePassword} placeholder="Re-enter new password" />
            </label>
          </div>
          <button disabled={changingPassword} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 font-bold text-white hover:bg-[#348a7a] disabled:opacity-60">
            <KeyRound size={17} /> {changingPassword ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default UserProfilePage;
