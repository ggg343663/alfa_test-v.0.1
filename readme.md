แน่นอนครับ นี่คือ **DTC “One Page Minimal” — UI/UX Design & Core Logic (อัปเดตเวอร์ชัน 0.7.6.5.8 | กรกฎาคม 2025)**
พร้อมปรับถ้อยคำและ logic ให้สอดคล้องกับการ implement จริงล่าสุด, policy เวอร์ชัน DTC-2025, และ best practice ที่เกิดขึ้น

---

# DTC “One Page Minimal” — UI/UX Design & Core Logic

> **มาตรฐาน UI/UX & Core Logic ฉบับ “Minimal” ที่ต้องใช้กับทุกหน้าเว็บของ DTC**
>
> **เวอร์ชัน 0.7.6.5.8 | อัปเดตล่าสุด: ก.ค. 2025 | อ้างอิง Whitepaper, Production Code, และ Audit Log จริง**

---

## 1. **หลักการออกแบบ (Minimal Principle)**

* **One Page, No Distraction:** ทุกฟังก์ชัน “อยู่ในหน้าเดียว” ไม่มี menu ย่อย, popup หรือ modal ซ้อน
* **สื่อสถานะด้วยสี/ขอบ/ไอคอน:** ความสำเร็จ/ผิดพลาด/สถานะ สื่อด้วยสี, ขอบ, หรือ icon เล็ก — *ไม่มี alert/dialog เด้งหรือ banner รบกวน*
* **Form-First:** Input สำคัญสุด, Output (QR, Hash, Log) เล็ก, อยู่หลังหรือข้าง input
* **ตำแหน่งปุ่มคงที่:** ปุ่มหลักอยู่ล่างสุด (nav-bar), ขนาดและตำแหน่งเท่ากัน
* **Mobile First & Touch Optimized:** ทุกปุ่มกดง่าย, รองรับมือถือ 100%
* **No Sensitive Storage:** Password, PIN, Secret ไม่เก็บใน storage ทุกชนิด, เคลียร์อัตโนมัติเมื่อปิด tab
* **ไม่มี slot/slot\_id:** *ห้าม* มีฟิลด์หรือ logic ใดใช้ slot, slot\_id, หรือ index ลำดับ “ที่แก้ไขได้”
* **Self-Audit & Proof:** ทุกธุรกรรม log & audit chain ได้ 100% ด้วย double hash, timestamp, nonce, pubkey

---

## 2. **โครงสร้าง UI (Section-by-Section Minimal Logic)**

### A. **Key, Batch, Input (โทนเทา/เหลืองอ่อน)**

* กล่อง input: password, pin, secret = #fffde7
* ข้อมูล batch: ชื่อ, จำนวน = #f6f7fa
* label/hint = #90a4ae ใต้ input
* **Session Storage** เฉพาะข้อมูล non-sensitive เช่น batch name/qty

### B. **ปุ่ม Action (เด่น, ใหญ่, ตำแหน่งแน่นอน)**

* ปุ่ม Generate/Export/Regen = สีชัด, กว้าง, อยู่ล่าง/กลาง, กดง่าย

### C. **Preview/Results (โทนฟ้า/เหลือง/เทา, ไม่เด่นกว่า input)**

* QR preview, hash1, hash2 = กล่อง slide ได้, ปุ่ม copy เล็ก, ปุ่ม export (เหลือง/ฟ้า)
* Timestamp (ISO8601) = ขวาล่าง #607d8b
* **Output เล็ก, ไม่แย่งจุดสนใจจาก input**

### D. **Regen QR**

* Ticket, prev\_hash, timestamp, nonce, password, pin, secret = สีเทา/เหลือง
* ปุ่ม Regen (ฟ้า), hash ตัวอย่างแสดงหลังสำเร็จ

### E. **Audit Chain**

* ช่อง input hash2, ปุ่ม Audit
* กล่อง chain แบบ expand/collapse, node type color code

### F. **Navigation Bar (ล่างจอ, ม่วงจาง/เทา)**

* ปุ่ม Back | Home | Next (ขนาดเท่ากัน, กว้าง, ติดล่างสุด)

---

## 3. **UX & Accessibility**

* **Empty State:** กล่องว่าง, ไอคอน+ข้อความจาง “รอผล/ไม่มีข้อมูล”
* **Success/Error/Loading:** สี, ขอบ, ไอคอน, spinner (disable ปุ่ม)
* **Sensitive Input:** กล่องเหลือง, auto-clear
* **Label/Contrast/Font ≥ 15px, keyboard friendly, ARIA label**
* **Mobile-Responsive 100%** (แสดงผลสวยทุกอุปกรณ์)

---

## 4. **Security & State Policy (ตาม DTC Production)**

* ไม่มี “ล้างข้อมูลทั้งหมด” ในหน้าเดียว
* password, pin, secret = ไม่เก็บ storage ใดๆ, เคลียร์เมื่อปิด tab
* ticket regen ต้องให้ผู้ใช้วางเอง, ไม่มี auto-fill
* batch/log เก็บ session เท่านั้น

---

## 5. **Core Logic & Naming (Production Standard)**

### 5.1 **Key Generation (2025 Update)**

```python
import re, hashlib
assert re.search(r'[^a-zA-Z0-9]', password)
hash1 = SHA256(password)
hash2 = SHA256(pin)
private_key = SHA256(hash1 + hash2)
public_key = SHA256(private_key)
# public_address = SHA256(public_key)[:40]
```

* **Password ต้องมี symbol อย่างน้อย 1 ตัว**
* **PIN = 5 หลัก**
* Public Address เอา sha256(pubkey)\[:40] (hex)

### 5.2 **Genesis Node**

```python
genesis_hash = SHA256(public_key + seed + timestamp + nonce)
prev_hash = "0"*64
qr_id = "GENESIS_000"
```

### 5.3 **Master/Agent Registration**

```python
# Master Node
master_raw = prev_hash + "master" + master_id + pubkey + "" + timestamp + nonce
master_hash = SHA256(master_raw)

# Agent Node (≤ 10,000 agent ต่อ master)
agent_raw = prev_hash + "agent" + agent_id + pubkey + "" + timestamp + nonce
agent_hash = SHA256(agent_raw)
```

* master\_id: ≤8 ตัว, พิมพ์ใหญ่ + `_000`
* agent\_id: ≤16 ตัว, พิมพ์เล็ก + `_000` หรือใช้ `:`

### 5.4 **QR Assignment (Deterministic, No Slot)**

```python
def assign_qr_order(node_hash, total_count, timestamp):
    assigned = [None] * total_count
    used_index = set()
    for i in range(1, total_count+1):
        raw = f"{node_hash}_QR_{i:03d}:{timestamp}"
        h = hashlib.sha256(raw.encode()).hexdigest()
        idx = int(h, 16) % total_count
        orig_idx = idx
        while idx in used_index:
            idx = (idx + 1) % total_count
            if idx == orig_idx:
                raise Exception("No available index!")
        assigned[idx] = i
        used_index.add(idx)
    return assigned
# qr_id = [node_id]_[เลข 3 หลัก] เช่น maple_000_134
```

* **ห้ามใช้ slot/slot\_id**
* qr\_id ต้อง deterministic, ไม่มี index แบบ dynamic

### 5.5 **Register/Activate QR**

```python
def register_qr(pubkey, node_hash, assigned_index, whitelist):
    qr_id = f"{node_hash.lower()}_{assigned_index:03d}"
    timestamp = str(int(time.time()))
    whitelist[qr_id] = {
        "qr_id": qr_id,
        "node_hash": node_hash,
        "registered_by": pubkey,
        "timestamp": timestamp,
        "status": "active"
    }
    return qr_id
```

### 5.6 **Transfer/Ownership**

```python
transfer_hash = SHA256(prev_owner_hash + to_pubkey + timestamp + nonce)
signature = sign(private_key, transfer_hash)
```

* Log transfer ทุกครั้ง, ต้องมี prev\_hash, nonce, timestamp

### 5.7 **Double Hash Commitment / Regen**

```python
hash1 = SHA256(qr_content)
hash2 = SHA256(hash1 + meta_info)
regen_hash = SHA256(prev_hash + object_type + object_id + public_key + to_public_key + timestamp + nonce)
assert regen_hash == qr["hash"]
```

* regen ต้องใช้ input จริงตรง spec เท่านั้น

### 5.8 **QR ID แบบ 0x… (address-style)**

```python
def make_qr_id(pubkey, parent_hash, index, timestamp=None, nonce=None):
    if not timestamp:
        timestamp = str(int(time.time()))
    if not nonce:
        nonce = os.urandom(8).hex()
    raw = f"{pubkey}:{parent_hash}:{index}:{timestamp}:{nonce}"
    h = hashlib.sha256(raw.encode()).hexdigest()
    return "0x" + h[-40:], nonce, timestamp
```

* สำหรับ QR ที่ต้องการ address-style

### 5.9 **Logging/Audit Trail**

* log ทุกรายการ mint, register, transfer, regen, revoke
* ทุกธุรกรรม audit/self-proof ได้ 100%
* log ตัวอย่าง: id (name-id + address) ครบทุกจุด

---

## 6. **มาตรฐาน Naming & Policy**

| Type    | Structure       | Notes                    |
| ------- | --------------- | ------------------------ |
| genesis | GENESIS\_000    | root node only           |
| master  | MAPLE\_000      | UPPER ≤8 + \_000         |
| agent   | maple\_000      | lower ≤16 + \_000 or ":" |
| qr      | maple\_000\_134 | deterministic assignment |
| 0xqr    | 0x… (40 hex)    | address style, optional  |

* **ห้ามใช้ slot/slot\_id**
* agent node = \_000 หรือมี colon
* qr\_hash ≠ qr\_id

---

## 7. **Security (Production Policy)**

* Password/Public Key ต้องมี symbol อย่างน้อย 1 ตัว
* password/PIN ต้องไม่ซ้ำระบบอื่น
* ไม่เก็บ private key plain
* ทุกธุรกรรมมี timestamp+nonce
* เช็ค id/hash ซ้ำทุกครั้ง
* ป้องกัน double spend/transfer ซ้ำ

---

## 8. **ตัวอย่าง log (Updated)**

```json
{
  "tx_id": "maple_000_134",
  "qr_address": "0x1f3f5e9ab12d75af4e2c2cfe3ad527bd8074654a",
  "prev_hash": "0000...000",
  "timestamp": "2025-07-15T10:15:00.000Z",
  "qr_hash": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "pubkey": "0x1234567890abcdef1234567890abcdef12345678",
  "action": "register",
  "detail": "Initial QR registration",
  "sig": "SIGNATURE_BASE64_OR_HEX",
  "meta": {
    "batchName": "Spring2025A",
    "appVersion": "1.0.0"
  }
}
```

---

## 9. **สรุป & คำแนะนำล่าสุด**

* ระบบ DTC Minimal นี้ **โปร่งใส, Audit/Self-Proof 100%**
* UI/UX ใช้ One Page Minimal ตาม spec นี้ทุกหน้า
* Naming, Logic, Logging, Security, ID—all **ตรงตาม Whitepaper & production policy**
* ใช้ไฟล์นี้เป็น **“มาตรฐานกลาง” ในการตรวจสอบงาน UI/Logic ของทีม, การเขียน Regression Test, และการเทียบ Audit Chain**

---

**(ต้องการ Check-list/Template/Audit tool เพิ่มเติม, หรือเอกสารเปรียบเทียบกับเวอร์ชันก่อน แจ้งได้ทันทีครับ!)**
