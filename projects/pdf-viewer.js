// For the multimorbidity page, display the full embedded PDF only when the file exists.
// This prevents a blank/404 iframe when the original report was not packaged.
(async function () {
  const root = document.querySelector('[data-pdf]');
  if (!root) return;
  const pdf = new URL(root.dataset.pdf, document.baseURI);
  const status = document.getElementById('report-reader-note');
  const available = document.getElementById('report-available');
  const missing = document.getElementById('report-missing');
  try {
    const response = await fetch(pdf, { method: 'HEAD' });
    if (!response.ok) throw new Error('PDF not found');
    const contentType = response.headers.get('content-type') || '';
    // Some hosts serve PDFs as application/octet-stream; allow that too.
    if (contentType.includes('text/html')) throw new Error('Not a PDF');
    document.getElementById('report-open').href = pdf.href;
    const download = document.getElementById('report-download');
    download.href = pdf.href;
    download.download = 'Multimorbidity_and_Sepsis_Report.pdf';
    document.getElementById('report-frame').src = pdf.href + '#toolbar=1&navpanes=0';
    available.hidden = false;
    missing.hidden = true;
    status.textContent = 'Scroll for all pages or open in a new tab.';
  } catch (error) {
    available.hidden = true;
    missing.hidden = false;
    status.textContent = 'Report PDF not included';
  }
})();
