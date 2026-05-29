// ui/src/ui/views skills shared helpers and runtime behavior.
import { html, nothing } from "lit";
import type { SkillStatusEntry } from "../types.ts";

/** Reused helper for compute Skill Missing behavior in ui/src/ui/views. */
export function computeSkillMissing(skill: SkillStatusEntry): string[] {
  return [
    ...skill.missing.bins.map((b) => `bin:${b}`),
    ...skill.missing.env.map((e) => `env:${e}`),
    ...skill.missing.config.map((c) => `config:${c}`),
    ...skill.missing.os.map((o) => `os:${o}`),
  ];
}

/** Reused helper for compute Skill Reasons behavior in ui/src/ui/views. */
export function computeSkillReasons(skill: SkillStatusEntry): string[] {
  const reasons: string[] = [];
  if (skill.disabled) {
    reasons.push("disabled");
  }
  if (skill.blockedByAllowlist) {
    reasons.push("blocked by allowlist");
  }
  return reasons;
}

/** Reused helper for render Skill Status Chips behavior in ui/src/ui/views. */
export function renderSkillStatusChips(params: {
  skill: SkillStatusEntry;
  showBundledBadge?: boolean;
}) {
  const skill = params.skill;
  const showBundledBadge = Boolean(params.showBundledBadge);
  return html`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${skill.source}</span>
      ${showBundledBadge ? html` <span class="chip">bundled</span> ` : nothing}
      <span class="chip ${skill.eligible ? "chip-ok" : "chip-warn"}">
        ${skill.eligible ? "eligible" : "blocked"}
      </span>
      ${skill.disabled ? html` <span class="chip chip-warn">disabled</span> ` : nothing}
    </div>
  `;
}
