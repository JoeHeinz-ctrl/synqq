import axios from "axios";

interface TaskPayload {
    title: string;
    project_id: number;
    status: string;
}

export const createTask = async (task: TaskPayload) => {
    const token = localStorage.getItem("token");

    return axios.post(
        "http://127.0.0.1:8000/tasks/",
        task,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
