
// company-form.tsx
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
import { useRouter } from 'next/navigation';
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const companyFormSchema = z.object({
  legalName: z.string().min(2, "Company legal name must be at least 2 characters."),
  displayName: z.string().min(2, "Company display name must be at least 2 characters."),
  companyCode: z.string().min(1, "Company code is required."),
  companyUuid: z.string().uuid("Invalid UUID format.").optional().or(z.literal('')), // Assuming UUID might be system-generated initially
  logoUrl: z.string().url("Invalid URL format for logo.").optional().or(z.literal('')),
  status: z.enum(["Active", "Inactive"]),
  contactEmail: z.string().email("Invalid email address."),
  contactPhone: z.string().min(5, "Phone number is too short.").optional().or(z.literal('')),
  website: z.string().url("Invalid URL format for website.").optional().or(z.literal('')),
  street: z.string().min(3, "Street address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State/Province is required.").optional().or(z.literal('')),
  zip: z.string().min(3, "Zip/Postal code is required.").optional().or(z.literal('')),
  country: z.string().min(2, "Country is required."),
  billingInfo: z.string().optional(),
  deliveryInfo: z.string().optional(),
  notes: z.string().optional(),
  subscribedServices: z.array(z.string()).optional(),
  companyEmailDomains: z.string().optional().transform(val => val ? val.split(',').map(d => d.trim()).filter(d => d) : []),
  excludedDomains: z.string().optional().transform(val => val ? val.split(',').map(d => d.trim()).filter(d => d) : []),
  isExclusiveDomain: z.boolean().optional(),
  autoAddUsers: z.boolean().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormProps {
  company?: Company;
}

export default function CompanyForm({ company }: CompanyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      legalName: company?.legalName || "",
      displayName: company?.displayName || "",
      companyCode: company?.companyCode || "",
      companyUuid: company?.companyUuid || "",
      logoUrl: company?.logoUrl || "",
      status: company?.status || "Active",
      contactEmail: company?.contactInfo.email || "",
      contactPhone: company?.contactInfo.phone || "",
      website: company?.contactInfo.website || "",
      street: company?.address.street || "",
      city: company?.address.city || "",
      state: company?.address.state || "",
      zip: company?.address.zip || "",
      country: company?.address.country || "",
      billingInfo: company?.billingInfo || "",
      deliveryInfo: company?.deliveryInfo || "",
      notes: company?.notes || "",
      subscribedServices: company?.subscribedServices || ['Qube Account'], // Ensure Qube Account is default
      companyEmailDomains: company?.userOnboarding?.companyEmailDomains.join(', ') || "",
      excludedDomains: company?.userOnboarding?.excludedDomains.join(', ') || "",
      isExclusiveDomain: company?.userOnboarding?.isExclusiveDomain || false,
      autoAddUsers: company?.userOnboarding?.autoAddUsers || false,
    },
  });

  function onSubmit(data: CompanyFormValues) {
    // Ensure Qube Account is always in subscribedServices upon submission
    const finalSubscribedServices = Array.from(new Set([...(data.subscribedServices || []), 'Qube Account']));
    const submissionData = { ...data, subscribedServices: finalSubscribedServices };
    
    console.log(submissionData);
    toast({
      title: company ? "Company Updated" : "Company Created",
      description: `${submissionData.displayName} details have been ${company ? 'updated' : 'saved'}.`,
      variant: "default",
    });

    if (!company) {
      // Only redirect if it's a new company creation
      router.push('/companies');
    }
    // If it's an edit, we might want to stay on the page or redirect to the company profile.
    // For now, it stays on the edit page after saving.
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Company Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Legal Name</FormLabel>
                      <FormControl><Input placeholder="Innovatech Solutions Inc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Display Name</FormLabel>
                      <FormControl><Input placeholder="Innovatech" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Code</FormLabel>
                      <FormControl><Input placeholder="INN001" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyUuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company UUID</FormLabel>
                      <FormControl><Input placeholder="System Generated" {...field} disabled={!!company || !form.formState.isDirty} /></FormControl>
                      <FormDescription>Unique identifier, system-generated and cannot be modified.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
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
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <CardHeader><CardTitle>User Onboarding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="companyEmailDomains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Email Domains</FormLabel>
                    <FormControl><Input placeholder="example.com, corp.example.org" {...field} /></FormControl>
                    <FormDescription>Comma-separated list of email domains associated with this company.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excludedDomains"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excluded Domains</FormLabel>
                    <FormControl><Input placeholder="gmail.com, outlook.com" {...field} /></FormControl>
                    <FormDescription>Comma-separated list of email domains explicitly excluded from auto-association.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isExclusiveDomain"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        This company is the only user of the specified domains
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1.5 h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Other companies will not be able to use this email domain for their users.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autoAddUsers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        Automatically add all users with the specified email domain to this company
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1.5 h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Any user with this email domain signing up shall be added automatically to this company.</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
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
                    {mockQubeServices.map((service) => {
                      const isQubeAccountService = service.name === 'Qube Account';
                      return (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="subscribedServices"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={isQubeAccountService || field.value?.includes(service.name)}
                                    disabled={isQubeAccountService}
                                    onCheckedChange={(checked) => {
                                      if (isQubeAccountService) return; // Prevent unchecking Qube Account
                                      return checked
                                        ? field.onChange([...(field.value || []), service.name])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== service.name
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {service.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      );
                    })}
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
    </TooltipProvider>
  );
}
