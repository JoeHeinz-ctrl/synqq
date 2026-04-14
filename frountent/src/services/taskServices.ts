import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.dozzl.xyz";

interface TaskPayload {
    title: string;
    project_id: number;
    status: string;
}

export const createTask = async (task: TaskPayload) => {
    const token = localStorage.getItem("token");

    return axios.post(
        `${API_URL}/tasks/`,
        task,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
