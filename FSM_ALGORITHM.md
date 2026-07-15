# Finite State Machine (FSM) — FTTH Provisioning

## Overview

FSM digunakan untuk mengelola lifecycle dari provisioning pelanggan FTTH. Setiap record provisioning berada dalam satu state, dan hanya bisa bertransisi ke state tertentu yang telah didefinisikan.

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> PENDING : Create provisioning
    
    PENDING --> PROVISIONING : Mulai eksekusi
    PENDING --> FAILED : Gagal sebelum eksekusi
    
    PROVISIONING --> ACTIVE : Sukses (MikroTik + OLT + Telegram)
    PROVISIONING --> FAILED : Gagal di salah satu step
    
    ACTIVE --> SUSPENDED : Suspend pelanggan
    SUSPENDED --> ACTIVE : Resume pelanggan
    
    FAILED --> PROVISIONING : Retry
```

## States

| State | Deskripsi |
|---|---|
| `IDLE` | Record baru, belum diproses |
| `PENDING` | Menunggu dieksekusi (baru dibuat) |
| `PROVISIONING` | Sedang diproses (MikroTik / OLT / Telegram) |
| `ACTIVE` | Berhasil, layanan aktif |
| `SUSPENDED` | Ditangguhkan sementara |
| `FAILED` | Gagal, bisa di-retry |

## Transition Rules

```javascript
TRANSITIONS = {
  IDLE:          ["PENDING"],
  PENDING:       ["PROVISIONING", "FAILED"],
  PROVISIONING:  ["ACTIVE", "FAILED"],
  ACTIVE:        ["SUSPENDED"],
  SUSPENDED:     ["ACTIVE"],
  FAILED:        ["PROVISIONING"],
};
```

## Validasi Transisi

Setiap perubahan state harus melewati validasi:

```
Input: currentState, newState
Process: Cek apakah newState ada di TRANSITIONS[currentState]
Output: Jika valid → update, Jika invalid → throw error
```

## Implementasi di Kode

### Backend (`constants.js`)
```javascript
const FSM_TRANSITIONS = {
  [FSM_STATES.IDLE]:          [FSM_STATES.PENDING],
  [FSM_STATES.PENDING]:       [FSM_STATES.PROVISIONING, FSM_STATES.FAILED],
  [FSM_STATES.PROVISIONING]:  [FSM_STATES.ACTIVE, FSM_STATES.FAILED],
  [FSM_STATES.ACTIVE]:        [FSM_STATES.SUSPENDED],
  [FSM_STATES.SUSPENDED]:     [FSM_STATES.ACTIVE],
  [FSM_STATES.FAILED]:        [FSM_STATES.PROVISIONING],
};

function validateTransition(currentState, newState) {
  const allowed = FSM_TRANSITIONS[currentState];
  if (!allowed || !allowed.includes(newState)) {
    throw new Error(
      `Invalid FSM transition: ${currentState} → ${newState}. ` +
      `Allowed: ${(allowed || []).join(", ") || "none"}`
    );
  }
}
```

### Alur Eksekusi dengan FSM

```mermaid
sequenceDiagram
    Frontend->>Backend: POST /api/provisioning
    Backend->>DB: INSERT (status=IDLE)
    Backend->>FSM: validate(IDLE→PENDING)
    Backend->>DB: UPDATE status=PENDING
    Backend-->>Frontend: {id, status:PENDING}
    
    Note over Backend: Async execution starts
    
    Backend->>FSM: validate(PENDING→PROVISIONING)
    Backend->>DB: UPDATE status=PROVISIONING
    Backend->>MikroTik: Create PPPoE Secret
    Backend->>FSM: validate(PROVISIONING→ACTIVE)
    Backend->>DB: UPDATE status=ACTIVE
    Backend->>Telegram: Send notification
    
    Note over Backend: On error at any step
    
    Backend->>FSM: validate(PROVISIONING→FAILED)
    Backend->>DB: UPDATE status=FAILED
```
