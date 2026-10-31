// client/src/views/E2EENotebookView.tsx
// True Client-Side End-to-End Encrypted (E2EE) Doubt & Notes Notebook
// Zero-knowledge encryption: Plaintext is NEVER transmitted or visible to the server or database.

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Search,
  BookOpen,
  Eye,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Tag
} from 'lucide-react';
import {
  EncryptedNoteRecord,
  DecryptedNote,
  deriveKeyFromPassphrase,
  generateRandomSalt,
  uint8ToBase64,
  base64ToUint8,
  encryptNotePayload,
  decryptNotePayload
} from '../services/cryptoE2EE';
import { api } from '../services/api';
import { EncryptionDisclosureModal } from '../components/EncryptionDisclosureModal';

export const E2EENotebookView: React.FC = () => {
  const [passphrase, setPassphrase] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [currentSaltBase64, setCurrentSaltBase64] = useState<string>('');

  const [notes, setNotes] = useState<DecryptedNote[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active note editor state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editExamId, setEditExamId] = useState('');
  const [editTopic, setEditTopic] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Unlock Vault
  const handleUnlockVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      alert('Please enter your master notebook passphrase.');
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch encrypted notes from backend
      const rawRecords: EncryptedNoteRecord[] = await api.getEncryptedNotes();

      // 2. Determine or generate salt
      let saltBytes: Uint8Array;
      let saltB64 = '';
      if (rawRecords && rawRecords.length > 0 && rawRecords[0].salt) {
        saltB64 = rawRecords[0].salt;
        saltBytes = base64ToUint8(saltB64);
      } else {
        const storedSalt = localStorage.getItem('examverse_notebook_salt');
        if (storedSalt) {
          saltB64 = storedSalt;
          saltBytes = base64ToUint8(saltB64);
        } else {
          saltBytes = generateRandomSalt();
          saltB64 = uint8ToBase64(saltBytes);
          localStorage.setItem('examverse_notebook_salt', saltB64);
        }
      }
      setCurrentSaltBase64(saltB64);

      // 3. Derive 256-bit AES-GCM Key in Browser
      const key = await deriveKeyFromPassphrase(passphrase, saltBytes);
      setCryptoKey(key);

      // 4. Decrypt Notes
      const decryptedList: DecryptedNote[] = [];
      for (const rec of rawRecords) {
        try {
          const dec = await decryptNotePayload(rec, key);
          decryptedList.push(dec);
        } catch {
          // If decryption fails, wrong passphrase was provided
          throw new Error('Invalid passphrase or corrupted encrypted note.');
        }
      }

      setNotes(decryptedList);
      setIsUnlocked(true);
      if (decryptedList.length > 0) {
        selectNote(decryptedList[0]);
      } else {
        handleNewNote();
      }
    } catch (err: any) {
      alert(`Unlock failed: ${err.message || 'Incorrect passphrase'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setCryptoKey(null);
    setPassphrase('');
    setNotes([]);
    setSelectedNoteId(null);
  };

  const selectNote = (note: DecryptedNote) => {
    setSelectedNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditExamId(note.examId || '');
    setEditTopic(note.topic || '');
  };

  const handleNewNote = () => {
    const newId = `note-${Date.now()}`;
    setSelectedNoteId(newId);
    setEditTitle('New Doubt & Concept Note');
    setEditContent('Write your private doubt, equation derivation, or revision notes here...\nAll content is encrypted locally via AES-256-GCM before transmission.');
    setEditExamId('GATE CS');
    setEditTopic('Core Syllabus');
  };

  const handleSaveNote = async () => {
    if (!cryptoKey || !currentSaltBase64) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      // 1. Client-Side Encryption
      const encryptedRecord = await encryptNotePayload(
        {
          title: editTitle,
          content: editContent,
          examId: editExamId,
          topic: editTopic
        },
        cryptoKey,
        currentSaltBase64,
        selectedNoteId || undefined
      );

      // 2. Transmit STRICTLY ciphertext to server
      await api.saveEncryptedNote(encryptedRecord);

      // 3. Update local state
      const updatedNote: DecryptedNote = {
        id: encryptedRecord.id,
        title: editTitle,
        content: editContent,
        examId: editExamId,
        topic: editTopic,
        createdAt: encryptedRecord.createdAt,
        updatedAt: encryptedRecord.updatedAt
      };

      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === updatedNote.id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx] = updatedNote;
          return copy;
        }
        return [updatedNote, ...prev];
      });

      setSelectedNoteId(updatedNote.id);
      setStatusMessage('Note encrypted client-side with AES-256-GCM and saved successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this encrypted note?')) return;
    try {
      await api.deleteEncryptedNote(id);
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (remaining.length > 0) {
        selectNote(remaining[0]);
      } else {
        handleNewNote();
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.topic && n.topic.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Client-Side Zero-Knowledge Cryptography Active
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              E2EE Doubt & Revision Notebook
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every formula, personal doubt, and study note is encrypted inside your browser via <strong>AES-256-GCM</strong> using keys derived with <strong>PBKDF2</strong> (100,000 iterations). Plaintext is never seen by the server.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDisclosureOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>How Encryption Works</span>
            </button>
            {isUnlocked && (
              <button
                onClick={handleLockVault}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-rose-950"
              >
                <Lock className="w-4 h-4" /> Lock Vault
              </button>
            )}
          </div>
        </div>

        {/* Lock Screen if Vault is Locked */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Unlock Encrypted Vault</h2>
              <p className="text-xs text-slate-500">
                Enter your notebook passphrase to derive your AES-256-GCM decryption key in-memory.
              </p>
            </div>

            <form onSubmit={handleUnlockVault} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Master Notebook Passphrase..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? 'Deriving Key & Decrypting...' : 'Unlock Notes Vault'}
              </button>
            </form>

            <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Knowledge: Server never receives your passphrase.</span>
            </div>
          </div>
        ) : (
          /* Unlocked Notebook Workspace */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
            {/* Left Sidebar: Notes List */}
            <div className="border-r border-slate-200 p-4 space-y-4 bg-slate-50/50 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Encrypted Notes ({notes.length})
                  </h3>
                  <button
                    onClick={handleNewNote}
                    className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition text-xs flex items-center gap-1"
                    title="New Note"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search decrypted notes..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Notes List */}
                <div className="space-y-2 max-h-[460px] overflow-y-auto">
                  {filteredNotes.map((n) => {
                    const isSelected = selectedNoteId === n.id;
                    return (
                      <div
                        key={n.id}
                        onClick={() => selectNote(n)}
                        className={`p-3 rounded-xl border cursor-pointer transition space-y-1 ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                            {n.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {n.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> E2EE Active
                </span>
                <span className="font-mono text-[10px]">AES-256-GCM</span>
              </div>
            </div>

            {/* Right Pane: Note Editor */}
            <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Status toast */}
                {statusMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Target Exam
                    </label>
                    <input
                      type="text"
                      value={editExamId}
                      onChange={(e) => setEditExamId(e.target.value)}
                      placeholder="e.g. GATE CS, UPSC CSE"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Subject / Topic Tag
                    </label>
                    <input
                      type="text"
                      value={editTopic}
                      onChange={(e) => setEditTopic(e.target.value)}
                      placeholder="e.g. Virtual Memory, KCL"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Note Title */}
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Note Title..."
                    className="w-full text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Note Content Textarea */}
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={14}
                    placeholder="Write your private doubt, equation derivation, or revision notes here..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Payload will be encrypted with WebCrypto prior to network sync.
                </span>

                <div className="flex items-center gap-3">
                  {selectedNoteId && (
                    <button
                      onClick={() => handleDeleteNote(selectedNoteId)}
                      className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
                  <button
                    onClick={handleSaveNote}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-100 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Encrypting...' : 'Save Encrypted Note'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Encryption Disclosure Modal */}
        <EncryptionDisclosureModal
          isOpen={isDisclosureOpen}
          onClose={() => setIsDisclosureOpen(false)}
        />
      </div>
    </div>
  );
};
