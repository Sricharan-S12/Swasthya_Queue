# 🏥 Swasthya Queue

<div align="center">

### AI-Powered Teleconsultation, Triage & Emergency Referral Platform

Designed for Rural Primary Health Centres (PHCs) to streamline patient prioritization, teleconsultation workflows, and emergency referrals.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://swasthya-queue.netlify.app/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)

🌐 **Live Demo:** https://swasthya-queue.netlify.app/

</div>

---

## 📖 Overview

Swasthya Queue is an intelligent healthcare workflow platform built to address challenges faced by rural healthcare centres, including patient overcrowding, delayed triage, limited specialist availability, and inefficient referral systems.

The platform combines:

* Smart patient triage
* Dynamic queue management
* Teleconsultation support
* Emergency referral workflows
* Multi-channel accessibility
* Offline-first operations

to help healthcare providers deliver faster and more efficient care.

---

## 📑 Table of Contents

* Overview
* Problem Statement
* Key Features
* System Architecture
* Access Channels
* Triage Priority Model
* Doctor Dashboard Credentials
* Technology Stack
* Getting Started
* Browser Support
* Project Structure
* Roadmap
* Contributing
* License

---

## 🎯 Problem Statement

Rural Primary Health Centres often struggle with:

* High patient volumes
* Delayed identification of critical cases
* Manual queue management
* Connectivity limitations
* Inefficient emergency referral coordination

These challenges can result in delayed treatment for patients who require urgent medical attention.

Swasthya Queue introduces a structured triage and referral ecosystem to improve operational efficiency and patient outcomes.

---

## ✨ Key Features

### Smart Triage Engine

* START-inspired triage algorithm
* Dynamic patient prioritization
* Real-time queue reordering
* Age-sensitive risk scoring
* Automated severity classification

### Multi-Channel Patient Registration

* 🌐 Web Portal
* 📟 USSD (*599#)
* 💬 WhatsApp
* 📱 SMS

### Doctor Dashboard

* Secure clinician login
* Live patient queue
* AI-generated patient summaries
* Teleconsultation workflow
* Patient messaging
* Referral escalation

### Emergency Command Center

* Hospital matching
* Bed availability tracking
* Ambulance dispatch workflow
* Referral management
* Real-time status monitoring

### Offline-First Operations

* Local data persistence
* Connectivity monitoring
* Automatic synchronization
* Recovery after network interruption

### Multi-Language Accessibility

* English
* Hindi
* Tamil
* Telugu
* Kannada

---

## 🏗️ System Architecture

```text
Patient Registration
        │
        ▼
  Triage Engine
        │
        ▼
 Priority Queue
        │
        ▼
 Doctor Dashboard
        │
        ▼
 Referral Command Center
        │
        ▼
Hospital & Ambulance Network
```

---

## 🚑 Access Channels

| Channel      | Connectivity Requirement | Target Users             |
| ------------ | ------------------------ | ------------------------ |
| Web Portal   | Internet Available       | Clinics & Health Workers |
| USSD (*599#) | No Internet Required     | Rural Communities        |
| WhatsApp     | Smartphone Users         | Remote Patients          |
| SMS          | Basic Phones             | Low-Connectivity Areas   |

---

## 🚨 Triage Priority Model

| Priority  | Category | Action                |
| --------- | -------- | --------------------- |
| 🔴 RED    | Critical | Immediate Attention   |
| 🟠 ORANGE | Moderate | Priority Consultation |
| 🟢 GREEN  | Routine  | Standard Queue        |

### Scoring Framework

| Clinical Factor         | Score    |
| ----------------------- | -------- |
| Chest Pain              | +4       |
| Breathlessness          | +4       |
| Seizure                 | +4       |
| High Fever              | +2       |
| Severe Headache         | +2       |
| Injury                  | +2       |
| Vomiting                | +1       |
| Abdominal Pain          | +1       |
| Common Cold             | +1       |
| Patient Severity Rating | +1 to +5 |
| Age Risk Multiplier     | ×1.5     |

---

## 👨‍⚕️ Doctor Dashboard Credentials

| Field    | Value       |
| -------- | ----------- |
| Username | `doctor`    |
| Password | `doctor123` |

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6)

### Mapping & Geospatial Services

* Leaflet.js
* OpenStreetMap

### Communication Channels

* USSD Workflow Simulation
* SMS Workflow Simulation
* WhatsApp Workflow Simulation

### Localization

* Google Translate Widget

### Typography

* Inter
* Outfit

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Sricharan-S12/Swasthya_Queue.git
cd Swasthya_Queue
```

### Run Locally

#### macOS

```bash
open index.html
```

#### Windows

```cmd
start index.html
```

#### Linux

```bash
xdg-open index.html
```

No installation or build process is required.

---

## 🌍 Browser Support

| Browser | Supported |
| ------- | --------- |
| Chrome  | ✅         |
| Edge    | ✅         |
| Firefox | ✅         |
| Safari  | ✅         |

---

## 📁 Project Structure

```text
Swasthya_Queue/
├── README.md
└── Swasthya-queue (genaiproject).html
```

### Planned Modules (Future Scope)

The following modules are part of the intended project architecture and may be added in future development:

* Patient Registration Module
* Doctor Dashboard
* Referral Command Center
* Teleconsultation Module
* USSD Interface
* SMS Interface
* Offline Sync Layer

---

## 🛣️ Roadmap

### Healthcare Integrations

* [ ] eSanjeevani Integration
* [ ] ABHA ID Lookup
* [ ] NIC eReferral Integration
* [ ] State Ambulance APIs

### Platform Enhancements

* [ ] Progressive Web App Support
* [ ] Push Notifications
* [ ] Analytics Dashboard
* [ ] PHC Administration Console

### Intelligence Layer

* [ ] Predictive Queue Analytics
* [ ] AI Clinical Decision Support
* [ ] Referral Optimization Engine

---

## 🤝 Contributing

Contributions are welcome.

### Workflow

```bash
git checkout -b feature/your-feature
git commit -m "feat: add feature"
git push origin feature/your-feature
```

Then create a Pull Request.

---

## 📄 License

This project is intended for educational, research, and healthcare innovation purposes.

For commercial deployment, please contact the project maintainers.

---

<div align="center">

### Bridging the Last Mile of Rural Healthcare Access

Empowering healthcare providers through intelligent triage, teleconsultation, and emergency referral workflows.

</div>
