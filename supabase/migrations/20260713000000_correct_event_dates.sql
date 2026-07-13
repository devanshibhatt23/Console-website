-- Correct the event dates for legacy events
UPDATE public.events SET event_date = '2025-09-06T17:19:01+00:00' WHERE title ILIKE '%orientation%';
UPDATE public.events SET event_date = '2025-10-13T17:23:28+00:00' WHERE title ILIKE '%ai x programming%';
UPDATE public.events SET event_date = '2026-01-17T20:03:40+00:00' WHERE title ILIKE '%confluence%';
UPDATE public.events SET event_date = '2026-02-14T17:16:36+00:00' WHERE title ILIKE '%git%';
UPDATE public.events SET event_date = '2026-04-01T16:22:01+00:00' WHERE title ILIKE '%recruitment%';
UPDATE public.events SET event_date = '2026-04-11T17:15:00+00:00' WHERE title ILIKE '%concode%';
