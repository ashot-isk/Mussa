// API utility with automatic session expiration handling

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("authToken");

  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401 Unauthorized, the session has expired
  if (response.status === 401) {
    // Clear auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    // Redirect to login
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/admin/login")
    ) {
      window.location.href = "/en/admin/login";
    }
  }

  return response;
}
