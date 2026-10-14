# AICA Demo — Context on Demand

A small, beginner-friendly proof of concept for **AI Context Association (AICA)**.

The demo illustrates one idea: a human-facing webpage can show concise content while a specific element points to a separate, machine-readable context resource that can be retrieved when needed.

> **Status:** Experimental concept demo. This is not a production AI agent, a formal web standard, or evidence that AICA is more efficient than existing approaches.

## What you can demonstrate

1. The product page shows a fictional jacket and concise shopper-facing details.
2. The product element includes a reference to a separate context resource:
   ```html
   <section data-aica-context="context/jacket-123.json">
   ```
3. Ask a question using the form or example prompts.
4. JavaScript reads the element's `data-aica-context` attribute and fetches that JSON file.
5. A tiny rule-based function creates an answer from the retrieved context.

The demo runs without API keys, model access, or a backend. It demonstrates context discovery and retrieval—not actual LLM reasoning.

## Project structure

```text
aica-ai-context-association-demo/
├── index.html
├── styles.css
├── app.js
├── context/
│   └── jacket-123.json
└── README.md
```

## Run locally

Because the browser fetches a separate JSON file, run the project through a local HTTP server instead of opening `index.html` directly.

### Option A: Python

From the folder containing `index.html`, run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

### Option B: Visual Studio Code

Open the project folder in VS Code and start a local server using an extension such as Live Server.

No build step, dependencies, API keys, or environment variables are required.

## The key AICA idea

A lightweight reference is attached to the relevant page element:

```html
<section data-aica-context="context/jacket-123.json">
  <!-- Human-facing product content -->
</section>
```

The demo reads the reference and requests the context resource only when a question is asked:

```javascript
const contextPath = target.dataset.aicaContext;
const response = await fetch(contextPath);
const context = await response.json();
```

This implementation uses a local JSON file. Other implementations could explore hosted resources or a retrieval service, but would need to define discovery, access, validation, and trust rules.

## What this demo does not prove

- It does not connect to an LLM or autonomous agent.
- It does not establish that external context is faster or cheaper than embedded structured data.
- It does not define authentication, authorization, provenance, freshness, privacy, or content-negotiation rules.
- It does not replace Schema.org, JSON-LD, MCP, WebMCP, or other existing technologies.

External retrieval introduces trade-offs such as extra network requests, latency, availability, access control, and potentially stale or untrusted context. Further evaluation should compare this pattern against embedded data and existing context-discovery approaches.

## Suggested live-demo script

1. Show the concise product page.
2. Point out the `data-aica-context` attribute on the product element.
3. Ask, “Is this jacket waterproof?”
4. Explain that the answer uses values fetched from the separate JSON file.
5. Describe the concept as a hypothesis to evaluate—not a proven replacement for current web metadata standards.

## Next steps

- Replace the sample JSON with a real, sourced context resource.
- Add an LLM-backed agent behind a server-side endpoint if genuine reasoning is needed.
- Define secure and interoperable retrieval, validation, provenance, and update behavior.
- Benchmark page size, retrieval latency, token use, answer quality, and unnecessary context fetches against alternatives.

## License

No license is included. Add a license only after deciding how you want others to reuse this project.
