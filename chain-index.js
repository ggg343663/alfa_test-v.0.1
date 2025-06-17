// chain-index.js - DTC Minimal One Page Chain Viewer (v0.7.6.3+)
// UI/UX = No slot/slot_id, No secret, No alert, use color/icon/size only

document.addEventListener('DOMContentLoaded', () => {
    const expandChainBtn = document.getElementById('expandChainBtn');
    const qrInput = document.getElementById('qrInput');
    const chainIndexSection = document.getElementById('chainIndexSection');
    const chainIndexList = document.getElementById('chainIndexList');

    // Minimal mock chain data
    const mockChainData = {
        "QRMAPLE000001": {
            object_type: "qr",
            object_id: "maple_000_001",
            status: "active",
            owner: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
            public_key: "c1b2c3d4e5f6c1b2c3d4e5f6c1b2c3d4e5f6c1b2c3d4e5f6",
            qr_address: "0x1234567890ABCDEF1234567890ABCDEF12345678",
            hash: "0xHASH_QRMAPLE000001",
            prev_hash: "0xHASH_MAPLE000",
            timestamp: "2025-06-17T12:10:10Z",
            nonce: "xyz123",
            history: [
                { event: "mint", owner: "0xABCDEF...", timestamp: "2025-06-17T12:10:10Z", hash: "0xHASH_QRMAPLE000001" }
            ]
        },
        "AGENTMAPLE000": {
            object_type: "agent",
            object_id: "maple_000",
            status: "active",
            owner: "0xAGENTPUBKEYMAPLE000...",
            public_key: "b1c2d3e4f5g6...",
            hash: "0xHASH_MAPLE000",
            prev_hash: "0xHASH_MASTER",
            timestamp: "2025-06-16T08:22:22Z",
            nonce: "def456",
            history: [
                { event: "register", owner: "0xAGENT...", timestamp: "2025-06-16T08:22:22Z", hash: "0xHASH_MAPLE000" }
            ]
        },
        "MASTERMAPLE": {
            object_type: "master",
            object_id: "MAPLE_000",
            status: "active",
            owner: "0xMASTERPUBKEY...",
            public_key: "d2e3f4g5h6i7...",
            hash: "0xHASH_MASTER",
            prev_hash: "0xHASH_GENESIS",
            timestamp: "2025-06-10T00:00:00Z",
            nonce: "aaa111",
            history: [
                { event: "register", owner: "0xMASTER...", timestamp: "2025-06-10T00:00:00Z", hash: "0xHASH_MASTER" }
            ]
        }
        // (เพิ่ม QR/Agent/Master ตามโครงสร้างนี้ได้)
    };

    // ฟังก์ชันหาข้อมูลจาก mockChainData
    function parseAndRetrieveChainData(input) {
        input = input.trim().toLowerCase();
        for (const key in mockChainData) {
            const data = mockChainData[key];
            // Matching by object_id, hash, qr_address, public_key
            if (
                (data.object_id && data.object_id.toLowerCase() === input) ||
                (data.hash && data.hash.toLowerCase() === input) ||
                (data.qr_address && data.qr_address.toLowerCase() === input) ||
                (data.public_key && data.public_key.toLowerCase() === input)
            ) return data;
        }
        return null;
    }

    // ฟังก์ชันแสดงรายละเอียดแบบ Minimal ตาม DTC Spec
    function renderChainItem(data, level = 0) {
        return `
            <li>
                <div style="padding-left:${level * 14}px;">
                    <span style="font-weight:bold;">${data.object_id || data.object_type}</span>
                    <span style="background:#f3f6fa;border-radius:5px;padding:2px 8px;font-size:0.98em;margin-left:8px;">
                        ${data.object_type}
                    </span>
                    <span style="color:${data.status === 'active' ? '#22c55e' : '#d32f2f'};font-weight:500;margin-left:8px;">
                        ${data.status}
                    </span>
                    <button class="expand-btn" style="margin-left:9px;font-size:0.99em;">[+]</button>
                </div>
                <div class="chain-detail" style="display:none;margin-left:${level * 14 + 7}px;padding:7px 0 8px 12px;">
                    <div><strong>Public Key:</strong> <span class="hash-text">${data.public_key}</span></div>
                    <div><strong>Owner:</strong> <span class="hash-text">${data.owner}</span></div>
                    <div><strong>Hash:</strong> <span class="hash-text">${data.hash}</span></div>
                    <div><strong>Prev Hash:</strong> <span class="hash-text">${data.prev_hash}</span></div>
                    <div><strong>QR Address:</strong> <span class="hash-text">${data.qr_address || '-'}</span></div>
                    <div><strong>Timestamp:</strong> ${data.timestamp}</div>
                    <div><strong>Nonce:</strong> ${data.nonce}</div>
                    ${data.history && data.history.length > 0 ?
                        `<div style="margin-top:4px;"><strong>History:</strong><ul style="margin:3px 0 0 15px;">` +
                        data.history.map(h => `<li>${h.event} at ${new Date(h.timestamp).toLocaleString()}</li>`).join('') +
                        `</ul></div>` : ''
                    }
                    <div class="chain-actions" style="margin-top:5px;">
                        <button class="btn btn-primary btn-small" onclick="window.location.href='regenerate_qr_hash.html?hash=${data.hash}'">Regen</button>
                        <button class="btn btn-primary btn-small" onclick="window.location.href='transfer_qr.html?hash=${data.hash}'">Transfer</button>
                        <button class="btn btn-primary btn-small" onclick="window.location.href='audit_chain.html?hash=${data.hash}'">Audit</button>
                        <button class="btn btn-secondary btn-small" onclick="alert('Export (Minimal)')">Export</button>
                    </div>
                </div>
            </li>
        `;
    }

    expandChainBtn.addEventListener('click', () => {
        const inputContent = qrInput.value.trim();
        chainIndexList.innerHTML = '';
        if (inputContent) {
            const foundData = parseAndRetrieveChainData(inputContent);
            if (foundData) {
                chainIndexSection.style.display = 'block';
                chainIndexList.innerHTML = renderChainItem(foundData);
            } else {
                // ใช้สีแดง/feedback เฉพาะ ไม่ใช้ alert() เด้ง
                chainIndexSection.style.display = 'none';
                chainIndexList.innerHTML = `<li style="color:#e74c3c;">Not found. Please check ID/hash/public key.</li>`;
            }
        } else {
            chainIndexSection.style.display = 'none';
            chainIndexList.innerHTML = `<li style="color:#e74c3c;">Please enter QR Content or Hash.</li>`;
        }
    });

    chainIndexList.addEventListener('click', (event) => {
        if (event.target.classList.contains('expand-btn')) {
            const detailDiv = event.target.parentNode.nextElementSibling;
            if (detailDiv && detailDiv.classList.contains('chain-detail')) {
                const isHidden = detailDiv.style.display === 'none';
                detailDiv.style.display = isHidden ? 'block' : 'none';
                event.target.textContent = isHidden ? '[-]' : '[+]';
            }
        }
    });
});
