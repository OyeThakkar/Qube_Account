"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PortalUser } from "@/types";
import { useToast } from "@/hooks/use-toast";

const portalUserRoles = ["Admin", "Company Manager", "Viewer"] as const;

const portalUserFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(portalUserRoles),
});

type PortalUserFormValues = z.infer<typeof portalUserFormSchema>;

interface PortalUserFormProps {
  user?: PortalUser;
  onClose: () => void; // To close the dialog
}

export default function PortalUserForm({ user, onClose }: PortalUserFormProps) {
  const { toast } = useToast();
  const form = useForm<PortalUserFormValues>({
    resolver: zodResolver(portalUserFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "Viewer",
    },
  });

  function onSubmit(data: PortalUserFormValues) {
    console.log(data);
    // Here you would typically call an API
    // For now, just show a toast and close
    toast({
      title: user ? "Portal User Updated" : "Portal User Created",
      description: `${data.name}'s details have been saved.`,
      variant: "default",
    });
    onClose(); // Close the dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID</FormLabel>
              <FormControl><Input type="email" placeholder="john.doe@qubecinema.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                <SelectContent>
                  {portalUserRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{user ? "Save Changes" : "Create User"}</Button>
        </div>
      </form>
    </Form>
  );
}
