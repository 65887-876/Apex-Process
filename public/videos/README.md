# /public/videos

Drop your real client-story videos here as `.mp4` files.

The video list is configured in **`lib/config.ts`** under the `videos` array.
Each entry maps to a card in the **Client Stories** section:

```ts
{
  id: "video-1",
  name: "Jane D.",
  role: "Owner · Austin, TX",
  duration: "1:42",
  src: "/videos/your-file.mp4",     // <- this file, in this folder
  poster: "/images/your-poster.jpg" // <- raster poster in /public/images
}
```

## Notes
- Videos are **lazy-loaded** — the `<video>` element only mounts after the
  visitor clicks play, so empty placeholders cost nothing for performance.
- Until you add real files, the cards show a clearly-labeled
  "Placeholder video" state. This is intentional and legally safer.
- Use **licensed or owned** footage only. Do not scrape testimonials.
- Recommended: H.264 MP4, 1280×720 or 1920×1080, under ~10 MB each, plus a
  matching JPG/PNG poster in `/public/images`.

> For local testing you can use royalty-free clips from Pexels, Coverr, or
> Mixkit. Confirm their license permits your use before production.
