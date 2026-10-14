const target = document.querySelector("[data-aica-context]");
const askButton = document.querySelector("#ask-ai");
const questionInput = document.querySelector("#question");
const questionForm = document.querySelector("#question-form");
const answerBox = document.querySelector("#answer");
const suggestions = document.querySelectorAll("[data-question]");
let loadedContext = null;

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[char]));

async function retrieveContext() {
  const contextPath = target.dataset.aicaContext;
  answerBox.innerHTML = '<p class="muted">Following the element reference and retrieving context…</p>';
  try {
    const response = await fetch(contextPath);
    if (!response.ok) throw new Error(`Context request failed (${response.status})`);
    loadedContext = await response.json();
    return loadedContext;
  } catch (error) {
    answerBox.innerHTML = '<p><strong>Could not retrieve the context file.</strong></p><p class="muted">Start a local web server (see README) rather than opening index.html directly.</p>';
    throw error;
  }
}

function answerQuestion(question, context) {
  const q = question.toLowerCase();
  if (/(waterproof|rain|water)/.test(q)) {
    return ["Rain protection", `The sample context lists a waterproof rating of ${context.waterproof_rating} and sealed seams. This is illustrative product data, not a guarantee for every weather condition.`];
  }
  if (/(material|fabric|made|recycl)/.test(q)) {
    return ["Materials and features", `The context describes these features: ${context.features.join(", ")}. Check a real product's verified material specification before relying on it.`];
  }
  if (/(care|wash|clean|laundry|temperature)/.test(q)) {
    return ["Care instructions", `The sample says to wash at ${context.care.wash_temperature}. ${context.care.instructions}`];
  }
  if (/(cold|comfort|degree|weather|warm)/.test(q)) {
    return ["Comfort range", `The suggested range is ${context.temperature_range}. Comfort depends on activity, layering, wind, and individual preference.`];
  }
  if (/(feature|pocket|hood|seam)/.test(q)) {
    return ["Product features", `Features listed in the context include ${context.features.join(", ")}.`];
  }
  return ["Context retrieved", `I retrieved details for ${context.name}. Try asking about waterproofing, materials, care instructions, temperature range, or features. This demo uses simple rules, not an LLM.`];
}

async function ask(question) {
  const cleaned = question.trim();
  if (!cleaned) {
    answerBox.innerHTML = '<p class="muted">Type a question or choose one of the suggestions above.</p>';
    questionInput.focus();
    return;
  }
  try {
    const context = loadedContext || await retrieveContext();
    const [title, answer] = answerQuestion(cleaned, context);
    answerBox.innerHTML = `<p class="answer-title">${escapeHtml(title)}</p><p class="answer-text">${escapeHtml(answer)}</p><p class="source-note">Context source: ${escapeHtml(target.dataset.aicaContext)} · Rule-based demo, not a live AI model.</p>`;
  } catch {
    // retrieveContext displays the retrieval error.
  }
}

askButton.addEventListener("click", () => ask(questionInput.value || "What are the product features?"));
questionForm.addEventListener("submit", event => {
  event.preventDefault();
  ask(questionInput.value);
});
suggestions.forEach(button => {
  button.addEventListener("click", () => {
    questionInput.value = button.dataset.question;
    ask(button.dataset.question);
  });
});
