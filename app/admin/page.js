'use client'; // This is required for Next.js App Router components that use state

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, query, onSnapshot, 
  doc, updateDoc, deleteDoc, serverTimestamp, orderBy 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken 
} from 'firebase/auth';
import { 
  LayoutDashboard, Bell, Vote, Image as ImageIcon, 
  AlertTriangle, MessageSquare, CheckCircle, XCircle, 
  Trash2, Plus, MapPin, Search, Menu, X
} from 'lucide-react';

// --- Firebase Initialization ---
// NOTE: For local development, replace __firebase_config with your actual config object
// or process.env variables if you haven't set up the global variable.
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      // Paste your Firebase Config object here if running locally
      apiKey: "AIzaSyASIMDC4BTP_Jpgn8OrI11G7mWh15t85pY",
      authDomain: "amc-campus-connect.firebaseapp.com",
      projectId: "amc-campus-connect",
      storageBucket: "amc-campus-connect.firebasestorage.app",
      messagingSenderId: "1064061156328",
      appId: "1:1064061156328:web:f6e6f87a9e5e9249bf825d"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Components ---

// 1. Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'polls', label: 'Polls & Voting', icon: Vote },
    { id: 'issues', label: 'Issue Tracker', icon: AlertTriangle },
    { id: 'posters', label: 'Digital Posters', icon: ImageIcon },
    { id: 'discuss', label: 'Discussions', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Campus Admin
          </h1>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 2. Dashboard Overview Component
const DashboardHome = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Active Issues', value: stats.issues, color: 'bg-red-500', icon: AlertTriangle },
        { label: 'Live Polls', value: stats.polls, color: 'bg-purple-500', icon: Vote },
        { label: 'Notifications', value: stats.notifs, color: 'bg-blue-500', icon: Bell },
        { label: 'Posters', value: stats.posters, color: 'bg-orange-500', icon: ImageIcon },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
          <div className={`${stat.color} p-3 rounded-lg text-white shadow-md opacity-90`}>
            <stat.icon size={24} />
          </div>
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-blue-400 transition-all text-left group">
            <Bell className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-slate-700">New Alert</span>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-purple-400 transition-all text-left group">
            <Vote className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-slate-700">Create Poll</span>
          </button>
        </div>
      </div>
      <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
        <h3 className="font-bold text-lg mb-2">System Status</h3>
        <p className="opacity-90 mb-4">All campus services are running smoothly. Database is connected and syncing in real-time.</p>
        <div className="flex items-center space-x-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Sync Active</span>
        </div>
      </div>
    </div>
  </div>
);

// 3. Notifications Manager
const NotificationManager = ({ db, userId }) => {
  const [notifs, setNotifs] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: 'General', type: 'info' });

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'notifications')); // Using public for broadcast
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, [db, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'notifications'), {
      ...formData,
      timestamp: Date.now(),
      read: false
    });
    setFormData({ title: '', category: 'General', type: 'info' });
  };

  const deleteNotif = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'notifications', id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Broadcast Notification</h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Notification Message..." 
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <select 
            className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option>General</option>
            <option>Urgent</option>
            <option>Event</option>
            <option>Academic</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Send Broadcast
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Recent Alerts</h3>
          <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">{notifs.length} items</span>
        </div>
        <div className="divide-y divide-slate-100">
          {notifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No notifications yet.</div>
          ) : (
            notifs.map(n => (
              <div key={n.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${n.category === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="font-medium text-slate-800">{n.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{n.category}</span>
                      <span className="text-xs text-slate-400">{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteNotif(n.id)} className="text-slate-400 hover:text-red-500 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Polls Manager
const PollsManager = ({ db, userId }) => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', optionsStr: '' });

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'polls'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPolls(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, [db, userId]);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const options = newPoll.optionsStr.split(',').map((opt, idx) => ({
      id: `opt_${idx}`,
      text: opt.trim(),
      votes: 0
    })).filter(o => o.text);

    if (!newPoll.question || options.length < 2) return;

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'polls'), {
      question: newPoll.question,
      options,
      status: 'active',
      timestamp: Date.now()
    });
    setNewPoll({ question: '', optionsStr: '' });
  };

  const deletePoll = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'polls', id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Poll</h3>
        <form onSubmit={handleCreatePoll} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g., Which artist for the fest?"
              value={newPoll.question}
              onChange={e => setNewPoll({...newPoll, question: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Options (comma separated)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Option 1, Option 2, Option 3"
              value={newPoll.optionsStr}
              onChange={e => setNewPoll({...newPoll, optionsStr: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
            Launch Poll
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {polls.map(poll => {
          const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
          return (
            <div key={poll.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800 pr-4">{poll.question}</h4>
                <button onClick={() => deletePoll(poll.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-3">
                {poll.options.map(opt => {
                  const percent = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                  return (
                    <div key={opt.id} className="relative pt-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-600">{opt.text}</span>
                        <span className="text-slate-500">{opt.votes} votes ({percent}%)</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-100">
                        <div style={{ width: `${percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>Total Votes: {totalVotes}</span>
                <span className={`px-2 py-1 rounded-full ${poll.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {poll.status.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Issue Tracker
const IssueTracker = ({ db, userId }) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'issues'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIssues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, [db, userId]);

  const toggleStatus = async (issue) => {
    const newStatus = issue.status === 'resolved' ? 'open' : 'resolved';
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'issues', issue.id), {
      status: newStatus
    });
  };

  // Helper to add a fake issue for demo purposes since we can't run the other html file here
  const addDemoIssue = async () => {
    const categories = ['Plumbing', 'Electrical', 'Furniture', 'Structural'];
    const locs = ['Room 101', 'Library 2nd Floor', 'Canteen', 'Lab 3'];
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'issues'), {
      category: categories[Math.floor(Math.random() * categories.length)],
      description: 'Reported via Admin Demo (Simulated User Report)',
      location: { name: locs[Math.floor(Math.random() * locs.length)] },
      status: 'open',
      timestamp: Date.now()
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Reported Issues</h3>
        <button onClick={addDemoIssue} className="text-sm text-blue-600 hover:underline">
          + Simulate Incoming Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${issue.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {issue.status ? issue.status.toUpperCase() : 'OPEN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{issue.category}</td>
                  <td className="px-6 py-4 flex items-center gap-1">
                    <MapPin size={14} />
                    {issue.location?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{issue.description}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(issue.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(issue)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg border transition ${
                        issue.status === 'resolved' 
                        ? 'border-slate-300 text-slate-500 hover:bg-slate-100' 
                        : 'border-green-300 text-green-600 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {issue.status === 'resolved' ? (
                        <><XCircle size={14} /><span>Reopen</span></>
                      ) : (
                        <><CheckCircle size={14} /><span>Resolve</span></>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">No issues reported yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. Posters Manager
const PostersManager = ({ db, userId }) => {
  const [posters, setPosters] = useState([]);
  const [newPoster, setNewPoster] = useState({ title: '', url: '' });

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'posters'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, [db, userId]);

  const handleAddPoster = async (e) => {
    e.preventDefault();
    if (!newPoster.url) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'posters'), {
      ...newPoster,
      timestamp: Date.now()
    });
    setNewPoster({ title: '', url: '' });
  };

  const deletePoster = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'posters', id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Digital Poster</h3>
        <form onSubmit={handleAddPoster} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Event Title" 
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            value={newPoster.title}
            onChange={e => setNewPoster({...newPoster, title: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Image URL (e.g., https://...)" 
            className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            value={newPoster.url}
            onChange={e => setNewPoster({...newPoster, url: e.target.value})}
          />
          <button type="submit" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition">
            Upload
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posters.map(poster => (
          <div key={poster.id} className="group relative bg-slate-900 rounded-xl overflow-hidden aspect-[3/4] shadow-lg">
            <img 
              src={poster.url} 
              alt={poster.title} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
              onError={(e) => e.target.src = 'https://placehold.co/400x600/1e293b/ffffff?text=Image+Error'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
              <h4 className="text-white font-bold text-lg">{poster.title}</h4>
              <p className="text-slate-400 text-xs mt-1">Added {new Date(poster.timestamp).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={() => deletePoster(poster.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Discussion Viewer (Read-only for Admin)
const DiscussionViewer = ({ db, userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'discussions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [db, userId]);

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Live Campus Discussion Feed</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live Monitor</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-10">No discussion messages yet.</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {msg.sender?.name?.charAt(0) || '?'}
              </div>
              <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-slate-700">{msg.sender?.name || 'Anonymous'}</span>
                  <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-slate-800">{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


// --- Main App Component ---
export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [stats, setStats] = useState({ issues: 0, polls: 0, notifs: 0, posters: 0 });

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Fetch stats for dashboard
  useEffect(() => {
    if (!user) return;
    
    // Setup listeners for counts
    const unsub1 = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'issues'), snap => 
      setStats(prev => ({ ...prev, issues: snap.docs.filter(d => d.data().status !== 'resolved').length })));
    const unsub2 = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'polls'), snap => 
      setStats(prev => ({ ...prev, polls: snap.docs.filter(d => d.data().status === 'active').length })));
    const unsub3 = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'notifications'), snap => 
      setStats(prev => ({ ...prev, notifs: snap.size })));
    const unsub4 = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'posters'), snap => 
      setStats(prev => ({ ...prev, posters: snap.size })));

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, [user]);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading Admin Console...</div>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between">
          <h1 className="font-bold text-slate-800">Admin Console</h1>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardHome stats={stats} />}
            {activeTab === 'notifications' && <NotificationManager db={db} userId={user.uid} />}
            {activeTab === 'polls' && <PollsManager db={db} userId={user.uid} />}
            {activeTab === 'issues' && <IssueTracker db={db} userId={user.uid} />}
            {activeTab === 'posters' && <PostersManager db={db} userId={user.uid} />}
            {activeTab === 'discuss' && <DiscussionViewer db={db} userId={user.uid} />}
          </div>
        </main>
      </div>
    </div>
  );
}