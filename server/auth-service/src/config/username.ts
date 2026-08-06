export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const normalizeUsername = (username: string) =>
  username.trim().toLowerCase();

export const validateUsername = (
  username: string
): { ok: boolean; reason?: string } => {
  const value = username.trim();

  if (value.length < USERNAME_MIN_LENGTH) {
    return {
      ok: false,
      reason: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    };
  }

  if (value.length > USERNAME_MAX_LENGTH) {
    return {
      ok: false,
      reason: `Username must be at most ${USERNAME_MAX_LENGTH} characters`,
    };
  }

  if (!USERNAME_PATTERN.test(value)) {
    return {
      ok: false,
      reason: "Username can only contain letters, numbers and underscores",
    };
  }

  return { ok: true };
};
