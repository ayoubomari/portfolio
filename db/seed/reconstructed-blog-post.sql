-- "Golang Lint & Audit" blog post (written fresh, not recovered from an archive).
-- NOT idempotent — run once against an empty schema. Already applied to the local
-- dev DB on 2026-08-20; see db/seed/prod-data-dump.sql for the authoritative
-- pg_dump snapshot to import on prod. thumbnail file lives at
-- public/uploads/blog-posts-thumbnails/golang_lint_and_audit.webp.

BEGIN;

INSERT INTO blog_post (slug, title, summary, thumbnail, status, author, date)
VALUES (
  'golang-lint-and-audit',
  'Golang Lint & Audit: Writing Cleaner Go Code in the AI Era',
  'A practical toolchain -- gofmt, go vet, golangci-lint, gocritic, nilaway, govulncheck and race/leak detection -- for keeping Go code clean, safe, and trustworthy even when an AI agent writes the first draft.',
  'golang_lint_and_audit.webp',
  'visible',
  'Ayoub Omari',
  '2026-08-20'
);

INSERT INTO tag (value)
SELECT v FROM (VALUES ('Golang'), ('Code Quality'), ('Static Analysis'), ('AI Coding')) AS t(v)
WHERE NOT EXISTS (SELECT 1 FROM tag WHERE tag.value = t.v);

INSERT INTO blog_post_tag (blog_post_id, tag_id)
SELECT bp.id, t.id FROM blog_post bp, tag t
WHERE bp.slug = 'golang-lint-and-audit' AND t.value IN ('Golang', 'Code Quality', 'Static Analysis', 'AI Coding');

INSERT INTO blog_post_technology (blog_post_id, technology_id)
SELECT bp.id, tech.id FROM blog_post bp, technology tech
WHERE bp.slug = 'golang-lint-and-audit' AND tech.name = 'Golang';

COMMIT;
