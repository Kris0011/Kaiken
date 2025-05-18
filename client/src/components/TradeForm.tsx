
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreateTradeRequest } from '@/services/trades';
import { Event } from '@/services/events';
import HeartCoin from './HeartCoin';

const formSchema = z.object({
  prediction: z.enum(['yes', 'no']),
  amount: z.coerce.number().min(1, {
    message: 'Amount must be at least 1.',
  }).max(10000, {
    message: 'Amount cannot exceed 10,000.',
  }),
});

interface TradeFormProps {
  event: Event;
  onSubmit: (data: CreateTradeRequest) => Promise<void>;
}

const TradeForm = ({ event, onSubmit }: TradeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prediction: 'yes',
      amount: 10,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        eventId: event._id,
        prediction: values.prediction as 'yes' | 'no',
        amount: values.amount,
      });
      toast.success('Trade placed successfully!');
      form.reset({
        prediction: 'yes',
        amount: 10,
      });
    } catch (error: any) {
      console.error('Error submitting trade:', error);
      toast.error(error.response?.data?.message || 'Failed to place trade');
    } finally {
      setIsSubmitting(false);
    }
  };

  const prediction = form.watch('prediction');
  const amount = form.watch('amount');

  // Calculate potential payout
  const price = prediction === 'yes' ? event.currentYesPrice : 1 - event.currentYesPrice;
  const potentialPayout = (amount / price).toFixed(2);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Place a Trade</CardTitle>
        <CardDescription>Trade on whether this event will resolve as YES or NO.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prediction"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Your Prediction</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="text-market-yes font-semibold">YES</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="text-market-no font-semibold">NO</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount <HeartCoin amount={""} /></FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="10000" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you want to risk (min: $1, max: $10,000).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/50 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">Trade Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prediction:</span>
                  <span className={prediction === 'yes' ? 'text-market-yes font-medium' : 'text-market-no font-medium'}>
                    {prediction.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span>{(price * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span><HeartCoin amount={amount} /></span>
                </div>
                <div className="flex justify-between font-medium border-t border-border pt-2 mt-2">
                  <span>Potential Payout:</span>
                  <span className={Number(potentialPayout) > 0 ? 'text-green-500' : 'text-red-500'}>
                    <HeartCoin amount={potentialPayout} />
                  </span>
                  {/* <span>${isNaN(Number(potentialPayout)) ? '0.00' : potentialPayout}</span> */}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || event.status !== 'live'}
              className="w-full"
              variant={event.status !== 'live' ? "outline" : "default"}
            >
              {event.status !== 'live'
                ? 'Trading Not Available'
                : isSubmitting
                  ? 'Placing Trade...'
                  : `Place ${prediction.toUpperCase()} Trade`
              }
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Note: All trades are final and cannot be canceled once placed.
      </CardFooter>
    </Card>
  );
};

export default TradeForm;
