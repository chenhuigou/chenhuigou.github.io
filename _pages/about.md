---
layout: about
title: about
permalink: /
subtitle: PhD Student @ <a href='https://www.monash.edu/'>Monash University</a> / <a href='https://www.bytedance.com/'>ByteDance Seed Edge</a>

profile:
  align: right
  image: prof_pic.png
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Monash University</p>
    <p>Melbourne, Australia</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

I am a PhD student at [Monash University](https://www.monash.edu/), also working with [ByteDance Seed Edge](https://www.bytedance.com/). My research focuses on AI Agents, Large Language Models (LLMs), Vision-Language Models (VLMs), and Generative AI.

<div class="typewriter-container" style="clear: both;">
<span class="typewriter-text">Designing evolving agents while evolving myself.</span>
<br>
<span class="typewriter-text">AI Agents · LLMs · VLMs · Generative AI</span>
</div>

<style>
.research-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  clear: both;
}
.research-chips .chip {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1.5px solid;
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  opacity: 0;
  animation: chipPopIn 0.4s ease forwards;
}
.research-chips .chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
@keyframes chipPopIn {
  0% { opacity: 0; transform: scale(0.7) translateY(8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.chip:nth-child(1) { animation-delay: 0.05s; }
.chip:nth-child(2) { animation-delay: 0.12s; }
.chip:nth-child(3) { animation-delay: 0.19s; }
.chip:nth-child(4) { animation-delay: 0.26s; }
.chip:nth-child(5) { animation-delay: 0.33s; }
.chip:nth-child(6) { animation-delay: 0.40s; }
.chip:nth-child(7) { animation-delay: 0.47s; }

/* Light mode colors */
.chip-purple { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #7c3aed; }
.chip-blue { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: #2563eb; }
.chip-indigo { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #4f46e5; }
.chip-pink { background: rgba(236,72,153,0.1); border-color: rgba(236,72,153,0.3); color: #db2777; }
.chip-teal { background: rgba(20,184,166,0.1); border-color: rgba(20,184,166,0.3); color: #0d9488; }
.chip-orange { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: #ea580c; }
.chip-cyan { background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.3); color: #0891b2; }

/* Dark mode colors */
html[data-theme="dark"] .chip-purple,
body.dark .chip-purple { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4); color: #a78bfa; }
html[data-theme="dark"] .chip-blue,
body.dark .chip-blue { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.4); color: #93bbfc; }
html[data-theme="dark"] .chip-indigo,
body.dark .chip-indigo { background: rgba(129,140,248,0.15); border-color: rgba(129,140,248,0.4); color: #a5b4fc; }
html[data-theme="dark"] .chip-pink,
body.dark .chip-pink { background: rgba(244,114,182,0.15); border-color: rgba(244,114,182,0.4); color: #f9a8d4; }
html[data-theme="dark"] .chip-teal,
body.dark .chip-teal { background: rgba(45,212,191,0.15); border-color: rgba(45,212,191,0.4); color: #5eead4; }
html[data-theme="dark"] .chip-orange,
body.dark .chip-orange { background: rgba(251,146,60,0.15); border-color: rgba(251,146,60,0.4); color: #fdba74; }
html[data-theme="dark"] .chip-cyan,
body.dark .chip-cyan { background: rgba(34,211,238,0.15); border-color: rgba(34,211,238,0.4); color: #67e8f9; }
</style>

<div class="research-chips">
  <span class="chip chip-purple">AI Agents</span>
  <span class="chip chip-blue">Foundation LLM/VLM</span>
  <span class="chip chip-pink">Generative Model</span>
</div>
