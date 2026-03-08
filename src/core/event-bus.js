const listeners = {};

function on(event, fn) {
  (listeners[event] ||= []).push(fn);
}

function emit(event, ...args) {
  (listeners[event] || []).forEach(fn => fn(...args));
}
