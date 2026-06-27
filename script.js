// 체크 그룹 데이터
const checkData = {
  q2: { multi: false, items: ['iPhone (iOS)', '안드로이드'] },
  q3: { multi: false, items: ['혼자 살아요 (자취/1인)', '부모님과 함께', '배우자/파트너와 함께', '배우자+자녀와 함께', '룸메이트와 함께'] },
  q4: { multi: false, items: ['거의 매일', '주 2~3회', '월 2~3회', '월 1회', '분기 1~2회', '거의 안 써요'] },
  q5: { multi: true,  items: ['중고거래', '동네생활', '동네지도', '알바', '부동산', '기타'] },
  q6: { multi: false, items: ['네, 가입했어요', '아니요 / 이름만 들어봤어요'] },
  q7: { multi: false, items: ['여러 번 있어요', '한두 번 있어요', '없어요'] },
  q8: { multi: false, items: ['CU 등 브랜드 이벤트', '중고거래 정산', '혜택 안내 보고', '지인 추천', '기억 안 남', '기타'] },
  q9: { multi: true,  items: ['카카오페이', '네이버페이', '삼성/애플페이', '토스', '카드만 거의 써요', '기타'] },
  'qb-ask':     { multi: false, items: ['네, 물어봤어요', '아니요, 그냥 결제했어요'] },
  'qb-sticker': { multi: false, items: ['스티커/안내물 있었어요', '없었어요', '못 봤어요'] },
  c1: { multi: false, items: ['됩니다', '안 돼요', '못 찾음'] },
  c2: { multi: false, items: ['됩니다', '안 돼요', '못 찾음'] },
  c3: { multi: false, items: ['됩니다', '안 돼요', '못 찾음'] },
};

Object.entries(checkData).forEach(([id, cfg]) => {
  const el = document.getElementById(id);
  if (!el) return;
  cfg.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'check-item';
    div.textContent = item;
    div.addEventListener('click', () => {
      if (cfg.multi) {
        div.classList.toggle('selected');
      } else {
        el.querySelectorAll('.check-item').forEach(d => d.classList.remove('selected'));
        div.classList.add('selected');
      }
    });
    el.appendChild(div);
  });
});

// Q9 기타 클릭 시 입력창 표시
const q9El = document.getElementById('q9');
if (q9El) {
  q9El.addEventListener('click', function(e) {
    if (e.target.classList.contains('check-item') && e.target.textContent.trim() === '기타') {
      document.getElementById('q9-etc-input').style.display =
        e.target.classList.contains('selected') ? 'block' : 'none';
    }
  });
}

// 아코디언
function toggleAccordion(btn) {
  const body = btn.nextElementSibling;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('open', !isOpen);
}

// 상황 B 아코디언 내 네/아니요
const navYnEl = document.getElementById('nav-yn');
if (navYnEl) {
  ['네', '아니요'].forEach(label => {
    const div = document.createElement('div');
    div.className = 'check-item';
    div.textContent = label;
    div.addEventListener('click', () => {
      navYnEl.querySelectorAll('.check-item').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
      document.getElementById('nav-yes-content').style.display = label === '네' ? 'block' : 'none';
      document.getElementById('nav-no-content').style.display = label === '아니요' ? 'block' : 'none';
    });
    navYnEl.appendChild(div);
  });
}

// 상황 C 결제 방식 (실패함 조건부 입력)
const payMethodEl = document.getElementById('qc-pay-method');
if (payMethodEl) {
  ['페이히어 POS', '정체 모를 POS', '가맹점주가 QR 찍어줌', '실패함'].forEach(label => {
    const div = document.createElement('div');
    div.className = 'check-item';
    div.textContent = label;
    div.addEventListener('click', () => {
      payMethodEl.querySelectorAll('.check-item').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
      document.getElementById('pay-fail-input').style.display = label === '실패함' ? 'block' : 'none';
    });
    payMethodEl.appendChild(div);
  });
}

function savePrint() {
  document.getElementById('save-msg').style.display = 'block';
  setTimeout(() => window.print(), 300);
}

// ── 데이터 수집 ──────────────────────────────────────
function collectFormData() {
  const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const chk = id => {
    const el = document.getElementById(id);
    if (!el) return '';
    return Array.from(el.querySelectorAll('.check-item.selected')).map(d => d.textContent.trim()).join(', ');
  };
  const chkArr = id => {
    const el = document.getElementById(id);
    if (!el) return [];
    return Array.from(el.querySelectorAll('.check-item.selected')).map(d => d.textContent.trim());
  };
  const navAnswer = chk('nav-yn');
  return {
    meta: { timestamp: new Date().toISOString(), submitter: val('submitter-name') },
    'STEP0': {
      'Q1 동네': val('q1'),
      'Q2 폰': chk('q2'),
      'Q3 주거': chk('q3'),
      'Q4 당근 빈도': chk('q4'),
      'Q5 당근 기능': chkArr('q5'),
      'Q6 당근페이 가입': chk('q6'),
      'Q7 현장결제 경험': chk('q7'),
      'Q8 첫 계기': chk('q8'),
      'Q9 간편결제': (() => { const arr = chkArr('q9'); const etc = val('q9-etc'); return arr.includes('기타') && etc ? arr.map(v => v === '기타' ? `기타(${etc})` : v) : arr; })(),
    },
    '상황A': {
      '결제화면 경로': val('a1'),
      '막혔던 지점': val('a2'),
    },
    '상황B': {
      '단골 기준': val('b-criteria'),
      '단골1 이름': val('b-shop1'), '단골1 결과': chk('c1'),
      '단골2 이름': val('b-shop2'), '단골2 결과': chk('c2'),
      '단골3 이름': val('b-shop3'), '단골3 결과': chk('c3'),
      '예상 vs 실제': val('b-expectation'),
      '결제 습관 변화': val('b-habit'),
      '내비게이션 답변': navAnswer,
      '가맹점 찾기 과정': navAnswer === '네' ? val('nav-yes-q1') : val('nav-no-q1'),
      '문제 느낀 부분': navAnswer === '네' ? val('nav-yes-q2') : val('nav-no-q2'),
    },
    '상황C': {
      '가게명': val('c-store-name'),
      '지역': val('c-store-location'),
      '결제 방식': chk('qc-pay-method'),
      '실패 이유': val('c-pay-fail'),
      '점원에게 물어봤나요': chk('qb-ask'),
      '점원 대화': val('c-staff'),
      '스티커 유무': chk('qb-sticker'),
      '스티커 상세': val('c-sticker-detail'),
      '어려웠던 순간': val('c-difficult'),
      '타 페이 비교': val('c-comparison'),
    },
    'STEP2': {
      '가장 막힌 지점': val('s2-biggest'),
      '더 심각한 문제': val('s2-priority'),
      '딱 하나 고친다면': val('s2-fix'),
      '전략 공격 포인트': val('s2-attack'),
      '빨리 퍼질 골목': val('s2-alley'),
      '자유 의견': val('s2-free'),
    }
  };
}

// ── 임시저장 ──────────────────────────────────────────
let _debounceTimer = null;

function saveTemp(silent) {
  const data = collectFormData();
  const now = new Date();
  data._savedAt = now.toISOString();
  localStorage.setItem('ut-draft', JSON.stringify(data));
  updateLastSavedLabel(now);
  if (!silent) {
    if (GAS_URL && data.meta.submitter) {
      fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(buildSheetsPayload(data, '임시저장')),
      }).then(r => r.json()).then(j => {
        showToast(j.ok ? '💾 임시저장 완료! (다른 기기에서도 불러올 수 있어요)' : '💾 임시저장 완료 (로컬)');
      }).catch(() => showToast('임시저장 완료! 💾'));
    } else if (!data.meta.submitter) {
      showToast('💾 로컬 저장됨 (이름 입력 시 서버에도 저장돼요)');
    } else {
      showToast('임시저장 완료! 💾');
    }
  }
}

function scheduleAutoSave() {
  clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(() => saveTemp(true), 3000);
}

function updateLastSavedLabel(date) {
  const wrap = document.getElementById('last-saved-label');
  const span = document.getElementById('last-saved-time');
  if (!wrap || !span) return;
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  span.textContent = `${h}시 ${m}분`;
  wrap.style.display = 'block';
}

function showToast(msg) {
  const t = document.getElementById('float-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// 드래프트 존재 여부 확인 → 배너 표시
function checkDraft() {
  const raw = localStorage.getItem('ut-draft');
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    document.getElementById('draft-banner').style.display = 'flex';
    if (d._savedAt) updateLastSavedLabel(new Date(d._savedAt));
  } catch(e) {}
}

// 배너 "불러오기"
function applyDraft() {
  document.getElementById('draft-banner').style.display = 'none';
  restoreFromDraft();
}

// 배너 "새로 시작"
function startFresh() {
  document.getElementById('draft-banner').style.display = 'none';
  localStorage.removeItem('ut-draft');
  localStorage.removeItem('ut-notion-page-id');
  document.querySelectorAll('textarea, input[type=text]').forEach(el => el.value = '');
  document.querySelectorAll('.check-item.selected').forEach(el => el.classList.remove('selected'));
  document.getElementById('nav-yes-content').style.display = 'none';
  document.getElementById('nav-no-content').style.display = 'none';
  document.getElementById('pay-fail-input').style.display = 'none';
  document.getElementById('last-saved-label').style.display = 'none';
}

// 실제 복원 로직
function restoreFromDraft() {
  const raw = localStorage.getItem('ut-draft');
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    const setVal = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };
    const setChk = (cid, val) => {
      if (!val) return;
      const el = document.getElementById(cid);
      if (!el) return;
      const arr = Array.isArray(val) ? val : val.split(', ');
      el.querySelectorAll('.check-item').forEach(item => {
        if (arr.includes(item.textContent.trim())) item.classList.add('selected');
      });
    };
    setVal('submitter-name', d.meta?.submitter);
    const s0 = d['STEP0'] || {};
    setVal('q1', s0['Q1 동네']);
    setChk('q2', s0['Q2 폰']); setChk('q3', s0['Q3 주거']);
    setChk('q4', s0['Q4 당근 빈도']); setChk('q5', s0['Q5 당근 기능']);
    setChk('q6', s0['Q6 당근페이 가입']); setChk('q7', s0['Q7 현장결제 경험']);
    setChk('q8', s0['Q8 첫 계기']);
    // Q9 기타(XX) 형태 처리
    const q9raw = s0['Q9 간편결제'] || [];
    const q9arr = Array.isArray(q9raw) ? q9raw : q9raw.split(', ');
    const q9Etc = q9arr.find(v => v.startsWith('기타('));
    const q9Normalized = q9arr.map(v => v.startsWith('기타(') ? '기타' : v);
    setChk('q9', q9Normalized);
    if (q9Etc) {
      const etcText = q9Etc.replace(/^기타\(/, '').replace(/\)$/, '');
      const etcInput = document.getElementById('q9-etc');
      if (etcInput) etcInput.value = etcText;
      document.getElementById('q9-etc-input').style.display = 'block';
    }
    const sA = d['상황A'] || {};
    setVal('a1', sA['결제화면 경로']); setVal('a2', sA['막혔던 지점']);
    const sB = d['상황B'] || {};
    setVal('b-criteria', sB['단골 기준']);
    setVal('b-shop1', sB['단골1 이름']); setChk('c1', sB['단골1 결과']);
    setVal('b-shop2', sB['단골2 이름']); setChk('c2', sB['단골2 결과']);
    setVal('b-shop3', sB['단골3 이름']); setChk('c3', sB['단골3 결과']);
    setVal('b-expectation', sB['예상 vs 실제']); setVal('b-habit', sB['결제 습관 변화']);
    setChk('nav-yn', sB['내비게이션 답변']);
    setVal('nav-yes-q1', sB['가맹점 찾기 과정']); setVal('nav-yes-q2', sB['문제 느낀 부분']);
    setVal('nav-no-q1', sB['가맹점 찾기 과정']);  setVal('nav-no-q2', sB['문제 느낀 부분']);
    const sC = d['상황C'] || {};
    setVal('c-store-name', sC['가게명']); setVal('c-store-location', sC['지역']);
    setChk('qc-pay-method', sC['결제 방식']); setVal('c-pay-fail', sC['실패 이유']);
    setChk('qb-ask', sC['점원에게 물어봤나요']); setVal('c-staff', sC['점원 대화']);
    setChk('qb-sticker', sC['스티커 유무']); setVal('c-sticker-detail', sC['스티커 상세']);
    setVal('c-difficult', sC['어려웠던 순간']); setVal('c-comparison', sC['타 페이 비교']);
    const s2 = d['STEP2'] || {};
    setVal('s2-biggest', s2['가장 막힌 지점']); setVal('s2-priority', s2['더 심각한 문제']);
    setVal('s2-fix', s2['딱 하나 고친다면']); setVal('s2-attack', s2['전략 공격 포인트']);
    setVal('s2-alley', s2['빨리 퍼질 골목']); setVal('s2-free', s2['자유 의견']);
    if (sB['내비게이션 답변'] === '네') {
      document.getElementById('nav-yes-content').style.display = 'block';
    } else if (sB['내비게이션 답변'] === '아니요') {
      document.getElementById('nav-no-content').style.display = 'block';
    }
    if (sC['결제 방식'] === '실패함') {
      document.getElementById('pay-fail-input').style.display = 'block';
    }
    if (d._savedAt) updateLastSavedLabel(new Date(d._savedAt));
    showToast('임시저장 내용을 불러왔어요 👋');
  } catch(e) {}
}

// ── Google Sheets 설정 ─────────────────────────────────
// 아래 URL에 Apps Script 웹 앱 URL을 붙여넣으세요.
// 설정 방법:
//   1. Google Sheets 새 문서 열기
//   2. 확장 프로그램 > Apps Script > 아래 코드 붙여넣기:
//
//   function doPost(e) {
//     var data = JSON.parse(e.postData.contents);
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//     if (sheet.getLastRow() === 0) sheet.appendRow(Object.keys(data));
//     sheet.appendRow(Object.keys(data).map(function(k){ return Array.isArray(data[k]) ? data[k].join(', ') : (data[k] || ''); }));
//     return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
//   }
//
//   3. 배포 > 새 배포 > 웹 앱
//      실행 계정: 나 / 액세스: 모든 사용자
//   4. 아래 GAS_URL에 발급된 URL 붙여넣기

const GAS_URL = 'https://script.google.com/macros/s/AKfycbweTlenQ4XombYF-Y_21o0BLpKfWiOQNzf37ZUhxGMDhIhR4EuyH_3U7MMsJVlHxa0/exec';

// 시트 전송용 flat 구조 생성
function buildSheetsPayload(data, status) {
  const flat = {};
  flat['Status'] = status;
  flat['제출시각'] = new Date().toLocaleString('ko-KR');
  flat['제출자'] = data.meta?.submitter || '';
  flat['_rawjson'] = JSON.stringify(data);
  const sections = ['STEP0', '상황A', '상황B', '상황C', 'STEP2'];
  sections.forEach(sec => {
    if (!data[sec]) return;
    Object.entries(data[sec]).forEach(([k, v]) => {
      flat[k] = Array.isArray(v) ? v.join(', ') : (v || '');
    });
  });
  return flat;
}

function setSubmitMsg(text, isError) {
  const msg = document.getElementById('submit-msg');
  msg.style.display = 'block';
  msg.style.color = isError ? '#e53' : '#2E7D4F';
  msg.textContent = text;
}

// ── 제출 → Google Sheets POST ─────────────────────────
async function submitForm() {
  const data = collectFormData();
  if (!data.meta.submitter) {
    alert('이름(닉네임)을 입력해주세요!');
    document.getElementById('submitter-name').focus();
    return;
  }

  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = '전송 중...';

  if (!GAS_URL) {
    setSubmitMsg('❌ GAS URL이 설정되지 않았어요. 개발자에게 문의해주세요.', true);
    btn.disabled = false;
    btn.textContent = '🚀 응답 제출하기';
    return;
  }

  try {
    const payload = buildSheetsPayload(data, '최종제출');
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (json.ok || res.ok) {
      setSubmitMsg('✅ 저장됐어요! 고마워요 :)', false);
      localStorage.removeItem('ut-draft');
      document.getElementById('last-saved-label').style.display = 'none';
    } else {
      throw new Error('서버 응답 오류');
    }
  } catch (err) {
    setSubmitMsg('❌ 저장 실패. 다시 눌러주세요', true);
  } finally {
    btn.disabled = false;
    btn.textContent = '🚀 응답 제출하기';
  }
}

// ── 자동 임시저장 (input/textarea 변경 시 debounce 3초) ──
document.querySelectorAll('textarea, input[type=text]').forEach(el => {
  el.addEventListener('input', scheduleAutoSave);
});
document.addEventListener('click', e => {
  if (e.target.classList.contains('check-item')) scheduleAutoSave();
});

// ── 다른 기기에서 임시저장 불러오기 ──────────────────
async function fetchServerDraft(name) {
  if (!GAS_URL || !name) return null;
  try {
    const res = await fetch(GAS_URL + '?name=' + encodeURIComponent(name));
    const json = await res.json().catch(() => ({}));
    if (json.ok && json.rawjson) return JSON.parse(json.rawjson);
  } catch {}
  return null;
}

let _serverDraft = null;

async function fetchAndShowDraft() {
  const name = document.getElementById('submitter-name').value.trim();
  const msg = document.getElementById('fetch-draft-msg');
  if (!name) {
    msg.style.display = 'block';
    msg.textContent = '닉네임을 먼저 입력해주세요.';
    return;
  }
  msg.style.display = 'block';
  msg.textContent = '확인 중...';

  // 1순위: 서버 조회
  const serverDraft = await fetchServerDraft(name);
  if (serverDraft) {
    msg.style.display = 'none';
    _serverDraft = serverDraft;
    const savedAt = serverDraft._savedAt ? new Date(serverDraft._savedAt).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    document.getElementById('draft-modal-desc').textContent = savedAt ? `${savedAt}에 저장한 내용이 있어요.` : '이전에 저장한 내용이 있어요.';
    document.getElementById('draft-modal').style.display = 'flex';
    return;
  }

  // 2순위: 이 기기 로컬 체크 (같은 닉네임인 경우만)
  const localRaw = localStorage.getItem('ut-draft');
  if (localRaw) {
    try {
      const localDraft = JSON.parse(localRaw);
      if (localDraft.meta?.submitter === name) {
        msg.style.display = 'none';
        _serverDraft = localDraft;
        const savedAt = localDraft._savedAt ? new Date(localDraft._savedAt).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
        document.getElementById('draft-modal-desc').textContent = savedAt ? `${savedAt}에 이 기기에서 저장한 내용이 있어요.` : '이 기기에 저장된 내용이 있어요.';
        document.getElementById('draft-modal').style.display = 'flex';
        return;
      }
    } catch {}
  }

  msg.textContent = '저장된 내용이 없어요.';
}

function applyServerDraft() {
  if (!_serverDraft) return;
  localStorage.setItem('ut-draft', JSON.stringify(_serverDraft));
  closeDraftModal();
  document.getElementById('draft-banner').style.display = 'none';
  restoreFromDraft();
  if (_serverDraft._savedAt) updateLastSavedLabel(new Date(_serverDraft._savedAt));
}

function closeDraftModal() {
  document.getElementById('draft-modal').style.display = 'none';
  _serverDraft = null;
}

// 페이지 로드 시 자동 배너 없음 - 이름 기반 이어하기 버튼으로 통일
