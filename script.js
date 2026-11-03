const $ = id => document.getElementById(id);
const chapterData = {
  "CBSE|11|Biology": [
    {name:"The Living World",desc:"Explore the characteristics of living organisms, naming and basic classification.",topics:["Characteristics of living organisms","Taxonomy and systematics","Binomial nomenclature"],search:"CBSE Class 11 Biology The Living World"},
    {name:"Biological Classification",desc:"Understand the major groups used to classify living organisms.",topics:["Five kingdom classification","Monera, Protista and Fungi","Viruses, viroids and lichens"],search:"CBSE Class 11 Biology Biological Classification"},
    {name:"Plant Kingdom",desc:"Learn how plants are grouped and compare their important features.",topics:["Algae and bryophytes","Pteridophytes and gymnosperms","Angiosperms"],search:"CBSE Class 11 Biology Plant Kingdom"},
    {name:"Morphology of Flowering Plants",desc:"Study the external structures of roots, stems, leaves, flowers and fruits.",topics:["Root and stem modifications","Leaf and inflorescence","Flower, fruit and seed"],search:"CBSE Class 11 Biology Morphology of Flowering Plants"},
    {name:"Anatomy of Flowering Plants",desc:"Explore plant tissues and the internal structure of plant organs.",topics:["Meristematic and permanent tissues","Dicot and monocot root","Stem and leaf anatomy"],search:"CBSE Class 11 Biology Anatomy of Flowering Plants"},
    {name:"Photosynthesis in Higher Plants",desc:"Understand how green plants capture light energy and convert it into chemical energy.",topics:["Photosynthetic pigments and light reaction","Electron transport and photophosphorylation","Calvin cycle, C4 pathway and photorespiration"],search:"CBSE Class 11 Biology Photosynthesis in Higher Plants"},
    {name:"Respiration in Plants",desc:"Learn how cells release energy from food through respiration.",topics:["Glycolysis","Fermentation and aerobic respiration","Respiratory quotient"],search:"CBSE Class 11 Biology Respiration in Plants"},
    {name:"Plant Growth and Development",desc:"Explore growth, differentiation and plant growth regulators.",topics:["Growth phases and conditions","Plant hormones","Photoperiodism and vernalisation"],search:"CBSE Class 11 Biology Plant Growth and Development"}
  ],
  "CBSE|11|Chemistry":[
    {name:"Some Basic Concepts of Chemistry",desc:"Build the foundations of chemical calculations and the mole concept.",topics:["Laws of chemical combination","Mole concept and molar mass","Stoichiometry"],search:"CBSE Class 11 Chemistry Some Basic Concepts of Chemistry"},
    {name:"Structure of Atom",desc:"Explore atomic models, quantum numbers and electronic configuration.",topics:["Bohr model","Quantum numbers","Electronic configuration"],search:"CBSE Class 11 Chemistry Structure of Atom"}
  ],
  "CBSE|11|Physics":[
    {name:"Units and Measurements",desc:"Learn physical quantities, units, dimensions and measurement errors.",topics:["SI units","Dimensional analysis","Errors in measurement"],search:"CBSE Class 11 Physics Units and Measurements"},
    {name:"Motion in a Straight Line",desc:"Understand position, displacement, velocity and acceleration.",topics:["Position and displacement","Velocity and acceleration","Motion graphs"],search:"CBSE Class 11 Physics Motion in a Straight Line"}
  ],
  "CBSE|11|Mathematics":[
    {name:"Sets",desc:"Understand sets, subsets, operations and Venn diagrams.",topics:["Types of sets","Subsets and power sets","Union and intersection"],search:"CBSE Class 11 Mathematics Sets"}
  ],
  "CBSE|11|English":[
    {name:"Reading and Writing Skills",desc:"Practise comprehension, vocabulary and structured writing.",topics:["Reading comprehension","Note making","Writing formats"],search:"CBSE Class 11 English reading writing skills"}
  ],
  "CBSE|11|Arabic":[
    {name:"Arabic Language Foundations",desc:"Practise reading, vocabulary, grammar and sentence building.",topics:["Vocabulary","Grammar basics","Reading comprehension"],search:"تعليم اللغة العربية للمبتدئين قواعد القراءة"}
  ]
};
const genericSubjects = ["Biology","Chemistry","Physics","Mathematics","English","Arabic"];
const genericChapterIdeas = {
  Biology:["Cell: The Unit of Life","Biomolecules","Cell Cycle and Cell Division"],
  Chemistry:["Basic Concepts","Structure of Matter","Chemical Reactions"],
  Physics:["Measurements","Motion","Force and Energy"],
  Mathematics:["Number Systems","Algebra","Geometry"],
  English:["Reading Comprehension","Grammar","Writing Skills"],
  Arabic:["Reading and Vocabulary","Arabic Grammar","Writing and Conversation"]
};
let activeChapter = null;
function getChapters() {
  const key = `${$("curriculum").value}|${$("classSelect").value}|${$("subjectSelect").value}`;
  if (chapterData[key]) return chapterData[key];
  const subject = $("subjectSelect").value;
  return (genericChapterIdeas[subject] || ["Introduction","Core Concepts","Practice and Review"]).map((name,i)=>({
    name, desc:`A starter topic area for ${subject}. Detailed chapter mapping for this curriculum and class will be added after syllabus verification.`,
    topics:["Key terms and concepts","Worked examples","Practice questions"], search:`${$("curriculum").value} Class ${$("classSelect").value} ${subject} ${name}`
  }));
}
function youtubeSearch(query, language, kind) {
  let suffix = language === "Arabic" ? " شرح عربي" : " full lesson explanation";
  if (kind === "revision") suffix = language === "Arabic" ? " مراجعة سريعة" : " one shot revision";
  if (kind === "midterm") suffix = language === "Arabic" ? " مراجعة اختبار منتصف الفصل" : " midterm exam revision";
  if (kind === "final") suffix = language === "Arabic" ? " مراجعة الاختبار النهائي" : " final exam revision";
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query + suffix);
}
function renderLibrary() {
  const chapters = getChapters();
  $("chapterCount").textContent = String(chapters.length).padStart(2,"0");
  $("chapterList").innerHTML = "";
  chapters.forEach((ch,i)=>{
    const b=document.createElement("button"); b.className="chapter-item"+(i===0?" active":""); b.textContent=`${String(i+1).padStart(2,"0")}  ${ch.name}`;
    b.addEventListener("click",()=>selectChapter(i)); $("chapterList").append(b);
  });
  selectChapter(0);
}
function selectChapter(index) {
  const chapters=getChapters(); activeChapter=chapters[index];
  [...$("chapterList").children].forEach((el,i)=>el.classList.toggle("active",i===index));
  const curriculum=$("curriculum").value, cls=$("classSelect").value, subject=$("subjectSelect").value, lang=$("videoLanguage").value;
  const search=activeChapter.search || `${curriculum} Class ${cls} ${subject} ${activeChapter.name}`;
  const langName=lang==="Arabic"?"Arabic / العربية":"English";
  const topics=activeChapter.topics.map(t=>`<li>${t}</li>`).join("");
  const content=$("chapterContent"); content.innerHTML="";
  const top=document.createElement("div"); top.className="chapter-topline";
  top.innerHTML=`<span class="tag">${curriculum==="CBSE"?"CBSE":"Saudi curriculum"} · Class ${cls} · ${subject}</span><span class="tag">${langName} videos</span>`;
  const title=document.createElement("h3"); title.textContent=activeChapter.name;
  const desc=document.createElement("p"); desc.className="chapter-desc"; desc.textContent=activeChapter.desc;
  const grid=document.createElement("div"); grid.className="resource-grid";
  const resources=[
    ["▶","Full chapter lesson",`Find a ${langName} explanation for this chapter.`,youtubeSearch(search,lang,"full"),"Watch on YouTube ↗"],
    ["⏱","Quick revision",`Short revision and recap videos in ${langName}.`,youtubeSearch(search,lang,"revision"),"Find revision videos ↗"],
    ["📝","Midterm exam revision","Search for relevant midterm preparation videos.",youtubeSearch(search,lang,"midterm"),"Find midterm videos ↗"],
    ["🎓","Final exam revision","Search for final exam preparation and recap videos.",youtubeSearch(search,lang,"final"),"Find final exam videos ↗"]
  ];
  resources.forEach(r=>{const card=document.createElement("article");card.className="resource-card";card.innerHTML=`<div class="resource-icon">${r[0]}</div><h4>${r[1]}</h4><p>${r[2]}</p><a href="${r[3]}" target="_blank" rel="noopener noreferrer">${r[4]}</a>`;grid.append(card);});
  const notes=document.createElement("article");notes.className="resource-card";notes.innerHTML=`<div class="resource-icon">📚</div><h4>Chapter key points</h4><p>Use these topics as a checklist while studying.</p><ul>${topics}</ul><button id="copyTopics">Copy topic checklist</button>`;
  const questions=document.createElement("article");questions.className="resource-card";questions.innerHTML=`<div class="resource-icon">❓</div><h4>Important questions</h4><p>Find practice questions and textbook-based questions for this topic.</p><a href="${"https://www.google.com/search?q="+encodeURIComponent(curriculum+" Class "+cls+" "+subject+" "+activeChapter.name+" important questions")}" target="_blank" rel="noopener noreferrer">Find questions ↗</a>`;
  grid.append(notes,questions);
  const note=document.createElement("div");note.className="chapter-note";note.textContent="Video links open YouTube search results in a new tab. Choose a teacher and video that match your textbook. We will add verified individual video picks, downloadable notes and original question banks chapter by chapter.";
  content.append(top,title,desc,grid,note);
  $("copyTopics").addEventListener("click",()=>{const txt=`${activeChapter.name}\n${activeChapter.topics.map(x=>"• "+x).join("\n")}`;navigator.clipboard?.writeText(txt).then(()=>{$("copyTopics").textContent="Copied ✓"}).catch(()=>{$("copyTopics").textContent="Copy unavailable"});});
}
["curriculum","classSelect","subjectSelect","videoLanguage"].forEach(id=>$(id).addEventListener("change",renderLibrary));
renderLibrary();

// Dark mode and navigation
$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("ssh-v2-theme",document.body.classList.contains("dark")?"dark":"light");});
if(localStorage.getItem("ssh-v2-theme")==="dark")document.body.classList.add("dark");
$("mobileMenu").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
$("mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("mainNav").classList.remove("open")));
$("year").textContent=new Date().getFullYear();

// Calculators
$("attendanceBtn").addEventListener("click",()=>{const a=Number($("attended").value),t=Number($("totalClasses").value);$("attendanceResult").textContent=($("attended").value===""||$("totalClasses").value===""||t<=0||a<0||a>t)?"Enter valid numbers; attended cannot exceed total.":`Attendance: ${(a/t*100).toFixed(1)}%`;});
$("marksBtn").addEventListener("click",()=>{const a=Number($("scored").value),t=Number($("maximum").value);$("marksResult").textContent=($("scored").value===""||$("maximum").value===""||t<=0||a<0||a>t)?"Enter valid marks; scored cannot exceed total.":`Percentage: ${(a/t*100).toFixed(2)}%`;});

// Task list
let tasks=[];try{tasks=JSON.parse(localStorage.getItem("ssh-v2-tasks")||"[]")}catch{}
function renderTasks(){const ul=$("taskList");ul.innerHTML="";if(!tasks.length){ul.innerHTML="<li>No tasks added yet.</li>";return;}tasks.forEach((t,i)=>{const li=document.createElement("li");if(t.done)li.classList.add("done");const c=document.createElement("input");c.type="checkbox";c.checked=t.done;c.addEventListener("change",()=>{tasks[i].done=c.checked;saveTasks()});const s=document.createElement("span");s.textContent=t.text;s.style.flex="1";const d=document.createElement("button");d.textContent="×";d.addEventListener("click",()=>{tasks.splice(i,1);saveTasks()});li.append(c,s,d);ul.append(li);});}
function saveTasks(){localStorage.setItem("ssh-v2-tasks",JSON.stringify(tasks));renderTasks();}
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const v=$("taskInput").value.trim();if(v){tasks.push({text:v,done:false});$("taskInput").value="";saveTasks();}});renderTasks();

// Focus timer
let seconds=25*60,breakMode=false,tick=null;function drawTimer(){$("timerReadout").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;}
$("timerStart").addEventListener("click",()=>{if(tick){clearInterval(tick);tick=null;$("timerStart").textContent="Start";return;} $("timerStart").textContent="Pause";tick=setInterval(()=>{seconds--;drawTimer();if(seconds<=0){clearInterval(tick);tick=null;$("timerStart").textContent="Start";alert(breakMode?"Break complete!":"Focus session complete! Take a short break.");}},1000);});
$("timerReset").addEventListener("click",()=>{clearInterval(tick);tick=null;$("timerStart").textContent="Start";seconds=breakMode?5*60:25*60;drawTimer();});
$("timerSwitch").addEventListener("click",()=>{clearInterval(tick);tick=null;$("timerStart").textContent="Start";breakMode=!breakMode;seconds=breakMode?5*60:25*60;$("timerSwitch").textContent=breakMode?"Focus":"Break";drawTimer();});drawTimer();

// Small original learning games
const quizQuestions=[
 {q:"Which pigment mainly absorbs light for photosynthesis?",a:["Chlorophyll a","Haemoglobin","Melanin"],correct:0,why:"Chlorophyll a is the main photosynthetic pigment."},
 {q:"Where does the Calvin cycle take place?",a:["Stroma","Thylakoid lumen","Cytoplasm"],correct:0,why:"The Calvin cycle takes place in the chloroplast stroma."},
 {q:"Which gas is released during photosynthesis?",a:["Oxygen","Nitrogen","Carbon dioxide"],correct:0,why:"Oxygen is released when water is split during the light reactions."}
];
const pairs=[["Chlorophyll","Light-absorbing pigment"],["Stomata","Leaf pores"],["Glucose","Simple sugar"],["Oxygen","Gas released"]];
function startQuiz(){let i=0,score=0;const stage=$("gameStage");function show(){if(i>=quizQuestions.length){stage.innerHTML=`<h3>Quiz complete!</h3><p>You scored ${score} out of ${quizQuestions.length}. Try again to improve your score.</p><button class="btn btn-primary small-btn" id="againQuiz">Play again</button>`;$("againQuiz").onclick=startQuiz;return;}const q=quizQuestions[i];stage.innerHTML=`<span class="kicker">QUESTION ${i+1} OF ${quizQuestions.length}</span><div class="game-question">${q.q}</div><div class="answer-grid">${q.a.map((a,n)=>`<button class="answer-btn" data-answer="${n}">${a}</button>`).join("")}</div><div class="game-feedback" id="feedback"></div>`;stage.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{const ok=Number(b.dataset.answer)===q.correct;if(ok)score++;stage.querySelectorAll("button").forEach(x=>x.disabled=true);$("feedback").textContent=(ok?"Correct! ":"Not quite. ")+q.why+"  "+`Score: ${score}`;const next=document.createElement("button");next.className="btn btn-primary small-btn";next.textContent="Next";next.onclick=()=>{i++;show()};stage.append(next);});}show();}
function startMatch(){const stage=$("gameStage");let idx=0;const shuffled=[...pairs].sort(()=>Math.random()-.5);function show(){if(idx>=shuffled.length){stage.innerHTML="<h3>Great matching!</h3><p>You matched all the pairs.</p>";return;}const [term,meaning]=shuffled[idx];stage.innerHTML=`<span class="kicker">MATCH ${idx+1} OF ${shuffled.length}</span><div class="game-question">What matches “${term}”?</div><div class="answer-grid">${[meaning,...pairs.filter(p=>p[1]!==meaning).map(p=>p[1]).sort(()=>Math.random()-.5)].sort(()=>Math.random()-.5).map(x=>`<button class="answer-btn">${x}</button>`).join("")}</div><div class="game-feedback" id="feedback"></div>`;stage.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(b.textContent===meaning){$("feedback").textContent="Correct match!";idx++;setTimeout(show,500);}else{$("feedback").textContent="Try again.";}});}show();}
function startWord(){const stage=$("gameStage");const words=[{w:"Photosynthesis",h:"The process plants use to make food using light."},{w:"Respiration",h:"The process cells use to release energy."},{w:"ماء",h:"Arabic word meaning water."}];let i=0;function show(){if(i>=words.length){stage.innerHTML="<h3>Word challenge complete!</h3><p>Nice work learning new words.</p>";return;}stage.innerHTML=`<span class="kicker">WORD ${i+1} OF ${words.length}</span><div class="game-question">${words[i].h}</div><button class="btn btn-primary small-btn" id="revealWord">Reveal answer</button><div class="game-feedback" id="feedback"></div>`;$("revealWord").onclick=()=>{$("feedback").textContent=words[i].w;const n=document.createElement("button");n.className="btn btn-quiet small-btn";n.textContent="Next word";n.onclick=()=>{i++;show()};stage.append(n);};}show();}
document.querySelectorAll("[data-game]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.game==="quiz")startQuiz();if(b.dataset.game==="match")startMatch();if(b.dataset.game==="word")startWord();$("gameStage").scrollIntoView({behavior:"smooth",block:"center"});}));
