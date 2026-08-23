function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMarkdownBlock(markdown = "") {
  const lines = markdown.split("\n");
  const fragments = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      fragments.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`);
      listItems = [];
    }
  };

  lines.forEach((line) => {
    const safeLine = escapeHtml(line.trim());

    if (!safeLine) {
      flushList();
      return;
    }

    if (safeLine.startsWith("## ")) {
      flushList();
      fragments.push(`<h3>${safeLine.slice(3)}</h3>`);
      return;
    }

    if (safeLine.startsWith("- ")) {
      listItems.push(safeLine.slice(2));
      return;
    }

    flushList();
    fragments.push(`<p>${safeLine}</p>`);
  });

  flushList();
  return fragments.join("");
}

export function renderWikiList(entries, container, onSelect) {
  container.replaceChildren();

  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.className = "bus-button";
    button.textContent = entry.title;
    button.addEventListener("click", () => onSelect(entry));
    container.append(button);
  });
}

export function renderWikiEntry(entry, container) {
  const contraindications = entry.contraindications
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const tags = entry.associated_tags
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  container.innerHTML = `
    <header>
      <p class="eyebrow">${escapeHtml(entry.category)}</p>
      <h2>${escapeHtml(entry.title)}</h2>
      <p>${escapeHtml(entry.summary)}</p>
    </header>
    <div class="metadata-grid">
      <section class="metadata-item">
        <strong>Accessibility score</strong>
        <p>${escapeHtml(String(entry.accessibility_score))}/5</p>
      </section>
      <section class="metadata-item">
        <strong>Evidence tier</strong>
        <p>${escapeHtml(entry.evidence_tier)}</p>
      </section>
      <section class="metadata-item">
        <strong>Mechanism of action</strong>
        <p>${escapeHtml(entry.mechanism_of_action)}</p>
      </section>
      <section class="metadata-item">
        <strong>Pinata readiness</strong>
        <p>${entry.validation.valid ? "Valid schema payload" : entry.validation.errors.map(escapeHtml).join(", ")}</p>
      </section>
    </div>
    <section>
      <h3>Associated tags</h3>
      <div class="tag-row">${tags}</div>
    </section>
    <section>
      <h3>Contraindications</h3>
      <ul>${contraindications}</ul>
    </section>
    <section>
      ${renderMarkdownBlock(entry.body)}
    </section>
  `;
}
