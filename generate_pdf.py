import os
from fpdf import FPDF

class LifeLinkPDF(FPDF):
    def header(self):
        # Header banner
        self.set_fill_color(139, 0, 21) # Maroon #8B0015
        self.rect(0, 0, 210, 24, 'F')
        
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(255, 255, 255)
        self.set_xy(10, 6)
        self.cell(0, 6, 'LifeLink Blood Platform - Operational Workflow & Protocol', 0, 1, 'L')
        
        self.set_font('Helvetica', '', 8)
        self.set_text_color(255, 218, 215)
        self.set_xy(10, 13)
        self.cell(0, 5, 'National Blood Transfusion Council (NBTC) Accredited Grid | Design System #13012171430098445569', 0, 1, 'L')
        
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'LifeLink Blood Platform Workflow Document  |  Page {self.page_no()}/{{nb}}', 0, 0, 'C')

def build_pdf():
    pdf = LifeLinkPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Title Block
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(139, 0, 21)
    pdf.cell(0, 10, 'LifeLink Blood Platform System Workflow', 0, 1, 'L')
    
    pdf.set_font('Helvetica', 'I', 10)
    pdf.set_text_color(90, 65, 63)
    pdf.cell(0, 6, 'End-to-End Operational Protocols & Persona Interaction Models', 0, 1, 'L')
    pdf.ln(4)

    # Section 1: Executive Summary
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_fill_color(246, 243, 242)
    pdf.set_text_color(139, 0, 21)
    pdf.cell(0, 8, ' 1. Executive Summary & Mission', 1, 1, 'L', fill=True)
    pdf.ln(2)
    
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(27, 28, 28)
    summary_text = (
        "The LifeLink Blood Platform is an institutional digital framework connecting voluntary blood donors, "
        "emergency hospital trauma centers, regional blood bank cold-chain vaults, and regulatory oversight councils. "
        "Designed to eliminate delays, wastage, and manual friction during critical medical requisitions, the system "
        "provides real-time inventory visibility, automated matching, and tracked ambulance dispatch."
    )
    pdf.multi_cell(0, 5, summary_text)
    pdf.ln(4)

    # Section 2: High Level Workflow
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_fill_color(246, 243, 242)
    pdf.set_text_color(139, 0, 21)
    pdf.cell(0, 8, ' 2. Core 5-Stage Requisition & Allocation Workflow', 1, 1, 'L', fill=True)
    pdf.ln(3)

    steps = [
        ("Stage 1: Requisition", "Hospital submits emergency requirement with clinical urgency code (Critical, High, Routine)."),
        ("Stage 2: Vault Match", "Coordinator Console verifies stock compatibility (ABO/Rh, PRBC, Platelets, FFP) & safety margin."),
        ("Stage 3: Cryo Packaging", "Units packaged in insulated cryo containers maintaining strict 4°C temperature log."),
        ("Stage 4: Express Dispatch", "Ambulance dispatched with GPS tracking, temperature telemetry, and live ETA updates."),
        ("Stage 5: Handover & Log", "Hospital OT reception verification and automated AIP-160 immutable audit log entry.")
    ]

    for title, desc in steps:
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(185, 28, 42)
        pdf.cell(45, 6, title, 0, 0, 'L')
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(27, 28, 28)
        pdf.multi_cell(0, 6, desc)
        pdf.ln(1)

    pdf.ln(3)

    # Section 3: Persona Workflows Table
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_fill_color(246, 243, 242)
    pdf.set_text_color(139, 0, 21)
    pdf.cell(0, 8, ' 3. Persona Operational Matrix & Feature Modules', 1, 1, 'L', fill=True)
    pdf.ln(3)

    # Table Header
    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_fill_color(139, 0, 21)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(32, 7, 'Role / Persona', 1, 0, 'C', fill=True)
    pdf.cell(48, 7, 'Key Feature Modules', 1, 0, 'C', fill=True)
    pdf.cell(65, 7, 'Operational Actions', 1, 0, 'C', fill=True)
    pdf.cell(45, 7, 'Compliance / Output', 1, 1, 'C', fill=True)

    # Table Rows
    data = [
        ("Voluntary Donor", "Donor Dashboard\nDonor Profile\nDonation History", "Check eligibility, book slots, view health metrics, pledge blood", "Digital Donor Pass\nPDF Certificate"),
        ("Requester / ER", "Requester Console\nRequest Form\nLive Tracker", "Submit requisitions, track ambulance dispatch, view history", "Real-Time ETA\n5-Stage Timeline"),
        ("Coordinator", "Dispatch Desk\nVault Inventory\nExpiry Alerts", "Match vault stock, release cryo units, manage 24h expiry risks", "Cold-Chain Log\nStock Adjustments"),
        ("System Admin", "System Oversight\nAudit Logs\nSettings Hub", "AIP-160 event logging, user RBAC, safety margin thresholds", "Immutable Audit\nRegulatory Reports")
    ]

    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(27, 28, 28)
    for role, mods, actions, output in data:
        # Calculate row height based on max lines
        pdf.cell(32, 22, role, 1, 0, 'C')
        
        x = pdf.get_x()
        y = pdf.get_y()
        pdf.multi_cell(48, 5.5, mods, 1, 'L')
        
        pdf.set_xy(x + 48, y)
        pdf.multi_cell(65, 5.5, actions, 1, 'L')
        
        pdf.set_xy(x + 48 + 65, y)
        pdf.multi_cell(45, 5.5, output, 1, 'L')

    pdf.ln(6)

    # Section 4: Technical Specs & Output
    pdf.set_font('Helvetica', 'B', 12)
    pdf.set_fill_color(246, 243, 242)
    pdf.set_text_color(139, 0, 21)
    pdf.cell(0, 8, ' 4. Technical Stack & Verification Summary', 1, 1, 'L', fill=True)
    pdf.ln(3)

    pdf.set_font('Helvetica', '', 9)
    specs = [
        "Frontend Stack: React 18, TypeScript, Vite v8, Tailwind CSS v4, React Router v7, Lucide Icons.",
        "Design System: 100% Stitch project #13012171430098445569 alignment (Maroon #8B0015, Red #B91C2A).",
        "API Integration Layer: Axios client abstraction (apiClient) with isolated service methods ready for backend.",
        "Build Status: Verified with 0 errors via 'npx tsc --noEmit' and 'npm run build'.",
        "Live Repository: https://github.com/akaashbytes/Blood-bank-and-Emergency-Donar-recommendation-System.git"
    ]
    for spec in specs:
        pdf.cell(5, 5, chr(149), 0, 0, 'C')
        pdf.cell(0, 5, spec, 0, 1, 'L')

    # Output file
    output_path = r"r:\final year rpoject\blood bank\LifeLink_Blood_Platform_Workflow.pdf"
    pdf.output(output_path)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == '__main__':
    build_pdf()
