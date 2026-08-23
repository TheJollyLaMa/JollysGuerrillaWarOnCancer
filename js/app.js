import { renderFractalMap } from "./fractalMap.js";
import { createLedgerModel, renderLedger } from "./ledger.js";
import { createPinataPayload, validateMethod } from "./pinataSchema.js";
import { renderWikiEntry, renderWikiList } from "./wiki.js";

const state = {
  activeView: "dashboard",
  entries: [],
  filteredEntries: [],
  schema: null,
  selectedEntry: null,
  ledgerModel: createLedgerModel()
};

const viewButtons = [...document.querySelectorAll(".view-toggle")];
const viewPanels = [...document.querySelectorAll(".view-panel")];
const resultsCount = document.querySelector("#resultsCount");
const catalogResults = document.querySelector("#catalogResults");
const wikiList = document.querySelector("#wikiList");
const wikiEntry = document.querySelector("#wikiEntry");
const filtersForm = document.querySelector("#filters");
const categoryFilter = document.querySelector("#categoryFilter");
const evidenceFilter = document.querySelector("#evidenceFilter");
const mapRoot = document.querySelector("#fractalMap");
const ledgerRoot = document.querySelector("#ledgerContent");
const resultTemplate = document.querySelector("#resultCardTemplate");
const appStatus = document.querySelector("#appStatus");

async function loadJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }

  return response.json();
}

function hydrateFilterOptions(entries) {
  const categories = [...new Set(entries.map(({ category }) => category))];
  const evidenceTiers = [...new Set(entries.map(({ evidence_tier: evidenceTier }) => evidenceTier))];

  for (const [select, values] of [
    [categoryFilter, categories],
    [evidenceFilter, evidenceTiers]
  ]) {
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }
}

function matchesFilters(entry) {
  const formData = new FormData(filtersForm);
  const searchTerm = (formData.get("search") || "").toString().trim().toLowerCase();
  const category = formData.get("category");
  const accessibility = Number(formData.get("accessibility") || 0);
  const evidence = formData.get("evidence");

  const haystack = [
    entry.title,
    entry.category,
    entry.mechanism_of_action,
    ...(entry.associated_tags || [])
  ]
    .join(" ")
    .toLowerCase();

  return (
    (!searchTerm || haystack.includes(searchTerm)) &&
    (!category || entry.category === category) &&
    (!accessibility || entry.accessibility_score >= accessibility) &&
    (!evidence || entry.evidence_tier === evidence)
  );
}

function selectEntry(entry, nextView = "wiki") {
  state.selectedEntry = entry;
  renderWikiEntry(entry, wikiEntry);

  if (nextView) {
    showView(nextView);
  }
}

function renderResults() {
  state.filteredEntries = state.entries.filter(matchesFilters);
  resultsCount.textContent = `${state.filteredEntries.length} stops`;
  catalogResults.replaceChildren();

  state.filteredEntries.forEach((entry) => {
    const card = resultTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".result-title").textContent = entry.title;
    card.querySelector(".result-score").textContent = `Access ${entry.accessibility_score}/5`;
    card.querySelector(".result-category").textContent = `${entry.category} · ${entry.evidence_tier}`;
    card.querySelector(".result-mechanism").textContent = entry.mechanism_of_action;

    const tagsRoot = card.querySelector(".result-tags");
    entry.associated_tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = tag;
      tagsRoot.append(tagElement);
    });

    card.querySelector(".result-open").addEventListener("click", () => selectEntry(entry));
    catalogResults.append(card);
  });
}

function showView(viewName) {
  state.activeView = viewName;

  viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });

  viewPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.id !== viewName);
  });
}

function bindEvents() {
  filtersForm.addEventListener("input", renderResults);
  filtersForm.addEventListener("change", renderResults);

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });
}

function decorateEntries(entries) {
  return entries.map((entry) => {
    const validation = validateMethod(entry, state.schema);

    return {
      ...entry,
      validation,
      pinataPayload: createPinataPayload(entry)
    };
  });
}

async function init() {
  try {
    const [schema, sulforaphane, mushrooms] = await Promise.all([
      loadJson("./data/schema/method-schema.json"),
      loadJson("./data/sulforaphane.json"),
      loadJson("./data/mushrooms.json")
    ]);

    state.schema = schema;
    state.entries = decorateEntries([sulforaphane, mushrooms]);
    hydrateFilterOptions(state.entries);
    bindEvents();
    renderResults();
    renderWikiList(state.entries, wikiList, selectEntry);
    renderFractalMap(mapRoot, state.entries);
    renderLedger(ledgerRoot, state.ledgerModel);
    selectEntry(state.entries[0], null);
  } catch (error) {
    appStatus.textContent = `App initialization failed: ${error.message}`;
    appStatus.classList.remove("is-hidden");
    catalogResults.textContent = error.message;
  }
}

init();
