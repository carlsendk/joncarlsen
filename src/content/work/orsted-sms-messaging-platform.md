---
title: "Running Ørsted's SMS messaging platform"
summary: "Led a five-person team operating the SMS messaging platform and migrated the gateway to a new ESME with a clean production cutover."
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
metrics:
  - "Zero-downtime gateway migration"
order: 9
---

## Context

Ørsted ran a set of SMS-based services that the business depended on, from
tracking people in and out of locations to price notifications. The platform
needed steady operation and a way off an ageing SMS gateway without disrupting
the systems that relied on it.

## What I did

I was team lead and SCRUM Master for a team of five developers running the
messaging platform. We operated SMSlog, which logged people in and out of
locations by SMS or through a Silverlight interface, and PriceGuard for price
notifications. The main piece of work was SMSHub, which let the SMS gateway talk
to the enterprise broker over web services, and replacing the old gateway with a
new External Short Messaging Entity. I planned the migration so existing clients
moved across with a clean production cutover, building small adapters so each
system could switch to the new gateway in turn.

## Outcome

Ørsted moved from the legacy SMS gateway to the new one without disrupting the
services that depended on it, and the messaging platform ran on a team with a
clear way of working.
