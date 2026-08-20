-- Reconstructed projects + technologies data (from Wayback Machine captures, 22 Jan 2025)
-- NOT idempotent (no unique constraint on technology.name / project_technology) — run once
-- against an empty schema. Already applied to the local dev DB on 2026-08-20;
-- see db/seed/prod-data-dump.sql for the authoritative pg_dump snapshot to import on prod.

BEGIN;

-- 1) Technologies -----------------------------------------------------------
INSERT INTO technology (name, icon, link) VALUES
  ('Algorand Beaker', 'algorand-beaker.svg', 'https://developer.algorand.org'),
  ('Algorand SDK',     'algorand-sdk.svg',    'https://developer.algorand.org/docs/sdks/'),
  ('NodeJS',           'nodejs.svg',          'https://nodejs.org'),
  ('TypeScript',       'typescript.svg',      'https://www.typescriptlang.org'),
  ('Fiber',            'fiber.svg',           'https://gofiber.io'),
  ('Docker',           'docker.svg',          'https://www.docker.com'),
  ('Grafana',          'grafana.svg',         'https://grafana.com'),
  ('WebSocket',        'websocket.svg',       'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'),
  ('Redis',            'redis.svg',           'https://redis.io'),
  ('PostgreSQL',       'postgresql.svg',      'https://www.postgresql.org'),
  ('Golang',           'golang.svg',          'https://go.dev'),
  ('NextJS',           'nextjs.svg',          'https://nextjs.org'),
  ('Swagger',          'swagger.svg',         'https://swagger.io'),
  ('GoQuery',          'goquery.svg',         'https://github.com/PuerkitoBio/goquery'),
  ('GraphQL',          'graphql.svg',         'https://graphql.org'),
  ('ReactJS',          'reactjs.svg',         'https://react.dev'),
  ('Pyteal',           'pyteal.svg',          'https://pyteal.readthedocs.io')
;

-- 2) Projects -----------------------------------------------------------------
INSERT INTO project (title, slug, thumbnail, start_date, end_date, summary, github_link, website_link, status, is_featured) VALUES
  ('Algorand Arbitrage Bot', 'algorand-arbitrage-bot', 'arbitrage_thumb.webp', '2023-09-01', '2024-01-01',
   'A bot that automates the execution of arbitrage opportunities on Algorand, maximizing returns and minimizing risk.',
   NULL, 'https://allo.info/account/IMY4T476PRNOSCNNHDBLEOIEU3HOE6FM3VY6RFEJ7CQKWWOPZBATTXRXJM', 'visible', true),

  ('Lahagni App', 'lahagni', 'lahagni_thumb.webp', '2024-09-15', '2025-02-15',
   'A mobile app for driving sharing, where users can book rides, manage their vehicles, and submite proposals.',
   NULL, 'https://www.lahagni.com/', 'visible', true),

  ('PacShare Chat Bot', 'pacshare-chat-bot', 'pacshare_thumb.webp', '2024-02-01', '2024-04-01',
   'Facebook Messenger Chatbot that help people with limit internet access to fetch content from the web.',
   'https://github.com/ayoubomari/pacshare', 'https://www.facebook.com/pacshare1', 'visible', false),

  ('Invoix', 'invoix', 'invoix_thumb.webp', '2023-01-17', '2023-09-15',
   'A invoice trading platform powered by the Algorand blockchain, where users can trade their invoices.',
   NULL, 'https://www.toknar.io/', 'visible', true)
;

-- 3) Project <-> Technology links ----------------------------------------------
INSERT INTO project_technology (project_id, technology_id)
SELECT p.id, t.id FROM project p, technology t
WHERE p.slug = 'algorand-arbitrage-bot' AND t.name IN ('Algorand Beaker', 'Algorand SDK', 'NodeJS', 'TypeScript');

INSERT INTO project_technology (project_id, technology_id)
SELECT p.id, t.id FROM project p, technology t
WHERE p.slug = 'lahagni' AND t.name IN ('Fiber', 'Docker', 'Grafana', 'WebSocket', 'Redis', 'PostgreSQL', 'Golang', 'NextJS', 'Swagger');

INSERT INTO project_technology (project_id, technology_id)
SELECT p.id, t.id FROM project p, technology t
WHERE p.slug = 'pacshare-chat-bot' AND t.name IN ('GoQuery', 'Fiber', 'GraphQL', 'Golang');

INSERT INTO project_technology (project_id, technology_id)
SELECT p.id, t.id FROM project p, technology t
WHERE p.slug = 'invoix' AND t.name IN ('Algorand Beaker', 'Algorand SDK', 'NodeJS', 'ReactJS', 'Pyteal');

COMMIT;
