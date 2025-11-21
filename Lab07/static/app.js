//whatever the api name is
const API_BASE = '/api';
const $ = (id) => document.getElementById(id);
const setStatus = (el, msg, type = 'muted') => { el.className = `status ${type}`; el.textContent = msg; };
const encodeName = (name) => encodeURIComponent(name.trim());
const parseGrade = (val) => {
    if (val == null) return NaN;
    const n = typeof val === 'number' ? val : parseFloat(String(val));
    return Number.isFinite(n) ? n : NaN;
};

// Robustly parse different possible server shapes
const extractOne = (json, nameInput) => {
    if (json && typeof json === 'object' && 'grade' in json && typeof json.grade !== 'undefined') {
        return { name: nameInput, grade: parseGrade(json.grade) };
    }
    if (json && typeof json === 'object' && Object.keys(json).length === 1) {
        const k = Object.keys(json)[0];
        return { name: k, grade: parseGrade(json[k]) };
    }
    if (typeof json === 'number') {
        return { name: nameInput, grade: json };
    }
    return null;
};

const toTableRows = (obj) => {
    if (!obj || typeof obj !== 'object') return '';
    const names = Object.keys(obj).sort((a,b) => a.localeCompare(b));
    return names.map(n => {
        const g = parseGrade(obj[n]);
        const gradeText = Number.isFinite(g) ? g.toFixed(1) : '-';
        return `<tr><td>${escapeHtml(n)}</td><td class="num">${gradeText}</td></tr>`;
    }).join('');
};

//turns them into string stop abuse like sql injection
function escapeHtml(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/* api calls */
async function getAll() {
    const res = await fetch(`${API_BASE}/grades`);
    if (!res.ok) throw new Error(`GET /grades failed (${res.status})`);
    return res.json();
}

async function getOne(name) {
    const res = await fetch(`${API_BASE}/grades/${encodeName(name)}`);
    if (!res.ok) throw new Error(`GET /grades/${name} failed (${res.status})`);
    return res.json();
}

async function createOne(name, grade) {
    const res = await fetch(`${API_BASE}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), grade })
    });
    if (!res.ok) throw new Error(`POST /grades failed (${res.status})`);
    return res.json();
}

async function updateOne(name, grade) {
    const res = await fetch(`${API_BASE}/grades/${encodeName(name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade })
    });
    if (!res.ok) throw new Error(`PUT /grades/${name} failed (${res.status})`);
    return res.json();
}

async function deleteOne(name) {
    const res = await fetch(`${API_BASE}/grades/${encodeName(name)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE /grades/${name} failed (${res.status})`);
    return res.json();
}

const leftStatus = $('leftStatus');
const rightStatus = $('rightStatus');
const tbody = $('tableBody');

async function refreshTable() {
    setStatus(rightStatus, 'Loading grades...');
    try {
        const data = await getAll();
        const rows = toTableRows(data);
        tbody.innerHTML = rows || '<tr><td colspan="2" class="muted">No data found.</td></tr>';
        setStatus(rightStatus, 'Loaded.', 'ok');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="2">Unable to load grades.</td></tr>';
        setStatus(rightStatus, e.message, 'err');
    }
}

async function onFind() {
    const name = $('searchName').value.trim();
    if (!name) { setStatus(leftStatus, 'Please enter a name to search.', 'warn'); return; }
    setStatus(leftStatus, `Searching for "${name}"...`);
    try {
        const json = await getOne(name);
        const result = extractOne(json, name);
        if (!result) { setStatus(leftStatus, 'Unexpected server response.', 'err'); return; }
        // Render a one-row table for the result at the top of the main table
        const row = `<tr><td>${escapeHtml(result.name)}</td><td class="num">${Number.isFinite(result.grade) ? result.grade.toFixed(1) : '-'}</td></tr>`;
        tbody.innerHTML = row + tbody.innerHTML;
        setStatus(leftStatus, `Found ${result.name}.`, 'ok');
    } catch (e) {
        setStatus(leftStatus, e.message, 'err');
    }
}

async function onCreate() {
    const name = $('newName').value.trim();
    const grade = parseGrade($('newGrade').value);
    if (!name) { setStatus(leftStatus, 'Enter a name to create.', 'warn'); return; }
    if (!Number.isFinite(grade)) { setStatus(leftStatus, 'Enter a numeric grade.', 'warn'); return; }
    setStatus(leftStatus, `Creating "${name}"..`);
    try {
        await createOne(name, grade);
        setStatus(leftStatus, `Created ${name}.`, 'ok');
        $('newName').value = '';
        $('newGrade').value = '';
        await refreshTable();
    } catch (e) { setStatus(leftStatus, e.message, 'err'); }
}

async function onEdit() {
    const name = $('editName').value.trim();
    const grade = parseGrade($('editGrade').value);
    if (!name) { setStatus(leftStatus, 'Enter a name to update.', 'warn'); return; }
    if (!Number.isFinite(grade)) { setStatus(leftStatus, 'Enter a numeric grade.', 'warn'); return; }
    setStatus(leftStatus, `Updating "${name}"...`);
    try {
        await updateOne(name, grade);
        setStatus(leftStatus, `Updated ${name}.`, 'ok');
        $('editGrade').value = '';
        await refreshTable();
    } catch (e) { setStatus(leftStatus, e.message, 'err'); }
}

async function onDelete() {
    const name = $('deleteName').value.trim();
    if (!name) { setStatus(leftStatus, 'Enter a name to delete.', 'warn'); return; }
    if (!confirm(`Delete ${name}? This affects the shared backend.`)) return;
    setStatus(leftStatus, `Deleting "${name}"...`);
    try {
        await deleteOne(name);
        setStatus(leftStatus, `Deleted ${name}.`, 'ok');
        $('deleteName').value = '';
        await refreshTable();
    } catch (e) { setStatus(leftStatus, e.message, 'err'); }
}

document.addEventListener('DOMContentLoaded', () => {
    
    $('btnRefresh').addEventListener('click', refreshTable);
    $('btnLoadDemo').addEventListener('click', () => {
        tbody.innerHTML = '<tr><td colspan="2" class="muted">Table cleared. Click Refresh to load data again.</td></tr>';
        setStatus(rightStatus, '');
    });
    $('btnFind').addEventListener('click', onFind);
    $('btnCreate').addEventListener('click', onCreate);
    $('btnEdit').addEventListener('click', onEdit);
    $('btnDelete').addEventListener('click', onDelete);
});
