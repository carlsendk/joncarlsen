---
title: "Building an AI platform on real-time network telemetry"
summary: "Stood up the AI/ML capability and the real-time data architecture behind AXON's orchestration platform."
role: "Director of Engineering & AI (EMEA)"
period: "2023-Present"
company: "AXON Networks"
featured: true
themes:
  - "ai-llm"
  - "cloud-realtime-data"
  - "org-scaling"
  - "platform-devex"
  - "transformation"
skills:
  - "ai-ml"
  - "real-time-data"
  - "cloud-architecture"
  - "go"
  - "engineering-leadership"
metrics:
  - "50,000 datapoints/s per device"
  - "~40 in EMEA, 70 across Europe"
  - "Java to Go"
order: 1
---

## Context

AXON's orchestration platform turns high-volume network telemetry into
operational insight. Each device streams up to 50,000 datapoints per second, so
the platform reads its network in real time rather than in batches, and every
decision about data flow and model placement has to respect that latency budget.
I lead the engineering and AI organisation for this in EMEA, around 40 people,
and support integration with another 70 across Europe. The brief was to take a
capable engineering setup and move it toward AI-driven operations without
slowing the product down.

## What I did

I defined the target cloud architecture and built a new AI/ML team from scratch,
focused on LLM-driven agents that act on live telemetry rather than on stale
snapshots. To make that possible we scaled the real-time data pipelines so the
models read the high-frequency streams directly.

Where services needed predictable performance I led the move from Java to Go,
and I set up a continuous-delivery culture with clear ownership so teams ship
without waiting on a central bottleneck. Alongside the platform work I
integrated a design and UX workflow and launched a third-party device team.

I also led the integration of the ACS system into the platform and supported
platform integration after acquisitions, keeping one architecture coherent as
new systems came in.

## Outcome

The platform now runs real-time pipelines that feed operational intelligence and
agent-based workflows on live telemetry. The AI/ML team is established and
shipping. The architecture holds the latency the product needs, and the
organisation has moved from a modern engineering setup toward AI-driven
operations. The direction from here is set: agents take on more of the
operational workflow as the data and models mature.
