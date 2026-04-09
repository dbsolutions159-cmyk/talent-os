const Orchestrator = require("./agents/orchestrator");
const Recruiter = require("./agents/recruiter");
const Screening = require("./agents/screening");
const Interview = require("./agents/interview");
const Decision = require("./agents/decision");
const Communication = require("./agents/communication");

const orchestrator = new Orchestrator({
  recruiter: new Recruiter(),
  screening: new Screening(),
  interview: new Interview(),
  decision: new Decision(),
  communication: new Communication()
});

(async () => {
  const job = {
    skill: "Node.js"
  };

  const result = await orchestrator.run(job);

  console.log("FINAL SELECTED:", result);
})();