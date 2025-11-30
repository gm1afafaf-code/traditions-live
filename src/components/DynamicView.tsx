import { useState } from 'react';
import type { ViewConfiguration, ColumnConfig } from '@/services/aiAssistant';
import { Card, Button } from './ui';
import { ArrowUpDown, Eye, EyeOff } from 'lucide-react';

interface DynamicViewProps<T = any> {
  data: T[];
  config: ViewConfiguration;
  onItemClick?: (item: T) => void;
  className?: string;
}

export function DynamicView<T extends Record<string, any>>({
  data,
  config,
  onItemClick,
  className = '',
}: DynamicViewProps<T>) {
  const [sortField, setSortField] = useState<string | null>(config.sorting?.field || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(config.sorting?.direction || 'asc');

  // Apply sorting
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatValue = (value: any, format?: ColumnConfig['format']) => {
    if (value === null || value === undefined) return '—';

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

      case 'number':
        return new Intl.NumberFormat('en-US').format(value);

      case 'date':
        return new Date(value).toLocaleDateString();

      case 'badge':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
            {value}
          </span>
        );

      case 'link':
        return (
          <a href="#" className="text-blue-600 hover:underline">
            {value}
          </a>
        );

      default:
        return String(value);
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = String(status).toLowerCase();
    if (lowerStatus.includes('active') || lowerStatus.includes('delivered') || lowerStatus.includes('paid')) {
      return 'bg-green-100 text-green-800';
    }
    if (lowerStatus.includes('pending') || lowerStatus.includes('testing')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (lowerStatus.includes('failed') || lowerStatus.includes('cancelled')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getDensityClass = () => {
    switch (config.density) {
      case 'compact':
        return 'text-xs py-1 px-2';
      case 'spacious':
        return 'text-base py-4 px-6';
      default:
        return 'text-sm py-2 px-4';
    }
  };

  const getCardSize = () => {
    const size = config.customStyles?.cardSize;
    switch (size) {
      case 'small':
        return 'p-3 text-sm';
      case 'large':
        return 'p-6 text-base';
      default:
        return 'p-4 text-sm';
    }
  };

  // Render based on layout type
  switch (config.layout) {
    case 'table':
      return (
        <div className={`overflow-x-auto ${className}`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${config.density === 'compact' ? 'text-xs' : 'text-sm'} ${
                config.customStyles?.colorScheme === 'metrc' ? 'bg-gray-100' : 'bg-gold/5'
              }`}>
                {config.columns?.filter(col => col.visible).map((column) => (
                  <th
                    key={column.id}
                    className={`text-left font-medium text-slate ${getDensityClass()} ${
                      column.sortable ? 'cursor-pointer hover:bg-gold/10' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.field)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortField === column.field && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gold/5 hover:bg-gold/5 ${
                    onItemClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onItemClick?.(item)}
                >
                  {config.columns?.filter(col => col.visible).map((column) => (
                    <td key={column.id} className={`text-charcoal ${getDensityClass()}`}>
                      {formatValue(item[column.field], column.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'grid':
      const gridCols = config.density === 'compact' ? 'grid-cols-4' : config.density === 'spacious' ? 'grid-cols-2' : 'grid-cols-3';
      return (
        <div className={`grid ${gridCols} gap-4 ${className}`}>
          {sortedData.map((item, idx) => (
            <Card
              key={idx}
              className={`${getCardSize()} hover:shadow-lg transition-shadow ${
                onItemClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onItemClick?.(item)}
            >
              {config.columns?.filter(col => col.visible).slice(0, 6).map((column) => (
                <div key={column.id} className="mb-2">
                  <p className="text-xs text-slate">{column.label}</p>
                  <p className="font-medium text-charcoal">
                    {formatValue(item[column.field], column.format)}
                  </p>
                </div>
              ))}
            </Card>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className={`space-y-2 ${className}`}>
          {sortedData.map((item, idx) => (
            <Card
              key={idx}
              className={`${getDensityClass()} flex items-center justify-between hover:shadow-md transition-shadow ${
                onItemClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex-1 grid grid-cols-4 gap-4">
                {config.columns?.filter(col => col.visible).slice(0, 4).map((column) => (
                  <div key={column.id}>
                    <p className="text-xs text-slate">{column.label}</p>
                    <div className="font-medium text-charcoal">
                      {formatValue(item[column.field], column.format)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      );

    case 'cards':
      return (
        <div className={`grid grid-cols-2 gap-4 ${className}`}>
          {sortedData.map((item, idx) => (
            <Card
              key={idx}
              className={`${getCardSize()} hover:shadow-xl transition-shadow ${
                onItemClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onItemClick?.(item)}
            >
              <div className="space-y-3">
                {config.columns?.filter(col => col.visible).map((column) => (
                  <div key={column.id} className="flex items-center justify-between">
                    <span className="text-xs text-slate">{column.label}:</span>
                    <div className="font-medium text-charcoal">
                      {formatValue(item[column.field], column.format)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      );

    case 'kanban':
      // Group by status or another field
      const groupField = config.grouping?.field || 'status';
      const grouped = sortedData.reduce((acc, item) => {
        const key = item[groupField] || 'Ungrouped';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, T[]>);

      return (
        <div className={`flex gap-4 overflow-x-auto pb-4 ${className}`}>
          {Object.entries(grouped).map(([groupName, items]) => (
            <div key={groupName} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 rounded-lg p-3 mb-2">
                <h3 className="font-semibold text-charcoal">{groupName}</h3>
                <p className="text-xs text-slate">{items.length} items</p>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <Card
                    key={idx}
                    className={`${getCardSize()} hover:shadow-lg transition-shadow ${
                      onItemClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onItemClick?.(item)}
                  >
                    {config.columns?.filter(col => col.visible).slice(0, 4).map((column) => (
                      <div key={column.id} className="mb-2">
                        <p className="text-xs text-slate">{column.label}</p>
                        <div className="font-medium text-charcoal text-sm">
                          {formatValue(item[column.field], column.format)}
                        </div>
                      </div>
                    ))}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return <div>Invalid layout configuration</div>;
  }
}

// Column visibility toggle component
export function ColumnToggle({ columns, onToggle }: {
  columns: ColumnConfig[];
  onToggle: (columnId: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {columns.map((column) => (
        <button
          key={column.id}
          onClick={() => onToggle(column.id)}
          className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition-colors ${
            column.visible
              ? 'bg-gold text-white'
              : 'bg-gray-100 text-slate hover:bg-gray-200'
          }`}
        >
          {column.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {column.label}
        </button>
      ))}
    </div>
  );
}
