
import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@/contexts/ThemeContext';

interface PricePoint {
  timestamp: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  height?: number;
}

const PriceChart = ({ data, height = 300 }: PriceChartProps) => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  useEffect(() => {
    // Transform data for the chart
    const formattedData = data.map(point => ({
      timestamp: new Date(point.timestamp).getTime(),
      price: point.price * 100, // Convert to percentage
      formattedTime: format(new Date(point.timestamp), 'MMM d, h:mm a')
    }));
    
    setChartData(formattedData);
  }, [data]);
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-2 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} border border-border`}>
          <p className="text-sm font-medium">{`Price: ${payload[0].value?.toFixed(1)}%`}</p>
          <p className="text-xs text-muted-foreground">{data.formattedTime}</p>
        </div>
      );
    }
    
    return null;
  };
  
  if (chartData.length < 2) {
    return (
      <div className="flex justify-center items-center h-[300px] bg-muted/30 rounded-md">
        <p className="text-muted-foreground">Not enough price data to display chart</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="priceColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(tick) => format(new Date(tick), 'h:mm a')} 
            type="number"
            domain={['dataMin', 'dataMax']}
            tick={{ fontSize: 12 }}
            stroke={isDarkMode ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'}
          />
          <YAxis 
            tickFormatter={(tick) => `${tick}%`}
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            stroke={isDarkMode ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'hsl(var(--border))' : 'hsl(var(--border))'} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="hsl(var(--accent))" 
            fillOpacity={1}
            fill="url(#priceColor)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
