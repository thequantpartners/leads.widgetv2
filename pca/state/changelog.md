# Changelog

- **[2026-06-16]**: Fixed Google authentication error (`Illegal url for new iframe`). Sanitized Firebase environment variables in `src/lib/firebase.ts` with `.trim()` to ignore trailing newline characters, and cleaned the local `.env` file.
