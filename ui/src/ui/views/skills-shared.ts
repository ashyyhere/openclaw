// Shared Skills view formatting helpers for eligibility reasons and status
// chips. These keep list and detail panels using the same blocked/eligible
// vocabulary.
import { html, nothing } from "lit";
import type { SkillStatusEntry } from "../types.ts";

/** Flatten missing bins/env/config/os requirements into compact reason labels. */
export function computeSkillMissing(skill: SkillStatusEntry): string[] {
  return [
    ...skill.missing.bins.map((b) => `bin:${b}`),
    ...skill.missing.env.map((e) => `env:${e}`),
    ...skill.missing.config.map((c) => `config:${c}`),
    ...skill.missing.os.map((o) => `os:${o}`),
  ];
}

/** Return non-requirement reasons that keep a skill from being eligible. */
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

/** Render source, bundled, and eligibility chips for a skill row/card. */
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
