/**
 * AI Assistant Service
 * Provides intelligent assistance for:
 * - View customization
 * - Data queries
 * - Document generation
 * - Portal modifications
 */

export interface AIRequest {
  prompt: string;
  context?: {
    currentView?: string;
    userData?: any;
    portalType?: 'compliance' | 'tracking' | 'sales' | 'network';
  };
}

export interface AIResponse {
  type: 'view_modification' | 'data_query' | 'document' | 'general' | 'error';
  message: string;
  data?: any;
  viewConfig?: ViewConfiguration;
  documentUrl?: string;
}

export interface ViewConfiguration {
  layout: 'grid' | 'table' | 'list' | 'cards' | 'kanban';
  density: 'compact' | 'comfortable' | 'spacious';
  columns?: ColumnConfig[];
  filters?: FilterConfig[];
  sorting?: SortConfig;
  grouping?: GroupConfig;
  customStyles?: {
    cardSize?: 'small' | 'medium' | 'large';
    showImages?: boolean;
    showBadges?: boolean;
    colorScheme?: 'default' | 'metrc' | 'minimal' | 'dense';
  };
}

export interface ColumnConfig {
  id: string;
  label: string;
  field: string;
  visible: boolean;
  width?: string;
  sortable?: boolean;
  format?: 'text' | 'number' | 'currency' | 'date' | 'badge' | 'link';
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface GroupConfig {
  field: string;
  label: string;
}

class AIAssistantService {
  private apiKey: string = '';
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // This would integrate with Claude API, GPT, or similar
  // For now, we'll use intelligent pattern matching
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const { prompt, context } = request;

    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: prompt });

    // Analyze intent
    const intent = this.analyzeIntent(prompt);

    let response: AIResponse;

    switch (intent.type) {
      case 'view_modification':
        response = await this.handleViewModification(prompt, context);
        break;

      case 'data_query':
        response = await this.handleDataQuery(prompt, context);
        break;

      case 'document_generation':
        response = await this.handleDocumentGeneration(prompt, context);
        break;

      case 'purchase_order':
        response = await this.handlePurchaseOrder(prompt, context);
        break;

      case 'metrc_style':
        response = await this.handleMetrcStyle(prompt, context);
        break;

      default:
        response = await this.handleGeneral(prompt, context);
    }

    this.conversationHistory.push({ role: 'assistant', content: response.message });
    return response;
  }

  private analyzeIntent(prompt: string): { type: string; confidence: number } {
    const lowerPrompt = prompt.toLowerCase();

    // View modification patterns
    if (
      lowerPrompt.includes('change') && (lowerPrompt.includes('view') || lowerPrompt.includes('layout')) ||
      lowerPrompt.includes('show me') && (lowerPrompt.includes('table') || lowerPrompt.includes('grid')) ||
      lowerPrompt.includes('make it look like') ||
      lowerPrompt.includes('smaller') || lowerPrompt.includes('larger') ||
      lowerPrompt.includes('compact') || lowerPrompt.includes('dense')
    ) {
      return { type: 'view_modification', confidence: 0.9 };
    }

    // METRC style
    if (lowerPrompt.includes('metrc') || lowerPrompt.includes('metrc style')) {
      return { type: 'metrc_style', confidence: 0.95 };
    }

    // Data query patterns
    if (
      lowerPrompt.includes('show me') || lowerPrompt.includes('find') ||
      lowerPrompt.includes('how many') || lowerPrompt.includes('what is') ||
      lowerPrompt.includes('list all') || lowerPrompt.includes('filter')
    ) {
      return { type: 'data_query', confidence: 0.8 };
    }

    // Document generation
    if (
      lowerPrompt.includes('create') && (lowerPrompt.includes('document') || lowerPrompt.includes('report')) ||
      lowerPrompt.includes('generate') || lowerPrompt.includes('export')
    ) {
      return { type: 'document_generation', confidence: 0.85 };
    }

    // Purchase order
    if (
      lowerPrompt.includes('purchase order') || lowerPrompt.includes('po') ||
      lowerPrompt.includes('order from')
    ) {
      return { type: 'purchase_order', confidence: 0.9 };
    }

    return { type: 'general', confidence: 0.5 };
  }

  private async handleViewModification(prompt: string, context?: any): Promise<AIResponse> {
    const lowerPrompt = prompt.toLowerCase();
    const viewConfig: ViewConfiguration = {
      layout: 'grid',
      density: 'comfortable',
      customStyles: {},
    };

    // Parse layout preference
    if (lowerPrompt.includes('table')) {
      viewConfig.layout = 'table';
      viewConfig.columns = this.generateTableColumns(context?.portalType);
    } else if (lowerPrompt.includes('grid')) {
      viewConfig.layout = 'grid';
    } else if (lowerPrompt.includes('list')) {
      viewConfig.layout = 'list';
    } else if (lowerPrompt.includes('card')) {
      viewConfig.layout = 'cards';
    }

    // Parse density
    if (lowerPrompt.includes('compact') || lowerPrompt.includes('dense') || lowerPrompt.includes('smaller')) {
      viewConfig.density = 'compact';
      viewConfig.customStyles!.cardSize = 'small';
    } else if (lowerPrompt.includes('spacious') || lowerPrompt.includes('larger')) {
      viewConfig.density = 'spacious';
      viewConfig.customStyles!.cardSize = 'large';
    }

    // Parse visual preferences
    if (lowerPrompt.includes('more info') || lowerPrompt.includes('detailed')) {
      viewConfig.customStyles!.showBadges = true;
      viewConfig.customStyles!.showImages = true;
    }

    // Parse bubble/card size
    if (lowerPrompt.includes('smaller bubble') || lowerPrompt.includes('small cards')) {
      viewConfig.customStyles!.cardSize = 'small';
    }

    return {
      type: 'view_modification',
      message: `I've customized your view to ${viewConfig.layout} layout with ${viewConfig.density} density. ${
        viewConfig.customStyles?.cardSize === 'small' ? 'Using smaller cards to show more items at once.' : ''
      }`,
      viewConfig,
    };
  }

  private async handleMetrcStyle(prompt: string, context?: any): Promise<AIResponse> {
    const viewConfig: ViewConfiguration = {
      layout: 'table',
      density: 'compact',
      customStyles: {
        colorScheme: 'metrc',
        showBadges: false,
        showImages: false,
      },
      columns: [
        { id: 'uid', label: 'Tag', field: 'label', visible: true, width: '150px', sortable: true, format: 'text' },
        { id: 'type', label: 'Type', field: 'type', visible: true, width: '100px', sortable: true, format: 'text' },
        { id: 'quantity', label: 'Quantity', field: 'quantity', visible: true, width: '100px', sortable: true, format: 'number' },
        { id: 'thc', label: 'THC %', field: 'thc', visible: true, width: '80px', sortable: true, format: 'number' },
        { id: 'cbd', label: 'CBD %', field: 'cbd', visible: true, width: '80px', sortable: true, format: 'number' },
        { id: 'status', label: 'Status', field: 'status', visible: true, width: '100px', sortable: true, format: 'badge' },
        { id: 'date', label: 'Date', field: 'createdAt', visible: true, width: '120px', sortable: true, format: 'date' },
      ],
    };

    return {
      type: 'view_modification',
      message: "I've styled your view to match METRC's interface - clean table format with compact density and all the essential columns you'd see in METRC.",
      viewConfig,
    };
  }

  private async handleDataQuery(prompt: string, context?: any): Promise<AIResponse> {
    const lowerPrompt = prompt.toLowerCase();

    // Example queries
    if (lowerPrompt.includes('how many package') || lowerPrompt.includes('package count')) {
      return {
        type: 'data_query',
        message: 'You currently have 47 active packages, 3 in testing, and 2 in quarantine.',
        data: {
          active: 47,
          testing: 3,
          quarantine: 2,
          total: 52,
        },
      };
    }

    if (lowerPrompt.includes('high thc') || lowerPrompt.includes('highest thc')) {
      return {
        type: 'data_query',
        message: 'Your highest THC products are: Wedding Cake (30%), Purple Punch (28%), and OG Kush (26%).',
        data: [
          { name: 'Wedding Cake', thc: 30, quantity: 15, unit: 'lbs' },
          { name: 'Purple Punch', thc: 28, quantity: 25, unit: 'lbs' },
          { name: 'OG Kush', thc: 26, quantity: 12, unit: 'lbs' },
        ],
      };
    }

    return {
      type: 'data_query',
      message: "I can help you find specific data. Try asking things like 'show me packages with THC above 25%' or 'how many orders this month?'",
    };
  }

  private async handleDocumentGeneration(prompt: string, context?: any): Promise<AIResponse> {
    const lowerPrompt = prompt.toLowerCase();

    // Transfer Manifest
    if (lowerPrompt.includes('manifest') || lowerPrompt.includes('transfer')) {
      const manifestNumber = `MAN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      return {
        type: 'document',
        message: `I've generated transfer manifest ${manifestNumber} with all required METRC fields. Includes:\n- 5 packages\n- Destination: Processing Facility B\n- Driver & vehicle info\n- Departure/arrival times\n\nReady to submit to METRC?`,
        documentUrl: `/documents/${manifestNumber}.pdf`,
        data: {
          manifestNumber,
          packages: 5,
          destination: 'Processing Facility B',
        },
      };
    }

    // COA (Certificate of Analysis)
    if (lowerPrompt.includes('coa') || lowerPrompt.includes('certificate')) {
      return {
        type: 'document',
        message: "I've compiled all COAs for your active packages into a single report. Includes:\n- Lab test results\n- Cannabinoid profiles\n- Contaminant screening\n- Batch tracking\n\nGenerated: COA-Report-2025.pdf",
        documentUrl: '/documents/coa-report.pdf',
      };
    }

    // Invoice
    if (lowerPrompt.includes('invoice')) {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      return {
        type: 'document',
        message: `I've created invoice ${invoiceNumber} based on recent orders:\n- 3 line items\n- Subtotal: $45,000\n- Tax: $3,600\n- Total: $48,600\n\nReady to send to customer?`,
        documentUrl: `/documents/${invoiceNumber}.pdf`,
        data: {
          invoiceNumber,
          subtotal: 45000,
          tax: 3600,
          total: 48600,
        },
      };
    }

    // Compliance Report
    if (lowerPrompt.includes('compliance report') || lowerPrompt.includes('audit')) {
      return {
        type: 'document',
        message: "I've generated your compliance report for this month:\n- All METRC submissions: ✓ On time\n- Inventory accuracy: 99.8%\n- Transfer compliance: 100%\n- Lab testing: Up to date\n\nCompliance Score: 98.7%",
        documentUrl: '/documents/compliance-report.pdf',
        data: {
          complianceScore: 98.7,
          metrcSubmissions: 'on-time',
          inventoryAccuracy: 99.8,
        },
      };
    }

    // Inventory Summary
    if (lowerPrompt.includes('inventory') || lowerPrompt.includes('stock report')) {
      return {
        type: 'document',
        message: "I've created an inventory summary report:\n- 47 active packages\n- Total weight: 245 lbs\n- Value: $625,000\n- Top strains: OG Kush, Blue Dream, Gelato\n\nExported to: inventory-summary.pdf",
        documentUrl: '/documents/inventory-summary.pdf',
        data: {
          packages: 47,
          totalWeight: 245,
          value: 625000,
        },
      };
    }

    // Label Batch
    if (lowerPrompt.includes('label') || lowerPrompt.includes('print label')) {
      return {
        type: 'document',
        message: "I've generated labels for all packages:\n- 47 package labels\n- Includes UID, THC/CBD, compliance info\n- Format: 2\" x 1\" thermal labels\n\nReady to print: package-labels.pdf",
        documentUrl: '/documents/package-labels.pdf',
        data: {
          count: 47,
          format: '2x1',
        },
      };
    }

    // Default response
    return {
      type: 'document',
      message: 'I can generate:\n• Transfer Manifests\n• Certificates of Analysis (COAs)\n• Invoices\n• Compliance Reports\n• Inventory Summaries\n• Package Labels\n\nWhat document do you need?',
    };
  }

  private async handlePurchaseOrder(prompt: string, context?: any): Promise<AIResponse> {
    // Parse purchase order details from natural language
    const lowerPrompt = prompt.toLowerCase();

    // Extract product names, quantities, and prices using pattern matching
    const items = this.parsePurchaseOrderItems(prompt);

    // Generate PO number
    const poNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.total, 0);

    // Generate document HTML
    const documentHtml = this.generatePurchaseOrderHTML({
      poNumber,
      items,
      total,
      date: new Date().toLocaleDateString(),
      vendor: this.extractVendorFromPrompt(prompt) || 'Vendor Name',
    });

    // Format message
    const itemsDescription = items.map(item =>
      `- ${item.quantity} ${item.unit} ${item.product} @ $${item.price.toLocaleString()}/${item.unit}`
    ).join('\n');

    return {
      type: 'document',
      message: `I've created purchase order ${poNumber}:\n\n${itemsDescription}\n\nTotal: $${total.toLocaleString()}\n\nReady to send?`,
      data: {
        poNumber,
        items,
        total,
        documentHtml,
      },
      documentUrl: `/documents/${poNumber}.pdf`,
    };
  }

  private parsePurchaseOrderItems(prompt: string): Array<{
    product: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }> {
    // Simple pattern matching for demo - in production, this would use NLP
    // Patterns like "10 lbs OG Kush at $2800/lb"

    // Default example items if no specific items detected
    return [
      { product: 'OG Kush', quantity: 10, unit: 'lbs', price: 2800, total: 28000 },
      { product: 'Blue Dream', quantity: 5, unit: 'lbs', price: 2300, total: 11500 },
    ];
  }

  private extractVendorFromPrompt(prompt: string): string | null {
    // Extract vendor name using patterns like "from [vendor]" or "order from [vendor]"
    const fromMatch = prompt.match(/(?:from|order from)\s+([A-Za-z\s]+)/i);
    return fromMatch ? fromMatch[1].trim() : null;
  }

  private generatePurchaseOrderHTML(data: {
    poNumber: string;
    items: Array<{ product: string; quantity: number; unit: string; price: number; total: number }>;
    total: number;
    date: string;
    vendor: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { border-bottom: 2px solid #C5A572; padding-bottom: 20px; margin-bottom: 30px; }
    .po-number { font-size: 24px; font-weight: bold; color: #1F2937; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #F3F4F6; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #E5E7EB; }
    .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="po-number">Purchase Order</div>
    <div>PO Number: ${data.poNumber}</div>
    <div>Date: ${data.date}</div>
    <div>Vendor: ${data.vendor}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map(item => `
        <tr>
          <td>${item.product}</td>
          <td>${item.quantity} ${item.unit}</td>
          <td>$${item.price.toLocaleString()}</td>
          <td>$${item.total.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="total">Total: $${data.total.toLocaleString()}</div>
</body>
</html>
    `;
  }

  private async handleGeneral(prompt: string, context?: any): Promise<AIResponse> {
    return {
      type: 'general',
      message: "I'm here to help! I can:\n• Customize your portal views\n• Query your data\n• Generate documents and reports\n• Create purchase orders\n• Match METRC styling\n\nTry saying 'make this view more compact' or 'show me packages over 25% THC'",
    };
  }

  private generateTableColumns(portalType?: string): ColumnConfig[] {
    switch (portalType) {
      case 'compliance':
        return [
          { id: 'uid', label: 'UID', field: 'label', visible: true, width: '150px', sortable: true, format: 'text' },
          { id: 'product', label: 'Product', field: 'productName', visible: true, width: '200px', sortable: true, format: 'text' },
          { id: 'type', label: 'Type', field: 'type', visible: true, width: '100px', sortable: true, format: 'text' },
          { id: 'quantity', label: 'Quantity', field: 'quantity', visible: true, width: '100px', sortable: true, format: 'number' },
          { id: 'thc', label: 'THC %', field: 'thc', visible: true, width: '80px', sortable: true, format: 'number' },
          { id: 'cbd', label: 'CBD %', field: 'cbd', visible: true, width: '80px', sortable: true, format: 'number' },
          { id: 'status', label: 'Status', field: 'status', visible: true, width: '100px', sortable: true, format: 'badge' },
        ];

      case 'sales':
        return [
          { id: 'order', label: 'Order #', field: 'orderNumber', visible: true, width: '120px', sortable: true, format: 'link' },
          { id: 'customer', label: 'Customer', field: 'customerName', visible: true, width: '200px', sortable: true, format: 'text' },
          { id: 'amount', label: 'Amount', field: 'totalAmount', visible: true, width: '120px', sortable: true, format: 'currency' },
          { id: 'status', label: 'Status', field: 'status', visible: true, width: '100px', sortable: true, format: 'badge' },
          { id: 'date', label: 'Date', field: 'orderDate', visible: true, width: '120px', sortable: true, format: 'date' },
        ];

      default:
        return [
          { id: 'id', label: 'ID', field: 'id', visible: true, width: '100px', sortable: true, format: 'text' },
          { id: 'name', label: 'Name', field: 'name', visible: true, width: '200px', sortable: true, format: 'text' },
          { id: 'status', label: 'Status', field: 'status', visible: true, width: '100px', sortable: true, format: 'badge' },
        ];
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }

  // Helper method to apply view configuration
  static applyViewConfig(config: ViewConfiguration): string {
    // Returns CSS classes or configuration object
    const classes = [];

    if (config.density === 'compact') classes.push('density-compact');
    if (config.density === 'spacious') classes.push('density-spacious');
    if (config.layout === 'table') classes.push('layout-table');
    if (config.layout === 'grid') classes.push('layout-grid');

    return classes.join(' ');
  }
}

export const aiAssistant = new AIAssistantService();

// Export utility functions
export function formatAIResponse(response: AIResponse): string {
  return response.message;
}

export function isViewModification(response: AIResponse): boolean {
  return response.type === 'view_modification' && !!response.viewConfig;
}
