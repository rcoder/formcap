# formcap

## what is it?

a simple microservice that captures form submissions that validate under a provided json schema
responses can be multipart or json encoded

form submissions are single-use, and designed to interleave form label data and user-supplied values

micro-surveys, polls, RSVPs, etc.

responses are available for export as a live feed and/or batch-processing-ready archive
live feed can be accessed from a browser for dashboards + ad-hoc analysis

form invites can be open, capped, rate-limited, or single-shot

data to be collected is specified with a json schema
response metadata lives in separate schema (nedb/mongo)

simplest option: don't enforce schemas, but attach them as metadata
buffer inbound requests that fail due to unvalidated submission cap
(soft limit starts when total submissions hit desired cap, with hard limit coming in after that and throttling all inbounds until the total fills or the backlog is cleared; could be weaponized by someone who had the reply token, but only up to their individual rate limit bucket, which could quickly get quite limited indeed after they start failing validations)
(nedb in-memory could do this, as could mongo with stale reads or redis)

