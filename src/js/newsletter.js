const form = document.querySelector("#newsletter-form");
const message = document.querySelector("#newsletter-message");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.classList.remove("newsletter-form__message--error");

  const button = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  button.disabled = true;
  button.textContent = "Submitting…";

  try {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        consent: formData.get("consent") === "on",
      }),
    });
    const contentType = response.headers.get("content-type") || "";
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "We could not submit your sign-up. Please try again later.");
    }
    if (!contentType.includes("application/json")) {
      throw new Error("Newsletter sign-up is not connected yet. Please try again later.");
    }

    form.reset();
    message.textContent = "Thanks for signing up! Please check your inbox for updates.";
  } catch (error) {
    message.classList.add("newsletter-form__message--error");
    message.textContent = error instanceof TypeError
      ? "Newsletter sign-up is not connected yet. Please try again later."
      : error.message;
  } finally {
    button.disabled = false;
    button.textContent = "Sign me up";
  }
});
