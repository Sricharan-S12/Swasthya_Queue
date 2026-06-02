/* ========================= */
/* DARK MODE TOGGLE */
/* ========================= */

const darkModeBtn = document.getElementById("darkModeToggle");

darkModeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.innerHTML = "☀️ Light Mode";
  } else {
    darkModeBtn.innerHTML = "🌙 Dark Mode";
  }
});
// ── REFERRAL ──
let selHospId='hc1';
function selHosp(id,name){
  document.querySelectorAll('.h-card').forEach(c=>c.classList.remove('sel'));
  document.getElementById(id).classList.add('sel');
  ['hc1','hc2','hc3'].forEach(h=>{
    const det=document.getElementById(h+'-detail');
    if(det)det.style.display=h===id?'block':'none';
  });
  selHospId=id;
  document.getElementById('mm-to').textContent=name;
}
function dispatchAmbu(n){
  const btn=document.getElementById('a'+n+'-btn');
  btn.textContent='Dispatched ✓';btn.classList.add('done');btn.disabled=true;
  document.getElementById('mm-ambu').textContent=n===1?'AMB-BW04 (ETA 4 min)':'AMB-BW07 (ETA 18 min)';
  document.getElementById('tl-ambu-dot').className='tl-d tl-done-d';
  document.getElementById('tl-ambu-lbl').textContent='Ambulance dispatched — AMB-108-BW0'+[null,'4','7'][n];
  document.getElementById('tl-ambu-time').textContent='Just now';
}
function confirmBed(name){
  document.getElementById('mm-bed').textContent='Reserved · '+name;
  document.getElementById('tl-bed-dot').className='tl-d tl-done-d';
  document.getElementById('tl-bed-lbl').textContent='Bed reserved — '+name;
  document.getElementById('tl-bed-time').textContent='Just now · Auto-confirmed';
}
function sendReferral(){
  const el=document.getElementById('ref-status');
  el.textContent='Sent ✓';el.className='pill pill-green';
  document.getElementById('tl-ref-dot').className='tl-d tl-done-d';
  document.getElementById('tl-ref-lbl').textContent='Referral sent — hospital notified';
  document.getElementById('tl-ref-time').textContent='Just now · SMS + eReferral';
}
function triggerFull(){dispatchAmbu(1);setTimeout(()=>confirmBed('District Hospital Barwani'),300);setTimeout(()=>sendReferral(),600);}
function triggerAmbuOnly(){dispatchAmbu(1);}
function triggerNotify(){sendReferral();}
function editMsg(){const m=document.getElementById('ref-msg');m.contentEditable='true';m.focus();m.style.borderLeftColor='var(--purple)';}

/* =========================================================
       API System Mock Engine 
       Simulates seamless backend operation
       ========================================================= */
    const APIService = {
      patients: [],
      
      async delay(ms) {
        return new Promise(r => setTimeout(r, ms));
      },

      async submitTriage(data) {
        await this.delay(1200); // Simulate network latency + ML inference
        
        let score = 0;
        const critSyms = ['Chest pain','Breathlessness','Seizure'];
        const modSyms = ['Fever','Headache','Injury'];
        
        data.syms.forEach(s => {
          if (critSyms.includes(s)) score += 4;
          else if (modSyms.includes(s)) score += 2;
          else score += 1;
        });
        
        score += data.sev;
        if (data.age > 60 || data.age < 5) score = Math.floor(score * 1.5);

        let priority = 'GREEN';
        if (score >= 8) priority = 'RED';
        else if (score >= 4) priority = 'ORANGE';

        const token = 'P-' + Math.floor(100 + Math.random() * 900);
        
        const newPatient = {
          id: token,
          name: data.name,
          age: data.age,
          priority: priority,
          score: score,
          syms: data.syms,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          wait: priority === 'RED' ? '2m' : priority === 'ORANGE' ? '15m' : '40m'
        };

        this.patients.push(newPatient);
        this.patients.sort((a,b) => b.score - a.score); // Re-prioritize Queue dynamically
        
        return newPatient;
      },

      async getQueue() {
        // Return seeded mock queue combined with pure data
        return [
          {id:'P-042', name:'Ramesh Kumar', age:62, priority:'RED', score:12, syms:['Chest pain','Breathlessness'], time:'10:30 AM', wait:'0m'},
          {id:'P-101', name:'Savita Devi', age:35, priority:'RED', score:9, syms:['Seizure','Headache'], time:'10:15 AM', wait:'5m'},
          {id:'P-212', name:'Mohanlal', age:55, priority:'ORANGE', score:6, syms:['Fever','Abdominal pain'], time:'09:40 AM', wait:'12m'},
          {id:'P-088', name:'Kamla Bai', age:70, priority:'ORANGE', score:5, syms:['Cold','Body ache'], time:'09:20 AM', wait:'25m'},
          ...this.patients
        ].sort((a,b) => b.score - a.score);
      },

      async triggerReferralSync() {
        await this.delay(1500); // Simulate 3-way API sync (Ambulance + Hospital + eSanjeevani)
        return true;
      }
    };

    /* =========================================================
       UI Controllers
       ========================================================= */
    const SYMPTOMS = ['Chest pain','Breathlessness','Seizure','Fever','Headache','Vomiting','Abdominal pain','Cold','Injury'];
    let currentSyms = new Set();
    let currentSev = 3;

    function init() {
      // Build Symptom grid
      const cont = document.getElementById('sym-container');
      SYMPTOMS.forEach(s => {
        const btn = document.createElement('div');
        btn.className = 'sym-btn';
        btn.innerHTML = `<span style="font-size:18px;">${getIcon(s)}</span> ${s}`;
        btn.onclick = () => {
          if(currentSyms.has(s)) { currentSyms.delete(s); btn.classList.remove('active'); }
          else { currentSyms.add(s); btn.classList.add('active'); }
        };
        cont.appendChild(btn);
      });
      loadQueue();
    }

    function getIcon(s) {
      const dic = {'Chest pain':'🫀', 'Breathlessness':'🫁', 'Seizure':'⚡', 'Fever':'🌡️', 'Headache':'🧠', 'Vomiting':'🤢', 'Abdominal pain':'🫃', 'Cold':'🤧', 'Injury':'🩹'};
      return dic[s] || '🩺';
    }

    let currentUser = null; // null or { username: '...', role: '...', fullName: '...' }
    let pendingTab = null;

    function enterPortal(type) {
      if (type === 'clinic') {
        document.getElementById('main-nav').style.display = 'block';
        document.getElementById('tab-patient').style.display = 'inline-flex';
        document.getElementById('tab-dispatch').style.display = 'inline-flex';
        document.getElementById('tab-about').style.display = 'inline-flex';
        document.getElementById('tab-doctor').style.display = 'none';
        
        switchTab('patient');
      } else if (type === 'doctor-login') {
        openAuthModal('doctor', 'doctor');
      }
    }

    function switchTab(id) {
      if (id === 'landing') {
          document.getElementById('main-nav').style.display = 'none';
      }

      // Authorization Check
      if (id === 'doctor') {
        if (!currentUser || currentUser.role !== 'doctor') {
            openAuthModal(id, 'doctor');
            return;
        }
      }
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      
      const tabs = document.querySelectorAll('.nav-tab');
      for (let i=0; i<tabs.length; i++) {
        if (tabs[i].getAttribute('onclick') && tabs[i].getAttribute('onclick').includes(`'${id}'`)) {
            tabs[i].classList.add('active');
            break;
        }
      }

      document.getElementById('panel-'+id).classList.add('active');
      
      if (id === 'doctor') loadQueue();
      if (id === 'dispatch' && window.osmMap) { setTimeout(() => window.osmMap.invalidateSize(), 200); }
    }

    function openAuthModal(targetTab, requiredRole) {
      pendingTab = targetTab;
      document.getElementById('auth-modal').classList.add('active');
      document.getElementById('auth-prompt').innerText = targetTab === 'doctor' ? "Please sign in as Doctor to view Dashboard" : "Please sign in as Dispatch Admin to access Command Center";
      setTimeout(() => document.getElementById('auth-user').focus(), 100);
    }

    function cancelLogin() {
      document.getElementById('auth-modal').classList.remove('active');
      document.getElementById('auth-error').style.display = 'none';
      document.getElementById('auth-form').reset();
    }

    function handleLogin() {
      const u = document.getElementById('auth-user').value.trim();
      const p = document.getElementById('auth-pass').value;
      const err = document.getElementById('auth-error');

      err.style.display = 'none';

      if (pendingTab === 'doctor' && u === 'doctor' && p === 'doctor123') {
          currentUser = { username: u, role: 'doctor', fullName: 'Dr. Sharma' };
      }
      else if (pendingTab === 'dispatch' && u === 'admin' && p === 'admin123') {
          currentUser = { username: u, role: 'admin', fullName: 'Dispatch Supervisor' };
      }
      else {
          err.style.display = 'block';
          err.innerText = "Invalid credentials for requested module.";
          return;
      }

      document.getElementById('user-info').style.display = 'flex';
      document.getElementById('user-name-display').innerText = currentUser.fullName;

      if (pendingTab === 'doctor') {
          document.getElementById('main-nav').style.display = 'block';
          document.getElementById('tab-patient').style.display = 'none';
          document.getElementById('tab-dispatch').style.display = 'none';
          document.getElementById('tab-about').style.display = 'inline-flex';
          document.getElementById('tab-doctor').style.display = 'inline-flex';
      }
      cancelLogin();
      switchTab(pendingTab);
    }

    function handleLogout() {
      currentUser = null;
      document.getElementById('user-info').style.display = 'none';
      switchTab('landing');
    }

    function selectMode(m, el) {
      document.querySelectorAll('.access-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
      
      document.getElementById('flow-web').style.display = 'none';
      document.getElementById('flow-ussd').style.display = 'none';
      document.getElementById('flow-sms').style.display = 'none';
      document.getElementById('flow-result').style.display = 'none';
      
      document.getElementById(`flow-${m}`).style.display = 'block';
    }

    function setSeverity(val, el) {
      currentSev = val;
      document.querySelectorAll('.sev-item').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
    }

    function nextStep() {
      document.getElementById('reg-step-1').style.display = 'none';
      document.getElementById('reg-step-2').style.display = 'block';
    }

    function prevStep() {
      document.getElementById('reg-step-2').style.display = 'none';
      document.getElementById('reg-step-1').style.display = 'block';
    }

    async function submitTriage() {
      const btn = document.getElementById('btn-submit-triage');
      btn.classList.add('loading');

      const data = {
        name: document.getElementById('f-name').value || 'Unk',
        age: parseInt(document.getElementById('f-age').value) || 30,
        syms: Array.from(currentSyms),
        sev: currentSev
      };

      try {
        const ticket = await APIService.submitTriage(data);
        
        // Show result
        document.getElementById('reg-step-2').style.display = 'none';
        document.getElementById('flow-result').style.display = 'block';
        
        document.getElementById('tk-no').textContent = ticket.id;
        document.getElementById('tk-name').textContent = ticket.name + ' • ' + ticket.age + 'y';
        document.getElementById('tk-score').textContent = ticket.score + ' / 20';
        document.getElementById('tk-prio').textContent = ticket.priority;
        document.getElementById('tk-time').textContent = ticket.time;
        document.getElementById('tk-wait').textContent = ticket.wait;
        
        const head = document.getElementById('tk-head');
        const wBox = document.getElementById('tk-wait-box');
        
        if (ticket.priority === 'RED') {
          head.style.background = 'var(--red)';
          document.getElementById('tk-no').style.color = 'var(--red-light)';
          wBox.style.background = 'var(--red-light)';
          document.getElementById('tk-wait').style.color = 'var(--red-dark)';
        } else if (ticket.priority === 'ORANGE') {
          head.style.background = 'var(--orange)';
          document.getElementById('tk-no').style.color = '#FFF';
          wBox.style.background = 'var(--orange-light)';
          document.getElementById('tk-wait').style.color = 'var(--orange-dark)';
        } else {
          head.style.background = 'var(--primary)';
          document.getElementById('tk-no').style.color = 'var(--primary-light)';
          wBox.style.background = 'var(--primary-light)';
          document.getElementById('tk-wait').style.color = 'var(--primary-dark)';
        }
        
      } catch (e) {
        console.error(e);
      } finally {
        btn.classList.remove('loading');
      }
    }

    function resetForm() {
      document.getElementById('form-details').reset();
      currentSyms.clear();
      document.querySelectorAll('.sym-btn').forEach(b => b.classList.remove('active'));
      setSeverity(3, document.querySelectorAll('.sev-item')[2]);
      document.getElementById('flow-result').style.display = 'none';
      document.getElementById('reg-step-1').style.display = 'block';
    }

    async function loadQueue() {
      const qCont = document.getElementById('doctor-queue');
      qCont.innerHTML = '<div style="text-align:center; padding: 40px; color:var(--text-muted);">Syncing live datastream...</div>';
      
      const qData = await APIService.getQueue();
      qCont.innerHTML = '';
      
      qData.forEach(p => {
        const cColor = p.priority === 'RED' ? 'red' : p.priority === 'ORANGE' ? 'orange' : 'primary';
        const init = p.name.substring(0,2).toUpperCase();
        
        const html = `
          <div class="q-card" onclick="this.classList.toggle('expanded')">
            <div class="q-main">
              <div class="q-indicator" style="background: var(--${cColor});"></div>
              <div class="q-avatar" style="background: var(--${cColor}-light); color: var(--${cColor}-dark);">${init}</div>
              <div class="q-details">
                <div class="q-name">${p.name} <span class="pill pill-${p.priority==='RED'?'red':p.priority==='ORANGE'?'orange':'green'}">${p.priority}</span></div>
                <div class="q-meta">${p.age}y • ${p.syms.join(', ')} • Arrived ${p.time}</div>
              </div>
              <div class="q-status">
                <div class="q-score" style="color: var(--${cColor}-dark);">${p.score}</div>
                <div class="q-wait">Wait: ${p.wait}</div>
              </div>
            </div>
            
            <div class="q-brief">
              <div class="vitals-grid">
                <div class="vital-box"><div class="vital-val val-danger">160/100</div><div class="vital-lbl">BP</div></div>
                <div class="vital-box"><div class="vital-val val-danger">91%</div><div class="vital-lbl">SpO₂</div></div>
                <div class="vital-box"><div class="vital-val val-warn">112</div><div class="vital-lbl">HR</div></div>
                <div class="vital-box"><div class="vital-val val-ok">98.2°F</div><div class="vital-lbl">TEMP</div></div>
              </div>
              <div class="ai-summary">
                <p>✨ <b>AI Synth Brief:</b> Patient presenting with acute chest discomfort and breathlessness starting recently. SpO2 critical and BP hypertensive. High likelihood of ACS. Immediate medical intervention advised.</p>
              </div>
              <div style="display:flex; gap:12px;">
                <button class="btn btn-primary" onclick="event.stopPropagation(); startVideoCall('${p.name}')">Start Video Consult</button>
                <button class="btn btn-outline" style="background:var(--surface);" onclick="event.stopPropagation(); openMessageModal('${p.name}')">Message Patient</button>
                <button class="btn btn-danger" onclick="event.stopPropagation(); switchTab('dispatch')">Refer & Dispatch</button>
              </div>
            </div>
          </div>
        `;
        qCont.innerHTML += html;
      });
    }

    async function triggerSmartDispatch(btn) {
      btn.classList.add('loading');
      
      // Animate the ambulance on the map
      const ambu = document.getElementById('live-ambu');
      ambu.style.top = '25%';
      ambu.style.left = '65%';
      
      await APIService.triggerReferralSync();
      
      btn.classList.remove('loading');
      btn.innerHTML = '✅ Dispatched Successfully';
      btn.classList.remove('btn-primary');
      btn.style.background = 'var(--primary-dark)';
      btn.style.color = '#FFF';
      
      document.getElementById('sys-modal').classList.add('active');
    }

    /* =========================================================
       USSD Simulator Logic
       ========================================================= */
    const ussdState = { buffer: '', step: 0, lang: 'en', error: null };
    
    const ussdText = {
      en: {
        welcome: "Swasthya Queue\n1. Register Patient\n2. Status\n3. Emergency",
        age: "Age of patient?",
        syms: "Chest pain or Breathlessness?\n1. Yes\n2. No",
        done: "✅ Triage Done\nToken: P-812\nPriority: HIGH\nWait: ~5m\nDoctor will call shortly.",
        status: "📋 Status\nToken: P-812\nEst. Wait: ~15m\nPriority: NORMAL",
        emergency: "🚨 Emergency\nAlert sent to Command Center.\n108 Ambulance dispatched."
      },
      hi: {
        welcome: "स्वास्थ्य कतार\n1. नया मरीज\n2. स्थिति\n3. आपातकालीन",
        age: "मरीज की उम्र?",
        syms: "सीने में दर्द या सांस लेने में तकलीफ?\n1. हाँ\n2. नहीं",
        done: "✅ ट्राइएज पूरा\nटोकन: P-812\nप्राथमिकता: उच्च\nप्रतीक्षा: ~5m\nडॉक्टर जल्द कॉल करेंगे।",
        status: "📋 स्थिति\nटोकन: P-812\nप्रतीक्षा: ~15m\nप्राथमिकता: सामान्य",
        emergency: "🚨 आपातकालीन\nकमांड सेंटर को अलर्ट भेजा गया।\n108 एम्बुलेंस रवाना।"
      },
      ta: {
        welcome: "ஸ்வஸ்த்யா கியூ\n1. புதிய நோயாளி\n2. நிலை\n3. அவசரம்",
        age: "நோயாளியின் வயது?",
        syms: "நெஞ்சு வலி அல்லது மூச்சுத் திணறலா?\n1. ஆம்\n2. இல்லை",
        done: "✅ மதிப்பீடு முடிந்தது\nடோக்கன்: P-812\nமுன்னுரிமை: உயர்\nகாத்திருப்பு: ~5நிமி\nமருத்துவர் அழைப்பார்.",
        status: "📋 நிலை\nடோக்கன்: P-812\nகாத்திருப்பு: ~15நிமி",
        emergency: "🚨 அவசரம்\n108 ஆம்புலன்ஸ் அழைக்கப்பட்டுள்ளது."
      },
      te: {
        welcome: "స్వాస్థ్య క్యూ\n1. కొత్త రోగి\n2. స్థితి\n3. అత్యవసరం",
        age: "రోగి వయస్సు?",
        syms: "ఛాతీ నొప్పి లేదా శ్వాస ఆడకపోవడమా?\n1. అవును\n2. కాదు",
        done: "✅ మదింపు పూర్తయింది\nటోకెన్: P-812\nప్రాధాన్యత: ఎక్కువ\nవేచి ఉండండి: ~5నిమి\nడాక్టర్ త్వరలో కాల్ చేస్తారు.",
        status: "📋 స్థితి\nటోకెన్: P-812\nవేచి ఉండండి: ~15నిమి",
        emergency: "🚨 అత్యవసరం\n108 అంబులెన్స్ పిలవబడింది."
      },
      kn: {
        welcome: "ಸ್ವಾಸ್ಥ್ಯ ಕ್ಯೂ\n1. ಹೊಸ ರೋಗಿ\n2. ಸ್ಥಿತಿ\n3. ತುರ್ತು",
        age: "ರೋಗಿಯ ವಯಸ್ಸು?",
        syms: "ಎದೆನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಯೇ?\n1. ಹೌದು\n2. ಇಲ್ಲ",
        done: "✅ ವಿಂಗಡಣೆ ಮುಗಿದಿದೆ\nಟೋಕನ್: P-812\nಆದ್ಯತೆ: ಹೆಚ್ಚು\nಕಾಯುವಿಕೆ: ~5ನಿ\nವೈದ್ಯರು ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡಲಿದ್ದಾರೆ.",
        status: "📋 ಸ್ಥಿತಿ\nಟೋಕನ್: P-812\nಕಾಯುವಿಕೆ: ~15ನಿ",
        emergency: "🚨 ತುರ್ತು\n108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಲಾಗಿದೆ."
      }
    };

    function ussdInput(char) {
      ussdState.buffer += char;
      renderUssdScreen();
    }

    function renderUssdScreen() {
      const scr = document.getElementById('ussd-screen');
      let display = "";
      
      // Flash an error message if invalid input is detected
      if (ussdState.error) {
        display += `[!] ${ussdState.error}\n\n`;
      }

      if (ussdState.step === 0 && !ussdState.buffer.includes('*599#') && !ussdState.error) {
        display += `Menu:\nType *599# and press Send.\n\n${ussdState.buffer}_`;
      } else if (ussdState.step === 0) {
        display += `Type *599# and press Send.\n\n${ussdState.buffer}_`;
      } else if (ussdState.step === 1) {
        display += `Language:\n1. Eng 2. हिंदी 3. தமிழ்\n4. తెలుగు 5. ಕನ್ನಡ\n\nInput: ${ussdState.buffer}_`;
      } else if (ussdState.step === 2) {
        display += `${ussdText[ussdState.lang].welcome}\n\nInput: ${ussdState.buffer}_`;
      } else if (ussdState.step === 3) {
        display += `${ussdText[ussdState.lang].age}\n\nInput: ${ussdState.buffer}_`;
      } else if (ussdState.step === 4) {
        display += `${ussdText[ussdState.lang].syms}\n\nInput: ${ussdState.buffer}_`;
      } else if (ussdState.step === 5) {
        display += ussdText[ussdState.lang].done;
      } else if (ussdState.step === 6) {
        display += ussdText[ussdState.lang].status;
      } else if (ussdState.step === 7) {
        display += ussdText[ussdState.lang].emergency;
      }

      scr.innerText = display;
    }

    async function ussdSend() {
      let isValidInput = true;

      if (ussdState.step === 0) {
        if (ussdState.buffer === '*599#') {
          ussdState.step = 1; 
          ussdState.buffer = '';
        } else {
          isValidInput = false;
        }
      } 
      else if (ussdState.step === 1) {
        if (/^[1-5]$/.test(ussdState.buffer)) {
          const langMap = {'1':'en', '2':'hi', '3':'ta', '4':'te', '5':'kn'};
          ussdState.lang = langMap[ussdState.buffer];
          ussdState.step = 2; 
          ussdState.buffer = '';
        } else {
          isValidInput = false;
        }
      } 
      else if (ussdState.step === 2) {
        if (ussdState.buffer === '1') {
          ussdState.step = 3; 
          ussdState.buffer = '';
        } else if (ussdState.buffer === '2') {
          ussdState.step = 6; // Route to Status Mock
          ussdState.buffer = '';
        } else if (ussdState.buffer === '3') {
          ussdState.step = 7; // Route to Emergency Mock
          ussdState.buffer = '';
        } else {
          isValidInput = false;
        }
      } 
      else if (ussdState.step === 3) {
        // Strict Validation: Must be a number and not empty
        if (ussdState.buffer.length > 0 && !isNaN(ussdState.buffer)) {
          ussdState.step = 4; 
          ussdState.buffer = '';
        } else {
          isValidInput = false;
        }
      } 
      else if (ussdState.step === 4) {
        if (ussdState.buffer === '1' || ussdState.buffer === '2') {
          ussdState.step = 5; 
          const severityInput = ussdState.buffer;
          ussdState.buffer = '';
          await APIService.submitTriage({ 
            name: "USSD User", 
            age: 50, 
            syms: severityInput === '1' ? ["Chest pain"] : ["Fever"], 
            sev: 4 
          });
          loadQueue();
        } else {
          isValidInput = false;
        }
      }

      // Handle invalid inputs globally
      if (!isValidInput) {
        ussdState.error = "Invalid Input. Try again.";
        ussdState.buffer = '';
      } else {
        ussdState.error = null; // Clear error on successful progression
      }

      renderUssdScreen();
      ussdState.error = null; // Reset error so it clears on the very next keystroke
    }
    
    /* =========================================================
       SMS Simulator Logic
       ========================================================= */
    const smsFlow = [
      { trigger: 'yes', resp: "Great! What is the patient's age?" },
      { trigger: '*', resp: "Does the patient have fever, chest pain, or trauma? Please list symptoms." },
      { trigger: '*', resp: "Noted. On a scale of 1-5, how severe is the pain/discomfort?" },
      { trigger: '*', resp: "✅ Registration complete. Token: P-404. Priority: MEDIUM. Wait time: ~15 mins. We will notify you when it's your turn. The doctor will review your case shortly." }
    ];
    let smsStep = 0;

    async function sendSMS() {
      const inp = document.getElementById('chat-input');
      const val = inp.value.trim();
      if(!val) return;
      
      const body = document.getElementById('chat-body');
      body.innerHTML += `<div class="chat-bubble chat-right">${val}</div>`;
      inp.value = '';
      body.scrollTop = body.scrollHeight;

      // Simulate Bot Typings
      setTimeout(async () => {
        let msg = "I didn't understand that.";
        if (smsStep < smsFlow.length) {
          msg = smsFlow[smsStep].resp;
          if (smsStep === smsFlow.length - 1) {
            await APIService.submitTriage({ name: "SMS User", age: 30, syms: ["Fever"], sev: 3 });
            loadQueue();
          }
          smsStep++;
        }
        body.innerHTML += `<div class="chat-bubble chat-left">${msg}</div>`;
        body.scrollTop = body.scrollHeight;
      }, 1000);
    }


    // Initialize Real-time Map
    function initMap() {
      var map = L.map('osm-map').setView([22.033, 74.91], 13);
      window.osmMap = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      
      var phcIcon = L.divIcon({className: '', html: '<div style="background:#C0392B; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.5);"></div>', iconSize: [14,14]});
      var hospIcon = L.divIcon({className: '', html: '<div style="background:#2980B9; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.5);"></div>', iconSize: [14,14]});
      var ambuIcon = L.divIcon({className: '', html: '<div style="font-size:20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🚑</div>', iconSize: [20,20]});

      L.marker([22.035, 74.90], {icon: phcIcon}).addTo(map).bindPopup('<b>PHC Barwani</b><br>Currently full.');
      L.marker([22.030, 74.93], {icon: hospIcon}).addTo(map).bindPopup('<b>District Hospital Barwani</b><br>ICU Beds: 4 Available');
      
      // Animated LIVE ambulance
      var ambu = L.marker([22.034, 74.905], {icon: ambuIcon, zIndexOffset: 1000}).addTo(map).bindPopup('<b>AMB-108-BW04</b><br>ETA 4 min');
      
      setInterval(() => {
          let latlng = ambu.getLatLng();
          let newLat = latlng.lat - 0.00005;
          let newLng = latlng.lng + 0.00015;
          if(newLng > 74.93) { newLng = 74.905; newLat = 22.034; }
          ambu.setLatLng([newLat, newLng]);
      }, 1000);
    }
    
    /* =========================================================
       Modal Action Controllers
       ========================================================= */
    function startVideoCall(patientName) {
      document.getElementById('video-patient-name').innerText = "Connected to " + patientName;
      document.getElementById('video-status-text').innerText = "Establishing E2E Connection to " + patientName + "...";
      document.getElementById('video-call-modal').classList.add('active');
    }

    function endVideoCall() {
      document.getElementById('video-call-modal').classList.remove('active');
    }

    function openMessageModal(patientName) {
      document.getElementById('msg-patient-name').innerText = patientName;
      document.getElementById('message-modal').classList.add('active');
    }

    function closeMessageModal() {
      document.getElementById('message-modal').classList.remove('active');
    }

    function sendMessage() {
      const input = document.getElementById('msg-input');
      const text = input.value.trim();
      if (!text) return;

      const body = document.getElementById('msg-body');
      
      const bounceStr = `<div class="chat-bubble chat-right">${text}</div>`;
      body.insertAdjacentHTML('beforeend', bounceStr);
      input.value = '';
      
      // Auto reply mock
      setTimeout(() => {
        const reply = `<div class="chat-bubble chat-left" style="background: var(--surface);">Dr. Sharma, the patient is ready to proceed.</div>`;
        body.insertAdjacentHTML('beforeend', reply);
        body.scrollTop = body.scrollHeight;
      }, 1000);

      body.scrollTop = body.scrollHeight;
    }

    document.addEventListener("DOMContentLoaded", initMap);
    
    document.addEventListener("DOMContentLoaded", init);

function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,ta,te,kn',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }
