const { parentPort } = require("worker_threads");
//
//[1] praentPort is class is used to send msg to the main thread when completion of task.
//[2] we will use same calculation which we will remove from index file.
//[3] workerdata is to import worker threads ==> workerData.thread_count. which is 4 in my system
//[4] so 20 billion divided by 4. so our performance will be 4 times better than before.
let counter = 0;
for (let i = 0; i < 20_000_000_000 / 4; i++) {
  counter++;
}

parentPort.postMessage(counter);
//
//postMessage will contain counter and deliver it to the main thread when task completes.
//
