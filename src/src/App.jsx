import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, UserPlus, Trash2, XCircle, 
  Activity, Coffee, Upload, FileText, 
  Trophy, CheckCircle2, ChevronUp, ChevronDown,
  Clock, ArrowDown, User, Send, Swords, Repeat, Play, StopCircle, ArrowUpCircle,
  Crown, Save, AlertTriangle, PlusCircle, Check, RefreshCw,
  Lock, Unlock, Key, Star
} from 'lucide-react';

// --- Sub-Component: GameTimer ---
const GameTimer = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsed(0);
      return;
    }
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <span className="font-mono text-yellow-300 bg-black/60 px-2 py-1 rounded text-sm flex items-center gap-2 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)] animate-in fade-in">
       <Clock size={14} className="animate-pulse"/> {formatTime(elapsed)}
    </span>
  );
};

// --- Sub-Component: Custom Alert Modal ---
const CustomAlert = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-gray-800 border-2 border-red-500 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <div className="mx-auto bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">注意</h3>
        <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">{message}</p>
        <button 
          onClick={onClose}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
        >
          我知道了
        </button>
      </div>
    </div>
  );
};

// --- Sub-Component: Login Modal ---
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [input, setInput] = useState("");
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(input);
    setInput("");
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl max-w-xs w-full p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">管理員登入</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="請輸入管理員密碼"
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white mb-4 text-center focus:border-green-500 outline-none"
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-700 text-gray-300 py-2 rounded hover:bg-gray-600">取消</button>
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-500 font-bold">登入</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Sub-Component: Change Password Modal ---
const ChangePasswordModal = ({ isOpen, onClose, onChangePassword }) => {
  const [newPassword, setNewPassword] = useState("");
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      alert("密碼長度請至少 4 碼");
      return;
    }
    onChangePassword(newPassword);
    setNewPassword("");
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-gray-800 border border-yellow-600 rounded-2xl shadow-2xl max-w-xs w-full p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
          <Key size={20} className="text-yellow-500"/> 修改密碼
        </h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            autoFocus
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="輸入新密碼"
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white mb-4 text-center focus:border-yellow-500 outline-none"
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-700 text-gray-300 py-2 rounded hover:bg-gray-600">取消</button>
            <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-500 font-bold">儲存</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const App = () => {
  // --- Auth State ---
  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      return localStorage.getItem('badminton_admin_password') || '8888';
    } catch { return '8888'; }
  });
  const [isAdmin, setIsAdmin] = useState(false); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangePwModal, setShowChangePwModal] = useState(false);

  // --- State Management ---
  
  // 1. 總等待區
  const [waitingList, setWaitingList] = useState(() => {
    try {
      const saved = localStorage.getItem('badminton_waiting_list');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // 2. 場地狀態
  const [courts, setCourts] = useState(() => {
    try {
      const saved = localStorage.getItem('badminton_courts');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: '場地 A', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
        { id: 2, name: '場地 B', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
        { id: 3, name: '場地 C', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
        { id: 4, name: '場地 D', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
      ];
    } catch { return []; }
  });

  // 輸入與匯入
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerGender, setNewPlayerGender] = useState('M'); 
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  
  // 月繳人員功能
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [monthlyMembers, setMonthlyMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('badminton_monthly_members');
      return saved ? JSON.parse(saved) : [
        { id: 'm1', name: '會長', gender: 'M' },
        { id: 'm2', name: '總幹事', gender: 'F' },
        { id: 'm3', name: '教練', gender: 'M' },
      ];
    } catch { return []; }
  });
  const [newMonthlyName, setNewMonthlyName] = useState('');

  // 常用名單功能
  const [showRegularModal, setShowRegularModal] = useState(false);
  const [regularMembers, setRegularMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('badminton_regular_members');
      return saved ? JSON.parse(saved) : [
        { id: 'r1', name: '小陳', gender: 'M' },
        { id: 'r2', name: '小林', gender: 'M' },
      ];
    } catch { return []; }
  });
  const [newRegularName, setNewRegularName] = useState('');

  // 選取模式
  const [selectedPlayerIds, setSelectedPlayerIds] = useState(new Set());
  
  // 底部操作列狀態
  const [targetCourtId, setTargetCourtId] = useState('1'); 

  // 警示視窗
  const [alertState, setAlertState] = useState({ isOpen: false, message: '' });

  // 交換球員 Modal
  const [swapModal, setSwapModal] = useState({
    isOpen: false,
    courtId: null,
    slot: null,
    sourcePlayer: null,
    targetTeamName: null, 
    candidates: [] 
  });

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('badminton_waiting_list', JSON.stringify(waitingList));
  }, [waitingList]);

  useEffect(() => {
    localStorage.setItem('badminton_courts', JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem('badminton_monthly_members', JSON.stringify(monthlyMembers));
  }, [monthlyMembers]);

  useEffect(() => {
    localStorage.setItem('badminton_regular_members', JSON.stringify(regularMembers));
  }, [regularMembers]);

  useEffect(() => {
    localStorage.setItem('badminton_admin_password', adminPassword);
  }, [adminPassword]);

  // --- Helpers ---
  const showAlert = (msg) => {
    setAlertState({ isOpen: true, message: msg });
  };

  const handleLogin = (password) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert("密碼錯誤");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setSelectedPlayerIds(new Set()); 
  };

  const handleChangePassword = (newPass) => {
    setAdminPassword(newPass);
    setShowChangePwModal(false);
    showAlert(`密碼修改成功！\n新密碼為：${newPass}\n請務必牢記。`);
  };

  const resetAllData = () => {
    if (window.confirm("確定要重置所有資料嗎？\n這將會清空場地狀態和等待區名單 (月繳/常用名單會保留)。")) {
      setWaitingList([]);
      setCourts([
        { id: 1, name: '場地 A', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
        { id: 2, name: '場地 B', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
        { id: 3, name: '場地 C', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
        { id: 4, name: '場地 D', current: { teamA: [], teamB: [] }, next: { teamA: [], teamB: [] }, status: 'idle', startTime: null },
      ]);
      setSelectedPlayerIds(new Set());
    }
  };

  // --- Actions ---

  const addPlayer = (e) => {
    if (e) e.preventDefault();
    if (!newPlayerName.trim()) return;
    
    const newPlayer = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      gender: newPlayerGender,
    };
    
    setWaitingList([...waitingList, newPlayer]);
    setNewPlayerName('');
  };

  const removePlayerFromQueue = (id, e) => {
    e.stopPropagation(); 
    if (!isAdmin) return;
    setWaitingList(waitingList.filter(p => p.id !== id));
    if (selectedPlayerIds.has(id)) {
      const newSet = new Set(selectedPlayerIds);
      newSet.delete(id);
      setSelectedPlayerIds(newSet);
    }
  };

  // --- Monthly Members Logic ---
  const addMonthlyMember = () => {
    if (!newMonthlyName.trim()) return;
    const newMember = {
      id: `m-${Date.now()}`,
      name: newMonthlyName.trim(),
      gender: 'M'
    };
    setMonthlyMembers([...monthlyMembers, newMember]);
    setNewMonthlyName('');
  };

  const removeMonthlyMember = (id) => {
    setMonthlyMembers(monthlyMembers.filter(m => m.id !== id));
  };

  const checkInMonthlyMember = (member) => {
    const exists = waitingList.some(p => p.name === member.name);
    if (exists) return;
    const newPlayer = {
      ...member,
      id: `checkin-${Date.now()}-${member.id}`
    };
    setWaitingList(prev => [...prev, newPlayer]);
  };

  const checkInAllMonthly = () => {
    const newPlayers = monthlyMembers
      .filter(m => !waitingList.some(w => w.name === m.name))
      .map(m => ({
        ...m,
        id: `checkin-all-${Date.now()}-${m.id}`
      }));
    
    if (newPlayers.length === 0) {
      showAlert("所有月繳人員都已經在等待區了！");
      return;
    }
    
    setWaitingList([...waitingList, ...newPlayers]);
    showAlert(`成功匯入 ${newPlayers.length} 位月繳人員！`);
    setShowMonthlyModal(false);
  };

  // --- Regular Members Logic ---
  const addRegularMember = () => {
    if (!newRegularName.trim()) return;
    const newMember = {
      id: `r-${Date.now()}`,
      name: newRegularName.trim(),
      gender: 'M'
    };
    setRegularMembers([...regularMembers, newMember]);
    setNewRegularName('');
  };

  const removeRegularMember = (id) => {
    setRegularMembers(regularMembers.filter(m => m.id !== id));
  };

  const checkInRegularMember = (member) => {
    const exists = waitingList.some(p => p.name === member.name);
    if (exists) return;
    const newPlayer = {
      ...member,
      id: `checkin-reg-${Date.now()}-${member.id}`
    };
    setWaitingList(prev => [...prev, newPlayer]);
  };

  const checkInAllRegular = () => {
    const newPlayers = regularMembers
      .filter(m => !waitingList.some(w => w.name === m.name))
      .map(m => ({
        ...m,
        id: `checkin-all-reg-${Date.now()}-${m.id}`
      }));
    
    if (newPlayers.length === 0) {
      showAlert("所有常用人員都已經在等待區了！");
      return;
    }
    
    setWaitingList([...waitingList, ...newPlayers]);
    showAlert(`成功匯入 ${newPlayers.length} 位常用人員！`);
    setShowRegularModal(false);
  };

  // --- Selection Logic ---

  const togglePlayerSelection = (id) => {
    if (!isAdmin) return; 

    const newSet = new Set(selectedPlayerIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size >= 4) {
        showAlert("選取人數已達上限 (4人)！\n\n一個場地最多只能有 4 位球員，請先取消部分選取。");
        return;
      }
      newSet.add(id);
    }
    setSelectedPlayerIds(newSet);
  };

  const clearSelection = () => {
    setSelectedPlayerIds(new Set());
  };

  // --- Assign Logic ---

  const handleAssignPlayers = () => {
    if (selectedPlayerIds.size === 0) return;

    const courtId = parseInt(targetCourtId);
    const selectedPlayers = waitingList.filter(p => selectedPlayerIds.has(p.id));
    
    const court = courts.find(c => c.id === courtId);
    const currentNextCount = court.next.teamA.length + court.next.teamB.length;
    
    if (currentNextCount + selectedPlayers.length > 4) {
      const availableSlots = 4 - currentNextCount;
      showAlert(`無法加入！\n\n該場地等待區已有 ${currentNextCount} 人，只能再加入 ${availableSlots} 人。\n您選了 ${selectedPlayers.length} 人，超過限制。`);
      return;
    }

    setCourts(courts.map(c => {
      if (c.id === courtId) {
        let newTeamA = [...c.next.teamA];
        let newTeamB = [...c.next.teamB];
        let remainingPlayers = [...selectedPlayers];

        while (newTeamA.length < 2 && remainingPlayers.length > 0) {
          newTeamA.push(remainingPlayers.shift());
        }

        while (newTeamB.length < 2 && remainingPlayers.length > 0) {
          newTeamB.push(remainingPlayers.shift());
        }
        
        return {
          ...c,
          next: {
            teamA: newTeamA,
            teamB: newTeamB
          }
        };
      }
      return c;
    }));

    setWaitingList(prev => prev.filter(p => !selectedPlayerIds.has(p.id)));
    clearSelection();
  };

  // --- Team Switching Logic ---

  const initSwitchTeam = (courtId, slot, currentTeam, playerId) => {
    if (!isAdmin) return;

    const court = courts.find(c => c.id === courtId);
    const targetTeamName = currentTeam === 'teamA' ? 'teamB' : 'teamA';
    const targetTeamPlayers = court[slot][targetTeamName];
    const sourcePlayer = court[slot][currentTeam].find(p => p.id === playerId);

    if (targetTeamPlayers.length < 2) {
       performDirectSwitch(courtId, slot, currentTeam, targetTeamName, playerId);
    } else {
       setSwapModal({
         isOpen: true,
         courtId,
         slot,
         sourcePlayer,
         targetTeamName,
         candidates: targetTeamPlayers
       });
    }
  };

  const performDirectSwitch = (courtId, slot, currentTeam, targetTeamName, playerId) => {
    setCourts(courts.map(c => {
      if (c.id === courtId) {
        const playerToMove = c[slot][currentTeam].find(p => p.id === playerId);
        return {
          ...c,
          [slot]: {
            ...c[slot],
            [currentTeam]: c[slot][currentTeam].filter(p => p.id !== playerId),
            [targetTeamName]: [...c[slot][targetTeamName], playerToMove]
          }
        };
      }
      return c;
    }));
  };

  const performSwap = (targetPlayerId) => {
    const { courtId, slot, sourcePlayer, targetTeamName } = swapModal;
    const currentTeamName = targetTeamName === 'teamA' ? 'teamB' : 'teamA';

    setCourts(courts.map(c => {
      if (c.id === courtId) {
        const targetPlayer = c[slot][targetTeamName].find(p => p.id === targetPlayerId);
        
        const newSourceTeam = c[slot][currentTeamName]
          .map(p => p.id === sourcePlayer.id ? targetPlayer : p);
        
        const newTargetTeam = c[slot][targetTeamName]
           .map(p => p.id === targetPlayerId ? sourcePlayer : p);

        return {
          ...c,
          [slot]: {
            ...c[slot],
            [currentTeamName]: newSourceTeam,
            [targetTeamName]: newTargetTeam
          }
        };
      }
      return c;
    }));
    
    setSwapModal({ ...swapModal, isOpen: false });
  };

  // --- Game Management Logic ---

  const startGame = (courtId) => {
    if (!isAdmin) return;
    setCourts(courts.map(c => {
      if (c.id === courtId) {
        return {
          ...c,
          status: 'playing',
          startTime: Date.now()
        };
      }
      return c;
    }));
  };

  const finishGame = (courtId) => {
    if (!isAdmin) return;
    const court = courts.find(c => c.id === courtId);
    const oldPlayers = [...court.current.teamA, ...court.current.teamB];
    
    setCourts(courts.map(c => {
      if (c.id === courtId) {
        const hasNextPlayers = c.next.teamA.length > 0 || c.next.teamB.length > 0;
        return {
          ...c,
          current: c.next, 
          next: { teamA: [], teamB: [] },
          status: hasNextPlayers ? 'ready' : 'idle',
          startTime: null
        };
      }
      return c;
    }));

    setWaitingList([...waitingList, ...oldPlayers]);
  };

  const kickPlayer = (courtId, slot, team, playerId) => {
    if (!isAdmin) return;
    let kickedPlayer = null;
    setCourts(courts.map(c => {
      if (c.id === courtId) {
        const teamPlayers = c[slot][team];
        kickedPlayer = teamPlayers.find(p => p.id === playerId);
        
        const newTeamPlayers = teamPlayers.filter(p => p.id !== playerId);
        const otherTeamCount = team === 'teamA' ? c[slot].teamB.length : c[slot].teamA.length;
        
        let newStatus = c.status;
        let newStartTime = c.startTime;
        
        if (slot === 'current' && newTeamPlayers.length === 0 && otherTeamCount === 0) {
             newStatus = 'idle';
             newStartTime = null;
        }

        return {
          ...c,
          [slot]: {
            ...c[slot],
            [team]: newTeamPlayers
          },
          status: newStatus,
          startTime: newStartTime
        };
      }
      return c;
    }));

    if (kickedPlayer) {
      setWaitingList([...waitingList, kickedPlayer]);
    }
  };

  const movePlayerInList = (index, direction, e) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (direction === 'up' && index > 0) {
      const newList = [...waitingList];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      setWaitingList(newList);
    } else if (direction === 'down' && index < waitingList.length - 1) {
      const newList = [...waitingList];
      [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
      setWaitingList(newList);
    }
  };

  const handleBulkImport = () => {
    if (!importText.trim()) return;
    const names = importText.split(/[\n,、]+/).map(n => n.trim()).filter(n => n);
    const newPlayers = names.map((name, index) => ({
      id: `import-${Date.now()}-${index}`,
      name: name,
      gender: 'M', 
    }));
    setWaitingList([...waitingList, ...newPlayers]);
    setImportText('');
    setShowImportModal(false);
  };

  // --- Components ---

  const PlayerBadge = ({ player, onDelete, onSwitch }) => (
    <div className={`text-xs px-2 py-2 rounded flex items-center justify-between gap-1 mb-1 border shadow-sm ${
      player.gender === 'F' 
        ? 'bg-pink-900/30 text-pink-100 border-pink-700/50' 
        : 'bg-blue-900/30 text-blue-100 border-blue-700/50'
    }`}>
      <div className="flex items-center gap-1 overflow-hidden">
        <User size={12} className={player.gender === 'F' ? 'text-pink-400' : 'text-blue-400'}/>
        <span className="truncate max-w-[60px] md:max-w-[80px] font-medium">{player.name}</span>
      </div>
      
      {isAdmin && (
        <div className="flex items-center gap-3">
          {onSwitch && (
            <button 
              onClick={onSwitch} 
              className="text-gray-400 hover:text-green-400 hover:bg-white/10 p-1 rounded transition-all"
              title="切換隊伍"
            >
              <Repeat size={14}/>
            </button>
          )}
          <button 
            onClick={onDelete} 
            className="text-gray-400 hover:text-red-400 hover:bg-white/10 p-1 rounded transition-all"
            title="移除"
          >
            <XCircle size={14}/>
          </button>
        </div>
      )}
    </div>
  );

  const TeamBox = ({ title, players, onDeletePlayer, onSwitchTeam, isNext = false }) => (
    <div className={`flex-1 flex flex-col min-h-[90px] rounded-lg p-2 ${
      isNext ? 'bg-black/20 border border-white/10' : 'bg-black/10 border border-white/5'
    }`}>
      <div className="text-[10px] text-gray-400 mb-1 text-center font-bold uppercase tracking-wider">{title}</div>
      <div className="flex-1 flex flex-col justify-center">
        {players.length === 0 ? (
          <div className="text-center text-white/20 text-xs py-2">- 空 -</div>
        ) : (
          players.map(p => (
            <PlayerBadge 
              key={p.id} 
              player={p} 
              onDelete={() => onDeletePlayer(p.id)} 
              onSwitch={() => onSwitchTeam(p.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  const CourtCard = ({ court }) => {
    const isPlaying = court.status === 'playing';
    const isReady = court.status === 'ready';
    const isIdle = court.status === 'idle';
    const hasNext = court.next.teamA.length > 0 || court.next.teamB.length > 0;

    return (
      <div className={`relative flex flex-col rounded-xl overflow-hidden shadow-xl transition-all ${
        isPlaying ? 'ring-2 ring-yellow-500/50' : (isReady ? 'ring-2 ring-green-500/50' : 'ring-1 ring-white/10')
      }`}>
        <div className="bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700 min-h-[52px]">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-white text-lg">
              {court.name}
            </h3>
            {isPlaying && court.startTime && (
               <GameTimer startTime={court.startTime} />
            )}
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
               {isReady && (
                  <button 
                    onClick={() => startGame(court.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse hover:animate-none transition-all"
                  >
                    <Play size={14} fill="currentColor"/> 比賽開始
                  </button>
               )}
               {isPlaying && (
                  <button 
                    onClick={() => finishGame(court.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-lg transition-all"
                  >
                    <StopCircle size={14} /> 比賽結束
                  </button>
               )}
               {isIdle && hasNext && (
                  <button 
                    onClick={() => finishGame(court.id)} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-lg transition-all"
                  >
                    <ArrowUpCircle size={14} /> 下一組上場
                  </button>
               )}
            </div>
          )}
        </div>

        <div className="relative bg-[#1a7f47] p-3 flex-1 flex flex-col gap-2">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white"></div>
          </div>

          {/* Section 1: Playing (Current) */}
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-1">
               <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                 isPlaying 
                   ? 'bg-red-500 text-white' 
                   : (isReady ? 'bg-green-600 text-white' : 'bg-black/30 text-white/50')
               }`}>
                 {isPlaying ? '比賽進行中' : (isReady ? '準備中' : '空閒')}
               </span>
               <Swords size={14} className={isPlaying ? "text-yellow-400" : "text-white/30"}/>
            </div>
            <div className="flex gap-2">
              <TeamBox 
                title="A 隊" 
                players={court.current.teamA} 
                onDeletePlayer={(pid) => kickPlayer(court.id, 'current', 'teamA', pid)}
                onSwitchTeam={(pid) => initSwitchTeam(court.id, 'current', 'teamA', pid)}
              />
              <div className="flex items-center justify-center text-white/50 font-bold text-xs italic">VS</div>
              <TeamBox 
                title="B 隊" 
                players={court.current.teamB} 
                onDeletePlayer={(pid) => kickPlayer(court.id, 'current', 'teamB', pid)}
                onSwitchTeam={(pid) => initSwitchTeam(court.id, 'current', 'teamB', pid)}
              />
            </div>
          </div>

          <div className="h-px bg-white/20 my-1"></div>

          {/* Section 2: Next (Waiting) */}
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-1">
               <span className="text-xs text-yellow-200 font-bold bg-black/30 px-2 py-0.5 rounded flex items-center gap-1">
                 <Clock size={12}/> 場地等待區
               </span>
               <ArrowDown size={14} className="text-white/50"/>
            </div>
            <div className="flex gap-2">
              <TeamBox 
                title="A 隊" 
                players={court.next.teamA} 
                onDeletePlayer={(pid) => kickPlayer(court.id, 'next', 'teamA', pid)}
                onSwitchTeam={(pid) => initSwitchTeam(court.id, 'next', 'teamA', pid)}
                isNext={true}
              />
               <div className="flex items-center justify-center text-white/30 font-bold text-xs italic">VS</div>
              <TeamBox 
                title="B 隊" 
                players={court.next.teamB} 
                onDeletePlayer={(pid) => kickPlayer(court.id, 'next', 'teamB', pid)}
                onSwitchTeam={(pid) => initSwitchTeam(court.id, 'next', 'teamB', pid)}
                isNext={true}
              />
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-gray-100 flex flex-col selection:bg-green-500 selection:text-white pb-28 md:pb-0">
      
      {/* Custom Alert */}
      <CustomAlert 
        isOpen={alertState.isOpen} 
        message={alertState.message} 
        onClose={() => setAlertState({ ...alertState, isOpen: false })} 
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePwModal}
        onClose={() => setShowChangePwModal(false)}
        onChangePassword={handleChangePassword}
      />

      {/* Navbar */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-lg text-white shadow-lg shadow-green-900/50">
              <Trophy size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-wide text-white">羽球場地控管</h1>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={isAdmin ? handleLogout : () => setShowLoginModal(true)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${isAdmin ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-gray-700 border-gray-600 text-white'}`}
              title={isAdmin ? "登出管理員" : "登入管理員"}
            >
              {isAdmin ? <><Unlock size={16}/><span className="text-xs font-bold">Admin</span></> : <><Lock size={16}/><span className="text-xs">訪客</span></>}
            </button>

            {isAdmin && (
              <>
                <button 
                  onClick={() => setShowChangePwModal(true)}
                  className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-yellow-400 hover:bg-gray-600 hover:text-white transition-all"
                  title="修改密碼"
                >
                  <Key size={16}/>
                </button>
                <button 
                  onClick={() => setShowMonthlyModal(true)}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all border border-yellow-500 shadow-lg"
                >
                  <Crown size={16} /> <span className="hidden sm:inline">月繳</span>
                </button>
                <button 
                  onClick={() => setShowRegularModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all border border-blue-500 shadow-lg"
                >
                  <Star size={16} /> <span className="hidden sm:inline">常用</span>
                </button>
                <button 
                  onClick={resetAllData}
                  className="bg-red-900/50 hover:bg-red-800 text-red-200 px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all border border-red-800/50"
                  title="重置"
                >
                  <RefreshCw size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
        
        {/* Left Column: Waiting Queue */}
        <div className="lg:col-span-3 lg:order-1 order-2">
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-140px)] sticky top-24 border border-gray-700 ring-1 ring-white/5">
            <div className="p-4 bg-gray-900 border-b border-gray-700">
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-bold text-lg flex items-center gap-2 text-green-400">
                  <Users size={20} /> 等待區 (未安排)
                </h2>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                  {waitingList.length} 人
                </span>
              </div>
            </div>
            
            {/* Add Player (Admin Only) */}
            {isAdmin && (
              <div className="p-3 bg-gray-800 border-b border-gray-700 space-y-2">
                <div className="flex gap-2 items-center">
                   <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-600 shrink-0">
                    <button 
                      onClick={() => setNewPlayerGender('M')}
                      className={`px-2 py-1 rounded text-xs font-bold ${newPlayerGender === 'M' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                    >男</button>
                    <button 
                      onClick={() => setNewPlayerGender('F')}
                      className={`px-2 py-1 rounded text-xs font-bold ${newPlayerGender === 'F' ? 'bg-pink-600 text-white' : 'text-gray-500'}`}
                    >女</button>
                  </div>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="新球員名字"
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer(e)}
                    className="flex-1 min-w-0 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-green-500"
                  />
                  <button onClick={addPlayer} className="bg-green-600 text-white p-2 rounded-lg shrink-0">
                    <UserPlus size={18} />
                  </button>
                </div>
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 flex items-center justify-center gap-1 py-1"
                >
                  <Upload size={12}/> 批次匯入名字
                </button>
              </div>
            )}

            {/* Waiting List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-black/20">
              {waitingList.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 p-4">
                  <Activity size={32} className="mx-auto mb-2 opacity-30"/>
                  <p>暫無閒置人員</p>
                </div>
              ) : (
                waitingList.map((player, index) => {
                  const isSelected = selectedPlayerIds.has(player.id);
                  const isMale = player.gender === 'M';
                  return (
                    <div 
                      key={player.id}
                      onClick={() => togglePlayerSelection(player.id)}
                      className={`flex justify-between items-center p-3 rounded-lg border transition-all select-none ${
                        isAdmin ? 'cursor-pointer' : 'cursor-default'
                      } ${
                        isSelected 
                          ? 'bg-green-900/40 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                          : 'bg-gray-700/80 border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden flex-1">
                        {isAdmin && (
                          <div className={`transition-colors ${isSelected ? 'text-green-400' : 'text-gray-600'}`}>
                            {isSelected ? <CheckCircle2 size={18} className="fill-green-900/20"/> : <div className="w-[18px] h-[18px] rounded-full border border-gray-500"></div>}
                          </div>
                        )}
                        <div className={`p-1 rounded-full ${isMale ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                           <User size={12} />
                        </div>
                        <span className={`font-bold truncate ${isSelected ? 'text-green-100' : 'text-gray-200'} ${isMale ? '' : 'text-pink-100'}`}>
                          {player.name}
                        </span>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <div className="flex flex-col mr-1 opacity-40">
                             <button onClick={(e) => movePlayerInList(index, 'up', e)}><ChevronUp size={12}/></button>
                             <button onClick={(e) => movePlayerInList(index, 'down', e)}><ChevronDown size={12}/></button>
                          </div>
                          <button 
                            onClick={(e) => removePlayerFromQueue(player.id, e)}
                            className="text-gray-500 hover:text-red-400 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Courts */}
        <div className="lg:col-span-9 lg:order-2 order-1">
           {selectedPlayerIds.size > 0 && isAdmin && (
            <div className="md:hidden sticky top-0 z-40 bg-green-600 text-white p-2 rounded-lg mb-4 text-center font-bold shadow-lg animate-pulse flex items-center justify-center gap-2">
               <ArrowDown size={18}/> 已選 {selectedPlayerIds.size} 人，請點擊下方加入
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courts.map(court => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </div>

      </main>

      {/* FIXED ACTION BAR (Admin Only) */}
      {selectedPlayerIds.size > 0 && isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gray-800 border-t border-gray-600 p-4 shadow-2xl">
             <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
               
               {/* Info */}
               <div className="flex items-center gap-2 text-white">
                  <span className="text-gray-400">已選擇</span>
                  <span className="bg-green-600 px-2 rounded-full font-bold">{selectedPlayerIds.size}</span>
                  <span className="text-gray-400">人，報名：</span>
               </div>

               {/* Controls */}
               <div className="flex-1 flex gap-2 w-full sm:w-auto">
                  {/* Court Selector */}
                  <select 
                    value={targetCourtId}
                    onChange={(e) => setTargetCourtId(e.target.value)}
                    className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-3 text-base focus:border-green-500 outline-none"
                  >
                    {courts.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <button 
                    onClick={handleAssignPlayers}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    加入等待區 <Send size={16} />
                  </button>
               </div>

                <button 
                  onClick={clearSelection}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded shrink-0"
                >
                  取消
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {swapModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-gray-600">
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Repeat /> 選擇交換對象
             </h3>
             <p className="text-gray-400 text-sm mb-4">
               {swapModal.sourcePlayer?.name} 想換到 {swapModal.targetTeamName === 'teamA' ? 'A隊' : 'B隊'}，請選擇對面的一位球員進行交換：
             </p>
             <div className="grid gap-2">
               {swapModal.candidates.map(candidate => (
                 <button 
                   key={candidate.id}
                   onClick={() => performSwap(candidate.id)}
                   className="p-3 bg-gray-700 hover:bg-green-600 hover:text-white rounded-lg flex items-center justify-between transition-colors text-left"
                 >
                   <span className="font-bold">{candidate.name}</span>
                   <Repeat size={16} className="opacity-50"/>
                 </button>
               ))}
             </div>
             <button 
               onClick={() => setSwapModal({ ...swapModal, isOpen: false })}
               className="mt-4 w-full py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg"
             >
               取消
             </button>
          </div>
        </div>
      )}

      {/* Monthly Members Modal */}
      {showMonthlyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
           <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-600 h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Crown className="text-yellow-500"/> 月繳名單</h3>
                <button onClick={() => setShowMonthlyModal(false)} className="text-gray-400 hover:text-white"><XCircle/></button>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newMonthlyName}
                  onChange={e => setNewMonthlyName(e.target.value)}
                  placeholder="新增月繳人員姓名"
                  className="flex-1 bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 outline-none focus:border-yellow-500"
                />
                <button 
                  onClick={addMonthlyMember}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded font-bold"
                >
                  <Save size={18}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
                 {monthlyMembers.map(m => {
                   const isAdded = waitingList.some(p => p.name === m.name);
                   return (
                     <div key={m.id} className="bg-gray-700 p-2 rounded flex justify-between items-center group">
                        <span className="font-bold text-gray-200 truncate flex-1">{m.name}</span>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => checkInMonthlyMember(m)}
                             disabled={isAdded}
                             className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                               isAdded ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'
                             }`}
                           >
                             {isAdded ? <><Check size={12}/> 已加入</> : <><PlusCircle size={12}/> 加入</>}
                           </button>
                           <button 
                              onClick={() => removeMonthlyMember(m.id)}
                              className="text-gray-500 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="刪除成員"
                           >
                              <Trash2 size={14}/>
                           </button>
                        </div>
                     </div>
                   );
                 })}
                 {monthlyMembers.length === 0 && <p className="col-span-full text-center text-gray-500 py-4">暫無名單</p>}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button 
                  onClick={checkInAllMonthly}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Users size={18}/> 全部加入等待區
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Regular Members Modal (New) */}
      {showRegularModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
           <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-600 h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Star className="text-blue-500" fill="currentColor"/> 常用名單</h3>
                <button onClick={() => setShowRegularModal(false)} className="text-gray-400 hover:text-white"><XCircle/></button>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newRegularName}
                  onChange={e => setNewRegularName(e.target.value)}
                  placeholder="新增常用人員姓名"
                  className="flex-1 bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 outline-none focus:border-blue-500"
                />
                <button 
                  onClick={addRegularMember}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold"
                >
                  <Save size={18}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
                 {regularMembers.map(m => {
                   const isAdded = waitingList.some(p => p.name === m.name);
                   return (
                     <div key={m.id} className="bg-gray-700 p-2 rounded flex justify-between items-center group">
                        <span className="font-bold text-gray-200 truncate flex-1">{m.name}</span>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => checkInRegularMember(m)}
                             disabled={isAdded}
                             className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                               isAdded ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500'
                             }`}
                           >
                             {isAdded ? <><Check size={12}/> 已加入</> : <><PlusCircle size={12}/> 加入</>}
                           </button>
                           <button 
                              onClick={() => removeRegularMember(m.id)}
                              className="text-gray-500 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="刪除成員"
                           >
                              <Trash2 size={14}/>
                           </button>
                        </div>
                     </div>
                   );
                 })}
                 {regularMembers.length === 0 && <p className="col-span-full text-center text-gray-500 py-4">暫無名單</p>}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button 
                  onClick={checkInAllRegular}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Users size={18}/> 全部加入等待區
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText/> 批次匯入</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="輸入名字，以逗號或換行分隔"
              className="w-full h-32 bg-gray-900 border border-gray-600 rounded p-3 text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-gray-400">取消</button>
              <button onClick={handleBulkImport} className="px-4 py-2 bg-green-600 text-white rounded">匯入</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;