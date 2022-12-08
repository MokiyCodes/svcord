// expose client
import * as Client from './api';
// @ts-ignore
window.Client = Client;

// expose gateway
import * as Gateway from './api/gateway';
// @ts-ignore
window.Gateway = Gateway;

// @ts-ignore
window.debugapi = (token:string)=>{
  const p = document.querySelector('p');
  Client.login(token);
  // @ts-ignore
  window.evs = window.evs ?? {};
  // @ts-ignore
  const evs = window.evs;
  const opcodes = [10];
  const events = [];
  let eventCount = 0;
  const connectedAt = Date.now();
  Client.active.gateway.on('DISPATCH', v=>{
    eventCount++;
    if (!opcodes.includes(v.op))
      opcodes.push(v.op);
    if (!events.includes(v.t))
      events.push(v.t);
    if (!evs[v.t])
      evs[v.t] = v;
    p.innerText = `Connected ${Math.floor((Date.now() - connectedAt) / 1000)} seconds ago\n\n\nLast Event Type: ${v.t}\nEvent Count: ${eventCount}\nOpcodes Received: ${opcodes.join(', ')}\nEvents Received: ${events.join(', ')}`;
  });
  Client.active.on('ConnectionEstablished', ()=>p.innerText = 'WS Connected');
  Client.active.on('Hello', ()=>p.innerHTML = 'Completed <code>HELLO</code> Handshake - Waiting for events');
  Client.active.on('Ready', ()=>p.innerHTML = 'Received <code>READY</code> data!');
};

// render shit
import './app.css';
import App from './App.svelte';

const app = new App({ 'target': document.getElementById('app') });

export default app;
