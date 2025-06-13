// chain-index.js - Mockup Version
// This file will handle the logic for parsing QR content/Commitment Hash
// and dynamically populating the chain index on index.html

document.addEventListener('DOMContentLoaded', () => {
    // Select elements from index.html
    const expandChainBtn = document.getElementById('expandChainBtn');
    const qrInput = document.getElementById('qrInput');
    const chainIndexSection = document.getElementById('chainIndexSection');
    const chainIndexList = document.getElementById('chainIndexList');

    // --- Mock Data for Demonstration ---
    // In a real system, this data would come from actual QR content parsing
    // and potentially fetching from a distributed ledger or GitHub records.
    const mockChainData = {
        "QR123456": {
            id: "QR123456",
            status: "Active",
            slot: "S001",
            owner: "0xABC123DEF456ABC123DEF456ABC123DEF456",
            hash1: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
            hash2: "0xCOMMITMENTHASH1234567890ABCDEFABCDEF",
            timestamp: "2025-06-12T10:30:00Z",
            prev_hash: "0xPREVGENESISHASH",
            type: "Mint",
            history: [
                { event: "Minted", owner: "0xABC123DEF456", timestamp: "2025-06-12T10:30:00Z", hash2: "0xCOMMITMENTHASH1234567890ABCDEFABCDEF" },
            ]
        },
        "QR654321": {
            id: "QR654321",
            status: "Transferred",
            slot: "S002",
            owner: "0xNEWOWNERPUBKEY7890ABCDEF1234567890",
            hash1: "f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1",
            hash2: "0xCOMMITMENTHASHABCDEF9876543210ABCDEF",
            timestamp: "2025-06-12T11:00:00Z",
            prev_hash: "0xPREVQR123456HASH2", // Linked to QR123456's hash2 as prev_hash for transfer
            type: "Transfer",
            history: [
                { event: "Minted", owner: "0xOLDOWNERABC123", timestamp: "2025-06-12T09:00:00Z", hash2: "0xORIGINALHASHXYZ" },
                { event: "Transferred", owner: "0xNEWOWNERPUBKEY7890ABCDEF1234567890", timestamp: "2025-06-12T11:00:00Z", hash2: "0xCOMMITMENTHASHABCDEF9876543210ABCDEF" }
            ]
        },
        // Mock data for a QR that leads to a Master Node
        "MASTERQR001": {
            id: "MASTERQR001",
            status: "Master Node",
            slot: "MSTR001",
            owner: "0xMASTERPUBKEYXYZABCDEF1234567890",
            hash1: "m1a2s3t4e5r6m1a2s3t4e5r6m1a2s3t4e5r6",
            hash2: "0xMASTERCOMMITMENTHASHABCDEF",
            timestamp: "2025-01-01T00:00:00Z",
            prev_hash: "0xGENESISHASH",
            type: "Master Node Registration",
            history: [
                { event: "Registered", owner: "0xMASTERPUBKEYXYZABCDEF1234567890", timestamp: "2025-01-01T00:00:00Z", hash2: "0xMASTERCOMMITMENTHASHABCDEF" }
            ],
            agent_qrs: [ // Example of linking to child QRs
                { id: "AGENTQR001", hash2: "0xAGENTHASH001" },
                { id: "AGENTQR002", hash2: "0xAGENTHASH002" }
            ]
        }
    };

    /**
     * Simulates parsing QR content or a Commitment Hash to find relevant chain data.
     * In a real scenario, this would involve complex parsing, decryption, and lookup.
     * @param {string} input - The QR content (JSON) or Commitment Hash (Hash2).
     * @returns {object|null} The mock chain data, or null if not found.
     */
    function parseAndRetrieveChainData(input) {
        input = input.toLowerCase(); // Normalize input for easier matching
        for (const key in mockChainData) {
            const data = mockChainData[key];
            if (data.id.toLowerCase() === input ||
                data.hash2.toLowerCase() === input ||
                JSON.stringify(data).toLowerCase().includes(input)) { // Simple check if input is part of data
                return data;
            }
        }
        // Fallback for simple ID lookup if the full hash or content isn't provided
        if (input.startsWith("qr")) {
            const qrId = input.toUpperCase();
            if (mockChainData[qrId]) {
                return mockChainData[qrId];
            }
        }
        return null;
    }

    /**
     * Renders a single chain item in the index.
     * @param {object} data - The chain data for a single record.
     * @param {number} level - The nesting level for indentation (for tree view).
     * @returns {string} HTML string for the list item.
     */
    function renderChainItem(data, level = 0) {
        // Basic rendering of details. In a real app, this would be more detailed.
        const detailHtml = `
            <div class="chain-detail" style="display:none; padding-left: ${level * 15}px;">
                <div><strong>Type:</strong> ${data.type || 'N/A'}</div>
                <div><strong>Slot:</strong> ${data.slot || 'N/A'}</div>
                <div><strong>Owner:</strong> ${data.owner || 'N/A'}</div>
                <div><strong>Hash1:</strong> <span class="hash-text">${data.hash1 || 'N/A'}</span></div>
                <div><strong>Hash2 (Commitment):</strong> <span class="hash-text">${data.hash2 || 'N/A'}</span></div>
                <div><strong>Timestamp:</strong> ${data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}</div>
                <div><strong>Previous Hash:</strong> <span class="hash-text">${data.prev_hash || 'N/A'}</span></div>
                ${data.history && data.history.length > 0 ?
                    `<div><strong>History:</strong><ul>` +
                    data.history.map(h => `<li>${h.event} by ${h.owner.substring(0, 8)}... at ${new Date(h.timestamp).toLocaleString()}</li>`).join('') +
                    `</ul></div>` : ''
                }
                ${data.agent_qrs && data.agent_qrs.length > 0 ?
                    `<div><strong>Associated QRs:</strong><ul>` +
                    data.agent_qrs.map(qr => `<li>ID: ${qr.id} (Hash2: ${qr.hash2.substring(0, 10)}...)</li>`).join('') +
                    `</ul></div>` : ''
                }
                <div class="chain-actions">
                    <button class="btn btn-primary btn-small" onclick="window.location.href='regenerate_qr_hash.html?hash2=${data.hash2}'">Regen This QR</button>
                    <button class="btn btn-primary btn-small" onclick="window.location.href='transfer_qr.html?hash2=${data.hash2}'">Transfer This QR</button>
                    <button class="btn btn-primary btn-small" onclick="window.location.href='audit_chain.html?hash2=${data.hash2}'">Audit Full Chain</button>
                    <button class="btn btn-secondary btn-small" onclick="alert('Export functionality for ${data.id} is coming soon!')">Export Data</button>
                </div>
            </div>
        `;

        return `
            <li>
                <span style="padding-left: ${level * 15}px;">${data.id} (${data.status})</span>
                <button class="expand-btn">[+]</button>
                ${detailHtml}
            </li>
        `;
    }

    /**
     * Main function to handle the "Expand Chain" action.
     */
    expandChainBtn.addEventListener('click', () => {
        const inputContent = qrInput.value.trim();
        chainIndexList.innerHTML = ''; // Clear previous results

        if (inputContent) {
            const foundData = parseAndRetrieveChainData(inputContent);

            if (foundData) {
                chainIndexSection.style.display = 'block';
                // Render the found QR
                chainIndexList.innerHTML += renderChainItem(foundData);

                // For a more advanced "chain lineage", you'd recursively find prev_hash
                // For this mockup, we'll just show the direct item.
                // In a real 'audit-chain.js', it would build the full tree.

            } else {
                alert('No chain data found for the provided input. Please try a different QR Content or Hash.');
                chainIndexSection.style.display = 'none';
            }
        } else {
            alert('Please enter QR Content or a Commitment Hash to expand the chain.');
            chainIndexSection.style.display = 'none';
        }
    });

    // Event listener for expanding/collapsing list items
    chainIndexList.addEventListener('click', (event) => {
        if (event.target.classList.contains('expand-btn')) {
            const detailDiv = event.target.nextElementSibling;
            if (detailDiv && detailDiv.classList.contains('chain-detail')) {
                const isHidden = detailDiv.style.display === 'none';
                detailDiv.style.display = isHidden ? 'block' : 'none';
                event.target.textContent = isHidden ? '[-]' : '[+]';
            }
        }
    });

    // We'll leave the 'uploadQrBtn' and 'scanQrBtn' logic in index.html for now
    // as their implementation would be more complex and require specific browser APIs or libraries.
});
