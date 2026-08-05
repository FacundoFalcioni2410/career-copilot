"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import {
  createSkills,
  deleteSkill,
  listSkills,
  type Skill,
} from "@/lib/skills";

const inputClassName =
  "rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900";

const UNCATEGORIZED = "Uncategorized";

function groupByCategory(skills: Skill[]): Array<[string, Skill[]]> {
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const key = skill.category ?? UNCATEGORIZED;
    const group = groups.get(key);
    if (group) {
      group.push(skill);
    } else {
      groups.set(key, [skill]);
    }
  }

  return [...groups.entries()].sort(([a], [b]) => {
    if (a === UNCATEGORIZED) return 1;
    if (b === UNCATEGORIZED) return -1;
    return a.localeCompare(b);
  });
}

export default function SkillsSection() {
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    listSkills()
      .then((data) => {
        if (cancelled) return;
        setSkills(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load skills."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setActionError(null);
    setIsSubmitting(true);
    try {
      const [created] = await createSkills([
        { name, category: category || null },
      ]);
      setSkills((prev) => [...prev, created]);
      setName("");
      setCategory("");
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to add skill."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this skill?")) return;
    setActionError(null);
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete skill."
      );
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-base font-medium text-gray-900">Skills</h2>
      </div>

      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading skills...</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{loadError}</p>}

      {status === "ready" && (
        <div className="flex flex-col gap-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}

          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-2">
            <div>
              <label htmlFor="skill-name" className="block text-sm text-gray-700">
                Name
              </label>
              <input
                id="skill-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="skill-category" className="block text-sm text-gray-700">
                Category
              </label>
              <input
                id="skill-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClassName}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add skill"}
            </button>
          </form>

          {skills.length === 0 ? (
            <p className="text-sm text-gray-600">No skills added yet.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {groupByCategory(skills).map(([category, group]) => (
                <div key={category}>
                  <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {category}
                  </h3>
                  <div className="divide-y divide-gray-200 border-t border-gray-200">
                    {group.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <span className="text-gray-900">{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(skill.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
