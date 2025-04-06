// Simple toast implementation for Astro
let toastTimeoutId = null

export function toast({ title, description, variant = "default" }) {
  // Clear any existing toast
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId)
  }

  // Create toast element if it doesn't exist
  let toastContainer = document.getElementById("toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.id = "toast-container"
    toastContainer.className = "fixed top-4 right-4 z-50 max-w-md"
    document.body.appendChild(toastContainer)
  }

  // Create toast
  const toast = document.createElement("div")
  toast.className = `bg-white border rounded-lg shadow-lg p-4 mb-3 transform transition-all duration-300 ease-in-out translate-x-0 ${
    variant === "destructive" ? "border-red-500" : "border-gray-200"
  }`

  // Add content
  toast.innerHTML = `
    <div class="flex">
      <div class="flex-1">
        <h3 class="font-medium ${variant === "destructive" ? "text-red-600" : "text-gray-900"}">${title}</h3>
        ${description ? `<p class="mt-1 text-sm text-gray-500">${description}</p>` : ""}
      </div>
      <button class="ml-4 text-gray-400 hover:text-gray-500">
        <span class="sr-only">Cerrar</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  `

  // Add to container
  toastContainer.appendChild(toast)

  // Add close button functionality
  const closeButton = toast.querySelector("button")
  closeButton.addEventListener("click", () => {
    toast.classList.add("translate-x-full", "opacity-0")
    setTimeout(() => {
      toast.remove()
    }, 300)
  })

  // Auto remove after 5 seconds
  toastTimeoutId = setTimeout(() => {
    toast.classList.add("translate-x-full", "opacity-0")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 5000)

  return {
    close: () => {
      toast.classList.add("translate-x-full", "opacity-0")
      setTimeout(() => {
        toast.remove()
      }, 300)
    },
  }
}

