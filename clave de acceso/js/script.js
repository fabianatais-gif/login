
const R_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const R_NAME  = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
const R_PASS  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const R_PHONE = /^[0-9]{7,12}$/;


function toggle(inputId, eyeId){
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  if(!input) return;

  if(input.type === "password"){
    input.type = "text";
    eye.innerText = "🙈";
  }else{
    input.type = "password";
    eye.innerText = "👁";
  }
}


function showTab(tab){
  document.getElementById("register").classList.add("hidden");
  document.getElementById("login").classList.add("hidden");
  document.getElementById("recover").classList.add("hidden");

  document.getElementById(tab === "register" ? "tR" : tab === "login" ? "tL" : "tC").classList.add("active");
  document.getElementById(tab).classList.remove("hidden");

  document.getElementById("tR").classList.remove("active");
  document.getElementById("tL").classList.remove("active");
  document.getElementById("tC").classList.remove("active");

  document.getElementById(tab === "register" ? "tR" : tab === "login" ? "tL" : "tC").classList.add("active");
}

// registro
function register(){
  const n = document.getElementById("name").value.trim();
  const e = document.getElementById("email").value.trim();
  const p = document.getElementById("phone").value.trim();
  const c = document.getElementById("pass").value;

  if(!R_NAME.test(n))  return msg.innerText="❌ Nombre inválido", false;
  if(!R_EMAIL.test(e)) return msg.innerText="❌ Correo inválido", false;
  if(!R_PHONE.test(p)) return msg.innerText="❌ Celular inválido", false;
  if(!R_PASS.test(c))  return msg.innerText="❌ Contraseña insegura", false;

  if(localStorage.getItem(e)) return msg.innerText="⚠️ Ya existe esa cuenta", false;

  const user = {name:n, phone:p, pass:c, tries:0, lock:false};
  localStorage.setItem(e, JSON.stringify(user));
  msg.innerText="✔ Cuenta creada!";
  return false;
}

// iniciar sesion
function login(){
  const e = document.getElementById("loginEmail").value.trim();
  const c = document.getElementById("loginPass").value;

  const u = JSON.parse(localStorage.getItem(e));
  if(!u) return loginMsg.innerText="No registrado", false;
  if(u.lock) return loginMsg.innerText="Cuenta bloqueada por intentos fallidos.", false;

  if(c === u.pass){
    loginMsg.innerText="✔ Bienvenido al sistema, "+u.name;
    u.tries=0;
    u.lock=false;
  }else{
    u.tries++;
    if(u.tries >= 3) u.lock=true;
    loginMsg.innerText = u.lock ? "Cuenta bloqueada por intentos fallidos." : "Usuario o contraseña incorrectos.";
  }

  localStorage.setItem(e, JSON.stringify(u));
  return false;
}

// recuperar
function recover(){
  const e = document.getElementById("recoverEmail").value.trim();
  const c = document.getElementById("newPass").value;

  const u = JSON.parse(localStorage.getItem(e));
  if(!u) return recoverMsg.innerText="Correo no encontrado", false;
  if(!R_PASS.test(c)) return recoverMsg.innerText="Contraseña insegura", false;

  u.pass = c;
  u.tries=0;
  u.lock=false;
  localStorage.setItem(e, JSON.stringify(u));
  recoverMsg.innerText="✔ Contraseña actualizada. Ahora puede iniciar sesión.";
  return false;
}
