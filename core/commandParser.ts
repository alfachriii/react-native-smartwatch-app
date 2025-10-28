export type ApiCommand =
  | {
      type: "HTTP";
      method: "GET" | "POST";
      path: string;
    }
  | {
      type: "MUSIC";
      action: string;
    }
  | {
      type: "UNKNOWN";
    };

export const parseCommand = (value: string): ApiCommand => {
  const parts = value.trim().split(" ");
  const type = parts[0]?.replace("/", "").toUpperCase();

  // /GET WEATHER -> type = HTTP
  if (type === "GET" || type === "POST") {
    const path = parts[1]?.toUpperCase();
    if (!path) return { type: "UNKNOWN" };

    return {
      type: "HTTP",
      method: type,
      path,
    };
  }

  // /MUSIC PLAY -> type = MUSIC
  if (type === "MUSIC") {
    const action = parts[1]?.toUpperCase();
    if (!action) return { type: "UNKNOWN" };

    return {
      type: "MUSIC",
      action,
    };
  }

  return { type: "UNKNOWN" };
};
