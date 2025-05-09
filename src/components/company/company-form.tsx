"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Company } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockQubeServices } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const companyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters."),
  logoUrl: z.string().url("Invalid URL format for logo.").optional().or(z.literal('')),
  location: z.string().min(2, "Location is required."),
  status: z.enum(["Active", "Inactive"]),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(5, "Phone number is too short.").optional().or(z.literal('')),
  street: z.string().min(3, "Street address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required.").optional().or(z.literal('')),
  zip: z.string().min(3, "Zip code is required.").optional().or(z.literal('')),
  country: z.string().min(2, "Country is required."),
  billingInfo: z.string().optional(),
  deliveryInfo: z.string().optional(),
  notes: z.string().optional(),
  subscribedServices: z.array(z.string()).optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company; // For editing existing company
  onSubmitSuccess?: () => void;
}

export default function CompanyForm({ company, onSubmitSuccess }: CompanyFormProps) {
  const { toast } = useToast();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name || "",
      logoUrl: company?.logoUrl || "",
      location: company?.location || "",
      status: company?.status || "Active",
      contactEmail: company?.contactInfo.email || "",
      contactPhone: company?.contactInfo.phone || "",
      street: company?.address.street || "",
      city: company?.address.city || "",
      state: company?.address.state || "",
      zip: company?.address.zip || "",
      country: company?.address.country || "",
      billingInfo: company?.billingInfo || "",
      deliveryInfo: company?.deliveryInfo || "",
      notes: company?.notes || "",
      subscribedServices: company?.subscribedServices || [],
    },
  });

  function onSubmit(data: CompanyFormValues) {
    console.log(data);
    // Here you would typically call an API
    toast({
      title: company ? "Company Updated" : "Company Created",
      description: `${data.name} details have been ${company ? 'updated' : 'saved'}.`,
      variant: "default", // 'default' uses primary color
    });
    if (onSubmitSuccess) onSubmitSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Company Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl><Input placeholder="Innovatech Solutions" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl>
                  <FormDescription>Direct URL to the company logo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (e.g. City, State)</FormLabel>
                    <FormControl><Input placeholder="San Francisco, CA" {...field} /></FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl><Input type="email" placeholder="contact@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl><Input placeholder="555-123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Address</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl><Input placeholder="CA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip/Postal Code</FormLabel>
                    <FormControl><Input placeholder="90210" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl><Input placeholder="USA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="billingInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Information</FormLabel>
                  <FormControl><Textarea placeholder="Billing terms, PO numbers, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Information</FormLabel>
                  <FormControl><Textarea placeholder="Preferred delivery methods, contacts, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes/Remarks</FormLabel>
                  <FormControl><Textarea placeholder="Any other relevant notes." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Service Subscriptions</CardTitle></CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="subscribedServices"
              render={() => (
                <FormItem>
                  {mockQubeServices.map((service) => (
                    <FormField
                      key={service.id}
                      control={form.control}
                      name="subscribedServices"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service.name)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), service.name])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== service.name
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {service.name}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full md:w-auto">
          {company ? "Save Changes" : "Create Company"}
        </Button>
      </form>
    </Form>
  );
}
