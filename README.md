# formcap: "form capture" server

While many web services apply a RESTful lens to the data collected in normal web forms, this can be an awkward fit for simple data-collection applications. In those cases, capturing even partial, invalid information may be more valuable than rejecting it. On the other hand, the raw submissions aren't exactly fit for consumption by your application logic; in fact, in some cases all you really want to do is grab the input and make it available for future processing.

The [formcap](https://github.com/rcoder/formcap) project is a small, opinionated Typescript framework that allows you to programatically define "forms" to be submitted over a simple API with only three endpoints:

1. a read-only form "registry" listing form names and payload types (including both public and private forms)
2. side-effect free form payload validation
3. form submission with a "receipt" to be used to verify the form was received and (eventually, maybe) processed/acknowledged/acted upon

Notably, this library does not provide any mechanism for _displaying_ forms in a browser, or persisting the submitted results anywhere other than a simple NeDB store. However, it does provide a number of hooks to stream form results out including web hooks, MQTT channels, and swarm-ready hypercore feeds.

You can register a new form by providing a JSON schema for its child fields, and optionally a short name/slug.

I've bundled one concrete implementation of a form registry and submission API server using Fastify. Along with the afore-mentioned NeDB persistence layer, it's enough to implement feedback forms, commenting, surveys, and other basic data collection on your website while otherwise keeping content authoring locked inside your git repo + static site generator, headless CMS, or bespoke web publishing tool that can't for whatever reason be easily extended with user-supplied form handlers.

Likewise, there's a small Vue component included that tries to render a simple HTML version of your registered forms, display validation errors in context, and eventually submit entries for processing.

## What is it _Not_ For?

I would strongly urge you not to collect anything more sensitive than an email address using this framework. While formcap avoids some very trivial attacks (no sequential IDs for URL-surfing of private forms or responses, no godlike "admin" view in the web UI that can leak all your secrets and historical data), security has not been a major focus in its design. In fact, some of the light protections against flooding/spamming/etc. could just as easily be weaponized for DoSing the form submission endpoint to lock out other clients.

Likewise, while I've tried to avoid any obvious source of awful slowdown, this has yet to be tested "in anger" when facing really serious load. I'd rather keep the scope narrow and implementation simple than get into contortions trying to make this potentially stand up to "hyper-growth" load. Don't put your timing-critical, transactional data processing through this API unless you're comfortable profiling it and patching/rewriting critical paths as needed.
