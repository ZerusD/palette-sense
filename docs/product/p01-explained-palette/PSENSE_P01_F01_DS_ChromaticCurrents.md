# PSENSE_P01_F01 — DS: "Chromatic Currents" (algorithmic-art movement)

**Type:** Design / algorithmic philosophy · **Date:** 2026-07-18 · **Expressed in:** `apps/palette-sense/src/lib/patterns.jsx` (`currents` preview)

> Created with the algorithmic-art skill's process (movement → philosophy → seeded
> implementation), adapted from its standalone p5.js target to Palette Sense's
> in-app SVG pattern system: deterministic per palette, re-colored live, no canvas
> dependency. The palette itself is the seed.

## The movement

**Chromatic Currents** treats a color palette not as a list of swatches but as a
small solar system. Every chromatic color in the designer's palette becomes a body
on an invisible hue wheel, placed at the angle its hue actually occupies — an
analogous palette clusters its bodies close together; a complementary palette sets
them in opposition across the void. The composition is never arranged by hand: it
is the palette's own harmony geometry, made physical.

Role gives each body its mass. The primary is the heaviest — its current dominates
the flow, as it dominates an interface. The secondary orbits lighter; the neutral
drifts almost without pull; the accent is the smallest body with the brightest
wake, exactly the 60-30-10 law expressed as gravitation rather than area. Nothing
in the frame states this rule; everything in the frame obeys it.

The visible matter is particles. Seeded at quiet positions, they integrate through
the summed swirl of every body — rotation plus a whisper of attraction, damped by
distance — and their traces accumulate into streamlines: ghost-evidence of forces
the viewer never sees directly. Fast, accent-touched lines burn bright and thin;
slow peripheral lines fade toward the ground. Each palette produces one — and only
one — flow field: the seed is a hash of the hexes themselves, so regenerating the
same palette reproduces the identical artwork, stroke for stroke, while every new
palette composes a current system no one has seen before.

The conceptual thread is deliberately subtle: a colorist reading the piece will
recognize the hue wheel's silent architecture — opposing swirls for complements,
one braided river for analogues — the same geometry the rationale panel explains
in words. Everyone else simply sees weather. That double reading is the point:
in Palette Sense the reasoning is the product, and here the reasoning is the
physics.

Craftsmanship is non-negotiable. Every constant — the swirl-to-pull ratio, the
distance falloff, the mass ladder, the step length, the line-count budget, the
opacity range — must read as the product of countless tuning passes by someone at
the top of the computational-aesthetics field: dense enough to feel alive, sparse
enough to breathe, balanced so no seed can collapse into mud or noise. The frame
is small (400×250); the system must feel larger than its window, currents entering
and leaving as if the weather continued beyond the glass.

## Fixed parameters (the curated 10%)

| Parameter | Value | Why |
|---|---|---|
| Bodies | chromatic roles only (primary, accent, secondary, neutral) | background/text are the stage, not actors |
| Mass ladder | 1.0 / 0.45 / 0.6 / 0.3 | 60-30-10 as gravitation |
| Wheel radius | 62px around (200, 125) | harmony geometry legible at frame scale |
| Field | swirl 1.0 + pull 0.22, falloff 1/(1+(d/95)²) | coherent currents, no black-hole collapse |
| Streamlines | 64 seeds × ≤46 steps × 5px | density with breath |
| Seed | fnv-hash of palette hexes | the palette is the artwork's DNA |
