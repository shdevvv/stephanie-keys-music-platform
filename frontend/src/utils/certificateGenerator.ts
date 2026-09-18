/**
 * Certificate Generator for Stephanie Keys / Phanilie Music Academy
 * Renders a high-resolution royal certificate on HTML5 Canvas and triggers browser download.
 */

export interface CertificateData {
  studentName: string;
  levelNumber: number;
  levelTitle: string;
  levelSubtitle: string;
  badgeName: string;
  badgeIcon: string;
  dateStr?: string;
}

export function downloadLevelCertificate(data: CertificateData): void {
  const canvas = document.createElement('canvas');
  // High Resolution Certificate Canvas (2000 x 1414 pixels - 300 DPI 16:10 Landscape)
  canvas.width = 2000;
  canvas.height = 1414;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Soft Warm Cream Royalty Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#FFFDFB');
  bgGrad.addColorStop(0.5, '#FFF8F4');
  bgGrad.addColorStop(1, '#FAF0EB');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Double Ornate Rose Gold Borders
  ctx.strokeStyle = '#dfa38f';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  ctx.strokeStyle = '#ab7e66';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  ctx.strokeStyle = '#dfa38f';
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, w - 112, h - 112);

  // Corner Ornaments
  const drawCornerOrnament = (cx: number, cy: number) => {
    ctx.save();
    ctx.strokeStyle = '#ab7e66';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#dfa38f';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCornerOrnament(70, 70);
  drawCornerOrnament(w - 70, 70);
  drawCornerOrnament(70, h - 70);
  drawCornerOrnament(w - 70, h - 70);

  // 3. Header Branding
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7a4b3d';
  ctx.font = 'bold 28px "Cinzel", Georgia, serif';
  ctx.fillText('✦  STEPHANIE KEYS  •  PHANILIE MUSIC ACADEMY  ✦', w / 2, 140);

  // Decorative Horizontal Line
  ctx.strokeStyle = '#dfa38f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 300, 165);
  ctx.lineTo(w / 2 + 300, 165);
  ctx.stroke();

  // 4. Certificate Main Title
  ctx.fillStyle = '#4a2c20';
  ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
  ctx.fillText('CERTIFICATE OF COMPLETION', w / 2, 250);

  // Sub-header
  ctx.fillStyle = '#8c6b5d';
  ctx.font = 'italic 30px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('This certificate is proudly awarded to', w / 2, 330);

  // 5. Student Name
  const name = data.studentName || 'Student';
  ctx.fillStyle = '#3d251c';
  ctx.font = 'bold 72px "Playfair Display", Georgia, serif';
  ctx.fillText(name, w / 2, 430);

  // Underline under Student Name
  ctx.strokeStyle = '#ab7e66';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 350, 460);
  ctx.lineTo(w / 2 + 350, 460);
  ctx.stroke();

  // 6. Award Statement Body
  ctx.fillStyle = '#5c4136';
  ctx.font = '28px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('For successfully mastering all modules, video masterclasses, and capstone requirements for', w / 2, 530);

  // 7. Level Title & Badge
  ctx.fillStyle = '#6e3c2c';
  ctx.font = 'bold 56px "Playfair Display", Georgia, serif';
  ctx.fillText(`LEVEL ${data.levelNumber}: ${data.levelSubtitle.toUpperCase()}`, w / 2, 630);

  // Badge Tag Line
  ctx.fillStyle = '#8a5948';
  ctx.font = 'bold 32px "Cinzel", Georgia, serif';
  ctx.fillText(`${data.badgeIcon} ${data.badgeName} Badge Unlocked`, w / 2, 700);

  // Description Box / Seal
  ctx.fillStyle = '#7a4b3d';
  ctx.font = 'italic 24px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Demonstrating complete technical proficiency, ear training, and performance excellence.', w / 2, 760);

  // Golden Medal Emblem Seal in Center Bottom
  ctx.save();
  const sealX = w / 2;
  const sealY = 920;
  ctx.beginPath();
  ctx.arc(sealX, sealY, 75, 0, Math.PI * 2);
  const sealGrad = ctx.createLinearGradient(sealX - 75, sealY - 75, sealX + 75, sealY + 75);
  sealGrad.addColorStop(0, '#fce8d5');
  sealGrad.addColorStop(0.5, '#dfa38f');
  sealGrad.addColorStop(1, '#ab7e66');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '50px sans-serif';
  ctx.fillText(data.badgeIcon || '👑', sealX, sealY + 16);
  ctx.restore();

  // 8. Signatures & Date Section
  const dateText = data.dateStr || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Left Side: Date
  ctx.fillStyle = '#5c4136';
  ctx.font = 'bold 24px "Cinzel", Georgia, serif';
  ctx.fillText(dateText, w / 2 - 400, 1170);
  ctx.strokeStyle = '#ab7e66';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 550, 1130);
  ctx.lineTo(w / 2 - 250, 1130);
  ctx.stroke();
  ctx.fillStyle = '#8c6b5d';
  ctx.font = '22px sans-serif';
  ctx.fillText('Date of Issue', w / 2 - 400, 1205);

  // Right Side: Signature
  ctx.fillStyle = '#3d251c';
  ctx.font = 'italic bold 42px "Pinyon Script", "Great Vibes", cursive, serif';
  ctx.fillText('Stephanie Halim', w / 2 + 400, 1115);
  ctx.strokeStyle = '#ab7e66';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 + 250, 1130);
  ctx.lineTo(w / 2 + 550, 1130);
  ctx.stroke();
  ctx.fillStyle = '#5c4136';
  ctx.font = 'bold 22px "Cinzel", Georgia, serif';
  ctx.fillText('STEPHANIE HALIM', w / 2 + 400, 1165);
  ctx.fillStyle = '#8c6b5d';
  ctx.font = '20px sans-serif';
  ctx.fillText('Founder & Lead Mentor', w / 2 + 400, 1195);

  // Trigger browser image download
  const imageURI = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.download = `Phanilie-Certificate-Level-${data.levelNumber}.png`;
  downloadLink.href = imageURI;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
