// Security Request Checker
document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submit-btn");
    const userInput = document.getElementById("user-input");
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");

    // Submit button click handler
    submitBtn.addEventListener("click", function () {
        const inputValue = userInput.value.trim();
        
        if (!inputValue) {
            resultDiv.innerHTML = `
                <div class="result-box warning">
                    <div class="result-icon">⚠️</div>
                    <div class="result-message">
                        <div class="pulse-text">Input Required</div>
                        <div class="sub-text">Please enter an HTTP request to analyze.</div>
                    </div>
                </div>
            `;
            return;
        }

        // Show loading animation
        loadingDiv.classList.add("active");
        resultDiv.innerHTML = "";

        fetch("/check_request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_request: inputValue })
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading animation
            loadingDiv.classList.remove("active");

            // Display result based on status
            if (data.status === "malicious") {
                resultDiv.innerHTML = `
                    <div class="result-box danger">
                        <div class="result-icon">🚨</div>
                        <div class="result-message">
                            <div class="pulse-text">Security Threat Detected</div>
                            <div class="sub-text">${data.message.replace(/<br>/g, ' ')}</div>
                        </div>
                    </div>
                `;
            } 
            else if (data.status === "obfuscated") {
                resultDiv.innerHTML = `
                    <div class="result-box warning">
                        <div class="result-icon">🔍</div>
                        <div class="result-message">
                            <div class="pulse-text">Advanced Analysis Required</div>
                            <div class="sub-text">${data.message}</div>
                            <div class="ai-verdict">${data.ml_verdict}</div>
                        </div>
                    </div>
                `;
            } 
            else {
                resultDiv.innerHTML = `
                    <div class="result-box success">
                        <div class="result-icon">✅</div>
                        <div class="result-message">
                            <div class="pulse-text">Request Validated</div>
                            <div class="sub-text">${data.message.replace(/✨/g, '')}</div>
                        </div>
                    </div>
                `;
            }

            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        })
        .catch(error => {
            console.error("Error:", error);
            loadingDiv.classList.remove("active");
            resultDiv.innerHTML = `
                <div class="result-box danger">
                    <div class="result-icon">⚠️</div>
                    <div class="result-message">
                        <div class="pulse-text">Processing Error</div>
                        <div class="sub-text">Unable to process the request. Please verify your input and try again.</div>
                    </div>
                </div>
            `;
        });
    });

    // Allow Enter key to submit (Ctrl+Enter or Cmd+Enter)
    userInput.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            submitBtn.click();
        }
    });

    // Security Tips Carousel
    const prevButton = document.querySelector(".tip-nav-btn.prev");
    const nextButton = document.querySelector(".tip-nav-btn.next");
    const slides = document.querySelectorAll(".tip-slide");
    let currentIndex = 0;

    function changeSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove("active");
            if (index === currentIndex) {
                slide.classList.add("active");
            }
        });
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener("click", () => {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            changeSlide();
        });

        nextButton.addEventListener("click", () => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            changeSlide();
        });

        // Auto-advance slides every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            changeSlide();
        }, 5000);
    }
});
