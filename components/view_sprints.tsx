import { useState, useEffect } from "react";
interface Sprint {
  name: string;
  sprint_id: number;
}
interface ApiResponse {
  sprints: Sprint[];
}
const ProjectSprints = (project_id:string) => {
  const [sprintsData, setSprintsData] = useState<ApiResponse | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/project/view_sprints?project_id=${project_id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSprintsData(data);
        console.log("Server Response:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
} 
export default ProjectSprints;