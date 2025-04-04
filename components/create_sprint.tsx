import { useState, useEffect } from "react";
interface ApiResponse {
  message: string;
}
interface SprintPayload {
  user_id: string;
  project_id: number;
  name: string;
  start_date: string;
  end_date: string;
}

const CreateSprint = () => {
  const [responseMessage, setResponseMessage] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    try {
      const payload: SprintPayload = {
        user_id: "23bcy38",
        project_id: 3,
        name: "Sprint 3",
        start_date: "2025-04-05",
        end_date: "2025-04-15",
      };
      const response = await fetch("http://127.0.0.1:5000/project/create_sprint", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResponseMessage(data);
      console.log("Server Response:", data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
      console.error("Error fetching data:", error);
    }
  };
};
export default CreateSprint;