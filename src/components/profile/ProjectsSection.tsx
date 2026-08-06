"use client";

import { useEffect, useState } from "react";
import ProjectForm from "@/components/profile/ProjectForm";
import { ApiError } from "@/lib/api";
import { listExperiences, type Experience } from "@/lib/experiences";
import { listSkills, type Skill } from "@/lib/skills";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
  type Project,
  type ProjectInput,
} from "@/lib/projects";

type Mode = { type: "list" } | { type: "adding" } | { type: "editing"; id: number };

const emptyValues: ProjectInput = {
  name: "",
  description: null,
  responsibilities: null,
  achievements: null,
  start_date: null,
  end_date: null,
  url: null,
  experience_id: null,
  skill_ids: [],
};

function toInput(project: Project): ProjectInput {
  return {
    name: project.name,
    description: project.description,
    responsibilities: project.responsibilities,
    achievements: project.achievements,
    start_date: project.start_date,
    end_date: project.end_date,
    url: project.url,
    experience_id: project.experience_id,
    skill_ids: project.skills.map((skill) => skill.id),
  };
}

function formatRange(project: Project): string | null {
  if (!project.start_date && !project.end_date) return null;
  const start = project.start_date ?? "?";
  const end = project.end_date ?? "Present";
  return `${start} – ${end}`;
}

export default function ProjectsSection() {
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([listProjects(), listExperiences(), listSkills()])
      .then(([projectsData, experiencesData, skillsData]) => {
        if (cancelled) return;
        setProjects(projectsData);
        setExperiences(experiencesData);
        setSkills(skillsData);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load projects."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...projects].sort((a, b) =>
    (b.start_date ?? "").localeCompare(a.start_date ?? "")
  );

  async function handleAdd(values: ProjectInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const created = await createProject(values);
      setProjects((prev) => [...prev, created]);
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save project."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(id: number, values: ProjectInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateProject(id, values);
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? updated : project))
      );
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save project."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this project?")) return;
    setActionError(null);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete project."
      );
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-base font-medium text-gray-900">Projects</h2>
        {mode.type === "list" && (
          <button
            type="button"
            onClick={() => setMode({ type: "adding" })}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Add project
          </button>
        )}
      </div>

      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading projects...</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{loadError}</p>}

      {status === "ready" && (
        <div className="flex flex-col gap-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}

          {mode.type === "adding" && (
            <div>
              <ProjectForm
                initialValues={emptyValues}
                experiences={experiences}
                skills={skills}
                onSubmit={handleAdd}
                onCancel={() => setMode({ type: "list" })}
                isSubmitting={isSubmitting}
                submitLabel="Add project"
              />
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
            </div>
          )}

          {sorted.length === 0 && mode.type === "list" && (
            <p className="text-sm text-gray-600">No projects added yet.</p>
          )}

          <div className="divide-y divide-gray-200">
            {sorted.map((project) => {
              const relatedExperience = experiences.find(
                (exp) => exp.id === project.experience_id
              );
              const range = formatRange(project);

              return mode.type === "editing" && mode.id === project.id ? (
                <div key={project.id} className="py-4">
                  <ProjectForm
                    initialValues={toInput(project)}
                    experiences={experiences}
                    skills={skills}
                    onSubmit={(values) => handleEdit(project.id, values)}
                    onCancel={() => setMode({ type: "list" })}
                    isSubmitting={isSubmitting}
                    submitLabel="Save changes"
                  />
                  {formError && (
                    <p className="mt-2 text-sm text-red-600">{formError}</p>
                  )}
                </div>
              ) : (
                <div key={project.id} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}
                        {relatedExperience && ` · ${relatedExperience.title}`}
                      </p>
                      {range && (
                        <p className="text-xs text-gray-600">{range}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setMode({ type: "editing", id: project.id })
                        }
                        className="text-sm text-gray-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {project.description && (
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                      {project.description}
                    </p>
                  )}
                  {project.responsibilities && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Responsibilities: </span>
                      <span className="whitespace-pre-line">
                        {project.responsibilities}
                      </span>
                    </p>
                  )}
                  {project.achievements && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Achievements: </span>
                      <span className="whitespace-pre-line">
                        {project.achievements}
                      </span>
                    </p>
                  )}
                  {project.skills.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {project.skills.map((skill) => skill.name).join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
