const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const { Worker } = require("worker_threads");

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
*/
app.get("/blocking", async (req, res) => {
  //   let counter = 0;
  //   for (let i = 0; i < 20_000_000_000; i++) {
  //      counter++;
  //   }
  //   const counter = await calculation();

  const worker = new Worker("./workerThreadIndex");
  worker.on("message", (data) => {
    res.status(200).send(`result is ${data}`);
  });
  worker.on("error", (err) => {
    res.status(401).send(`an error occured: ${err}`);
  });
  //   res.status(200).send(`result is ${counter}`);
});

/*
 [note] ==> but if we open first blocking page and then non-blocking page then it will wait for to blocking page to
 complete then it will execute non-blocking page. as node js is single threaded
*/

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
