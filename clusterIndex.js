// const express = require("express");
const cluster = require("cluster");
// const app = express();
const port = process.env.PORT || 5060;

const cpuCount = require("os").cpus().length;
// console.log(cpuCount); //we have 4 cores

/*
creating new functions to create clusters
[1] in if condition. it will be masterprocess so it will create new 4 clusster
[2] cluster fork is to create cluster and exit is when cluster is died it will create a new cluster.
[3] now in else all 4 are child process. so it will create new app in all 4 clusters dividing load by 4.
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
