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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { CreateEventRequest } from '@/services/events';
import { format } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  name: z.string().min(5, {
    message: 'Name must be at least 5 characters.',
  }).max(100, {
    message: 'Name must not exceed 100 characters.',
  }),
  description: z.string().min(3, {
    message: 'Description must be at least 3 characters.',
  }).max(500, {
    message: 'Category must not exceed 50 characters.',
  }),
  startTime: z.string().refine(date => {
    const now = new Date();
    const selectedDate = new Date(date);
    return selectedDate > now;
  }, {
    message: 'Start time must be in the future.',
  }),
  status: z.enum(['upcoming', 'live', 'resolved']).optional(),
  currentYesPrice: z.coerce.number().optional(),
  image: z.any().optional(), // Accepts File or undefined
});

interface EventFormProps {
  initialData?: Partial<CreateEventRequest & { imageUrl?: string }>;
  onSubmit: (data: CreateEventRequest & { image?: File }) => Promise<void>;
  isEditing?: boolean;
}

const EventForm = ({ initialData, onSubmit, isEditing = false }: EventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      startTime: initialData?.startTime
        ? format(new Date(initialData.startTime), "yyyy-MM-dd'T'HH:mm")
        : '',
      status: initialData?.status,
      currentYesPrice: initialData?.currentYesPrice ?? undefined,
      image: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const eventData: CreateEventRequest & { image?: File } = {
        name: values.name,
        description: values.description,
        startTime: values.startTime,
        status: values.status,
        currentYesPrice: values.currentYesPrice,
        image: values.image instanceof File ? values.image : undefined,
      };

      await onSubmit(eventData);
      toast.success(`Event ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} event`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="
                  Will RCB win the IPL 2025 ?
                " {...field} />
              </FormControl>
              <FormDescription>
                The name should clearly state the prediction being made.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="
                  RCB is the IPL team with the most loyal fanbase.
                " {...field} />
              </FormControl>
              <FormDescription>
                The description of the event (eg. category, type of event).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormDescription>
                When trading will begin on this event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={field.disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The current status of the event (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentYesPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current YES Price</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="e.g. 0.45" {...field} />
              </FormControl>
              <FormDescription>
                The current YES price for this event (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Event Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...fieldProps}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    onChange(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setImagePreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Upload an image for this event (optional).
              </FormDescription>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded border"
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
