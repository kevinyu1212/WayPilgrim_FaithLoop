import { useState, useEffect } from 'react';
import Button from '../../components/atoms/Button';

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: '', nickname: '', password: '' });
  const [status, setStatus] = useState({ 
    email: { available: null, message: '' },
    nickname: { available: null, message: '' }
  });

  // 이메일 중복 체크 로직
  const checkEmail = async (email) => {
    if (!email.includes('@')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/check-email?email=${email}`);
      const data = await res.json();
      setStatus(prev => ({ ...prev, email: { available: data.isAvailable, message: data.message } }));
    } catch (err) { console.error("Email check failed", err); }
  };

  // 닉네임 중복 체크 로직
  const checkNickname = async (nickname) => {
    if (nickname.length < 2) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/check-nickname?nickname=${nickname}`);
      const data = await res.json();
      setStatus(prev => ({ ...prev, nickname: { available: data.isAvailable, message: data.message } }));
    } catch (err) { console.error("Nickname check failed", err); }
  };

  return (
    <main className="min-h-screen bg-background text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-surface/30 p-10 rounded-sm border border-white/5 backdrop-blur-md">
        <h2 className="font-serif text-3xl mb-8 text-center">순례길 합류하기</h2>
        
        <div className="flex flex-col gap-6">
          {/* 이메일 입력 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-softText">Email</label>
            <input 
              type="email" 
              className="bg-transparent border-b border-white/20 py-2 focus:border-primary outline-none transition-colors"
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if(e.target.value.includes('@')) checkEmail(e.target.value);
              }}
            />
            {status.email.message && (
              <span className={`text-[10px] ${status.email.available ? 'text-green-400' : 'text-red-400'}`}>
                {status.email.available ? '✓' : '✕'} {status.email.message}
              </span>
            )}
          </div>

          {/* 닉네임 입력 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-softText">Nickname</label>
            <input 
              type="text" 
              className="bg-transparent border-b border-white/20 py-2 focus:border-primary outline-none transition-colors"
              onChange={(e) => {
                setFormData({...formData, nickname: e.target.value});
                if(e.target.value.length >= 2) checkNickname(e.target.value);
              }}
            />
            {status.nickname.message && (
              <span className={`text-[10px] ${status.nickname.available ? 'text-green-400' : 'text-red-400'}`}>
                {status.nickname.available ? '✓' : '✕'} {status.nickname.message}
              </span>
            )}
          </div>

          <Button 
            variant="primary" 
            className="mt-4 w-full"
            disabled={!status.email.available || !status.nickname.available}
          >
            여정 시작하기
          </Button>
        </div>
      </div>
    </main>
  );
}
