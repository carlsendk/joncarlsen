---
title: "Running Ørsted's SMS messaging platform"
summary: "Led the SMS platform that handles all of Ørsted's SMS to units and customers: built the MVP, added a new provider, and led the full integration of the gateway across Ørsted's systems."
role: "Team Lead & SCRUM Master"
period: "Oct 2011 - Aug 2012"
company: "Ørsted"
featured: false
themes:
  - "cloud-realtime-data"
  - "transformation"
skills:
  - "team-leadership"
  - "scrum"
  - "integration"
  - "c-sharp"
metrics:
  - "Zero-downtime gateway migration"
  - "Millions of SMS per year"
order: 9
---

## Context

The platform grew out of my master project on an external short messaging
entity. Ørsted depended on SMS to reach units and customers, and needed reliable
messaging and a way off an ageing gateway without disrupting the systems that
used it.

## What I did

As team lead and SCRUM Master for five developers, we first built an MVP that
improved communication with the SMS providers and added a new one. From there I
led the full integration of the SMS gateway across Ørsted's other systems, so it
handled all SMS communication to units and customers, millions of messages a
year. It was built in C# and
.NET on services and message queues, with a web-services API and a UI to control
it, on Oracle, the service-oriented style that came before microservices and REST
were common. The same
platform ran SMSlog, which logged people in and out by SMS or a Silverlight
interface, and PriceGuard for price notifications. I planned the migration off
the old gateway so existing clients moved across with a zero-downtime production
cutover. Good CI and CD were in place so changes shipped continuously and safely.

## Outcome

Ørsted had one SMS platform handling all communication to units and customers,
integrated across its systems and moved onto the new gateway without disruption.
