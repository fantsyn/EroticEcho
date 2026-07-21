import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EroticEcho",
    short_name: "EroticEcho",
    description:
      "Immersive personalized erotic choose-your-own-adventure. 18+ adults only.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0d0a12",
    theme_color: "#0d0a12",
    categories: ["entertainment", "lifestyle"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
