const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const { Worker } = require("worker_threads");
const THREAD_COUNT = 4;
/*
[5] now creating a new function to create worker_threads as pr the load of request.
*/

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./workerThreadIndex");
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}

/*
[1] a non-blocking page it will be run instantly
*/

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-locking");
});

/* 
[3] now creating function with promise to test blocking for loop
 */

/*
[4] we will remove function and import worker which we created.
*/
// function calculation() {
//   return new Promise((resolve, reject) => {
//     let counter = 0;
//     for (let i = 0; i < 20_000_000_000; i++) {
//       counter++;
//     }
//     resolve(counter);
//   });
// }

/*
[2] a blocking page which will take some time to execute.
    as it has complex calculation within a for loop
    ==> removed line 54 to 57
    ==> removed line 59 for function
    ==> removed line 61 to 68 to use function for worker thread
*/
app.get("/blocking", async (req, res) => {
  //   let counter = 0;
  //   for (let i = 0; i < 20_000_000_000; i++) {
  //      counter++;
  // //   }
  // const counter = await calculation();
  // const worker = new Worker("./workerThreadIndex");
  // worker.on("message", (data) => {
  //   res.status(200).send(`result is ${data}`);
  // });
  // worker.on("error", (err) => {
  //   res.status(401).send(`an error occured: ${err}`);
  // });
  console.time();
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }

  const thread_results = await Promise.all(workerPromises);
  const total = thread_results[0] + thread_results[1] + thread_results[2] + thread_results[3];
  console.log(thread_results[0]);
  res.status(200).send(`result is ${total}`);
  console.timeEnd();
});

/*
 [note] ==> but if we open first blocking page and then non-blocking page then it will wait for to blocking page to
 complete then it will execute non-blocking page. as node js is single threaded
*/

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
