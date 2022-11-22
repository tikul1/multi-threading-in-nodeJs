const { parentPort } = require("worker_threads");
//
//[1] praentPort is class is used to send msg to the main thread when completion of task.
//[2] we will use same calculation which we will remove from index file.
//
let counter = 0;
for (let i = 0; i < 20_000_000_000; i++) {
  counter++;
}

parentPort.postMessage(counter);
//
//postMessage will contain counter and deliver it to the main thread when task completes.
//
