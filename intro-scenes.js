'use strict';
(() => {
 const stage=document.getElementById('intro-stage');
 const hero=document.querySelector('.hero');
 const node=(name,sub='')=>`<div class="scene-node"><strong>${name}</strong>${sub?`<span>${sub}</span>`:''}</div>`;
 const flow=nodes=>`<div class="scene-flow">${nodes.map((n,i)=>node(n[0],n[1])+(i<nodes.length-1?'<span class="scene-connector" aria-hidden="true"><i></i></span>':'')).join('')}</div>`;
 const tiles=items=>`<div class="scene-tiles">${items.map((n,i)=>`<div class="scene-tile" style="--tile-index:${i}"><span>${String(i+1).padStart(2,'0')}</span><strong>${n}</strong></div>`).join('')}</div>`;
 const scenes={
 leadership:{title:'From design to delivery.',subtitle:'Technical collaboration with an India-based team',html:flow([['Solution design','Shared technical direction'],['Development','Build & troubleshoot'],['Production','Reliable delivery']])},
 savings:{title:'Automation with measurable impact.',subtitle:'Power Apps · Power Automate',html:`<div class="scene-education">${node('$500,000+','Operational cost savings')}${node('Team delivery','Application redesign')}</div><p class="scene-subtitle">An application redesign contributed to these savings.</p>`},
 ai:{title:'Exploring AI-driven analytics.',subtitle:'Expanding into agent-based solutions',html:tiles(['Copilot Studio','Snowflake Cortex','Claude'])},
 agents:{title:'From questions to useful actions.',subtitle:'An area of exploration: agents working with enterprise data',html:flow([['Business question','Natural language'],['Enterprise data','Governed access'],['Useful answer','Insights & next steps']])},
 credentials:{title:'A foundation for the work.',subtitle:'Education & Microsoft certifications',html:`<div class="scene-certificates">${node('Master’s','Information Systems · UT Arlington')}${node('PL-300','Power BI Data Analyst')}${node('DP-600','Fabric Analytics Engineer')}</div>`},

 welcome:{title:'Data. Clarity. Impact.',subtitle:'Business intelligence · Microsoft Fabric · Power Platform',html:`<div class="scene-orbit">${node('Business insights','Questions into decisions')}<div class="scene-orbit-tools">${node('Power BI','Analytics')}${node('Fabric','Data platforms')}${node('Power Platform','Business workflows')}</div></div>`},
 lifecycle:{title:'From a question to a decision.',subtitle:'The full business intelligence lifecycle',html:flow([['Business question','Understand the need'],['Connected data','SQL · APIs · Cloud'],['Semantic model','DAX · Governance'],['Power BI','Actionable insights']])},
 experience:{title:'Experience across industries.',subtitle:'Enterprise operations, municipal services, and banking',html:`<div class="scene-industry">${node('WM','Enterprise operations')}${node('City of Garland','Municipal services')}${node('BNP Paribas','Banking')}</div>`},
 operations:{title:'Operational visibility.',subtitle:'Driver performance reporting across 7+ business units',html:`<div class="scene-dashboard"><div class="scene-dashboard-head"><span>DRIVER & ROUTE PERFORMANCE</span><span>Illustrative preview</span></div><div class="scene-kpis"><span>Driver performance</span><span>Route completion</span><span>On-time delivery</span></div><div class="scene-bars">${[55,76,64,88,70,92,81].map((h,i)=>`<i style="--height:${h}%;--tile-index:${i}"></i>`).join('')}</div><div class="scene-chart-labels"><span>Business units</span><span>Performance trends</span></div></div>`},
 fabric:{title:'One connected data foundation.',subtitle:'Microsoft Fabric architecture · Around 65% reporting performance improvement',html:flow([['Data sources','Snowflake · SQL · APIs'],['Data Pipelines','Ingest & transform'],['Lakehouse','Store & organize'],['Direct Lake','Semantic model'],['Power BI','Explore & report']])},
 toolkit:{title:'The tools behind the work.',subtitle:'Analytics, data platforms, and business process automation',html:tiles(['Power BI','SQL','DAX','Power Query','Snowflake','Azure','Power Apps','Power Automate','Dataverse'])},
 security:{title:'The right insights. The right access.',subtitle:'Performance, governance, and row-level security',html:`<div class="scene-security">${node('Semantic model','One governed foundation')}<div class="security-lines" aria-hidden="true"></div><div class="scene-role-row">${node('Operations','Authorized rows')}${node('Finance','Authorized rows')}${node('Leadership','Authorized rows')}</div><div class="scene-security-label">ROLE-BASED ACCESS · RELIABLE REPORTING</div></div>`},
 city:{title:'Analytics for public services.',subtitle:'City of Garland · reporting and Power Platform delivery',html:flow([['Operational systems','APIs · SQL · SharePoint'],['Data integration','Clean & connect'],['Power BI','Operational reporting']])+`<div class="scene-mini-tags"><span>Waste analytics</span><span>Service requests</span><span>Business workflows</span></div>`},
 modeling:{title:'Built on strong data models.',subtitle:'Neutek Consulting · BNP Paribas',html:`<div class="scene-star"><div class="star-center">Fact table<br><small>Business measures</small></div><div class="star-dimension d1">Date</div><div class="star-dimension d2">Location</div><div class="star-dimension d3">Business unit</div><div class="star-dimension d4">Category</div><svg viewBox="0 0 500 220" preserveAspectRatio="none" aria-hidden="true"><path d="M250 110 L90 40 M250 110 L410 40 M250 110 L90 185 M250 110 L410 185"/></svg></div>`},
 education:{title:'A foundation in information systems.',subtitle:'University of Texas at Arlington',html:`<div class="scene-education">${node('Master’s degree','Information Systems')}${node('Graduate certificate','Business Analytics')}<span>University of Texas at Arlington</span></div>`},
 certifications:{title:'Microsoft certified.',subtitle:'Analytics, data platforms, and automation',html:`<div class="scene-certificates">${node('DP-600','Fabric Analytics Engineer')}${node('PL-300','Power BI Data Analyst')}${node('PL-900','Power Platform Fundamentals')}</div>`},
 impact:{title:'Technology with a business purpose.',subtitle:'Turning technical delivery into everyday value',html:flow([['Connected data','A reliable foundation'],['Clear insights','Faster decisions'],['Automation','Fewer manual steps']])},
 opportunity:{title:'Let’s build what’s next.',subtitle:'Houston, Texas · Open to relocate',html:tiles(['Business intelligence','Microsoft Fabric','Analytics engineering','Power Platform'])},
 contact:{title:'Let’s connect.',subtitle:'Explore the work. Start a conversation.',html:`<div class="scene-contact">${node('Dhanush Movva','Analytics Engineer')}<span>dhanushmovva@gmail.com</span><div class="scene-mini-tags"><span>Projects</span><span>Experience</span><span>LinkedIn</span></div></div>`}
 };
 const order=['welcome','experience','lifecycle','operations','fabric','savings','leadership','security','ai','agents','experience','credentials','impact','opportunity','contact'];
 let current='';
 document.addEventListener('intro-scene',event=>{
  const {index,state}=event.detail;
  if(state==='reset'){hero.classList.remove('intro-presenting');stage.classList.remove('active','paused');current='';return}
  hero.classList.add('intro-presenting');stage.classList.add('active');stage.classList.toggle('paused',state!=='playing');
  const key=order[index]||'contact';
  if(current===key)return;
  current=key;const scene=scenes[key];
  const panel=document.createElement('div');panel.className='scene-panel';panel.setAttribute('role','group');panel.setAttribute('aria-label',scene.title);panel.innerHTML=`<span class="scene-eyebrow">${String(index+1).padStart(2,'0')} / MY INTRODUCTION</span><h2>${scene.title}</h2><p class="scene-subtitle">${scene.subtitle}</p>${scene.html}`;
  stage.replaceChildren(panel);
 });
})();
