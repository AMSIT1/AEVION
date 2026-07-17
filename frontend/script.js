const msgs=["Initializing...","Loading Brain...","Starting Voice Engine...","Preparing Intelligence...","Welcome."];
let i=0,m=document.getElementById("msg");
let t=setInterval(()=>{m.textContent=msgs[i++];if(i===msgs.length){clearInterval(t);setTimeout(()=>{boot.style.display="none";app.classList.remove("hidden")},600)}},700);
talk.onclick=()=>{status.textContent="● Listening...";wave.textContent="▂▅█▇▅▂";setTimeout(()=>{status.textContent="● Ready to listen";wave.textContent="▁▂▁▁▂▁"},2000)}