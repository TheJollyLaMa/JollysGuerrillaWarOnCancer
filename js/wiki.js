import { escapeHtml } from "./utils.js";

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
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      return;
    }

    if (trimmedLine.startsWith("## ")) {
      flushList();
      fragments.push(`<h3>${escapeHtml(trimmedLine.slice(3))}</h3>`);
      return;
    }

    if (trimmedLine.startsWith("- ")) {
      listItems.push(escapeHtml(trimmedLine.slice(2)));
      return;
    }

    flushList();
    fragments.push(`<p>${escapeHtml(trimmedLine)}</p>`);
  });

  flushList();
  return fragments.join("");
}

function getSafeImageSource(source) {
  if (typeof source !== "string" || !source.trim()) {
    return null;
  }

  try {
    const trimmedSource = source.trim();
    const base = typeof window !== "undefined" ? window.location.href : "https://example.invalid/";
    const parsed = new URL(trimmedSource, base);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function createFeatureImageElement(entry) {
  const image = entry.feature_image;
  const source = getSafeImageSource(image?.src);

  if (!source) {
    return null;
  }

  const providedAlt = typeof image.alt === "string" ? image.alt.trim() : "";
  const fallbackAlt =
    typeof entry.title === "string" && entry.title.trim() ? `${entry.title.trim()} illustration` : "Illustration";
  const alt = providedAlt || fallbackAlt;
  const caption = typeof image.caption === "string" ? image.caption.trim() : "";
  const figure = document.createElement("figure");
  figure.className = "postcard-figure";

  const imageElement = document.createElement("img");
  imageElement.src = source;
  imageElement.alt = alt;
  figure.append(imageElement);

  if (caption) {
    const captionElement = document.createElement("figcaption");
    captionElement.textContent = caption;
    figure.append(captionElement);
  }

  return figure;
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
  const validation = entry.validation ?? { valid: false, errors: ["Validation unavailable"] };
  const contraindications = (entry.contraindications ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const tags = (entry.associated_tags ?? [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  container.innerHTML = `
    <header>
      <p class="eyebrow">${escapeHtml(entry.category)}</p>
      <h2>${escapeHtml(entry.title)}</h2>
      <p>${escapeHtml(entry.summary)}</p>
    </header>
    <div class="feature-image-slot"></div>
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
        <p>${validation.valid ? "Valid schema payload" : validation.errors.map((error) => escapeHtml(error)).join(", ")}</p>
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
      <!-- renderMarkdownBlock escapes text content before wrapping it in limited HTML tags -->
      ${renderMarkdownBlock(entry.body)}
    </section>
  `;

  const featureImage = createFeatureImageElement(entry);
  const featureImageSlot = container.querySelector(".feature-image-slot");

  if (featureImage && featureImageSlot?.classList?.contains("feature-image-slot")) {
    featureImageSlot.replaceChildren(featureImage);
  }
}
