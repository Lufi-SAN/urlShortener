CREATE TABLE urls (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL CHECK (length(original_url) <= 2048),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  click_count INT DEFAULT 0 CHECK (click_count >= 0),
  UNIQUE (user_id, original_url),
  CHECK (expires_at IS NULL OR expires_at > created_at)
);



