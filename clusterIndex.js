// const express = require("express");
const cluster = require("cluster");
// const app = express();
const port = process.env.PORT || 5060;

const cpuCount = require("os").cpus().length;
// console.log(cpuCount); //we have 4 cores

/*
creating new functions to create clusters
*/

//to check cluster
if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`master process ${process.pid} is running`);

  for (let i = 0; i < cpuCount; i++) {
    console.log(`cluster number ${i}`);
    cluster.fork(); // to create a new node js cluster
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} is died`);
    cluster.fork();
  });
}
function childProcess() {
  const express = require("express");
  const app = express();

  app.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-locking");
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
