--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: blog_post; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.blog_post (id, slug, title, summary, thumbnail, status, author, date, created_at, updated_at) VALUES (1, 'golang-lint-and-audit', 'Golang Lint & Audit: Writing Cleaner Go Code in the AI Era', 'A practical toolchain -- gofmt, go vet, golangci-lint, gocritic, nilaway, govulncheck and race/leak detection -- for keeping Go code clean, safe, and trustworthy even when an AI agent writes the first draft.', 'golang_lint_and_audit.webp', 'visible', 'Ayoub Omari', '2026-08-20', '2026-08-20 17:25:07.681954', '2026-08-20 17:51:29.958488');


--
-- Data for Name: blog_post_image; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tag (id, value) VALUES (2, 'Code Quality');
INSERT INTO public.tag (id, value) VALUES (3, 'Static Analysis');
INSERT INTO public.tag (id, value) VALUES (4, 'AI Coding');
INSERT INTO public.tag (id, value) VALUES (5, 'Golang');


--
-- Data for Name: blog_post_tag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.blog_post_tag (id, blog_post_id, tag_id) VALUES (1, 1, 2);
INSERT INTO public.blog_post_tag (id, blog_post_id, tag_id) VALUES (2, 1, 3);
INSERT INTO public.blog_post_tag (id, blog_post_id, tag_id) VALUES (3, 1, 4);
INSERT INTO public.blog_post_tag (id, blog_post_id, tag_id) VALUES (4, 1, 5);


--
-- Data for Name: technology; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.technology (id, name, icon, link) VALUES (5, 'Algorand Beaker', 'algorand-beaker.svg', 'https://developer.algorand.org');
INSERT INTO public.technology (id, name, icon, link) VALUES (6, 'Algorand SDK', 'algorand-sdk.svg', 'https://developer.algorand.org/docs/sdks/');
INSERT INTO public.technology (id, name, icon, link) VALUES (7, 'NodeJS', 'nodejs.svg', 'https://nodejs.org');
INSERT INTO public.technology (id, name, icon, link) VALUES (8, 'TypeScript', 'typescript.svg', 'https://www.typescriptlang.org');
INSERT INTO public.technology (id, name, icon, link) VALUES (9, 'Fiber', 'fiber.svg', 'https://gofiber.io');
INSERT INTO public.technology (id, name, icon, link) VALUES (10, 'Docker', 'docker.svg', 'https://www.docker.com');
INSERT INTO public.technology (id, name, icon, link) VALUES (11, 'Grafana', 'grafana.svg', 'https://grafana.com');
INSERT INTO public.technology (id, name, icon, link) VALUES (12, 'WebSocket', 'websocket.svg', 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API');
INSERT INTO public.technology (id, name, icon, link) VALUES (13, 'Redis', 'redis.svg', 'https://redis.io');
INSERT INTO public.technology (id, name, icon, link) VALUES (14, 'PostgreSQL', 'postgresql.svg', 'https://www.postgresql.org');
INSERT INTO public.technology (id, name, icon, link) VALUES (15, 'Golang', 'golang.svg', 'https://go.dev');
INSERT INTO public.technology (id, name, icon, link) VALUES (16, 'NextJS', 'nextjs.svg', 'https://nextjs.org');
INSERT INTO public.technology (id, name, icon, link) VALUES (17, 'Swagger', 'swagger.svg', 'https://swagger.io');
INSERT INTO public.technology (id, name, icon, link) VALUES (18, 'GoQuery', 'goquery.svg', 'https://github.com/PuerkitoBio/goquery');
INSERT INTO public.technology (id, name, icon, link) VALUES (19, 'GraphQL', 'graphql.svg', 'https://graphql.org');
INSERT INTO public.technology (id, name, icon, link) VALUES (20, 'ReactJS', 'reactjs.svg', 'https://react.dev');
INSERT INTO public.technology (id, name, icon, link) VALUES (21, 'Pyteal', 'pyteal.svg', 'https://pyteal.readthedocs.io');


--
-- Data for Name: blog_post_technology; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.blog_post_technology (id, blog_post_id, technology_id) VALUES (1, 1, 15);


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.project (id, title, slug, thumbnail, start_date, end_date, summary, github_link, website_link, status, is_featured, created_at, updated_at) VALUES (4, 'Algorand Arbitrage Bot', 'algorand-arbitrage-bot', 'arbitrage_thumb.webp', '2023-09-01', '2024-01-01', 'A bot that automates the execution of arbitrage opportunities on Algorand, maximizing returns and minimizing risk.', NULL, 'https://allo.info/account/IMY4T476PRNOSCNNHDBLEOIEU3HOE6FM3VY6RFEJ7CQKWWOPZBATTXRXJM', 'visible', true, '2026-08-20 17:07:32.026877', '2026-08-20 17:07:32.026877');
INSERT INTO public.project (id, title, slug, thumbnail, start_date, end_date, summary, github_link, website_link, status, is_featured, created_at, updated_at) VALUES (5, 'Lahagni App', 'lahagni', 'lahagni_thumb.webp', '2024-09-15', '2025-02-15', 'A mobile app for driving sharing, where users can book rides, manage their vehicles, and submite proposals.', NULL, 'https://www.lahagni.com/', 'visible', true, '2026-08-20 17:07:32.026877', '2026-08-20 17:07:32.026877');
INSERT INTO public.project (id, title, slug, thumbnail, start_date, end_date, summary, github_link, website_link, status, is_featured, created_at, updated_at) VALUES (6, 'PacShare Chat Bot', 'pacshare-chat-bot', 'pacshare_thumb.webp', '2024-02-01', '2024-04-01', 'Facebook Messenger Chatbot that help people with limit internet access to fetch content from the web.', 'https://github.com/ayoubomari/pacshare', 'https://www.facebook.com/pacshare1', 'visible', false, '2026-08-20 17:07:32.026877', '2026-08-20 17:07:32.026877');
INSERT INTO public.project (id, title, slug, thumbnail, start_date, end_date, summary, github_link, website_link, status, is_featured, created_at, updated_at) VALUES (7, 'Invoix', 'invoix', 'invoix_thumb.webp', '2023-01-17', '2023-09-15', 'A invoice trading platform powered by the Algorand blockchain, where users can trade their invoices.', NULL, 'https://www.toknar.io/', 'visible', true, '2026-08-20 17:07:32.026877', '2026-08-20 17:07:32.026877');


--
-- Data for Name: project_tag; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: project_technology; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (4, 4, 5);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (5, 4, 6);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (6, 4, 7);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (7, 4, 8);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (8, 5, 9);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (9, 5, 10);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (10, 5, 11);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (11, 5, 12);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (12, 5, 13);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (13, 5, 14);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (14, 5, 15);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (15, 5, 16);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (16, 5, 17);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (17, 6, 9);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (18, 6, 15);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (19, 6, 18);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (20, 6, 19);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (21, 7, 5);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (22, 7, 6);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (23, 7, 7);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (24, 7, 20);
INSERT INTO public.project_technology (id, project_id, technology_id) VALUES (25, 7, 21);


--
-- Name: blog_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_post_id_seq', 1, true);


--
-- Name: blog_post_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_post_image_id_seq', 1, false);


--
-- Name: blog_post_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_post_tag_id_seq', 4, true);


--
-- Name: blog_post_technology_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_post_technology_id_seq', 1, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_id_seq', 7, true);


--
-- Name: project_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_tag_id_seq', 3, true);


--
-- Name: project_technology_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_technology_id_seq', 25, true);


--
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tag_id_seq', 5, true);


--
-- Name: technology_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.technology_id_seq', 21, true);


--
-- PostgreSQL database dump complete
--


