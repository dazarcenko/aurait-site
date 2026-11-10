/* AuraIT site builder: four steps -> live test site -> Telegram feed */
(function(){
  var P=window.AURA_PRICES;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer=matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function money(n){return n.toLocaleString('ru-RU')}
  function now(){var d=new Date();return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
  function replay(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)}

  var ICONS={
    shirt:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M17 8 8 14l4 8 4-2v20h16V20l4 2 4-8-9-6c-1 3-4 5-7 5s-6-2-7-5z"/></svg>',
    tool:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M31 7a10 10 0 0 0-9 13L8 34a4 4 0 0 0 6 6l14-14a10 10 0 0 0 13-12l-6 6-5-1-1-5z"/></svg>',
    scissors:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="13" cy="14" r="5"/><circle cx="13" cy="34" r="5"/><path d="M17 17l24 20M17 31 41 11"/></svg>',
    bowl:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22h36a18 18 0 0 1-36 0z"/><path d="M18 16c0-3 2-4 2-7M26 16c0-3 2-4 2-7"/></svg>',
    cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    check:'<svg class="ok-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-6.5"/></svg>'
  };

  /* demo content of the preview site, in both languages */
  var TYPES={
    shop:{label:'Магазин',name:'Мой магазин',icon:'shirt',
      title:{ru:'Каталог',en:'Catalog'},buy:{ru:'В корзину',en:'Add to cart'},
      hero:{ru:['Одежда, в которой удобно','Доставка по городу за один день. Примерка при получении.','Смотреть каталог'],en:['Clothes that feel right','Same-day delivery across the city. Try on before you pay.','Shop now']},
      items:[[['Худи оверсайз','Oversized hoodie'],89],[['Футболка базовая','Basic T-shirt'],35],[['Кепка','Cap'],25],[['Сумка-шоппер','Tote bag'],29],[['Свитшот','Sweatshirt'],69],[['Носки, 3 пары','Socks, 3 pairs'],15]],
      ben:{ru:[['Доставка за день','Привезём сегодня, если заказ до 15:00'],['Примерка','Оплачиваете только то, что подошло'],['Обмен 14 дней','Без вопросов и чеков']],en:[['Same-day delivery','Order before 3 pm, get it today'],['Try on first','Pay only for what fits'],['14-day exchange','No questions, no receipts']]},
      defaults:['cart','tg','benefits','reviews']},
    services:{label:'Услуги',name:'Мастер ремонта',icon:'tool',
      title:{ru:'Услуги',en:'Services'},buy:{ru:'Заказать',en:'Order'},
      hero:{ru:['Ремонт квартир без нервов','Смета за один день и фиксированная цена в договоре.','Получить смету'],en:['Renovation without stress','Estimate in one day, fixed price in the contract.','Get an estimate']},
      items:[[['Косметический ремонт','Cosmetic renovation'],['от 40 р./м²','from 40 BYN/m²']],[['Капитальный ремонт','Full renovation'],['от 90 р./м²','from 90 BYN/m²']],[['Электрика','Electrical work'],['от 25 р./точка','from 25 BYN/point']],[['Сантехника','Plumbing'],['от 30 р./точка','from 30 BYN/point']],[['Укладка плитки','Tiling'],['от 35 р./м²','from 35 BYN/m²']],[['Дизайн-проект','Interior design'],['от 15 р./м²','from 15 BYN/m²']]],
      ben:{ru:[['Смета за день','Приедем, замерим, посчитаем'],['Цена в договоре','Итог не вырастет по ходу работ'],['Гарантия 2 года','На все виды работ']],en:[['Estimate in a day','We visit, measure and calculate'],['Fixed price','The total will not grow later'],['2-year warranty','On every kind of work']]},
      defaults:['form','tg','benefits','faq']},
    booking:{label:'Онлайн-запись',name:'Студия красоты',icon:'scissors',
      title:{ru:'Услуги и цены',en:'Services & prices'},buy:{ru:'Выбрать',en:'Choose'},
      hero:{ru:['Запишитесь онлайн за минуту','Выберите услугу и удобное время. Без звонков.','Записаться'],en:['Book online in a minute','Pick a service and a time. No calls needed.','Book now']},
      items:[[['Женская стрижка',"Women's haircut"],35],[['Мужская стрижка',"Men's haircut"],25],[['Окрашивание','Coloring'],90],[['Маникюр','Manicure'],40],[['Укладка','Styling'],30],[['Брови','Brows'],20]],
      ben:{ru:[['Опытные мастера','Стаж от 5 лет'],['Онлайн-запись','В любое время, без звонков'],['Напоминание','Сообщение за день до визита']],en:[['Skilled masters','5+ years of experience'],['Online booking','Any time, no calls'],['Reminder','A message the day before']]},
      defaults:['booking','tg','reviews']},
    food:{label:'Кафе и доставка',name:'Кухня рядом',icon:'bowl',
      title:{ru:'Меню',en:'Menu'},buy:{ru:'Добавить',en:'Add'},
      hero:{ru:['Горячая еда с доставкой за 40 минут','Готовим после заказа. Бесплатная доставка от 30 р.','Открыть меню'],en:['Hot food delivered in 40 minutes','Cooked to order. Free delivery from 30 BYN.','See the menu']},
      items:[[['Боул с лососем','Salmon bowl'],18],[['Паста карбонара','Pasta carbonara'],14],[['Том ям','Tom yum'],16],[['Цезарь с курицей','Chicken Caesar'],12],[['Чизкейк','Cheesecake'],7],[['Лимонад','Lemonade'],5]],
      ben:{ru:[['40 минут','Или следующий заказ за наш счёт'],['Свежие продукты','Готовим после заказа'],['Без минимальной суммы','Даже один кофе']],en:[['40 minutes','Or your next order is on us'],['Fresh food','Cooked after you order'],['No minimum order','Even a single coffee']]},
      defaults:['cart','tg','benefits']}
  };
  var UI={
    ru:{about:'О нас',contacts:'Контакты',why:'Почему мы',reviews:'Отзывы',revNote:'Пример блока. На вашем сайте будут отзывы ваших клиентов.',
      booking:'Онлайн-запись',service:'Услуга',day:'День',time:'Время',book:'Записаться',pick:'Выберите время',chosen:'Вы выбрали',
      booked:'Вы записаны',remind:'Напомним за день.',again:'Записаться ещё раз',
      form:'Оставьте заявку',name:'Имя',phone:'Телефон',need:'Что нужно',send:'Отправить заявку',sent:'Спасибо! Заявка отправлена, перезвоним в течение 15 минут.',sendMore:'Отправить ещё одну',
      errName:'Введите имя, хотя бы 2 буквы',errPhone:'Введите номер полностью',
      faq:'Вопросы',account:'Кабинет',cart:'Корзина',total:'Итого',checkout:'Оформить и оплатить',empty:'Корзина пуста. Добавьте что-нибудь из каталога.',
      paid:' оплачен. Мы уже собираем его.',order:'Заказ №',keep:'Продолжить покупки',hello:'Здравствуйте, Анна!',noOrders:'Здесь будут ваши заказы и записи. Оформите заказ, и он появится тут.',back:'Вернуться на сайт',
      added:'Добавлено ✓',addr:'ул. Примерная, 1 · ежедневно 9:00–21:00',made:'Сайт собран в конструкторе AuraIT',cur:'р.',
      days:['вс','пн','вт','ср','чт','пт','сб'],
      faqList:[['Как быстро вы отвечаете?','В рабочее время в течение 15 минут.'],['Какие способы оплаты?','Карта онлайн, наличные или перевод.'],['Работаете в выходные?','Да, каждый день с 9 до 21.']],
      revList:[['Анна','Всё быстро и аккуратно. Обязательно вернусь.'],['Игорь','Удобно, что всё можно сделать с телефона.'],['Мария','Понятные цены и приятная команда.']]},
    en:{about:'About',contacts:'Contacts',why:'Why us',reviews:'Reviews',revNote:'Sample block. Your site will show reviews from your own clients.',
      booking:'Online booking',service:'Service',day:'Day',time:'Time',book:'Book',pick:'Choose a time',chosen:'Your choice',
      booked:'You are booked',remind:'We will remind you a day before.',again:'Book again',
      form:'Leave a request',name:'Name',phone:'Phone',need:'What you need',send:'Send request',sent:'Thank you! We will call you back within 15 minutes.',sendMore:'Send another one',
      errName:'Enter your name, at least 2 letters',errPhone:'Enter the full number',
      faq:'FAQ',account:'Account',cart:'Cart',total:'Total',checkout:'Checkout and pay',empty:'Your cart is empty. Add something from the catalog.',
      paid:' is paid. We are packing it now.',order:'Order #',keep:'Continue shopping',hello:'Hello, Anna!',noOrders:'Your orders and bookings will appear here.',back:'Back to the site',
      added:'Added ✓',addr:'1 Example St · daily 9:00–21:00',made:'Built with the AuraIT site builder',cur:'BYN',
      days:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      faqList:[['How fast do you reply?','Within 15 minutes during working hours.'],['How can I pay?','Card online, cash or bank transfer.'],['Are you open on weekends?','Yes, every day from 9 am to 9 pm.']],
      revList:[['Anna','Fast and neat. I will definitely come back.'],['Igor','Great that I can do everything from my phone.'],['Maria','Clear prices and a friendly team.']]}
  };

  var BLOCKS=[
    ['cart','Корзина и оплата','Покупка прямо на сайте'],
    ['booking','Онлайн-запись','Дата и время без звонков'],
    ['form','Форма заявки','Имя и телефон в один клик'],
    ['tg','Заказы в Telegram','Уведомление о каждом заказе'],
    ['account','Личный кабинет','История заказов клиента'],
    ['benefits','Преимущества','Почему выбирают именно вас'],
    ['reviews','Отзывы','Слова довольных клиентов'],
    ['faq','Вопросы и ответы','Ответы на частые вопросы'],
    ['lang','Несколько языков','Переключатель RU / EN']
  ];
  var BI={};BLOCKS.forEach(function(b){BI[b[0]]=b});
  var COLORS={
    sea:{n:'Морской',pa:'#16587B',ps:'#E6F0F6',pi:'#0F2733',pm:'#56707E'},
    graphite:{n:'Графит',pa:'#23272B',ps:'#EEF0F2',pi:'#15181B',pm:'#62686E'},
    forest:{n:'Лесной',pa:'#2F6B4F',ps:'#E5F1EA',pi:'#13261C',pm:'#58705F'},
    terra:{n:'Терракота',pa:'#B5543A',ps:'#F8EAE3',pi:'#2A1712',pm:'#7A6159'}
  };
  var FONTS={
    classic:{n:'Классика',ph:'"Playfair Display",Georgia,serif',pb:'"Jost",system-ui,sans-serif'},
    modern:{n:'Современный',ph:'"Jost",system-ui,sans-serif',pb:'"Jost",system-ui,sans-serif'},
    bold:{n:'Смелый',ph:'"Unbounded","Jost",system-ui,sans-serif',pb:'"Jost",system-ui,sans-serif'}
  };

  var S={type:'shop',on:{},color:'sea',font:'classic',lang:'ru',cart:[],orders:[],orderNo:1024,bk:{svc:0,day:0,time:-1},formOk:false,bkOk:false,faqOpen:-1};
  function L(){return UI[S.lang]}
  function T(){return TYPES[S.type]}
  function iname(it){return it[0][S.lang==='en'?1:0]}
  function iprice(it){return typeof it[1]==='number'?it[1]+' '+L().cur:it[1][S.lang==='en'?1:0]}

  /* ---------- smooth step scrolling (fast, eased) ---------- */
  var HEADER=74;
  function goStep(id){
    var el=document.getElementById(id);if(!el)return;
    var y=el.getBoundingClientRect().top+scrollY-HEADER;
    if(reduce){scrollTo(0,y);return}
    var html=document.documentElement,prev=html.style.scrollBehavior;html.style.scrollBehavior='auto';
    var start=scrollY,d=y-start,t0=performance.now(),dur=Math.min(650,Math.max(380,Math.abs(d)*0.45));
    (function f(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);scrollTo(0,start+d*e);if(p<1)requestAnimationFrame(f);else html.style.scrollBehavior=prev})(t0);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#step-"]');if(!a)return;
    e.preventDefault();goStep(a.getAttribute('href').slice(1));
  });

  /* ---------- controls ---------- */
  var elTypes=$('#bTypes'),elTog=$('#bToggles'),elName=$('#bName'),elSum=$('#bSum'),elColors=$('#bColors'),elFonts=$('#bFonts');
  elName.value='';elName.placeholder='Введите название сайта';
  elTypes.innerHTML=Object.keys(TYPES).map(function(k){
    var sub={shop:'одежда, товары',services:'ремонт, мастера',booking:'салоны, студии',food:'еда, кофейни'}[k];
    return '<button class="b-type" type="button" id="type-'+k+'" data-type="'+k+'" aria-pressed="false"><span class="ck">✓</span>'+ICONS[TYPES[k].icon]+'<span><b>'+TYPES[k].label+'</b><small>'+sub+'</small></span></button>';
  }).join('');
  var SV=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
  var FI={
    cart:SV('<path d="M3 4h2l2.4 11h10.2L20 8H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'),
    booking:SV('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    form:SV('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),
    benefits:SV('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
    reviews:SV('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'),
    faq:SV('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7"/><path d="M12 17.5h.01"/>'),
    account:SV('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),
    lang:SV('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>'),
    tg:SV('<path d="M21 4 3 11l7 2 2 7 3-5 5 4z"/><path d="m10 13 11-9"/>')
  };
  var GROUPS=[
    ['Как клиент заказывает','Как люди будут покупать или обращаться к вам.',['cart','booking','form']],
    ['Что убеждает купить','Блоки, которые снимают сомнения перед заказом.',['benefits','reviews','faq']],
    ['Удобство для клиента','Чтобы к вам хотелось возвращаться.',['account','lang']],
    ['Для вас','Чтобы ни один заказ не потерялся.',['tg']]
  ];
  elTog.innerHTML=GROUPS.map(function(g){
    return '<div class="b-group"><h3>'+g[0]+'</h3><p>'+g[1]+'</p><div class="b-rows">'+g[2].map(function(k){
      var b=BI[k],add=P.builder.add[k];
      return '<button class="b-tog" type="button" role="checkbox" id="tog-'+k+'" data-block="'+k+'" aria-checked="false"><span class="cb" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="ic">'+FI[k]+'</span><span class="tx"><b>'+b[1]+'<span class="rec">Рекомендуем</span></b><small>'+b[2]+'</small></span><span class="pr'+(add?'':' free')+'">'+(add?'+'+money(add)+' '+P.currency:'Бесплатно')+'</span></button>';
    }).join('')+'</div></div>';
  }).join('');
  elColors.innerHTML=Object.keys(COLORS).map(function(k){return '<button class="b-color" type="button" id="color-'+k+'" data-color="'+k+'" aria-pressed="false" aria-label="'+COLORS[k].n+'" title="'+COLORS[k].n+'" style="background:'+COLORS[k].pa+'"></button>'}).join('');
  elFonts.innerHTML=Object.keys(FONTS).map(function(k){return '<button class="b-font" type="button" id="font-'+k+'" data-font="'+k+'" aria-pressed="false"><b style="font-family:'+FONTS[k].ph.replace(/"/g,"'")+'">Аа</b><small>'+FONTS[k].n+'</small></button>'}).join('');

  function syncControls(){
    $$('.b-type').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.type===S.type)});
    var rec=T().defaults;
    $$('.b-tog[data-block]').forEach(function(b){b.setAttribute('aria-checked',!!S.on[b.dataset.block]);b.classList.toggle('is-rec',rec.indexOf(b.dataset.block)>-1)});
    $$('.b-color').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.color===S.color)});
    $$('.b-font').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.font===S.font)});
    syncAddr();
  }
  function price(){var n=P.builder.base[S.type];Object.keys(S.on).forEach(function(k){if(S.on[k])n+=P.builder.add[k]||0});return n}
  var lastSum=0,shownSum=0,sumRaf=0;
  function fmtSum(n){return 'от '+money(n)+' '+P.currency}
  function paintSum(n){var t=fmtSum(n);elSum.textContent=t;$('#bSumMini').textContent=t;var f=$('#fsSum');if(f)f.textContent=t}
  function updatePrice(){
    var n=price();
    renderSummary();
    if(!lastSum||reduce){paintSum(n);shownSum=n}
    else if(n!==lastSum){
      cancelAnimationFrame(sumRaf);var from=shownSum,t0=performance.now(),dur=450;
      (function f(t){var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);shownSum=Math.round(from+(n-from)*e);paintSum(shownSum);if(p<1)sumRaf=requestAnimationFrame(f)})(t0);
    }
    lastSum=n;
  }

  /* summary panel: rows slide in and out instead of jumping */
  var fsList=$('#fsList'),fsRows={};
  function fsRow(k,label,val){var li=document.createElement('li');li.dataset.k=k;li.innerHTML='<span>'+label+'</span><span>'+val+'</span>';return li}
  function renderSummary(){
    if(!fsList)return;
    var base=fsList.querySelector('[data-k="base"]');
    var baseText=T().label+': главная и каталог',baseVal=money(P.builder.base[S.type])+' '+P.currency;
    if(!base){base=fsRow('base',baseText,baseVal);fsList.appendChild(base)}else base.innerHTML='<span>'+baseText+'</span><span>'+baseVal+'</span>';
    var prev=base;
    BLOCKS.forEach(function(b){
      var k=b[0],li=fsRows[k];
      if(S.on[k]){
        if(!li||li.classList.contains('out')){
          if(li)li.remove();
          var a=P.builder.add[k];li=fsRow(k,b[1],a?'+'+money(a)+' '+P.currency:'0 '+P.currency);
          if(!reduce){li.classList.add('new');li.addEventListener('animationend',function(){this.classList.remove('new')},{once:true})}
          fsRows[k]=li;prev.after(li);
        }else if(prev.nextElementSibling!==li){prev.after(li)}
        prev=li;
      }else if(li&&!li.classList.contains('out')){
        if(reduce){li.remove();delete fsRows[k]}
        else{li.classList.remove('new');li.classList.add('out');(function(el,key){setTimeout(function(){if(el.classList.contains('out')){el.remove();if(fsRows[key]===el)delete fsRows[key]}},320)})(li,k)}
      }
    });
    var c=BLOCKS.filter(function(b){return S.on[b[0]]}).length;
    $('#fsCount').textContent=c?c+' '+(c===1?'функция выбрана':c<5?'функции выбрано':'функций выбрано'):'Только главная и каталог';
  }

  /* ---------- preview ---------- */
  var screen=$('#bScreen'),site=$('#site'),ov=$('#psOv'),url=$('#bUrl');
  function siteName(){return (elName.value||'').trim()||T().name}
  var TR={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  function slug(s){return s.toLowerCase().split('').map(function(c){return TR[c]!==undefined?TR[c]:c}).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'site'}
  function syncAddr(){var a=slug(siteName())+'.ru';$('#bAddr').textContent=a;if(url)url.textContent=a}
  function applyStyle(){
    var c=COLORS[S.color],f=FONTS[S.font];
    screen.style.setProperty('--pa',c.pa);screen.style.setProperty('--ps',c.ps);screen.style.setProperty('--pi',c.pi);screen.style.setProperty('--pm',c.pm);
    screen.style.setProperty('--ph',f.ph);screen.style.setProperty('--pb',f.pb);
  }

  function hHead(){
    var l=L(),r='<header class="ps-head pw" data-b="head"><button class="ps-logo" type="button" data-act="nav" data-to="top"><i></i><span class="js-name">'+esc(siteName())+'</span></button><div class="ps-nav">';
    r+='<nav class="ps-links"><button type="button" data-act="nav" data-to="items">'+T().title[S.lang]+'</button><button type="button" data-act="nav" data-to="about">'+l.about+'</button><button type="button" data-act="nav" data-to="foot">'+l.contacts+'</button></nav>';
    if(S.on.lang)r+='<span class="ps-lang"><button type="button" data-act="lang" data-l="ru" aria-pressed="'+(S.lang==='ru')+'">RU</button><button type="button" data-act="lang" data-l="en" aria-pressed="'+(S.lang==='en')+'">EN</button></span>';
    if(S.on.account)r+='<button class="ps-icon" type="button" data-act="account">'+ICONS.user+l.account+'</button>';
    if(S.on.cart)r+='<button class="ps-icon" type="button" data-act="cart" aria-label="'+l.cart+'">'+ICONS.cart+'<span class="ps-cnt" id="psCnt">'+S.cart.length+'</span></button>';
    return r+'</div></header>';
  }
  function hHero(){var h=T().hero[S.lang];return '<section class="ps-hero pw" data-b="hero"><h2>'+h[0]+'</h2><p>'+h[1]+'</p><button class="ps-btn" type="button" data-act="nav" data-to="items">'+h[2]+' →</button></section>'}
  function hItems(){
    var t=T();
    return '<section class="ps-sec pw" data-b="items"><h3>'+t.title[S.lang]+'</h3><div class="ps-grid">'+t.items.map(function(it,i){
      var x=[20,55,35,60,25,45][i],y=[25,10,40,20,35,15][i];
      return '<div class="ps-item"><div class="ps-thumb" style="--x:'+x+'%;--y:'+y+'%">'+ICONS[t.icon]+'</div><div class="t">'+iname(it)+'</div><div class="row"><span class="pr">'+iprice(it)+'</span><button class="ps-btn" type="button" data-act="buy" data-i="'+i+'">'+t.buy[S.lang]+'</button></div></div>';
    }).join('')+'</div></section>';
  }
  function hBenefits(){return '<section class="ps-sec alt pw" data-b="benefits"><h3>'+L().why+'</h3><div class="ps-ben">'+T().ben[S.lang].map(function(b,i){return '<div><i>'+(i+1)+'</i><b>'+b[0]+'</b><span>'+b[1]+'</span></div>'}).join('')+'</div></section>'}
  function hReviews(){return '<section class="ps-sec pw" data-b="reviews"><h3>'+L().reviews+'</h3><div class="ps-rev">'+L().revList.map(function(r){return '<div><span class="st">★★★★★</span><p>'+r[1]+'</p><b>'+r[0]+'</b></div>'}).join('')+'</div><p class="ps-note">'+L().revNote+'</p></section>'}
  function days(){var out=[],d=new Date(),w=L().days;for(var i=0;i<5;i++){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+i+1);out.push(w[x.getDay()]+' '+x.getDate())}return out}
  var TIMES=['10:00','11:30','13:00','14:30','16:00','17:30'],BUSY=[1,4];
  function bkChoice(){var D=days(),l=L();return S.bk.time<0?l.pick:iname(T().items[S.bk.svc])+', '+D[S.bk.day]+', '+TIMES[S.bk.time]}
  function hBooking(){
    var t=T(),D=days(),l=L();
    if(S.bkOk)return '<section class="ps-sec alt pw" data-b="booking"><h3>'+l.booking+'</h3><div class="ps-ok">'+ICONS.check+'<div><b>'+l.booked+'</b><span>'+esc(bkChoice())+'. '+l.remind+'</span></div></div><p class="ps-after"><button class="ps-btn ghost" type="button" data-act="bk-again">'+l.again+'</button></p></section>';
    return '<section class="ps-sec alt pw" data-b="booking"><h3>'+l.booking+'</h3><div class="ps-book">'+
      '<span class="lbl">'+l.service+'</span><div class="ps-chips">'+t.items.slice(0,4).map(function(it,i){return '<button class="ps-chip" type="button" data-act="bk-svc" data-i="'+i+'" aria-pressed="'+(S.bk.svc===i)+'">'+iname(it)+'</button>'}).join('')+'</div>'+
      '<span class="lbl">'+l.day+'</span><div class="ps-chips">'+D.map(function(d,i){return '<button class="ps-chip" type="button" data-act="bk-day" data-i="'+i+'" aria-pressed="'+(S.bk.day===i)+'">'+d+'</button>'}).join('')+'</div>'+
      '<span class="lbl">'+l.time+'</span><div class="ps-chips">'+TIMES.map(function(tm,i){var busy=BUSY.indexOf(i)>-1;return '<button class="ps-chip" type="button" data-act="bk-time" data-i="'+i+'" aria-pressed="'+(S.bk.time===i)+'"'+(busy?' disabled':'')+'>'+tm+'</button>'}).join('')+'</div>'+
      '<div class="ps-bkbar"><span class="ps-bksum'+(S.bk.time<0?'':' set')+'" id="psBkSum">'+esc(bkChoice())+'</span><button class="ps-btn" type="button" data-act="bk-send"'+(S.bk.time<0?' aria-disabled="true"':'')+'>'+l.book+'</button></div></div></section>';
  }
  function hForm(){
    var l=L();
    if(S.formOk)return '<section class="ps-sec pw" data-b="form"><h3>'+l.form+'</h3><div class="ps-ok">'+ICONS.check+'<div><b>'+l.sent+'</b></div></div><p class="ps-after"><button class="ps-btn ghost" type="button" data-act="form-again">'+l.sendMore+'</button></p></section>';
    return '<section class="ps-sec pw" data-b="form"><h3>'+l.form+'</h3><div class="ps-form">'+
      '<label class="ps-field"><span>'+l.name+'</span><input class="ps-in" id="psName" maxlength="30" autocomplete="off" placeholder="'+(S.lang==='en'?'Anna':'Анна')+'"><em class="ps-err" id="psNameErr"></em></label>'+
      '<label class="ps-field"><span>'+l.phone+'</span><input class="ps-in" id="psPhone" inputmode="tel" autocomplete="off" placeholder="+7 (___) ___-__-__"><em class="ps-err" id="psPhoneErr"></em></label>'+
      '<label class="ps-field"><span>'+l.need+'</span><select class="ps-in" id="psSvc">'+T().items.map(function(it){return '<option>'+iname(it)+'</option>'}).join('')+'</select></label>'+
      '<div><button class="ps-btn" type="button" data-act="form-send">'+l.send+'</button></div></div></section>';
  }
  function hFaq(){
    return '<section class="ps-sec alt pw ps-faq" data-b="faq"><h3>'+L().faq+'</h3>'+L().faqList.map(function(q,i){
      var open=S.faqOpen===i;
      return '<div class="ps-qa'+(open?' open':'')+'"><button class="ps-q" type="button" data-act="faq" data-i="'+i+'" aria-expanded="'+open+'">'+q[0]+'<span class="pi" aria-hidden="true"></span></button><div class="ps-a"><div><p>'+q[1]+'</p></div></div></div>';
    }).join('')+'</section>';
  }
  function hFoot(){var l=L();return '<footer class="ps-foot pw" data-b="foot"><div><b class="js-name">'+esc(siteName())+'</b><span>'+l.addr+'</span></div><div><span>+7 (900) 000-00-00</span><span>'+l.made+'</span></div></footer>'}
  var ORDER=['head','hero','benefits','items','booking','reviews','form','faq','foot'];
  var MAKERS={head:hHead,hero:hHero,benefits:hBenefits,items:hItems,booking:hBooking,reviews:hReviews,form:hForm,faq:hFaq,foot:hFoot};
  var ALWAYS={head:1,hero:1,items:1,foot:1};
  function visible(id){return ALWAYS[id]||S.on[id]}
  function render(animIds){
    site.innerHTML='<div class="ps">'+ORDER.filter(visible).map(function(id){return MAKERS[id]()}).join('')+'</div>';
    if(!reduce)(animIds||[]).forEach(function(id){var el=site.querySelector('[data-b="'+id+'"]');if(el)el.classList.add('ps-blk')});
    syncAddr();
  }
  function rerender(id,anim){var el=site.querySelector('[data-b="'+id+'"]');if(!el)return;var t=document.createElement('div');t.innerHTML=MAKERS[id]();var n=t.firstChild;el.replaceWith(n);if(anim&&!reduce)n.classList.add('ps-swap')}
  function focusBlock(id){
    var el=site.querySelector('[data-b="'+id+'"]');if(!el)return;
    site.scrollTo({top:id==='head'?0:Math.max(0,el.offsetTop-60),behavior:reduce?'auto':'smooth'});
    if(id!=='head'&&id!=='foot')replay(el,'ps-flash');
  }

  /* overlay: drawer + toast */
  ov.innerHTML='<div class="ps-shade" id="psShade" data-act="close"></div><aside class="ps-drawer" id="psDrawer"><div class="ps-dh"><b id="psDT"></b><button class="ps-x" type="button" data-act="close" aria-label="Закрыть">×</button></div><div class="ps-db" id="psDB"></div><div class="ps-df" id="psDF"></div></aside><div class="ps-toast" id="psToast"></div>';
  var drawer=$('#psDrawer'),shade=$('#psShade'),dB=$('#psDB'),dF=$('#psDF'),dT=$('#psDT'),toastEl=$('#psToast'),tt;
  function toast(t){toastEl.textContent=t;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('on')},2600)}
  function openDrawer(){drawer.classList.add('on');shade.classList.add('on')}
  function closeDrawer(){drawer.classList.remove('on');shade.classList.remove('on')}
  function cartTotal(){return S.cart.reduce(function(s,i){return s+T().items[i][1]},0)}
  function showCart(){
    var t=T(),l=L();dT.textContent=l.cart;
    if(!S.cart.length){dB.innerHTML='<p class="ps-empty">'+l.empty+'</p>';dF.innerHTML='';return}
    var counts={};S.cart.forEach(function(i){counts[i]=(counts[i]||0)+1});
    dB.innerHTML=Object.keys(counts).map(function(i){return '<div class="ps-line"><span>'+iname(t.items[i])+' × '+counts[i]+'</span><span>'+(t.items[i][1]*counts[i])+' '+l.cur+'</span></div>'}).join('');
    dF.innerHTML='<div class="tot"><span>'+l.total+'</span><span>'+cartTotal()+' '+l.cur+'</span></div><button class="ps-btn" type="button" data-act="checkout">'+l.checkout+'</button>';
  }
  function showAccount(){
    var l=L();dT.textContent=l.account;
    dB.innerHTML='<p style="font-size:.9rem">'+l.hello+'</p>'+(S.orders.length?S.orders.map(function(o){return '<div class="ps-line"><span>'+l.order+o.no+'<br><small style="color:var(--pm)">'+esc(o.what)+'</small></span><span>'+o.sum+'</span></div>'}).join(''):'<p class="ps-empty">'+l.noOrders+'</p>');
    dF.innerHTML='<button class="ps-btn ghost" type="button" data-act="close">'+l.back+'</button>';
  }
  function bumpCount(){var c=$('#psCnt');if(!c)return;c.textContent=S.cart.length;replay(c,'bump')}

  /* telegram feed (always in Russian: it is the owner's chat) */
  var tgBody=$('#tgBody'),tgOff=$('#tgOff'),tgBox=$('#bTg');
  function tg(title,lines){
    if(!S.on.tg){toast('Готово. Включите «Заказы в Telegram», чтобы получать уведомления');return}
    var e=$('.tg-empty',tgBody);if(e)e.remove();
    var m=document.createElement('div');m.className='tg-msg';
    m.innerHTML='<b>'+title+'</b>'+lines.map(esc).join('<br>')+'<time>'+now()+'</time>';
    tgBody.appendChild(m);tgBody.scrollTop=tgBody.scrollHeight;
    var cn=$('#tgCount');cn.textContent=+cn.textContent+1;replay(cn,'bump');replay(tgBox,'ping');
  }
  function syncTg(){tgOff.hidden=!!S.on.tg}

  /* phone mask: +7 (999) 123-45-67 */
  function maskPhone(v){
    var d=v.replace(/\D/g,'');
    if(/^\+7/.test(v))d=d.slice(1);else if(d.length>10&&(d[0]==='7'||d[0]==='8'))d=d.slice(1);
    if(d.length===1&&(d==='8'||d==='7'))d='';
    d=d.slice(0,10);
    var r='+7';if(d.length)r+=' ('+d.slice(0,3);if(d.length>=3)r+=')';if(d.length>3)r+=' '+d.slice(3,6);if(d.length>6)r+='-'+d.slice(6,8);if(d.length>8)r+='-'+d.slice(8,10);
    return r;
  }
  site.addEventListener('input',function(e){
    if(e.target.id==='psPhone'){e.target.value=maskPhone(e.target.value);fieldOk(e.target)}
    if(e.target.id==='psName'){e.target.value=e.target.value.replace(/[^A-Za-zА-Яа-яЁё\s\-]/g,'').replace(/\s{2,}/g,' ');fieldOk(e.target)}
  });
  site.addEventListener('focusin',function(e){if(e.target.id==='psPhone'&&!e.target.value)e.target.value='+7 ('});
  site.addEventListener('focusout',function(e){if(e.target.id==='psPhone'&&e.target.value.replace(/\D/g,'').length<=1)e.target.value=''});
  site.addEventListener('keydown',function(e){if(e.target.id==='psPhone'&&e.key==='Backspace'&&/\D$/.test(e.target.value)){e.preventDefault();var d=e.target.value.replace(/\D/g,'').slice(1,-1);e.target.value=d?maskPhone('7'+d):'+7 ('}});
  function fieldErr(inp,msg){var f=inp.closest('.ps-field');f.classList.add('bad');f.querySelector('.ps-err').textContent=msg;replay(f,'shake')}
  function fieldOk(inp){var f=inp.closest('.ps-field');if(f&&f.classList.contains('bad')){f.classList.remove('bad');f.querySelector('.ps-err').textContent=''}}

  /* booking: update choices in place so chips animate */
  function syncBooking(clicked){
    var sec=site.querySelector('[data-b="booking"]');if(!sec)return;
    $$('[data-act="bk-svc"]',sec).forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.i===S.bk.svc)});
    $$('[data-act="bk-day"]',sec).forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.i===S.bk.day)});
    $$('[data-act="bk-time"]',sec).forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.i===S.bk.time)});
    if(clicked&&!reduce)replay(clicked,'pop');
    var s=$('#psBkSum',sec),send=$('[data-act="bk-send"]',sec);
    s.textContent=bkChoice();s.classList.toggle('set',S.bk.time>=0);replay(s,'swap');
    if(S.bk.time>=0){send.removeAttribute('aria-disabled');if(clicked&&clicked.dataset.act==='bk-time')replay(send,'ready')}
  }

  /* preview interactions */
  function act(e){
    var b=e.target.closest('[data-act]');if(!b)return;
    var a=b.dataset.act,t=T(),l=L(),i=+b.dataset.i;
    if(a==='nav'){
      var to=b.dataset.to;
      if(to==='top')focusBlock('head');
      else if(to==='about')focusBlock(S.on.benefits?'benefits':S.on.reviews?'reviews':'foot');
      else focusBlock(to);
    }
    else if(a==='buy'){
      if(S.type==='services'){
        if(S.on.form){focusBlock('form');var sel=$('#psSvc');if(sel)sel.selectedIndex=i}
        else toast('Включите «Форму заявки», чтобы клиенты могли заказать услугу');
      }else if(S.type==='booking'){
        if(S.on.booking){S.bk.svc=Math.min(i,3);if(S.bkOk){S.bkOk=false;rerender('booking',true)}else syncBooking();focusBlock('booking')}
        else toast('Включите «Онлайн-запись», чтобы клиенты записывались сами');
      }else{
        if(!S.on.cart){toast('Включите «Корзину и оплату», чтобы покупать на сайте');return}
        S.cart.push(i);bumpCount();b.textContent=l.added;b.classList.add('done');
        setTimeout(function(){b.textContent=t.buy[S.lang];b.classList.remove('done')},1200);
        toast(iname(t.items[i])+(S.lang==='en'?' added to cart':' в корзине'));
      }
    }
    else if(a==='cart'){showCart();openDrawer()}
    else if(a==='account'){showAccount();openDrawer()}
    else if(a==='close')closeDrawer();
    else if(a==='checkout'){
      var no=++S.orderNo,sum=cartTotal(),names={};
      S.cart.forEach(function(k){var n=t.items[k][0][0];names[n]=(names[n]||0)+1});
      var what=Object.keys(names).map(function(k){return k+' × '+names[k]});
      S.orders.unshift({no:no,what:what.join(', '),sum:sum+' '+l.cur});
      S.cart=[];bumpCount();
      dB.innerHTML='<div class="ps-ok">'+ICONS.check+'<div><b>'+l.order+no+l.paid+'</b></div></div>';dF.innerHTML='<button class="ps-btn ghost" type="button" data-act="close">'+l.keep+'</button>';
      tg('Новый заказ №'+no,what.concat(['Итого: '+sum+' р., оплачено картой']));
    }
    else if(a==='form-send'){
      var nmEl=$('#psName'),phEl=$('#psPhone'),nm=nmEl.value.trim(),ph=phEl.value,sv=$('#psSvc').value,ok=true;
      if(nm.replace(/[\s\-]/g,'').length<2){fieldErr(nmEl,l.errName);ok=false}
      if(ph.replace(/\D/g,'').length<11){fieldErr(phEl,l.errPhone);ok=false}
      if(!ok)return;
      S.formOk=true;rerender('form',true);
      if(S.on.account)S.orders.unshift({no:++S.orderNo,what:'Заявка: '+sv,sum:'—'});
      tg('Новая заявка с сайта',[nm+', '+ph,'Нужно: '+sv]);
    }
    else if(a==='form-again'){S.formOk=false;rerender('form',true)}
    else if(a==='bk-svc'){S.bk.svc=i;syncBooking(b)}
    else if(a==='bk-day'){S.bk.day=i;syncBooking(b)}
    else if(a==='bk-time'){S.bk.time=i;syncBooking(b)}
    else if(a==='bk-send'){
      if(S.bk.time<0){toast(l.pick);replay($('#psBkSum'),'shake');return}
      var D=days(),choice=bkChoice();S.bkOk=true;rerender('booking',true);
      if(S.on.account)S.orders.unshift({no:++S.orderNo,what:'Запись: '+choice,sum:'—'});
      tg('Новая запись',[t.items[S.bk.svc][0][0],D[S.bk.day]+', '+TIMES[S.bk.time]]);
    }
    else if(a==='bk-again'){S.bkOk=false;S.bk.time=-1;rerender('booking',true)}
    else if(a==='faq'){
      var item=b.parentNode,open=!item.classList.contains('open');
      $$('.ps-qa',item.parentNode).forEach(function(q){q.classList.remove('open');q.querySelector('.ps-q').setAttribute('aria-expanded','false')});
      if(open){item.classList.add('open');b.setAttribute('aria-expanded','true')}
      S.faqOpen=open?i:-1;
    }
    else if(a==='lang'){
      if(S.lang===b.dataset.l)return;
      var y=site.scrollTop;S.lang=b.dataset.l;render();site.scrollTop=y;
      if(!reduce)replay(site.firstChild,'ps-fade');
    }
  }
  site.addEventListener('click',act);ov.addEventListener('click',act);

  /* ---------- control events ---------- */
  function setType(t,extra){
    S.type=t;S.on={};TYPES[t].defaults.concat(extra||[]).forEach(function(k){S.on[k]=true});
    S.cart=[];S.formOk=false;S.bkOk=false;S.bk={svc:0,day:0,time:-1};S.lang='ru';S.faqOpen=-1;closeDrawer();
    syncControls();updatePrice();syncTg();render(ORDER.filter(visible));site.scrollTop=0;
  }
  elTypes.addEventListener('click',function(e){
    var b=e.target.closest('.b-type');if(!b)return;
    if(b.dataset.type!==S.type)setType(b.dataset.type);
    setTimeout(function(){goStep('step-name');if(finePointer)setTimeout(function(){elName.focus({preventScroll:true})},500)},reduce?0:140);
  });
  elTog.addEventListener('click',function(e){
    var b=e.target.closest('.b-tog[data-block]');if(!b)return;
    var k=b.dataset.block;S.on[k]=!S.on[k];
    if(k==='lang'&&!S.on.lang)S.lang='ru';
    syncControls();updatePrice();syncTg();render();
  });
  elName.addEventListener('input',function(){$$('.js-name',site).forEach(function(n){n.textContent=siteName()});syncAddr()});
  elName.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();elName.blur();goStep('step-features')}});
  elColors.addEventListener('click',function(e){var b=e.target.closest('.b-color');if(!b)return;S.color=b.dataset.color;applyStyle();syncControls()});
  elFonts.addEventListener('click',function(e){var b=e.target.closest('.b-font');if(!b)return;S.font=b.dataset.font;applyStyle();syncControls()});
  $$('.b-dev button').forEach(function(b){b.addEventListener('click',function(){
    $$('.b-dev button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    var dv=$('#bDevice');if(dv.classList.contains('phone')!==(b.dataset.dev==='phone')){dv.classList.toggle('phone',b.dataset.dev==='phone');if(!reduce)replay(dv,'swap')}
  })});
  $('#fsReset').addEventListener('click',function(){
    S.on={};T().defaults.forEach(function(k){S.on[k]=true});S.lang='ru';
    syncControls();updatePrice();syncTg();render();
  });

  /* brief for Telegram */
  function brief(){
    var on=BLOCKS.filter(function(b){return S.on[b[0]]}).map(function(b){return b[1].toLowerCase()});
    return 'Здравствуйте! Хочу сайт от AuraIT.\nТип: '+T().label+'\nНазвание: '+siteName()+'\nФункции: главная, каталог'+(on.length?', '+on.join(', '):'')+'\nСтиль: '+COLORS[S.color].n.toLowerCase()+' цвет, шрифт «'+FONTS[S.font].n+'»\nОриентир по цене: '+fmtSum(price());
  }
  function copyText(text,done,fail){
    function fb(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(_){fail()}t.remove()}
    try{navigator.clipboard.writeText(text).then(done,fb)}catch(_){fb()}
  }
  /* order: shared phone modal from site.js, with the assembled site attached */
  $('#bSend').addEventListener('click',function(){window.auraOrder&&window.auraOrder(brief())});
  $('#bOrder').addEventListener('click',function(){window.auraOrder&&window.auraOrder(brief())});

  /* full-screen test site */
  var ovEl=$('#bOv'),buildEl=$('#bBuild'),buildList=$('#bBuildList'),lastFocus=null;
  function openSite(){
    lastFocus=document.activeElement;closeDrawer();render();site.scrollTop=0;
    var steps=['Дизайн и шрифты','Главная страница',T().title.ru].concat(BLOCKS.filter(function(b){return S.on[b[0]]}).map(function(b){return b[1]}));
    buildList.innerHTML=steps.map(function(t){return '<li><i>✓</i>'+t+'</li>'}).join('');
    var lis=$$('li',buildList),step=reduce?0:Math.min(200,1300/lis.length),total=reduce?0:300+lis.length*step+450;
    buildEl.style.setProperty('--dur',(total/1000)+'s');
    buildEl.classList.remove('done','go');
    ovEl.classList.add('on');document.body.classList.add('lock');
    void buildEl.offsetWidth;buildEl.classList.add('go');
    lis.forEach(function(li,i){setTimeout(function(){li.classList.add('on')},150+i*step)});
    setTimeout(function(){buildEl.classList.add('done');$('#bBack').focus()},total);
  }
  function closeSite(){ovEl.classList.remove('on','tg-open');document.body.classList.remove('lock');closeDrawer();if(lastFocus)lastFocus.focus({preventScroll:true})}
  $('#bMake').addEventListener('click',openSite);
  $('#bBack').addEventListener('click',closeSite);
  $('#tgFab').addEventListener('click',function(){ovEl.classList.toggle('tg-open')});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ovEl.classList.contains('on')){if(drawer.classList.contains('on'))closeDrawer();else closeSite()}});

  /* step dots follow the scroll */
  var dots=$$('.b-dots a');
  if('IntersectionObserver' in window){
    var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){dots.forEach(function(d){d.classList.toggle('on',d.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -45% 0px'});
    $$('.b-step').forEach(function(sec){sio.observe(sec)});
  }

  /* presets from the link: builder.html#shop, #services, #booking, #food, #account, #auto */
  function fromHash(){
    var h=location.hash.replace('#','');
    if(TYPES[h])setType(h);
    else if(h==='account')setType('shop',['account']);
    else if(h==='auto')setType('services',['tg','form']);
    else if(h==='landing')setType('services');
    else if(!S.inited)setType('shop');
    S.inited=true;
  }
  addEventListener('hashchange',fromHash);
  applyStyle();fromHash();
})();
