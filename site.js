/* Shared behaviour for every AuraIT page */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header=document.getElementById('top');
  if(header)addEventListener('scroll',function(){header.classList.toggle('scrolled',scrollY>8)},{passive:true});


  /* phone menu */
  var bur=document.querySelector('.burger');
  if(header&&bur){
    bur.addEventListener('click',function(){var o=header.classList.toggle('open');bur.setAttribute('aria-expanded',o)});
    header.querySelectorAll('.nav ul a').forEach(function(a){a.addEventListener('click',function(){header.classList.remove('open');bur.setAttribute('aria-expanded','false')})});
  }

  /* reveal: hide only what is below the fold, show when it scrolls in */
  if(!reduce&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){
      if(el.getBoundingClientRect().top>innerHeight*0.92){el.classList.add('pre');io.observe(el)}
    });
  }

  /* statement: words fill with color while scrolling */
  var st=document.getElementById('stmt');
  if(st&&!reduce){
    st.innerHTML=st.textContent.trim().split(/\s+/).map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
    var ws=st.querySelectorAll('.w');
    var tick=function(){var r=st.getBoundingClientRect(),vh=innerHeight,p=(vh*0.9-r.top)/(r.height+vh*0.3);p=Math.max(0,Math.min(1,p));var n=Math.round(p*ws.length);for(var i=0;i<ws.length;i++)ws[i].classList.toggle('dim',i>=n)};
    var queued=false,onScroll=function(){if(!queued){queued=true;requestAnimationFrame(function(){queued=false;tick()})}};
    addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);tick();
  }

  /* footer sheen: animate only while visible */
  var fb=document.querySelector('.fbig');
  if(fb&&'IntersectionObserver' in window)new IntersectionObserver(function(es){fb.classList.toggle('play',es[0].isIntersecting)}).observe(fb);

  /* FAQ accordion: one answer open at a time */
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.parentNode,open=!item.classList.contains('open');
      item.parentNode.querySelectorAll('.faq-item').forEach(function(it){it.classList.remove('open');it.querySelector('.faq-q').setAttribute('aria-expanded','false')});
      if(open){item.classList.add('open');q.setAttribute('aria-expanded','true')}
    });
  });


  /* works: mark cases that are on screen (touch auto-scroll, Telegram pop-in) */
  var cases=document.querySelectorAll('.case');
  if(cases.length&&'IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('in',e.isIntersecting)})},{threshold:.35});
    cases.forEach(function(c){co.observe(c)});
  }else cases.forEach(function(c){c.classList.add('in')});


  /* order modal on every page: [data-order] buttons -> phone -> "our team will contact you" */
  var om=document.getElementById('om');
  if(om){
    var omForm=document.getElementById('omForm'),omDone=document.getElementById('omDone'),omPhone=document.getElementById('omPhone'),omErr=document.getElementById('omErr'),omField=om.querySelector('.om-field'),omPrev=null,omBrief='';
    var again=function(el,c){el.classList.remove(c);void el.offsetWidth;el.classList.add(c)};
    var mask=function(v){
      var d=v.replace(/\D/g,'');if(!d)return '';
      if(d[0]==='8'&&d.length>1&&d[1]!=='0')d='7'+d.slice(1);
      var r;
      if(d.slice(0,3)==='375'){d=d.slice(3,12);r='+375';if(d.length)r+=' ('+d.slice(0,2);if(d.length>=2)r+=')';if(d.length>2)r+=' '+d.slice(2,5);if(d.length>5)r+='-'+d.slice(5,7);if(d.length>7)r+='-'+d.slice(7,9);return r}
      if(d[0]==='7'){d=d.slice(1,11);r='+7';if(d.length)r+=' ('+d.slice(0,3);if(d.length>=3)r+=')';if(d.length>3)r+=' '+d.slice(3,6);if(d.length>6)r+='-'+d.slice(6,8);if(d.length>8)r+='-'+d.slice(8,10);return r}
      return '+'+d.slice(0,15);
    };
    var valid=function(v){var d=v.replace(/\D/g,'');return d.slice(0,3)==='375'?d.length===12:d[0]==='7'?d.length===11:d.length>=10};
    var locked=function(){return document.querySelector('.b-ov.on')};
    window.auraOrder=function(brief){
      omBrief=brief||'';omPrev=document.activeElement;
      omForm.hidden=false;omDone.hidden=true;omErr.textContent='';omForm.classList.remove('bad');
      om.hidden=false;void om.offsetWidth;om.classList.add('on');document.body.classList.add('lock');
      setTimeout(function(){omPhone.focus()},reduce?0:250);
    };
    var close=function(){
      om.classList.remove('on');
      setTimeout(function(){om.hidden=true;if(!locked())document.body.classList.remove('lock');if(omPrev&&omPrev.focus)omPrev.focus()},reduce?0:350);
    };
    document.addEventListener('click',function(e){var b=e.target.closest('[data-order]');if(b){e.preventDefault();window.auraOrder('')}});
    om.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',close)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&om.classList.contains('on')){e.stopImmediatePropagation();close()}},true);
    omPhone.addEventListener('focus',function(){if(!omPhone.value)omPhone.value='+375 ('});
    omPhone.addEventListener('blur',function(){if(/^\+375/.test(omPhone.value)&&omPhone.value.replace(/\D/g,'').length<=3)omPhone.value=''});
    omPhone.addEventListener('input',function(){omPhone.value=mask(omPhone.value);if(omForm.classList.contains('bad')&&valid(omPhone.value)){omForm.classList.remove('bad');omErr.textContent=''}});
    omPhone.addEventListener('keydown',function(e){if(e.key==='Backspace'&&/\D$/.test(omPhone.value)&&omPhone.selectionStart===omPhone.value.length){e.preventDefault();omPhone.value=mask(omPhone.value.replace(/\D/g,'').slice(0,-1))}});
    omForm.addEventListener('submit',function(e){
      e.preventDefault();
      if(!valid(omPhone.value)){omForm.classList.add('bad');omErr.textContent='Введите номер полностью';again(omField,'om-shake');omPhone.focus();return}
      var data={phone:omPhone.value,brief:omBrief,page:document.title};
      var url=om.getAttribute('data-lead')||window.AURA_LEAD_URL;if(url){try{fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(data)})}catch(_){}}
      omForm.hidden=true;omDone.hidden=false;again(omDone,'show');omDone.querySelector('[data-close]').focus();
    });
  }

  /* copy buttons: <button data-copy="text"> */
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var text=btn.getAttribute('data-copy'),o=btn.textContent;
      function ok(){btn.textContent='Скопировано';setTimeout(function(){btn.textContent=o},2000)}
      function fb(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');ok()}catch(_){}t.remove()}
      try{navigator.clipboard.writeText(text).then(ok,fb)}catch(_){fb()}
    });
  });
})();
