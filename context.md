# QAchatBot Context

## Product
QAchatBot is a question-answering chatbot system. It ingests or accesses a knowledge base and responds to user queries conversationally, distinguishing between answerable questions (within the knowledge base) and out-of-scope queries.

## Domain Terms
- **Knowledge Base**: The source of truth—either embedded documents, FAQs, or indexed passages that the bot searches to answer questions.
- **Query/Question**: User input; may be multi-turn or single-shot.
- **Confidence Score**: Whether the bot should answer or indicate uncertainty (e.g., "I don't know").
- **Hallucination**: Generating plausible but incorrect answers not grounded in the knowledge base—a critical risk.
- **Context Window**: Token/message limit for conversation history; older turns may be pruned.

## Key Business Rules & Invariants
1. **Accuracy over Coverage**: Better to say "I don't know" than to confabulate. Out-of-scope questions should be declined, not guessed.
2. **Grounding**: Answers should cite or reference the knowledge base source. Bare generated text without source attribution is high-risk.
3. **Consistency**: Repeated questions should yield consistent answers (session or global).
4. **Turn Limits**: Long conversations may hit token limits; graceful degradation (summarization, context pruning) is expected.

## Non-Obvious Gotchas
- **Knowledge staleness**: If the KB updates, cached or embedded vectors become stale; reindexing required.
- **Ambiguous queries**: User questions may have multiple valid interpretations; multi-turn clarification is costly.
- **Domain-specific terminology**: Medical, legal, or technical QA requires precise language and source fidelity—generic LLMs drift easily.
- **Prompt injection**: Adversarial users may embed instructions in questions to bypass safety guardrails.
- **Cost/latency tradeoff**: Longer contexts (more history) improve coherence but increase latency and API costs.

## Initial State
Repository currently minimal (README only). Implementation details pending.
