# Documentation Plan: Umbraco.Community.DynamicImages

## Overview

This plan outlines the documentation to be written for the `Umbraco.Community.DynamicImages` package. Documentation will be broken into phases, each building on the last, covering architecture, usage, configuration, and testing.

---

## Phase 1: Architecture & How It Works

**Goal:** Explain the internals of the package — what it does, how it fits into Umbraco, and the flow from content publish to generated image.

**Deliverables:**
- `docs/how-it-works.md`
  - Package purpose and use cases
  - Mermaid diagram: End-to-end flow (content publish → notification → image generation → media save → property update)
  - Mermaid diagram: Layer compositing process
  - Key classes and their responsibilities
  - Dependency injection setup

---

## Phase 2: Configuration Reference

**Goal:** Document every configuration option with descriptions, types, defaults, and examples.

**Deliverables:**
- `docs/configuration.md`
  - Top-level `DynamicImages` section
  - `Enabled` flag
  - `Instructions` array (all properties)
  - `Layers` array (text layers, image layers, all properties)
  - `Fonts` array and `Styles` sub-array
  - Font name convention (`{FamilyName}_{StyleName}`)
  - Mermaid diagram: Configuration structure
  - Full annotated `appsettings.json` example

---

## Phase 3: Usage Guide

**Goal:** Step-by-step guide for installing and using the package in a real Umbraco site.

**Deliverables:**
- `docs/usage.md`
  - Installation via NuGet
  - Adding fonts to your project
  - Setting up `appsettings.json`
  - Creating a document type with a target media-picker property
  - Triggering image generation (publishing content)
  - Mermaid diagram: Setup sequence
  - Common patterns (social share card, blog header, podcast cover)

---

## Phase 4: Testing Without the UI

**Goal:** Explain how to run, verify, and test the package without a running Umbraco backoffice.

**Deliverables:**
- `docs/testing.md`
  - Running the included test site (`DynamicImages.TestSite`)
  - Using the uSync content definitions to bootstrap test content
  - Triggering image generation from the command line / API
  - Writing unit tests for `DynamicImageService` in isolation
  - Mermaid diagram: Testing workflow
  - Example xUnit test scaffold for `GenerateImageAsync()`
  - Tips for inspecting generated images without a browser

---

## Delivery Order

| Phase | File | Status |
|-------|------|--------|
| Plan  | `docs/documentation-plan.md` | Done |
| 1     | `docs/how-it-works.md`        | Pending |
| 2     | `docs/configuration.md`       | Pending |
| 3     | `docs/usage.md`               | Pending |
| 4     | `docs/testing.md`             | Pending |
