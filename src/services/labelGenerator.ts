/**
 * Label Generation Service
 * Generates printable labels for METRC compliance
 * - Package labels with UIDs and barcodes
 * - Plant labels with UIDs
 * - Transfer manifest labels
 */

import type { MetrcPackage, MetrcPlant, MetrcTransfer } from './metrc';

export interface LabelConfig {
  includeBarcode: boolean;
  includeQRCode: boolean;
  labelSize: '2x1' | '3x2' | '4x3'; // inches
  copies: number;
}

export interface PackageLabelData {
  uid: string;
  productName: string;
  strain?: string;
  quantity: number;
  unit: string;
  thc?: number;
  cbd?: number;
  packagedDate: string;
  expirationDate?: string;
  licenseNumber: string;
}

export interface PlantLabelData {
  uid: string;
  strain: string;
  plantedDate: string;
  location: string;
  licenseNumber: string;
}

export interface ManifestLabelData {
  manifestNumber: string;
  origin: string;
  destination: string;
  packageCount: number;
  departureDate: string;
  driver: string;
  licenseNumber: string;
}

class LabelGeneratorService {
  private defaultConfig: LabelConfig = {
    includeBarcode: true,
    includeQRCode: true,
    labelSize: '2x1',
    copies: 1,
  };

  // ============================================================================
  // PACKAGE LABELS
  // ============================================================================

  generatePackageLabel(pkg: MetrcPackage, config: Partial<LabelConfig> = {}): string {
    const labelConfig = { ...this.defaultConfig, ...config };
    const labelData: PackageLabelData = {
      uid: pkg.label,
      productName: pkg.productName,
      strain: pkg.itemStrainName,
      quantity: pkg.quantity,
      unit: pkg.unitOfMeasureName,
      thc: pkg.itemUnitThcPercent,
      cbd: pkg.itemUnitCbdPercent,
      packagedDate: pkg.packagedDate,
      expirationDate: pkg.expirationDate,
      licenseNumber: 'AUCC-00001', // Would come from user context
    };

    return this.generatePackageLabelHTML(labelData, labelConfig);
  }

  private generatePackageLabelHTML(data: PackageLabelData, config: LabelConfig): string {
    const { width, height } = this.getLabelDimensions(config.labelSize);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Package Label - ${data.uid}</title>
        <style>
          @media print {
            @page {
              size: ${width}in ${height}in;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }

          .label {
            width: ${width}in;
            height: ${height}in;
            border: 2px solid #000;
            padding: 0.1in;
            box-sizing: border-box;
            page-break-after: always;
          }

          .label-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 0.05in;
            margin-bottom: 0.05in;
          }

          .label-title {
            font-size: 10pt;
            font-weight: bold;
            margin: 0;
          }

          .uid {
            font-family: 'Courier New', monospace;
            font-size: 12pt;
            font-weight: bold;
            text-align: center;
            margin: 0.05in 0;
            letter-spacing: 1px;
          }

          .barcode-placeholder {
            width: 100%;
            height: 0.5in;
            background: repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 2px,
              #fff 2px,
              #fff 4px
            );
            margin: 0.05in 0;
          }

          .qr-placeholder {
            width: 0.75in;
            height: 0.75in;
            border: 2px solid #000;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
          }

          .label-info {
            font-size: 8pt;
            line-height: 1.3;
          }

          .label-row {
            display: flex;
            justify-content: space-between;
            margin: 0.02in 0;
          }

          .label-field {
            font-weight: bold;
          }

          .cannabinoids {
            display: flex;
            justify-content: space-around;
            background: #f0f0f0;
            padding: 0.05in;
            margin: 0.05in 0;
            border: 1px solid #000;
          }

          .cannabinoid {
            text-align: center;
          }

          .cannabinoid-label {
            font-size: 7pt;
            font-weight: bold;
          }

          .cannabinoid-value {
            font-size: 10pt;
            font-weight: bold;
          }

          .footer {
            font-size: 6pt;
            text-align: center;
            margin-top: 0.05in;
            padding-top: 0.05in;
            border-top: 1px solid #000;
          }
        </style>
      </head>
      <body>
        ${this.generateLabelCopies(data, config)}

        <div class="no-print" style="text-align: center; padding: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">
            Print Labels
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;
  }

  private generateLabelCopies(data: PackageLabelData, config: LabelConfig): string {
    let html = '';

    for (let i = 0; i < config.copies; i++) {
      html += `
        <div class="label">
          <div class="label-header">
            <p class="label-title">NYS OCM CANNABIS PACKAGE</p>
          </div>

          <div class="uid">${data.uid}</div>

          ${config.includeBarcode ? '<div class="barcode-placeholder"></div>' : ''}

          <div class="label-info">
            <div class="label-row">
              <span><span class="label-field">Product:</span> ${data.productName}</span>
            </div>
            ${data.strain ? `
            <div class="label-row">
              <span><span class="label-field">Strain:</span> ${data.strain}</span>
            </div>
            ` : ''}
            <div class="label-row">
              <span><span class="label-field">Quantity:</span> ${data.quantity} ${data.unit}</span>
            </div>
            <div class="label-row">
              <span><span class="label-field">Packaged:</span> ${new Date(data.packagedDate).toLocaleDateString()}</span>
            </div>
            ${data.expirationDate ? `
            <div class="label-row">
              <span><span class="label-field">Expires:</span> ${new Date(data.expirationDate).toLocaleDateString()}</span>
            </div>
            ` : ''}
          </div>

          ${data.thc !== undefined || data.cbd !== undefined ? `
          <div class="cannabinoids">
            ${data.thc !== undefined ? `
            <div class="cannabinoid">
              <div class="cannabinoid-label">THC</div>
              <div class="cannabinoid-value">${data.thc.toFixed(1)}%</div>
            </div>
            ` : ''}
            ${data.cbd !== undefined ? `
            <div class="cannabinoid">
              <div class="cannabinoid-label">CBD</div>
              <div class="cannabinoid-value">${data.cbd.toFixed(1)}%</div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${config.includeQRCode ? '<div class="qr-placeholder">QR</div>' : ''}

          <div class="footer">
            License: ${data.licenseNumber} | METRC Compliant
          </div>
        </div>
      `;
    }

    return html;
  }

  // ============================================================================
  // PLANT LABELS
  // ============================================================================

  generatePlantLabel(plant: MetrcPlant, config: Partial<LabelConfig> = {}): string {
    const labelConfig = { ...this.defaultConfig, ...config };
    const labelData: PlantLabelData = {
      uid: plant.label,
      strain: plant.strainName,
      plantedDate: plant.plantedDate,
      location: plant.locationName,
      licenseNumber: 'AUCC-00001',
    };

    return this.generatePlantLabelHTML(labelData, labelConfig);
  }

  private generatePlantLabelHTML(data: PlantLabelData, config: LabelConfig): string {
    const { width, height } = this.getLabelDimensions(config.labelSize);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Plant Label - ${data.uid}</title>
        <style>
          @media print {
            @page {
              size: ${width}in ${height}in;
              margin: 0;
            }
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }

          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }

          .label {
            width: ${width}in;
            height: ${height}in;
            border: 2px solid #000;
            padding: 0.1in;
            box-sizing: border-box;
            page-break-after: always;
            background: #fff;
          }

          .label-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 0.05in;
            margin-bottom: 0.1in;
            background: #2e7d32;
            color: white;
            padding: 0.05in;
          }

          .label-title {
            font-size: 10pt;
            font-weight: bold;
            margin: 0;
          }

          .uid {
            font-family: 'Courier New', monospace;
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            margin: 0.1in 0;
            letter-spacing: 1px;
          }

          .strain-name {
            font-size: 12pt;
            font-weight: bold;
            text-align: center;
            color: #2e7d32;
            margin: 0.05in 0;
          }

          .label-info {
            font-size: 9pt;
            line-height: 1.4;
            margin-top: 0.1in;
          }

          .label-row {
            display: flex;
            justify-content: space-between;
            margin: 0.05in 0;
          }

          .label-field {
            font-weight: bold;
          }

          .barcode-placeholder {
            width: 100%;
            height: 0.4in;
            background: repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 2px,
              #fff 2px,
              #fff 4px
            );
            margin: 0.1in 0;
          }

          .footer {
            font-size: 6pt;
            text-align: center;
            margin-top: 0.05in;
            padding-top: 0.05in;
            border-top: 1px solid #000;
          }
        </style>
      </head>
      <body>
        ${this.generatePlantLabelCopies(data, config)}

        <div class="no-print" style="text-align: center; padding: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">
            Print Labels
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;
  }

  private generatePlantLabelCopies(data: PlantLabelData, config: LabelConfig): string {
    let html = '';

    for (let i = 0; i < config.copies; i++) {
      html += `
        <div class="label">
          <div class="label-header">
            <p class="label-title">NYS OCM CANNABIS PLANT</p>
          </div>

          <div class="uid">${data.uid}</div>
          <div class="strain-name">${data.strain}</div>

          ${config.includeBarcode ? '<div class="barcode-placeholder"></div>' : ''}

          <div class="label-info">
            <div class="label-row">
              <span><span class="label-field">Planted:</span> ${new Date(data.plantedDate).toLocaleDateString()}</span>
            </div>
            <div class="label-row">
              <span><span class="label-field">Location:</span> ${data.location}</span>
            </div>
          </div>

          <div class="footer">
            License: ${data.licenseNumber} | METRC Compliant
          </div>
        </div>
      `;
    }

    return html;
  }

  // ============================================================================
  // MANIFEST LABELS
  // ============================================================================

  generateManifestLabel(manifest: MetrcTransfer, config: Partial<LabelConfig> = {}): string {
    const labelConfig = { ...this.defaultConfig, ...config, labelSize: '4x3' as const };
    const labelData: ManifestLabelData = {
      manifestNumber: manifest.manifestNumber,
      origin: manifest.shipperFacilityName,
      destination: manifest.recipientFacilityName || 'Unknown',
      packageCount: manifest.deliveryPackageCount,
      departureDate: manifest.estimatedDepartureDateTime,
      driver: 'Driver Name', // Would come from manifest data
      licenseNumber: manifest.shipperFacilityLicenseNumber,
    };

    return this.generateManifestLabelHTML(labelData, labelConfig);
  }

  private generateManifestLabelHTML(data: ManifestLabelData, config: LabelConfig): string {
    const { width, height } = this.getLabelDimensions(config.labelSize);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Manifest Label - ${data.manifestNumber}</title>
        <style>
          @media print {
            @page {
              size: ${width}in ${height}in;
              margin: 0;
            }
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }

          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }

          .label {
            width: ${width}in;
            height: ${height}in;
            border: 3px solid #000;
            padding: 0.15in;
            box-sizing: border-box;
            page-break-after: always;
          }

          .label-header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 0.1in;
            margin-bottom: 0.1in;
            background: #1976d2;
            color: white;
            padding: 0.1in;
          }

          .label-title {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
          }

          .manifest-number {
            font-family: 'Courier New', monospace;
            font-size: 20pt;
            font-weight: bold;
            text-align: center;
            margin: 0.1in 0;
            letter-spacing: 2px;
          }

          .route-section {
            margin: 0.15in 0;
            padding: 0.1in;
            border: 2px solid #000;
          }

          .route-header {
            font-size: 10pt;
            font-weight: bold;
            color: #666;
            margin-bottom: 0.05in;
          }

          .facility-name {
            font-size: 12pt;
            font-weight: bold;
            margin: 0.03in 0;
          }

          .label-info {
            font-size: 10pt;
            line-height: 1.5;
          }

          .label-row {
            display: flex;
            justify-content: space-between;
            margin: 0.05in 0;
            padding: 0.05in;
            background: #f5f5f5;
          }

          .label-field {
            font-weight: bold;
          }

          .barcode-placeholder {
            width: 100%;
            height: 0.5in;
            background: repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 3px,
              #fff 3px,
              #fff 6px
            );
            margin: 0.1in 0;
          }

          .footer {
            font-size: 8pt;
            text-align: center;
            margin-top: 0.1in;
            padding-top: 0.1in;
            border-top: 2px solid #000;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="label-header">
            <p class="label-title">NYS OCM TRANSFER MANIFEST</p>
          </div>

          <div class="manifest-number">${data.manifestNumber}</div>

          ${config.includeBarcode ? '<div class="barcode-placeholder"></div>' : ''}

          <div class="route-section">
            <div class="route-header">FROM:</div>
            <div class="facility-name">${data.origin}</div>
          </div>

          <div style="text-align: center; font-size: 20pt; margin: 0.1in 0;">↓</div>

          <div class="route-section">
            <div class="route-header">TO:</div>
            <div class="facility-name">${data.destination}</div>
          </div>

          <div class="label-info">
            <div class="label-row">
              <span><span class="label-field">Packages:</span> ${data.packageCount}</span>
              <span><span class="label-field">Driver:</span> ${data.driver}</span>
            </div>
            <div class="label-row">
              <span><span class="label-field">Departure:</span> ${new Date(data.departureDate).toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            License: ${data.licenseNumber} | METRC COMPLIANT TRANSFER
          </div>
        </div>

        <div class="no-print" style="text-align: center; padding: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">
            Print Label
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `;
  }

  // ============================================================================
  // BULK LABEL GENERATION
  // ============================================================================

  generateBulkPackageLabels(packages: MetrcPackage[], config: Partial<LabelConfig> = {}): string {
    const labels = packages.map(pkg => this.generatePackageLabel(pkg, { ...config, copies: 1 }));
    return this.combineLabelHTMLs(labels, 'Package Labels');
  }

  generateBulkPlantLabels(plants: MetrcPlant[], config: Partial<LabelConfig> = {}): string {
    const labels = plants.map(plant => this.generatePlantLabel(plant, { ...config, copies: 1 }));
    return this.combineLabelHTMLs(labels, 'Plant Labels');
  }

  private combineLabelHTMLs(htmlStrings: string[], title: string): string {
    // Extract just the label divs from each HTML
    const labelDivs = htmlStrings.map(html => {
      const match = html.match(/<div class="label">[\s\S]*?<\/div>/);
      return match ? match[0] : '';
    }).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @media print {
            @page { margin: 0; }
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }
          body { font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        ${labelDivs}
        <div class="no-print" style="text-align: center; padding: 20px;">
          <button onclick="window.print()">Print All Labels</button>
          <button onclick="window.close()">Close</button>
        </div>
      </body>
      </html>
    `;
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private getLabelDimensions(size: LabelConfig['labelSize']): { width: number; height: number } {
    switch (size) {
      case '2x1':
        return { width: 2, height: 1 };
      case '3x2':
        return { width: 3, height: 2 };
      case '4x3':
        return { width: 4, height: 3 };
      default:
        return { width: 2, height: 1 };
    }
  }

  printLabel(html: string): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  }

  downloadLabelPDF(html: string): void {
    // In a real implementation, this would use a library like jsPDF or html2pdf
    // For now, we'll just open the print dialog
    this.printLabel(html);
  }
}

export const labelGenerator = new LabelGeneratorService();
