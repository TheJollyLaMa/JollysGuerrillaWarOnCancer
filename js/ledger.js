const seedData = {
  contributions: [
    {
      contributor: "community-researcher",
      pullRequest: "#12",
      summary: "Mapped sulforaphane handling notes for sprout preparation.",
      rewardTrack: "BigNuten"
    }
  ],
  grants: [
    { source: "Public grant round", amount: "4.2 ETH", status: "Incoming" },
    { source: "Community science stipend", amount: "1.1 ETH", status: "Allocated" }
  ],
  bounties: [{ title: "Schema evidence audit", amount: "0.35 ETH", status: "Open" }]
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createCard(title, body) {
  const section = document.createElement("section");
  section.className = "ledger-card";
  section.innerHTML = `<h3>${escapeHtml(title)}</h3>${body}`;
  return section;
}

export function createLedgerModel() {
  return {
    ...seedData,
    publishContribution(record) {
      return {
        type: "contribution.logged",
        channel: "repo-bot",
        payload: record,
        timestamp: new Date().toISOString()
      };
    },
    allocateGrant(record) {
      return {
        type: "grant.allocated",
        channel: "public-ledger",
        payload: record,
        timestamp: new Date().toISOString()
      };
    }
  };
}

export function renderLedger(container, model) {
  container.replaceChildren(
    createCard(
      "BigNuten Contribution Flow",
      `<div class="ledger-list">${model.contributions
        .map(
          ({ contributor, pullRequest, summary, rewardTrack }) =>
            `<p><strong>${escapeHtml(contributor)}</strong> logged ${escapeHtml(pullRequest)} via ${escapeHtml(
              rewardTrack
            )}.<br />${escapeHtml(summary)}</p>`
        )
        .join("")}</div>`
    ),
    createCard(
      "GreenTeaHut#1 Treasury Flow",
      `<div class="ledger-list">${model.grants
        .map(
          ({ source, amount, status }) =>
            `<p><strong>${escapeHtml(status)}</strong>: ${escapeHtml(source)} · ${escapeHtml(amount)}</p>`
        )
        .join("")}
        ${model.bounties
          .map(
            ({ title, amount, status }) =>
              `<p><strong>${escapeHtml(status)}</strong>: ${escapeHtml(title)} · ${escapeHtml(amount)}</p>`
          )
          .join("")}
      </div>`
    ),
    createCard(
      "Web3-ready Event Preview",
      `<pre class="ledger-preview">${JSON.stringify(
        {
          contribution: model.publishContribution(model.contributions[0]),
          allocation: model.allocateGrant(model.grants[1])
        },
        null,
        2
      )}</pre>`
    )
  );
}
