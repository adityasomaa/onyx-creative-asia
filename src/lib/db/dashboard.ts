/**
 * Dashboard aggregates — one call returns everything /agents/dashboard
 * needs, so the page is a single round-trip to the DB.
 */

import { countProjectsByBucket, countProjectsByStage, type ProjectBuckets } from "./projects";
import {
  countSubmissionsByStatus,
  SUBMISSION_STATUS_LABEL,
} from "./submissions";
import { countClientsByStatus } from "./clients";
import type { ClientStatus, ProjectStage, SubmissionStatus } from "./types";

export type DashboardSummary = {
  projects: ProjectBuckets;
  projectStages: Record<ProjectStage, number>;
  submissions: Record<SubmissionStatus, number>;
  submissionLabels: Record<SubmissionStatus, string>;
  clients: Record<ClientStatus, number>;
  generatedAt: string;
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [projects, projectStages, submissions, clients] = await Promise.all([
    countProjectsByBucket(),
    countProjectsByStage(),
    countSubmissionsByStatus(),
    countClientsByStatus(),
  ]);

  return {
    projects,
    projectStages,
    submissions,
    submissionLabels: SUBMISSION_STATUS_LABEL,
    clients,
    generatedAt: new Date().toISOString(),
  };
}
