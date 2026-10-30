export interface IAppointmentSlipData {
  appointmentRef: string;
  serialNumber?: number | string;
  patientName: string;
  patientPhone: string;
  patientAge?: string | number;
  patientGender?: string;
  chiefComplaint?: string;
  chamberName: string;
  chamberAddress?: string;
  chamberCity?: string;
  appointmentDate: string;
  startTime: string;
  serviceName: string;
  fee: number | string;
  isPaid?: boolean;
  doctorName?: string;
  doctorDegrees?: string;
  doctorBmdc?: string;
  emergencyPhone?: string;
}

export function printAppointmentSlip(data: IAppointmentSlipData) {
  const doctorName = data.doctorName || "Prof. Dr. Sarah Rahman";
  const doctorDegrees = data.doctorDegrees || "MBBS, FCPS (Medicine), MD (Cardiology)";
  const doctorBmdc = data.doctorBmdc || "A-45892";
  const emergencyPhone = data.emergencyPhone || "+880 1700-112233";

  const feeFormatted =
    data.fee === 0 || data.fee === "0" || data.fee === "FREE"
      ? "FREE (৳0)"
      : typeof data.fee === "number"
      ? `৳ ${data.fee.toLocaleString()}`
      : `${data.fee}`;

  const feeStatus = data.isPaid ? "PAID" : "DUE AT CHAMBER";

  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow) {
    window.print();
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Appointment_Receipt_${data.appointmentRef}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .slip-container {
      max-width: 720px;
      margin: 0 auto;
      border: 2px solid #1673b8;
      border-radius: 12px;
      padding: 28px 32px;
      background: #ffffff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 18px;
      margin-bottom: 22px;
    }
    .doctor-name {
      font-size: 22px;
      font-weight: 800;
      color: #0b1c2e;
      margin: 0 0 4px 0;
    }
    .doctor-sub {
      font-size: 13px;
      color: #1673b8;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    .reg-num {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
    .header-right {
      text-align: right;
    }
    .voucher-title {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1673b8;
      background: #e8f2fa;
      padding: 5px 12px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 6px;
    }
    .hotline {
      font-size: 12px;
      color: #475569;
      margin: 0;
    }
    .hotline strong {
      color: #0b1c2e;
    }

    /* Queue Token Banner */
    .token-card {
      background: #f8fafd;
      border: 2px dashed #1673b8;
      border-radius: 10px;
      padding: 16px 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .token-left {
      text-align: left;
    }
    .token-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 2px;
    }
    .token-val {
      font-size: 34px;
      font-weight: 900;
      color: #1673b8;
      line-height: 1;
    }
    .token-center {
      text-align: center;
    }
    .token-right {
      text-align: right;
    }
    .ref-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 15px;
      font-weight: 800;
      color: #0b1c2e;
      background: #e2e8f0;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 4px;
    }
    .status-badge {
      display: inline-block;
      background: #dcfce7;
      color: #15803d;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #bbf7d0;
    }

    /* Details Grid */
    .grid-section {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .col-half {
      flex: 1;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .col-header {
      background: #f1f5f9;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #334155;
      border-bottom: 1px solid #e2e8f0;
    }
    .col-body {
      padding: 12px 14px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #f8fafc;
      font-size: 13px;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #64748b;
      font-weight: 600;
    }
    .detail-val {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
    }

    /* Instructions Box */
    .instructions {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #1673b8;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 24px;
    }
    .instructions-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      color: #1e293b;
      margin-bottom: 6px;
    }
    .instructions ul {
      margin: 0;
      padding-left: 18px;
      font-size: 12px;
      color: #475569;
      line-height: 1.6;
    }

    /* Barcode Simulation */
    .barcode-area {
      text-align: center;
      margin-bottom: 20px;
    }
    .barcode-lines {
      display: inline-block;
      height: 32px;
      width: 220px;
      background: repeating-linear-gradient(
        90deg,
        #0b1c2e,
        #0b1c2e 2px,
        #fff 2px,
        #fff 4px,
        #0b1c2e 4px,
        #0b1c2e 7px,
        #fff 7px,
        #fff 9px
      );
      border-radius: 2px;
    }
    .barcode-text {
      font-family: ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Footer */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      font-size: 11px;
      color: #94a3b8;
    }
    .stamp-box {
      text-align: center;
      border-top: 1px dashed #cbd5e1;
      width: 170px;
      padding-top: 6px;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="slip-container">
    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="doctor-name">${doctorName}</h1>
        <div class="doctor-sub">${doctorDegrees}</div>
        <p class="reg-num">BMDC Reg. No: <strong>${doctorBmdc}</strong></p>
      </div>
      <div class="header-right">
        <div class="voucher-title">Consultation Slip &amp; Queue Pass</div>
        <p class="hotline">Emergency: <strong>${emergencyPhone}</strong></p>
        <p class="reg-num">Issued: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
      </div>
    </div>

    <!-- Queue Token Banner -->
    <div class="token-card">
      <div class="token-left">
        <div class="token-label">Queue Token</div>
        <div class="token-val">#${data.serialNumber || 1}</div>
      </div>
      <div class="token-center">
        <div class="token-label">Booking Reference</div>
        <div class="ref-val">${data.appointmentRef}</div>
      </div>
      <div class="token-right">
        <div class="token-label">Pass Status</div>
        <div class="status-badge">Confirmed</div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid-section">
      <!-- Patient Information -->
      <div class="col-half">
        <div class="col-header">Patient Information</div>
        <div class="col-body">
          <div class="detail-row">
            <span class="detail-label">Full Name:</span>
            <span class="detail-val">${data.patientName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-val">${data.patientPhone}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Demographics:</span>
            <span class="detail-val">${data.patientAge ? `${data.patientAge} Yrs / ` : ""}${data.patientGender || "Male"}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Reason / Symptoms:</span>
            <span class="detail-val">${data.chiefComplaint || "General Consultation"}</span>
          </div>
        </div>
      </div>

      <!-- Consultation Schedule -->
      <div class="col-half">
        <div class="col-header">Chamber Schedule</div>
        <div class="col-body">
          <div class="detail-row">
            <span class="detail-label">Chamber:</span>
            <span class="detail-val">${data.chamberName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-val">${data.chamberAddress ? `${data.chamberAddress}, ` : ""}${data.chamberCity || ""}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date &amp; Slot:</span>
            <span class="detail-val" style="color: #1673b8;">${data.appointmentDate} at ${data.startTime}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Consultation Fee:</span>
            <span class="detail-val">${feeFormatted} (${feeStatus})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="instructions">
      <div class="instructions-title">Important Patient Guidelines</div>
      <ul>
        <li>Please arrive at the chamber <strong>15 minutes prior</strong> to your scheduled slot for computerized triage and vitals check.</li>
        <li>Present this confirmation voucher or queue token number at the reception desk upon arrival.</li>
        <li>Carry all previous prescriptions, medical summaries, and recent diagnostic test reports.</li>
        <li>To reschedule or check live waiting queue updates, visit your online patient portal.</li>
      </ul>
    </div>

    <!-- Barcode -->
    <div class="barcode-area">
      <div class="barcode-lines"></div>
      <div class="barcode-text">* ${data.appointmentRef} *</div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>
        This is an official computer-generated medical appointment token.<br />
        Valid for entry at specified chamber location only.
      </div>
      <div class="stamp-box">
        Authorized Chamber Stamp<br />
        (Digital Verification)
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

