'use strict';
(() => {
 const sentences=[
  "Hi, I'm Dhanush Movva. I'm an Analytics Engineer who connects data, business intelligence, and automation to help people make better decisions.",
  "I have around five years of experience building solutions with Power BI, Microsoft Fabric, Power Platform, Snowflake, and SQL, across enterprise operations, public services, and banking.",
  "Today, I'm a Senior Power Platform Developer at WM, delivering enterprise analytics and automation from the initial business question through to production.",
  "I connect data from Snowflake, SQL Server, APIs, and SharePoint, then build pipelines, semantic models, DAX measures, and executive dashboards. My reporting work includes driver performance across seven or more business units.",
  "With Microsoft Fabric, I've implemented Lakehouse, Data Pipelines, and Direct Lake solutions. One recent solution improved reporting performance by around sixty-five percent.",
  "I also build Power Apps and Power Automate solutions that simplify everyday workflows. One application redesign our team delivered contributed to more than five hundred thousand dollars in operational cost savings.",
  "Alongside development, I'm taking on technical leadership responsibilities, collaborating with an India-based team on solution design, development, troubleshooting, and production delivery.",
  "For me, a successful solution needs more than a dashboard. It needs trusted data, clear business definitions, appropriate access controls, and reliable performance for the people using it.",
  "More recently, I've been expanding into AI-driven analytics and agent-based solutions with Copilot Studio, Snowflake Cortex, and Claude.",
  "I'm exploring how agents can help people ask questions of enterprise data and turn answers into useful actions, while respecting the permissions and governance that data requires.",
  "Before WM, I delivered analytics and Power Platform solutions for the City of Garland. Earlier roles at Neutek Consulting and BNP Paribas built my foundation in data integration, modeling, and enterprise reporting.",
  "I hold a master's degree in Information Systems from the University of Texas at Arlington, along with Microsoft's Power BI Data Analyst and Fabric Analytics Engineer certifications.",
  "My strength is connecting the whole picture: the business need, the data foundation, the user experience, and the operational outcome.",
  "For my next opportunity, I want to keep bringing analytics engineering, business intelligence, automation, and AI together to solve real business problems at scale.",
  "Explore the projects below to see how I approach that work. If that sounds like what your team needs, I'd love to connect."
];
 const avatar=document.querySelector('.intro-avatar');
 const play=document.getElementById('intro-play');
 const stop=document.getElementById('intro-restart');
 const caption=document.getElementById('intro-caption');
 const status=document.getElementById('intro-status');
 const progress=document.getElementById('intro-progress');
 const transcript=document.getElementById('intro-transcript');
 sentences.forEach(s=>{const p=document.createElement('p');p.textContent=s;transcript.appendChild(p)});
 const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const words=sentences.map(s=>s.trim().split(/\s+/).length);
 const total=words.reduce((a,b)=>a+b,0);
 let index=0,run=0,playing=false,complete=false,utterance=null,timer=0,frame=0,speechActive=false;
 const synth=supported?window.speechSynthesis:null;
 const voiceSelect=document.getElementById('intro-voice');
 const maleName=/\b(Alex|Daniel|David|Mark|Fred|Aaron|Rishi|Ravi|Guy|Christopher|Eric|Roger|Andrew|Brian|Ryan|George|James|Thomas|Evan|Reed|Rocko|Grandpa)\b|Google UK English Male/i;
 let maleVoices=[];
 function loadVoices(){
  if(!synth)return;
  const previous=voiceSelect.value;
  maleVoices=synth.getVoices().filter(v=>/^en([_-]|$)/i.test(v.lang)&&maleName.test(v.name)&&!/female/i.test(v.name));
  maleVoices.sort((a,b)=>(b.lang==='en-US')-(a.lang==='en-US'));
  voiceSelect.replaceChildren();
  if(!maleVoices.length){const option=document.createElement('option');option.textContent='No male voice available';option.value='';voiceSelect.appendChild(option);voiceSelect.disabled=true;return}
  voiceSelect.disabled=false;
  for(const v of maleVoices){const option=document.createElement('option');option.value=v.voiceURI;option.textContent=v.name+' · '+v.lang;voiceSelect.appendChild(option)}
  let preferred=previous;try{preferred=preferred||localStorage.getItem('dhanush-intro-male-voice')}catch{}
  voiceSelect.value=maleVoices.some(v=>v.voiceURI===preferred)?preferred:maleVoices[0].voiceURI;
 }
 if(synth){loadVoices();synth.addEventListener('voiceschanged',loadVoices)}
 voiceSelect.addEventListener('change',()=>{try{localStorage.setItem('dhanush-intro-male-voice',voiceSelect.value)}catch{}if(playing)pause()});
 const updateProgress=(partial=0)=>{const completed=words.slice(0,index).reduce((a,b)=>a+b,0);progress.value=Math.min(100,(completed+partial)/total*100)};
 function scene(state){document.dispatchEvent(new CustomEvent('intro-scene',{detail:{index,state}}))}
 function render(){play.textContent=playing?'Pause introduction':complete?'Replay introduction':index>0?'Resume introduction':'Play my intro · ~3 min';play.setAttribute('aria-label',play.textContent);avatar.classList.toggle('speaking',playing&&speechActive&&!reduced.matches)}
 function resetAnimation(){clearInterval(timer);timer=0;frame=0;avatar.classList.remove('speaking');speechActive=false}
 function beginAnimation(){resetAnimation();speechActive=true;render();scene('playing');const presenting=[3,4,5,6,7,8,9,11,12].includes(index);avatar.dataset.frame=reduced.matches?'0':presenting?'1':'0';if(!reduced.matches){timer=setTimeout(()=>{avatar.dataset.frame=presenting?'2':'0'},6500)}}
 function finish(){playing=false;complete=true;index=sentences.length;resetAnimation();progress.value=100;status.textContent='Introduction complete';avatar.dataset.frame='0';scene('complete');render()}
 function say(token){
  if(token!==run||!playing)return;
  if(index>=sentences.length){finish();return}
  caption.textContent=sentences[index];status.textContent=`Introduction · ${index+1} of ${sentences.length}`;
  updateProgress();
  utterance=new SpeechSynthesisUtterance(sentences[index]);utterance.lang='en-US';utterance.rate=1;utterance.pitch=1;utterance.volume=1;
  const voice=maleVoices.find(v=>v.voiceURI===voiceSelect.value);
  if(!voice){playing=false;resetAnimation();status.textContent='No male English voice is available. Try another browser or read the introduction.';render();return}
  utterance.voice=voice;utterance.lang=voice.lang;
  utterance.onstart=()=>{if(token===run&&playing)beginAnimation()};
  utterance.onboundary=e=>{if(token!==run||!playing)return;const spoken=sentences[index].slice(0,e.charIndex).trim().split(/\s+/).filter(Boolean).length;updateProgress(spoken)};
  utterance.onend=()=>{if(token!==run||!playing)return;resetAnimation();index++;say(token)};
  utterance.onerror=e=>{if(token!==run)return;playing=false;resetAnimation();scene('paused');status.textContent=e.error==='not-allowed'?'Select Play to allow narration.':'Voice playback is unavailable. You can read the introduction below.';render()};
  synth.speak(utterance);
 }
 function pause(){playing=false;run++;if(synth)synth.cancel();resetAnimation();status.textContent='Paused · resume repeats the current sentence';scene('paused');render()}
 play.addEventListener('click',()=>{
  if(!supported){document.getElementById('intro-details').open=true;transcript.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});return}
  if(playing){pause();return}
  loadVoices();
  if(!maleVoices.length){status.textContent='No male English voice is available. Try another browser or read the introduction.';document.getElementById('intro-details').open=true;return}
  if(complete){index=0;complete=false}
  run++;const token=run;synth.cancel();playing=true;status.textContent='Starting introduction…';render();say(token);
 });
 stop.addEventListener('click',()=>{run++;if(synth)synth.cancel();playing=false;complete=false;index=0;resetAnimation();progress.value=0;caption.textContent='Meet Dhanush: my experience, skills, and the work I love building.';status.textContent='Ready to play';avatar.dataset.frame='0';scene('reset');render()});
 reduced.addEventListener('change',()=>{if(reduced.matches)resetAnimation();else if(playing)beginAnimation()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)pause()});
 addEventListener('pagehide',()=>{run++;if(playing&&synth)synth.cancel();resetAnimation()});
 if(!supported){play.textContent='Read my introduction';status.textContent='Audio is unavailable in this browser';stop.hidden=true}else render();
})();
