/* ============================================================
   GLOBALS & STATE
   ============================================================ */

   let currentLang = 'en';
   let currentPage = 'dashboard';
   let isOnline = true;
   let selectedVehicle = 1;
   const routeDistances = {
     'tashkent-samarkand': 340,
     'tashkent-bukhara': 560,
     'samarkand-bukhara': 270,
     'tashkent-namangan': 310,
     'tashkent-andijan': 380,
     'tashkent-termez': 700,
     'urgench-nukus': 170,
     'fergana-tashkent': 420,
     'bukhara-termez': 480,
   };
   
   /* ============================================================
      LANDING PAGE - INITIALIZATION
      ============================================================ */
   
   document.addEventListener('DOMContentLoaded', () => {
     initializePage();
     updateLanguage();
     setTodayDate();
   });
   
   function initializePage() {
     const savedLang = localStorage.getItem('kervan-lang') || 'en';
     setLang(savedLang);
   
     // Fade in sections after a delay
     setTimeout(() => {
       const sections = document.querySelectorAll('section');
       sections.forEach((sec, idx) => {
         sec.style.animation = `sectionFadeIn 0.8s ease forwards`;
         sec.style.animationDelay = `${idx * 0.2}s`;
       });
     }, 1500);
   
     // Stagger vehicle cards
     document.querySelectorAll('.vehicle-card').forEach((card, idx) => {
       card.style.setProperty('--index', idx);
     });
   
     // Stagger route cards
     document.querySelectorAll('.route-card').forEach((card, idx) => {
       card.style.setProperty('--index', idx);
     });
   
     // Stagger steps
     document.querySelectorAll('.step').forEach((step, idx) => {
       step.style.setProperty('--index', idx);
     });
   }
   
   /* ============================================================
      LANGUAGE & LOCALIZATION
      ============================================================ */
   
   function setLang(lang) {
     currentLang = lang;
     localStorage.setItem('kervan-lang', lang);
   
     // Update active lang button
     document.querySelectorAll('.lang-btn, .footer-langs-bottom button').forEach(btn => {
       btn.classList.remove('active');
     });
     document.querySelectorAll(`[onclick*="setLang('${lang}')"]`).forEach(btn => {
       btn.classList.add('active');
     });
   
     // Update text content
     updateLanguage();
   }
   
   function updateLanguage() {
     document.querySelectorAll('[data-en]').forEach(el => {
       const texts = {
         'en': el.getAttribute('data-en') || '',
         'uz': el.getAttribute('data-uz') || '',
         'ru': el.getAttribute('data-ru') || '',
       };
       el.textContent = texts[currentLang] || texts['en'];
     });
   }
   
   /* ============================================================
      SPLASH & SITE ENTRY
      ============================================================ */
   
   function enterSite(type) {
     document.body.classList.add('splash-closed');
     document.getElementById('landing-nav').style.opacity = '1';
     document.getElementById('landing-nav').style.visibility = 'visible';
   
     if (type === 'driver') {
       setTimeout(() => {
         window.location.href = 'driver.html';
       }, 1200);
     } else if (type === 'passenger') {
       setTimeout(() => {
         window.location.href = 'passenger.html';
       }, 1200);
     }
   }
   
   /* ============================================================
      LANDING PAGE - INTERACTION
      ============================================================ */
   
   function onFromChange() {
     const fromCity = document.getElementById('from-select').value;
     const toCity = document.getElementById('to-select').value;
     updateRoute(fromCity, toCity);
   }
   
   function onToChange() {
     const fromCity = document.getElementById('from-select').value;
     const toCity = document.getElementById('to-select').value;
     updateRoute(fromCity, toCity);
   }
   
   function updateRoute(fromCity, toCity) {
     if (!fromCity || !toCity) return;
   
     const line = document.getElementById('route-line');
     const fromDot = document.getElementById(`dot-${fromCity}`);
     const toDot = document.getElementById(`dot-${toCity}`);
   
     if (fromDot && toDot) {
       const x1 = fromDot.getAttribute('cx');
       const y1 = fromDot.getAttribute('cy');
       const x2 = toDot.getAttribute('cx');
       const y2 = toDot.getAttribute('cy');
   
       line.setAttribute('x1', x1);
       line.setAttribute('y1', y1);
       line.setAttribute('x2', x2);
       line.setAttribute('y2', y2);
       line.style.opacity = '0.6';
     }
   
     // Update regions
     document.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
     const fromRegion = document.getElementById(`reg-${fromCity}`);
     const toRegion = document.getElementById(`reg-${toCity}`);
     if (fromRegion) fromRegion.classList.add('active');
     if (toRegion) toRegion.classList.add('active');
   }
   
   function calculateFare() {
     const fromCity = document.getElementById('from-select').value;
     const toCity = document.getElementById('to-select').value;
     const passengers = parseFloat(document.getElementById('passengers').value);
     const luggage = parseFloat(document.getElementById('luggage').value);
     const timeMultiplier = parseFloat(document.getElementById('time-pref').value);
   
     if (!fromCity || !toCity) {
       showToast('⚠️', 'Xato', 'Ketish va borish joylarini tanlang');
       return;
     }
   
     const routeKey = `${fromCity}-${toCity}`;
     let distance = routeDistances[routeKey];
   
     if (!distance) {
       distance = Math.abs(Math.random() * 500 + 100);
     }
   
     const baseRate = 450;
     let fare = distance * baseRate * selectedVehicle * passengers * luggage * timeMultiplier;
     fare = Math.round(fare / 1000) * 1000;
   
     const resultBox = document.getElementById('result-box');
     document.getElementById('result-price-main').innerHTML = `${fare.toLocaleString('uz-UZ')} <span>SOM</span>`;
     document.getElementById('result-details-main').textContent = `${distance} km · ${passengers} kishi · Vaqti ${Math.round(distance / 80)} soat`;
     resultBox.style.display = 'block';
   }
   
   function selectVehicle(el) {
     document.querySelectorAll('.vehicle-card').forEach(card => {
       card.classList.remove('selected');
     });
     el.classList.add('selected');
     selectedVehicle = parseFloat(el.getAttribute('data-multiplier'));
   }
   
   function prefillRoute(from, to) {
     document.getElementById('from-select').value = from;
     document.getElementById('to-select').value = to;
     updateRoute(from, to);
     document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
   }
   
   function showTaxiPopup(city, event) {
     event.stopPropagation();
     const popup = document.getElementById('taxi-popup');
     const cityName = { tashkent: 'Toshkent', samarkand: 'Samarqand', bukhara: 'Buxoro', fergana: 'Farg\'ona', namangan: 'Namangan' }[city];
     
     document.getElementById('taxi-popup-city').textContent = '📍 ' + cityName + ' — Mahalliy taksiler';
     document.getElementById('taxi-popup-list').innerHTML = `
       <li onclick="showToast('🚕','Yandex.Go','Toshkent shahrida xizmat ko\'rsatadi')">🚕 Yandex.Go</li>
       <li onclick="showToast('🚕','Uber','Agar mavjud bo\'lsa, ochiladi')">🚕 Uber</li>
       <li onclick="showToast('🚕','Local Taxi','Shahar bo\'ylab xizmat')">🚕 Local Taxi Service</li>
     `;
     popup.classList.add('open');
   }
   
   function closeTaxiPopup() {
     document.getElementById('taxi-popup').classList.remove('open');
   }
   
   function setTodayDate() {
     const today = new Date().toISOString().split('T')[0];
     document.getElementById('travel-date').value = today;
   }
   
   /* ============================================================
      DRIVER PORTAL - AUTH SCREEN
      ============================================================ */
   
   function showAuthScreen() {
     document.getElementById('auth-screen').classList.add('active');
     generateStars('auth-stars');
   }
   
   function switchAuthTab(tab) {
     document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
     document.querySelectorAll('.auth-form-panel').forEach(p => p.classList.remove('active'));
   
     document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
     document.getElementById(`panel-${tab}`).classList.add('active');
   }
   
   function doLogin() {
     const phone = document.getElementById('login-phone').value;
     const pass = document.getElementById('login-pass').value;
   
     if (!phone || !pass) {
       document.getElementById('login-error').classList.add('show');
       return;
     }
   
     // Skip SMS verification - go directly to main app
     showToast('✅', 'Kirish muvaffaqiyatli', 'Dasturga xush kelibsiz...');
     setTimeout(showMainApp, 1000);
   }
   
   function doRegister() {
     const fname = document.getElementById('reg-fname').value;
     const lname = document.getElementById('reg-lname').value;
     const phone = document.getElementById('reg-phone').value;
     const pass = document.getElementById('reg-pass').value;
     const pass2 = document.getElementById('reg-pass2').value;
   
     if (!fname || !lname || !phone || !pass || !pass2) {
       document.getElementById('reg-error').classList.add('show');
       document.getElementById('reg-error').textContent = 'Barcha maydonlarni to\'ldiring';
       return;
     }
   
     if (pass !== pass2) {
       document.getElementById('reg-error').classList.add('show');
       document.getElementById('reg-error').textContent = 'Parollar mos kelmadi';
       return;
     }
   
     // Skip SMS verification - go directly to main app
     showToast('✅', 'Ro\'yxatdan o\'tish', 'Muvaffaqiyatli qo\'shildi. Dasturga xush kelibsiz...');
     setTimeout(showMainApp, 1500);
   }
   
   function showOtpPanel() {
     switchAuthTab('otp');
   }
   
   function otpMove(input, index) {
     const inputs = document.querySelectorAll('.otp-input');
     if (input.value && index < inputs.length) {
       inputs[index].focus();
     }
     const allFilled = Array.from(inputs).every(i => i.value);
     if (allFilled) {
       // Skip SMS verification - go directly to main app
       showMainApp();
     }
   }
   
   function showMainApp() {
     document.getElementById('auth-screen').classList.remove('active');
     document.getElementById('main-app').classList.add('active');
     generateStars('splash-stars'); // reuse for styling
     initializeApp();
   }
   
   function initializeApp() {
     renderTripsTable();
     renderNotifications();
     renderFAQ();
     generateWeeklyBars();
     generateBigBarChart();
     updateLiveTimer();
   }
   
   /* ============================================================
      DRIVER PORTAL - NAVIGATION
      ============================================================ */
   
   function navigate(page) {
     const pages = ['dashboard', 'trips', 'earnings', 'profile', 'vehicle', 'notifications', 'support'];
     
     pages.forEach(p => {
       document.getElementById(`page-${p}`).classList.remove('active');
       const navItem = document.getElementById(`nav-${p}`);
       if (navItem) navItem.classList.remove('active');
     });
   
     document.getElementById(`page-${page}`).classList.add('active');
     const navItem = document.getElementById(`nav-${page}`);
     if (navItem) navItem.classList.add('active');
   
     currentPage = page;
   
     // Update topbar
     const titles = {
       dashboard: 'Dashboard',
       trips: 'Sayohatlar',
       earnings: 'Daromad',
       profile: 'Mening profilim',
       vehicle: 'Mening avtomobilim',
       notifications: 'Bildirishnomalar',
       support: 'Yordam markazi'
     };
     document.getElementById('topbar-title').textContent = titles[page];
   }
   
   function toggleOnline() {
     isOnline = !isOnline;
     const badge = document.getElementById('online-badge');
     const statusLabel = document.getElementById('status-label');
     const topbarBtn = document.getElementById('topbar-status-btn');
   
     if (isOnline) {
       badge.classList.remove('offline');
       statusLabel.textContent = 'Onlayn';
       statusLabel.classList.remove('offline');
       topbarBtn.textContent = '● Onlayn';
       topbarBtn.style.background = 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)';
       document.getElementById('nav-trips').style.display = 'flex';
       document.getElementById('active-trip-badge').style.display = 'inline-block';
       showToast('✅', 'Onlayn holati', 'Buyurtmalar qabul qilinmoqda...');
     } else {
       badge.classList.add('offline');
       statusLabel.textContent = 'Oflayn';
       statusLabel.classList.add('offline');
       topbarBtn.textContent = '● Oflayn';
       topbarBtn.style.background = 'rgba(201, 168, 76, 0.15)';
       topbarBtn.style.color = 'rgba(201, 168, 76, 0.6)';
       document.getElementById('active-trip-badge').style.display = 'none';
       showToast('⏸️', 'Oflayn', 'Siz oflayn holatiga o\'ttingiz');
     }
   }
   
   /* ============================================================
      DRIVER PORTAL - DASHBOARD DATA
      ============================================================ */
   
   function generateWeeklyBars() {
     const data = [85, 72, 95, 81, 88, 92, 87];
     const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
     const html = data.map((v, i) => `<div class="bar" style="height:${v/100 * 35}px" title="${days[i]}: ${v}k"></div>`).join('');
     const elements = document.querySelectorAll('#weekly-bars');
     elements.forEach(el => el.innerHTML = html);
   }
   
   function generateBigBarChart() {
     const data = [45, 78, 62, 89, 75, 92, 88];
     const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
     const maxVal = Math.max(...data);
     const html = data.map((v, i) => `<div class="big-bar" style="height:${v/maxVal * 180}px" data-value="${v}k" title="${days[i]}: ${v}k"></div>`).join('');
     const labelsHtml = days.map(d => `<div class="chart-x-label">${d}</div>`).join('');
     
     const chartEl = document.getElementById('big-bar-chart');
     const labelsEl = document.getElementById('chart-x-labels');
     if (chartEl) chartEl.innerHTML = html;
     if (labelsEl) labelsEl.innerHTML = labelsHtml;
   }
   
   function setPeriod(period, btn) {
     document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
     btn.classList.add('active');
     generateBigBarChart();
   }
   
   function updateLiveTimer() {
     const startTime = new Date('2025-06-01 09:14:00');
     const liveTimer = document.getElementById('live-timer');
     
     function updateTimer() {
       const now = new Date();
       const diff = now - startTime;
       const hours = Math.floor(diff / 3600000);
       const minutes = Math.floor((diff % 3600000) / 60000);
       const seconds = Math.floor((diff % 60000) / 1000);
       
       if (liveTimer) {
         liveTimer.textContent = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
       }
     }
     
     updateTimer();
     setInterval(updateTimer, 1000);
   }
   
   function renderTripsTable() {
     const trips = [
       { id: 'KRV-001234', from: 'Tosh', to: 'Samar', km: 340, time: '3h 45m', fare: 153000, method: 'Naqd', rating: 5, status: 'completed' },
       { id: 'KRV-001233', from: 'Andijon', to: 'Namangan', km: 160, time: '2h 10m', fare: 72000, method: 'Karta', rating: 4, status: 'completed' },
       { id: 'KRV-001232', from: 'Buxoro', to: 'Samar', km: 270, time: '3h', fare: 121500, method: 'Naqd', rating: 5, status: 'completed' },
       { id: 'KRV-001231', from: 'Tosh', to: 'Buxoro', km: 560, time: '6h', fare: 252000, method: 'Karta', rating: 3, status: 'cancelled' },
       { id: 'KRV-001230', from: 'Fergana', to: 'Namangan', km: 140, time: '1h 50m', fare: 63000, method: 'Naqd', rating: 5, status: 'completed' },
     ];
   
     const tbody = document.getElementById('trips-tbody');
     if (!tbody) return;
   
     tbody.innerHTML = trips.map(trip => `
       <tr>
         <td><strong>${trip.id}</strong></td>
         <td>${trip.from} → ${trip.to}</td>
         <td>${trip.km} km</td>
         <td>${trip.time}</td>
         <td><strong>${trip.fare.toLocaleString('uz-UZ')} so'm</strong></td>
         <td>${trip.method}</td>
         <td>${'⭐'.repeat(trip.rating)}</td>
         <td><span class="trip-status-badge trip-status-${trip.status}">${trip.status === 'completed' ? 'Yakunlandi' : 'Bekor'}</span></td>
       </tr>
     `).join('');
   
     document.getElementById('trips-count-label').textContent = `Jami: ${trips.length} ta sayohat`;
   
     // Render recent trips on dashboard
     const recentTripsHtml = trips.slice(0, 3).map(trip => `
       <div class="trip-item">
         <div class="trip-route"><span class="trip-route-from">${trip.from}</span> → <span class="trip-route-to">${trip.to}</span></div>
         <div class="trip-meta">
           <span>${trip.km} km · ${trip.time}</span>
           <span class="trip-earning">${trip.fare.toLocaleString('uz-UZ')} so'm</span>
         </div>
       </div>
     `).join('');
   
     const recentTripsListEl = document.getElementById('recent-trips-list');
     if (recentTripsListEl) recentTripsListEl.innerHTML = recentTripsHtml;
   }
   
   function renderNotifications() {
     const notifs = [
       { icon: '🎉', title: 'Bonus tikildi!', text: 'Toshkent-Samarqand yo\'nalishida +20% bonus qo\'shildi', time: '2 soat oldin', unread: true },
       { icon: '⭐', title: '5 yulduzli baho', text: 'Sayohatingiz uchun 5 yulduzli baho qabul qildik', time: '4 soat oldin' },
       { icon: '💰', title: 'To\'lov qabul qilindi', text: '45,000 so\'m to\'lov hisobingizga o\'tkazildi', time: '1 kun oldin' },
       { icon: '🔔', title: 'Texnik ko\'rik', text: 'Avtomobilingizning texnik ko\'rigi kerak', time: '3 kun oldin' },
     ];
   
     const notifList = document.getElementById('notif-list');
     if (!notifList) return;
   
     notifList.innerHTML = notifs.map((n, i) => `
       <div class="notif-item ${n.unread ? 'unread' : ''}">
         <div class="notif-header">
           <div class="notif-title">${n.icon} ${n.title}</div>
           <div class="notif-time">${n.time}</div>
         </div>
         <div class="notif-text">${n.text}</div>
       </div>
     `).join('');
   
     const count = notifs.filter(n => n.unread).length;
     const notifCountEl = document.getElementById('notif-count');
     if (notifCountEl) notifCountEl.textContent = count;
   }
   
   function renderFAQ() {
     const faqs = [
       { q: 'Kunlik maqsad nima?', a: 'Kunlik maqsad – bu siz o\'sha kun davomida yetishasiz deb rejalashtirgan daromad miqdori. Maqsadga yetganingizdan keyin boshqa ishlash ixtiyoriy.' },
       { q: 'Bonus qanday ishlaydi?', a: 'Bonus ma\'lum vaqt yoki yo\'nalishda qo\'shimcha foiz. Bonus vaqti belgilangan bo\'lsa, shu vaqtda sayohat qilganingizda avtomatik qo\'shiladi.' },
       { q: 'Pul qachon beriladi?', a: 'Pul har 15-sanasida hisabingizga o\'tkaziladi. To\'lov usuli (Click, Payme, Bank) profilingizda belgilang.' },
       { q: 'Reyting nima?', a: 'Yo\'lovchilar sizni 1 dan 5 yulduzgacha bahorlaydi. Reyting siz haydovchilik sifatingizni ko\'rsatadi. Yuqori reyting – ko\'p buyurtma.' },
     ];
   
     const faqList = document.getElementById('faq-list');
     if (!faqList) return;
   
     faqList.innerHTML = faqs.map((faq, i) => `
       <div class="faq-item">
         <div class="faq-question" onclick="toggleFAQ(this)">
           ${faq.q}
           <span class="faq-toggle">▼</span>
         </div>
         <div class="faq-answer">
           ${faq.a}
         </div>
       </div>
     `).join('');
   }
   
   function toggleFAQ(el) {
     el.classList.toggle('open');
     el.nextElementSibling.classList.toggle('open');
   }
   
   function filterTrips(filter, btn) {
     document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
     btn.classList.add('active');
   }
   
   function markAllRead() {
     document.querySelectorAll('.notif-item').forEach(n => n.classList.remove('unread'));
     showToast('✅', 'Barcha o\'qilgan', 'Bildirishnomalar o\'qilgan deb belgilandi');
   }
   
   /* ============================================================
      RIDE REQUEST POPUP
      ============================================================ */
   
   function showRideRequest() {
     if (!isOnline) {
       showToast('⚠️', 'Oflayn', 'Avval onlayn holati yoqing');
       return;
     }
     const overlay = document.getElementById('ride-request-overlay');
     overlay.classList.add('active');
     startRequestCountdown();
   }
   
   function startRequestCountdown() {
     let time = 15;
     const timer = document.getElementById('request-timer');
     const interval = setInterval(() => {
       time--;
       if (timer) timer.textContent = time;
       if (time <= 0) {
         clearInterval(interval);
         declineRide();
       }
     }, 1000);
   }
   
   function acceptRide() {
     const overlay = document.getElementById('ride-request-overlay');
     overlay.classList.remove('active');
     showToast('✅', 'Buyurtma qabul qilindi', 'Yo\'lovchi bilan bog\'lanish o\'rnatilmoqda...');
     document.getElementById('active-trip-badge').style.display = 'inline-block';
   }
   
   function declineRide() {
     const overlay = document.getElementById('ride-request-overlay');
     overlay.classList.remove('active');
     showToast('⚠️', 'Rad etildi', 'Buyurtma rad etildi. Keyingi buyurtmani kutib oling');
   }
   
   /* ============================================================
      MODALS & FORMS
      ============================================================ */
   
   function showToast(icon, title, message) {
     const container = document.getElementById('toast-container');
     const toast = document.createElement('div');
     toast.className = 'toast';
     toast.innerHTML = `
       <div class="toast-icon">${icon}</div>
       <div class="toast-title">${title}</div>
       <div class="toast-message">${message}</div>
     `;
     container.appendChild(toast);
   
     setTimeout(() => {
       toast.classList.add('exit');
       setTimeout(() => toast.remove(), 300);
     }, 3000);
   }
   
   function showLogoutModal() {
     const modal = document.getElementById('modal-overlay');
     const modalTitle = document.getElementById('modal-title');
     const modalBody = document.getElementById('modal-body');
     const modalActions = document.getElementById('modal-actions');
   
     modalTitle.textContent = 'Chiqish';
     modalBody.innerHTML = `Siz haqiqatan ham chiqmoqchimisiz? Bu sessiyani tugatadi.`;
     modalActions.innerHTML = `
       <button class="modal-action-btn secondary" onclick="closeModal()">Bekor qilish</button>
       <button class="modal-action-btn primary" onclick="doLogout()">Ha, chiqaman</button>
     `;
   
     modal.classList.add('active');
   }
   
   function doLogout() {
     showToast('👋', 'Xayr', 'Siz chiqtingiz. Qayta ko\'ring!');
     closeModal();
     setTimeout(() => {
       location.reload();
     }, 1500);
   }
   
   function closeModal() {
     document.getElementById('modal-overlay').classList.remove('active');
   }
   
   function showWithdrawModal() {
     const modal = document.getElementById('modal-overlay');
     const modalTitle = document.getElementById('modal-title');
     const modalBody = document.getElementById('modal-body');
     const modalActions = document.getElementById('modal-actions');
   
     modalTitle.textContent = 'Pul yechish';
     modalBody.innerHTML = `
       <div style="margin-bottom: 1rem;">
         <p style="margin-bottom: 0.5rem;"><strong>Summa:</strong> 2,340,000 so'm</p>
         <p style="margin-bottom: 0.5rem;"><strong>Usuli:</strong> Click (Boshlang'ich)</p>
         <p style="font-size: 0.9rem; color: rgba(245, 237, 214, 0.5);">Pul 1-2 kun ichida qabul qilinadi.</p>
       </div>
     `;
     modalActions.innerHTML = `
       <button class="modal-action-btn secondary" onclick="closeModal()">Bekor qilish</button>
       <button class="modal-action-btn primary" onclick="processWithdraw()">Tasdiqlayman</button>
     `;
   
     modal.classList.add('active');
   }
   
   function processWithdraw() {
     showToast('✅', 'Pul yechish so\'rovi', 'Raqam: WD-00847. 1-2 kun ichida qabul qilinadi');
     closeModal();
   }
   
   function showChangePassModal() {
     const modal = document.getElementById('modal-overlay');
     const modalTitle = document.getElementById('modal-title');
     const modalBody = document.getElementById('modal-body');
     const modalActions = document.getElementById('modal-actions');
   
     modalTitle.textContent = 'Parolni o\'zgartirish';
     modalBody.innerHTML = `
       <div class="field-group" style="margin-bottom: 1rem;">
         <label class="field-label">Eski parol</label>
         <input class="field-input" type="password" placeholder="••••••••">
       </div>
       <div class="field-group" style="margin-bottom: 1rem;">
         <label class="field-label">Yangi parol</label>
         <input class="field-input" type="password" placeholder="Kamida 8 belgi">
       </div>
       <div class="field-group">
         <label class="field-label">Parolni tasdiqlang</label>
         <input class="field-input" type="password" placeholder="••••••••">
       </div>
     `;
     modalActions.innerHTML = `
       <button class="modal-action-btn secondary" onclick="closeModal()">Bekor qilish</button>
       <button class="modal-action-btn primary" onclick="savePassword()">Saqlash</button>
     `;
   
     modal.classList.add('active');
   }
   
   function savePassword() {
     showToast('✅', 'Parol o\'zgartirildi', 'Yangi parol saqlandi');
     closeModal();
   }
   
   function saveProfile() {
     showToast('✅', 'Profil', 'Ma\'lumotlar muvaffaqiyatli saqlandi');
   }
   
   function uploadDoc(el, docType) {
     showToast('📤', 'Hujjat yuklash', 'Tanlagan faylingiz tasdiqlanmoqda...');
   }
   
   /* ============================================================
      UTILITIES & HELPERS
      ============================================================ */
   
   function generateStars(containerId) {
     const container = document.getElementById(containerId);
     if (!container) return;
     
     container.innerHTML = '';
     for (let i = 0; i < 40; i++) {
       const star = document.createElement('div');
       star.style.position = 'absolute';
       star.style.width = Math.random() * 2 + 'px';
       star.style.height = star.style.width;
       star.style.background = 'rgba(201, 168, 76, ' + (Math.random() * 0.4 + 0.1) + ')';
       star.style.borderRadius = '50%';
       star.style.left = Math.random() * 100 + '%';
       star.style.top = Math.random() * 100 + '%';
       star.style.boxShadow = '0 0 ' + Math.random() * 3 + 'px rgba(201, 168, 76, 0.5)';
       star.style.animation = `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`;
       container.appendChild(star);
     }
   }
   
   /* ============================================================
      EVENT LISTENERS
      ============================================================ */
   
   document.addEventListener('click', (e) => {
     if (e.target.classList.contains('region')) {
       const cityValue = e.target.getAttribute('data-city');
       if (document.getElementById('from-select').value === '') {
         document.getElementById('from-select').value = cityValue;
         onFromChange();
       } else if (document.getElementById('to-select').value === '') {
         document.getElementById('to-select').value = cityValue;
         onToChange();
       }
     }
   });
   
   // Close modals on overlay click
   document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
     if (e.target === e.currentTarget) closeModal();
   });
   
   // Language changes update immediately
   document.addEventListener('change', () => {
     updateLanguage();
   });
   