import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ResumeUpload from "../components/ResumeUpload";
import ResultCard from "../components/ResultCard";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "20px", width: "100%" }}>
        <h1>AI Hiring Dashboard</h1>

        <ResumeUpload setResult={setResult} />

        <ResultCard data={result} />
      </div>
    </div>
  );
}