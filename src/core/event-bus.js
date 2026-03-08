const listeners = {};

function on(event, fn) {
  (listeners[event] ||= []).push(fn);
}

function off(event, fn) {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter(f => f !== fn);
}

function emit(event, ...args) {
  (listeners[event] || []).forEach(fn => fn(...args));
}
