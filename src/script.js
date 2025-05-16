document.addEventListener('DOMContentLoaded', () => {
    const getSummaryBtn = document.getElementById('get-summary-btn');
    const environmentalFactorInput = document.getElementById('environmental-factor');
    const summaryResultDiv = document.getElementById('summary-result');

    getSummaryBtn.addEventListener('click', async () => {
        const factor = environmentalFactorInput.value.trim();

        if (!factor) {
            summaryResultDiv.innerHTML = '<p style="color: red;">Please enter an environmental factor.</p>';
            return;
        }

        summaryResultDiv.innerHTML = '<p>Loading summary, please wait...</p>';
        getSummaryBtn.disabled = true;

        try {
            // The backend server is running on port 3001
            const response = await fetch('http://localhost:3001/api/health-impact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ environmentalFactor: factor }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // Replace newline characters with <br> tags for HTML display
            const formattedSummary = data.summary.replace(/\n/g, '<br>');
            summaryResultDiv.innerHTML = `<p>${formattedSummary}</p>`;

        } catch (error) {
            console.error('Error fetching summary:', error);
            summaryResultDiv.innerHTML = `<p style="color: red;">Failed to load summary: ${error.message}</p>`;
        } finally {
            getSummaryBtn.disabled = false;
        }
    });
});