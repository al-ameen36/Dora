
# Dora: A Snappy Web-Based File Explorer

Dora is a file manager built for the web that doesn't feel like a website. Web-based explorers can feel slow and clunky; I’m building this to see how far I can push TanStack Start and Node.js to create a native-feeling experience.

## The Tech Stack

* Framework: TanStack Start (for that sweet full-stack type safety).

* State: Jotai (for UI bits) + TanStack Query (for the file data).

* Performance: TanStack Virtual (because rendering 5,000 folders at once kills the DOM).

* Backend: Node/Express to talk to the actual filesystem.

### What I’ve Solved So Far

* **Navigation:** Fast, recursive folder traversal.

* **File Management:** Full support for **Selection, Copy, Cut, Paste, and Delete**.

* **Zero-Latency Feel:** Using **Optimistic Updates** to handle file ops—the UI reflects changes instantly before the server confirms them.

* **Security:** **Zod-validated paths** that prevent directory traversal.

* **Performance:** **TanStack Virtual** handles long lists without lag, and I'm using `os.homedir()` to keep it cross-platform.

### Work in Progress (The Roadmap)

The app is evolving. Here’s what I’m tackling next:

1. **High-Performance Indexing:** Moving from "on-demand" disk access to an **In-Memory Map index** (powered by Chokidar) to make navigation near-instant.

2. **Drag & Drop:** Implementing a native-feeling drag-and-drop layer for moving files within the explorer.

3. **Search:** Adding a real-time, fuzzy-search engine that queries the file index as you type.

4. **Open File Functionality:** Building the bridge between the backend file stream and the frontend previewers (text, image, etc.).

5. **UI Iteration:** I’m continuously refining the component library (Shadcn) to give it a more refined, "desktop-pro" aesthetic.

### Lessons from the Build

* Atomic over Global: Using Jotai for things like "selection state" saved me from the re-render nightmare that usually happens with React Context.

* Perception is Everything: Sometimes the disk is slow, but if the UI responds instantly and shows a skeleton loader for the metadata, the user doesn't care.
