const KEY='studyflow_tasks_v1';
let tasks=JSON.parse(localStorage.getItem(KEY)||'[]'),filter='all',editing=null;
const $=id=>document.getElementById(id),today=()=>{let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};

function persist(){
    localStorage.setItem(KEY, JSON.stringify(tasks));
    render();
    updateTaskChart();
    updateSubjectChart();
}

function dateText(v){return v?new Date(v+'T00:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'No deadline'}
function overdue(t){return !t.completed&&t.deadline<today()}

function render(){
 $('total').textContent=tasks.length;$('pending').textContent=tasks.filter(t=>!t.completed).length;$('done').textContent=tasks.filter(t=>t.completed).length;$('overdue').textContent=tasks.filter(overdue).length;
 $('date-label').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}).toUpperCase();
 let q=$('search').value.toLowerCase(),list=tasks.filter(t=>(`${t.title} ${t.subject} ${t.notes}`).toLowerCase().includes(q)&&
 (filter==='all'||(filter==='today'&&!t.completed&&t.deadline===today())||(filter==='upcoming'&&!t.completed&&t.deadline>today())||(filter==='completed'&&t.completed)));
 let sort=$('sort').value;if(sort==='priority'){let p={high:1,medium:2,low:3};list.sort((a,b)=>p[a.priority]-p[b.priority])}else if(sort==='newest')list.sort((a,b)=>b.created-a.created);else list.sort((a,b)=>a.deadline.localeCompare(b.deadline));
 $('tasks').innerHTML='';$('empty').style.display=list.length?'none':'block';$('tasks').style.display=list.length?'block':'none';
 list.forEach(t=>{let row=document.createElement('div');row.className='task'+(t.completed?' completed':'');
 let check=document.createElement('input');check.type='checkbox';check.className='check';check.checked=t.completed;check.setAttribute('aria-label','Complete task');check.onchange=()=>{t.completed=check.checked;persist()};
 let main=document.createElement('div'),name=document.createElement('div'),meta=document.createElement('div');name.className='task-name';name.textContent=t.title;meta.className='task-meta';meta.textContent=[t.subject||'General',t.notes].filter(Boolean).join(' · ');main.append(name,meta);
 let badge=document.createElement('span');badge.className='badge '+t.priority;badge.textContent=t.priority[0].toUpperCase()+t.priority.slice(1);
 let due=document.createElement('span');due.className='due'+(overdue(t)?' late':'');due.textContent=(overdue(t)?'Overdue · ':'')+dateText(t.deadline);
 let actions=document.createElement('div');actions.className='actions';let edit=document.createElement('button');edit.className='icon';edit.textContent='✎';edit.title='Edit';edit.onclick=()=>open(t.id);let del=document.createElement('button');del.className='icon';del.textContent='×';del.title='Delete';del.onclick=()=>{if(confirm('Delete this task?')){tasks=tasks.filter(x=>x.id!==t.id);persist()}};actions.append(edit,del);row.append(check,main,badge,due,actions);$('tasks').append(row)});
}

function setFilter(v){filter=v;document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.filter===v));document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('selected',b.dataset.filter===v));$('heading').textContent={all:'All tasks',today:'Due today',upcoming:'Upcoming tasks',completed:'Completed tasks'}[v];render()}
function open(id=null){editing=id;$('form').reset();$('modal-title').textContent=id?'Edit task':'Create a task';if(id){let t=tasks.find(x=>x.id===id);$('title').value=t.title;$('subject').value=t.subject;$('deadline').value=t.deadline;$('priority').value=t.priority;$('notes').value=t.notes}else $('deadline').value=today();$('shade').classList.add('open');$('title').focus()}
function close(){$('shade').classList.remove('open');editing=null}
$('add').onclick=()=>open();$('first').onclick=()=>open();$('close').onclick=close;$('cancel').onclick=close;$('shade').onclick=e=>{if(e.target===$('shade'))close()};document.onkeydown=e=>{if(e.key==='Escape')close()};
$('form').onsubmit=e=>{e.preventDefault();let data={title:$('title').value.trim(),subject:$('subject').value.trim(),deadline:$('deadline').value,priority:$('priority').value,notes:$('notes').value.trim()};if(!data.title||!data.deadline)return;if(editing){Object.assign(tasks.find(t=>t.id===editing),data)}else tasks.push({id:Date.now(),...data,completed:false,created:Date.now()});close();persist()};
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>setFilter(b.dataset.filter));$('search').oninput=render;$('sort').onchange=render;setFilter('all');

let taskChart = null;

function updateTaskChart() {
    let completed = tasks.filter(t => t.completed).length;
    let pending = tasks.length - completed;

    const ctx = document.getElementById('taskChart');
    if (!ctx) return;

    if (taskChart && taskChart.ctx && taskChart.ctx.canvas === ctx) {
        taskChart.data.datasets[0].data = [completed, pending];
        taskChart.update();
        return;
    }

    if (taskChart) {
        taskChart.destroy();
        taskChart = null;
    }
    const existingChart = typeof Chart.getChart === 'function' ? Chart.getChart(ctx) : null;
    if (existingChart) {
        existingChart.destroy();
    }

    taskChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ['#22c55e', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

const SUBJECTS = ['ADS', 'DBMS', 'OOPS', 'DVP'];

function isSubjectMatch(taskSubject, targetSubject) {
    if (!taskSubject) return false;
    const sub = String(taskSubject).trim().toUpperCase();
    const target = targetSubject.toUpperCase();
    if (sub === target) return true;
    if (sub.startsWith(target + ' ') || sub.startsWith(target + '-') || sub.startsWith(target + ':') || sub.startsWith(target + '_')) return true;
    if (target === 'OOPS' && (sub === 'OOP' || sub.startsWith('OOP ') || sub.startsWith('OOP-'))) return true;
    return false;
}

let subjectChart = null;

function updateSubjectChart() {
    const canvas = document.getElementById('subjectChart');
    if (!canvas) return;

    const completed = SUBJECTS.map(s =>
        tasks.filter(t => isSubjectMatch(t.subject, s) && Boolean(t.completed)).length
    );

    const pending = SUBJECTS.map(s =>
        tasks.filter(t => isSubjectMatch(t.subject, s) && !t.completed).length
    );

    if (subjectChart && subjectChart.ctx && subjectChart.ctx.canvas === canvas) {
        subjectChart.data.labels = SUBJECTS;
        subjectChart.data.datasets[0].data = completed;
        subjectChart.data.datasets[1].data = pending;
        subjectChart.update();
        return;
    }

    if (subjectChart) {
        subjectChart.destroy();
        subjectChart = null;
    }
    const existingChart = typeof Chart.getChart === 'function' ? Chart.getChart(canvas) : null;
    if (existingChart) {
        existingChart.destroy();
    }

    subjectChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: SUBJECTS,
            datasets: [
                {
                    label: 'Completed Tasks',
                    data: completed,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Pending Tasks',
                    data: pending,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    }
                }
            }
        }
    });
}

function initCharts() {
    updateTaskChart();
    updateSubjectChart();
}

if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initCharts);
} else {
    initCharts();
}
