// app.js - dynamic topics (single page), tools and quiz
const menuBtn = document.getElementById('hamburger');
const mainMenu = document.getElementById('mainMenu');
menuBtn.addEventListener('click', ()=>{
  mainMenu.classList.toggle('hidden');
  mainMenu.setAttribute('aria-hidden', mainMenu.classList.contains('hidden') ? 'true' : 'false');
});

document.querySelectorAll('#mainMenu a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const page = a.dataset.page;
    showPage(page);
    mainMenu.classList.add('hidden');
  });
});

function showPage(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  const el = document.getElementById(page);
  if(el) el.classList.remove('hidden');
  if(page==='tools') initTools();
  if(page==='quiz') loadQuiz();
}

// Topics dynamic content
const topics = {
  "paths": {
    "title": "Construct / Interpret Absolute vs Relative Paths",
    "content": `
<h3>🌍 1. What Is a Path?</h3>
<p>A path is the address of a file or folder inside your computer.</p>
<p>There are two types of paths: <strong>Absolute Path</strong> and <strong>Relative Path</strong>.</p>

<h3>🧭 2. What Is an Absolute Path?</h3>
<p><strong>Definition</strong>: An absolute path is the full and complete address of a file starting from the root directory of the system.</p>
<p><strong>Examples</strong>:</p>
<pre>Windows: C:\\Users\\Navsjang\\Documents\\Projects\\report.txt
Mac/Linux: /Users/navsjang/Documents/Projects/report.txt</pre>
<p><strong>Key Characteristics</strong>:</p>
<ul><li>Always starts from the root (C:\\ or /)</li><li>Always points to the exact file — independent of current directory</li></ul>

<h3>📂 3. What Is a Relative Path?</h3>
<p><strong>Definition</strong>: A relative path points to a file based on your current location.</p>
<p><strong>Examples</strong>:</p>
<pre>If current folder is C:\\Users\\Navsjang\\Documents\\Projects\\
Relative path to report.txt: report.txt
Relative to go up one folder: ../report.txt</pre>

<h3>🔍 4. How They Work Together</h3>
<pre>Folder example:
C:\\Users\\Navsjang\\Projects\\FileManagement\\
    report.txt

Absolute Path:
C:\\Users\\Navsjang\\Projects\\FileManagement\\report.txt

Relative Path (if you're inside FileManagement):
report.txt</pre>

<h3>Images</h3>
<p>Below are the example images:</p>
<img src="assets/images/abs_step_text.png" style="max-width:100%;border-radius:8px;margin-bottom:8px;">
<img src="assets/images/analogy_barangay.png" style="max-width:100%;border-radius:8px;margin-bottom:8px;">
<img src="assets/images/abs_rel_diagram.png" style="max-width:100%;border-radius:8px;margin-bottom:8px;">
`
  },
  "search": {
    "title": "Use Search Operators & Saved Searches",
    "content": `
<h3>🔍 What is “Use Search Operators and Saved Searches”?</h3>
<p>This topic teaches you how to search smarter, not harder. Use operators to filter by filetype, date, size, keywords, and properties.</p>
<h4>Common Search Operators (Windows example)</h4>
<table>
<tr><th>What You Want</th><th>Operator</th><th>Example</th></tr>
<tr><td>Files with a specific extension</td><td><code>*.ext</code></td><td><code>*.txt</code></td></tr>
<tr><td>Files modified today</td><td><code>datemodified:today</code></td><td></td></tr>
<tr><td>Files larger than 50MB</td><td><code>size:>50MB</code></td><td></td></tr>
<tr><td>Search inside text</td><td><code>content:</code></td><td><code>content:budget</code></td></tr>
</table>

<h4>Examples</h4>
<pre>Find all PDF files:
*.pdf

Find files modified this month:
datemodified:this month

Find files that contain the word "budget":
content:budget</pre>

<h4>Saved Searches</h4>
<p>After using a search, save it for reuse. In Windows File Explorer, click <em>Save search</em> and it appears in your Searches folder.</p>
`
  },
  "organize": {
    "title": "Organize with System Folders Appropriately",
    "content": `
<h3>📂 What Is “Organize with System Folders Appropriately”?</h3>
<p>This means using built-in folders to keep files clean and easy to find: Documents, Pictures, Music, Downloads, Desktop.</p>
<ul>
<li>Store essays in Documents</li>
<li>Store photos in Pictures</li>
<li>Use Downloads as temporary space; clean regularly</li>
</ul>
<p>Example structure:</p>
<pre>project-root/
  Documents/
    FileManagement/
      notes.docx
      diagram.png
  Images/
    logo.png</pre>
`
  }
};

document.querySelectorAll('.topic-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.dataset.topic;
    const area = document.getElementById('topicContent');
    area.innerHTML = `<h2>${topics[id].title}</h2>` + topics[id].content;
    area.scrollIntoView({behavior:'smooth'});
  });
});

// Tools initialization (search + organizer)
function initTools(){
  // search simulator
  const files = ['report.txt','image.png','notes.docx','report(1).txt','homework.pdf','presentation.pptx'];
  const searchBox = document.getElementById('simSearch');
  const results = document.getElementById('simResults');
  if(searchBox){
    searchBox.value='';
    searchBox.oninput = ()=>{
      const q = searchBox.value.trim();
      if(!q){ results.textContent=''; return; }
      let pattern = '^'+q.replace(/\./g,'\\.').replace(/\*/g,'.*')+'$';
      try{
        const re = new RegExp(pattern,'i');
        const res = files.filter(f=>re.test(f));
        results.innerHTML = res.length? res.join('<br/>') : 'No matches';
      }catch(err){
        results.textContent='Invalid pattern';
      }
    };
  }

  // organizer drag/drop
  document.querySelectorAll('#organizer .file').forEach(f=>{
    f.addEventListener('dragstart', ev=> ev.dataTransfer.setData('text/plain', ev.target.textContent));
  });
  document.querySelectorAll('#organizer .folder').forEach(folder=>{
    folder.addEventListener('dragover', ev=> ev.preventDefault());
    folder.addEventListener('drop', ev=>{
      ev.preventDefault();
      const name = ev.dataTransfer.getData('text/plain');
      alert(name + ' moved to ' + folder.dataset.folder);
      document.querySelectorAll('#organizer .file').forEach(el=>{ if(el.textContent===name) el.remove(); });
    });
  });
}

// Quiz
const quizQuestions = [
  {q:'Which is an absolute path?', opts:['Documents/report.txt','C:\\\\Users\\\\John\\\\report.txt','../report.txt'], a:1},
  {q:'Which operator finds files starting with "report"?', opts:['*report*','report*','*.report'], a:1},
  {q:'Where should music files be stored?', opts:['Documents','Images','Music'], a:2},
  {q:'What does ".." mean in a path?', opts:['Current folder','Parent folder','Root folder'], a:1},
  {q:'Which is a relative path from Projects?', opts:['/home/user/Projects/report.txt','FileManagement/report.txt','C:\\\\report.txt'], a:1}
];

function loadQuiz(){
  const area = document.getElementById('quizArea');
  area.innerHTML='';
  quizQuestions.forEach((qq, idx)=>{
    const div = document.createElement('div'); div.className='quiz-card';
    div.innerHTML = `<p><strong>Q${idx+1}:</strong> ${qq.q}</p>`;
    qq.opts.forEach((opt,i)=>{
      const btn = document.createElement('button'); btn.innerText = opt; btn.onclick = ()=>{ if(i===qq.a) {btn.style.background='green'; alert('Correct!');} else {btn.style.background='maroon'; alert('Incorrect');} };
      div.appendChild(btn);
    });
    area.appendChild(div);
  });
  document.getElementById('quizResult').textContent='Click an answer to get feedback.';
}

// show home initially
showPage('home');
