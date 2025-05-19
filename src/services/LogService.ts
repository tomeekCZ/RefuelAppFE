// services/LogService.ts
import type { RefuelLog } from "../types/RefuelLog";

const API_BASE = "http://localhost:8000/api/logs";

export const LogService = {
  async getLogs(): Promise<RefuelLog[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Failed to fetch logs");
    return await response.json();
  },

  async getLog(id: number): Promise<RefuelLog> {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch log");
    return await response.json();
  },

  async saveLog(log: RefuelLog): Promise<void> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error("Failed to save log");
  },

  async updateLog(log: RefuelLog): Promise<void> {
    const response = await fetch(`${API_BASE}/${log.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error("Failed to update log");
  },

  async deleteLog(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete log");
  },
};
